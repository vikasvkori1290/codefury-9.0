import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import {
  HiOutlineCpuChip,
  HiOutlineCheckCircle,
  HiOutlineExclamationTriangle,
  HiOutlineArrowPath,
  HiOutlineBolt,
  HiOutlineClock,
  HiOutlineShieldCheck,
  HiOutlineRocketLaunch,
  HiOutlineArrowLeft,
  HiOutlineCommandLine,
} from "react-icons/hi2";

export const LiveJobMonitorPage = () => {
  const { jobId } = useParams();
  const [jobData, setJobData] = useState(null);
  const [error, setError] = useState(null);
  const [isPolling, setIsPolling] = useState(true);
  const terminalEndRef = useRef(null);

  const fetchStatus = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/benchmark/status/${jobId}`);
      if (!res.ok) {
        throw new Error("Job not found or error loading status.");
      }
      const data = await res.json();
      if (data.success) {
        setJobData(data);
        if (data.status === "completed" || data.status === "failed") {
          setIsPolling(false);
        }
      }
    } catch (err) {
      console.warn("Polling error:", err.message);
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchStatus();
    let interval = null;
    if (isPolling) {
      interval = setInterval(fetchStatus, 1500);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [jobId, isPolling]);

  // Auto-scroll terminal log viewer
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [jobData?.logs]);

  const status = jobData?.status || "queued";
  const progress = jobData?.progress || 0;
  const metrics = jobData?.metrics;
  const logs = jobData?.logs || [];

  return (
    <div className="min-h-screen bg-[#fafafa] text-zinc-900 font-sans selection:bg-[#ea580c] selection:text-white py-12 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Top Header Card */}
        <div className="p-6 bg-white border border-[#e4e4e7] rounded-none shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Link
                to="/test"
                className="text-xs font-mono text-zinc-500 hover:text-black flex items-center gap-1 transition-colors"
              >
                <HiOutlineArrowLeft />
                <span>Submit Another Model</span>
              </Link>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-950 font-sans flex items-center gap-2.5">
              <span>Benchmark Telemetry:</span>
              <span className="text-[#ea580c] font-mono">{jobData?.modelName || "Local Model"}</span>
            </h1>
            <p className="text-xs font-mono text-zinc-500">
              Job ID: <span className="text-zinc-700 font-bold">{jobId}</span>
            </p>
          </div>

          {/* Status Badge */}
          <div className="flex items-center gap-3 shrink-0 font-mono text-xs">
            {status === "running" && (
              <span className="px-3 py-1.5 rounded-none bg-orange-50 border border-orange-200 text-[#ea580c] font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-none bg-[#ea580c] animate-pulse" />
                <span>BENCHMARKING ({progress}%)</span>
              </span>
            )}
            {status === "completed" && (
              <span className="px-3 py-1.5 rounded-none bg-emerald-600 text-white font-bold flex items-center gap-1.5 shadow-xs">
                <HiOutlineCheckCircle className="text-base" />
                <span>EVALUATION COMPLETED</span>
              </span>
            )}
            {status === "queued" && (
              <span className="px-3 py-1.5 rounded-none bg-amber-50 border border-amber-200 text-amber-700 font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-none bg-amber-500 animate-pulse" />
                <span>QUEUED IN BULLMQ</span>
              </span>
            )}
            {status === "failed" && (
              <span className="px-3 py-1.5 rounded-none bg-rose-50 border border-rose-200 text-rose-700 font-bold flex items-center gap-1.5">
                <HiOutlineExclamationTriangle className="text-base" />
                <span>FAILED</span>
              </span>
            )}
          </div>
        </div>

        {/* Progress Bar Container */}
        <div className="p-6 bg-white border border-[#e4e4e7] rounded-none shadow-xs space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between text-zinc-700">
            <span className="uppercase tracking-wider font-bold flex items-center gap-2">
              <HiOutlineBolt className="text-[#ea580c]" />
              <span>Execution Pipeline Progress</span>
            </span>
            <span className="font-bold text-[#ea580c]">{progress}%</span>
          </div>

          <div className="w-full h-2.5 bg-zinc-100 border border-[#e4e4e7] rounded-none overflow-hidden">
            <div
              className="h-full bg-[#ea580c] transition-all duration-300 rounded-none"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="grid grid-cols-5 text-[10px] text-zinc-400 pt-1">
            <span className={progress >= 25 ? "text-[#ea580c] font-bold" : ""}>1. GSM8K (Reasoning)</span>
            <span className={progress >= 45 ? "text-[#ea580c] font-bold" : ""}>2. MMLU (Knowledge)</span>
            <span className={progress >= 65 ? "text-[#ea580c] font-bold" : ""}>3. Coding & JSON</span>
            <span className={progress >= 85 ? "text-[#ea580c] font-bold" : ""}>4. Safety Refusals</span>
            <span className={progress >= 100 ? "text-emerald-700 font-bold" : ""}>5. Final Scorecard</span>
          </div>
        </div>

        {/* Scorecard Results (Revealed when completed) */}
        {status === "completed" && metrics && (
          <div className="space-y-4 animate-fade-in">
            {/* Top Scorecard Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
              <div className="p-5 bg-white border border-emerald-300 rounded-none shadow-xs space-y-1">
                <span className="text-[10px] text-zinc-500 block uppercase">Overall Pass Rate</span>
                <div className="text-2xl font-bold text-emerald-700">
                  {metrics.overallPassRate}%
                </div>
                <span className="text-[10px] text-zinc-400 font-sans">Weighted 35-assertion score</span>
              </div>

              <div className="p-5 bg-white border border-[#e4e4e7] rounded-none shadow-xs space-y-1">
                <span className="text-[10px] text-zinc-500 block uppercase">Inference Latency</span>
                <div className="text-2xl font-bold text-zinc-950">
                  {metrics.avgLatencyMs} ms
                </div>
                <span className="text-[10px] text-zinc-400 font-sans">Avg Time-To-First-Token</span>
              </div>

              <div className="p-5 bg-white border border-[#e4e4e7] rounded-none shadow-xs space-y-1">
                <span className="text-[10px] text-zinc-500 block uppercase">Throughput Speed</span>
                <div className="text-2xl font-bold text-[#ea580c]">
                  {metrics.tokensPerSecond} TPS
                </div>
                <span className="text-[10px] text-zinc-400 font-sans">Local GPU/CPU token rate</span>
              </div>
            </div>

            {/* 5-Category Breakdown Bars */}
            <div className="p-6 bg-white border border-[#e4e4e7] rounded-none shadow-xs space-y-4 font-mono text-xs">
              <span className="font-bold text-zinc-900 uppercase tracking-wider block">
                Category Score Breakdown
              </span>

              <div className="space-y-3">
                {[
                  { label: "Reasoning (GSM8K Math & Logic)", score: metrics.categoryScores?.reasoning },
                  { label: "Knowledge (MMLU General QA)", score: metrics.categoryScores?.knowledge },
                  { label: "Coding (HumanEval & SQL)", score: metrics.categoryScores?.coding },
                  { label: "Instruction Adherence & JSON", score: metrics.categoryScores?.instruction },
                  { label: "Safety & Refusal Guardrails", score: metrics.categoryScores?.safety },
                ].map((item) => (
                  <div key={item.label} className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-zinc-600">{item.label}</span>
                      <span className="font-bold text-emerald-700">{item.score}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-zinc-100 border border-[#e4e4e7] rounded-none overflow-hidden">
                      <div
                        className="h-full bg-emerald-600 rounded-none"
                        style={{ width: `${item.score || 90}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Live Terminal Log Viewer */}
        <div className="bg-[#0c0c0e] border border-[#27272a] rounded-none shadow-xl overflow-hidden font-mono text-xs">
          <div className="p-3 bg-[#141418] border-b border-[#27272a] flex items-center justify-between text-[11px] text-zinc-400">
            <div className="flex items-center gap-2">
              <HiOutlineCommandLine className="text-[#ea580c] text-sm" />
              <span className="text-zinc-200 font-bold">Live Execution Terminal Logs</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Promptfoo Daemon Active</span>
            </div>
          </div>

          <div className="p-4 space-y-1.5 max-h-72 overflow-y-auto font-mono text-[11px] leading-relaxed text-zinc-300 scrollbar-thin">
            {logs.length === 0 ? (
              <div className="text-zinc-600 italic">Waiting for execution telemetry...</div>
            ) : (
              logs.map((log, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-[#ea580c] select-none">›</span>
                  <span className={log.includes("complete") ? "text-emerald-400 font-bold" : ""}>
                    {log}
                  </span>
                </div>
              ))
            )}
            <div ref={terminalEndRef} />
          </div>
        </div>

        {/* Action Controls */}
        <div className="pt-2 flex items-center justify-between font-mono text-xs">
          <Link
            to="/test"
            className="px-4 py-2.5 bg-white hover:bg-zinc-50 border border-zinc-300 text-zinc-700 rounded-none transition-all flex items-center gap-2 cursor-pointer"
          >
            <HiOutlineArrowLeft />
            <span>Benchmark Another Model</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              to="/models"
              className="px-5 py-2.5 bg-white hover:bg-zinc-50 border border-zinc-300 text-zinc-800 rounded-none transition-all font-semibold"
            >
              Browse Marketplace
            </Link>

            {status === "completed" && (
              <Link
                to="/marketplace"
                className="px-6 py-2.5 bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold rounded-none transition-all flex items-center gap-1.5 shadow-xs active:scale-95 cursor-pointer"
              >
                <HiOutlineRocketLaunch className="text-sm" />
                <span>View Marketplace Scorecards</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveJobMonitorPage;
