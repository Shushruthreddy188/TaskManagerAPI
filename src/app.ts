import express, { Application, Request, Response } from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import taskRoutes from "./routes/task.routes";
import { notFoundHandler, errorHandler } from "./middleware/error.middleware";

const app: Application = express();

app.use(cors());            // allow cross-origin requests
app.use(express.json());    // parse JSON bodies into req.body

app.get("/", (req: Request, res: Response) => {
  res.send("Task Manager API is running");
});

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
