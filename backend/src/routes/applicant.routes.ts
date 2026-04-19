import { Router } from "express";
import { createApplicantController } from "../controllers/applicant.controller";
import { uploadApplicantsFile } from "../middleware/upload.middleware";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.post("/", uploadApplicantsFile, asyncHandler(createApplicantController));

export default router;
