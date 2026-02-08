import { Router } from "express";
import { OrderController } from "../controllers/order.controller";
import { authGuard } from "../middleware/authGuard";

const router = Router();

router.post("/", authGuard, OrderController.createOrder);
router.get("/", authGuard, OrderController.getOrders);
router.get("/:id", authGuard, OrderController.getOrderById);
router.delete("/:id", authGuard, OrderController.deleteOrder);

export default router;