import { Request, Response } from "express";
import { User } from "../models/User.js";
import { generateTokenPair, verifyRefreshToken } from "../utils/jwt.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/AppError.js";
import type { RegisterInput, LoginInput } from "../validators/schemas.js";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body as RegisterInput;

  const existing = await User.findOne({ email });
  if (existing) throw AppError.conflict("Email already registered");

  const user = await User.create({ name, email, password });

  const tokens = generateTokenPair({
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  });

  await User.findByIdAndUpdate(user._id, { refreshToken: tokens.refreshToken });

  res.cookie("refreshToken", tokens.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  sendSuccess(
    res,
    { user, accessToken: tokens.accessToken },
    "Account created successfully",
    201
  );
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body as LoginInput;

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    throw AppError.unauthorized("Invalid email or password");
  }

  const tokens = generateTokenPair({
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  });

  await User.findByIdAndUpdate(user._id, { refreshToken: tokens.refreshToken });

  res.cookie("refreshToken", tokens.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  const userWithoutPassword = await User.findById(user._id);
  sendSuccess(res, { user: userWithoutPassword, accessToken: tokens.accessToken }, "Login successful");
});

export const refreshToken = asyncHandler(async (req: Request, res: Response) => {
  const token = req.cookies?.refreshToken || req.body?.refreshToken;
  if (!token) throw AppError.unauthorized("Refresh token required");

  let payload;
  try {
    payload = verifyRefreshToken(token);
  } catch {
    throw AppError.unauthorized("Invalid refresh token");
  }

  const user = await User.findById(payload.userId).select("+refreshToken");
  if (!user || user.refreshToken !== token) {
    throw AppError.unauthorized("Refresh token reuse detected");
  }

  const tokens = generateTokenPair({
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  });

  await User.findByIdAndUpdate(user._id, { refreshToken: tokens.refreshToken });

  res.cookie("refreshToken", tokens.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  sendSuccess(res, { accessToken: tokens.accessToken }, "Token refreshed");
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (userId) await User.findByIdAndUpdate(userId, { refreshToken: null });

  res.clearCookie("refreshToken");
  sendSuccess(res, null, "Logged out successfully");
});

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.user?.userId);
  if (!user) throw AppError.notFound("User not found");
  sendSuccess(res, { user });
});