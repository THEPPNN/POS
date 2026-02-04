import { Router } from "express";
import { DashboardController } from "../controllers/dashboard.controller";
import { authGuard } from "../middleware/authGuard";

const router = Router();

router.get("/summary", authGuard, DashboardController.summary);
router.get("/top-products", authGuard, DashboardController.topProducts);

export default router;