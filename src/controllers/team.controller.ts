import { Request, Response } from "express";
import { Team } from "../entities/Team";
import { User } from "../entities/User";
import { Project } from "../entities/Project";
import { In } from "typeorm";
import { Collaborator } from "../entities/Collaborator";

// Obtener todos los equipos
export const getAllTeams = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const teams = await Team.find({
    relations: ["collaborators", "leader", "project"],
  });
  return res.json(teams);
};

// Obtener equipos por usuario
export const getTeamsByUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { userId } = req.params;

  const user = await User.findOneBy({ id: userId });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  const teams = await Team.find({
    where: { leader: user },
    relations: ["project", "collaborators", "leader", "collaborators.user"],
  });
  return res.json(teams);
};

// Obtener equipos por proyecto
export const getTeamsByProject = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { projectId } = req.params;
  const teams = await Team.find({
    where: { project: { id: projectId } },
    relations: ["collaborators", "leader", "project"],
  });
  return res.json(teams);
};

// Obtener un equipo por ID
export const getTeamById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params;
  const team = await Team.findOne({
    where: { id },
    relations: ["collaborators", "leader", "project"],
  });
  return team
    ? res.json(team)
    : res.status(404).json({ message: "Team not found" });
};

// Crear un nuevo equipo
export const createTeam = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { name, leaderId, projectId, description, collaboratorIds } = req.body;

  console.log(req.body);
  const leader = await User.findOneBy({ id: leaderId });
  const project = await Project.findOneBy({ id: projectId });
  console.log(leader, project);
  // todo: Add validators ??

  if (!leader || !project) {
    return res.status(400).json({ message: "Leader or Project not found" });
  }

  const newTeam = Team.create({ name, leader, project, description });
  await newTeam.save();

  if (collaboratorIds) {
    const collaboratorsFound = await User.findBy({ id: In(collaboratorIds) });
    const collaborators = await Promise.all(
      collaboratorsFound.map((collaborator) => {
        const newCollaborator = Collaborator.create({
          user: collaborator,
          team: newTeam,
        });
        return newCollaborator.save();
      })
    );
    return res.status(201).json({ ...newTeam, collaborators });
  }

  return res.status(201).json(newTeam);
};

// Editar un equipo
export const updateTeam = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params;
  const { name, leaderId, description } = req.body;

  const team = await Team.findOneBy({ id });
  if (!team) {
    return res.status(404).json({ message: "Team not found" });
  }

  if (name) team.name = name;
  if (leaderId) {
    const leader = await User.findOneBy({ id: leaderId });
    if (leader) team.leader = leader;
  }

  if (description) team.description = description;

  await team.save();
  console.log({ team });
  return res.json(team);
};

// Eliminar un equipo
export const deleteTeam = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params;
  const deletedTeam = await Team.delete(id);
  return res.json(deletedTeam);
};
