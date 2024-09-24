import { Router } from "express";
import {
  createTask,
  updateTask,
  deleteTask,
  getTask,
} from "../controllers/task.controller";
import { authMiddleware } from "../middlewares/authMiddleware";
import {
  validateCreateTask,
  validateUpdateTask,
} from "../validators/task-validators";
import { validateErrors } from "../middlewares/validate-errors";
import { validateTaskExists } from "../validators/task-validators";

const router = Router();

// Obtener una tarea por ID
router.get("/:id", validateTaskExists, authMiddleware, validateErrors, getTask);
// Crear una nueva tarea
router.post(
  "/",
  authMiddleware,
  validateCreateTask,
  validateErrors,
  createTask
);

// Actualizar una tarea
router.patch(
  "/:id",
  authMiddleware,
  validateTaskExists,
  validateUpdateTask,
  validateErrors,
  updateTask
);

// Eliminar una tarea
router.delete(
  "/:id",
  validateTaskExists,
  validateErrors,
  authMiddleware,
  deleteTask
);

export default router;
