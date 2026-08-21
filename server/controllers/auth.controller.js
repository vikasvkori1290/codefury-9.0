import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import User from "../models/User.model.js";
import jobStore from "../services/jobStore.js";

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

    const normalizedEmail = email?.toLowerCase().trim();
    const userExists = mongoose.connection.readyState === 1
      ? await User.findOne({ email: normalizedEmail })
      : jobStore.getUserByEmail(normalizedEmail);
    if (userExists) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const user = mongoose.connection.readyState === 1
      ? await User.create({ name, email: normalizedEmail, password })
      : { _id: `user_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`, name, email: normalizedEmail, password: await bcrypt.hash(password, 10), avatar: "" };
    if (mongoose.connection.readyState !== 1) jobStore.setUser(user._id, user);
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

    const normalizedEmail = email?.toLowerCase().trim();
    const user = mongoose.connection.readyState === 1
      ? await User.findOne({ email: normalizedEmail }).select("+password")
      : jobStore.getUserByEmail(normalizedEmail);
    const passwordMatches = user && mongoose.connection.readyState === 1
      ? await user.matchPassword(password)
      : user && await bcrypt.compare(password, user.password);
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
    const user = mongoose.connection.readyState === 1
      ? await User.findById(req.user.id)
      : jobStore.getUser(req.user.id);
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
