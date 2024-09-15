import "reflect-metadata";
import dotenv from "dotenv";
import app from "./app";
import { AppDataSource } from "./db";

dotenv.config();

const PORT = process.env.PORT || 3000;

async function main() {
  try {
    await AppDataSource.initialize();
    console.log("Database connected");
    app.listen(PORT);
    console.log("Server is listening on port: ", PORT);
  } catch (error) {
    console.log(error);
  }
}

main();
