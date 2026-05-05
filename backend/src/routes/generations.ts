import { Router } from "express";
import {
  generateImage,
  getMyGenerations,
  deleteGeneration,
  getStyles,
} from "../controllers/generationController.js";
import { authenticate } from "../middleware/auth.js";
import { generateRateLimiter } from "../middleware/rateLimiter.js";
import { validate } from "../middleware/validate.js";
import { upload } from "../middleware/upload.js";
import { generateImageSchema, paginationSchema } from "../validators/schemas.js";

const router = Router();

router.get("/styles", getStyles);

router.use(authenticate);

router.post(
  "/generate",
  generateRateLimiter,
  upload.single("image"),
  validate(generateImageSchema),
  generateImage
);

router.get("/", validate(paginationSchema, "query"), getMyGenerations);
router.delete("/:id", deleteGeneration);

export default router;