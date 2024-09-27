import { Router } from "express";
import {
  getAllTeams,
  getTeamById,
  createTeam,
  updateTeam,
  deleteTeam,
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
router.post("/", roleMiddleware([UserRole.ADMIN]), createTeam); // Solo admin o project_manager pueden crear equipos
router.put("/:id", roleMiddleware([UserRole.ADMIN]), updateTeam);
router.delete("/:id", roleMiddleware([UserRole.ADMIN]), deleteTeam);

export default router;
