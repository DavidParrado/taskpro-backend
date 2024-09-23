import { Request, Response } from "express";
import { User } from "../entities/User";
import bcrypt from "bcryptjs";

// Obtener todos los usuarios
export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const users = await User.find();
  return res.json(users);
};

// Obtener un usuario por ID
export const getUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params;
  const user = await User.findOneBy({ id });
  return res.json(user);
};

// Crear un nuevo usuario
export const createUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { name, email, password } = req.body;
  // Encriptación de la contraseña
  const hashedPassword = bcrypt.hashSync(password, 10);

  const newUser = User.create({ name, email, password: hashedPassword });
  await newUser.save();
  return res.json(newUser);
};

// Actualizar un usuario por ID
export const updateUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params;
  const { email, password, role, ...rest } = req.body;

  if (password) {
    const hashedPassword = bcrypt.hashSync(password, 10);
    rest.password = hashedPassword;
  }
  try {
    await User.update(id, rest);
    const updatedUser = await User.findOneBy({ id });
    return res.json(updatedUser);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Upss, algo salió mal"});
  }
};

// Eliminar a un usuario por ID
export const deleteUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params;
  const deletedUser = await User.delete(id);
  return res.json(deletedUser);
};
