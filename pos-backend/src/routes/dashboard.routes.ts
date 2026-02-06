import { Router } from "express";
import { DashboardController } from "../controllers/dashboard.controller";
import { authGuard } from "../middleware/authGuard";

const router = Router();

// GET /dashboard/summary
// GET /dashboard/sales-by-day
// GET /dashboard/profit-by-day
// GET /dashboard/top-products
// GET /dashboard/sales-by-category

router.get("/", authGuard, DashboardController.allsummary);

export default router;