import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  HiOutlineSparkles,
  HiOutlineBolt,
  HiOutlinePlay,
  HiOutlineCheckCircle,
  HiOutlineArrowTrendingUp,
  HiOutlineXMark,
  HiOutlineArrowRight,
} from "react-icons/hi2";
import API from "../api/axios";
import DeployModal from "../components/modals/DeployModal";
import { GLOBAL_LIVEBENCH_CATALOG, normalizeModel } from "./MarketplacePage";

export const FindYourModelPage = () => {
  const [prompt, setPrompt] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [recommendation, setRecommendation] = useState(null);
  const [error, setError] = useState(null);
  const [testedModels, setTestedModels] = useState([]);
  const [deployModel, setDeployModel] = useState(null);

  // Fetch verified models from MongoDB Atlas
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
      .catch(() => setTestedModels([]));
  }, []);

  const allMarketplaceModels = useMemo(() => {
    const globalList = GLOBAL_LIVEBENCH_CATALOG.map(normalizeModel);
    return [...testedModels, ...globalList];
  }, [testedModels]);

  const handleSearch = async (customText) => {
    const text = (customText || prompt).trim();
    if (!text || isSearching) return;

    if (customText) setPrompt(customText);
    setIsSearching(true);
    setError(null);

    try {
      const payload = {
        query: text,
        priority: "balanced",
        candidateModels: allMarketplaceModels.slice(0, 30).map((m) => ({
          id: m.id,
          name: m.displayName || m.name,
          category: m.category,
          passRate: m.passRate,
          latencyMs: m.latencyMs,
          price: m.pricingFormatted,
          creator: m.creator,
          description: m.description,
        })),
      };

      const { data } = await API.post("/models/recommend", payload);
      if (data && data.success && data.recommendation) {
        setRecommendation({
          ...data.recommendation,
          engine: data.engine,
          matchedModel:
            data.matchedModel ||
            allMarketplaceModels.find(
              (m) =>
                String(m.id).toLowerCase() ===
                String(data.recommendation.modelId).toLowerCase()
            ) ||
            allMarketplaceModels[0],
        });
      }
    } catch (err) {
      console.error("Gemini recommendation error:", err);
      setError("Unable to find matching model. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-140px)] bg-[#fafafa] text-zinc-900 font-sans selection:bg-[#ea580c] selection:text-white py-16 px-4 sm:px-8 flex flex-col justify-center items-center">
      <div className="max-w-3xl w-full space-y-8">
        
        {/* ==================== CLEAN HEADER ==================== */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-950">
            Describe your model
          </h1>
          <p className="text-sm text-zinc-500 font-mono">
            Enter your use-case, latency, or budget requirements in plain English
          </p>
        </div>

        {/* ==================== MODERN PREMIUM TEXTAREA CARD ==================== */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="bg-white border border-zinc-200 rounded-2xl p-4 shadow-xl shadow-zinc-200/50 focus-within:border-zinc-900 focus-within:ring-4 focus-within:ring-zinc-900/5 transition-all space-y-3"
        >
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSearch();
              }
            }}
            rows={3}
            placeholder="Describe your model requirements... (e.g. I need a fast model for financial data extraction under 120ms with low cost per 1M tokens)"
            disabled={isSearching}
            className="w-full bg-transparent text-zinc-900 placeholder:text-zinc-400 text-sm sm:text-base outline-none resize-none leading-relaxed font-sans"
            autoFocus
          />

          <div className="flex items-center justify-between pt-2 border-t border-zinc-100">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 bg-zinc-100 text-zinc-600 text-xs font-mono px-2.5 py-1 rounded-md">
                <HiOutlineSparkles className="text-[#ea580c] text-xs" />
                <span>Gemini 3.5 Flash</span>
              </span>
              <span className="text-[11px] text-zinc-400 font-mono hidden sm:inline">
                Press ↵ Enter to search
              </span>
            </div>

            <div className="flex items-center gap-2">
              {prompt && (
                <button
                  type="button"
                  onClick={() => {
                    setPrompt("");
                    setRecommendation(null);
                  }}
                  className="text-xs font-mono text-zinc-400 hover:text-zinc-700 px-2 py-1 cursor-pointer"
                >
                  Clear
                </button>
              )}
              <button
                type="submit"
                disabled={!prompt.trim() || isSearching}
                className="bg-zinc-900 hover:bg-[#ea580c] disabled:opacity-40 text-white text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer transition-all shadow-sm"
              >
                {isSearching ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Searching...</span>
                  </>
                ) : (
                  <>
                    <span>Find Model</span>
                    <HiOutlineArrowRight className="text-xs" />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* ==================== RESULT RECOMMENDATION CARD ==================== */}
        {recommendation && (
          <div className="bg-white border-2 border-zinc-900 p-6 shadow-[6px_6px_0_#111] space-y-4 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-200 pb-3">
              <div className="flex items-center gap-2">
                <span className="bg-[#ea580c] text-white font-mono text-xs font-bold px-2.5 py-1 uppercase tracking-wider">
                  {recommendation.badge || "Best Match"}
                </span>
                <span className="text-emerald-700 font-mono text-xs font-bold flex items-center gap-1">
                  <HiOutlineCheckCircle /> {recommendation.matchConfidence || 97}% Confidence
                </span>
              </div>
              <span className="text-[11px] font-mono text-zinc-400">
                {recommendation.engine || "Google Gemini"}
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-baseline gap-2">
                <h3 className="text-xl font-extrabold text-zinc-950">
                  {recommendation.modelName}
                </h3>
                <span className="text-xs font-mono text-zinc-500">
                  ({recommendation.suggestedCategory || "General"})
                </span>
              </div>

              <p className="text-sm text-zinc-700 leading-relaxed">
                {recommendation.reasoning}
              </p>

              {/* Highlights */}
              {Array.isArray(recommendation.keyHighlights) && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 font-mono text-xs">
                  {recommendation.keyHighlights.map((hl, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-zinc-700 bg-zinc-50 p-2 border border-zinc-200">
                      <HiOutlineArrowTrendingUp className="text-[#ea580c] shrink-0" />
                      <span className="truncate">{hl}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Actions & Runner Up */}
            <div className="pt-3 border-t border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-xs font-mono text-zinc-500">
                {recommendation.alternativeModel && (
                  <span>
                    Alternative: <strong className="text-zinc-800">{recommendation.alternativeModel.modelName}</strong> ({recommendation.alternativeModel.badge})
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Link
                  to={`/playground/${recommendation.modelId}`}
                  className="bg-zinc-100 hover:bg-zinc-200 text-zinc-900 font-mono text-xs font-bold px-4 py-2.5 flex items-center gap-1.5 transition-colors"
                >
                  <HiOutlinePlay className="text-[#ea580c]" />
                  <span>Try in Playground</span>
                </Link>
                <button
                  type="button"
                  onClick={() => setDeployModel(recommendation.matchedModel || allMarketplaceModels[0])}
                  className="bg-[#ea580c] hover:bg-orange-600 text-white font-mono text-xs font-bold px-4 py-2.5 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <HiOutlineBolt />
                  <span>1-Click Deploy</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {error && (
          <p className="text-xs text-red-600 font-mono text-center">
            {error}
          </p>
        )}

        {/* Deploy Modal */}
        {deployModel && (
          <DeployModal
            model={deployModel}
            onClose={() => setDeployModel(null)}
          />
        )}

      </div>
    </div>
  );
};

export default FindYourModelPage;
