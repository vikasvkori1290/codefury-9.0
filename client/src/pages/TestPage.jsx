import React from "react";
import { HiOutlineSparkles, HiOutlineCpuChip } from "react-icons/hi2";
import WorkflowContainer from "../components/workflow/WorkflowContainer";

const TestPage = () => {
  return (
    <div className="min-h-screen bg-[#fafafa] text-zinc-900 font-sans selection:bg-[#ea580c] selection:text-white py-10 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#e4e4e7] bg-white p-6 rounded-none shadow-xs border">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-orange-50 border border-orange-200 text-xs font-mono text-[#ea580c] font-bold">
              <HiOutlineSparkles />
              <span>Interactive Benchmarking Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 font-sans">
              Test Bench • Evaluation Sandbox
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 font-sans">
              Test creator specialized models against OpenAI, Google, and Anthropic frontier APIs with your exact prompt data.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono">
              <span className="w-2 h-2 bg-emerald-500 animate-pulse rounded-none" />
              <span>4 Endpoints Active</span>
            </span>
          </div>
        </div>

        {/* 3-Step Guided Benchmark Workflow Component */}
        <div className="bg-white border border-[#e4e4e7] rounded-none shadow-xs">
          <WorkflowContainer />
        </div>
      </div>
    </div>
  );
};

export default TestPage;
