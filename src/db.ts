import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { User } from "./entities/User";
import { Project } from "./entities/Project";
import { Task } from "./entities/Task";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: +(process.env.DB_PORT || 5432),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User, Project, Task],
  logging: true,
  synchronize: true,
});
