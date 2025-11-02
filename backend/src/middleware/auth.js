import jwt from "jsonwebtoken";
import User from "../models/User.js";

const { JWT_SECRET = "dev_secret_change_me" } = process.env;

export async function requireAuth(req, res, next) {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const { uid } = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(uid);
    
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    
    if (!user.isActive) {
      return res.status(401).json({ message: "Account deactivated" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: "Session expired, please login again" });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: "Invalid token format" });
    }
    
    if (error.name === 'NotBeforeError') {
      return res.status(401).json({ message: "Token not active yet" });
    }
    
    return res.status(401).json({ message: "Invalid authentication" });
  }
}