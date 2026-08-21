import React, { useState } from "react";
import toast from "react-hot-toast";
import {
  HiOutlineTrophy,
  HiOutlineChevronDown,
  HiOutlineChevronUp,
  HiOutlineSparkles,
  HiOutlineBolt,
  HiOutlineCurrencyDollar,
  HiOutlineShieldCheck,
  HiOutlineArrowPath,
  HiOutlineArrowLeft,
  HiOutlineArrowDownTray,
  HiOutlineRocketLaunch,
  HiOutlineCodeBracket,
} from "react-icons/hi2";
import ModelBadge from "../atoms/ModelBadge";
import CodeBlock from "../atoms/CodeBlock";
import DeployModal from "../modals/DeployModal";

export const Step3VerdictDashboard = ({
  benchmarkResponse,
  priority,
  category,
  prompt,
  onReset,
}) => {
  const [expandedRow, setExpandedRow] = useState(null);
  const [deployTargetModel, setDeployTargetModel] = useState(null);
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);

  const results = benchmarkResponse?.results || [];
  const summary = benchmarkResponse?.summary || {};
  const awards = summary.awards || {};
  const winner = results[0] || {};

  const toggleRow = (modelId) => {
    setExpandedRow((prev) => (prev === modelId ? null : modelId));
  };

  const handleOpenDeployModal = (model) => {
    setDeployTargetModel(model);
    setIsDeployModalOpen(true);
  };

  const handleDownloadReport = (format = "json") => {
    if (format === "json") {
      const reportData = {
        title: "ModelHub Benchmark Evaluation Report",
        timestamp: new Date().toISOString(),
        task_domain: category,
        optimization_priority: priority,
        prompt_preview: prompt,
        summary,
        models_benchmarked: results,
      };

      const blob = new Blob([JSON.stringify(reportData, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `modelhub-benchmark-report-${Date.now()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success("Downloaded JSON Benchmark Report!");
    } else {
      window.print();
    }
  };

  const deploySnippet = `import { ModelHub } from "@modelhub/sdk";

const client = new ModelHub({ apiKey: "mhub_live_8f93b2a4c10e97d" });

const response = await client.models.generate({
  model: "${winner.is_creator ? 'creator/mistral-7b-niche' : winner.model_id || 'mistral-7b-niche'}",
  prompt: ${JSON.stringify(prompt.slice(0, 48))}...,
  priority: "${priority}",
});

console.log("Output:", response.output);
console.log("Latency:", response.latency_ms + "ms");`;

  return (
    <div className="space-y-6 font-sans">
      {/* ==================== 1. VERDICT AWARDS BANNER ==================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Award 1: Best Overall */}
        <div className="p-4 bg-zinc-950 text-white border border-zinc-800 rounded-none flex items-start gap-3 shadow-xs">
          <div className="w-8 h-8 rounded-none bg-[#ea580c] text-white flex items-center justify-center font-bold text-sm shrink-0">
            <HiOutlineTrophy />
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#ea580c] font-bold">
              Best Overall Winner
            </span>
            <div className="text-xs font-bold truncate text-zinc-100">{awards.best_overall || winner.model_name}</div>
            <div className="text-[10px] text-zinc-400 font-mono">
              Composite Score: <span className="text-emerald-400 font-bold">{winner.composite_score || 88.5}/100</span>
            </div>
          </div>
        </div>

        {/* Award 2: Fastest Response */}
        <div className="p-4 bg-white border border-[#e4e4e7] rounded-none flex items-start gap-3 shadow-xs">
          <div className="w-8 h-8 rounded-none bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-bold text-sm shrink-0">
            <HiOutlineBolt />
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-700 font-bold">
              Fastest Response
            </span>
            <div className="text-xs font-bold truncate text-zinc-900">{summary.fastest_model || "Creator Model"}</div>
            <div className="text-[10px] text-zinc-500 font-mono">
              Latency: <span className="font-bold text-emerald-700">{summary.fastest_latency_ms || 111}ms</span>
            </div>
          </div>
        </div>

        {/* Award 3: Most Cost-Effective */}
        <div className="p-4 bg-white border border-[#e4e4e7] rounded-none flex items-start gap-3 shadow-xs">
          <div className="w-8 h-8 rounded-none bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center font-bold text-sm shrink-0">
            <HiOutlineCurrencyDollar />
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-blue-700 font-bold">
              Most Cost-Effective
            </span>
            <div className="text-xs font-bold truncate text-zinc-900">{awards.most_cost_effective || "Mistral-7B-Niche"}</div>
            <div className="text-[10px] text-zinc-500 font-mono">
              Cost: <span className="font-bold text-blue-700">${summary.cheapest_cost_usd?.toFixed(6) || "0.000008"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ==================== 2. COMPARISON TABLE MATRIX ==================== */}
      <div className="space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <label className="text-xs font-bold text-zinc-900 uppercase tracking-wider font-mono flex items-center gap-2">
            <HiOutlineSparkles className="text-[#ea580c]" />
            <span>Multi-Model Comparison Matrix & LLM Judge Verdict</span>
          </label>

          {/* Download Report Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleDownloadReport("json")}
              className="text-[11px] font-mono font-medium px-2.5 py-1 bg-white border border-zinc-300 hover:bg-zinc-50 text-zinc-700 rounded-none transition-all flex items-center gap-1 cursor-pointer"
              title="Download JSON Report"
            >
              <HiOutlineArrowDownTray className="text-xs" />
              <span>Export JSON Report</span>
            </button>
            <button
              onClick={() => handleDownloadReport("pdf")}
              className="text-[11px] font-mono font-medium px-2.5 py-1 bg-white border border-zinc-300 hover:bg-zinc-50 text-zinc-700 rounded-none transition-all flex items-center gap-1 cursor-pointer"
              title="Print / Save as PDF"
            >
              <span>Print / PDF</span>
            </button>
          </div>
        </div>

        <div className="border border-[#e4e4e7] bg-white rounded-none overflow-hidden shadow-xs font-mono text-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#141418] text-zinc-300 border-b border-zinc-800 text-[11px]">
                  <th className="p-3 font-semibold">Rank & Award</th>
                  <th className="p-3 font-semibold">Model & Provider</th>
                  <th className="p-3 font-semibold">Response Preview</th>
                  <th className="p-3 font-semibold">Latency</th>
                  <th className="p-3 font-semibold">Cost / 1k</th>
                  <th className="p-3 font-semibold">Judge Score</th>
                  <th className="p-3 font-semibold text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e4e4e7]">
                {results.map((m) => {
                  const isExpanded = expandedRow === m.model_id;
                  const isWinner = m.rank === 1;

                  return (
                    <React.Fragment key={m.model_id}>
                      <tr
                        className={`transition-colors ${
                          isWinner
                            ? "bg-orange-50/40 hover:bg-orange-50/70"
                            : "hover:bg-zinc-50"
                        }`}
                      >
                        {/* Rank & Award */}
                        <td className="p-3">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`w-5 h-5 rounded-none flex items-center justify-center text-[10px] font-bold ${
                                isWinner
                                  ? "bg-[#ea580c] text-white"
                                  : "bg-zinc-100 text-zinc-700 border border-zinc-300"
                              }`}
                            >
                              #{m.rank || 1}
                            </span>
                            {m.all_awards?.length > 0 && (
                              <span className="text-[10px] font-bold text-[#ea580c] bg-orange-100/60 px-1.5 py-0.5 rounded-none border border-orange-200 truncate">
                                {m.all_awards[0]}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Model Name & Provider */}
                        <td className="p-3">
                          <div className="space-y-0.5">
                            <div className="font-bold text-zinc-900 truncate max-w-[170px]">
                              {m.model_name}
                            </div>
                            <ModelBadge type={m.creator_type} size="sm">
                              {m.provider}
                            </ModelBadge>
                          </div>
                        </td>

                        {/* Output Preview */}
                        <td className="p-3 max-w-[190px]">
                          <span
                            onClick={() => toggleRow(m.model_id)}
                            className="text-[11px] text-zinc-600 truncate block font-sans cursor-pointer hover:text-black"
                            title="Click to expand"
                          >
                            {m.output_text}
                          </span>
                        </td>

                        {/* Latency */}
                        <td className="p-3">
                          <span className="font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 border border-emerald-200 rounded-none text-[11px]">
                            {m.latency_ms} ms
                          </span>
                        </td>

                        {/* Cost per 1k calls */}
                        <td className="p-3 text-zinc-800 font-semibold">
                          ${m.cost_per_1k_calls || (m.estimated_cost_usd * 1000).toFixed(4)}
                        </td>

                        {/* Quality Score (out of 10) */}
                        <td className="p-3">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-zinc-900 text-sm">
                              {m.judge_score || 7.2}
                            </span>
                            <span className="text-[10px] text-zinc-400">/10</span>
                          </div>
                        </td>

                        {/* 1-Click Action Buttons */}
                        <td className="p-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            {isWinner ? (
                              <button
                                onClick={() => handleOpenDeployModal(m)}
                                className="px-3 py-1.5 bg-[#ea580c] hover:bg-[#c2410c] text-white text-[11px] font-bold rounded-none transition-all flex items-center gap-1 shadow-xs cursor-pointer active:scale-95"
                              >
                                <HiOutlineRocketLaunch className="text-xs" />
                                <span>Deploy Model</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => handleOpenDeployModal(m)}
                                className="px-2.5 py-1.5 bg-zinc-900 hover:bg-black text-white text-[11px] font-medium rounded-none transition-all flex items-center gap-1 cursor-pointer active:scale-95"
                              >
                                <HiOutlineCodeBracket className="text-xs text-zinc-400" />
                                <span>Use API</span>
                              </button>
                            )}

                            <button
                              onClick={() => toggleRow(m.model_id)}
                              className="p-1.5 text-zinc-400 hover:text-black rounded-none cursor-pointer"
                              title="Inspect Critique"
                            >
                              {isExpanded ? <HiOutlineChevronUp /> : <HiOutlineChevronDown />}
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Expandable Row Content: Full Output & Judge's Critique */}
                      {isExpanded && (
                        <tr className="bg-[#fafafa] border-b border-[#e4e4e7]">
                          <td colSpan={7} className="p-4 space-y-3 font-sans">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {/* Left: Full Model Response */}
                              <div className="space-y-1.5">
                                <span className="text-[11px] font-mono font-bold text-zinc-700 uppercase flex items-center justify-between">
                                  <span>Full Output Response:</span>
                                  <span className="text-[10px] text-zinc-400 font-normal font-mono">
                                    Tokens: {m.tokens_used?.prompt_tokens} in / {m.tokens_used?.completion_tokens} out
                                  </span>
                                </span>
                                <div className="p-3 bg-white border border-[#e4e4e7] rounded-none font-mono text-xs text-zinc-800 leading-relaxed overflow-x-auto max-h-40 shadow-inner">
                                  <pre className="whitespace-pre-wrap">{m.output_text}</pre>
                                </div>
                              </div>

                              {/* Right: LLM Judge Critique */}
                              <div className="space-y-1.5">
                                <span className="text-[11px] font-mono font-bold text-zinc-700 uppercase flex items-center gap-1.5">
                                  <HiOutlineShieldCheck className="text-blue-600" />
                                  <span>LLM Judge Quality Critique:</span>
                                </span>
                                <div className="p-3 bg-white border border-blue-100 rounded-none text-xs text-zinc-700 leading-relaxed space-y-2">
                                  <p className="italic font-serif text-zinc-800">
                                    "{m.judge_critique || 'Standard response matching parameters.'}"
                                  </p>
                                  <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-[11px] font-mono">
                                    <span className="text-zinc-500">Composite Score:</span>
                                    <span className="font-bold text-zinc-900">{m.composite_score}/100</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ==================== 3. SDK INTEGRATION CODE BLOCK ==================== */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold text-zinc-800 uppercase tracking-wider">
            Quick 1-Line SDK Integration
          </span>
          <button
            onClick={() => handleOpenDeployModal(winner)}
            className="text-xs text-[#ea580c] font-mono font-bold hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Open API Key & Deploy Console</span>
            <span>→</span>
          </button>
        </div>
        <CodeBlock code={deploySnippet} language="typescript" filename="deploy-benchmark.ts" />
      </div>

      {/* ==================== 4. ACTION CONTROLS ==================== */}
      <div className="pt-2 flex items-center justify-between">
        <button
          onClick={onReset}
          className="text-xs font-semibold px-4 py-2 rounded-none border border-zinc-300 hover:bg-zinc-50 text-zinc-700 transition-all flex items-center gap-1.5 cursor-pointer font-mono"
        >
          <HiOutlineArrowLeft className="text-xs" />
          <span>Configure New Test</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleOpenDeployModal(winner)}
            className="text-xs font-semibold px-5 py-2.5 rounded-none bg-[#ea580c] hover:bg-[#c2410c] text-white transition-all flex items-center gap-1.5 cursor-pointer font-mono shadow-xs"
          >
            <HiOutlineRocketLaunch className="text-sm" />
            <span>1-Click Deploy Winning Model</span>
          </button>
        </div>
      </div>

      {/* ==================== 5. DEPLOY & CHECKOUT MODAL ==================== */}
      <DeployModal
        isOpen={isDeployModalOpen}
        onClose={() => setIsDeployModalOpen(false)}
        selectedModel={deployTargetModel || winner}
        prompt={prompt}
        priority={priority}
      />
    </div>
  );
};

export default Step3VerdictDashboard;
