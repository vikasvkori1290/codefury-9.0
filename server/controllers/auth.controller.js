import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from "../models/User.model.js";

// Generate JWT token
const generateToken = (id) => {
  const secret = process.env.JWT_SECRET || "codefury-local-development-secret";
  return jwt.sign({ id }, secret, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (mongoose.connection.readyState !== 1) return res.status(503).json({ success: false, message: "MongoDB is unavailable." });

    const normalizedEmail = email?.toLowerCase().trim();
    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const user = await User.create({ name, email: normalizedEmail, password });
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: { _id: user._id, name: user.name, email: user.email, avatar: user.avatar },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (mongoose.connection.readyState !== 1) return res.status(503).json({ success: false, message: "MongoDB is unavailable." });

    const normalizedEmail = email?.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail }).select("+password");
    const passwordMatches = user && await user.matchPassword(password);
    if (!user || !passwordMatches) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: { _id: user._id, name: user.name, email: user.email, avatar: user.avatar },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current logged-in user
// @route   GET /api/auth/me
export const getMe = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) return res.status(503).json({ success: false, message: "MongoDB is unavailable." });
    const user = await User.findById(req.user.id);
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
