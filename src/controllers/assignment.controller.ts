import { Request, Response } from "express";
import { Assignment } from "../entities/Assignment";
import { User } from "../entities/User";
import { Task } from "../entities/Task";

// Asignar un colaborador a una tarea
export const assignUserToTask = async (req: Request, res: Response) => {
  const { taskId, userId, role } = req.body;

  try {
    const task = await Task.findOneBy({
      id: taskId,
    });
    const user = await User.findOneBy({
      id: userId,
    });

    if (!task || !user) {
      return res
        .status(404)
        .json({ message: "Tarea o usuario no encontrados" });
    }

    const assignment = new Assignment();
    assignment.task = task;
    assignment.user = user;
    assignment.role = role;

    await Assignment.save(assignment);

    return res
      .status(201)
      .json({ message: "Colaborador asignado exitosamente", assignment });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al asignar colaborador", error });
  }
};

// Obtener colaboradores de una tarea
export const getTaskCollaborators = async (req: Request, res: Response) => {
  const { taskId } = req.params;

  try {
    const task = await Task.findOne({
      where: { id: taskId },
      relations: ["assignments", "assignments.user"],
    });

    if (!task) {
      return res.status(404).json({ message: "Tarea no encontrada" });
    }

    return res.json({ collaborators: task.assignments });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al obtener colaboradores", error });
  }
};

// Eliminar una asignación
export const removeAssignment = async (req: Request, res: Response) => {
  const { assignmentId } = req.params;

  try {
    const assignment = await Assignment.findOneBy({
      id: assignmentId,
    });

    if (!assignment) {
      return res.status(404).json({ message: "Asignación no encontrada" });
    }

    await Assignment.remove(assignment);

    return res
      .status(200)
      .json({ message: "Asignación eliminada exitosamente" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al eliminar asignación", error });
  }
};
