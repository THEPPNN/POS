import express, { Request, Response } from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import productRoutes from "./routes/product.routes";
import path from "path";
import dashboardRoutes from "./routes/dashboard.routes";
import orderRoutes from "./routes/order.routes";
import reportRoutes from "./routes/report.routes";
import userRoutes from "./routes/user.routes";

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
app.use("/dashboard", dashboardRoutes);
app.use("/orders", orderRoutes);
app.use("/reports", reportRoutes);
app.use("/users", userRoutes);

app.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});