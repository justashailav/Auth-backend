import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";
export const isAuthenticated = async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(400).json({
      success: false,
      message: "User not authenciated",
    });
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  console.log(decoded);
  req.user = await User.findById(decoded.id);
  next();
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
