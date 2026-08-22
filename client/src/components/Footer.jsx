import React from "react";
import { Link } from "react-router-dom";
import { HiOutlineSparkles } from "react-icons/hi2";

const Footer = () => {
  return (
    <footer className="border-t border-[#e4e4e7] bg-white text-zinc-600 font-sans text-xs mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-5">
        {/* Brand & Tagline */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-6 h-6 bg-[#ea580c] text-white flex items-center justify-center font-bold font-mono text-xs shadow-xs">
              F
            </div>
            <span className="font-bold text-zinc-950 text-sm tracking-tight font-sans">
              Forge
            </span>
          </Link>
          <span className="text-zinc-300">|</span>
          <span className="font-mono text-[11px] text-zinc-500">
            © 2026 Deterministic AI Evaluation Infrastructure
          </span>
        </div>

        {/* Global Navigation Links */}
        <div className="flex flex-wrap items-center gap-5 font-mono text-[11px]">
          <Link to="/test" className="text-zinc-600 hover:text-[#ea580c] transition-colors">
            Test Bench
          </Link>
          <Link to="/live-bench" className="text-zinc-600 hover:text-[#ea580c] transition-colors">
            Live Bench
          </Link>
          <Link to="/models" className="text-zinc-600 hover:text-[#ea580c] transition-colors">
            AI Models
          </Link>
          <Link to="/agents" className="text-zinc-600 hover:text-[#ea580c] transition-colors">
            Agent Marketplace
          </Link>
          <Link to="/compare" className="text-zinc-600 hover:text-[#ea580c] transition-colors">
            Compare
          </Link>
          <Link to="/about" className="text-zinc-600 hover:text-[#ea580c] transition-colors">
            About
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
