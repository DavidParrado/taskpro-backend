import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { User } from "./entities/User";
import { Project } from "./entities/Project";
import { Task } from "./entities/Task";
import { Team } from "./entities/Team";
import { Collaborator } from "./entities/Collaborator";
import { Tag } from "./entities/Tag";
import { Assignment } from "./entities/Assignment";
import { Topic } from "./entities/Topic";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "cockroachdb",
  url: process.env.DB_URL || "",
  timeTravelQueries: false,
  entities: [User, Project, Task, Team, Collaborator, Tag, Assignment, Topic],
  logging: true,
  synchronize: true,
  ssl: true,
});

// export const AppDataSource = new DataSource({
//   type: "postgres",
//   host: process.env.DB_HOST,
//   port: +(process.env.DB_PORT || 5432),
//   username: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   entities: [User, Project, Task, Team, Collaborator, Tag, Assignment, Topic],
//   logging: true,
//   synchronize: true,
// });
