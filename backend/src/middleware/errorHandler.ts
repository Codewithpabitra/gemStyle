import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError.js";
import { env } from "../config/env.js";

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof AppError && err.isOperational) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(err.errors && { errors: err.errors }),
    });
    return;
  }

  // Mongoose duplicate key
  if ((err as NodeJS.ErrnoException).name === "MongoServerError" && (err as unknown as { code: number }).code === 11000) {
    const field = Object.keys((err as unknown as { keyValue: Record<string, unknown> }).keyValue || {})[0];
    res.status(409).json({ success: false, message: `${field} already exists` });
    return;
  }

  // JWT errors
  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    res.status(401).json({ success: false, message: "Invalid or expired token" });
    return;
  }

  console.error("Unhandled error:", err);

  res.status(500).json({
    success: false,
    message: env.NODE_ENV === "production" ? "Internal server error" : err.message,
    ...(env.NODE_ENV !== "production" && { stack: err.stack }),
  });
}