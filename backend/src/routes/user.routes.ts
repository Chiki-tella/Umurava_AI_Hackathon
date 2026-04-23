import { Router } from "express";
import { updateProfile } from "../controllers/user.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

// Update user profile (skills, interested roles, etc.)
router.patch("/profile", authMiddleware, updateProfile);

export default router;
