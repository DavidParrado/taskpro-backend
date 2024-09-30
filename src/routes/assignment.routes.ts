import { Router } from "express";
import {
  assignUserToTask,
  getTaskCollaborators,
  removeAssignment,
} from "../controllers/assignment.controller";

const router = Router();

router.post("/assign", assignUserToTask); // Asignar un colaborador a una tarea
router.get("/task/:taskId", getTaskCollaborators); // Obtener colaboradores de una tarea
router.delete("/:assignmentId", removeAssignment); // Eliminar una asignación

export default router;
