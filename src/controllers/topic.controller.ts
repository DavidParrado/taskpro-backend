import { Request, Response } from "express";
import { Topic } from "../entities/Topic";

export const getTopics = async (req: Request, res: Response) => {
  const topics = await Topic.find();
  res.json(topics);
};

export const getTopicById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const topic = await Topic.findBy({ id });
  if (!topic) {
    return res.status(404).json({ message: "Topic not found" });
  }
  res.json(topic);
};

export const createTopic = async (req: Request, res: Response) => {
  const { title, description } = req.body;

  const topic = Topic.create({ title, description });
  await Topic.save(topic);

  res.status(201).json(topic);
};

export const updateTopic = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description } = req.body;

  const topic = await Topic.findOneBy({ id });
  if (!topic) {
    return res.status(404).json({ message: "Topic not found" });
  }

  topic.title = title;
  topic.description = description;

  await Topic.save(topic);
  res.json(topic);
};

export const deleteTopic = async (req: Request, res: Response) => {
  const { id } = req.params;
  const topic = await Topic.findBy({ id });
  if (!topic) {
    return res.status(404).json({ message: "Topic not found" });
  }

  await Topic.remove(topic);
  res.status(204).json({ message: "Topic deleted" });
};
