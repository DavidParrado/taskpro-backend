import express, { Application } from "express";
import { json } from "body-parser";
import morgan from "morgan";
import cors from "cors";

const app: Application = express();

// Middleware
app.use(morgan("dev"));
app.use(cors());
app.use(json());


export default app;
