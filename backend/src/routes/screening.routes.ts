import { Router } from "express";
import {
  getResultsController,
  screenApplicantsController
} from "../controllers/screening.controller";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.post("/screen/:jobId", asyncHandler(screenApplicantsController));
router.get("/results/:jobId", asyncHandler(getResultsController));

export default router;
