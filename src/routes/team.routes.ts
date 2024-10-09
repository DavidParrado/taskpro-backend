import { Router } from "express";
import {
  getAllTeams,
  getTeamById,
  createTeam,
  updateTeam,
  deleteTeam,
  getTeamsByUser,
  getTeamsByProject,
} from "../controllers/team.controller";
import { authMiddleware } from "../middlewares/authMiddleware";
import { roleMiddleware } from "../middlewares/roleMiddleware";
import { UserRole } from "../utils/enums";

const router = Router();

// Solo los usuarios autenticados pueden gestionar equipos
router.use(authMiddleware);

// Rutas para equipos
router.get("/", getAllTeams);
router.get("/:id", getTeamById);
router.post("/", createTeam); // Solo admin o project_manager pueden crear equipos
router.patch("/:id", updateTeam);
router.delete("/:id", deleteTeam);
router.get("/user/:userId", getTeamsByUser);
router.get("/project/:projectId", getTeamsByProject);

export default router;
