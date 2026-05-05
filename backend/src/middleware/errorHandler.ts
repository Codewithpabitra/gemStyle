import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError.js";
import { env } from "../config/env.js";

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Always log the full error in development
  if (env.NODE_ENV !== "production") {
    console.error("─── ERROR ───────────────────────────────────");
    console.error("Name   :", err.name);
    console.error("Message:", err.message);
    if (err.stack) console.error("Stack  :", err.stack.split("\n").slice(0, 6).join("\n"));
    console.error("─────────────────────────────────────────────");
  }

  // Our own operational errors — always return their exact message
  if (err instanceof AppError && err.isOperational) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(err.errors && { errors: err.errors }),
    });
    return;
  }

  // Mongoose duplicate key
  if (
    (err as NodeJS.ErrnoException).name === "MongoServerError" &&
    (err as unknown as { code: number }).code === 11000
  ) {
    const field = Object.keys(
      (err as unknown as { keyValue: Record<string, unknown> }).keyValue || {}
    )[0];
    res.status(409).json({ success: false, message: `${field} already exists` });
    return;
  }

  // JWT errors
  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    res.status(401).json({ success: false, message: "Invalid or expired token" });
    return;
  }

  // Multer file size error
  if (err.name === "MulterError") {
    const multerErr = err as Error & { code?: string };
    if (multerErr.code === "LIMIT_FILE_SIZE") {
      res.status(400).json({ success: false, message: "File too large. Maximum size is 10MB." });
      return;
    }
    res.status(400).json({ success: false, message: err.message });
    return;
  }

  // Unknown / unhandled errors
  console.error("Unhandled error:", err);

  res.status(500).json({
    success: false,
    message:
      env.NODE_ENV === "production"
        ? "Internal server error"
        : `Internal error: ${err.message}`,
    ...(env.NODE_ENV !== "production" && { stack: err.stack }),
  });
}
