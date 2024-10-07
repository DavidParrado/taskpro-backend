import { Router } from "express";
import {
  createTag,
  assignTagsToTask,
  getTagsByTask,
  deleteTag,
  getTags,
  removeTagsFromTask,
} from "../controllers/tag.controller";
import { validateAssignTagsToTask, validateTag } from "../validators/tag-validators";
import { validateErrors } from "../middlewares/validate-errors";

const router = Router();

// Obtener todas las etiquetas
router.get("/", getTags);
router.get("/:taskId", getTagsByTask);
router.post("/", validateTag, validateErrors, createTag);
router.post("/assign", validateAssignTagsToTask, validateErrors, assignTagsToTask);
router.post("/remove", removeTagsFromTask);
router.delete("/:id", deleteTag);

export default router;
