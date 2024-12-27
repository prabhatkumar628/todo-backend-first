import mongoose, { Schema } from "mongoose";

const todoSchema = new Schema({
    text: {
        type: String,
        required: [true, "Todo text is required"]
    },
    completed: {
        type: Boolean,
        required: [true, "Completed is required"]
    },
    user:{
        type: Schema.Types.ObjectId,
        ref:"User",
        required:[true, "User refrenced is required"]
    }
}, { timestamps: true })

const Todo = mongoose.model("Todo", todoSchema)
export default Todo