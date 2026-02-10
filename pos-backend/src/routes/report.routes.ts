import { Router } from "express";
import { ReportController } from "../controllers/report.controller";
import { authGuard } from "../middleware/authGuard";

const router = Router();
router.get("/", authGuard, ReportController.getReport);
router.get("/export-excel", authGuard, ReportController.exportExcel);
router.get("/:id", authGuard, ReportController.getReportById);

export default router;