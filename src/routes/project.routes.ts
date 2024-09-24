import { Router } from "express";
import {
  getAllProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  getTasksByProject,
} from "../controllers/project.controller";
import {
  createProjectValidation,
  projectExistsValidation,
  updateProjectValidation,
} from "../validators/project-validators";
import { validateErrors } from "../middlewares/validate-errors";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

// Obtener proyectos
router.get("/", getAllProjects);

// Obtener proyecto por ID
router.get("/:id", projectExistsValidation, validateErrors, getProject);

// Crear un nuevo proyecto
router.post("/", createProjectValidation, validateErrors, createProject);

// Actualizar un proyecto por ID
router.patch("/:id", updateProjectValidation, validateErrors, updateProject);

// Eliminar un proyecto por ID
router.delete("/:id", projectExistsValidation, validateErrors, deleteProject);

// Obtener todas las tareas de un proyecto
router.get("/:id/tasks", projectExistsValidation, authMiddleware, validateErrors, getTasksByProject);

export default router;
