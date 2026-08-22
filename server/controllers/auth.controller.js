import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from "../models/User.model.js";
import Otp from "../models/Otp.model.js";
import { sendOtpEmail } from "../services/email.service.js";
import connectDB from "../config/db.js";

// Generate JWT token
const generateToken = (id) => {
  const secret = process.env.JWT_SECRET || "codefury-local-development-secret";
  return jwt.sign({ id }, secret, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });
};

// Helper to guarantee database connection in serverless lambdas
const ensureDb = async () => {
  if (mongoose.connection.readyState !== 1) {
    await connectDB();
  }
};

// @desc    Send OTP to email for Sign-Up Verification
// @route   POST /api/auth/send-signup-otp
export const sendSignupOtp = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Please fill in all fields (name, email, password)." });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters." });
    }

    await ensureDb();

    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ success: false, message: "Database is connecting... Please try again in a few seconds." });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) {
      return res.status(400).json({ success: false, message: "An account with this email already exists. Please sign in." });
    }

    // Generate random 6-digit numeric OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Clean up any previous pending OTP for this email
    await Otp.deleteMany({ email: normalizedEmail });

    // Store pending registration with 10-minute auto-expiry TTL
    await Otp.create({
      email: normalizedEmail,
      name: name.trim(),
      password,
      otp,
    });

    // Send email with OTP
    const emailResult = await sendOtpEmail(normalizedEmail, otp, name.trim());

    res.status(200).json({
      success: true,
      message: "Verification code sent to your email.",
      email: normalizedEmail,
      devMode: emailResult.mode === "development_console",
      otp: process.env.NODE_ENV === "development" ? otp : undefined,
    });
  } catch (error) {
    console.error("sendSignupOtp error:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to send verification code." });
  }
};

// @desc    Verify OTP and complete user registration
// @route   POST /api/auth/verify-signup-otp
export const verifySignupOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: "Please provide your email and the 6-digit verification code." });
    }

    await ensureDb();

    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ success: false, message: "Database is unavailable. Please try again." });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const cleanOtp = otp.toString().trim();

    // Find pending OTP record
    const otpRecord = await Otp.findOne({ email: normalizedEmail, otp: cleanOtp });

    if (!otpRecord) {
      return res.status(400).json({ success: false, message: "Invalid or expired verification code. Please request a new one." });
    }

    // Double check user doesn't already exist
    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) {
      await Otp.deleteMany({ email: normalizedEmail });
      return res.status(400).json({ success: false, message: "An account with this email is already registered. Please sign in." });
    }

    // Create the verified user
    const user = await User.create({
      name: otpRecord.name,
      email: otpRecord.email,
      password: otpRecord.password,
    });

    // Delete used OTP
    await Otp.deleteMany({ email: normalizedEmail });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: "Email verified successfully! Welcome to Forge.",
      token,
      user: { _id: user._id, name: user.name, email: user.email, avatar: user.avatar },
    });
  } catch (error) {
    console.error("verifySignupOtp error:", error);
    res.status(500).json({ success: false, message: error.message || "Verification failed." });
  }
};

// @desc    Resend OTP to email
// @route   POST /api/auth/resend-signup-otp
export const resendSignupOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required." });
    }

    await ensureDb();

    const normalizedEmail = email.toLowerCase().trim();
    const pendingRecord = await Otp.findOne({ email: normalizedEmail });

    if (!pendingRecord) {
      return res.status(400).json({ success: false, message: "No pending registration found for this email. Please start sign up again." });
    }

    // Generate new OTP
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    pendingRecord.otp = newOtp;
    pendingRecord.createdAt = new Date();
    await pendingRecord.save();

    // Send email
    await sendOtpEmail(normalizedEmail, newOtp, pendingRecord.name);

    res.status(200).json({
      success: true,
      message: "New verification code sent to your email.",
      email: normalizedEmail,
      otp: process.env.NODE_ENV === "development" ? newOtp : undefined,
    });
  } catch (error) {
    console.error("resendSignupOtp error:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to resend code." });
  }
};

// @desc    Register a new user (Direct fallback)
// @route   POST /api/auth/register
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    await ensureDb();
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

// @desc    Login user (Direct credential check)
// @route   POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Please provide both email and password." });
    }

    await ensureDb();
    if (mongoose.connection.readyState !== 1) return res.status(503).json({ success: false, message: "MongoDB is unavailable." });

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail }).select("+password");
    const passwordMatches = user && (await user.matchPassword(password));

    if (!user || !passwordMatches) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: "Logged in successfully.",
      token,
      user: { _id: user._id, name: user.name, email: user.email, avatar: user.avatar },
    });
  } catch (error) {
    console.error("login error:", error);
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
