import express, { Application } from "express";
import { json } from "body-parser";
import morgan from "morgan";
import cors from "cors";

import userRoutes from "./routes/user.routes";
import projectRoutes from "./routes/project.routes";
import authRoutes from "./routes/auth.routes";
import taskRoutes from "./routes/task.routes";

const app: Application = express();

// Middleware
app.use(morgan("dev"));
app.use(cors());
app.use(json());

// Rutas habilitadas
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

export default app;
