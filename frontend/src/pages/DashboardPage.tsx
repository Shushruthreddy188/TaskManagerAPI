import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import client from "../api/client";
import { useAuth } from "../context/AuthContext";
import type { Task } from "../types";
import { TaskItem } from "../components/TaskItem";
import { extractErrorMessage } from "../utils/error";

export function DashboardPage() {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  async function loadTasks() {
    setLoading(true);
    try {
      const res = await client.get<Task[]>("/tasks");
      setTasks(res.data);
      setError(null);
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await client.post<Task>("/tasks", { title, description: description || undefined });
      setTasks((prev) => [res.data, ...prev]);
      setTitle("");
      setDescription("");
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setCreating(false);
    }
  }

  async function handleUpdate(id: number, changes: Partial<Pick<Task, "title" | "description" | "status">>) {
    try {
      const res = await client.put<Task>(`/tasks/${id}`, changes);
      setTasks((prev) => prev.map((t) => (t.id === id ? res.data : t)));
    } catch (err) {
      setError(extractErrorMessage(err));
    }
  }

  async function handleDelete(id: number) {
    try {
      await client.delete(`/tasks/${id}`);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError(extractErrorMessage(err));
    }
  }

  return (
    <div className="dashboard">
      <header>
        <h1>My Tasks</h1>
        <div>
          <span className="user-email">{user?.email}</span>
          <button onClick={logout}>Log out</button>
        </div>
      </header>

      <form className="task-create" onSubmit={handleCreate}>
        <input
          placeholder="New task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit" disabled={creating || !title.trim()}>
          Add task
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      {loading ? (
        <p>Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <p>No tasks yet — add one above.</p>
      ) : (
        <ul className="task-list">
          {tasks.map((task) => (
            <TaskItem key={task.id} task={task} onUpdate={handleUpdate} onDelete={handleDelete} />
          ))}
        </ul>
      )}
    </div>
  );
}
