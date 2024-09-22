import express, { Application } from "express";
import { json } from "body-parser";
import morgan from "morgan";
import cors from "cors";
import userRoutes from './routes/user.routes';

const app: Application = express();

// Middleware
app.use(morgan("dev"));
app.use(cors());
app.use(json());

app.use("/api", userRoutes);


export default app;
