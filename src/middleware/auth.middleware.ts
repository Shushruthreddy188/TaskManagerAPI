import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  userId?: number;
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    res.status(401).json({ message: "Missing or invalid Authorization header." });
    return;
  }

  const token = header.slice("Bearer ".length);

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET as string);
    if (typeof payload === "string" || payload.sub === undefined) {
      res.status(401).json({ message: "Invalid or expired token." });
      return;
    }
    req.userId = Number(payload.sub);
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired token." });
  }
}
