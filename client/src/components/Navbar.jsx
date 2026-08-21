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
        {/* Left: Brand Logo & Links */}
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-6 h-6 rounded-none bg-[#ea580c] text-white flex items-center justify-center font-bold text-xs font-mono shadow-xs">
              M
            </div>
            <span className="font-bold text-base text-black tracking-tight font-sans">
              ModelHub
            </span>
          </Link>

          <Link
            to="/#about"
            onClick={handleAboutClick}
            className="text-xs font-medium text-zinc-600 hover:text-black transition-colors px-2 py-1 cursor-pointer"
          >
            About
          </Link>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4 text-xs">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-zinc-700 font-medium hidden sm:inline">
                {user.name}
              </span>
              <button
                onClick={logout}
                className="px-3 py-1.5 rounded-none border border-zinc-300 text-zinc-700 hover:text-black hover:bg-zinc-50 font-medium transition-all cursor-pointer"
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
                to="/register"
                className="bg-black hover:bg-zinc-800 text-white font-semibold px-4 py-1.5 rounded-none transition-all flex items-center gap-1 active:scale-95 shadow-xs"
              >
                <span>Get a demo</span>
                <span className="text-zinc-400">›</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
