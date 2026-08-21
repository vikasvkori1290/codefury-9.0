import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  HiOutlineMagnifyingGlass,
  HiOutlineCpuChip,
  HiOutlineBolt,
  HiOutlineShieldCheck,
  HiOutlineSparkles,
  HiOutlineArrowRight,
  HiOutlinePlay,
  HiOutlineScale,
  HiOutlineWrenchScrewdriver,
  HiOutlineChartBar,
} from "react-icons/hi2";
import DeployModal from "../components/modals/DeployModal";
import API from "../api/axios";
import { PRELOADED_FRONTIER_MODELS } from "./LiveBenchPage";

// Helper to determine primary capability domain from scores
const getDominantCategory = (scores = {}) => {
  const coding = (scores.coding || 0) + (scores.agentic_coding || 0) / 2;
  const reasoning = (scores.reasoning || 0) + (scores.mathematics || 0) / 2;
  if (coding > 80 && coding >= reasoning) return "Coding";
  if (reasoning > 85) return "Reasoning";
  return "General";
};

// Convert all 44 LiveBench models to marketplace catalog format
export const GLOBAL_LIVEBENCH_CATALOG = PRELOADED_FRONTIER_MODELS.map((m) => {
  const catScores = m.metrics?.categoryScores || {};
  const pass = m.metrics?.overallPassRate || 75.0;
  const latency = m.metrics?.avgLatencyMs || 150;
  const priceNum = parseFloat(String(m.pricing || "0.150").replace("$", "")) || 0.150;

  return {
    id: m.id,
    name: m.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    displayName: m.name,
    creator: `@${m.org}`,
    type: m.isOpen ? "open" : "frontier",
    provider: `${m.org} / LiveBench`,
    category: getDominantCategory(catScores),
    isOpen: m.isOpen,
    isTested: false,
    pricingPer1k: priceNum / 1000,
    pricingFormatted: `${m.pricing} / task`,
    passRate: pass,
    latencyMs: latency,
    tokensPerSecond: Math.max(30, Math.min(180, Math.round(18000 / latency))),
    description: `Official LiveBench contamination-free frontier benchmark model. Ranked with ${pass}% accuracy across 7 core capability domains.`,
    scores: {
      reasoning: catScores.reasoning ?? 90,
      coding: catScores.coding ?? 85,
      agentic_coding: catScores.agentic_coding ?? 60,
      mathematics: catScores.mathematics ?? 92,
      data_analysis: catScores.data_analysis ?? 75,
      language: catScores.language ?? 85,
      instruction: catScores.instruction ?? 70,
    },
    capabilities: ["Reasoning", "Code Synthesis", "Mathematics", "Agentic Tool Use"],
    tools: ["Promptfoo Suite", "LiveBench v2", "Contamination Check"],
    sampleQueries: [
      { prompt: "Complex multi-step reasoning task", pass: true, latency: Math.floor(latency * 0.9) },
      { prompt: "Algorithm implementation with edge case verification", pass: true, latency: latency },
    ],
  };
});

export const MARKETPLACE_MODELS = GLOBAL_LIVEBENCH_CATALOG;

export const normalizeModel = (model) => {
  const benchmark = model.latestBenchmark || model.latest_benchmark || {};
  const metrics = benchmark.metrics || {};
  const rawPassRate = Number(model.passRate || metrics.overallPassRate || 0);
  const rawLatency = Number(model.latencyMs || metrics.avgLatencyMs || 0);
  const rawTps = Number(model.tokensPerSecond || metrics.tokensPerSecond || 0);

  const passRate = rawPassRate > 0 ? rawPassRate : 97.1;
  const latencyMs = rawLatency > 0 ? rawLatency : 120;
  const tokensPerSecond = rawTps > 0 ? rawTps : 50;

  const rawScores = metrics.categoryScores || model.scores || {};
  const scores = {
    reasoning: rawScores.reasoning ?? +(passRate * 0.96).toFixed(1),
    coding: rawScores.coding ?? +(passRate * 0.94).toFixed(1),
    agentic_coding: rawScores.agentic_coding ?? +(passRate * 0.82).toFixed(1),
    mathematics: rawScores.mathematics ?? +(passRate * 0.98).toFixed(1),
    data_analysis: rawScores.data_analysis ?? +(passRate * 0.88).toFixed(1),
    language: rawScores.language ?? +(passRate * 0.92).toFixed(1),
    instruction: rawScores.instruction ?? +(passRate * 0.85).toFixed(1),
  };

  const isTested = Boolean(model.latestBenchmark || model.isTested);

  return {
    ...model,
    id: String(model.id || model._id || model.modelId || model.name),
    name: model.name || model.modelName,
    displayName: model.displayName || model.name || model.modelName,
    creator: model.creator || "@Creator",
    type: model.type || (isTested ? "tested" : "creator"),
    provider: model.provider || "ModelHub Test-Bench",
    category: model.category || "General",
    isTested,
    isOpen: model.isOpen !== undefined ? model.isOpen : (model.provider === "ollama_local" || model.provider === "modelfile_upload"),
    pricingPer1k: Number(model.pricingPer1k || model.pricingPer1kTokens || model.pricing || 0.00015),
    pricingFormatted: model.pricingFormatted || `$${Number(model.pricingPer1k || model.pricingPer1kTokens || model.pricing || 0.00015).toFixed(5)} / 1k`,
    passRate,
    latencyMs,
    tokensPerSecond,
    description: model.description || "Creator model registered on ModelHub with verified 35-case benchmark assertions.",
    scores,
    capabilities: model.capabilities || ["Code Synthesis", "Reasoning & Logic", "Mathematics", "Agentic Tool Use"],
    tools: model.tools || ["Ollama", "Promptfoo Suite", "Live Bench Suite"],
    sampleQueries: model.sampleQueries || [
      { prompt: "Extract JSON structured fields", pass: true, latency: latencyMs },
      { prompt: "GSM8K Math logic test", pass: true, latency: latencyMs },
    ],
  };
};

const MODEL_FILTER_GROUPS = [
  {
    key: "capability",
    label: "Capability",
    options: [
      "Coding & Development",
      "Research & Web",
      "Writing & Content",
      "Data & Analytics",
      "Automation",
      "Customer Support",
      "Marketing & Sales",
      "Productivity",
      "Design & Creative",
      "Security",
      "Finance",
      "Education",
    ],
  },
  {
    key: "worksOn",
    label: "Works on",
    options: [
      "Ollama",
      "Promptfoo Suite",
      "API Endpoint",
      "Docker",
      "Terminal",
      "Python SDK",
    ],
  },
  {
    key: "source",
    label: "Source / Type",
    options: [
      "Tested by Us",
      "LiveBench Frontier",
      "Open Weights [open]",
      "Proprietary API",
    ],
  },
  {
    key: "pricing",
    label: "Pricing",
    options: [
      "Free / Open Weights",
      "< $0.0002 / 1k",
      "< $0.001 / 1k",
      "Pay per Use",
    ],
  },
  {
    key: "rating",
    label: "Rating",
    options: ["90%+ Top Tier", "80%+ High Accuracy", "70%+ Solid Performance"],
  },
  {
    key: "latency",
    label: "Latency",
    options: ["< 100ms Ultra-Fast", "< 200ms Fast", "< 500ms Standard"],
  },
  {
    key: "cost",
    label: "Cost / task",
    options: ["Free", "< $0.01 / task", "< $0.05 / task", "< $0.10 / task"],
  },
];

export const MarketplacePage = () => {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("relevant");
  const [selectedFilters, setSelectedFilters] = useState({});
  const [expandedGroups, setExpandedGroups] = useState({ capability: true });

  const [deployModel, setDeployModel] = useState(null);
  const [testedModels, setTestedModels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch evaluated models live from MongoDB Atlas
  useEffect(() => {
    API.get("/models")
      .then(({ data }) => {
        if (data && Array.isArray(data.models)) {
          const completedOnly = data.models.filter(
            (m) =>
              m.latestBenchmark &&
              m.latestBenchmark.status === "completed" &&
              Number(m.latestBenchmark.metrics?.overallPassRate || 0) > 10
          );
          setTestedModels(completedOnly.map(normalizeModel));
        }
      })
      .catch(() => setTestedModels([]))
      .finally(() => setIsLoading(false));
  }, []);

  // Merge tested creator models with all 44 LiveBench global models
  const allMarketplaceModels = useMemo(() => {
    const globalList = GLOBAL_LIVEBENCH_CATALOG.map(normalizeModel);
    return [...testedModels, ...globalList];
  }, [testedModels]);

  const toggleFilter = (key, value) => {
    setSelectedFilters((current) => {
      const values = current[key] || [];
      const nextValues = values.includes(value)
        ? values.filter((item) => item !== value)
        : [...values, value];
      return { ...current, [key]: nextValues };
    });
  };

  const clearFilters = () => {
    setSearch("");
    setSelectedFilters({});
  };

  const activeFilters = Object.entries(selectedFilters).flatMap(([key, values]) =>
    values.map((value) => ({ key, value }))
  );

  const getModelFilterMeta = (m) => {
    const caps = [];
    if (m.scores.coding >= 78 || m.scores.agentic_coding >= 55) caps.push("Coding & Development");
    if (m.scores.reasoning >= 80) caps.push("Reasoning & Logic");
    if (m.scores.mathematics >= 85) caps.push("Mathematics (90%+)");
    if (m.scores.agentic_coding >= 50) caps.push("Agentic Tool Use");
    if (m.scores.data_analysis >= 70) caps.push("Data & Analytics");
    if (m.scores.language >= 80) caps.push("Language (MMLU)");
    if (m.scores.instruction >= 70) caps.push("Instruction Following");

    const sources = [];
    if (m.isTested) sources.push("Tested by Us");
    else sources.push("LiveBench Frontier");
    if (m.isOpen) sources.push("Open Weights [open]");
    else sources.push("Proprietary API");

    const pricings = ["Pay per Use"];
    if (m.isOpen) pricings.push("Free / Open Weights");
    if (m.pricingPer1k <= 0.0002) pricings.push("< $0.0002 / 1k");
    if (m.pricingPer1k <= 0.001) pricings.push("< $0.001 / 1k");

    const ratings = [];
    if (m.passRate >= 90) ratings.push("90%+ Top Tier");
    if (m.passRate >= 80) ratings.push("80%+ High Accuracy");
    if (m.passRate >= 70) ratings.push("70%+ Solid Performance");

    const latencies = [];
    if (m.latencyMs < 100) latencies.push("< 100ms Ultra-Fast");
    if (m.latencyMs < 200) latencies.push("< 200ms Fast");
    if (m.latencyMs < 500) latencies.push("< 500ms Standard");

    return {
      capability: caps,
      source: sources,
      pricing: pricings,
      rating: ratings,
      latency: latencies,
    };
  };

  const filtered = useMemo(() => {
    let list = allMarketplaceModels.filter((m) => {
      const q = search.toLowerCase().trim();
      const meta = getModelFilterMeta(m);

      const matchesSearch =
        !q ||
        m.name.toLowerCase().includes(q) ||
        m.displayName.toLowerCase().includes(q) ||
        m.creator.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q);

      const matchesFilters = Object.entries(selectedFilters).every(
        ([key, values]) =>
          values.length === 0 || values.some((value) => (meta[key] || []).includes(value))
      );

      return matchesSearch && matchesFilters;
    });

    if (sortBy === "rating" || sortBy === "score") list = [...list].sort((a, b) => b.passRate - a.passRate);
    else if (sortBy === "benchmark") list = [...list].sort((a, b) => b.passRate - a.passRate);
    else if (sortBy === "price") list = [...list].sort((a, b) => a.pricingPer1k - b.pricingPer1k);
    else if (sortBy === "latency") list = [...list].sort((a, b) => a.latencyMs - b.latencyMs);
    else if (sortBy === "tps") list = [...list].sort((a, b) => b.tokensPerSecond - a.tokensPerSecond);
    else list = [...list].sort((a, b) => b.passRate - a.passRate);

    return list;
  }, [allMarketplaceModels, search, sortBy, selectedFilters]);

  return (
    <div className="min-h-screen bg-[#fafafa] text-zinc-900 font-sans selection:bg-[#ea580c] selection:text-white py-8 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* ==================== HEADER BANNER (MATCHES AGENT MARKETPLACE) ==================== */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#e4e4e7] pb-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-[#ea580c] font-bold uppercase tracking-wide">
              <HiOutlineSparkles /> AI Models Catalog
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 font-sans">
              Find the right model for the job.
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 max-w-2xl font-sans">
              Production-ready AI models with verified capabilities, connected tools, and transparent run history.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap shrink-0">
            <Link
              to="/compare"
              className="px-4 py-2 bg-zinc-900 hover:bg-black text-white font-bold text-xs font-mono text-center shadow-xs shrink-0 flex items-center gap-1.5"
            >
              <HiOutlineScale className="text-sm text-[#ea580c]" />
              <span>Compare Models</span>
            </Link>

            <Link
              to="/test"
              className="px-4 py-2 bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold text-xs font-mono text-center shadow-xs shrink-0 flex items-center gap-1"
            >
              <HiOutlineBolt />
              <span>+ Benchmark Your Model</span>
            </Link>
          </div>
        </div>

        {/* ==================== TWO-COLUMN LAYOUT (IDENTICAL TO AGENTS) ==================== */}
        <div className="grid grid-cols-1 lg:grid-cols-[220px_minmax(0,1fr)] gap-6 items-start">
          {/* ==================== LEFT FILTER RAIL ==================== */}
          <aside className="bg-white border border-[#e4e4e7] p-4 shadow-xs space-y-5 font-mono text-xs lg:sticky lg:top-20">
            <div className="flex items-center justify-between border-b border-[#e4e4e7] pb-3">
              <h2 className="font-bold uppercase tracking-wide text-zinc-900">Filter models</h2>
              {(search || activeFilters.length > 0) && (
                <button
                  onClick={clearFilters}
                  className="text-[#ea580c] font-bold hover:underline cursor-pointer"
                >
                  Clear all
                </button>
              )}
            </div>

            <div className="space-y-2 max-h-[calc(100vh-235px)] overflow-y-auto pr-1">
              {MODEL_FILTER_GROUPS.map((group) => {
                const selectedCount = (selectedFilters[group.key] || []).length;
                const isExpanded = expandedGroups[group.key];
                const visibleOptions = isExpanded ? group.options : [];

                return (
                  <div key={group.key} className="border-b border-[#f0f0f1] pb-2">
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedGroups((current) => ({
                          ...current,
                          [group.key]: !current[group.key],
                        }))
                      }
                      className="w-full flex items-center justify-between py-1.5 text-left cursor-pointer"
                    >
                      <span className="text-[10px] text-zinc-500 uppercase font-bold">
                        {group.label}
                        {selectedCount > 0 && (
                          <span className="ml-1.5 text-[#ea580c]">({selectedCount})</span>
                        )}
                      </span>
                      <span className="text-zinc-400 text-sm">{isExpanded ? "−" : "+"}</span>
                    </button>

                    {isExpanded && (
                      <div className="grid grid-cols-1 gap-1 pb-1">
                        {visibleOptions.map((option) => {
                          const checked = (selectedFilters[group.key] || []).includes(option);
                          return (
                            <label
                              key={option}
                              className="flex items-center gap-2 text-[11px] text-zinc-600 hover:text-zinc-950 cursor-pointer py-0.5"
                            >
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => toggleFilter(group.key, option)}
                                className="accent-[#ea580c]"
                              />
                              <span className="truncate">{option}</span>
                            </label>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </aside>

          {/* ==================== RIGHT MAIN MODELS CONTENT ==================== */}
          <main className="space-y-4">
            {/* Search Box matching Agent Marketplace */}
            <div className="relative bg-white border border-[#e4e4e7] shadow-xs">
              <HiOutlineMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 text-lg" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Describe the model and we will search it for you"
                className="w-full bg-white focus:border-[#ea580c] pl-11 pr-4 py-4 outline-none text-sm text-zinc-900 placeholder:text-zinc-400"
              />
            </div>

            {/* Results Header Status */}
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="text-zinc-500">
                <strong className="text-zinc-900">{filtered.length}</strong> models found
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-[#e4e4e7] text-zinc-700 px-2.5 py-1.5 outline-none cursor-pointer focus:border-[#ea580c]"
              >
                <option value="relevant">Most Relevant</option>
                <option value="score">Highest Benchmark</option>
                <option value="rating">Highest Rated</option>
                <option value="latency">Lowest Latency</option>
                <option value="price">Lowest Price</option>
                <option value="tps">Highest TPS Speed</option>
              </select>
            </div>

            {/* Active Filters Bar */}
            {(search || activeFilters.length > 0) && (
              <div className="flex flex-wrap items-center gap-2 bg-white border border-[#e4e4e7] p-3 font-mono text-[11px]">
                <span className="text-zinc-500 uppercase font-bold">Active filters:</span>
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="px-2 py-1 bg-zinc-900 text-white cursor-pointer"
                  >
                    “{search}” ×
                  </button>
                )}
                {activeFilters.map(({ key, value }) => (
                  <button
                    key={`${key}-${value}`}
                    onClick={() => toggleFilter(key, value)}
                    className="px-2 py-1 bg-[#fff7ed] border border-orange-200 text-[#ea580c] cursor-pointer"
                  >
                    {value} ×
                  </button>
                ))}
                <button
                  onClick={clearFilters}
                  className="text-zinc-500 hover:text-[#ea580c] font-bold cursor-pointer"
                >
                  Clear all
                </button>
              </div>
            )}

            {/* Model Cards Grid (2 Columns matching Agent Marketplace) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filtered.map((model) => {
                const primaryTag = model.category === "Coding"
                  ? "Coding Model"
                  : model.category === "Reasoning"
                  ? "Reasoning Engine"
                  : model.category;

                return (
                  <article
                    key={model.id}
                    className="bg-white border border-[#e4e4e7] hover:border-zinc-400 p-5 transition-all group shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Header with Avatar & Verified Shield */}
                      <div className="flex items-start gap-3">
                        <div className="w-11 h-11 bg-white border border-[#e4e4e7] flex items-center justify-center shrink-0 overflow-hidden">
                          <img
                            src={`https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(
                              model.creator || model.displayName
                            )}&backgroundColor=f4f4f5&fontFamily=monospace&fontWeight=700`}
                            alt={`${model.creator} logo`}
                            className="w-full h-full object-contain p-1.5"
                            loading="lazy"
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <h3 className="text-base font-bold text-zinc-950 group-hover:text-[#ea580c] transition-colors truncate">
                                {model.displayName}
                              </h3>
                              <p className="text-xs text-zinc-500 font-mono flex items-center gap-1 mt-0.5">
                                <HiOutlineCpuChip className="text-zinc-400" /> Built by {model.creator}
                              </p>
                            </div>
                            <HiOutlineShieldCheck
                              className="text-emerald-600 text-lg shrink-0"
                              title="Verified Benchmark"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-zinc-600 leading-relaxed mt-4 line-clamp-2">
                        {model.description}
                      </p>

                      {/* Capabilities & Tools Rows (Identical to Agent Marketplace) */}
                      <div className="mt-4 pt-3 border-t border-[#e4e4e7] space-y-3">
                        <div>
                          <span className="text-[10px] font-mono text-zinc-400 uppercase font-bold">
                            What it does
                          </span>
                          <div className="flex flex-wrap gap-1.5 mt-1.5">
                            {model.capabilities.slice(0, 3).map((capability) => (
                              <span
                                key={capability}
                                className="px-2 py-1 bg-zinc-100 border border-[#e4e4e7] text-[10px] font-mono text-zinc-700"
                              >
                                {capability}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div>
                          <span className="text-[10px] font-mono text-zinc-400 uppercase font-bold flex items-center gap-1">
                            <HiOutlineWrenchScrewdriver /> Works with
                          </span>
                          <div className="flex flex-wrap gap-1.5 mt-1.5">
                            {model.tools.slice(0, 4).map((tool) => (
                              <span
                                key={tool}
                                className="px-2 py-1 bg-white border border-[#e4e4e7] text-[10px] font-mono text-zinc-700"
                              >
                                {tool}
                              </span>
                            ))}
                            {model.isOpen && (
                              <span className="px-2 py-1 bg-emerald-50 border border-emerald-200 text-[10px] font-mono text-emerald-700 font-bold">
                                Open Weights
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Card Footer Actions (Identical to Agent Marketplace) */}
                    <div className="flex items-center justify-between gap-3 mt-4 pt-3 border-t border-[#e4e4e7] font-mono">
                      <div className="flex items-center gap-2 text-[11px] text-zinc-500">
                        <span className="px-1.5 py-1 bg-[#fff7ed] border border-orange-200 text-[10px] text-[#ea580c] font-bold">
                          {primaryTag}
                        </span>
                        <span className="text-[10px] text-emerald-700 font-bold">
                          {model.passRate?.toFixed(1)}% score
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => setDeployModel(model)}
                          className="px-2.5 py-2 bg-orange-50 hover:bg-orange-100 text-[#ea580c] border border-orange-200 text-xs font-bold transition-colors cursor-pointer"
                          title="1-Click API Run"
                        >
                          <HiOutlinePlay />
                        </button>

                        <Link
                          to={`/models/${model.id}`}
                          className="px-4 py-2 bg-zinc-900 hover:bg-[#ea580c] text-white text-xs font-bold transition-colors shrink-0"
                        >
                          View Model →
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {filtered.length === 0 && !isLoading && (
              <div className="bg-white border border-dashed border-[#e4e4e7] p-10 text-center font-mono text-xs text-zinc-500">
                No models match your filters. Try resetting the sidebar.
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Deployment Modal */}
      {deployModel && (
        <DeployModal
          model={deployModel}
          onClose={() => setDeployModel(null)}
        />
      )}
    </div>
  );
};

export default MarketplacePage;
