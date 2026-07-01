import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const createTaskSchema = z.object({
  title: z.string().min(1),
  description: z.string().nullable().optional(),
  status: z.enum(["pending", "in-progress", "completed"]).optional(),
});

export const updateTaskSchema = z
  .object({
    title: z.string().min(1),
    description: z.string().nullable(),
    status: z.enum(["pending", "in-progress", "completed"]),
  })
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided.",
  });
