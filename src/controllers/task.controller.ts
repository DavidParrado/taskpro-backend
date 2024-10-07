import { Request, Response } from "express";
import { Task } from "../entities/Task";
import { Project } from "../entities/Project";
import { User } from "../entities/User";
import { Tag } from "../entities/Tag";
import { In } from "typeorm";

// Obtener una tarea por ID
export const getTask = async (req: Request, res: Response) => {
  const { id } = req.params;
  const task = await Task.findOne({
    where: { id },
    relations: ["assignee", "tags"],
  });
  return res.json(task);
};

// Crear una nueva tarea
export const createTask = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { title, description, dueDate, assigneeId, projectId, tagIds, status } =
    req.body;

  // Verificar que el proyecto existe
  const project = await Project.findOneBy({ id: projectId });
  if (!project) {
    return res.status(404).json({ message: "Proyecto no encontrado" });
  }

  // Verificar que el usuario tiene acceso al proyecto (opcional)

  // Si se proporciona un assigneeId, verificar que el usuario existe
  let assignee: User | null = null;
  if (assigneeId) {
    assignee = await User.findOneBy({ id: assigneeId });
    if (!assignee) {
      return res.status(404).json({ message: "Asignatario no encontrado" });
    }
  }

  const newTask = Task.create({
    title,
    description,
    dueDate,
    assignee,
    project,
    status,
  });

  // Si se proporcionan tags, verificar que existen
  if (tagIds) {
    const tags = await Tag.findBy({ id: In(tagIds) });
    newTask.tags = tags;
  }

  await newTask.save();
  return res.status(201).json(newTask);
};

// Actualizar una tarea
export const updateTask = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params;
  const { assigneeId, ...rest } = req.body;

  const task = await Task.findOneBy({ id });
  if (!task) {
    return res.status(404).json({ message: "Tarea no encontrada" });
  }

  if (assigneeId) {
    const assignee = await User.findOneBy({ id: assigneeId });
    if (!assignee) {
      return res.status(404).json({ message: "Asignatario no encontrado" });
    }
    task.assignee = assignee;
  }

  Task.merge(task, rest);
  const updatedTask = await task.save();

  return res.json(updatedTask);
};

// Eliminar una tarea
export const deleteTask = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params;

  const result = await Task.delete(id);
  if (result.affected === 0) {
    return res.status(404).json({ message: "Tarea no encontrada" });
  }

  return res.json({ message: "Tarea eliminada exitosamente" });
};
