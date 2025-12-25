import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";
export const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user; // 🔥 THIS IS REQUIRED
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};


export const isAuthorized = (...roles) => {
  return (req, re, next) => {
    if (!roles.includes(req.user.role)) {
      return next({
        status: 403,
        message: "You are not authorized to access this resource.",
      });
    }
    next()
  };
};
