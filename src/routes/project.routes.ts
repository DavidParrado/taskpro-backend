import { Router } from "express";
import {
  getAllProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
} from "../controllers/project.controller";
import {
  createProjectValidation,
  projectExistsValidation,
  updateProjectValidation,
} from "../validators/project-validators";
import { validateErrors } from "../middlewares/validate-errors";

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

export default router;
