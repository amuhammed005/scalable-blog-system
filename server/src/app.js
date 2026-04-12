import express from "express";
import cors from "cors";
import { prisma } from "./lib/prisma.js";
import authRoutes from "./routes/auth.routes.js";
import { verifyAccessToken } from "./utils/token.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded; // Add user info to request
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired access token' });
  }
};

// Protected route to test access token
app.get("/protected", authenticateToken, (req, res) => {
  res.json({
    message: "Access granted!",
    user: {
      userId: req.user.userId,
      username: req.user.username
    }
  });
});

// console.log("Creating user...")

app.get("/test-db", (req, res) => {
  const users = prisma.user.findMany();
  res.json(users);
});

export default app;
