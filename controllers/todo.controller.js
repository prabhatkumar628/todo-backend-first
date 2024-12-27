import Todo from "../models/todo.model.js"

const createTodo = async (req, res) => {
    let errorMessage = {}
    try {
        const todo = new Todo(req.body)
        todo.user = req.user._id
        await todo.save()
        res.status(201).json({ success: "True", data: todo })
        return
    } catch (error) {
        error.errors?.text ? errorMessage["text"] = error.errors.text?.message : null
        error.errors?.completed ? errorMessage["completed"] = error.errors.completed?.message : null
        res.status(400).json({ success: "False", message: errorMessage })
        return
    }
}


const getTodo = async (req, res) => {
    try {
        const todo = await Todo.find({user:req.user._id}).sort({ _id: -1 })
        res.status(201).json({ success: "True", data: todo })
        return
    } catch (error) {
        res.status(500).json({ success: "False", message: "Internal Server error" })
        return
    }
}

const updateTodo = async (req, res) => {
    let errorMessage = {}
    try {
        const todo = await Todo.findByIdAndUpdate(
            req.params._id, {
            $set: {
                text: req.body.text,
                completed: req.body.completed
            }

        }, { new: true }
        )
        if (!todo) {
            return res.status(404).json({ success: false, message: "Todo not found" })
        }


        return res.status(201).json({ success: "True", data: todo })

    } catch (error) {
        error.errors?.text ? errorMessage["text"] = error.errors.text?.message : null
        error.errors?.completed ? errorMessage["completed"] = error.errors.completed?.message : null
        return res.status(400).json({ success: "False", message: errorMessage })
    }
}

const deleteTodo = async (req, res) => {
    try {
        const todo = await Todo.findByIdAndDelete(req.params._id)
        if (!todo) {
            return res.status(404).json({ success: "False", message: "Todo not found" })
        }
        return res.status(201).json({ success: "True" })
    } catch (error) {
        return res.status(500).json({ success: "False", message: "Internal Server Error" })
    }
}

export {
    createTodo,
    getTodo,
    updateTodo,
    deleteTodo
}