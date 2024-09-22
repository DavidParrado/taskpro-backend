import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

// Middleware para manejar errores de validación
export const validateErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export const validateBody = (req: Request, res: Response, next: NextFunction) => {
  // Verificamos si el body está vacío
  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({
      message: "Debe proporcionar al menos un campo para actualizar",
    });
  }
  next();
}