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
  console.log({ decoded });
  if (!decoded) {
    return res.status(401).json({ message: "No autorizado" });
  }

  if (decoded.exp && Date.now() >= decoded.exp * 1000) {
    return res.status(401).json({ message: "Token expirado" });
  }

  try {
    const { user } = jwt.verify(
      token,
      process.env.JWT_SECRET || ""
    ) as JwtPayload;

    const userFound = await User.findOneBy({ id: user.id });
    if (!userFound) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }

    req.user = userFound;

    next();
  } catch (error) {
    return res.status(401).json({ message: "No autorizado" });
  }
};
