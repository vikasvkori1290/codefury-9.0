import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  HiOutlineMagnifyingGlass,
  HiOutlineCpuChip,
  HiOutlineBolt,
  HiOutlineCurrencyDollar,
  HiOutlineShieldCheck,
  HiOutlineSparkles,
  HiOutlinePlay,
  HiOutlineRocketLaunch,
  HiOutlineArrowTopRightOnSquare,
} from "react-icons/hi2";
import ModelBadge from "../components/atoms/ModelBadge";
import DeployModal from "../components/modals/DeployModal";

const ALL_MODELS = [
  {
    id: "mistral-7b-niche",
    name: "Mistral-7B-Niche-Extract",
    creator: "@AIArchitect",
    type: "creator",
    provider: "Creator / Hugging Face",
    domain: "Data Extraction & JSON",
    domainCategory: "extraction",
    size: "7B (4-bit AWQ)",
    latency: "112ms",
    latencyNum: 112,
    costPer1M: "$0.15/1M",
    costNum: 0.15,
    accuracy: "96.4%",
    accuracyNum: 96.4,
    downloads: "42.8k",
    description: "Highly specialized structured JSON extractor optimized for invoice, table, and receipt parsing with zero conversational filler.",
    contextWindow: "32k",
    revenueShare: "85%",
  },
  {
    id: "deepseek-coder",
    name: "DeepSeek-Coder-V2-Inst",
    creator: "@aletheia_labs",
    type: "creator",
    provider: "Creator / DeepSeek",
    domain: "Polyglot Code & Refactor",
    domainCategory: "coding",
    size: "16B (FP8)",
    latency: "148ms",
    latencyNum: 148,
    costPer1M: "$0.18/1M",
    costNum: 0.18,
    accuracy: "95.8%",
    accuracyNum: 95.8,
    downloads: "74.1k",
    description: "State-of-the-art programming model fine-tuned for high-throughput async Python, Rust concurrency, and SQL window queries.",
    contextWindow: "128k",
    revenueShare: "85%",
  },
  {
    id: "qwen-reasoner",
    name: "Qwen2.5-Math-72B-Lora",
    creator: "@math_nexus",
    type: "fine-tuned",
    provider: "Creator / Alibaba",
    domain: "Complex Math & Formal Logic",
    domainCategory: "reasoning",
    size: "72B (AWQ)",
    latency: "230ms",
    latencyNum: 230,
    costPer1M: "$0.45/1M",
    costNum: 0.45,
    accuracy: "97.2%",
    accuracyNum: 97.2,
    downloads: "28.3k",
    description: "Fine-tuned chain-of-thought mathematical reasoning model outperforming GPT-4 on GSM8K and Olympiad benchmarks.",
    contextWindow: "64k",
    revenueShare: "80%",
  },
  {
    id: "biomistral-med",
    name: "BioMistral-Clinical-7B",
    creator: "@health_ai",
    type: "quantized",
    provider: "Creator / BioMistral",
    domain: "Clinical Diagnosis & Medical QA",
    domainCategory: "medical",
    size: "7B (GGUF-Q4)",
    latency: "88ms",
    latencyNum: 88,
    costPer1M: "$0.08/1M",
    costNum: 0.08,
    accuracy: "94.2%",
    accuracyNum: 94.2,
    downloads: "61.3k",
    description: "PubMed and ClinicalTrials.gov specialized diagnostic assistant with pharmacological contraindication safeguards.",
    contextWindow: "16k",
    revenueShare: "90%",
  },
  {
    id: "fingpt-sentiment",
    name: "FinGPT-Sentiment-v4",
    creator: "@alpha_quant",
    type: "creator",
    provider: "Creator / FinGPT",
    domain: "Financial SEC & Earnings",
    domainCategory: "finance",
    size: "8B (FP16)",
    latency: "94ms",
    latencyNum: 94,
    costPer1M: "$0.10/1M",
    costNum: 0.10,
    accuracy: "95.1%",
    accuracyNum: 95.1,
    downloads: "34.0k",
    description: "Wall Street earnings call sentiment grader, 10-K risk factor parser, and SEC disclosure anomaly detector.",
    contextWindow: "32k",
    revenueShare: "85%",
  },
  {
    id: "gpt-4o-mini",
    name: "GPT-4o-mini",
    creator: "OpenAI",
    type: "frontier",
    provider: "OpenAI",
    domain: "General Multimodal & Text",
    domainCategory: "general",
    size: "Frontier API",
    latency: "320ms",
    latencyNum: 320,
    costPer1M: "$0.60/1M",
    costNum: 0.60,
    accuracy: "93.8%",
    accuracyNum: 93.8,
    downloads: "1.2M",
    description: "OpenAI fast lightweight frontier model for general conversational comprehension and reasoning.",
    contextWindow: "128k",
    revenueShare: "N/A",
  },
  {
    id: "gemini-1.5-flash",
    name: "Gemini 1.5 Flash",
    creator: "Google DeepMind",
    type: "frontier",
    provider: "Google",
    domain: "High-Throughput Long Context",
    domainCategory: "general",
    size: "Frontier API",
    latency: "280ms",
    latencyNum: 280,
    costPer1M: "$0.30/1M",
    costNum: 0.30,
    accuracy: "92.5%",
    accuracyNum: 92.5,
    downloads: "890k",
    description: "Google 1M-token multimodal context window model optimized for ultra-high concurrency pipelines.",
    contextWindow: "1000k",
    revenueShare: "N/A",
  },
  {
    id: "claude-3-5-haiku",
    name: "Claude 3.5 Haiku",
    creator: "Anthropic",
    type: "frontier",
    provider: "Anthropic",
    domain: "Fast Nuanced Reasoning",
    domainCategory: "general",
    size: "Frontier API",
    latency: "295ms",
    latencyNum: 295,
    costPer1M: "$1.00/1M",
    costNum: 1.00,
    accuracy: "94.6%",
    accuracyNum: 94.6,
    downloads: "650k",
    description: "Anthropic sub-second latency model with near Claude 3.5 Sonnet coding and classification precision.",
    contextWindow: "200k",
    revenueShare: "N/A",
  },
];

const DOMAINS = [
  { id: "all", label: "All Domains" },
  { id: "extraction", label: "Extraction & JSON" },
  { id: "coding", label: "Coding & SQL" },
  { id: "reasoning", label: "Math & Logic" },
  { id: "medical", label: "Medical & Health" },
  { id: "finance", label: "Finance & SEC" },
  { id: "general", label: "Frontier Baseline" },
];

const ModelsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("all");
  const [selectedType, setSelectedType] = useState("all"); // 'all' | 'creator' | 'fine-tuned' | 'quantized' | 'frontier'
  const [sortBy, setSortBy] = useState("popular"); // 'popular' | 'latency' | 'cost' | 'accuracy'
  const [deployModel, setDeployModel] = useState(null);

  const filteredModels = useMemo(() => {
    return ALL_MODELS.filter((m) => {
      const matchesSearch =
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.creator.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDomain =
        selectedDomain === "all" || m.domainCategory === selectedDomain;

      const matchesType =
        selectedType === "all" || m.type === selectedType;

      return matchesSearch && matchesDomain && matchesType;
    }).sort((a, b) => {
      if (sortBy === "latency") return a.latencyNum - b.latencyNum;
      if (sortBy === "cost") return a.costNum - b.costNum;
      if (sortBy === "accuracy") return b.accuracyNum - a.accuracyNum;
      return 0; // default order
    });
  }, [searchQuery, selectedDomain, selectedType, sortBy]);

  return (
    <div className="min-h-screen bg-[#fafafa] text-zinc-900 font-sans selection:bg-[#ea580c] selection:text-white py-10 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white border border-[#e4e4e7] rounded-none shadow-xs">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-orange-50 border border-orange-200 text-xs font-mono text-[#ea580c] font-bold">
              <HiOutlineCpuChip />
              <span>Creator AI Marketplace • 340+ Verified Weights</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 font-sans">
              AI Models Directory
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 font-sans">
              Explore domain-specialized creator models with 85% revenue sharing and sub-150ms inference latency.
            </p>
          </div>

          <Link
            to="/live-bench"
            className="px-5 py-2.5 bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold text-xs font-mono rounded-none transition-all flex items-center gap-2 shadow-xs cursor-pointer shrink-0 active:scale-95"
          >
            <HiOutlinePlay className="text-sm" />
            <span>Open Live Benchmark</span>
          </Link>
        </div>

        {/* Search & Filters Row */}
        <div className="bg-white border border-[#e4e4e7] p-4 rounded-none space-y-3 shadow-xs font-mono text-xs">
          {/* Search bar & Sort selector */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex-1 relative">
              <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-sm" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search models by name, creator (@AIArchitect), task, or architecture..."
                className="w-full bg-[#fafafa] border border-[#e4e4e7] focus:border-[#ea580c] text-zinc-800 text-xs rounded-none pl-9 pr-3.5 py-2 outline-none transition-all font-mono"
              />
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <label className="text-zinc-500 uppercase text-[11px] font-bold">Sort By:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-[#fafafa] border border-[#e4e4e7] text-zinc-800 text-xs rounded-none px-3 py-2 outline-none cursor-pointer"
              >
                <option value="popular">Most Popular</option>
                <option value="latency">Lowest Latency (Speed)</option>
                <option value="cost">Lowest Cost ($/1M)</option>
                <option value="accuracy">Highest Accuracy</option>
              </select>
            </div>
          </div>

          {/* Domain Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {DOMAINS.map((d) => (
              <button
                key={d.id}
                onClick={() => setSelectedDomain(d.id)}
                className={`px-3 py-1 text-[11px] rounded-none transition-all whitespace-nowrap cursor-pointer ${
                  selectedDomain === d.id
                    ? "bg-zinc-950 text-white font-bold"
                    : "bg-[#fafafa] text-zinc-600 hover:bg-zinc-100 border border-[#e4e4e7]"
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Model Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredModels.map((model) => (
            <div
              key={model.id}
              className="bg-white border border-[#e4e4e7] hover:border-zinc-400 p-5 rounded-none flex flex-col justify-between transition-all group shadow-xs space-y-4"
            >
              <div className="space-y-3 font-sans">
                {/* Top Badge & Downloads */}
                <div className="flex items-center justify-between">
                  <ModelBadge type={model.type} size="sm">{model.provider}</ModelBadge>
                  <span className="text-[10px] font-mono text-zinc-500">{model.downloads} runs</span>
                </div>

                {/* Model Title & Creator */}
                <div>
                  <h3 className="text-sm font-bold text-zinc-900 group-hover:text-[#ea580c] transition-colors truncate">
                    {model.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5 font-mono text-[11px] text-zinc-500">
                    <span>{model.creator}</span>
                    <span>•</span>
                    <span>{model.size}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-zinc-600 leading-relaxed line-clamp-2">
                  {model.description}
                </p>

                {/* Domain & Revenue Tag */}
                <div className="p-2.5 bg-[#fafafa] border border-[#e4e4e7] rounded-none font-mono text-[11px] flex items-center justify-between text-zinc-700">
                  <span className="truncate">{model.domain}</span>
                  {model.revenueShare !== "N/A" && (
                    <span className="text-[#ea580c] font-bold shrink-0">{model.revenueShare} share</span>
                  )}
                </div>
              </div>

              {/* Bottom Metrics & Actions */}
              <div className="space-y-3 font-mono">
                <div className="pt-3 border-t border-[#f4f4f5] grid grid-cols-3 gap-1 text-[11px]">
                  <div>
                    <span className="text-[10px] text-zinc-400 block">LATENCY</span>
                    <span className="text-emerald-700 font-bold">{model.latency}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-400 block">COST</span>
                    <span className="text-zinc-900 font-medium">{model.costPer1M}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-400 block">ACCURACY</span>
                    <span className="text-zinc-900 font-bold">{model.accuracy}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-1">
                  <Link
                    to="/live-bench"
                    className="flex-1 py-1.5 bg-[#fafafa] hover:bg-zinc-100 border border-[#e4e4e7] text-zinc-800 text-[11px] font-bold text-center rounded-none transition-colors"
                  >
                    Benchmark
                  </Link>

                  <button
                    onClick={() => setDeployModel(model)}
                    className="flex-1 py-1.5 bg-[#ea580c] hover:bg-[#c2410c] text-white text-[11px] font-bold text-center rounded-none transition-colors shadow-xs cursor-pointer"
                  >
                    Deploy API
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Deploy & Checkout Modal */}
      {deployModel && (
        <DeployModal
          isOpen={!!deployModel}
          onClose={() => setDeployModel(null)}
          selectedModel={{
            ...deployModel,
            is_creator: deployModel.type === "creator",
            model_id: deployModel.id,
            model_name: deployModel.name,
            cost_per_1k_calls: (deployModel.costNum * 0.1).toFixed(4),
            latency_ms: deployModel.latencyNum,
          }}
          prompt="Extract JSON entity fields"
          priority="latency"
        />
      )}
    </div>
  );
};

export default ModelsPage;
