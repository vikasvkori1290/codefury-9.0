import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import TestPage from "./pages/TestPage";
import LiveBenchPage from "./pages/LiveBenchPage";
import LiveJobMonitorPage from "./pages/LiveJobMonitorPage";
import MarketplacePage from "./pages/MarketplacePage";
import ModelDetailPage from "./pages/ModelDetailPage";
import AgentMarketplacePage from "./pages/AgentMarketplacePage";
import AgentDetailPage from "./pages/AgentDetailPage";
import AuthPage from "./pages/AuthPage";
import ComparePage from "./pages/ComparePage";
import PlaygroundPage from "./pages/PlaygroundPage";

function AppLayout() {
  const location = useLocation();
  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa] text-zinc-900">
      {!isAuthPage && <Navbar />}
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          {/* Test Bench Page (/test) contains the Creator Register & Benchmark Component */}
          <Route path="/test" element={<TestPage />} />
          <Route path="/creator/bench" element={<TestPage />} />
          {/* Live Bench Page (/live-bench) is a dedicated workspace */}
          <Route path="/live-bench" element={<LiveBenchPage />} />
          {/* Benchmark Telemetry Monitor */}
          <Route path="/creator/benchmark/:jobId" element={<LiveJobMonitorPage />} />
          {/* AI Models / Marketplace Explorer */}
          <Route path="/marketplace" element={<MarketplacePage />} />
          <Route path="/models" element={<MarketplacePage />} />
          <Route path="/models/:id" element={<ModelDetailPage />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/playground/:modelId" element={<PlaygroundPage />} />
          {/* Agent Marketplace */}
          <Route path="/agents" element={<AgentMarketplacePage />} />
          <Route path="/agent-marketplace" element={<AgentMarketplacePage />} />
          <Route path="/agents/:id" element={<AgentDetailPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/register" element={<AuthPage />} />
        </Routes>
      </div>
      {!isAuthPage && <Footer />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppLayout />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#18181b",
              color: "#fff",
              border: "1px solid #27272a",
            },
          }}
        />
      </Router>
    </AuthProvider>
  );
}

export default App;
