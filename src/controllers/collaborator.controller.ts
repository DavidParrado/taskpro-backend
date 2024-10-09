import { Request, Response } from "express";
import { Collaborator } from "../entities/Collaborator";
import { User } from "../entities/User";
import { Team } from "../entities/Team";

// Añadir colaborador a un equipo
export const addCollaborator = async (req: Request, res: Response) => {
  const { userId, projectId: teamId } = req.body;

  try {
    const user = await User.findOneBy({
      id: userId,
    });
    const team = await Team.findOneBy({
      id: teamId,
    });

    if (!user || !team) {
      return res
        .status(404)
        .json({ message: "Usuario o equipo no encontrado" });
    }

    const collaborator = new Collaborator();
    collaborator.user = user;
    collaborator.team = team;

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

// Obtener colaboradores de un equipo
export const getCollaboratorsByTeam = async (req: Request, res: Response) => {
  const { teamId } = req.params;

  try {
    const team = await Team.findOne({
      where: { id: teamId },
      relations: ["collaborators", "collaborators.user"],
    });

    if (!team) {
      return res.status(404).json({ message: "Proyecto no encontrado" });
    }

    return res.json({ collaborators: team.collaborators });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al obtener colaboradores", error });
  }
};
