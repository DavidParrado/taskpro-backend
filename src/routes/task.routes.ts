import { Router } from "express";
import {
  createTask,
  updateTask,
  deleteTask,
  getTask,
  generateRandomTasks,
} from "../controllers/task.controller";
import { authMiddleware } from "../middlewares/authMiddleware";
import {
  validateCreateTask,
  validateGenerateRandomTasks,
  validateUpdateTask,
} from "../validators/task-validators";
import { validateErrors } from "../middlewares/validate-errors";
import { validateTaskExists } from "../validators/task-validators";

const router = Router();

// Obtener una tarea por ID
router.get("/:id", validateTaskExists, authMiddleware, validateErrors, getTask);
// Crear una nueva tarea
router.post("/", validateCreateTask, validateErrors, createTask);

// Actualizar una tarea
router.patch(
  "/:id",
  validateTaskExists,
  validateUpdateTask,
  validateErrors,
  updateTask
);

// Actualizar status de una tarea
router.patch("/:id/status", validateUpdateTask, validateErrors, updateTask);

// Eliminar una tarea
router.delete("/:id", validateTaskExists, validateErrors, deleteTask);

// Generar tareas random
router.post(
  "/generate",
  validateGenerateRandomTasks,
  validateErrors,
  generateRandomTasks
);

export default router;
