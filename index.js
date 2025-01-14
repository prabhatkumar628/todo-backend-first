import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import router from "./routes/root.route.js"
import cookieParser from "cookie-parser"
import cors from "cors"
dotenv.config({
    path:"./.env"
})

const port = process.env.PORT || 8001
const app = express()




const connectDB = async()=>{
    try {
        const connectionInstance = await mongoose.connect(process.env.MONGODB_URI)
        console.log(`MongoDB Connected !!! HOST:`,connectionInstance.connection.host)
    } catch (error) {
        console.log(`MongoDB connectin ERROR`,error)
        process.exit(1)
    }
}

connectDB()
.then(()=>{
    app.listen(port, ()=>{
        console.log(`Server is running on http://localhost:${port}`)
    })
})
.catch((error)=>{
    console.log("ERROR",error)
})


app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials:true,
    methods:"GET,POST,PUT,DELETE",
    allowedHeaders:["Content-Type", "Authorization"]
}))
app.use(express.json())
app.use(cookieParser())
app.use("/api", router )






