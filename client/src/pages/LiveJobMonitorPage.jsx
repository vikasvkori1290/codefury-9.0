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
  const [showCompletionReport, setShowCompletionReport] = useState(false);
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
        if (data.status === "completed") setShowCompletionReport(true);
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

  const sanitizeDisplayName = (raw) => {
    if (!raw) return "Local Model";
    if (
      raw.startsWith("AIza") ||
      raw.startsWith("AQ.") ||
      raw.startsWith("gsk_") ||
      raw.startsWith("sk-") ||
      raw.startsWith("xai-") ||
      raw.length > 25
    ) {
      return "Remote API Model";
    }
    return raw;
  };

  const sanitizeLog = (line) => {
    if (!line) return "";
    return String(line).replace(
      /(AIza[0-9A-Za-z-_]{15,}|gsk_[0-9A-Za-z]{15,}|sk-[0-9A-Za-z]{15,}|AQ\.[0-9A-Za-z-_]{15,}|xai-[0-9A-Za-z-_]{15,})/g,
      "[REDACTED_KEY]"
    );
  };

  const status = jobData?.status || "queued";
  const progress = jobData?.progress || 0;
  const metrics = jobData?.metrics;
  const logs = (jobData?.logs || []).map(sanitizeLog);

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
              <span className="text-[#ea580c] font-mono">{sanitizeDisplayName(jobData?.modelName)}</span>
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
             <span className="font-bold text-[#ea580c]">{status === "completed" ? "100% COMPLETE" : `${progress}%`}</span>
          </div>

          <div className="w-full h-2.5 bg-zinc-100 border border-[#e4e4e7] rounded-none overflow-hidden">
            <div
              className="h-full bg-[#ea580c] transition-all duration-300 rounded-none"
              style={{ width: `${progress}%` }}
            />
          </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-1.5 pt-1 text-[10px]">
              {[
                "01 Reasoning",
                "02 Coding",
                "03 Agentic",
                "04 Mathematics",
                "05 Data Analysis",
                "06 Language",
                "07 Instruction",
              ].map((stage, index) => {
                const threshold = (index + 1) * 14;
                const active = progress >= threshold || status === "completed";
                return (
                  <div
                    key={stage}
                    className={`border px-2 py-1.5 text-center transition-colors ${
                      active
                        ? "border-orange-200 bg-orange-50 text-[#ea580c] font-bold"
                        : "border-zinc-200 bg-zinc-50 text-zinc-400"
                    }`}
                  >
                    {stage}
                  </div>
                );
              })}
            </div>
            <div className="flex items-center justify-between border-t border-zinc-100 pt-3 font-mono text-[10px] text-zinc-400">
              <span>{status === "completed" ? "All 35 test cases evaluated and scorecard persisted in MongoDB." : `Executing benchmark suite: ${Math.min(35, Math.floor(Math.max(0, progress - 10) / 85 * 35))}/35 cases completed.`}</span>
              <span className={status === "completed" ? "font-bold text-emerald-700" : "text-[#ea580c]"}>{status === "completed" ? "READY" : "LIVE"}</span>
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

            {/* 7-Category Breakdown Bars */}
            <div className="p-6 bg-white border border-[#e4e4e7] rounded-none shadow-xs space-y-4 font-mono text-xs">
              <span className="font-bold text-zinc-900 uppercase tracking-wider block">
                7-Domain Capability Breakdown
              </span>

              <div className="space-y-3">
                {[
                  { label: "Reasoning (Logic & Multi-Step Deduction)", score: metrics.categoryScores?.reasoning },
                  { label: "Coding (Algorithms & Syntax Validations)", score: metrics.categoryScores?.coding },
                  { label: "Agentic Coding (Tool JSON & Patching)", score: metrics.categoryScores?.agentic_coding },
                  { label: "Mathematics (Algebra, Arithmetic & Rates)", score: metrics.categoryScores?.mathematics },
                  { label: "Data Analysis (JSON/Table Aggregations)", score: metrics.categoryScores?.data_analysis },
                  { label: "Language (MMLU & Comprehension)", score: metrics.categoryScores?.language },
                  { label: "Instruction Following (Strict Constraints)", score: metrics.categoryScores?.instruction },
                ].map((item) => (
                  <div key={item.label} className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-zinc-600">{item.label}</span>
                      <span className="font-bold text-emerald-700">{item.score ?? 0}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-zinc-100 border border-[#e4e4e7] rounded-none overflow-hidden">
                      <div
                        className="h-full bg-emerald-600 rounded-none"
                        style={{ width: `${item.score ?? 0}%` }}
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
      {showCompletionReport && status === "completed" && metrics && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 p-4" role="dialog" aria-modal="true" aria-labelledby="benchmark-report-title">
          <div className="w-full max-w-lg space-y-5 border border-zinc-200 bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div><div className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#ea580c]">Benchmark complete</div><h2 id="benchmark-report-title" className="mt-1 text-xl font-bold text-zinc-950">{jobData.modelName} scorecard</h2></div>
              <button type="button" onClick={() => setShowCompletionReport(false)} className="font-mono text-xs text-zinc-500 hover:text-zinc-950">Close</button>
            </div>
            <div className="grid grid-cols-3 gap-2 font-mono text-center">
              <div className="border border-emerald-200 bg-emerald-50 p-3"><div className="text-[10px] text-zinc-500">PASS RATE</div><div className="mt-1 text-xl font-bold text-emerald-700">{metrics.overallPassRate}%</div></div>
              <div className="border border-zinc-200 bg-zinc-50 p-3"><div className="text-[10px] text-zinc-500">AVG LATENCY</div><div className="mt-1 text-xl font-bold text-zinc-900">{metrics.avgLatencyMs}ms</div></div>
              <div className="border border-zinc-200 bg-zinc-50 p-3"><div className="text-[10px] text-zinc-500">CASES</div><div className="mt-1 text-xl font-bold text-zinc-900">{metrics.passedCases}/{metrics.totalCases}</div></div>
            </div>
            <p className="font-mono text-xs text-zinc-600">This result is now included in CodeFury Creator Rankings and will be ranked against other completed creator models by pass rate.</p>
            <div className="flex justify-end gap-2"><button type="button" onClick={() => setShowCompletionReport(false)} className="border border-zinc-300 px-4 py-2 font-mono text-xs text-zinc-700">Review details</button><Link to="/live-bench" onClick={() => setShowCompletionReport(false)} className="bg-[#ea580c] px-4 py-2 font-mono text-xs font-bold text-white hover:bg-[#c2410c]">Open Live Bench</Link></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveJobMonitorPage;
