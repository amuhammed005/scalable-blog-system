import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser"

import { prisma } from "./lib/prisma.js";
import authRoutes from "./routes/auth.routes.js";
import postRoutes from "../src/routes/post-route/post.routes.js"
import likeRoutes from "../src/routes/like-route/like.route.js"
import { authMiddleware } from "../src/middlewares/auth.middleware.js";

const app = express();

app.use(express.json());
// CRITICAL FIX: cookieParser must be invoked as middleware function with ()
// This parses Cookie headers and populates req.cookies object
// Without this, req.cookies will be undefined, causing infinite loops in cookie-dependent endpoints
app.use(cookieParser())
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

app.use("/auth", authRoutes);
app.use("/posts", postRoutes)
app.use("/likes", likeRoutes)

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

app.get("/test-db", (req, res) => {
  const users = prisma.user.findMany();
  res.json(users);
});

export default app;
