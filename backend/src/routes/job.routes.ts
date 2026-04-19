import { Router } from "express";
import { createJobController } from "../controllers/job.controller";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.post("/", asyncHandler(createJobController));

export default router;
