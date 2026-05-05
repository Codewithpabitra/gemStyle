import { Request, Response } from "express";
import { Generation } from "../models/Generation.js";
import { User } from "../models/User.js";
import { generateStyledImage } from "../services/geminiService.js";
import { uploadToCloudinary, uploadBase64ToCloudinary } from "../services/cloudinaryService.js";
import { getStyleById, getAllStyles } from "../utils/artStyles.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/AppError.js";
import type { GenerateImageInput } from "../validators/schemas.js";
import { env } from "../config/env.js";

export const getStyles = asyncHandler(async (_req: Request, res: Response) => {
  const styles = getAllStyles();
  sendSuccess(res, { styles });
});

export const generateImage = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const { styleId, geminiApiKey } = req.body as GenerateImageInput;
  const file = req.file;

  if (!file) throw new AppError("Image file is required", 400);

  const style = getStyleById(styleId);
  if (!style) throw new AppError("Invalid style ID", 400);

  const user = await User.findById(userId);
  if (!user) throw AppError.notFound("User not found");

  if (user.credits < style.creditsRequired) {
    throw new AppError(`Insufficient credits. This style requires ${style.creditsRequired} credit(s).`, 402);
  }

  // Upload original to Cloudinary (if configured), else use base64
  let originalImageUrl = "";
  if (env.CLOUDINARY_CLOUD_NAME) {
    originalImageUrl = await uploadToCloudinary(file.buffer, "originals");
  }

  // Create pending generation record
  const generation = await Generation.create({
    userId,
    styleId,
    styleName: style.name,
    originalImageUrl,
    prompt: style.prompt,
    creditsUsed: style.creditsRequired,
    status: "pending",
  });

  // Deduct credits optimistically
  await User.findByIdAndUpdate(userId, { $inc: { credits: -style.creditsRequired } });

  try {
    // Generate image with Gemini
    const result = await generateStyledImage(
      geminiApiKey,
      file.buffer,
      file.mimetype,
      style.prompt
    );

    // Upload generated image
    let generatedImageUrl = "";
    if (env.CLOUDINARY_CLOUD_NAME) {
      generatedImageUrl = await uploadBase64ToCloudinary(
        result.imageBase64,
        result.mimeType,
        "generated"
      );
    } else {
      generatedImageUrl = `data:${result.mimeType};base64,${result.imageBase64}`;
    }

    // Update generation record
    await Generation.findByIdAndUpdate(generation._id, {
      status: "completed",
      generatedImageUrl,
    });

    const completed = await Generation.findById(generation._id);
    sendSuccess(res, { generation: completed }, "Image generated successfully", 201);
  } catch (error) {
    // Refund credits on failure
    await User.findByIdAndUpdate(userId, { $inc: { credits: style.creditsRequired } });
    await Generation.findByIdAndUpdate(generation._id, {
      status: "failed",
      errorMessage: error instanceof Error ? error.message : "Unknown error",
    });
    throw error;
  }
});

export const getMyGenerations = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 12;
  const skip = (page - 1) * limit;

  const [generations, total] = await Promise.all([
    Generation.find({ userId, status: "completed" })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Generation.countDocuments({ userId, status: "completed" }),
  ]);

  sendSuccess(res, { generations }, "Generations fetched", 200, {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  });
});

export const deleteGeneration = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user!.userId;

  const generation = await Generation.findOne({ _id: id, userId });
  if (!generation) throw AppError.notFound("Generation not found");

  await generation.deleteOne();
  sendSuccess(res, null, "Generation deleted");
});