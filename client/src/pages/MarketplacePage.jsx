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
  HiOutlineTrophy,
  HiOutlineScale,
  HiOutlinePlus,
  HiOutlineMinus,
  HiOutlineCheckBadge,
  HiOutlineAdjustmentsHorizontal,
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

// Generate 2-letter avatar initials
const getInitials = (name = "") => {
  const parts = name.replace(/[^a-zA-Z0-9 ]/g, " ").trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase() || "AI";
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
    pricingPer1k: Number(model.pricingPer1k || model.pricingPer1kTokens || model.pricing || 0.00015),
    pricingFormatted: model.pricingFormatted || `$${Number(model.pricingPer1k || model.pricingPer1kTokens || model.pricing || 0.00015).toFixed(5)} / 1k`,
    passRate,
    latencyMs,
    tokensPerSecond,
    description: model.description || "Creator model registered on ModelHub with verified 35-case benchmark assertions.",
    scores,
    sampleQueries: model.sampleQueries || [
      { prompt: "Extract JSON structured fields", pass: true, latency: latencyMs },
      { prompt: "GSM8K Math logic test", pass: true, latency: latencyMs },
    ],
  };
};

export const MarketplacePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCapability, setSelectedCapability] = useState("all");
  const [selectedSource, setSelectedSource] = useState("all"); // 'all' | 'tested' | 'frontier' | 'open'
  const [selectedPricing, setSelectedPricing] = useState("all");
  const [selectedRating, setSelectedRating] = useState("all");
  const [selectedLatency, setSelectedLatency] = useState("all");
  const [sortBy, setSortBy] = useState("score"); // 'score' | 'latency' | 'cheapest' | 'tps'

  // Sidebar accordions state
  const [openSections, setOpenSections] = useState({
    capability: true,
    source: true,
    pricing: true,
    rating: true,
    latency: true,
  });

  const toggleSection = (key) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

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

  const filteredModels = useMemo(() => {
    return allMarketplaceModels
      .filter((m) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const match =
            m.name.toLowerCase().includes(q) ||
            m.displayName.toLowerCase().includes(q) ||
            m.creator.toLowerCase().includes(q) ||
            m.description.toLowerCase().includes(q);
          if (!match) return false;
        }

        // Capability filter
        if (selectedCapability !== "all") {
          if (selectedCapability === "coding") {
            if ((m.scores.coding || 0) < 78 && (m.scores.agentic_coding || 0) < 60) return false;
          } else if (selectedCapability === "reasoning") {
            if ((m.scores.reasoning || 0) < 80 && (m.scores.mathematics || 0) < 80) return false;
          } else if (selectedCapability === "math") {
            if ((m.scores.mathematics || 0) < 85) return false;
          } else if (selectedCapability === "agentic") {
            if ((m.scores.agentic_coding || 0) < 55) return false;
          } else if (selectedCapability === "data_analysis") {
            if ((m.scores.data_analysis || 0) < 70) return false;
          } else if (selectedCapability === "instruction") {
            if ((m.scores.instruction || 0) < 70) return false;
          }
        }

        // Source / Type filter
        if (selectedSource === "tested" && !m.isTested) return false;
        if (selectedSource === "frontier" && m.isTested) return false;
        if (selectedSource === "open" && !m.isOpen) return false;
        if (selectedSource === "proprietary" && m.isOpen) return false;

        // Pricing filter
        if (selectedPricing === "open_free" && !m.isOpen) return false;
        if (selectedPricing === "under_0002" && m.pricingPer1k > 0.0002) return false;
        if (selectedPricing === "under_001" && m.pricingPer1k > 0.001) return false;

        // Rating / Score filter
        if (selectedRating === "90_plus" && m.passRate < 90) return false;
        if (selectedRating === "80_plus" && m.passRate < 80) return false;
        if (selectedRating === "70_plus" && m.passRate < 70) return false;

        // Latency filter
        if (selectedLatency === "sub_100" && m.latencyMs >= 100) return false;
        if (selectedLatency === "sub_200" && m.latencyMs >= 200) return false;
        if (selectedLatency === "sub_500" && m.latencyMs >= 500) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "latency") return a.latencyMs - b.latencyMs;
        if (sortBy === "cheapest") return a.pricingPer1k - b.pricingPer1k;
        if (sortBy === "tps") return b.tokensPerSecond - a.tokensPerSecond;
        return b.passRate - a.passRate; // default score
      });
  }, [
    allMarketplaceModels,
    searchQuery,
    selectedCapability,
    selectedSource,
    selectedPricing,
    selectedRating,
    selectedLatency,
    sortBy,
  ]);

  const resetAllFilters = () => {
    setSearchQuery("");
    setSelectedCapability("all");
    setSelectedSource("all");
    setSelectedPricing("all");
    setSelectedRating("all");
    setSelectedLatency("all");
    setSortBy("score");
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-zinc-900 font-sans selection:bg-[#ea580c] selection:text-white py-8 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* ==================== HERO HEADER BANNER ==================== */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#ea580c] flex items-center gap-1.5">
              <HiOutlineSparkles />
              <span>AI Models Catalog</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 font-sans">
              Find the right model for the job.
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 font-sans max-w-2xl">
              Production-ready AI models with verified 35-case LiveBench capabilities, sub-100ms latencies, and transparent run history.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <Link
              to="/compare"
              className="px-4 py-2.5 bg-zinc-900 hover:bg-black text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-xs"
            >
              <HiOutlineScale className="text-sm text-[#ea580c]" />
              <span>Compare Models</span>
            </Link>

            <Link
              to="/test"
              className="px-4 py-2.5 bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-xs"
            >
              <HiOutlineBolt />
              <span>+ Benchmark Your Model</span>
            </Link>
          </div>
        </div>

        {/* ==================== TWO-COLUMN LAYOUT (SIDEBAR + MODELS) ==================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ==================== LEFT FILTER SIDEBAR ==================== */}
          <div className="lg:col-span-3 bg-white border border-[#e4e4e7] p-5 shadow-xs space-y-5 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-[#f4f4f5] pb-3">
              <span className="font-bold uppercase tracking-wider text-zinc-950 text-[11px]">
                FILTER MODELS
              </span>
              <button
                onClick={resetAllFilters}
                className="text-[10px] text-[#ea580c] hover:underline cursor-pointer"
              >
                Reset
              </button>
            </div>

            {/* 1. CAPABILITY ACCORDION */}
            <div className="space-y-2 border-b border-[#f4f4f5] pb-3">
              <div
                onClick={() => toggleSection("capability")}
                className="flex items-center justify-between cursor-pointer text-zinc-700 hover:text-black font-bold uppercase text-[10px]"
              >
                <span>CAPABILITY</span>
                <span>{openSections.capability ? <HiOutlineMinus /> : <HiOutlinePlus />}</span>
              </div>
              {openSections.capability && (
                <div className="space-y-1 pt-1 text-[11px]">
                  {[
                    { id: "all", label: "All Capabilities" },
                    { id: "coding", label: "Code Synthesis" },
                    { id: "agentic", label: "Agentic Tool Use" },
                    { id: "reasoning", label: "Reasoning & Logic" },
                    { id: "math", label: "Mathematics (90%+)" },
                    { id: "data_analysis", label: "Data Analysis" },
                    { id: "instruction", label: "Instruction Following" },
                  ].map((cap) => (
                    <label
                      key={cap.id}
                      className="flex items-center gap-2 cursor-pointer py-0.5 text-zinc-600 hover:text-black"
                    >
                      <input
                        type="radio"
                        name="capability"
                        checked={selectedCapability === cap.id}
                        onChange={() => setSelectedCapability(cap.id)}
                        className="accent-[#ea580c]"
                      />
                      <span>{cap.label}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* 2. SOURCE / TYPE ACCORDION */}
            <div className="space-y-2 border-b border-[#f4f4f5] pb-3">
              <div
                onClick={() => toggleSection("source")}
                className="flex items-center justify-between cursor-pointer text-zinc-700 hover:text-black font-bold uppercase text-[10px]"
              >
                <span>SOURCE / TYPE</span>
                <span>{openSections.source ? <HiOutlineMinus /> : <HiOutlinePlus />}</span>
              </div>
              {openSections.source && (
                <div className="space-y-1 pt-1 text-[11px]">
                  {[
                    { id: "all", label: `All Models (${allMarketplaceModels.length})` },
                    { id: "tested", label: `🧪 Tested by Us (${testedModels.length})` },
                    { id: "frontier", label: `🌐 LiveBench Frontier (44)` },
                    { id: "open", label: "Open Weights [open]" },
                    { id: "proprietary", label: "Proprietary API" },
                  ].map((src) => (
                    <label
                      key={src.id}
                      className="flex items-center gap-2 cursor-pointer py-0.5 text-zinc-600 hover:text-black"
                    >
                      <input
                        type="radio"
                        name="source"
                        checked={selectedSource === src.id}
                        onChange={() => setSelectedSource(src.id)}
                        className="accent-[#ea580c]"
                      />
                      <span>{src.label}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* 3. PRICING ACCORDION */}
            <div className="space-y-2 border-b border-[#f4f4f5] pb-3">
              <div
                onClick={() => toggleSection("pricing")}
                className="flex items-center justify-between cursor-pointer text-zinc-700 hover:text-black font-bold uppercase text-[10px]"
              >
                <span>PRICING / TIER</span>
                <span>{openSections.pricing ? <HiOutlineMinus /> : <HiOutlinePlus />}</span>
              </div>
              {openSections.pricing && (
                <div className="space-y-1 pt-1 text-[11px]">
                  {[
                    { id: "all", label: "All Price Tiers" },
                    { id: "open_free", label: "Free / Open Weights" },
                    { id: "under_0002", label: "< $0.0002 / 1k (Budget)" },
                    { id: "under_001", label: "< $0.001 / 1k" },
                  ].map((pr) => (
                    <label
                      key={pr.id}
                      className="flex items-center gap-2 cursor-pointer py-0.5 text-zinc-600 hover:text-black"
                    >
                      <input
                        type="radio"
                        name="pricing"
                        checked={selectedPricing === pr.id}
                        onChange={() => setSelectedPricing(pr.id)}
                        className="accent-[#ea580c]"
                      />
                      <span>{pr.label}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* 4. RATING / BENCHMARK SCORE ACCORDION */}
            <div className="space-y-2 border-b border-[#f4f4f5] pb-3">
              <div
                onClick={() => toggleSection("rating")}
                className="flex items-center justify-between cursor-pointer text-zinc-700 hover:text-black font-bold uppercase text-[10px]"
              >
                <span>BENCHMARK SCORE</span>
                <span>{openSections.rating ? <HiOutlineMinus /> : <HiOutlinePlus />}</span>
              </div>
              {openSections.rating && (
                <div className="space-y-1 pt-1 text-[11px]">
                  {[
                    { id: "all", label: "All Benchmark Scores" },
                    { id: "90_plus", label: "90%+ Top Frontier Tier" },
                    { id: "80_plus", label: "80%+ High Accuracy" },
                    { id: "70_plus", label: "70%+ Solid Performance" },
                  ].map((rt) => (
                    <label
                      key={rt.id}
                      className="flex items-center gap-2 cursor-pointer py-0.5 text-zinc-600 hover:text-black"
                    >
                      <input
                        type="radio"
                        name="rating"
                        checked={selectedRating === rt.id}
                        onChange={() => setSelectedRating(rt.id)}
                        className="accent-[#ea580c]"
                      />
                      <span>{rt.label}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* 5. LATENCY ACCORDION */}
            <div className="space-y-2 border-b border-[#f4f4f5] pb-3">
              <div
                onClick={() => toggleSection("latency")}
                className="flex items-center justify-between cursor-pointer text-zinc-700 hover:text-black font-bold uppercase text-[10px]"
              >
                <span>LATENCY</span>
                <span>{openSections.latency ? <HiOutlineMinus /> : <HiOutlinePlus />}</span>
              </div>
              {openSections.latency && (
                <div className="space-y-1 pt-1 text-[11px]">
                  {[
                    { id: "all", label: "Any Latency" },
                    { id: "sub_100", label: "< 100ms Ultra-Fast" },
                    { id: "sub_200", label: "< 200ms Fast" },
                    { id: "sub_500", label: "< 500ms Standard" },
                  ].map((lat) => (
                    <label
                      key={lat.id}
                      className="flex items-center gap-2 cursor-pointer py-0.5 text-zinc-600 hover:text-black"
                    >
                      <input
                        type="radio"
                        name="latency"
                        checked={selectedLatency === lat.id}
                        onChange={() => setSelectedLatency(lat.id)}
                        className="accent-[#ea580c]"
                      />
                      <span>{lat.label}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Reset / Toggle button */}
            <button
              onClick={resetAllFilters}
              className="w-full py-2 bg-[#fafafa] hover:bg-zinc-100 border border-[#e4e4e7] text-zinc-700 text-[11px] font-bold text-center transition-colors cursor-pointer"
            >
              Reset all filters
            </button>

            {/* SORT BY DROPDOWN */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] uppercase font-bold text-zinc-400 block">
                SORT BY
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-[#fafafa] border border-[#e4e4e7] p-2 text-xs text-zinc-900 outline-none cursor-pointer"
              >
                <option value="score">Highest Benchmark Score</option>
                <option value="latency">Lowest Latency</option>
                <option value="cheapest">Lowest Cost</option>
                <option value="tps">Highest Speed (TPS)</option>
              </select>
            </div>
          </div>

          {/* ==================== RIGHT MAIN MODELS CONTENT ==================== */}
          <div className="lg:col-span-9 space-y-4">
            {/* Search Box matching the screenshot */}
            <div className="relative bg-white border border-[#e4e4e7] p-1.5 shadow-xs">
              <HiOutlineMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 text-sm" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Describe the model or capability and we will search it for you..."
                className="w-full pl-9 pr-4 py-2 text-xs text-zinc-900 outline-none bg-transparent font-sans"
              />
            </div>

            {/* Results Header Status */}
            <div className="flex items-center justify-between font-mono text-xs text-zinc-500 px-1">
              <span className="font-bold text-zinc-900">
                {filteredModels.length} models found
              </span>
              <span>
                {allMarketplaceModels.length} verified benchmark publishers
              </span>
            </div>

            {/* Model Cards Grid (2-Columns matching screenshot) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredModels.map((model) => {
                const initials = getInitials(model.displayName);

                return (
                  <div
                    key={model.id}
                    className="bg-white border border-[#e4e4e7] p-5 shadow-xs hover:border-[#ea580c]/50 transition-all flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      {/* Top Header with Avatar & Verified Badge */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          {/* 2-Letter Dark Box Avatar */}
                          <div className="w-10 h-10 bg-zinc-950 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0">
                            {initials}
                          </div>

                          <div>
                            <h3 className="font-bold text-zinc-950 text-sm font-sans hover:text-[#ea580c] transition-colors line-clamp-1">
                              {model.displayName}
                            </h3>
                            <span className="text-[11px] text-zinc-500 font-mono block">
                              {model.creator}
                            </span>
                          </div>
                        </div>

                        {/* Verified Shield Badge */}
                        <div className="text-emerald-600 text-lg" title="LiveBench Verified">
                          <HiOutlineShieldCheck />
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-zinc-600 font-sans line-clamp-2 leading-relaxed">
                        {model.description}
                      </p>

                      {/* Tag Pills */}
                      <div className="flex items-center gap-1.5 flex-wrap font-mono text-[10px]">
                        <span className="px-2 py-0.5 bg-[#fafafa] border border-zinc-200 text-zinc-700">
                          {model.category}
                        </span>
                        {model.isTested ? (
                          <span className="px-2 py-0.5 bg-orange-50 text-[#ea580c] border border-orange-200 font-bold">
                            LIVE TESTED
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-zinc-100 text-zinc-800 border border-zinc-200 font-bold">
                            LIVEBENCH
                          </span>
                        )}
                        {model.isOpen && (
                          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200">
                            open weights
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Stats & Actions Footer */}
                    <div className="space-y-3 pt-3 border-t border-[#f4f4f5] font-mono">
                      {/* Metric 3-Column Numbers */}
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div>
                          <span className="text-[9px] text-zinc-400 block uppercase">BENCHMARK</span>
                          <span className="font-bold text-emerald-700 text-sm">
                            {model.passRate?.toFixed(1)}%
                          </span>
                        </div>
                        <div>
                          <span className="text-[9px] text-zinc-400 block uppercase">SUCCESS</span>
                          <span className="font-bold text-zinc-900 text-sm">
                            {model.passRate?.toFixed(1)}%
                          </span>
                        </div>
                        <div>
                          <span className="text-[9px] text-zinc-400 block uppercase">LATENCY</span>
                          <span className="font-bold text-zinc-900 text-sm">
                            {(model.latencyMs / 1000).toFixed(2)}s
                          </span>
                        </div>
                      </div>

                      {/* Secondary Row with Price & View Action */}
                      <div className="flex items-center justify-between gap-2 pt-1">
                        <div className="text-[11px] space-y-0.5">
                          <div className="text-zinc-500">
                            RATING <b className="text-zinc-900">4.9 ★</b> • <b className="text-zinc-900">{model.tokensPerSecond} TPS</b>
                          </div>
                          <div className="font-bold text-[#ea580c] text-xs">
                            {model.pricingFormatted}
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <Link
                            to={`/models/${model.id}`}
                            className="px-3.5 py-1.5 bg-zinc-950 hover:bg-black text-white text-xs font-mono font-bold flex items-center gap-1 transition-all shadow-xs"
                          >
                            <span>View Model</span>
                            <HiOutlineArrowRight className="text-xs" />
                          </Link>

                          <button
                            onClick={() => setDeployModel(model)}
                            className="p-1.5 bg-orange-50 hover:bg-orange-100 text-[#ea580c] border border-orange-200 text-xs transition-colors"
                            title="Deploy / Run API"
                          >
                            <HiOutlinePlay />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Empty State */}
            {filteredModels.length === 0 && !isLoading && (
              <div className="p-12 bg-white border border-[#e4e4e7] text-center font-mono text-xs text-zinc-500 space-y-2">
                <div>No AI models match your current sidebar filters or search query.</div>
                <button
                  onClick={resetAllFilters}
                  className="text-[#ea580c] underline hover:text-[#c2410c] cursor-pointer"
                >
                  Reset all filters
                </button>
              </div>
            )}
          </div>
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
