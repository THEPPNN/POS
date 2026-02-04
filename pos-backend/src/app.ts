import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());


import authRoutes from "./routes/auth.routes";

app.use("/auth", authRoutes);


export default app;