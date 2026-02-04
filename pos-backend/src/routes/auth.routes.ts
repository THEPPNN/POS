import { Router } from "express";
import { login, logout, me } from "../controllers/auth.controller";
import { authGuard } from "../middleware/authGuard";

const router = Router();

router.post("/login", login);
router.post("/logout", logout);
router.get("/me", authGuard, me);

export default router;