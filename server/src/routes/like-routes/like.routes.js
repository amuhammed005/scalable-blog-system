import express from "express"
import { authMiddleware } from "../../middlewares/auth.middleware.js"
import { toggleLike } from "../../controllers/like/like.controller.js"


const router = express.Router()

router.post("/:postId", authMiddleware, toggleLike)

export default router