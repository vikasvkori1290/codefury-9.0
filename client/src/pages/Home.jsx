import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-[calc(100vh-65px)] bg-black text-white flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-4xl font-bold mb-4">
        CodeFury
      </h1>
      
      {user ? (
        <p className="text-gray-400 text-lg">
          Welcome back, <span className="text-white font-semibold">{user.name}</span>!
        </p>
      ) : (
        <div>
          <p className="text-gray-400 text-lg mb-6">
            Welcome to CodeFury.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/login"
              className="px-5 py-2 rounded bg-white text-black font-semibold text-sm hover:bg-gray-200 transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-5 py-2 rounded border border-white/20 text-white font-semibold text-sm hover:bg-white/10 transition-colors"
            >
              Register
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
