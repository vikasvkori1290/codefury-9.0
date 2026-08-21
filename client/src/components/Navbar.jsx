import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 sm:px-12 pt-6 pointer-events-none">
      {/* Brand Logo */}
      <div className="pointer-events-auto">
        <Link to="/" className="flex items-center gap-1.5 group">
          <span className="font-bold tracking-tight text-xl text-black drop-shadow-sm">
            CodeFury
          </span>
          <span className="w-2.5 h-2.5 bg-[#22c55e] rounded-xs inline-block group-hover:scale-110 transition-transform" />
        </Link>
      </div>

      {/* Auth Actions */}
      <div className="pointer-events-auto flex items-center gap-3">
        {user ? (
          <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-white">
            <span className="text-xs font-semibold">
              Hi, {user.name?.split(" ")[0]}
            </span>
            <button
              onClick={logout}
              className="text-xs px-3 py-1 rounded-full bg-red-500/20 text-red-300 hover:bg-red-500/40 font-medium transition-colors"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="text-xs sm:text-sm font-semibold px-4 py-2 rounded-full text-black/90 hover:text-black transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="text-xs sm:text-sm font-bold px-5 py-2 rounded-full bg-black text-white hover:bg-gray-900 transition-all shadow-md active:scale-95"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
