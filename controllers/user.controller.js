import User from "../models/user.model.js"
import { userDataValideter } from "../utils/zod.js"

const options = {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    path: "/"
}

const generateAccessAndRefreshToken = async (userId) => {
    const user = await User.findById(userId)
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()
    user.accessToken = accessToken
    await user.save({ validateBeforeSave: false })
    return { accessToken, refreshToken }
}

const registerUser = async (req, res) => {
    let errorMessage = {}
    try {
        const validateUserData = userDataValideter.safeParse(req.body)
        if (!validateUserData.success) {
            errorMessage = validateUserData.error.errors.map((err) => err.message)
            return res.status(400).json({ success: "False", message: errorMessage })
        }
        const user = new User(req.body)
        await user.save()
        res.status(201).json({ success: true, data: user })
    } catch (error) {
        error.keyValue?.email ? errorMessage["email"] = "Email is already registerd" : null
        error.errors?.username ? errorMessage["username"] = error.errors.username?.message : null
        error.errors?.email ? errorMessage["email"] = error.errors.email?.message : null
        error.errors?.password ? errorMessage["password"] = error.errors.password?.message : null
        return res.status(400).json({ success: "False", message: errorMessage })
    }
}

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required." });
        }
        const user = await User.findOne({ email: email }).select("+password");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }
        const isValidPassword = await user.isPasswordCorrect(password);
        if (!isValidPassword) {
            return res.status(401).json({ success: false, message: "Invalid email or password." });
        }
        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)
        return res
            .status(200)
            .cookie("accessTodo", accessToken, options)
            .cookie("refreshTodo", refreshToken, options)
            .json({
                success: true,
                message: "User logged in successfully",
                data:user,
                accessToken,
                refreshToken
            });
    } catch (error) {
        // Handle unexpected errors
        console.error("Login Error:", error);
        return res.status(500).json({ success: false, message: "Something went wrong. Please try again later." });
    }
};

const logOutUser = async (req, res) => {
    try {
        await User.findByIdAndUpdate(
            req.user._id, {
            $unset: {
                accessToken: 1
            }
        }, { new: true }
        )
        return res
            .status(201)
            .clearCookie("accessTodo", options)
            .clearCookie("refreshTodo", options)
            .json({success:true, message:"Successfully logout"})

    } catch (error) {
        return res.status(500).json({message:"Internal server error"})
    }
}

export {
    registerUser,
    loginUser,
    logOutUser
}