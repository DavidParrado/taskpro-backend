import { Request, Response } from "express";
import { Tag } from "../entities/Tag";
import { Task } from "../entities/Task";

// Crear una nueva etiqueta
export const createTag = async (req: Request, res: Response) => {
  const { name, color } = req.body;

  try {
    const tag = new Tag();
    tag.name = name;
    tag.color = color;

    await Tag.save(tag);

    return res
      .status(201)
      .json({ message: "Etiqueta creada exitosamente", tag });
  } catch (error) {
    return res.status(500).json({ message: "Error al crear etiqueta", error });
  }
};

// Asignar etiquetas a una tarea
export const assignTagsToTask = async (req: Request, res: Response) => {
  const { taskId, tagIds } = req.body;

  try {
    const task = await Task.findOneBy({
      id: taskId,
    });

    if (!task) {
      return res.status(404).json({ message: "Tarea no encontrada" });
    }

    const tags = await Tag.findByIds(tagIds);

    if (!tags.length) {
      return res.status(404).json({ message: "No se encontraron etiquetas" });
    }

    task.tags = tags;

    await Task.save(task);

    return res
      .status(200)
      .json({ message: "Etiquetas asignadas exitosamente", task });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al asignar etiquetas", error });
  }
};

// Obtener etiquetas por tarea
export const getTagsByTask = async (req: Request, res: Response) => {
  const { taskId } = req.params;

  try {
    const task = await Task.findOne({
      where: { id: taskId },
      relations: ["tags"],
    });

    if (!task) {
      return res.status(404).json({ message: "Tarea no encontrada" });
    }

    return res.json({ tags: task.tags });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al obtener etiquetas", error });
  }
};
