import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import applicantRoutes from "./routes/applicant.routes";
import jobRoutes from "./routes/job.routes";
import screeningRoutes from "./routes/screening.routes";
import { globalErrorHandler, notFoundHandler } from "./middleware/error.middleware";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/jobs", jobRoutes);
app.use("/api/applicants", applicantRoutes);
app.use("/api", screeningRoutes);

app.use(notFoundHandler);
app.use(globalErrorHandler);

export default app;
