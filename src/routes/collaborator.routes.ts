
import { Router } from "express";
import {
  addCollaborator,
  getCollaboratorsByProject,
} from "../controllers/collaborator.controller";

const router = Router();

router.post("/add", addCollaborator);
router.get("/:projectId/collaborators", getCollaboratorsByProject);

export default router;
