import { Request, Response } from "express";
import { Collaborator } from "../entities/Collaborator";
import { User } from "../entities/User";
import { Project } from "../entities/Project";

// Añadir colaborador a un proyecto
export const addCollaborator = async (req: Request, res: Response) => {
  const { userId, projectId } = req.body;

  try {
    const user = await User.findOneBy({
      id: userId,
    });
    const project = await Project.findOneBy({
      id: projectId,
    });

    if (!user || !project) {
      return res
        .status(404)
        .json({ message: "Usuario o proyecto no encontrado" });
    }

    const collaborator = new Collaborator();
    collaborator.user = user;
    collaborator.project = project;

    await Collaborator.save(collaborator);

    return res
      .status(201)
      .json({ message: "Colaborador añadido exitosamente", collaborator });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al añadir colaborador", error });
  }
};

// Obtener colaboradores de un proyecto
export const getCollaboratorsByProject = async (
  req: Request,
  res: Response
) => {
  const { projectId } = req.params;

  try {
    const project = await Project.findOne({
      where: { id: projectId },
      relations: ["collaborators", "collaborators.user"],
    });

    if (!project) {
      return res.status(404).json({ message: "Proyecto no encontrado" });
    }

    return res.json({ collaborators: project.collaborators });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al obtener colaboradores", error });
  }
};
