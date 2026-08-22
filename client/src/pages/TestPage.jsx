import React from "react";
import { HiOutlineSparkles } from "react-icons/hi2";
import CreatorModelSubmitForm from "../components/bench/CreatorModelSubmitForm";
import TestedModelsRankings from "../components/bench/TestedModelsRankings";

const TestPage = () => {
  return (
    <div className="min-h-screen bg-[#fafafa] text-zinc-900 font-sans selection:bg-[#ea580c] selection:text-white py-10 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white border border-[#e4e4e7] rounded-none shadow-xs">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-orange-50 border border-orange-200 text-xs font-mono text-[#ea580c] font-bold">
              <HiOutlineSparkles />
              <span>// CREATOR EVALUATION ENGINE</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 font-sans">
              Benchmark, Verify, and Monetize Your AI Model
            </h1>
            <p className="text-xs sm:text-sm text-zinc-600 font-sans max-w-3xl leading-relaxed">
              Connect your local Ollama instance, custom GGUF weights, or remote API endpoint. Our engine runs an objective suite of 35 deterministic unit tests—evaluating code execution, exact math logic, JSON adherence, and latency—and automatically publishes a verified scorecard to the marketplace.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono font-bold">
              <span className="w-2 h-2 bg-emerald-500 animate-pulse rounded-none" />
              <span>Engine Ready</span>
            </span>
          </div>
        </div>

        {/* Creator Model Submission & Automated Benchmark Form */}
        <CreatorModelSubmitForm />

        {/* Tested Models & Global Rank Leaderboard Component */}
        <TestedModelsRankings />
      </div>
    </div>
  );
};

export default TestPage;
