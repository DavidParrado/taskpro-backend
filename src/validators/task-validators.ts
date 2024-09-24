import { check } from "express-validator";
import { Project } from "../entities/Project";
import { User } from "../entities/User";
import { Task } from "../entities/Task";

export const validateCreateTask = [
  check("title").notEmpty().withMessage("Titulo es requerido"),
  check("projectId")
    .notEmpty()
    .withMessage("ProjectId es requerido")
    .custom(async (projectId) => {
      const project = await Project.findOneBy({ id: projectId });
      if (!project) {
        throw new Error("Project does not exist");
      }
    }),
  check("assigneeId")
    .optional()
    .custom(async (assigneeId) => {
      const user = await User.findOneBy({ id: assigneeId });
      if (!user) {
        throw new Error("Asignatario no existe");
      }
    }),
];

export const validateUpdateTask = [
  check("status")
    .optional()
    .isIn(["todo", "in-progress", "completed"])
    .withMessage("Estado invalido"),
  check("assigneeId")
    .optional()
    .custom(async (assigneeId) => {
      const user = await User.findOneBy({ id: assigneeId });
      if (!user) {
        throw new Error("Asignatario no existe");
      }
    }),
];

export const validateTaskExists = check("id")
  .isUUID()
  .custom(async (id) => {
    const task = await Task.findOneBy({ id });
    if (!task) {
      throw new Error("Tarea no existe");
    }
  });
