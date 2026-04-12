import express from "express"
import { login, signup, refreshToken } from "../controllers/auth.controller.js"

const router = express.Router()

router.post("/login", login)
router.post("/signup", signup)
router.post("/refresh", refreshToken)

export default router