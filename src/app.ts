import express, { Application } from "express";
import { json } from "body-parser";
import morgan from "morgan";
import cors from "cors";

import userRoutes from "./routes/user.routes";
import projectRoutes from "./routes/project.routes";
import authRoutes from "./routes/auth.routes";
import taskRoutes from "./routes/task.routes";
import collaboratorRoutes from "./routes/collaborator.routes";
import tagRoutes from "./routes/tag.routes";
import assignmentRoutes from "./routes/assignment.routes";
import topicRoutes from "./routes/topic.routes";
import { authMiddleware } from "./middlewares/authMiddleware";

const app: Application = express();

// Middleware
app.use(morgan("dev"));
app.use(
  cors({
    origin: "*", // Change for production
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(json());

// Rutas habilitadas
app.use("/api/users", authMiddleware, userRoutes);
app.use("/api/projects", authMiddleware, projectRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/tasks", authMiddleware, taskRoutes);
app.use("/api/collaborators", authMiddleware, collaboratorRoutes);
app.use("/api/tags", authMiddleware, tagRoutes);
app.use("/api/assignments", authMiddleware, assignmentRoutes);
app.use("/api/topics", topicRoutes);

export default app;
