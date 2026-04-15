import {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
} from "../../controllers/post-controller/post.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

import express from "express";

const router = express.Router();

// GET /posts - Get posts with optional pagination and filtering
router.get("/", getPosts);

// GET /posts/:id - Get a single post by ID
router.get("/:id", getPostById);

// POST /posts - Create a new post (requires auth)
router.post("/", authMiddleware, createPost);

// PUT /posts/:id - Update a post (requires auth, ownership check)
router.put("/:id", authMiddleware, updatePost);

// DELETE /posts/:id - Delete a post (requires auth, ownership check)
router.delete("/:id", authMiddleware, deletePost);

export default router;
