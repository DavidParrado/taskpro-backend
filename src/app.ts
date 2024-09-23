import express, { Application } from "express";
import { json } from "body-parser";
import morgan from "morgan";
import cors from "cors";
import userRoutes from "./routes/user.routes";
import projectRoutes from "./routes/project.routes";

const app: Application = express();

// Middleware
app.use(morgan("dev"));
app.use(cors());
app.use(json());

// Rutas del servidor
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);

export default app;
