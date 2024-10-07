import { Request, Response } from "express";
import { Tag } from "../entities/Tag";
import { Task } from "../entities/Task";
import { In } from "typeorm";

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
      .json(tag);
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

    console.log(task);

    if (!task) {
      return res.status(404).json({ message: "Tarea no encontrada" });
    }

    console.log({tagIds});
    const tags = await Tag.findByIds(tagIds);
    console.log(tags);


    task.tags = tags;

    await Task.save(task);

    return res
      .status(200)
      .json(task);
  } catch (error) {
    console.log(error);
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

    return res.json(task.tags);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al obtener etiquetas", error });
  }
};

// Eliminar etiquetas de una tarea
export const removeTagsFromTask = async (req: Request, res: Response) => {
  const { taskId, tagIds } = req.body;

  try {
    const task = await Task.findOneBy({
      id: taskId,
    });

    if (!task) {
      return res.status(404).json({ message: "Tarea no encontrada" });
    }

    const tags = await Tag.findBy({ id: In(tagIds) });

    if (!tags.length) {
      return res.status(404).json({ message: "No se encontraron etiquetas" });
    }

    task.tags = task.tags.filter((tag) => !tagIds.includes(tag.id));

    await Task.save(task);

    return res
      .status(200)
      .json({ message: "Etiquetas eliminadas exitosamente", task });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al eliminar etiquetas", error });
  }
};

// Eliminar una etiqueta
export const deleteTag = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await Tag.delete(id);

    if (result.affected === 0) {
      return res.status(404).json({ message: "Etiqueta no encontrada" });
    }

    return res.json({ message: "Etiqueta eliminada exitosamente" });
  } catch (error) {
    return res.status(500).json({ message: "Error al eliminar etiqueta", error });
  }
};

// Obtener todas las etiquetas
export const getTags = async (req: Request, res: Response) => {
  try {
    const tags = await Tag.find();
    return res.json(tags);
  } catch (error) {
    return res.status(500).json({ message: "Error al obtener etiquetas", error });
  }
};