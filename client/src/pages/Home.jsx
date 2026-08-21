import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { user, logout } = useAuth();

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden py-12">
      {/* Full Background Landscape Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/Gemini_Generated_Image_4abb4k4abb4k4abb.png')",
        }}
      >
        {/* Subtle overlay for depth */}
        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* Centered Hero Black Card */}
      <main className="relative z-10 w-full max-w-[620px] bg-black text-white rounded-[32px] px-8 sm:px-12 py-12 sm:py-14 text-center shadow-[0_30px_90px_rgba(0,0,0,0.65)] border border-white/10 mx-4">
        {/* Brand Logo with Green Indicator Block */}
        <div className="flex items-center justify-center gap-1.5 mb-6">
          <span className="font-bold text-2xl tracking-tight text-white">
            CodeFury
          </span>
          <span className="w-3.5 h-3.5 bg-[#22c55e] rounded-xs inline-block" />
        </div>

        {/* Edition Pill Badge */}
        <div className="inline-block mb-4">
          <span className="text-xs px-4 py-1 rounded-full border border-white/20 text-white/70 bg-white/5 tracking-wider uppercase">
            9.0 Edition
          </span>
        </div>

        {/* Hero Title in Editorial Serif Italic */}
        <h1
          className="font-serif italic text-6xl sm:text-7xl lg:text-8xl text-white font-normal tracking-wide my-3 leading-none select-none"
          style={{ fontFamily: '"Instrument Serif", Georgia, serif' }}
        >
          Orchestrate
        </h1>

        {/* Subtitle */}
        <p className="text-white/80 text-sm sm:text-base max-w-md mx-auto mb-8 font-normal leading-relaxed">
          A 24-hour hackathon to design, build, and ship an agent.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-sm mx-auto mb-6">
          <Link
            to="/register"
            className="w-full sm:w-auto flex-1 bg-[#a3e635] hover:bg-[#84cc16] text-black font-bold text-sm px-6 py-3.5 rounded-xl transition-all duration-200 shadow-lg hover:shadow-[#a3e635]/20 active:scale-[0.98] text-center"
          >
            Register for Latest Edition
          </Link>

          <Link
            to="/login"
            className="w-full sm:w-auto flex-1 bg-white hover:bg-gray-100 text-black font-bold text-sm px-6 py-3.5 rounded-xl transition-all duration-200 shadow-md active:scale-[0.98] text-center"
          >
            June Edition Leaderboard
          </Link>
        </div>

        {/* ==================== AUTH TESTING SECTION ==================== */}
        <div className="border-t border-white/10 pt-6 mt-6">
          {user ? (
            <div className="bg-white/5 border border-green-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e] animate-pulse" />
                <div>
                  <p className="text-xs text-[#22c55e] font-bold uppercase tracking-wider">
                    Login Successful
                  </p>
                  <p className="text-sm font-semibold text-white">
                    {user.name} <span className="text-white/60 font-normal text-xs">({user.email})</span>
                  </p>
                </div>
              </div>
              <button
                onClick={logout}
                className="text-xs px-3.5 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 font-semibold border border-red-500/30 transition-colors"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 text-xs text-white/60 text-center">
              <span className="inline-block w-2 h-2 rounded-full bg-yellow-400/80 mr-2" />
              Not logged in — test registration or sign in using the buttons above.
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;
