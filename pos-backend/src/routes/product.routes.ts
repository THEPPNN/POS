import { Router } from "express";
import { ProductController } from "../controllers/product.controller";
import { authGuard } from "../middleware/authGuard";

const router = Router();

router.post("/", authGuard, ProductController.createProduct);
router.get("/", authGuard, ProductController.getProducts);
router.get("/barcode/:code", authGuard, ProductController.getProductByBarcode);
router.put("/:id", authGuard, ProductController.updateProduct);

export default router;