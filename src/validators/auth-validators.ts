import { body } from "express-validator";
import { existingEmail, validPassword } from "./custom-validators";

export const validateRegistration = [
  body("name").notEmpty().withMessage("El nombre es obligatorio"),
  body("email")
    .isEmail()
    .withMessage("Debe ser un correo válido")
    .custom(existingEmail), // Validador para comprobar si el correo existe
  body("password").custom(validPassword), // Validador personalizado para la contraseña
];

export const validateLogin = [
  body("email").isEmail().withMessage("Debe ser un correo válido"),
  body("password").notEmpty().withMessage("Contraseña es requerida"),
];
