import rateLimit from "express-rate-limit";
import { env } from "../config/env.js";
import { sendError } from "../utils/apiResponse.js";

export const globalRateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    sendError(res, "Too many requests, please try again later.", 429);
  },
});

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    sendError(res, "Too many auth attempts, please wait 15 minutes.", 429);
  },
});

export const generateRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: env.GENERATE_RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.user?.userId ?? req.ip ?? "unknown",
  handler: (_req, res) => {
    sendError(res, `Generation limit reached. You can generate up to ${env.GENERATE_RATE_LIMIT_MAX} images per hour.`, 429);
  },
});