import express from "express";
import cors from "cors";
import { prisma } from "./lib/prisma.js";
import authRoutes from "./routes/auth.routes.js";
import {authMiddleware} from "../src/middlewares/auth.middleware.js"

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);

// Protected route to test access token
app.get("/protected", authMiddleware, (req, res) => {
  res.json({
    message: "Access granted!",
    user: {
      userId: req.user.userId,
      username: req.user.username,
    },
  });
});

// console.log("Creating user...")

app.get("/test-db", (req, res) => {
  const users = prisma.user.findMany();
  res.json(users);
});

export default app;
