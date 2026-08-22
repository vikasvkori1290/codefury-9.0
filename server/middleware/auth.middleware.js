import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import mongoose from "mongoose";

// Default developer user for unauthenticated testing / development
const DEV_FALLBACK_USER = {
  _id: "660000000000000000000001",
  username: "developer",
  name: "Developer",
  email: "dev@modelhub.dev",
  role: "developer",
};

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  // If no token during testing/building phase, inject fallback developer user
  if (!token) {
    req.user = DEV_FALLBACK_USER;
    return next();
  }

  try {
    if (mongoose.connection.readyState === 1) {
      const secret = process.env.JWT_SECRET || "codefury-local-development-secret";
      const decoded = jwt.verify(token, secret);
      const user = await User.findById(decoded.id);
      req.user = user || DEV_FALLBACK_USER;
    } else {
      req.user = DEV_FALLBACK_USER;
    }
    next();
  } catch {
    // If token invalid/expired during testing, proceed with fallback user
    req.user = DEV_FALLBACK_USER;
    next();
  }
};

export default protect;
