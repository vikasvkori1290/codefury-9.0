import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { HiOutlineBars3, HiOutlineXMark } from "react-icons/hi2";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  const navLinkClass = (active) =>
    `px-3 py-2 transition-all flex items-center gap-1.5 ${
      active
        ? "bg-black text-white font-bold"
        : "text-zinc-700 hover:text-black hover:bg-zinc-100 font-medium"
    }`;

  return (
    <header className="w-full bg-white/95 backdrop-blur border-b border-[#dbe3ed] sticky top-0 z-50 font-sans text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 min-h-16 flex items-center justify-between gap-4">
        {/* Left: Brand Logo & Navigation Links */}
        <div className="flex items-center gap-6">
          <Link to="/" onClick={closeMenu} className="flex items-center gap-2 group shrink-0">
            <div className="w-8 h-8 bg-[#ea580c] text-white flex items-center justify-center font-bold text-xs font-mono shadow-[3px_3px_0_#111] group-hover:translate-x-0.5 group-hover:translate-y-0.5 group-hover:shadow-[1px_1px_0_#111] transition-all">
              M
            </div>
            <span className="font-bold text-base text-black tracking-tight font-sans hidden sm:inline">
              ModelHub
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1 font-mono text-xs">
            <Link
              to="/test"
                className={navLinkClass(location.pathname === "/test")}
            >
              <span className="w-1.5 h-1.5 bg-[#ea580c] rounded-none hidden sm:inline" />
              <span>Test Bench</span>
            </Link>

            <Link
              to="/live-bench"
                className={navLinkClass(location.pathname === "/live-bench")}
            >
              <span>Live Bench</span>
            </Link>

            <Link
              to="/models"
                className={navLinkClass(location.pathname === "/models" || location.pathname.startsWith("/models/"))}
            >
              <span>AI Models</span>
            </Link>

            <Link
              to="/agents"
                className={navLinkClass(location.pathname === "/agents" || location.pathname.startsWith("/agents/"))}
            >
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-none hidden sm:inline" />
              <span>Agent Marketplace</span>
            </Link>
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 text-xs font-sans shrink-0">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-zinc-700 font-medium hidden md:inline">
                {user.name}
              </span>
              <button
                onClick={logout}
                className="px-3 py-2 border border-zinc-300 text-zinc-700 hover:text-black hover:bg-zinc-50 font-medium transition-all cursor-pointer font-mono"
              >
                Log out
              </button>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link
                to="/login"
                className="px-3 py-2 text-zinc-700 hover:text-black font-medium transition-colors"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-[#ea580c] text-white font-bold border border-[#ea580c] shadow-[3px_3px_0_#111] hover:-translate-y-0.5 hover:shadow-[4px_4px_0_#111] transition-all"
              >
                Sign up
              </Link>
            </div>
          )}
          <button
            type="button"
            aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((open) => !open)}
            className="lg:hidden p-2 text-zinc-900 border border-zinc-200 hover:border-zinc-900 transition-colors"
          >
            {isMenuOpen ? <HiOutlineXMark size={20} /> : <HiOutlineBars3 size={20} />}
          </button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="lg:hidden border-t border-[#dbe3ed] bg-white px-4 py-4">
          <nav className="flex flex-col gap-1 font-mono text-xs">
            <Link to="/test" onClick={closeMenu} className={navLinkClass(location.pathname === "/test")}>Test Bench</Link>
            <Link to="/live-bench" onClick={closeMenu} className={navLinkClass(location.pathname === "/live-bench")}>Live Bench</Link>
            <Link to="/models" onClick={closeMenu} className={navLinkClass(location.pathname === "/models" || location.pathname.startsWith("/models/"))}>AI Models</Link>
            <Link to="/agents" onClick={closeMenu} className={navLinkClass(location.pathname === "/agents" || location.pathname.startsWith("/agents/"))}>Agent Marketplace</Link>
            {!user && <div className="flex gap-2 pt-3 mt-2 border-t border-zinc-100 sm:hidden">
              <Link to="/login" onClick={closeMenu} className="flex-1 border border-zinc-300 px-3 py-2 text-center font-medium">Log in</Link>
              <Link to="/register" onClick={closeMenu} className="flex-1 bg-[#ea580c] px-3 py-2 text-center font-bold text-white">Sign up</Link>
            </div>}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
