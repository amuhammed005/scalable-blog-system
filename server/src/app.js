import express from "express";
import cors from "cors";
import { prisma } from "./lib/prisma.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);

// console.log("Creating user...")

app.get("/test-db", (req, res) => {
  const users = prisma.user.findMany();
  res.json(users);
});

export default app;
