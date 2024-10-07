import { check } from "express-validator";
import { User } from "../entities/User";
import { ProjectStatus } from "../utils/enums";
import { Project } from "../entities/Project";

export const projectExistsValidation = check("id")
  .isUUID()
  .custom(async (id) => {
    const project = await Project.findOneBy({ id });
    if (!project) {
      throw new Error(`No existe un proyecto con ese id: ${id}`);
    }
  });

export const createProjectValidation = [
  check("name", "El nombre es requerido").not().isEmpty(),
  check("status")
    .isIn([ProjectStatus.IN_PROGRESS, ProjectStatus.COMPLETED])
    .withMessage(
      `El Status debe ser uno de los siguientes: '${ProjectStatus.IN_PROGRESS}', '${ProjectStatus.COMPLETED}'`
    ),
];

export const updateProjectValidation = [
  check("name", "El nombre es requerido").optional().not().isEmpty(),
  check("status", 'Status debe estar "en progreso" o "completado"')
    .optional() // status es opcional en una actualización
    .isIn([ProjectStatus.IN_PROGRESS, ProjectStatus.COMPLETED])
    .withMessage(
      `Status debe ser uno de los siguientes: ${ProjectStatus.IN_PROGRESS}, ${ProjectStatus.COMPLETED}`
    ),
  projectExistsValidation,
];
