import express from "express";
import {
  register,
  login,
  getMe,
  sendSignupOtp,
  verifySignupOtp,
  resendSignupOtp,
} from "../controllers/auth.controller.js";
import protect from "../middleware/auth.middleware.js";

const router = express.Router();

// Email OTP Verification Flow for Sign Up
router.post("/send-signup-otp", sendSignupOtp);
router.post("/verify-signup-otp", verifySignupOtp);
router.post("/resend-signup-otp", resendSignupOtp);

// Direct Credentials & Session
router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);

export default router;

