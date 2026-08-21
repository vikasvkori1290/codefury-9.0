import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import mongoose from "mongoose";
import jobStore from "../services/jobStore.js";

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: "Not authorized, no token" });
  }

  try {
    const secret = process.env.JWT_SECRET || "codefury-local-development-secret";
    const decoded = jwt.verify(token, secret);
    req.user = mongoose.connection.readyState === 1
      ? await User.findById(decoded.id)
      : jobStore.getUser(decoded.id);
    if (!req.user) return res.status(401).json({ success: false, message: "Not authorized, user not found" });
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Not authorized, token failed" });
  }
};

export default protect;
