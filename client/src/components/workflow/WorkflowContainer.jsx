import React, { useState } from "react";
import {
  HiOutlineBolt,
  HiOutlineCodeBracket,
  HiOutlineAcademicCap,
  HiOutlineArrowRight,
  HiOutlineArrowLeft,
} from "react-icons/hi2";
import ModelBadge from "../atoms/ModelBadge";
import CodeBlock from "../atoms/CodeBlock";

const PRESET_DATASETS = [
  {
    id: "sql-gen",
    name: "SQL Generation",
    icon: <HiOutlineBolt className="text-[#ea580c]" />,
    tag: "30-day MRR Query",
    samplePrompt: "SELECT team_id, SUM(amount) FROM transactions WHERE date >= NOW() - INTERVAL '30 days' GROUP BY team_id;",
  },
  {
    id: "code-refactor",
    name: "Code Refactor",
    icon: <HiOutlineCodeBracket className="text-blue-500" />,
    tag: "Async Python Task",
    samplePrompt: "async def fetch_all(urls): return await asyncio.gather(*[client.get(u) for u in urls])",
  },
  {
    id: "medical-qa",
    name: "Medical Reasoning",
    icon: <HiOutlineAcademicCap className="text-emerald-600" />,
    tag: "Clinical Diagnosis",
    samplePrompt: "Patient 58M presenting acute dyspnea with elevated troponin. List top 3 differentials.",
  },
];

const MODELS = [
  {
    id: "deepseek-custom",
    name: "DeepSeek-R1 (Creator)",
    type: "creator",
    latency: "184ms",
    cost: "$0.28/1M",
    accuracy: "94.8%",
    winner: true,
  },
  {
    id: "llama3-creator",
    name: "Llama-3.3-70B (Fine-Tuned)",
    type: "fine-tuned",
    latency: "245ms",
    cost: "$0.65/1M",
    accuracy: "96.2%",
  },
  {
    id: "gpt-4o",
    name: "GPT-4o (Frontier API)",
    type: "frontier",
    latency: "610ms",
    cost: "$2.50/1M",
    accuracy: "97.0%",
  },
];

export const WorkflowContainer = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDataset, setSelectedDataset] = useState(PRESET_DATASETS[0]);
  const [customPrompt, setCustomPrompt] = useState(PRESET_DATASETS[0].samplePrompt);

  const handleDatasetSelect = (ds) => {
    setSelectedDataset(ds);
    setCustomPrompt(ds.samplePrompt);
  };

  const deploySnippet = `import { ModelHub } from "@modelhub/sdk";

const client = new ModelHub({ apiKey: process.env.MODELHUB_API_KEY });
const res = await client.models.generate({
  model: "creator/deepseek-r1-14b",
  prompt: "${customPrompt}",
});
console.log(res.text);`;

  return (
    <div className="w-full bg-white rounded-none border border-[#e4e4e7] overflow-hidden shadow-xs font-sans">
      {/* ==================== 3-STEP TABS (SHARP SQUARED) ==================== */}
      <div className="grid grid-cols-3 border-b border-[#e4e4e7] bg-[#fafafa] text-xs font-mono select-none">
        {[
          { step: 1, title: "1. Define Test Data", desc: "Select or input prompt" },
          { step: 2, title: "2. Live Benchmark", desc: "Concurrent inference" },
          { step: 3, title: "3. Verdict & Deploy", desc: "Scorecard & 1-line SDK" },
        ].map((item) => {
          const isActive = currentStep === item.step;

          return (
            <button
              key={item.step}
              onClick={() => setCurrentStep(item.step)}
              className={`py-3.5 px-4 text-center transition-all relative flex flex-col items-center justify-center border-r border-[#e4e4e7] last:border-r-0 cursor-pointer rounded-none ${
                isActive
                  ? "bg-white text-zinc-950 font-bold"
                  : "bg-[#fafafa] text-zinc-600 hover:bg-zinc-100"
              }`}
            >
              {isActive && <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#ea580c]" />}
              <span className="truncate">{item.title}</span>
              <span className="text-[10px] text-zinc-400 font-sans hidden sm:block mt-0.5">
                {item.desc}
              </span>
            </button>
          );
        })}
      </div>

      {/* ==================== STEP CONTENT ==================== */}
      <div className="p-6 sm:p-8">
        {/* STEP 1: DEFINE TEST DATA */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-zinc-900 font-sans">
                Step 1: Choose or provide test data
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                Select a sample workload below or edit the prompt to test how specialized models handle your exact domain.
              </p>
            </div>

            {/* Quick Task Selection (Sharp Squared Boxes) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider font-mono">
                Sample Workload
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {PRESET_DATASETS.map((ds) => (
                  <button
                    key={ds.id}
                    onClick={() => handleDatasetSelect(ds)}
                    className={`p-3.5 rounded-none border text-left transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      selectedDataset.id === ds.id
                        ? "border-[#ea580c] bg-orange-50/50"
                        : "border-[#e4e4e7] bg-white hover:border-zinc-400"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="text-xl">{ds.icon}</div>
                      <div>
                        <div className="text-xs font-bold text-zinc-900">{ds.name}</div>
                        <div className="text-[11px] text-zinc-500">{ds.tag}</div>
                      </div>
                    </div>
                    {selectedDataset.id === ds.id && (
                      <span className="w-2 h-2 rounded-none bg-[#ea580c]" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Prompt Input (Sharp Squared Box) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider font-mono">
                Prompt Data
              </label>
              <input
                type="text"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                className="w-full bg-[#fafafa] border border-[#e4e4e7] focus:border-[#ea580c] text-zinc-800 text-xs font-mono rounded-none px-3.5 py-2.5 outline-none transition-all"
              />
            </div>

            {/* Competing Models Preview (Sharp Squared Boxes) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider font-mono">
                Models in this Benchmark
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                {MODELS.map((m) => (
                  <div
                    key={m.id}
                    className="p-2.5 rounded-none border border-[#e4e4e7] bg-[#fafafa] flex items-center justify-between"
                  >
                    <span className="font-semibold text-zinc-800 truncate text-[11px]">
                      {m.name}
                    </span>
                    <ModelBadge type={m.type} size="sm">
                      {m.type}
                    </ModelBadge>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation button (Sharp Squared) */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setCurrentStep(2)}
                className="text-xs font-semibold px-5 py-2.5 rounded-none bg-zinc-900 hover:bg-black text-white transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>Next: See Live Benchmark</span>
                <HiOutlineArrowRight className="text-xs" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: LIVE BENCHMARK */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-zinc-900 font-sans">
                Step 2: Concurrent Model Execution
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                ModelHub streams the prompt in parallel across all target models to calculate latency, throughput, and token cost.
              </p>
            </div>

            {/* Live Model Stream Cards (Sharp Squared) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
              {MODELS.map((m) => (
                <div
                  key={m.id}
                  className="p-4 rounded-none border border-[#e4e4e7] bg-[#fafafa] space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-zinc-900 truncate">{m.name}</span>
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 font-sans font-semibold">
                      <span className="w-2 h-2 rounded-none bg-emerald-500 animate-pulse" />
                      Active
                    </span>
                  </div>

                  <div className="space-y-1 pt-2 border-t border-zinc-200 text-[11px]">
                    <div className="flex justify-between text-zinc-600">
                      <span>Latency:</span>
                      <span className="font-bold text-zinc-900">{m.latency}</span>
                    </div>
                    <div className="flex justify-between text-zinc-600">
                      <span>Cost per 1M:</span>
                      <span className="font-bold text-zinc-900">{m.cost}</span>
                    </div>
                    <div className="flex justify-between text-zinc-600">
                      <span>Accuracy Score:</span>
                      <span className="font-bold text-zinc-900">{m.accuracy}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation buttons (Sharp Squared) */}
            <div className="pt-2 flex justify-between">
              <button
                onClick={() => setCurrentStep(1)}
                className="text-xs font-semibold px-4 py-2 rounded-none border border-zinc-300 hover:bg-zinc-50 text-zinc-700 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <HiOutlineArrowLeft className="text-xs" />
                <span>Back</span>
              </button>

              <button
                onClick={() => setCurrentStep(3)}
                className="text-xs font-semibold px-5 py-2 rounded-none bg-zinc-900 hover:bg-black text-white transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>Next: View Verdict & SDK</span>
                <HiOutlineArrowRight className="text-xs" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: VERDICT & DEPLOY */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-zinc-900 font-sans">
                Step 3: Verdict & 1-Line Integration
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                Compare head-to-head performance metrics and deploy the optimal model immediately with the ModelHub SDK.
              </p>
            </div>

            {/* Winner Recommendation Box (Sharp Squared) */}
            <div className="p-4 rounded-none border border-emerald-200 bg-emerald-50/60 flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider font-mono bg-emerald-200/60 px-2 py-0.5 rounded-none">
                  ★ Recommendation
                </span>
                <h4 className="text-sm font-bold text-zinc-900 mt-1">
                  DeepSeek-R1 (Creator Model) is 3.3x faster & 89% cheaper than GPT-4o.
                </h4>
              </div>
            </div>

            {/* Matrix Table (Sharp Squared) */}
            <div className="overflow-x-auto rounded-none border border-[#e4e4e7]">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="bg-[#fafafa] border-b border-[#e4e4e7] text-zinc-500 text-[11px]">
                    <th className="p-3">Model</th>
                    <th className="p-3">Latency</th>
                    <th className="p-3">Cost / 1M</th>
                    <th className="p-3">Accuracy</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e4e4e7] text-zinc-700">
                  {MODELS.map((m) => (
                    <tr
                      key={m.id}
                      className={m.winner ? "bg-emerald-50/40 font-bold text-zinc-950" : ""}
                    >
                      <td className="p-3 flex items-center gap-2">
                        {m.winner && <span className="text-emerald-600 font-bold">★</span>}
                        {m.name}
                      </td>
                      <td className="p-3 text-emerald-700 font-bold">{m.latency}</td>
                      <td className="p-3">{m.cost}</td>
                      <td className="p-3 text-zinc-900">{m.accuracy}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Code Snippet (Sharp Squared) */}
            <CodeBlock code={deploySnippet} language="typescript" filename="deploy.ts" />

            {/* Back button (Sharp Squared) */}
            <div className="pt-2 flex justify-start">
              <button
                onClick={() => setCurrentStep(1)}
                className="text-xs font-semibold px-4 py-2 rounded-none border border-zinc-300 hover:bg-zinc-50 text-zinc-700 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <HiOutlineArrowLeft className="text-xs" />
                <span>Start from Step 1</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkflowContainer;
