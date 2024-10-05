// src/auth/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JwtPayload } from "../types/jwtPayload";
import { User } from "../entities/User";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "No autorizado" });
  }

  const decoded = jwt.decode(token) as JwtPayload;
  console.log(decoded);
  if (!decoded) {
    return res.status(401).json({ message: "No autorizado" });
  }

  if(decoded.exp && Date.now() >= decoded.exp * 1000) {
    return res.status(401).json({ message: "Token expirado" });
  }

  try {
    const { id } = jwt.verify(
      token,
      process.env.JWT_SECRET || ""
    ) as JwtPayload;

    const user = await User.findOneBy({ id });
    if (!user) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }

    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({ message: "No autorizado" });
  }
};
