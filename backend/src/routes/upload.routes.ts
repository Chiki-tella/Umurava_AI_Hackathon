import { Router } from "express";
import { uploadCV, uploadCVFile } from "../controllers/upload.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

// Upload CV file
router.post("/cv", authMiddleware, uploadCV.single('cv'), uploadCVFile);

export default router;
