import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="w-full flex justify-between items-center px-6 py-4 border-b border-white/10 bg-black text-white">
      {/* Brand Name */}
      <Link to="/" className="text-xl font-bold tracking-tight">
        CodeFury
      </Link>

      {/* Auth Actions */}
      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-300">
              {user.name}
            </span>
            <button
              onClick={logout}
              className="text-sm px-3 py-1 rounded bg-red-600/20 text-red-400 hover:bg-red-600/30 transition-colors"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-sm text-gray-300 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="text-sm font-semibold px-4 py-1.5 rounded bg-white text-black hover:bg-gray-200 transition-colors"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
