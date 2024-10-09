import { Router } from "express";
import {
  addCollaborator,
  getCollaboratorsByTeam,
} from "../controllers/collaborator.controller";

const router = Router();

router.post("/add", addCollaborator);
router.get("/team/:teamId", getCollaboratorsByTeam);

export default router;
