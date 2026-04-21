import { Router } from "express";
import { applyToJob, getMyApplications, getJobApplications, screenApplicants, selectCandidate } from "../controllers/application.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { roleMiddleware } from "../middleware/role.middleware";

const router = Router();

// JobSeeker routes
router.post("/", authMiddleware, roleMiddleware(["jobseeker"]), applyToJob);
router.get("/me", authMiddleware, roleMiddleware(["jobseeker"]), getMyApplications);

// Recruiter routes
router.get("/job/:jobId", authMiddleware, roleMiddleware(["recruiter"]), getJobApplications);
router.post("/screen/:jobId", authMiddleware, roleMiddleware(["recruiter"]), screenApplicants);
router.patch("/:id/select", authMiddleware, roleMiddleware(["recruiter"]), selectCandidate);

export default router;
