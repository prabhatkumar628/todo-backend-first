import { Router } from "express";
import todoRouter from "./todo.route.js";
import userRouter from "./user.route.js";

const router = Router()

router.use("/todo", todoRouter)
router.use("/user", userRouter)

export default router