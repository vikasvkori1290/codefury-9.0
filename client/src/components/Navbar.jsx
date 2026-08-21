import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const handleAboutClick = (e) => {
    if (location.pathname === "/") {
      e.preventDefault();
      const el = document.getElementById("about");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="w-full bg-white border-b border-[#e4e4e7] sticky top-0 z-50 font-sans text-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 h-14 flex items-center justify-between">
        {/* Left: Brand Logo & Navigation Links */}
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-6 h-6 rounded-none bg-[#ea580c] text-white flex items-center justify-center font-bold text-xs font-mono shadow-xs">
              M
            </div>
            <span className="font-bold text-base text-black tracking-tight font-sans">
              ModelHub
            </span>
          </Link>

          <nav className="flex items-center gap-1 sm:gap-2 text-xs font-mono">
            {/* Test Bench Link */}
            <Link
              to="/test"
              className={`px-3 py-1.5 rounded-none transition-all flex items-center gap-1.5 ${
                location.pathname === "/test"
                  ? "bg-black text-white font-bold"
                  : "text-zinc-700 hover:text-black hover:bg-zinc-100 font-medium"
              }`}
            >
              <span className="w-1.5 h-1.5 bg-[#ea580c] rounded-none" />
              <span>Test Bench</span>
            </Link>

            {/* Live Bench Link */}
            <Link
              to="/live-bench"
              className={`px-3 py-1.5 rounded-none transition-all ${
                location.pathname === "/live-bench"
                  ? "bg-black text-white font-bold"
                  : "text-zinc-700 hover:text-black hover:bg-zinc-100 font-medium"
              }`}
            >
              Live Bench
            </Link>

            {/* AI Models Link */}
            <Link
              to="/models"
              className={`px-3 py-1.5 rounded-none transition-all ${
                location.pathname === "/models" || location.pathname.startsWith("/models/")
                  ? "bg-black text-white font-bold"
                  : "text-zinc-700 hover:text-black hover:bg-zinc-100 font-medium"
              }`}
            >
              AI Models
            </Link>

            {/* Agent Marketplace Link */}
            <Link
              to="/agents"
              className={`px-3 py-1.5 rounded-none transition-all flex items-center gap-1.5 ${
                location.pathname === "/agents" || location.pathname.startsWith("/agents/")
                  ? "bg-black text-white font-bold"
                  : "text-zinc-700 hover:text-black hover:bg-zinc-100 font-medium"
              }`}
            >
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-none hidden sm:inline" />
              <span>Agent Marketplace</span>
            </Link>

            {/* About Link */}
            <Link
              to="/#about"
              onClick={handleAboutClick}
              className={`px-3 py-1.5 rounded-none transition-colors hidden sm:inline ${
                location.pathname === "/about"
                  ? "text-[#ea580c] font-bold"
                  : "text-zinc-600 hover:text-black"
              }`}
            >
              About
            </Link>
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4 text-xs font-sans">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-zinc-700 font-medium hidden sm:inline">
                {user.name}
              </span>
              <button
                onClick={logout}
                className="px-3 py-1.5 rounded-none border border-zinc-300 text-zinc-700 hover:text-black hover:bg-zinc-50 font-medium transition-all cursor-pointer font-mono"
              >
                Log out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-zinc-700 hover:text-black font-medium transition-colors"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="text-zinc-700 hover:text-black font-medium transition-colors hidden sm:inline"
              >
                Sign up
              </Link>
              <Link
                to="/test"
                className="bg-[#ea580c] hover:bg-[#c2410c] text-white font-semibold px-4 py-1.5 rounded-none transition-all flex items-center gap-1 active:scale-95 shadow-xs font-mono"
              >
                <span>Live Test</span>
                <span className="text-white/80">›</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
