import React from "react";
import { HiOutlineSparkles, HiOutlineCpuChip } from "react-icons/hi2";

const LiveBenchPage = () => {
  return (
    <div className="min-h-screen bg-[#fafafa] text-zinc-900 font-sans selection:bg-[#ea580c] selection:text-white py-12 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header Bar */}
        <div className="p-6 bg-white border border-[#e4e4e7] rounded-none shadow-xs space-y-2">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-orange-50 border border-orange-200 text-xs font-mono text-[#ea580c] font-bold">
            <HiOutlineSparkles />
            <span>Live Bench Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 font-sans">
            Live Bench
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 font-sans">
            Live streaming evaluation telemetry and real-time inference throughput monitoring.
          </p>
        </div>

        {/* Empty Canvas / Container for next phase */}
        <div className="bg-white border border-[#e4e4e7] p-16 text-center rounded-none shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-none bg-zinc-100 border border-zinc-200 text-zinc-400 mx-auto flex items-center justify-center text-2xl font-mono">
            <HiOutlineCpuChip />
          </div>
          <h3 className="text-base font-bold text-zinc-800 font-sans">
            Live Bench Workspace
          </h3>
          <p className="text-xs text-zinc-500 font-mono max-w-md mx-auto">
            Ready for real-time model streaming telemetry, concurrent request monitors, and custom creator endpoints.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LiveBenchPage;
