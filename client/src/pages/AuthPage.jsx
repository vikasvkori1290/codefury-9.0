import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import {
  HiOutlineUser,
  HiOutlineEnvelope,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeSlash,
  HiOutlineArrowLeft,
  HiOutlineShieldCheck,
  HiOutlineArrowPath,
  HiOutlinePencilSquare,
} from "react-icons/hi2";
import "./AuthPage.css";

const AuthPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login, sendSignupOtp, verifySignupOtp, resendSignupOtp } = useAuth();

  const [isLogin, setIsLogin] = useState(location.pathname !== "/register");
  const [isAnimating, setIsAnimating] = useState(false);
  const [isFading, setIsFading] = useState(false);

  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPass, setShowLoginPass] = useState(false);

  // Register state
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [showRegPass, setShowRegPass] = useState(false);

  // OTP Verification state
  const [signupStep, setSignupStep] = useState("form"); // 'form' | 'otp'
  const [otpCode, setOtpCode] = useState("");
  const [countdown, setCountdown] = useState(0);

  const [loading, setLoading] = useState(false);

  // Sync with location pathname on mount or path change
  useEffect(() => {
    if (location.pathname === "/register") {
      setIsLogin(false);
    } else if (location.pathname === "/login") {
      setIsLogin(true);
    }
  }, [location.pathname]);

  // Resend Countdown Timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const toggleMode = () => {
    if (isAnimating) return;
    setIsAnimating(true);

    // Reset OTP step when toggling
    setSignupStep("form");
    setOtpCode("");

    // Phase 1: Fade out the current form
    setIsFading(true);

    // Phase 2: After form fades out, slide the overlay
    setTimeout(() => {
      setIsLogin((prev) => !prev);
      setIsFading(false);
    }, 400);

    // Unlock after entire sequence completes
    setTimeout(() => setIsAnimating(false), 1800);
  };

  // Direct Credential Login
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      await login(loginEmail, loginPassword);
      toast.success("Welcome back! 🎉");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  // Step 1: Send OTP to Email
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!regName || !regEmail || !regPassword) {
      toast.error("Please enter your name, email, and password");
      return;
    }
    if (regPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const res = await sendSignupOtp(regName, regEmail, regPassword);
      toast.success(res.message || "Verification code sent to your email! ✉️");
      setSignupStep("otp");
      setCountdown(45);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send verification code");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP and Sign Up
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otpCode || otpCode.trim().length !== 6) {
      toast.error("Please enter the 6-digit verification code");
      return;
    }

    setLoading(true);
    try {
      await verifySignupOtp(regEmail, otpCode.trim());
      toast.success("Email verified! Account created successfully! 🚀");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid or expired verification code");
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (countdown > 0) return;
    setLoading(true);
    try {
      const res = await resendSignupOtp(regEmail);
      toast.success(res.message || "New verification code sent! ✉️");
      setCountdown(45);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to resend code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Ambient background effects */}
      <div className="auth-bg-glow auth-bg-glow--1" />
      <div className="auth-bg-glow auth-bg-glow--2" />

      <Link to="/" className="auth-back-link">
        <HiOutlineArrowLeft />
        Back to Home
      </Link>

      <div
        className={`auth-container ${!isLogin ? "auth-container--signup" : ""} ${
          isFading ? "auth-container--fading" : ""
        }`}
      >
        {/* ==================== LOGIN FORM PANEL ==================== */}
        <div className="auth-form-panel auth-form-panel--login">
          <form onSubmit={handleLogin} className="auth-form">
            <h2 className="auth-form__title">Sign In</h2>
            <p className="auth-form__subtitle">welcome back</p>

            <div className="auth-input-group">
              <label
                style={{
                  fontSize: "0.6rem",
                  fontFamily: "'Space Mono', monospace",
                  color: "#888",
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                }}
              >
                Email
              </label>
              <input
                type="email"
                className="auth-input"
                placeholder="you@example.com"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>

            <div className="auth-input-group">
              <label
                style={{
                  fontSize: "0.6rem",
                  fontFamily: "'Space Mono', monospace",
                  color: "#888",
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                }}
              >
                Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showLoginPass ? "text" : "password"}
                  className="auth-input"
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="auth-input-toggle"
                  onClick={() => setShowLoginPass(!showLoginPass)}
                  tabIndex={-1}
                >
                  {showLoginPass ? <HiOutlineEyeSlash /> : <HiOutlineEye />}
                </button>
              </div>
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading && isLogin ? <span className="auth-btn__loader" /> : "Sign In"}
            </button>

            <p className="auth-toggle-text auth-toggle-text--mobile">
              No account?{" "}
              <button type="button" onClick={toggleMode} className="auth-toggle-link">
                Sign Up
              </button>
            </p>
          </form>
        </div>

        {/* ==================== REGISTER FORM PANEL WITH EMAIL OTP ==================== */}
        <div className="auth-form-panel auth-form-panel--register">
          {signupStep === "form" ? (
            /* STEP 1: Enter Registration Details */
            <form onSubmit={handleSendOtp} className="auth-form">
              <h2 className="auth-form__title">Create Account</h2>
              <p className="auth-form__subtitle">enter details to receive email code</p>

              <div className="auth-input-group">
                <label
                  style={{
                    fontSize: "0.6rem",
                    fontFamily: "'Space Mono', monospace",
                    color: "#888",
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                  }}
                >
                  Name
                </label>
                <input
                  type="text"
                  className="auth-input"
                  placeholder="Full Name"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  autoComplete="name"
                  required
                />
              </div>

              <div className="auth-input-group">
                <label
                  style={{
                    fontSize: "0.6rem",
                    fontFamily: "'Space Mono', monospace",
                    color: "#888",
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                  }}
                >
                  Gmail / Email
                </label>
                <input
                  type="email"
                  className="auth-input"
                  placeholder="you@gmail.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>

              <div className="auth-input-group">
                <label
                  style={{
                    fontSize: "0.6rem",
                    fontFamily: "'Space Mono', monospace",
                    color: "#888",
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                  }}
                >
                  Password
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showRegPass ? "text" : "password"}
                    className="auth-input"
                    placeholder="min 6 characters"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    className="auth-input-toggle"
                    onClick={() => setShowRegPass(!showRegPass)}
                    tabIndex={-1}
                  >
                    {showRegPass ? <HiOutlineEyeSlash /> : <HiOutlineEye />}
                  </button>
                </div>
              </div>

              <button type="submit" className="auth-btn" disabled={loading}>
                {loading && !isLogin ? (
                  <span className="auth-btn__loader" />
                ) : (
                  "Send Verification Code ✉"
                )}
              </button>

              <p className="auth-toggle-text auth-toggle-text--mobile">
                Have an account?{" "}
                <button type="button" onClick={toggleMode} className="auth-toggle-link">
                  Sign In
                </button>
              </p>
            </form>
          ) : (
            /* STEP 2: Enter 6-Digit Email OTP */
            <form onSubmit={handleVerifyOtp} className="auth-form">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-orange-50 border border-orange-200 text-[11px] font-mono text-[#ea580c] font-bold mb-2">
                <HiOutlineShieldCheck className="text-sm" />
                <span>Verify Your Email</span>
              </div>

              <h2 className="auth-form__title" style={{ fontSize: "1.1rem" }}>
                Enter 6-Digit Code
              </h2>

              <div className="flex items-center justify-between gap-2 p-2 bg-[#f4f4f5] border border-[#e4e4e7] text-[11px] font-mono mb-3">
                <span className="truncate text-zinc-700 font-medium">{regEmail}</span>
                <button
                  type="button"
                  onClick={() => setSignupStep("form")}
                  className="text-[#ea580c] hover:underline flex items-center gap-1 font-bold shrink-0 cursor-pointer"
                  title="Edit email"
                >
                  <HiOutlinePencilSquare />
                  <span>Edit</span>
                </button>
              </div>

              <div className="auth-input-group">
                <label
                  style={{
                    fontSize: "0.6rem",
                    fontFamily: "'Space Mono', monospace",
                    color: "#888",
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                  }}
                >
                  6-Digit OTP Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  autoFocus
                  className="auth-input"
                  placeholder="123456"
                  style={{
                    fontSize: "1.25rem",
                    letterSpacing: "6px",
                    textAlign: "center",
                    fontWeight: "bold",
                    fontFamily: "'Space Mono', monospace",
                  }}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ""))}
                  required
                />
              </div>

              <button type="submit" className="auth-btn" disabled={loading}>
                {loading ? <span className="auth-btn__loader" /> : "Verify & Sign In 🚀"}
              </button>

              {/* Resend OTP section */}
              <div className="flex items-center justify-between pt-2 text-[11px] font-mono">
                {countdown > 0 ? (
                  <span className="text-zinc-400">Resend code in {countdown}s</span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={loading}
                    className="text-[#ea580c] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <HiOutlineArrowPath className="text-xs" />
                    <span>Resend OTP Code</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setSignupStep("form");
                    setOtpCode("");
                  }}
                  className="text-zinc-500 hover:text-black cursor-pointer"
                >
                  Back
                </button>
              </div>
            </form>
          )}
        </div>

        {/* ==================== SLIDING OVERLAY ==================== */}
        <div className="auth-overlay">
          <div className="auth-overlay__gradient" />
          <div className="auth-overlay__content">
            {/* Visible in login mode (right side) — invites user to Sign Up */}
            <div className="auth-overlay-panel auth-overlay-panel--right">
              <h2 className="auth-overlay__title">Welcome!</h2>
              <p className="auth-overlay__text">
                Start your journey with ModelHub.
                <br />
                Create an account with email verification and discover specialized AI.
              </p>
              <button type="button" className="auth-overlay__btn" onClick={toggleMode}>
                Sign Up
              </button>
            </div>

            {/* Visible in signup mode (left side) — invites user to Sign In */}
            <div className="auth-overlay-panel auth-overlay-panel--left">
              <h2 className="auth-overlay__title">Welcome Back!</h2>
              <p className="auth-overlay__text">
                Already verified your account?
                <br />
                Sign in directly to continue your benchmarking journey.
              </p>
              <button type="button" className="auth-overlay__btn" onClick={toggleMode}>
                Sign In
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;

