import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  HiOutlineBars3,
  HiOutlineBeaker,
  HiOutlineCreditCard,
  HiOutlineXMark,
  HiOutlineSparkles,
} from "react-icons/hi2";
import { FaGithub } from "react-icons/fa6";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!profileRef.current?.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setIsProfileOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const closeProfile = () => setIsProfileOpen(false);

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
              F
            </div>
            <span className="font-bold text-base text-black tracking-tight font-sans hidden sm:inline">
              Forge
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

            <Link
              to="/docs"
                className={navLinkClass(location.pathname === "/docs")}
            >
              <span>Docs</span>
            </Link>
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 text-xs font-sans shrink-0">
          {/* GitHub Repo Link */}
          <a
            href="https://github.com/vikasvkori1290/codefury-9.0"
            target="_blank"
            rel="noopener noreferrer"
            title="View on GitHub (vikasvkori1290/codefury-9.0)"
            className="flex items-center justify-center h-8 w-8 text-zinc-700 hover:text-black hover:bg-zinc-100 border border-zinc-200 transition-all cursor-pointer shadow-2xs hover:border-zinc-400"
          >
            <FaGithub className="text-base" />
          </a>

          {user ? (
            <div className="relative" ref={profileRef}>
              <button
                type="button"
                aria-label="Open profile menu"
                aria-expanded={isProfileOpen}
                onClick={() => setIsProfileOpen((open) => !open)}
                className="flex items-center gap-2 text-zinc-900 hover:text-[#ea580c] transition-colors cursor-pointer"
              >
                <span className="max-w-32 truncate text-xs font-medium text-zinc-700">{user.name}</span>
                <span className="relative h-8 w-8 border-2 border-black bg-[#ea580c] shadow-[2px_2px_0_#111] transition-transform hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none" aria-hidden="true">
                  <span className="absolute left-[6px] top-[6px] h-1 w-1 bg-white" />
                  <span className="absolute left-[18px] top-[6px] h-1 w-1 bg-white" />
                  <span className="absolute left-[6px] top-[10px] h-3 w-4 bg-white" />
                  <span className="absolute left-[10px] top-[13px] h-1 w-1 bg-black" />
                  <span className="absolute left-[18px] top-[13px] h-1 w-1 bg-black" />
                  <span className="absolute left-[14px] top-[17px] h-1 w-1 bg-black" />
                </span>
              </button>
              {isProfileOpen && (
                <div className="absolute right-0 top-11 z-50 w-52 border-2 border-black bg-white p-2 text-left shadow-[4px_4px_0_#ea580c]">
                  <div className="border-b border-zinc-200 px-3 py-2 mb-1">
                    <p className="truncate font-bold text-zinc-900">{user.name}</p>
                    <p className="truncate font-mono text-[10px] text-zinc-500">{user.email}</p>
                  </div>
                  <Link
                    to="/test"
                    onClick={closeProfile}
                    className="flex items-center gap-2 px-3 py-2 font-mono text-xs text-zinc-700 hover:bg-[#fff0e8] hover:text-[#ea580c]"
                  >
                    <HiOutlineBeaker size={16} />
                    Test Bench
                  </Link>
                  <Link
                    to="/plan"
                    onClick={closeProfile}
                    className="flex items-center gap-2 px-3 py-2 font-mono text-xs text-zinc-700 hover:bg-[#fff0e8] hover:text-[#ea580c]"
                  >
                    <HiOutlineCreditCard size={16} />
                    Plan
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      closeProfile();
                      logout();
                    }}
                    className="flex w-full items-center gap-2 border-t border-zinc-200 mt-1 px-3 py-2 font-mono text-xs text-zinc-700 hover:bg-red-50 hover:text-red-700 cursor-pointer"
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link
                to="/login"
                className="px-4 py-2 bg-[#ea580c] text-white font-bold border border-[#ea580c] shadow-[3px_3px_0_#111] hover:-translate-y-0.5 hover:shadow-[4px_4px_0_#111] transition-all"
              >
                Sign in
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
            <Link to="/docs" onClick={closeMenu} className={navLinkClass(location.pathname === "/docs")}>Docs</Link>
            <a
              href="https://github.com/vikasvkori1290/codefury-9.0"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 text-zinc-700 hover:text-black hover:bg-zinc-100 transition-colors"
            >
              <FaGithub className="text-base" />
              <span>GitHub Repository</span>
            </a>
            {!user && <div className="pt-3 mt-2 border-t border-zinc-100 sm:hidden">
              <Link to="/login" onClick={closeMenu} className="block bg-[#ea580c] px-3 py-2 text-center font-bold text-white">Sign in</Link>
            </div>}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
