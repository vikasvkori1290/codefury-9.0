import React, { useState } from "react";
import toast from "react-hot-toast";
import {
  HiOutlineCheckCircle,
  HiOutlineSparkles,
} from "react-icons/hi2";
import { useBenchmark } from "../../hooks/useBenchmark";
import Step1InputConfig from "./Step1InputConfig";
import Step3VerdictDashboard from "./Step3VerdictDashboard";
import ModelBadge from "../atoms/ModelBadge";
import API from "../../api/axios";

export const WorkflowContainer = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [benchmarkProgress, setBenchmarkProgress] = useState(0);
  const [benchmarkResponse, setBenchmarkResponse] = useState(null);

  const benchmarkState = useBenchmark();
  const {
    category,
    setCategory,
    inputMode,
    setInputMode,
    prompt,
    setPrompt,
    expectedOutput,
    setExpectedOutput,
    uploadedFile,
    setUploadedFile,
    priority,
    setPriority,
    models,
    toggleModel,
    loadPreset,
    handleFileUpload,
    compilePayload,
  } = benchmarkState;

  const handleStartBenchmark = async () => {
    const payload = compilePayload();
    setCurrentStep(2);
    setBenchmarkProgress(20);

    const progressInterval = setInterval(() => {
      setBenchmarkProgress((prev) => {
        if (prev >= 85) return prev;
        return prev + 15;
      });
    }, 120);

    try {
      const { data } = await API.post("/benchmark", {
          prompt: payload.prompt,
          category: payload.category,
          priority: payload.priority,
          expected_output: payload.expectedOutput,
          test_cases: payload.datasetCases,
          selected_models: payload.models.map((m) => m.id),
      });
      clearInterval(progressInterval);
      setBenchmarkProgress(100);
      setBenchmarkResponse(data);

      setTimeout(() => {
        setCurrentStep(3);
      }, 400);
    } catch (err) {
      clearInterval(progressInterval);
      console.warn("Backend benchmark request fallback:", err);

      // Fallback synthetic benchmark calculation
      const fallbackResults = payload.models.map((m) => {
        const pTokens = Math.max(12, Math.ceil(payload.prompt.length / 4));
        const cTokens = Math.floor(35 + Math.random() * 40);
        const tTokens = pTokens + cTokens;
        const lat = m.isCreator ? Math.floor(108 + Math.random() * 35) : Math.floor(260 + Math.random() * 80);
        const cost = +(tTokens * (m.costPer1M / 1000000)).toFixed(6);

        return {
          model_id: m.id,
          model_name: m.name,
          short_name: m.shortName,
          creator_type: m.type,
          provider: m.provider,
          status: "success",
          output_text: m.isCreator
            ? `{"status": "extracted", "target_data": ${JSON.stringify(payload.prompt.slice(0, 42))}, "confidence": 0.984}`
            : `[${m.name}]: Processed evaluation for ${payload.category}. Output generated with high frontier fidelity.`,
          latency_ms: lat,
          tokens_used: { prompt_tokens: pTokens, completion_tokens: cTokens, total_tokens: tTokens },
          estimated_cost_usd: cost,
          cost_per_1m: m.costPer1M,
          cost_per_1k_calls: +(cost * 1000).toFixed(4),
          judge_score: m.isCreator ? 7.5 : 7.0,
          judge_critique: m.isCreator ? "High efficiency and strict formatting." : "Standard frontier response.",
          composite_score: m.isCreator ? 89.2 : 72.0,
          rank: m.isCreator ? 1 : 2,
          award_badge: m.isCreator ? "Best Overall" : "Rank #2",
          all_awards: m.isCreator ? ["Best Overall", "Fastest Response", "Most Cost-Effective"] : [],
          is_creator: m.isCreator,
        };
      });

      const fallbackWinner = fallbackResults.find((r) => r.is_creator) || fallbackResults[0];

      setBenchmarkProgress(100);
      setBenchmarkResponse({
        success: true,
        simulated: true,
        simulationReason: "The benchmark backend is unavailable. Results below are illustrative only.",
        summary: {
          recommended_winner: fallbackWinner.model_name,
          fastest_latency_ms: fallbackWinner.latency_ms,
          creator_speedup_factor: +(290 / Math.max(1, fallbackWinner.latency_ms)).toFixed(1),
          awards: {
            best_overall: fallbackWinner.model_name,
            fastest: fallbackWinner.model_name,
            most_cost_effective: fallbackWinner.model_name,
          },
        },
        results: fallbackResults,
      });

      setTimeout(() => {
        setCurrentStep(3);
      }, 400);
    }
  };

  const activeModels = models.filter((m) => m.selected);

  return (
    <div className="w-full bg-white rounded-none border border-[#e4e4e7] overflow-hidden shadow-xs font-sans">
      {/* ==================== 3-STEP TABS ==================== */}
      <div className="grid grid-cols-3 border-b border-[#e4e4e7] bg-[#fafafa] text-xs font-mono select-none">
        {[
          { step: 1, title: "1. Define Test Data", desc: "Category, Prompt & Models" },
          { step: 2, title: "2. Live Benchmark", desc: "Concurrent Backend Dispatch" },
          { step: 3, title: "3. Verdict & Deploy", desc: "LLM Judge & Scorecard" },
        ].map((item) => {
          const isActive = currentStep === item.step;
          const isDone = currentStep > item.step;

          return (
            <button
              key={item.step}
              onClick={() => {
                if (isDone || item.step < currentStep) setCurrentStep(item.step);
              }}
              disabled={!isDone && currentStep !== item.step}
              className={`py-3.5 px-4 text-center transition-all relative flex flex-col items-center justify-center border-r border-[#e4e4e7] last:border-r-0 rounded-none ${
                isActive
                  ? "bg-white text-zinc-950 font-bold"
                  : isDone
                  ? "bg-[#fafafa] text-zinc-700 hover:bg-zinc-100 cursor-pointer"
                  : "text-zinc-400 bg-[#f4f4f5] cursor-not-allowed"
              }`}
            >
              {isActive && <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#ea580c]" />}

              <div className="flex items-center gap-1.5">
                {isDone ? (
                  <HiOutlineCheckCircle className="text-emerald-600 text-sm" />
                ) : (
                  <span
                    className={`w-3.5 h-3.5 rounded-none flex items-center justify-center text-[9px] font-bold ${
                      isActive ? "bg-[#ea580c] text-white" : "bg-zinc-200 text-zinc-600"
                    }`}
                  >
                    {item.step}
                  </span>
                )}
                <span className="truncate">{item.title}</span>
             </div>
              <span className="text-[10px] text-zinc-400 font-sans hidden sm:block mt-0.5">
                {item.desc}
              </span>
            </button>
          );
        })}
      </div>

      {/* ==================== STEP CONTENT ==================== */}
      <div className="p-6 sm:p-8">
        {/* STEP 1: INPUT CONFIGURATION & DATASET UPLOADER */}
        {currentStep === 1 && (
          <Step1InputConfig
            category={category}
            setCategory={setCategory}
            inputMode={inputMode}
            setInputMode={setInputMode}
            prompt={prompt}
            setPrompt={setPrompt}
            expectedOutput={expectedOutput}
            setExpectedOutput={setExpectedOutput}
            uploadedFile={uploadedFile}
            setUploadedFile={setUploadedFile}
            priority={priority}
            setPriority={setPriority}
            models={models}
            toggleModel={toggleModel}
            loadPreset={loadPreset}
            handleFileUpload={handleFileUpload}
            onRunBenchmark={handleStartBenchmark}
          />
        )}

        {/* STEP 2: LIVE BENCHMARK STREAMING */}
        {currentStep === 2 && (
          <div className="space-y-6 py-6 text-center">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-none bg-orange-50 border border-orange-200 text-[#ea580c] text-xs font-mono font-bold">
              <HiOutlineSparkles className="animate-spin text-sm" />
               <span>Orchestrating {activeModels.length} Models via /api/benchmark ({benchmarkProgress}%)</span>
             </div>
             {benchmarkResponse?.simulated && (
               <div className="max-w-2xl mx-auto border border-amber-300 bg-amber-50 px-4 py-3 text-left text-xs text-amber-900 font-mono">
                 <strong>SIMULATION MODE:</strong> {benchmarkResponse.simulationReason}
               </div>
             )}

            {/* Progress Bar */}
            <div className="max-w-md mx-auto w-full h-2 bg-zinc-100 rounded-none overflow-hidden border border-zinc-200">
              <div
                className="h-full bg-[#ea580c] transition-all duration-200 rounded-none"
                style={{ width: `${benchmarkProgress}%` }}
              />
            </div>

            {/* Live Model Stream Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 max-w-4xl mx-auto text-left font-mono text-xs">
              {activeModels.map((m) => (
                <div
                  key={m.id}
                  className="p-3.5 rounded-none border border-[#e4e4e7] bg-[#fafafa] space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <ModelBadge type={m.type} size="sm">{m.provider}</ModelBadge>
                    <span className="w-2 h-2 rounded-none bg-amber-500 animate-pulse" />
                  </div>

                  <div>
                    <div className="font-bold text-zinc-900 truncate">{m.shortName || m.name}</div>
                    <div className="text-[10px] text-zinc-500 mt-0.5">Streaming real-time execution...</div>
                  </div>

                  <div className="pt-2 border-t border-zinc-200 text-[11px] space-y-0.5">
                    <div className="flex justify-between text-zinc-600">
                      <span>Base Latency:</span>
                      <span className="font-bold text-zinc-900">{m.baseLatency}ms</span>
                    </div>
                    <div className="flex justify-between text-zinc-600">
                      <span>Rate:</span>
                      <span className="font-bold text-zinc-900">${m.costPer1M.toFixed(2)}/1M</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: LLM JUDGE & COMPARISON VERDICT DASHBOARD */}
        {currentStep === 3 && (
          <Step3VerdictDashboard
            benchmarkResponse={benchmarkResponse}
            priority={priority}
            category={category}
            prompt={prompt}
            onReset={() => setCurrentStep(1)}
          />
        )}
      </div>
    </div>
  );
};

export default WorkflowContainer;
