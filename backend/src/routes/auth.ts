import { Router } from "express";
import { register, login, logout, refreshToken, getMe } from "../controllers/authController.js";
import { validate } from "../middleware/validate.js";
import { authenticate } from "../middleware/auth.js";
import { authRateLimiter } from "../middleware/rateLimiter.js";
import { registerSchema, loginSchema } from "../validators/schemas.js";

const router = Router();

router.post("/register", authRateLimiter, validate(registerSchema), register);
router.post("/login", authRateLimiter, validate(loginSchema), login);
router.post("/refresh", refreshToken);
router.post("/logout", authenticate, logout);
router.get("/me", authenticate, getMe);

export default router;