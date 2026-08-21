import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { HiOutlineEye, HiOutlineEyeSlash } from "react-icons/hi2";

const labelStyle = {
  fontSize: "0.6rem",
  fontFamily: "'Space Mono', monospace",
  color: "#888",
  letterSpacing: "1px",
  textTransform: "uppercase",
  display: "block",
  marginBottom: "4px",
};

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(name, email, password);
      toast.success("Account created successfully!");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4"
      style={{ background: "#f5f0e8" }}
    >
      <div className="glass-card w-full max-w-sm">
        <h2 className="gradient-text" style={{ marginBottom: "4px" }}>
          Create Account
        </h2>
        <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.7rem", color: "#888", marginBottom: "2rem" }}>
          join us today
        </p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div>
            <label style={labelStyle}>Name</label>
            <input
              type="text"
              className="input-field"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              className="input-field"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label style={labelStyle}>Password</label>
            <div style={{ position: "relative" }}>
              <input
                type={showPass ? "text" : "password"}
                className="input-field"
                placeholder="min 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                style={{ position: "absolute", right: 0, bottom: 8, background: "none", border: "none", color: "#888", cursor: "pointer", fontSize: "1rem" }}
                tabIndex={-1}
              >
                {showPass ? <HiOutlineEyeSlash /> : <HiOutlineEye />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn-primary w-full" disabled={loading} style={{ marginTop: "0.5rem" }}>
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        <p style={{ textAlign: "center", fontFamily: "'Space Mono', monospace", fontSize: "0.7rem", color: "#888", marginTop: "1.5rem" }}>
          Have an account?{" "}
          <Link to="/login" style={{ color: "#d4500a", textDecoration: "underline", fontWeight: 700 }}>
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
