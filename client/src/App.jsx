import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import API from "./api/axios";
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
import AgentSubmissionPage from "./pages/AgentSubmissionPage";
import AuthPage from "./pages/AuthPage";
import ComparePage from "./pages/ComparePage";
import PlaygroundPage from "./pages/PlaygroundPage";
import PlanPage from "./pages/PlanPage";

import ScrollToTop from "./components/ScrollToTop";
import ProtectedRoute from "./components/ProtectedRoute";

function AppLayout() {
  const location = useLocation();
  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";

  // Automated backend warm-up & 8-minute activity pulse
  useEffect(() => {
    const pulseBackend = () => {
      API.get("/health").catch(() => {});
    };

    // Trigger immediately on load
    pulseBackend();

    // Repeat every 8 minutes (480,000 ms) while app is open
    const interval = setInterval(pulseBackend, 8 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa] text-zinc-900">
      {!isAuthPage && <Navbar />}
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          {/* Test Bench Pages (Requires Authentication) */}
          <Route
            path="/test"
            element={
              <ProtectedRoute>
                <TestPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/creator/bench"
            element={
              <ProtectedRoute>
                <TestPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/creator/benchmark/:jobId"
            element={
              <ProtectedRoute>
                <LiveJobMonitorPage />
              </ProtectedRoute>
            }
          />
          {/* Live Bench Page (/live-bench) is a public capability leaderboard */}
          <Route path="/live-bench" element={<LiveBenchPage />} />
          {/* AI Models / Marketplace Explorer: Browsing list is public */}
          <Route path="/marketplace" element={<MarketplacePage />} />
          <Route path="/models" element={<MarketplacePage />} />
          {/* View Model Details: Requires Authentication */}
          <Route
            path="/models/:id"
            element={
              <ProtectedRoute>
                <ModelDetailPage />
              </ProtectedRoute>
            }
          />
          {/* Compare Models: Requires Authentication */}
          <Route
            path="/compare"
            element={
              <ProtectedRoute>
                <ComparePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/playground/:modelId"
            element={
              <ProtectedRoute>
                <PlaygroundPage />
              </ProtectedRoute>
            }
          />
          {/* Agent Marketplace */}
          <Route path="/agents" element={<AgentMarketplacePage />} />
          <Route path="/agent-marketplace" element={<AgentMarketplacePage />} />
          <Route
            path="/agents/request"
            element={
              <ProtectedRoute>
                <AgentSubmissionPage />
              </ProtectedRoute>
            }
          />
          <Route path="/agents/:id" element={<AgentDetailPage />} />
          <Route path="/about" element={<About />} />
          <Route
            path="/plan"
            element={
              <ProtectedRoute>
                <PlanPage />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/register" element={<AuthPage />} />
          {/* Wildcard Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
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
        <ScrollToTop />
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
