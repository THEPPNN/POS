import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { authGuard } from "../middleware/authGuard";

const router = Router();

router.get("/", authGuard, UserController.getUsers);
router.get("/:id", authGuard, UserController.getUserById);
router.post("/", authGuard, UserController.createUser);
router.put("/:id", authGuard, UserController.updateUser);
router.delete("/:id", authGuard, UserController.deleteUser);

export default router;