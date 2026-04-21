import { Router } from "express";
import { registerJobSeeker, registerRecruiter, login, getMe } from "../controllers/auth.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.post("/register/jobseeker", registerJobSeeker);
router.post("/register/recruiter", registerRecruiter);
router.post("/login", login);
router.get("/me", authMiddleware, getMe);

export default router;
