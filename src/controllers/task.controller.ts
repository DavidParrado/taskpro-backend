import { Request, Response } from "express";
import { In } from "typeorm";
import dotenv from "dotenv";
import OpenAI from "openai";
import PDFDocument from "pdfkit";

import { Project } from "../entities/Project";
import { Topic } from "../entities/Topic";
import { Task } from "../entities/Task";
import { User } from "../entities/User";
import { Tag } from "../entities/Tag";

import { ListaEnlazadaCircular } from "../utils/listaEnlazadaCircular";
import { ITarea } from "../interfaces/tarea";

import tasks from "../assets/tareas.json";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Generar tareas random
export const generateRandomTasks = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { topicId, quantity, projectId } = req.body;
    const project = await Project.findOneBy({ id: projectId });
    if (!project) {
      return res.status(404).json({ message: "Proyecto no encontrado" });
    }

    const topic = await Topic.findOneBy({ id: topicId });
    if (!topic) {
      return res.status(404).json({ message: "Tema no encontrado" });
    }
    // This prompt will generate a json with random tasks about the given topic, following a specific format
    const prompt = `
    Generate a list of ${quantity} tasks about ${topic.title} in JSON format. 
    Each task should have the following structure:

    {
      "title": "Task 1",
      "description": "This is the description of task 1 related to ${topic.title}"
    }

    The output should be an array of objects in JSON format. Don't add strings or comments to the output. Just return the array of objects. And don't forget to replace the title and description of each task for random data.
  `;
    const params: OpenAI.Chat.ChatCompletionCreateParams = {
      model: "gpt-3.5-turbo",
      messages: [
        { role: "assistant", content: "You are a helpful assistant" },
        { role: "user", content: prompt },
      ],
      max_tokens: 200,
      temperature: 0.7,
    };

    const response = await openai.chat.completions.create(params);

    console.log(response.choices[0].message.content);
    const tasks = JSON.parse(response.choices[0].message.content ?? "[]");
    if (!tasks) {
      return res.status(500).json({ message: "Error al generar tareas" });
    }
    const newTasks = tasks.map((task: any, i: number) =>
      Task.create({
        title: task.title ?? `Task - ${topic.title}` + i,
        description:
          task.description ??
          `This is the description of task ${i} related to ` + topic.title,
        project,
      })
    );

    await Task.save(newTasks);
    return res.json(newTasks);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Error al generar tareas - Server" });
  }
};

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
  console.log(tagIds);
  if (tagIds) {
    const tags = await Tag.findBy({ id: In(tagIds) });
    console.log(tags);
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
  const { title, description, dueDate, assigneeId, tagIds, status } = req.body;

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

  // Si se proporcionan tags, verificar que existen
  if (tagIds) {
    const tags = await Tag.findBy({ id: In(tagIds) });
    task.tags = tags;
  }

  task.title = title;
  task.description = description;
  task.dueDate = dueDate;
  task.status = status;

  await task.save();
  return res.status(201).json(task);
};

// Actualizar status de una tarea
export const updateTaskStatus = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const task = await Task.findOne({ where: { id } });
    if (!task) {
      return res.status(404).json({ message: "Tarea no encontrada" });
    }

    task.status = status;
    await task.save();
    return res.json(task);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error al actualizar tarea" });
  }
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

// Generar pdf de tareas
export const generatePdf = async (req: Request, res: Response) => {
  try {
    // Crear un nuevo documento PDF
    const doc = new PDFDocument();

    // Configurar el encabezado del PDF
    doc.fontSize(20).text(`Lista de tareas para el proyecto`, {
      align: "center",
    });
    doc.moveDown();

    const tareas: ITarea[] = tasks.map((task: any) => {
      return {
        ...task,
        dueDate: task.dueDate ? new Date(task.dueDate) : null,
        createdAt: new Date(task.createdAt),
        updatedAt: new Date(task.updatedAt),
      };
    });

    const arregloCircular = new ListaEnlazadaCircular<ITarea>();
    arregloCircular.transformarArreglo(tareas);

    // Iterar sobre las tareas del proyecto
    arregloCircular.recorrer((tarea) => {
      const userName = tarea.user.name || "Sin asignar";
      doc.fontSize(14).text(`Tarea: ${tarea.title}`);
      doc.fontSize(12).text(`Asignado a: ${userName}`);
      doc.fontSize(12).text(`Estado: ${tarea.status}`);
      doc.fontSize(12).text(`Descripción: ${tarea.description}`);
      doc.moveDown();
    });

    // Finalizar el PDF
    doc.end();

    // Configurar la respuesta como un archivo PDF
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=tasks.pdf`);

    // Enviar el PDF generado
    doc.pipe(res);
  } catch (error) {
    console.error("Error generando pdf:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
} 