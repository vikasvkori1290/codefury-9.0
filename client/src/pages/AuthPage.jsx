import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import {
  HiOutlineUser,
  HiOutlineEnvelope,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeSlash,
  HiOutlineArrowLeft,
} from "react-icons/hi2";
import "./AuthPage.css";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
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

  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const toggleMode = () => {
    if (isAnimating) return;
    setIsAnimating(true);

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
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!regName || !regEmail || !regPassword) {
      toast.error("Please fill in all fields");
      return;
    }
    if (regPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      await register(regName, regEmail, regPassword);
      toast.success("Account created! 🚀");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
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

      <div className={`auth-container ${!isLogin ? "auth-container--signup" : ""} ${isFading ? "auth-container--fading" : ""}`}>
        {/* ==================== LOGIN FORM PANEL ==================== */}
        <div className="auth-form-panel auth-form-panel--login">
          <form onSubmit={handleLogin} className="auth-form">
            <h2 className="auth-form__title">Sign In</h2>
            <p className="auth-form__subtitle">welcome back</p>

            <div className="auth-input-group">
              <label style={{ fontSize: "0.6rem", fontFamily: "'Space Mono', monospace", color: "#888", letterSpacing: "1px", textTransform: "uppercase" }}>
                Email
              </label>
              <input
                type="email"
                className="auth-input"
                placeholder="you@example.com"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            <div className="auth-input-group">
              <label style={{ fontSize: "0.6rem", fontFamily: "'Space Mono', monospace", color: "#888", letterSpacing: "1px", textTransform: "uppercase" }}>
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
              {loading && isLogin ? (
                <span className="auth-btn__loader" />
              ) : (
                "Sign In"
              )}
            </button>

            <p className="auth-toggle-text auth-toggle-text--mobile">
              No account?{" "}
              <button type="button" onClick={toggleMode} className="auth-toggle-link">
                Sign Up
              </button>
            </p>
          </form>
        </div>


        {/* ==================== REGISTER FORM PANEL ==================== */}
        <div className="auth-form-panel auth-form-panel--register">
          <form onSubmit={handleRegister} className="auth-form">
            <h2 className="auth-form__title">Create Account</h2>
            <p className="auth-form__subtitle">join us today</p>

            <div className="auth-input-group">
              <label style={{ fontSize: "0.6rem", fontFamily: "'Space Mono', monospace", color: "#888", letterSpacing: "1px", textTransform: "uppercase" }}>
                Name
              </label>
              <input
                type="text"
                className="auth-input"
                placeholder="Full Name"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                autoComplete="name"
              />
            </div>

            <div className="auth-input-group">
              <label style={{ fontSize: "0.6rem", fontFamily: "'Space Mono', monospace", color: "#888", letterSpacing: "1px", textTransform: "uppercase" }}>
                Email
              </label>
              <input
                type="email"
                className="auth-input"
                placeholder="you@example.com"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            <div className="auth-input-group">
              <label style={{ fontSize: "0.6rem", fontFamily: "'Space Mono', monospace", color: "#888", letterSpacing: "1px", textTransform: "uppercase" }}>
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
                "Create Account"
              )}
            </button>

            <p className="auth-toggle-text auth-toggle-text--mobile">
              Have an account?{" "}
              <button type="button" onClick={toggleMode} className="auth-toggle-link">
                Sign In
              </button>
            </p>
          </form>
        </div>

        {/* ==================== SLIDING OVERLAY ==================== */}
        <div className="auth-overlay">
          <div className="auth-overlay__gradient" />
          <div className="auth-overlay__content">
            {/* Visible in login mode (right side) — invites user to Sign Up */}
            <div className="auth-overlay-panel auth-overlay-panel--right">
              <h2 className="auth-overlay__title">Welcome!</h2>
              <p className="auth-overlay__text">
                Start your journey with us.
                <br />
                Create an account and discover amazing things.
              </p>
              <button
                type="button"
                className="auth-overlay__btn"
                onClick={toggleMode}
              >
                Sign Up
              </button>
            </div>

            {/* Visible in signup mode (left side) — invites user to Sign In */}
            <div className="auth-overlay-panel auth-overlay-panel--left">
              <h2 className="auth-overlay__title">Welcome Back!</h2>
              <p className="auth-overlay__text">
                Hope you and your family have a great day.
                <br />
                Sign in to continue your journey with us.
              </p>
              <button
                type="button"
                className="auth-overlay__btn"
                onClick={toggleMode}
              >
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
