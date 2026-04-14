import { createPost } from "../../controllers/post-controller/post.controller.js"
import {authMiddleware} from "../../middlewares/auth.middleware.js"

import express from "express"

const router = express.Router()

router.post("/", authMiddleware, createPost)

export default router