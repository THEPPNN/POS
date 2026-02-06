import { Router } from "express";
import { ProductController } from "../controllers/product.controller";
import { authGuard } from "../middleware/authGuard";

import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/products/");
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname); // .jpg .png
        const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
        cb(null, filename);
    },
});

const upload = multer({ storage });

const router = Router();

router.post("/", upload.single("image"), ProductController.createProduct);
router.get("/", authGuard, ProductController.getProducts);
router.get("/barcode/:code", authGuard, ProductController.getProductByBarcode);
router.put("/:id", upload.single("image"), authGuard, ProductController.updateProduct);
router.delete("/:id", authGuard, ProductController.deleteProduct);

export default router;