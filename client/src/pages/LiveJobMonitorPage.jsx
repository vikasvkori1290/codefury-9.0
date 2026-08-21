import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import {
  HiOutlineCommandLine,
  HiOutlineCheckCircle,
  HiOutlineExclamationTriangle,
  HiOutlineArrowLeft,
  HiOutlineRocketLaunch,
  HiOutlineShieldCheck,
  HiOutlineScale,
  HiOutlineChevronDown,
  HiOutlineChevronUp,
  HiOutlineCodeBracket,
  HiOutlineVariable,
  HiOutlineDocumentText,
  HiOutlineSparkles,
} from "react-icons/hi2";
import API from "../api/axios";

export default function LiveJobMonitorPage() {
  const { jobId } = useParams();
  const [jobData, setJobData] = useState(null);
  const [isPolling, setIsPolling] = useState(true);
  const [expandedCaseId, setExpandedCaseId] = useState(null);
  const terminalEndRef = useRef(null);

  // Poll BullMQ / MongoDB Job Status
  useEffect(() => {
    let interval;
    const fetchStatus = async () => {
      try {
        const { data } = await API.get(`/benchmark/job/${jobId}`);
        if (data && data.job) {
          setJobData(data.job);
          if (data.job.status === "completed" || data.job.status === "failed") {
            setIsPolling(false);
          }
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    };

    fetchStatus();
    if (isPolling) {
      interval = setInterval(fetchStatus, 800);
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
  const testResults = metrics?.testResults || [];

  // 4 Deterministic Categories
  const mathScore = metrics?.deterministicBreakdown?.math_logic ?? metrics?.categoryScores?.math_logic ?? metrics?.categoryScores?.reasoning ?? 0;
  const codeScore = metrics?.deterministicBreakdown?.code_execution ?? metrics?.categoryScores?.code_execution ?? metrics?.categoryScores?.coding ?? 0;
  const schemaScore = metrics?.deterministicBreakdown?.schema_adherence ?? metrics?.categoryScores?.schema_adherence ?? metrics?.categoryScores?.data_analysis ?? 0;
  const ruleScore = metrics?.deterministicBreakdown?.rule_following ?? metrics?.categoryScores?.rule_following ?? metrics?.categoryScores?.instruction ?? 0;

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
                <span>EVALUATING ({progress}%)</span>
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
                <span>QUEUED IN ENGINE</span>
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

        {/* Deterministic Standard Badge */}
        <div className="flex items-center justify-between p-3.5 bg-white border border-[#e4e4e7] font-mono text-xs shadow-xs">
          <div className="flex items-center gap-2 text-emerald-800 font-bold">
            <HiOutlineShieldCheck className="text-base text-emerald-600 shrink-0" />
            <span>Verified by Deterministic Ground-Truth Engine (LiveBench Standard)</span>
          </div>
          <span className="text-zinc-400 text-[11px] hidden sm:inline">Zero LLM Judge Bias • Programmatic Verification</span>
        </div>

        {/* Execution Pipeline Progress Bar */}
        <div className="p-6 bg-white border border-[#e4e4e7] rounded-none shadow-xs space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between text-zinc-700">
            <span className="font-bold uppercase tracking-wider flex items-center gap-2 text-zinc-950">
              <span className="text-[#ea580c]">⚡</span> Execution Pipeline Progress
            </span>
            <span className="text-[#ea580c] font-bold">{progress}%</span>
          </div>

          <div className="w-full bg-zinc-100 h-2 rounded-none overflow-hidden border border-[#e4e4e7]">
            <div
              className="bg-[#ea580c] h-full transition-all duration-300 rounded-none"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* 4 Deterministic Pipeline Stages */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-[11px]">
            {[
              "01 Math & Exact Logic",
              "02 Code Execution",
              "03 Schema Adherence",
              "04 Rule Following",
            ].map((stage, index) => {
              const threshold = (index + 1) * 24;
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
            <span>
              {status === "completed"
                ? "All 20 objective test cases verified against ground truth."
                : `Executing deterministic suite: ${Math.min(20, Math.floor(Math.max(0, progress - 10) / 85 * 20))}/20 cases completed.`}
            </span>
            <span className={status === "completed" ? "font-bold text-emerald-700" : "text-[#ea580c]"}>
              {status === "completed" ? "DETERMINISTIC VERIFIED" : "LIVE"}
            </span>
          </div>
        </div>

        {/* ==================== SCORECARD RESULTS (When Completed) ==================== */}
        {status === "completed" && metrics && (
          <div className="space-y-6 animate-fade-in">
            {/* Top Scorecard Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
              <div className="p-5 bg-white border-2 border-emerald-500 rounded-none shadow-xs space-y-1">
                <span className="text-[10px] text-zinc-500 block uppercase">Composite LiveBench Score</span>
                <div className="text-3xl font-extrabold text-emerald-700">
                  {metrics.overallPassRate}%
                </div>
                <span className="text-[10px] text-zinc-400 font-sans">
                  {metrics.passedCases}/20 Assertions Verified
                </span>
              </div>

              <div className="p-5 bg-white border border-[#e4e4e7] rounded-none shadow-xs space-y-1">
                <span className="text-[10px] text-zinc-500 block uppercase">Inference Latency</span>
                <div className="text-3xl font-extrabold text-zinc-950">
                  {metrics.avgLatencyMs} ms
                </div>
                <span className="text-[10px] text-zinc-400 font-sans">Avg Time-To-First-Token</span>
              </div>

              <div className="p-5 bg-white border border-[#e4e4e7] rounded-none shadow-xs space-y-1">
                <span className="text-[10px] text-zinc-500 block uppercase">Throughput Speed</span>
                <div className="text-3xl font-extrabold text-[#ea580c]">
                  {metrics.tokensPerSecond} TPS
                </div>
                <span className="text-[10px] text-zinc-400 font-sans">Tokens Generated per Second</span>
              </div>
            </div>

            {/* 4 Objective Category Breakdowns */}
            <div className="p-6 bg-white border border-[#e4e4e7] rounded-none shadow-xs space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-zinc-900 uppercase tracking-wider block">
                  Deterministic Domain Breakdown
                </span>
                <span className="text-[10px] text-zinc-500">Programmatic Ground Truth</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 1. Math Logic */}
                <div className="p-4 border border-[#e4e4e7] bg-[#fafafa] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-zinc-800 flex items-center gap-1.5">
                      <HiOutlineVariable className="text-[#ea580c]" />
                      <span>Math & Exact Logic</span>
                    </span>
                    <span className="text-base font-bold text-emerald-700">{mathScore}% Pass</span>
                  </div>
                  <div className="w-full h-2 bg-zinc-200 overflow-hidden">
                    <div className="h-full bg-emerald-600 transition-all duration-500" style={{ width: `${mathScore}%` }} />
                  </div>
                  <p className="text-[10px] text-zinc-500 font-sans">GSM8K logic, arithmetic & combinatorics</p>
                </div>

                {/* 2. Code Execution */}
                <div className="p-4 border border-[#e4e4e7] bg-[#fafafa] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-zinc-800 flex items-center gap-1.5">
                      <HiOutlineCodeBracket className="text-[#ea580c]" />
                      <span>Code Execution</span>
                    </span>
                    <span className="text-base font-bold text-emerald-700">{codeScore}% Pass</span>
                  </div>
                  <div className="w-full h-2 bg-zinc-200 overflow-hidden">
                    <div className="h-full bg-emerald-600 transition-all duration-500" style={{ width: `${codeScore}%` }} />
                  </div>
                  <p className="text-[10px] text-zinc-500 font-sans">Sandboxed Node.js VM unit test execution</p>
                </div>

                {/* 3. Schema Adherence */}
                <div className="p-4 border border-[#e4e4e7] bg-[#fafafa] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-zinc-800 flex items-center gap-1.5">
                      <HiOutlineDocumentText className="text-[#ea580c]" />
                      <span>Schema Adherence</span>
                    </span>
                    <span className="text-base font-bold text-emerald-700">{schemaScore}% Pass</span>
                  </div>
                  <div className="w-full h-2 bg-zinc-200 overflow-hidden">
                    <div className="h-full bg-emerald-600 transition-all duration-500" style={{ width: `${schemaScore}%` }} />
                  </div>
                  <p className="text-[10px] text-zinc-500 font-sans">Strict JSON key typing & structure extraction</p>
                </div>

                {/* 4. Rule Following */}
                <div className="p-4 border border-[#e4e4e7] bg-[#fafafa] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-zinc-800 flex items-center gap-1.5">
                      <HiOutlineSparkles className="text-[#ea580c]" />
                      <span>Rule Following</span>
                    </span>
                    <span className="text-base font-bold text-emerald-700">{ruleScore}% Pass</span>
                  </div>
                  <div className="w-full h-2 bg-zinc-200 overflow-hidden">
                    <div className="h-full bg-emerald-600 transition-all duration-500" style={{ width: `${ruleScore}%` }} />
                  </div>
                  <p className="text-[10px] text-zinc-500 font-sans">Word counts, lipograms, token delimiters</p>
                </div>
              </div>
            </div>

            {/* ==================== INTERACTIVE TEST BREAKDOWN DRAWER ==================== */}
            {testResults.length > 0 && (
              <div className="p-6 bg-white border border-[#e4e4e7] rounded-none shadow-xs space-y-4 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-[#f4f4f5] pb-3">
                  <div>
                    <h3 className="font-bold text-sm text-zinc-950 font-sans">
                      20-Question Ground-Truth Breakdown Drawer
                    </h3>
                    <p className="text-[11px] text-zinc-500">
                      Click any test to inspect the prompt, ground truth expectation, model output, and verification reason.
                    </p>
                  </div>
                  <span className="px-2.5 py-1 bg-zinc-100 text-zinc-700 text-[11px] font-bold">
                    {metrics.passedCases}/{metrics.totalCases || 20} PASSED
                  </span>
                </div>

                <div className="space-y-2">
                  {testResults.map((tc, idx) => {
                    const isExpanded = expandedCaseId === (tc.id || idx);
                    return (
                      <div
                        key={tc.id || idx}
                        className={`border transition-all ${
                          tc.passed
                            ? "border-emerald-200 bg-emerald-50/30"
                            : "border-rose-200 bg-rose-50/30"
                        }`}
                      >
                        {/* Summary Row */}
                        <div
                          onClick={() => setExpandedCaseId(isExpanded ? null : (tc.id || idx))}
                          className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-zinc-50/80 transition-colors select-none"
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={`px-2 py-0.5 text-[10px] font-bold ${
                                tc.passed
                                  ? "bg-emerald-600 text-white"
                                  : "bg-rose-600 text-white"
                              }`}
                            >
                              {tc.passed ? "PASS ✓" : "FAIL ✗"}
                            </span>
                            <span className="font-bold text-zinc-900">
                              #{idx + 1}. {tc.title || tc.id}
                            </span>
                            <span className="text-[10px] text-zinc-400 uppercase hidden sm:inline">
                              [{tc.category}]
                            </span>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="text-[11px] text-zinc-500">{tc.latencyMs}ms</span>
                            {isExpanded ? <HiOutlineChevronUp /> : <HiOutlineChevronDown />}
                          </div>
                        </div>

                        {/* Expanded Drawer Details */}
                        {isExpanded && (
                          <div className="p-4 border-t border-inherit bg-white space-y-3 font-sans text-xs animate-fadeIn">
                            <div className="space-y-1">
                              <span className="font-mono text-[10px] font-bold uppercase text-zinc-400 block">
                                Input Prompt:
                              </span>
                              <div className="p-2.5 bg-[#fafafa] border border-[#e4e4e7] text-zinc-800 text-xs font-mono whitespace-pre-wrap">
                                {tc.prompt}
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-[11px]">
                              <div className="space-y-1">
                                <span className="text-[10px] font-bold uppercase text-zinc-400 block">
                                  Ground Truth Expected:
                                </span>
                                <div className="p-2 bg-emerald-50 border border-emerald-200 text-emerald-900">
                                  {tc.expected}
                                </div>
                              </div>

                              <div className="space-y-1">
                                <span className="text-[10px] font-bold uppercase text-zinc-400 block">
                                  Deterministic Verdict Reason:
                                </span>
                                <div className={`p-2 border ${tc.passed ? "bg-emerald-50 border-emerald-200 text-emerald-900" : "bg-rose-50 border-rose-200 text-rose-900"}`}>
                                  {tc.reason}
                                </div>
                              </div>
                            </div>

                            <div className="space-y-1">
                              <span className="font-mono text-[10px] font-bold uppercase text-zinc-400 block">
                                Actual Model Output:
                              </span>
                              <div className="p-2.5 bg-zinc-950 text-white font-mono text-xs whitespace-pre-wrap max-h-48 overflow-y-auto">
                                {tc.output || "(Empty output)"}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* CTA Navigation Buttons */}
            <div className="p-6 bg-white border border-[#e4e4e7] rounded-none shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
              <div>
                <div className="font-bold text-zinc-900">Evaluation Finished</div>
                <div className="text-zinc-500 text-[11px]">Model listing is ranked in the LiveBench Leaderboard.</div>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <Link
                  to="/live-bench"
                  className="px-5 py-2.5 bg-black hover:bg-zinc-800 text-white font-bold transition-all text-center flex-1 sm:flex-initial"
                >
                  View Global Leaderboard →
                </Link>
                <Link
                  to="/models"
                  className="px-5 py-2.5 border border-zinc-300 hover:bg-zinc-50 text-zinc-800 font-bold transition-all text-center flex-1 sm:flex-initial"
                >
                  AI Models
                </Link>
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
            <span className="text-[10px] text-emerald-500 flex items-center gap-1 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Engine Active</span>
            </span>
          </div>

          <div className="p-4 max-h-72 overflow-y-auto space-y-1.5 text-zinc-300 font-mono text-[11px] leading-relaxed">
            {logs.map((log, idx) => (
              <div
                key={idx}
                className={`flex gap-2 ${
                  log.includes("ERROR") || log.includes("failed") || log.includes("stopped")
                    ? "text-rose-400 font-bold"
                    : log.includes("PASS") || log.includes("complete") || log.includes("validated")
                    ? "text-emerald-400"
                    : log.includes("FAIL")
                    ? "text-amber-400"
                    : "text-zinc-300"
                }`}
              >
                <span className="text-zinc-600 select-none">&gt;</span>
                <span className="whitespace-pre-wrap">{log}</span>
              </div>
            ))}
            <div ref={terminalEndRef} />
          </div>
        </div>
      </div>
    </div>
  );
}
