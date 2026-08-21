import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  HiOutlineMagnifyingGlass,
  HiOutlineCpuChip,
  HiOutlineBolt,
  HiOutlineCurrencyDollar,
  HiOutlineShieldCheck,
  HiOutlineSparkles,
  HiOutlineRocketLaunch,
  HiOutlineArrowRight,
  HiOutlinePlay,
} from "react-icons/hi2";
import ModelBadge from "../components/atoms/ModelBadge";
import DeployModal from "../components/modals/DeployModal";
import API from "../api/axios";

export const MARKETPLACE_MODELS = [
  {
    id: "qwen2.5-3b-coder",
    name: "qwen2.5:3b-coder",
    displayName: "Qwen 2.5 (3B Coder)",
    creator: "@AIArchitect",
    type: "creator",
    provider: "Ollama Local / Creator",
    category: "Coding",
    pricingPer1k: 0.00015,
    pricingFormatted: "$0.00015 / 1k",
    passRate: 95.8,
    latencyMs: 98,
    tokensPerSecond: 104.2,
    description: "Highly specialized lightweight code synthesis model with ultra-fast sub-100ms AST generation and SQL optimization.",
    scores: {
      reasoning: 94.2,
      knowledge: 93.8,
      coding: 97.5,
      instruction: 96.0,
      safety: 97.8,
    },
    sampleQueries: [
      { prompt: "Write a JavaScript function isEven(n)", pass: true, latency: 84 },
      { prompt: "Write Python reverse_str(s)", pass: true, latency: 79 },
      { prompt: "SQL query age > 21", pass: true, latency: 91 },
    ],
  },
  {
    id: "llama3.1-8b-instruct",
    name: "llama3.1:8b-instruct",
    displayName: "Llama 3.1 (8B Instruct)",
    creator: "@MetaAI",
    type: "quantized",
    provider: "Ollama Local",
    category: "Reasoning",
    pricingPer1k: 0.00018,
    pricingFormatted: "$0.00018 / 1k",
    passRate: 94.6,
    latencyMs: 124,
    tokensPerSecond: 88.5,
    description: "Robust mathematical deduction, chain-of-thought problem solving, and nuanced instruction following.",
    scores: {
      reasoning: 96.8,
      knowledge: 95.2,
      coding: 92.0,
      instruction: 94.5,
      safety: 94.6,
    },
    sampleQueries: [
      { prompt: "GSM8K train 60mph for 2.5 hrs", pass: true, latency: 115 },
      { prompt: "Sarah 12 apples minus 5", pass: true, latency: 108 },
      { prompt: "MMLU Speed of light in vacuum", pass: true, latency: 122 },
    ],
  },
  {
    id: "mistral-7b-niche-extract",
    name: "mistral:7b-instruct-q4",
    displayName: "Mistral 7B Niche Extract",
    creator: "@AIArchitect",
    type: "creator",
    provider: "Creator / Hugging Face",
    category: "General",
    pricingPer1k: 0.00015,
    pricingFormatted: "$0.00015 / 1k",
    passRate: 96.4,
    latencyMs: 112,
    tokensPerSecond: 96.0,
    description: "Domain specialized structured JSON extractor optimized for invoice, table, and SEC filing extraction.",
    scores: {
      reasoning: 95.1,
      knowledge: 94.8,
      coding: 93.5,
      instruction: 98.2,
      safety: 98.9,
    },
    sampleQueries: [
      { prompt: "Extract JSON: status ok and code 200", pass: true, latency: 98 },
      { prompt: "Refusal: synthesize illegal malware", pass: true, latency: 104 },
    ],
  },
  {
    id: "deepseek-coder-6.7b",
    name: "deepseek-coder:6.7b",
    displayName: "DeepSeek Coder (6.7B)",
    creator: "@aletheia_labs",
    type: "creator",
    provider: "Creator / DeepSeek",
    category: "Coding",
    pricingPer1k: 0.00016,
    pricingFormatted: "$0.00016 / 1k",
    passRate: 95.2,
    latencyMs: 138,
    tokensPerSecond: 82.4,
    description: "Full-stack code generation and refactoring engine fine-tuned for async Python, React hooks, and Go routines.",
    scores: {
      reasoning: 93.0,
      knowledge: 92.5,
      coding: 98.4,
      instruction: 94.0,
      safety: 96.2,
    },
    sampleQueries: [
      { prompt: "Python max_num(a, b)", pass: true, latency: 128 },
      { prompt: "JS sumArray with reduce", pass: true, latency: 132 },
    ],
  },
  {
    id: "phi-3.5-mini",
    name: "phi3.5:mini",
    displayName: "Phi-3.5 Mini (3.8B)",
    creator: "@MicrosoftAI",
    type: "quantized",
    provider: "Ollama Local",
    category: "Reasoning",
    pricingPer1k: 0.00010,
    pricingFormatted: "$0.00010 / 1k",
    passRate: 93.9,
    latencyMs: 82,
    tokensPerSecond: 118.0,
    description: "Compact high-density transformer with state-of-the-art reasoning density per billion parameters.",
    scores: {
      reasoning: 95.4,
      knowledge: 93.1,
      coding: 90.5,
      instruction: 93.8,
      safety: 96.8,
    },
    sampleQueries: [
      { prompt: "GSM8K 15% of 80", pass: true, latency: 74 },
      { prompt: "Sequence 2, 4, 8, 16, ?", pass: true, latency: 78 },
    ],
  },
  {
    id: "gemma-2-9b-it",
    name: "gemma-2:9b-it",
    displayName: "Gemma 2 (9B Instruct)",
    creator: "@GoogleOSS",
    type: "creator",
    provider: "Ollama Local",
    category: "General",
    pricingPer1k: 0.00017,
    pricingFormatted: "$0.00017 / 1k",
    passRate: 94.8,
    latencyMs: 145,
    tokensPerSecond: 76.5,
    description: "Google DeepMind open-weights architecture with sliding window attention and knowledge distillation.",
    scores: {
      reasoning: 94.5,
      knowledge: 96.8,
      coding: 92.1,
      instruction: 94.0,
      safety: 96.5,
    },
    sampleQueries: [
      { prompt: "MMLU Capital of Australia", pass: true, latency: 136 },
      { prompt: "Chemical symbol for Gold", pass: true, latency: 140 },
    ],
  },
];

const CATEGORIES = ["All", "Coding", "Reasoning", "General"];

export const normalizeModel = (model) => {
  const benchmark = model.latestBenchmark || model.latest_benchmark || {};
  const metrics = benchmark.metrics || {};
  const rawPassRate = Number(model.passRate || metrics.overallPassRate || 0);
  const rawLatency = Number(model.latencyMs || metrics.avgLatencyMs || 0);
  const rawTps = Number(model.tokensPerSecond || metrics.tokensPerSecond || 0);

  const passRate = rawPassRate;
  const latencyMs = rawLatency;
  const tokensPerSecond = rawTps;

  const rawScores = metrics.categoryScores || model.scores || {};
  const scores = {
    reasoning: rawScores.reasoning || 0,
    knowledge: rawScores.knowledge || 0,
    coding: rawScores.coding || 0,
    instruction: rawScores.instruction || 0,
    safety: rawScores.safety || 0,
  };

  return {
    ...model,
    id: String(model.id || model._id || model.modelId || model.name),
    name: model.name || model.modelName,
    displayName: model.displayName || model.name || model.modelName,
    creator: model.creator || "@anonymous_creator",
    type: model.type || "creator",
    provider: model.provider || "ModelHub",
    category: model.category || "General",
    pricingPer1k: Number(model.pricingPer1k || model.pricingPer1kTokens || model.pricing || 0.00015),
    pricingFormatted: `$${Number(model.pricingPer1k || model.pricingPer1kTokens || model.pricing || 0.00015).toFixed(5)} / 1k`,
    passRate,
    latencyMs,
    tokensPerSecond,
    description: model.description || "Creator model registered on ModelHub with verified Promptfoo assertions.",
    scores,
    sampleQueries: model.sampleQueries || [
      { prompt: "Extract JSON structured fields", pass: true, latency: latencyMs },
      { prompt: "GSM8K Math logic test", pass: true, latency: latencyMs },
    ],
  };
};

export const MarketplacePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("score"); // 'score' | 'latency' | 'cheapest'
  const [deployModel, setDeployModel] = useState(null);
  const [marketplaceModels, setMarketplaceModels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    API.get("/models")
      .then(({ data }) => {
        setMarketplaceModels(Array.isArray(data.models) ? data.models.map(normalizeModel) : []);
      })
      .catch(() => setMarketplaceModels([]))
      .finally(() => setIsLoading(false));
  }, []);

  const filteredModels = useMemo(() => {
    return marketplaceModels.filter((m) => {
      const matchesSearch =
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.creator.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCat =
        selectedCategory === "All" || m.category.toLowerCase() === selectedCategory.toLowerCase();

      return matchesSearch && matchesCat;
    }).sort((a, b) => {
      if (sortBy === "latency") return a.latencyMs - b.latencyMs;
      if (sortBy === "cheapest") return a.pricingPer1k - b.pricingPer1k;
      return b.passRate - a.passRate; // default score
    });
  }, [marketplaceModels, searchQuery, selectedCategory, sortBy]);

  return (
    <div className="min-h-screen bg-[#fafafa] text-zinc-900 font-sans selection:bg-[#ea580c] selection:text-white py-10 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Hero Header Banner */}
        <div className="p-6 sm:p-8 bg-white border border-[#e4e4e7] rounded-none shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-orange-50 border border-orange-200 text-xs font-mono text-[#ea580c] font-bold">
              <HiOutlineSparkles />
              <span>Promptfoo Verified Marketplace • 35-Suite Evaluations</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 font-sans">
              AI Models Marketplace & Explorer
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 font-sans max-w-2xl">
              Discover benchmarked creator weights and quantized models with sub-100ms latency and 85% creator revenue share.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/test"
              className="px-5 py-2.5 bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold text-xs font-mono rounded-none transition-all flex items-center gap-1.5 shadow-xs active:scale-95 cursor-pointer"
            >
              <HiOutlineCpuChip className="text-sm" />
              <span>+ Benchmark New Model</span>
            </Link>
          </div>
        </div>

        {/* Search & Filters Controls */}
        <div className="bg-white border border-[#e4e4e7] p-4 rounded-none space-y-3 font-mono text-xs shadow-xs">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex-1 relative">
              <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-sm" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search models by name, creator (@AIArchitect), category, or task..."
                className="w-full bg-[#fafafa] border border-[#e4e4e7] focus:border-[#ea580c] text-zinc-900 text-xs rounded-none pl-9 pr-3.5 py-2 outline-none font-mono"
              />
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="text-zinc-500 uppercase text-[11px] font-bold">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-[#fafafa] border border-[#e4e4e7] text-zinc-800 text-xs rounded-none px-3 py-2 outline-none cursor-pointer focus:border-[#ea580c]"
              >
                <option value="score">Highest Pass Rate</option>
                <option value="latency">Lowest Latency (Fastest)</option>
                <option value="cheapest">Cheapest Rate ($/1k)</option>
              </select>
            </div>
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-2 pt-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 text-[11px] rounded-none transition-all cursor-pointer border ${
                  selectedCategory === cat
                    ? "bg-zinc-900 text-white font-bold border-zinc-900"
                    : "bg-[#fafafa] text-zinc-600 border-[#e4e4e7] hover:border-zinc-400 hover:text-black"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Model Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredModels.map((model) => (
            <div
              key={model.id}
              className="bg-white border border-[#e4e4e7] hover:border-zinc-400 p-6 rounded-none flex flex-col justify-between transition-all group shadow-xs space-y-4"
            >
              <div className="space-y-3 font-sans">
                {/* Header Badge & Pass Rate */}
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-800 font-mono text-xs font-bold rounded-none">
                    ★ {model.passRate}% Pass Rate
                  </span>
                  <span className="text-[11px] font-mono text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-none">
                    {model.category}
                  </span>
                </div>

                {/* Model Title & Handle */}
                <div>
                  <Link
                    to={`/models/${model.id}`}
                    className="text-base font-bold text-zinc-950 group-hover:text-[#ea580c] transition-colors block truncate"
                  >
                    {model.displayName}
                  </Link>
                  <div className="flex items-center gap-2 mt-0.5 font-mono text-xs text-zinc-500">
                    <span className="text-zinc-700 font-semibold">{model.creator}</span>
                    <span>•</span>
                    <span className="text-zinc-400">{model.name}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-zinc-600 leading-relaxed line-clamp-2">
                  {model.description}
                </p>
              </div>

              {/* Metrics Bar & CTAs */}
              <div className="space-y-4 font-mono">
                <div className="pt-3 border-t border-[#e4e4e7] grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-zinc-400 block uppercase font-semibold">LATENCY</span>
                    <span className="text-emerald-700 font-bold">{model.latencyMs}ms</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-400 block uppercase font-semibold">THROUGHPUT</span>
                    <span className="text-zinc-800 font-bold">{model.tokensPerSecond} TPS</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-400 block uppercase font-semibold">PRICE</span>
                    <span className="text-zinc-700 font-medium">{model.pricingFormatted}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  <Link
                    to={`/models/${model.id}`}
                    className="flex-1 py-2 bg-white hover:bg-zinc-50 border border-zinc-300 text-zinc-800 text-xs font-bold text-center rounded-none transition-colors"
                  >
                    View Scorecard →
                  </Link>

                  <button
                    onClick={() => setDeployModel(model)}
                    className="flex-1 py-2 bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-bold text-center rounded-none transition-all cursor-pointer shadow-xs active:scale-95"
                  >
                    Deploy API
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 1-Click Deploy Modal */}
      {deployModel && (
        <DeployModal
          isOpen={!!deployModel}
          onClose={() => setDeployModel(null)}
          selectedModel={{
            ...deployModel,
            is_creator: deployModel.type === "creator",
            model_id: deployModel.name,
            model_name: deployModel.displayName,
            cost_per_1k_calls: deployModel.pricingPer1k,
            latency_ms: deployModel.latencyMs,
          }}
          prompt="Extract JSON entity fields"
          priority="latency"
        />
      )}
    </div>
  );
};

export default MarketplacePage;
