import express, { Request, Response } from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import productRoutes from "./routes/product.routes";
import path from "path";
const app = express();

app.use(cors());
app.use(
  "/uploads",
  express.static(path.join(__dirname, "..", "uploads"))
);
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("API is running");
});

app.use("/auth", authRoutes);
app.use("/products", productRoutes);

app.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});