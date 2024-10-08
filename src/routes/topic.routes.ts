import { Router } from "express";
import {
  getTopics,
  getTopicById,
  createTopic,
  updateTopic,
  deleteTopic,
} from "../controllers/topic.controller";

const router = Router();

router.get("/", getTopics);

router.get("/:id", getTopicById);

router.post("/", createTopic);

router.patch("/:id", updateTopic);

router.delete("/:id", deleteTopic);

export default router;
