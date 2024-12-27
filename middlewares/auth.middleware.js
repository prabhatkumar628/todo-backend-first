import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const verifyJWT = async (req, res, next) => {
    try {
        const accessToken = req.cookies?.accessTodo || req.header("Authorization")?.replace("Bearer ", "");
        if (!accessToken) {
            return res.status(401).json({ success: false, message: "Unauthorized request. No token provided.",token:false });
        }

        const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        if (!decodedToken?._id) {
            return res.status(401).json({ success: false, message: "Invalid or expired token." });
        }

        const user = await User.findById(decodedToken._id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found. Invalid token." });
        }

        req.user = user;

       return next();
    } catch (error) {
        return res.status(401).json({ success: false, message: error.message || "Unauthorized. Invalid token." });
    }
};

export default verifyJWT;
