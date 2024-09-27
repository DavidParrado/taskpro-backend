import { body } from "express-validator";

export const createTeamValidation = [
  body("name").notEmpty().withMessage("Nombre de equipo es requerido"),
  body("leaderId").notEmpty().withMessage("Leader ID es requerido"),
  body("projectId").notEmpty().withMessage("Project ID es requerido"),
  body("membersIds")
    .isArray()
    .withMessage("Miembros deberia ser un arreglo de usuariosID"),
];

export const teamUpdateValidation = [
  body("name").optional().notEmpty().withMessage("Nombre de equipo no puede estar vacio"),
  body("leaderId")
    .optional()
    .notEmpty()
    .withMessage("Leader ID no puede estar vacio"),
  body("membersIds")
    .optional()
    .isArray()
    .withMessage("Miembros debe ser un arreglo de usuarios ids"),
];
