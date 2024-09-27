import { Request, Response } from "express";
import { Team } from "../entities/Team";
import { User } from "../entities/User";
import { Project } from "../entities/Project";

// Obtener todos los equipos
export const getAllTeams = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const teams = await Team.find({
    relations: ["members", "leader", "project"],
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
    relations: ["members", "leader", "project"],
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
  const { name, leaderId, projectId, membersIds, description } = req.body;

  const leader = await User.findOneBy({ id: leaderId });
  const project = await Project.findOneBy({ id: projectId });
  const members = await User.findByIds(membersIds);

  if (!leader || !project) {
    return res.status(400).json({ message: "Leader or Project not found" });
  }

  const newTeam = Team.create({ name, leader, project, members, description });
  await newTeam.save();
  return res.status(201).json(newTeam);
};

// Editar un equipo
export const updateTeam = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params;
  const { name, leaderId, membersIds, description } = req.body;

  const team = await Team.findOneBy({ id });
  if (!team) {
    return res.status(404).json({ message: "Team not found" });
  }

  if (name) team.name = name;
  if (leaderId) {
    const leader = await User.findOneBy({ id: leaderId });
    if (leader) team.leader = leader;
  }
  if (membersIds) {
    const members = await User.findByIds(membersIds);
    team.members = members;
  }
  if (description) team.description = description;

  await team.save();
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
