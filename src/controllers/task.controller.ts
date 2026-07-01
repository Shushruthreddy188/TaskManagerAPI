import { Response } from "express";
import Task from "../models/Task";
import { AuthRequest } from "../middleware/auth.middleware";

export async function createTask(req: AuthRequest, res: Response): Promise<void> {
  const { title, description, status } = req.body;

  const task = await Task.create({
    title,
    description: description ?? null,
    status,
    userId: req.userId as number,
  });

  res.status(201).json(task);
}

export async function listTasks(req: AuthRequest, res: Response): Promise<void> {
  const tasks = await Task.findAll({ where: { userId: req.userId } });
  res.status(200).json(tasks);
}

export async function getTask(req: AuthRequest, res: Response): Promise<void> {
  const task = await Task.findOne({ where: { id: req.params.id, userId: req.userId } });

  if (!task) {
    res.status(404).json({ message: "Task not found." });
    return;
  }

  res.status(200).json(task);
}

export async function updateTask(req: AuthRequest, res: Response): Promise<void> {
  const task = await Task.findOne({ where: { id: req.params.id, userId: req.userId } });

  if (!task) {
    res.status(404).json({ message: "Task not found." });
    return;
  }

  const { title, description, status } = req.body;
  await task.update({
    ...(title !== undefined && { title }),
    ...(description !== undefined && { description }),
    ...(status !== undefined && { status }),
  });

  res.status(200).json(task);
}

export async function deleteTask(req: AuthRequest, res: Response): Promise<void> {
  const task = await Task.findOne({ where: { id: req.params.id, userId: req.userId } });

  if (!task) {
    res.status(404).json({ message: "Task not found." });
    return;
  }

  await task.destroy();
  res.status(204).send();
}
