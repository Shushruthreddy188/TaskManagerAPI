import { Request, Response, NextFunction } from "express";
import { ValidationError, UniqueConstraintError, DatabaseError } from "sequelize";

export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

export function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction): void {
  if (res.headersSent) {
    next(err);
    return;
  }

  if (err instanceof UniqueConstraintError) {
    res.status(409).json({ message: "A record with these details already exists." });
    return;
  }

  if (err instanceof ValidationError) {
    res.status(400).json({ message: err.errors.map((e) => e.message).join(", ") });
    return;
  }

  if (err instanceof DatabaseError) {
    res.status(400).json({ message: "Invalid request data." });
    return;
  }

  console.error(err);
  res.status(500).json({ message: "Internal server error." });
}
