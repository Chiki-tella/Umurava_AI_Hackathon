import cors from "cors";
import dotenv from "dotenv";
import express from "express";

import authRoutes from "./routes/auth.routes";
import jobRoutes from "./routes/job.routes";
import applicationRoutes from "./routes/application.routes";
import notificationRoutes from "./routes/notification.routes";
import userRoutes from "./routes/user.routes";
import uploadRoutes from "./routes/upload.routes";

import { globalErrorHandler, notFoundHandler } from "./middleware/error.middleware";

import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger.json";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/users", userRoutes);
app.use("/api/uploads", uploadRoutes);

app.use(notFoundHandler);
app.use(globalErrorHandler);

export default app;
