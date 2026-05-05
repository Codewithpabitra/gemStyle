import { Router } from "express";
import { updateProfile, getDashboardStats } from "../controllers/userController.js";
import { authenticate } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { updateProfileSchema } from "../validators/schemas.js";

const router = Router();

router.use(authenticate);

router.get("/dashboard", getDashboardStats);
router.patch("/profile", validate(updateProfileSchema), updateProfile);

export default router;