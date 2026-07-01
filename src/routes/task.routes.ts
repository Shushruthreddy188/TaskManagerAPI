import { Router } from "express";
import { createTask, listTasks, getTask, updateTask, deleteTask } from "../controllers/task.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { validateBody } from "../middleware/validate.middleware";
import { createTaskSchema, updateTaskSchema } from "../validation/schemas";

const router = Router();

router.use(requireAuth);

router.post("/", validateBody(createTaskSchema), createTask);
router.get("/", listTasks);
router.get("/:id", getTask);
router.put("/:id", validateBody(updateTaskSchema), updateTask);
router.delete("/:id", deleteTask);

export default router;
