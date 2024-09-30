import { Router } from "express";
import {
  createTag,
  assignTagsToTask,
  getTagsByTask,
} from "../controllers/tag.controller";

const router = Router();

router.post("/create", createTag);
router.post("/assign", assignTagsToTask);
router.get("/:taskId", getTagsByTask);

export default router;
