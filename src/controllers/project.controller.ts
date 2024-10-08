import { Request, Response } from "express";
import { Project } from "../entities/Project";
import { ProjectStatus } from "../utils/enums";
import { Task } from "../entities/Task";
import PDFDocument from "pdfkit";
import tasks from "../assets/tareas.json";
import { ListaEnlazadaCircular } from "../utils/listaEnlazadaCircular";
import { ITarea } from "../interfaces/tarea";
import { User } from "../entities/User";

// Obtener todos los proyectos
export const getAllProjects = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const projects = await Project.find({ relations: ["owner"] });
  return res.json(projects);
};

export const getProjectsByUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { userId } = req.params;

  const projects = await Project.find({
    where: { owner: { id: userId } },
    relations: ["owner"],
  });

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
    relations: ["owner","tasks","tasks.tags"],
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
  const { name, description, startDate, endDate, status, owner } = req.body;

  const newProject = Project.create({
    name,
    description,
    startDate,
    endDate,
    status: status || ProjectStatus.IN_PROGRESS,
    owner: { id: owner || req.user?.id },
  });

  await newProject.save();
  return res.status(201).json(newProject);
};

// todo: fix not working
// Actualizar un proyecto por ID
export const updateProject = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params;
  const { ownerId, ...rest } = req.body;

  const project = await Project.findOneBy({ id });
  if (!project) {
    return res.status(404).json({ message: "Proyecto no encontrado" });
  }

  // Asignar un lider si viene en la petición
  if (ownerId) {
    const owner = await User.findOneBy({ id: ownerId });
    if (!owner) {
      return res.status(404).json({ message: "Lider no encontrado" });
    }
    project.owner = ownerId;
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
    });

    // Crear un nuevo documento PDF
    const doc = new PDFDocument();

    // Configurar el encabezado del PDF
    doc
      .fontSize(20)
      .text(`Lista de tareas para el proyecto: ${project!.name}`, {
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
};
