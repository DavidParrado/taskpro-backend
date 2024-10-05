import { Request, Response } from "express";
import { User } from "../entities/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import dotenv from "dotenv";

dotenv.config();

export const register = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { name, email, password } = req.body;

  const hashedPassword = bcrypt.hashSync(password, 10);
  const user = User.create({
    name,
    email,
    password: hashedPassword,
  });
  await user.save();

  const { password: pass, ...userFiltered } = user;
  const token = jwt.sign(
    userFiltered,
    process.env.JWT_SECRET || "",
    { expiresIn: "24h" }
  );

  return res.json({ user, token });
};

export const login = async (req: Request, res: Response): Promise<Response> => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });

  console.log({password: user?.password});
  console.log(bcrypt.compareSync(password, user!.password));
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const { password: pass, ...userFiltered } = user;
  const token = jwt.sign(userFiltered, process.env.JWT_SECRET || "", {
    expiresIn: "24h",
  });
  return res.json({ user: userFiltered, token });
};
