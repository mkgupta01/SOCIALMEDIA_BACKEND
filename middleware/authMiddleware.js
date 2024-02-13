const user = require("../model/user.model");
const jwt = require("jsonwebtoken");

exports.isLoggedIn = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            return res.status(401).json({
                message: "Please Login"
            });
        }

        const decoded = await jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded || !decoded._id) {
            return res.status(401).json({
                message: "Invalid token or user ID"
            });
        }

        const foundUser = await user.findById(decoded._id);

        if (!foundUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        req.user = foundUser;
        next();
    } catch (error) {
        console.error("LoggedIn middleware error:", error); // Log the error for debugging
        res.status(500).json({
            success: false,
            message: "An internal server error occurred"
        });
    }
};
