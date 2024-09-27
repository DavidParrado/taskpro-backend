import { Request, Response } from "express";
import { Project } from "../entities/Project";
import { ProjectStatus } from "../utils/enums";
import { Task } from "../entities/Task";
import PDFDocument from "pdfkit";

// Obtener todos los proyectos
export const getAllProjects = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const projects = await Project.find({ relations: ["leader"] });
  return res.json(projects);
};

// Obtener proyecto por ID
export const getProject = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params;
  const project = await Project.findOne({
    where: { id },
    relations: ["leader"],
  });

  if (!project) {
    return res.status(404).json({ message: "Proyecto no encontrado" });
  }

  return res.json(project);
};

// Crear un nuevo proyecto
export const createProject = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { name, description, startDate, endDate, status, leaderId } = req.body;

  const newProject = Project.create({
    name,
    description,
    startDate,
    endDate,
    status: status || ProjectStatus.IN_PROGRESS,
    owner: leaderId,
  });

  await newProject.save();
  return res.status(201).json(newProject);
};

// Actualizar un proyecto por ID
export const updateProject = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params;
  const { leaderId, ...rest } = req.body;

  const project = await Project.findOneBy({ id });
  if (!project) {
    return res.status(404).json({ message: "Proyecto no encontrado" });
  }

  // Asignar un lider si viene en la petición
  if (leaderId) {
    project.owner = leaderId;
  }

  Project.merge(project, rest);
  const updatedProject = await project.save();
  return res.json(updatedProject);
};

// Eliminar un proyecto por ID
export const deleteProject = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params;

  const result = await Project.delete(id);
  if (result.affected === 0) {
    return res.status(404).json({ message: "Proyecto no encontrado" });
  }

  return res.json({ message: "Proyecto eliminado exitosamente" });
};

// Obtener todas las tareas de un proyecto por su ID
export const getTasksByProject = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params;

  // Verificar que el proyecto existe
  const project = await Project.findOneBy({ id });
  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  // Obtener las tareas asociadas al proyecto
  const tasks = await Task.find({ where: { project: { id } } });

  return res.json(tasks);
};

export const generateTasksPdf = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Buscar el proyecto con las tareas asociadas
    const project = await Project.findOne({
      where: { id },
      relations: ["tasks", "tasks.assignee"],
    });

    // Crear un nuevo documento PDF
    const doc = new PDFDocument();

    // Configurar el encabezado del PDF
    doc.fontSize(20).text(`Lista de tareas para el proyecto: ${project!.name}`, {
      align: "center",
    });
    doc.moveDown();

    // Iterar sobre las tareas del proyecto
    project!.tasks.forEach((task: Task) => {
      const userName = task.assignee ? task.assignee.name : "Sin asignar";
      doc.fontSize(14).text(`Tarea: ${task.title}`);
      doc.fontSize(12).text(`Asignado a: ${userName}`);
      doc.fontSize(12).text(`Estado: ${task.status}`);
      doc.fontSize(12).text(`Descripción: ${task.description}`);
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
    console.error("Error generating PDF:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
