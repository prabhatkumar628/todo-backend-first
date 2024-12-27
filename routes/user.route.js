import { Router } from "express";
import { loginUser, logOutUser, registerUser } from "../controllers/user.controller.js";
import verifyJWT from "../middlewares/auth.middleware.js";

const userRouter = Router()

userRouter.post("/signup",registerUser )
userRouter.post("/login", loginUser)
userRouter.get("/logout", verifyJWT,logOutUser)

export default userRouter