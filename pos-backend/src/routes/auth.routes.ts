import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { authGuard } from "../middleware/authGuard";

const router = Router();

router.post("/login", AuthController.login);

export default router;