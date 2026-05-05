import { Request, Response } from "express";
import { User } from "../models/User.js";
import { Generation } from "../models/Generation.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/AppError.js";
import type { UpdateProfileInput } from "../validators/schemas.js";

export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const { name, geminiApiKey } = req.body as UpdateProfileInput;

  const updated = await User.findByIdAndUpdate(
    userId,
    { ...(name && { name }), ...(geminiApiKey !== undefined && { geminiApiKey }) },
    { new: true, runValidators: true }
  );

  if (!updated) throw AppError.notFound("User not found");
  sendSuccess(res, { user: updated }, "Profile updated");
});

export const getDashboardStats = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;

  const [user, totalGenerations, recentGenerations] = await Promise.all([
    User.findById(userId),
    Generation.countDocuments({ userId, status: "completed" }),
    Generation.find({ userId, status: "completed" })
      .sort({ createdAt: -1 })
      .limit(6),
  ]);

  if (!user) throw AppError.notFound("User not found");

  sendSuccess(res, {
    user,
    stats: { totalGenerations, credits: user.credits },
    recentGenerations,
  });
});