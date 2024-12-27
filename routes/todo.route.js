import { Router } from "express";
import { createTodo, deleteTodo, getTodo, updateTodo } from "../controllers/todo.controller.js";
import verifyJWT from "../middlewares/auth.middleware.js";

const todoRouter = Router()

todoRouter.post("/create",verifyJWT, createTodo)
todoRouter.get("/fetch",verifyJWT, getTodo)
todoRouter.put("/update/:_id",verifyJWT, updateTodo)
todoRouter.delete("/delete/:_id",verifyJWT, deleteTodo)

export default todoRouter