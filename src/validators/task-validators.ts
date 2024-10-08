import { check } from "express-validator";
import { Project } from "../entities/Project";
import { User } from "../entities/User";
import { Task, TaskStatus } from "../entities/Task";

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
  check("status")
    .optional()
    .isIn(Object.values(TaskStatus))
    .withMessage("Estado invalido"),
  check("dueDate").isISO8601().withMessage("Fecha invalida").optional(),
  check("tagIds")
    .optional()
    .isArray()
    .withMessage("Las etiquetas deben ser un arreglo de IDs")
    .custom((tagIds) => {
      if (
        tagIds &&
        tagIds.some(
          (id: any) =>
            !id.match(
              /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/
            )
        )
      ) {
        throw new Error("Los IDs de las etiquetas deben ser UUIDs");
      }
      return true;
    }),
];

export const validateUpdateTask = [
  check("status")
    .optional()
    .isIn(Object.values(TaskStatus))
    .withMessage("Estado invalido"),
  check("assigneeId")
    .optional()
    .custom(async (assigneeId) => {
      if (!assigneeId) return;
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

export const validateGenerateRandomTasks = [
  check("quantity").isInt({ min: 1, max: 5 }).withMessage("Cantidad invalida"),
  check("projectId").isUUID().withMessage("ProjectId debe ser un UUID"),
  check("topicId").isUUID().withMessage("TopicId debe ser un UUID"),
];
