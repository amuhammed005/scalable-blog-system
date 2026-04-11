import express from "express";
import cors from "cors";
import { prisma } from "./lib/prisma.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/test-db", (req, res) => {
  const users = prisma.user.findMany();
  res.json(users);
});

export default app;
