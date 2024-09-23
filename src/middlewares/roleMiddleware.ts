import { Request, Response, NextFunction } from "express";
import { User } from "../entities/User";

export const roleMiddleware = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Asegúrate de que el usuario esté autenticado y que exista el campo `roles` en el usuario
    const user = req.user as User;

    if (!user) {
      return res.status(401).json({ message: "No autorizado" });
    }

    // Verifica si el usuario tiene al menos uno de los roles permitidos
    const hasRole = user.roles.some((role) => allowedRoles.includes(role));

    if (!hasRole) {
      return res.status(403).json({ message: "Permisos insuficientes" });
    }

    next();
  };
};
