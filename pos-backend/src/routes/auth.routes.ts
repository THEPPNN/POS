import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { authGuard } from "../middleware/authGuard";

const router = Router();

router.post("/login", AuthController.login);
// router.post("/logout", logout);
// router.get("/me", authGuard, me);

export default router;