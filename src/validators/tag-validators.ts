// Tags validators such as unique name
import { body } from "express-validator";
import { Tag } from "../entities/Tag";

export const validateTag = [
  body("name")
    .isString()
    .withMessage("El nombre debe ser un texto")
    .notEmpty()
    .withMessage("El nombre es requerido")
    .custom(async (name) => {
      const tag = await Tag.findOneBy({ name });
      if (tag && tag.name === name) {
        throw new Error(`Ya existe una etiqueta con el nombre: ${name}`);
      }
    }),
];

// Tag validation for assigning tags to a task
export const validateAssignTagsToTask = [
  body("taskId").isUUID().withMessage("El ID de la tarea es requerido"),
  // tagIds debe ser un arreglo de UUIDs
  body("tagIds")
    .isArray()
    .withMessage("Las etiquetas deben ser un arreglo de IDs")
    .custom((tagIds) => {
      if (tagIds && tagIds.some((id: any) => !id.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/))) {
        throw new Error("Los IDs de las etiquetas deben ser UUIDs");
      }
      return true;
    }),
];
