import { Router } from "express";
import { createJob, getRecruiterJobs, getJobs, getJobById, getRecommendedJobs } from "../controllers/job.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { roleMiddleware } from "../middleware/role.middleware";

const router = Router();

// Recruiter routes
router.post("/", authMiddleware, roleMiddleware(["recruiter"]), createJob);
router.get("/recruiter", authMiddleware, roleMiddleware(["recruiter"]), getRecruiterJobs);

// JobSeeker routes
router.get("/recommended", authMiddleware, roleMiddleware(["jobseeker"]), getRecommendedJobs);

// Public / General routes
router.get("/", getJobs);
router.get("/:id", getJobById);

export default router;
