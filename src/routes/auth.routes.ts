import { Router } from "express";
import { register, login } from "../controllers/auth.controller";
import { validateBody } from "../middleware/validate.middleware";
import { registerSchema, loginSchema } from "../validation/schemas";

const router = Router();

router.post("/register", validateBody(registerSchema), register);
router.post("/login", validateBody(loginSchema), login);

export default router;
