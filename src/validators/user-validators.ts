import { body, param } from "express-validator";
import {
  existingEmail,
  existingUser,
  validPassword,
} from "./custom-validators";

// Validaciones para la creación de un usuario
export const validateUser = [
  body("email")
    .isEmail()
    .withMessage("Debe ser un correo válido")
    .custom(existingEmail), // Validador para comprobar si el correo existe
  body("name").notEmpty().withMessage("El nombre es obligatorio"),
  body("password")
    .notEmpty()
    .withMessage("La contraseña es obligatoria")
    .custom(validPassword), // Validador personalizado para la contraseña
];

// Validaciones para la actualización de un usuario (con el id)
export const validateUserUpdate = [
  param("id").isUUID().custom(existingUser), // Validador personalizado para comprobar si el ID del usuario existe
  body("email")
    .optional()
    .isEmail()
    .withMessage("Debe ser un correo válido")
    .custom(existingEmail), // Verifica si el correo ya existe (opcional)
  body("name")
    .optional()
    .notEmpty()
    .withMessage("El nombre no puede estar vacío"),
  body("password").optional().custom(validPassword), // Validador personalizado para la contraseña
];

export const validateUserExists = param("id").isUUID().custom(existingUser);
