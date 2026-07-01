import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

function signToken(userId: number): string {
  return jwt.sign({ sub: userId }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  } as jwt.SignOptions);
}

export async function register(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body;

  const existing = await User.findOne({ where: { email } });
  if (existing) {
    res.status(409).json({ message: "Email is already registered." });
    return;
  }

  const user = await User.create({ email, password });
  const token = signToken(user.id);

  res.status(201).json({ id: user.id, email: user.email, token });
}

export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });
  if (!user || !(await user.comparePassword(password))) {
    res.status(401).json({ message: "Invalid email or password." });
    return;
  }

  const token = signToken(user.id);
  res.status(200).json({ id: user.id, email: user.email, token });
}
