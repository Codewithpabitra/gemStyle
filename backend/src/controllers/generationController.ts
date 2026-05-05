import { Request, Response } from "express";
import { Generation } from "../models/Generation.js";
import { User } from "../models/User.js";
import { generateStyledImage } from "../services/geminiService.js";
import {
  isCloudinaryConfigured,
  uploadToCloudinary,
  uploadBase64ToCloudinary,
} from "../services/cloudinaryService.js";
import { getStyleById, getAllStyles } from "../utils/artStyles.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/AppError.js";
import type { GenerateImageInput } from "../validators/schemas.js";

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
    throw new AppError(
      `Insufficient credits. This style requires ${style.creditsRequired} credit(s). You have ${user.credits}.`,
      402
    );
  }

  // ── Step 1: Upload original image (optional, best-effort) ──────
  let originalImageUrl = "";
  if (isCloudinaryConfigured()) {
    const uploaded = await uploadToCloudinary(file.buffer, "originals");
    if (uploaded) {
      originalImageUrl = uploaded;
    } else {
      console.warn("[Generate] Cloudinary upload of original failed — continuing without it");
    }
  }

  // ── Step 2: Create pending generation record ───────────────────
  const generation = await Generation.create({
    userId,
    styleId,
    styleName: style.name,
    originalImageUrl,
    prompt: style.prompt,
    creditsUsed: style.creditsRequired,
    status: "pending",
  });

  // ── Step 3: Deduct credits optimistically ─────────────────────
  await User.findByIdAndUpdate(userId, { $inc: { credits: -style.creditsRequired } });

  try {
    // ── Step 4: Call Gemini ──────────────────────────────────────
    console.log(`[Generate] Calling Gemini for style "${style.name}"...`);
    const result = await generateStyledImage(
      geminiApiKey,
      file.buffer,
      file.mimetype,
      style.prompt
    );
    console.log(`[Generate] Gemini returned image (${result.mimeType})`);

    // ── Step 5: Store generated image ────────────────────────────
    let generatedImageUrl: string;

    if (isCloudinaryConfigured()) {
      const cloudUrl = await uploadBase64ToCloudinary(
        result.imageBase64,
        result.mimeType,
        "generated"
      );

      if (cloudUrl) {
        generatedImageUrl = cloudUrl;
        console.log("[Generate] Generated image uploaded to Cloudinary ✅");
      } else {
        // Cloudinary failed — use base64 inline (works fine, just larger response)
        console.warn("[Generate] Cloudinary upload failed — using inline base64 fallback");
        generatedImageUrl = `data:${result.mimeType};base64,${result.imageBase64}`;
      }
    } else {
      // Cloudinary not configured — use inline base64
      generatedImageUrl = `data:${result.mimeType};base64,${result.imageBase64}`;
      console.log("[Generate] Cloudinary not configured — using inline base64");
    }

    // ── Step 6: Mark generation as completed ─────────────────────
    await Generation.findByIdAndUpdate(generation._id, {
      status: "completed",
      generatedImageUrl,
    });

    const completed = await Generation.findById(generation._id);
    sendSuccess(res, { generation: completed }, "Image generated successfully", 201);

  } catch (error) {
    // ── On any error: refund credits & mark as failed ─────────────
    console.error("[Generate] Error — refunding credits and marking failed:", error);

    await User.findByIdAndUpdate(userId, {
      $inc: { credits: style.creditsRequired },
    });

    await Generation.findByIdAndUpdate(generation._id, {
      status: "failed",
      errorMessage: error instanceof Error ? error.message : "Unknown error",
    });

    throw error; // re-throw so errorHandler sends the response
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
