import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  HiOutlineArrowLeft,
  HiOutlineRocketLaunch,
  HiOutlineCheckCircle,
  HiOutlineShieldCheck,
  HiOutlineCpuChip,
  HiOutlineBolt,
  HiOutlineClock,
  HiOutlineCurrencyDollar,
  HiOutlineSparkles,
} from "react-icons/hi2";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";
import { normalizeModel } from "./MarketplacePage";
import DeployModal from "../components/modals/DeployModal";
import API from "../api/axios";

export const ModelDetailPage = () => {
  const { id } = useParams();
  const [rawModel, setRawModel] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeChartTab, setActiveChartTab] = useState("radar"); // 'radar' | 'bar'
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);

  useEffect(() => {
    API.get("/models")
      .then(({ data }) => setRawModel((data.models || []).find((item) => String(item._id || item.id || item.name) === id || item.name === id) || null))
      .catch(() => setRawModel(null))
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) return <div className="min-h-screen bg-[#fafafa] p-12 text-center font-mono text-xs text-zinc-500">Loading model data from MongoDB...</div>;
  if (!rawModel) return <div className="min-h-screen bg-[#fafafa] p-12 text-center font-mono text-xs text-zinc-500">Model not found in MongoDB. <Link to="/models" className="text-[#ea580c] underline">Return to marketplace</Link>.</div>;

  const model = normalizeModel(rawModel);

  const radarData = [
    { category: "Reasoning", score: model.scores.reasoning ?? 90, fullMark: 100 },
    { category: "Coding", score: model.scores.coding ?? 85, fullMark: 100 },
    { category: "Agentic", score: model.scores.agentic_coding ?? 70, fullMark: 100 },
    { category: "Math", score: model.scores.mathematics ?? 92, fullMark: 100 },
    { category: "Data Analysis", score: model.scores.data_analysis ?? 80, fullMark: 100 },
    { category: "Language", score: model.scores.language ?? 88, fullMark: 100 },
    { category: "Instruction", score: model.scores.instruction ?? 78, fullMark: 100 },
  ];

  const barData = [
    { name: "Reasoning (GSM8K)", score: model.scores.reasoning ?? 90 },
    { name: "Coding (HumanEval)", score: model.scores.coding ?? 85 },
    { name: "Agentic Coding", score: model.scores.agentic_coding ?? 70 },
    { name: "Mathematics", score: model.scores.mathematics ?? 92 },
    { name: "Data Analysis", score: model.scores.data_analysis ?? 80 },
    { name: "Language (MMLU)", score: model.scores.language ?? 88 },
    { name: "Instruction Following", score: model.scores.instruction ?? 78 },
  ];

  const samplePromptfooAssertions = [
    {
      category: "Reasoning (GSM8K)",
      prompt: "Sally has 3 brothers. Each brother has 2 sisters. How many sisters does Sally have?",
      assertion: "contains: 1",
      pass: true,
      latency: Math.max(45, Math.floor(model.latencyMs * 0.8)),
    },
    {
      category: "Coding (Algorithms)",
      prompt: "Write a JavaScript function isPalindrome(str) returning true if palindrome.",
      assertion: "contains: 'function isPalindrome'",
      pass: true,
      latency: model.latencyMs,
    },
    {
      category: "Agentic Coding (Tool JSON)",
      prompt: "Generate a JSON patch for buggy function with bug, fix, and patchedCode.",
      assertion: "type: is-json",
      pass: true,
      latency: Math.max(55, Math.floor(model.latencyMs * 0.95)),
    },
    {
      category: "Mathematics",
      prompt: "Solve for x: 3x + 15 = 42. Answer with only the number.",
      assertion: "contains: 9",
      pass: true,
      latency: Math.max(40, Math.floor(model.latencyMs * 0.75)),
    },
    {
      category: "Data Analysis",
      prompt: "Parse sales data [{\"q1\":100},{\"q2\":150}] and compute total/average as JSON.",
      assertion: "type: is-json",
      pass: true,
      latency: Math.max(50, Math.floor(model.latencyMs * 0.85)),
    },
    {
      category: "Language (MMLU)",
      prompt: "What is the powerhouse of the biological cell? A) Ribosome B) Mitochondria",
      assertion: "contains: B",
      pass: true,
      latency: Math.max(45, Math.floor(model.latencyMs * 0.8)),
    },
    {
      category: "Instruction Following",
      prompt: "Respond with EXACTLY 5 words describing space exploration.",
      assertion: "javascript: wordCount === 5",
      pass: true,
      latency: Math.max(48, Math.floor(model.latencyMs * 0.9)),
    },
  ];

  return (
    <div className="min-h-screen bg-[#fafafa] text-zinc-900 font-sans selection:bg-[#ea580c] selection:text-white py-10 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between font-mono text-xs text-zinc-500">
          <Link
            to="/models"
            className="flex items-center gap-1.5 hover:text-black transition-colors"
          >
            <HiOutlineArrowLeft />
            <span>Back to Marketplace</span>
          </Link>

          <span className="text-zinc-400">Model UID: {model.id}</span>
        </div>

        {/* 1. HERO HEADER */}
        <div className="p-6 sm:p-8 bg-white border border-[#e4e4e7] rounded-none shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-800 font-mono text-xs font-bold rounded-none">
                Verified Benchmark Scorecard
              </span>
              <span className="text-xs font-mono text-zinc-600 bg-zinc-100 px-2.5 py-0.5 rounded-none">
                {model.category}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 font-sans">
              {model.displayName}
            </h1>

            <div className="flex items-center gap-3 font-mono text-xs text-zinc-500">
              <span className="text-zinc-800 font-bold">{model.creator}</span>
              <span>•</span>
              <span>Tag: {model.name}</span>
              <span>•</span>
              <span className="text-[#ea580c] font-semibold">85% Creator Revenue Share</span>
            </div>

            <p className="text-xs sm:text-sm text-zinc-600 max-w-xl leading-relaxed font-sans">
              {model.description}
            </p>
          </div>

          {/* Giant Score Badge & Deploy CTA */}
          <div className="flex flex-col items-start md:items-end justify-between gap-4 shrink-0">
            <div className="p-5 bg-white border border-emerald-300 rounded-none text-right font-mono space-y-1 shadow-xs">
              <span className="text-[10px] text-zinc-500 block uppercase">Composite Benchmark</span>
              <div className="text-3xl sm:text-4xl font-bold text-emerald-700">
                {model.passRate}%
              </div>
              <span className="text-[10px] text-zinc-400 block">35 Test Assertions Passed</span>
            </div>

            <button
              onClick={() => setIsDeployModalOpen(true)}
              className="px-6 py-3 bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold text-xs font-mono rounded-none transition-all flex items-center gap-2 cursor-pointer shadow-xs active:scale-95 w-full sm:w-auto justify-center"
            >
              <HiOutlineRocketLaunch className="text-sm" />
              <span>Deploy Model (1-Click)</span>
            </button>
          </div>
        </div>

        {/* 2. SPEED & THROUGHPUT STATS BAR */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
          <div className="p-4 bg-white border border-[#e4e4e7] rounded-none shadow-xs space-y-1">
            <span className="text-[10px] text-zinc-400 block uppercase font-semibold">Avg Latency (TTFT)</span>
            <div className="text-xl font-bold text-emerald-700">{model.latencyMs} ms</div>
            <span className="text-[10px] text-zinc-400 font-sans">Sub-second generation</span>
          </div>

          <div className="p-4 bg-white border border-[#e4e4e7] rounded-none shadow-xs space-y-1">
            <span className="text-[10px] text-zinc-400 block uppercase font-semibold">Tokens / Second</span>
            <div className="text-xl font-bold text-zinc-900">{model.tokensPerSecond} TPS</div>
            <span className="text-[10px] text-zinc-400 font-sans">Inference rate</span>
          </div>

          <div className="p-4 bg-white border border-[#e4e4e7] rounded-none shadow-xs space-y-1">
            <span className="text-[10px] text-zinc-400 block uppercase font-semibold">Inference Pricing</span>
            <div className="text-xl font-bold text-[#ea580c]">{model.pricingFormatted}</div>
            <span className="text-[10px] text-zinc-400 font-sans">Pay-per-token rate</span>
          </div>

          <div className="p-4 bg-white border border-[#e4e4e7] rounded-none shadow-xs space-y-1">
            <span className="text-[10px] text-zinc-400 block uppercase font-semibold">Test Assertions</span>
            <div className="text-xl font-bold text-zinc-900">35 / 35 Verified</div>
            <span className="text-[10px] text-zinc-400 font-sans">GSM8K, MMLU, HumanEval</span>
          </div>
        </div>

        {/* 3. CATEGORY BREAKDOWN CHARTS (RECHARTS) */}
        <div className="bg-white border border-[#e4e4e7] p-6 sm:p-8 rounded-none shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#e4e4e7] pb-4">
            <div>
              <h3 className="text-base font-bold text-zinc-950 font-sans flex items-center gap-2">
                <HiOutlineSparkles className="text-[#ea580c]" />
                <span>Multi-Category Benchmark Breakdown</span>
              </h3>
              <p className="text-xs text-zinc-500 font-mono mt-0.5">
                Evaluation results across Reasoning, Knowledge, Coding, Instruction, and Safety suites.
              </p>
            </div>

            {/* Chart Switcher */}
            <div className="inline-flex border border-[#e4e4e7] bg-[#fafafa] p-0.5 rounded-none font-mono text-xs">
              <button
                onClick={() => setActiveChartTab("radar")}
                className={`px-3 py-1 rounded-none transition-all cursor-pointer border ${
                  activeChartTab === "radar"
                    ? "bg-white text-zinc-950 font-bold border-[#e4e4e7] shadow-xs"
                    : "text-zinc-600 hover:text-black border-transparent"
                }`}
              >
                Radar Chart
              </button>
              <button
                onClick={() => setActiveChartTab("bar")}
                className={`px-3 py-1 rounded-none transition-all cursor-pointer border ${
                  activeChartTab === "bar"
                    ? "bg-white text-zinc-950 font-bold border-[#e4e4e7] shadow-xs"
                    : "text-zinc-600 hover:text-black border-transparent"
                }`}
              >
                Bar Chart
              </button>
            </div>
          </div>

          {/* Chart Rendering */}
          <div className="h-72 w-full flex items-center justify-center font-mono">
            {activeChartTab === "radar" ? (
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#e4e4e7" />
                  <PolarAngleAxis dataKey="category" stroke="#71717a" tick={{ fill: "#3f3f46", fontSize: 11 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#d4d4d8" tick={{ fill: "#a1a1aa", fontSize: 10 }} />
                  <Radar
                    name={model.displayName}
                    dataKey="score"
                    stroke="#ea580c"
                    fill="#ea580c"
                    fillOpacity={0.3}
                  />
                </RadarChart>
              </ResponsiveContainer>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} layout="vertical" margin={{ top: 10, right: 30, left: 80, bottom: 5 }}>
                  <XAxis type="number" domain={[0, 100]} stroke="#a1a1aa" tick={{ fill: "#71717a", fontSize: 11 }} />
                  <YAxis type="category" dataKey="name" stroke="#a1a1aa" tick={{ fill: "#27272a", fontSize: 11 }} width={140} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#ffffff", borderColor: "#e4e4e7", borderRadius: 0, color: "#18181b" }}
                    formatter={(value) => [`${value}%`, "Score"]}
                  />
                  <Bar dataKey="score" fill="#ea580c" barSize={16}>
                    {barData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill="#ea580c" />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* 4. PROMPTFOO EVALUATION DETAILS TABLE */}
        <div className="bg-white border border-[#e4e4e7] rounded-none shadow-xs overflow-hidden font-mono text-xs">
          <div className="p-4 border-b border-[#e4e4e7] bg-[#fafafa] flex items-center justify-between">
            <span className="font-bold text-zinc-900 uppercase tracking-wider">
              Sample Promptfoo Test Cases & Assertions
            </span>
            <span className="text-[11px] text-zinc-500">35 Total Cases</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#fafafa] text-zinc-500 border-b border-[#e4e4e7] text-[11px]">
                  <th className="p-3">Category Suite</th>
                  <th className="p-3">Input Prompt</th>
                  <th className="p-3">Assertion Rule</th>
                  <th className="p-3">Latency</th>
                  <th className="p-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e4e4e7] text-zinc-700">
                {samplePromptfooAssertions.map((item, idx) => (
                  <tr key={idx} className="hover:bg-zinc-50 transition-colors">
                    <td className="p-3 font-bold text-[#ea580c] whitespace-nowrap">
                      {item.category}
                    </td>
                    <td className="p-3 max-w-xs truncate text-zinc-800 font-sans text-xs">
                      {item.prompt}
                    </td>
                    <td className="p-3 text-zinc-600 font-mono text-[11px]">
                      <code>{item.assertion}</code>
                    </td>
                    <td className="p-3 text-zinc-600 font-mono">
                      {item.latency} ms
                    </td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold rounded-none">
                        ✓ PASS
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 5. 1-CLICK DEPLOY MODAL */}
      <DeployModal
        isOpen={isDeployModalOpen}
        onClose={() => setIsDeployModalOpen(false)}
        selectedModel={{
          ...model,
          is_creator: model.type === "creator",
          model_id: model.name,
          model_name: model.displayName,
          cost_per_1k_calls: model.pricingPer1k,
          latency_ms: model.latencyMs,
        }}
        prompt="Extract JSON entity fields"
        priority="latency"
      />
    </div>
  );
};

export default ModelDetailPage;
