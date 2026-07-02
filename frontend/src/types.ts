export type TaskStatus = "pending" | "in-progress" | "completed";

export interface Task {
  id: number;
  title: string;
  description: string | null;
  status: TaskStatus;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  id: number;
  email: string;
  token: string;
}
