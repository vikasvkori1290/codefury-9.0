import React, { useState, useEffect, useRef, useMemo } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  HiOutlineArrowLeft,
  HiOutlinePaperAirplane,
  HiOutlineSparkles,
  HiOutlineKey,
  HiOutlineTrash,
  HiOutlineClipboard,
  HiOutlineCheck,
  HiOutlineCpuChip,
  HiOutlineBolt,
  HiOutlineAdjustmentsHorizontal,
  HiOutlineShieldCheck,
  HiOutlineArrowPath,
  HiOutlineXMark,
  HiOutlineCreditCard,
  HiOutlineCurrencyDollar,
  HiOutlineCheckCircle,
  HiOutlineScale,
} from "react-icons/hi2";
import API from "../api/axios";
import { PRELOADED_FRONTIER_MODELS } from "./LiveBenchPage";
import { normalizeModel, GLOBAL_LIVEBENCH_CATALOG } from "./MarketplacePage";

export default function PlaygroundPage() {
  const { modelId } = useParams();
  const navigate = useNavigate();

  const [allModels, setAllModels] = useState(GLOBAL_LIVEBENCH_CATALOG.map(normalizeModel));
  const [selectedModelId, setSelectedModelId] = useState(modelId || "grok-4-6");
  const [testedModels, setTestedModels] = useState([]);
  const [isLoadingModels, setIsLoadingModels] = useState(true);

  // Split view state (compare max 2 models side-by-side)
  const [isSplitView, setIsSplitView] = useState(false);
  const [selectedModelBId, setSelectedModelBId] = useState("gemini-flash-latest");
  const [modelBApiKey, setModelBApiKey] = useState(() => localStorage.getItem("MODELHUB_MODEL_B_KEY") || "");
  const [isModelBKeyModalOpen, setIsModelBKeyModalOpen] = useState(false);
  const [tempModelBKey, setTempModelBKey] = useState("");

  // Model A API Key management (saved in localStorage)
  const [grokApiKey, setGrokApiKey] = useState(() => localStorage.getItem("MODELHUB_GROK_API_KEY") || "");
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const [tempApiKey, setTempApiKey] = useState("");

  // Pay as you go / Playground Credits state
  const [userCredits, setUserCredits] = useState(() => {
    const saved = localStorage.getItem("MODELHUB_USER_CREDITS");
    return saved !== null ? parseFloat(saved) : 0.0;
  });
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("starter"); // 'starter' | 'pro'
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccessMsg, setPaymentSuccessMsg] = useState("");

  // Chat conversation state for Model A & Model B
  const [prompt, setPrompt] = useState("");
  const [loadingA, setLoadingA] = useState(false);
  const [loadingB, setLoadingB] = useState(false);
  const [temperature, setTemperature] = useState(0.7);
  const [customSystemPrompt, setCustomSystemPrompt] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [copiedIndexA, setCopiedIndexA] = useState(null);
  const [copiedIndexB, setCopiedIndexB] = useState(null);

  const messagesContainerRefA = useRef(null);
  const messagesContainerRefB = useRef(null);

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
      .finally(() => setIsLoadingModels(false));
  }, []);

  // Merge tested creator models with all 44 LiveBench global models
  const combinedCatalog = useMemo(() => {
    const globalList = GLOBAL_LIVEBENCH_CATALOG.map(normalizeModel);
    const merged = [...testedModels, ...globalList];
    return Array.from(new Map(merged.map((m) => [m.id, m])).values());
  }, [testedModels]);

  // Model A
  const activeModel = useMemo(() => {
    const found = combinedCatalog.find(
      (m) =>
        m.id.toLowerCase() === selectedModelId.toLowerCase() ||
        m.name.toLowerCase() === selectedModelId.toLowerCase() ||
        m.displayName.toLowerCase() === selectedModelId.toLowerCase()
    );
    return found || combinedCatalog[0] || {
      id: selectedModelId,
      displayName: selectedModelId,
      creator: "@AI",
      provider: "Frontier",
      category: "General",
      passRate: 97.1,
      latencyMs: 120,
    };
  }, [combinedCatalog, selectedModelId]);

  // Model B (for split comparison)
  const activeModelB = useMemo(() => {
    const found = combinedCatalog.find(
      (m) =>
        m.id.toLowerCase() === selectedModelBId.toLowerCase() ||
        m.name.toLowerCase() === selectedModelBId.toLowerCase() ||
        m.displayName.toLowerCase() === selectedModelBId.toLowerCase()
    );
    return (
      found ||
      combinedCatalog.find((m) => m.id !== activeModel.id) ||
      combinedCatalog[0]
    );
  }, [combinedCatalog, selectedModelBId, activeModel.id]);

  // Messages for Model A
  const [messagesA, setMessagesA] = useState([
    {
      role: "assistant",
      content: `Hello! I am **${activeModel.displayName}** (${activeModel.creator}).\n\nAsk me any question or request code to begin live inference.`,
      meta: `${activeModel.latencyMs}ms baseline · ${activeModel.passRate}% pass rate`,
    },
  ]);

  // Messages for Model B
  const [messagesB, setMessagesB] = useState([
    {
      role: "assistant",
      content: `Hello! I am **${activeModelB.displayName}** (${activeModelB.creator}).\n\nReady for side-by-side comparison.`,
      meta: `${activeModelB.latencyMs}ms baseline · ${activeModelB.passRate}% pass rate`,
    },
  ]);

  // Reset Model A welcome message when model changes
  useEffect(() => {
    setMessagesA([
      {
        role: "assistant",
        content: `Active session: **${activeModel.displayName}** (${activeModel.creator}).\n\nReady for live inference.`,
        meta: `${activeModel.latencyMs}ms baseline · ${activeModel.passRate}% LiveBench score`,
      },
    ]);
  }, [activeModel.id]);

  // Reset Model B welcome message when model changes
  useEffect(() => {
    setMessagesB([
      {
        role: "assistant",
        content: `Comparison candidate: **${activeModelB.displayName}** (${activeModelB.creator}).\n\nReady for side-by-side inference.`,
        meta: `${activeModelB.latencyMs}ms baseline · ${activeModelB.passRate}% LiveBench score`,
      },
    ]);
  }, [activeModelB.id]);

  // Auto-scroll chat boxes internally without moving the browser window
  useEffect(() => {
    if (messagesContainerRefA.current && messagesA.length > 1) {
      messagesContainerRefA.current.scrollTop = messagesContainerRefA.current.scrollHeight;
    }
    if (messagesContainerRefB.current && messagesB.length > 1) {
      messagesContainerRefB.current.scrollTop = messagesContainerRefB.current.scrollHeight;
    }
  }, [messagesA, messagesB, loadingA, loadingB]);

  const saveApiKey = () => {
    if (tempApiKey.trim()) {
      localStorage.setItem("MODELHUB_GROK_API_KEY", tempApiKey.trim());
      setGrokApiKey(tempApiKey.trim());
    } else {
      localStorage.removeItem("MODELHUB_GROK_API_KEY");
      setGrokApiKey("");
    }
    setIsKeyModalOpen(false);
  };

  const saveModelBKey = () => {
    if (tempModelBKey.trim()) {
      localStorage.setItem("MODELHUB_MODEL_B_KEY", tempModelBKey.trim());
      setModelBApiKey(tempModelBKey.trim());
    } else {
      localStorage.removeItem("MODELHUB_MODEL_B_KEY");
      setModelBApiKey("");
    }
    setIsModelBKeyModalOpen(false);
  };

  const handlePayForCredits = () => {
    setIsProcessingPayment(true);
    setTimeout(() => {
      const addedAmount = selectedPlan === "starter" ? 5.0 : 15.0;
      const newTotal = +(userCredits + addedAmount).toFixed(2);
      setUserCredits(newTotal);
      localStorage.setItem("MODELHUB_USER_CREDITS", String(newTotal));
      setIsProcessingPayment(false);
      setPaymentSuccessMsg(`Successfully added $${addedAmount.toFixed(2)} credits to your playground balance!`);
      setTimeout(() => {
        setPaymentSuccessMsg("");
        setIsPayModalOpen(false);
      }, 1500);
    }, 800);
  };

  const copyMessage = (text, idx, isA = true) => {
    navigator.clipboard.writeText(text);
    if (isA) {
      setCopiedIndexA(idx);
      setTimeout(() => setCopiedIndexA(null), 2000);
    } else {
      setCopiedIndexB(idx);
      setTimeout(() => setCopiedIndexB(null), 2000);
    }
  };

  const clearChat = () => {
    setMessagesA([
      {
        role: "assistant",
        content: `Chat session reset for **${activeModel.displayName}**.`,
      },
    ]);
    setMessagesB([
      {
        role: "assistant",
        content: `Chat session reset for **${activeModelB.displayName}**.`,
      },
    ]);
  };

  const sendMessage = async () => {
    if (!prompt.trim() || loadingA || loadingB) return;

    const userText = prompt.trim();
    const userMessage = { role: "user", content: userText };

    const newHistoryA = [...messagesA, userMessage];
    const newHistoryB = [...messagesB, userMessage];

    setMessagesA(newHistoryA);
    if (isSplitView) setMessagesB(newHistoryB);
    setPrompt("");

    const effectiveKeyA = grokApiKey ? grokApiKey.trim() : "";
    const effectiveKeyB = modelBApiKey ? modelBApiKey.trim() : "";
    const hasPaidCredits = userCredits > 0;

    // Send Model A
    setLoadingA(true);
    API.post("/chat", {
      modelId: activeModel.id,
      modelName: activeModel.displayName,
      messages: newHistoryA,
      apiKey: effectiveKeyA || undefined,
      isPaidCredit: hasPaidCredits && !effectiveKeyA,
      temperature,
      systemPrompt:
        customSystemPrompt.trim() ||
        `You are ${activeModel.displayName} built by ${activeModel.creator}. Specializing in ${activeModel.category}. Provide accurate, articulate answers using markdown.`,
    })
      .then((res) => {
        if (res.data?.success) {
          const latency = res.data.latency_ms || 100;
          const tps = res.data.tokens_per_sec || Math.max(1, Math.round(((res.data.tokens_used?.total_tokens || 100) / (latency / 1000))));
          setMessagesA((prev) => [
            ...prev,
            {
              role: "assistant",
              content: res.data.output,
              meta: `${latency}ms · ${tps} tokens/sec · ${
                hasPaidCredits && !effectiveKeyA ? "Paid Credits" : res.data.engine || "Live Engine"
              }`,
            },
          ]);
        } else {
          throw new Error(res.data?.message || "Inference failed");
        }
      })
      .catch((err) => {
        const errMsg = err.response?.data?.message || err.message || "Failed to communicate.";
        setMessagesA((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `⚠️ **Inference Notice (Model A):** ${errMsg}\n\n*Click **"Set Model A API Key"** to connect your key.*`,
          },
        ]);
      })
      .finally(() => setLoadingA(false));

    // If Split View, Send Model B concurrently
    if (isSplitView) {
      setLoadingB(true);
      API.post("/chat", {
        modelId: activeModelB.id,
        modelName: activeModelB.displayName,
        messages: newHistoryB,
        apiKey: effectiveKeyB || undefined,
        isPaidCredit: hasPaidCredits && !effectiveKeyB,
        temperature,
        systemPrompt: `You are ${activeModelB.displayName} built by ${activeModelB.creator}. Specializing in ${activeModelB.category}. Provide accurate, articulate answers using markdown.`,
      })
        .then((res) => {
          if (res.data?.success) {
            const latency = res.data.latency_ms || 100;
            const tps = res.data.tokens_per_sec || Math.max(1, Math.round(((res.data.tokens_used?.total_tokens || 100) / (latency / 1000))));
            setMessagesB((prev) => [
              ...prev,
              {
                role: "assistant",
                content: res.data.output,
                meta: `${latency}ms · ${tps} tokens/sec · ${
                  hasPaidCredits && !effectiveKeyB ? "Paid Credits" : res.data.engine || "Live Engine"
                }`,
              },
            ]);
          } else {
            throw new Error(res.data?.message || "Inference failed");
          }
        })
        .catch((err) => {
          const errMsg = err.response?.data?.message || err.message || "Failed to communicate.";
          setMessagesB((prev) => [
            ...prev,
            {
              role: "assistant",
              content: `⚠️ **Inference Notice (Model B):** ${errMsg}\n\n*Click **"Set API Key of Model B"** to connect your key (e.g. Gemini key).*`,
            },
          ]);
        })
        .finally(() => setLoadingB(false));
    }

    if (hasPaidCredits && !effectiveKeyA) {
      const deduction = isSplitView ? 0.004 : 0.002;
      const updatedBalance = Math.max(0, +(userCredits - deduction).toFixed(4));
      setUserCredits(updatedBalance);
      localStorage.setItem("MODELHUB_USER_CREDITS", String(updatedBalance));
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans text-zinc-900 pb-16">
      {/* Top Header Navigation */}
      <div className="bg-white border-b border-[#e4e4e7] py-3.5 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 font-mono text-xs">
          <div className="flex items-center gap-3">
            <Link
              to={`/models/${activeModel.id}`}
              className="flex items-center gap-1.5 text-zinc-600 hover:text-zinc-950 font-bold transition-colors"
            >
              <HiOutlineArrowLeft />
              <span>Back</span>
            </Link>
            <span className="text-zinc-300">/</span>
            <Link to="/models" className="text-zinc-500 hover:text-zinc-950">
              AI Models
            </Link>
            <span className="text-zinc-300">/</span>
            <span className="font-bold text-[#ea580c]">
              {isSplitView ? "Dual Arena Comparison" : "Interactive Playground"}
            </span>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Button 1: Main / Model A API Key */}
            <button
              onClick={() => {
                setTempApiKey(grokApiKey);
                setIsKeyModalOpen(true);
              }}
              className={`px-3 py-1.5 border text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                grokApiKey
                  ? "bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100"
                  : "bg-white border-zinc-300 text-zinc-800 hover:bg-zinc-50"
              }`}
            >
              <HiOutlineKey />
              <span>
                {isSplitView
                  ? grokApiKey
                    ? "● Model A Key Active"
                    : "Set Model A Key"
                  : grokApiKey
                  ? "● API Key Active"
                  : "Get API Key / Set API Key"}
              </span>
            </button>

            {/* Button 2: Set API Key of Model B (ONLY shown when isSplitView is true) */}
            {isSplitView && (
              <button
                onClick={() => {
                  setTempModelBKey(modelBApiKey);
                  setIsModelBKeyModalOpen(true);
                }}
                className={`px-3 py-1.5 border text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  modelBApiKey
                    ? "bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100"
                    : "bg-orange-50 border-orange-200 text-[#ea580c] hover:bg-orange-100 shadow-xs"
                }`}
              >
                <HiOutlineKey />
                <span>
                  {modelBApiKey ? "● Model B Key Active" : "Set API Key of Model B"}
                </span>
              </button>
            )}

            {/* Button 3: Pay / Instant Access Button */}
            <button
              onClick={() => setIsPayModalOpen(true)}
              className={`px-3 py-1.5 border text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                userCredits > 0
                  ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                  : "bg-[#ea580c] border-[#ea580c] text-white hover:bg-[#c2410c] shadow-xs"
              }`}
            >
              <HiOutlineCreditCard />
              <span>
                {userCredits > 0
                  ? `● Balance: $${userCredits.toFixed(2)}`
                  : "💳 Pay / Instant Access"}
              </span>
            </button>

            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-1.5 bg-[#fafafa] hover:bg-zinc-200 border border-[#e4e4e7] text-zinc-700 text-sm cursor-pointer"
              title="Toggle Parameters Rail"
            >
              <HiOutlineAdjustmentsHorizontal />
            </button>
          </div>
        </div>
      </div>

      {/* Main Studio Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ==================== CHAT WORKSPACE ==================== */}
          <div className={`${showSettings ? "lg:col-span-8" : "lg:col-span-12"} space-y-4`}>
            {/* Top Bar Switch / Trigger */}
            {!isSplitView && (
              <div className="bg-white border border-[#e4e4e7] p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start sm:items-center gap-3.5">
                  <div className="w-12 h-12 bg-zinc-950 text-white font-mono font-bold text-sm flex items-center justify-center shrink-0 border border-zinc-800 shadow-xs">
                    {activeModel.displayName.slice(0, 2).toUpperCase()}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-lg font-bold font-sans text-zinc-950 tracking-tight">
                        {activeModel.displayName}
                      </h2>

                      <div className="flex items-center gap-1.5 font-mono text-[10px]">
                        {activeModel.isTested ? (
                          <span className="px-2 py-0.5 font-bold bg-orange-50 text-[#ea580c] border border-orange-200">
                            LIVE TESTED
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 font-bold text-zinc-700 bg-zinc-100 border border-zinc-200">
                            LIVEBENCH FRONTIER
                          </span>
                        )}

                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span>Ready</span>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs font-mono text-zinc-500 flex-wrap">
                      <span className="text-zinc-700 font-medium">{activeModel.creator}</span>
                      <span>•</span>
                      <span>{activeModel.category}</span>
                      <span>•</span>
                      <span>
                        Pass Rate: <b className="text-emerald-700 font-bold">{activeModel.passRate}%</b>
                      </span>
                      <span>•</span>
                      <span>{activeModel.latencyMs}ms Latency</span>
                    </div>
                  </div>
                </div>

                {/* Compare Button */}
                <div className="flex items-center gap-2 font-mono text-xs shrink-0 self-start md:self-center">
                  <button
                    onClick={() => setIsSplitView(true)}
                    className="px-4 py-2 bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                  >
                    <HiOutlineScale />
                    <span>Compare</span>
                  </button>
                </div>
              </div>
            )}

            {/* Split View Header Bar */}
            {isSplitView && (
              <div className="flex items-center justify-between bg-white border border-[#e4e4e7] px-4 py-3 shadow-xs">
                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className="font-bold text-zinc-950 uppercase tracking-wider">
                    ⚖️ Side-by-Side Dual Arena
                  </span>
                  <span className="text-zinc-400">|</span>
                  <span className="text-zinc-500">
                    Comparing <b>{activeModel.displayName}</b> vs <b>{activeModelB.displayName}</b>
                  </span>
                </div>

                <button
                  onClick={() => setIsSplitView(false)}
                  className="px-3 py-1.5 bg-zinc-900 hover:bg-black text-white text-xs font-mono font-bold flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <HiOutlineXMark />
                  <span>Exit Comparison</span>
                </button>
              </div>
            )}

            {/* Chat Messages Area (Single Column or Symmetrical 2-Columns) */}
            <div
              className={`grid gap-4 ${
                isSplitView ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"
              }`}
            >
              {/* ================= COLUMN 1: MODEL A ================= */}
              <div className="space-y-3 flex flex-col">
                {/* Column 1 Symmetrical Header (shown in split view) */}
                {isSplitView && (
                  <div className="bg-white border border-[#e4e4e7] p-3.5 shadow-xs flex items-center justify-between gap-3 font-mono text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 bg-zinc-950 text-white font-bold text-xs flex items-center justify-center shrink-0">
                        {activeModel.displayName.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-zinc-950 font-sans text-xs">
                            {activeModel.displayName}
                          </span>
                          <span className="text-[9px] px-1 bg-orange-50 text-[#ea580c] border border-orange-200 font-bold">
                            MODEL A
                          </span>
                        </div>
                        <p className="text-[10px] text-zinc-500">
                          {activeModel.creator} · {activeModel.passRate}% score
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setTempApiKey(grokApiKey);
                        setIsKeyModalOpen(true);
                      }}
                      className={`text-[10px] px-2 py-1 border font-bold cursor-pointer transition-colors ${
                        grokApiKey
                          ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                          : "bg-orange-50 border-orange-200 text-[#ea580c]"
                      }`}
                    >
                      {grokApiKey ? "● Key Active" : "🔑 Set Key"}
                    </button>
                  </div>
                )}

                {/* Model A Messages Box */}
                <div
                  ref={messagesContainerRefA}
                  className="bg-white border border-[#e4e4e7] shadow-xs min-h-[460px] max-h-[560px] overflow-y-auto p-4 space-y-4 flex-1"
                >
                  {messagesA.map((msg, idx) => {
                    const isUser = msg.role === "user";
                    return (
                      <div
                        key={idx}
                        className={`flex ${isUser ? "justify-end" : "justify-start"} animate-fadeIn`}
                      >
                        <div
                          className={`max-w-[90%] p-3.5 space-y-2 text-xs leading-relaxed ${
                            isUser
                              ? "bg-zinc-950 text-white font-mono"
                              : "bg-[#fafafa] border border-[#e4e4e7] text-zinc-900 font-sans"
                          }`}
                        >
                          {!isUser && (
                            <div className="flex items-center justify-between gap-4 border-b border-[#edf0f5] pb-1 font-mono text-[10px] text-zinc-400">
                              <span className="font-bold text-zinc-700 flex items-center gap-1">
                                <HiOutlineSparkles className="text-[#ea580c]" />
                                {activeModel.displayName}
                              </span>
                              <button
                                onClick={() => copyMessage(msg.content, idx, true)}
                                className="hover:text-black flex items-center gap-1 cursor-pointer"
                              >
                                {copiedIndexA === idx ? (
                                  <>
                                    <HiOutlineCheck className="text-emerald-600" />
                                    <span>Copied</span>
                                  </>
                                ) : (
                                  <>
                                    <HiOutlineClipboard />
                                    <span>Copy</span>
                                  </>
                                )}
                              </button>
                            </div>
                          )}

                          <div className="whitespace-pre-wrap font-sans text-xs">
                            {msg.content}
                          </div>

                          {!isUser && msg.meta && (
                            <div className="pt-1.5 border-t border-[#edf0f5] text-[10px] font-mono text-zinc-400">
                              <span>⚡ {msg.meta}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {loadingA && (
                    <div className="flex justify-start">
                      <div className="p-3.5 bg-orange-50 border border-orange-200 font-mono text-xs text-[#ea580c] flex items-center gap-2 animate-pulse">
                        <HiOutlineArrowPath className="animate-spin text-sm" />
                        <span>Generating with {activeModel.displayName}...</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* ================= COLUMN 2: MODEL B (when isSplitView) ================= */}
              {isSplitView && (
                <div className="space-y-3 flex flex-col animate-fadeIn">
                  {/* Column 2 Symmetrical Header with Model B Dropdown */}
                  <div className="bg-white border border-[#e4e4e7] p-3.5 shadow-xs flex items-center justify-between gap-3 font-mono text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 bg-zinc-800 text-white font-bold text-xs flex items-center justify-center shrink-0">
                        {activeModelB.displayName.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <select
                            value={activeModelB.id}
                            onChange={(e) => setSelectedModelBId(e.target.value)}
                            className="bg-zinc-50 border border-[#e4e4e7] px-2 py-0.5 text-xs font-mono font-bold text-zinc-900 outline-none cursor-pointer focus:border-[#ea580c] max-w-[170px]"
                          >
                            {combinedCatalog
                              .filter((m) => m.id !== activeModel.id)
                              .map((m) => (
                                <option key={m.id} value={m.id}>
                                  {m.displayName} ({m.passRate}%)
                                </option>
                              ))}
                          </select>
                          <span className="text-[9px] px-1 bg-zinc-100 text-zinc-700 border border-zinc-200 font-bold">
                            MODEL B
                          </span>
                        </div>
                        <p className="text-[10px] text-zinc-500">
                          {activeModelB.creator} · {activeModelB.passRate}% score
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setTempModelBKey(modelBApiKey);
                        setIsModelBKeyModalOpen(true);
                      }}
                      className={`text-[10px] px-2 py-1 border font-bold cursor-pointer transition-colors ${
                        modelBApiKey
                          ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                          : "bg-orange-50 border-orange-200 text-[#ea580c]"
                      }`}
                    >
                      {modelBApiKey ? "● Key Active" : "🔑 Set Key"}
                    </button>
                  </div>

                  {/* Model B Messages Box */}
                  <div
                    ref={messagesContainerRefB}
                    className="bg-white border border-[#e4e4e7] shadow-xs min-h-[460px] max-h-[560px] overflow-y-auto p-4 space-y-4 flex-1"
                  >
                    {messagesB.map((msg, idx) => {
                      const isUser = msg.role === "user";
                      return (
                        <div
                          key={idx}
                          className={`flex ${isUser ? "justify-end" : "justify-start"} animate-fadeIn`}
                        >
                          <div
                            className={`max-w-[90%] p-3.5 space-y-2 text-xs leading-relaxed ${
                              isUser
                                ? "bg-zinc-950 text-white font-mono"
                                : "bg-[#fafafa] border border-[#e4e4e7] text-zinc-900 font-sans"
                            }`}
                          >
                            {!isUser && (
                              <div className="flex items-center justify-between gap-4 border-b border-[#edf0f5] pb-1 font-mono text-[10px] text-zinc-400">
                                <span className="font-bold text-zinc-700 flex items-center gap-1">
                                  <HiOutlineSparkles className="text-[#ea580c]" />
                                  {activeModelB.displayName}
                                </span>
                                <button
                                  onClick={() => copyMessage(msg.content, idx, false)}
                                  className="hover:text-black flex items-center gap-1 cursor-pointer"
                                >
                                  {copiedIndexB === idx ? (
                                    <>
                                      <HiOutlineCheck className="text-emerald-600" />
                                      <span>Copied</span>
                                    </>
                                  ) : (
                                    <>
                                      <HiOutlineClipboard />
                                      <span>Copy</span>
                                    </>
                                  )}
                                </button>
                              </div>
                            )}

                            <div className="whitespace-pre-wrap font-sans text-xs">
                              {msg.content}
                            </div>

                            {!isUser && msg.meta && (
                              <div className="pt-1.5 border-t border-[#edf0f5] text-[10px] font-mono text-zinc-400">
                                <span>⚡ {msg.meta}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}

                    {loadingB && (
                      <div className="flex justify-start">
                        <div className="p-3.5 bg-orange-50 border border-orange-200 font-mono text-xs text-[#ea580c] flex items-center gap-2 animate-pulse">
                          <HiOutlineArrowPath className="animate-spin text-sm" />
                          <span>Generating with {activeModelB.displayName}...</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Input Composer Box */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
              }}
              className="bg-white border border-[#e4e4e7] shadow-xs p-3 space-y-2"
            >
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder={
                  isSplitView
                    ? `Type a prompt to send to BOTH ${activeModel.displayName} & ${activeModelB.displayName}... (Press Enter to send)`
                    : `Type a prompt for ${activeModel.displayName}... (Press Enter to send)`
                }
                rows={3}
                className="w-full text-xs text-zinc-900 placeholder:text-zinc-400 outline-none resize-none font-sans p-1"
              />

              <div className="flex items-center justify-between pt-2 border-t border-[#f4f4f5] font-mono text-xs">
                <div className="flex items-center gap-3 text-zinc-400 text-[11px]">
                  <span>Shift + Enter for new line</span>
                  <button
                    type="button"
                    onClick={clearChat}
                    className="hover:text-red-600 flex items-center gap-1 cursor-pointer"
                  >
                    <HiOutlineTrash />
                    <span>Clear chat</span>
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loadingA || loadingB || !prompt.trim()}
                  className="px-5 py-2 bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs disabled:opacity-40 cursor-pointer"
                >
                  <span>{isSplitView ? "Send to Both Models" : "Send"}</span>
                  <HiOutlinePaperAirplane className="text-xs" />
                </button>
              </div>
            </form>
          </div>

          {/* ==================== PARAMETERS SIDEBAR RAIL ==================== */}
          {showSettings && (
            <div className="lg:col-span-4 bg-white border border-[#e4e4e7] p-5 shadow-xs font-mono text-xs space-y-5 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-[#f4f4f5] pb-3">
                <span className="font-bold uppercase tracking-wider text-zinc-950 text-[11px]">
                  PARAMETERS & SYSTEM
                </span>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-zinc-400 hover:text-black cursor-pointer"
                >
                  <HiOutlineXMark />
                </button>
              </div>

              {/* Temperature Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-zinc-600">
                  <span>Temperature:</span>
                  <b className="text-zinc-950">{temperature}</b>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="1.0"
                  step="0.05"
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  className="w-full accent-[#ea580c] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-zinc-400">
                  <span>Deterministic (0.0)</span>
                  <span>Creative (1.0)</span>
                </div>
              </div>

              {/* System Prompt */}
              <div className="space-y-2">
                <span className="font-bold text-zinc-700 uppercase text-[10px] block">
                  System Persona Override:
                </span>
                <textarea
                  value={customSystemPrompt}
                  onChange={(e) => setCustomSystemPrompt(e.target.value)}
                  placeholder={`You are ${activeModel.displayName}...`}
                  rows={4}
                  className="w-full bg-[#fafafa] border border-[#e4e4e7] p-2 text-xs text-zinc-800 outline-none resize-none font-sans"
                />
              </div>

              {/* Model Spec Telemetry */}
              <div className="p-3 bg-[#fafafa] border border-[#e4e4e7] space-y-2 text-[11px]">
                <span className="font-bold text-zinc-900 block uppercase text-[10px]">
                  Model A Telemetry
                </span>
                <div className="flex justify-between text-zinc-600">
                  <span>Pass Rate:</span>
                  <b className="text-emerald-700">{activeModel.passRate}%</b>
                </div>
                <div className="flex justify-between text-zinc-600">
                  <span>Latency:</span>
                  <b className="text-zinc-900">{activeModel.latencyMs} ms</b>
                </div>
                <div className="flex justify-between text-zinc-600">
                  <span>Pricing:</span>
                  <b className="text-[#ea580c]">{activeModel.pricingFormatted}</b>
                </div>
              </div>

              {isSplitView && (
                <div className="p-3 bg-[#fafafa] border border-[#e4e4e7] space-y-2 text-[11px]">
                  <span className="font-bold text-zinc-900 block uppercase text-[10px]">
                    Model B Telemetry
                  </span>
                  <div className="flex justify-between text-zinc-600">
                    <span>Pass Rate:</span>
                    <b className="text-emerald-700">{activeModelB.passRate}%</b>
                  </div>
                  <div className="flex justify-between text-zinc-600">
                    <span>Latency:</span>
                    <b className="text-zinc-900">{activeModelB.latencyMs} ms</b>
                  </div>
                  <div className="flex justify-between text-zinc-600">
                    <span>Pricing:</span>
                    <b className="text-[#ea580c]">{activeModelB.pricingFormatted}</b>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ==================== GET API KEY / SET API KEY MODAL (MODEL A) ==================== */}
      {isKeyModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border-2 border-[#ea580c] max-w-lg w-full p-6 space-y-5 shadow-2xl font-mono text-xs animate-fadeIn">
            <div className="flex items-center justify-between border-b border-[#f4f4f5] pb-3">
              <div className="flex items-center gap-2">
                <HiOutlineKey className="text-[#ea580c] text-base" />
                <h3 className="font-bold text-sm font-sans text-zinc-950">
                  Set API Key for Model A ({activeModel.displayName})
                </h3>
              </div>
              <button
                onClick={() => setIsKeyModalOpen(false)}
                className="text-zinc-400 hover:text-black cursor-pointer"
              >
                <HiOutlineXMark className="text-lg" />
              </button>
            </div>

            {/* Step 1: Get API Key */}
            <div className="p-3.5 bg-[#fafafa] border border-[#e4e4e7] space-y-2.5">
              <span className="text-[10px] font-bold uppercase text-zinc-500 block">
                1. Don't have an API key? Get one free:
              </span>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <a
                  href="https://console.groq.com/keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 bg-zinc-900 hover:bg-black text-white text-[11px] font-bold text-center flex items-center justify-center gap-1 transition-colors"
                >
                  <span>↗ Free Groq Key</span>
                </a>
                <a
                  href="https://aistudio.google.com/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 bg-white hover:bg-zinc-100 border border-[#e4e4e7] text-zinc-800 text-[11px] font-bold text-center flex items-center justify-center gap-1 transition-colors"
                >
                  <span>↗ Free Gemini Key</span>
                </a>
                <a
                  href="https://console.x.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 bg-white hover:bg-zinc-100 border border-[#e4e4e7] text-zinc-800 text-[11px] font-bold text-center flex items-center justify-center gap-1 transition-colors"
                >
                  <span>↗ xAI Grok Key</span>
                </a>
              </div>
            </div>

            {/* Step 2: Paste API Key */}
            <div className="space-y-2">
              <label className="font-bold text-zinc-800 text-[11px] block uppercase">
                2. Paste API Key for Model A:
              </label>
              <input
                type="password"
                value={tempApiKey}
                onChange={(e) => setTempApiKey(e.target.value)}
                placeholder="gsk_... (Groq) or AIzaSy... (Gemini) or xai-..."
                className="w-full bg-[#fafafa] border border-[#e4e4e7] p-3 text-xs text-zinc-950 font-mono outline-none focus:border-[#ea580c]"
              />
            </div>

            <div className="flex items-center justify-between gap-2.5 pt-2 border-t border-[#f4f4f5]">
              {grokApiKey ? (
                <button
                  onClick={() => {
                    localStorage.removeItem("MODELHUB_GROK_API_KEY");
                    setGrokApiKey("");
                    setTempApiKey("");
                    setIsKeyModalOpen(false);
                  }}
                  className="text-red-600 hover:underline text-xs font-bold cursor-pointer"
                >
                  Disconnect / Remove Key
                </button>
              ) : (
                <span />
              )}

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsKeyModalOpen(false)}
                  className="px-4 py-2 border border-zinc-300 text-zinc-700 text-xs font-bold hover:bg-zinc-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={saveApiKey}
                  className="px-5 py-2 bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  Save Model A Key
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== SET API KEY OF MODEL B MODAL ==================== */}
      {isModelBKeyModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border-2 border-[#ea580c] max-w-lg w-full p-6 space-y-5 shadow-2xl font-mono text-xs animate-fadeIn">
            <div className="flex items-center justify-between border-b border-[#f4f4f5] pb-3">
              <div className="flex items-center gap-2">
                <HiOutlineKey className="text-[#ea580c] text-base" />
                <h3 className="font-bold text-sm font-sans text-zinc-950">
                  Set API Key of Model B ({activeModelB.displayName})
                </h3>
              </div>
              <button
                onClick={() => setIsModelBKeyModalOpen(false)}
                className="text-zinc-400 hover:text-black cursor-pointer"
              >
                <HiOutlineXMark className="text-lg" />
              </button>
            </div>

            {/* Step 1: Get API Key */}
            <div className="p-3.5 bg-[#fafafa] border border-[#e4e4e7] space-y-2.5">
              <span className="text-[10px] font-bold uppercase text-zinc-500 block">
                1. Need an API key for {activeModelB.displayName}?
              </span>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <a
                  href="https://console.groq.com/keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 bg-zinc-900 hover:bg-black text-white text-[11px] font-bold text-center flex items-center justify-center gap-1 transition-colors"
                >
                  <span>↗ Free Groq Key</span>
                </a>
                <a
                  href="https://aistudio.google.com/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 bg-white hover:bg-zinc-100 border border-[#e4e4e7] text-zinc-800 text-[11px] font-bold text-center flex items-center justify-center gap-1 transition-colors"
                >
                  <span>↗ Free Gemini Key</span>
                </a>
                <a
                  href="https://console.x.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 bg-white hover:bg-zinc-100 border border-[#e4e4e7] text-zinc-800 text-[11px] font-bold text-center flex items-center justify-center gap-1 transition-colors"
                >
                  <span>↗ xAI Grok Key</span>
                </a>
              </div>
            </div>

            {/* Step 2: Paste API Key */}
            <div className="space-y-2">
              <label className="font-bold text-zinc-800 text-[11px] block uppercase">
                2. Paste API Key for Model B:
              </label>
              <input
                type="password"
                value={tempModelBKey}
                onChange={(e) => setTempModelBKey(e.target.value)}
                placeholder="gsk_... (Groq) or AIzaSy... (Gemini) or xai-..."
                className="w-full bg-[#fafafa] border border-[#e4e4e7] p-3 text-xs text-zinc-950 font-mono outline-none focus:border-[#ea580c]"
              />
              <span className="text-[10px] text-zinc-500 block font-sans">
                Paste the API key for whichever model you selected as Model B (Groq, Google Gemini, or xAI Grok).
              </span>
            </div>

            <div className="flex items-center justify-between gap-2.5 pt-2 border-t border-[#f4f4f5]">
              {modelBApiKey ? (
                <button
                  onClick={() => {
                    localStorage.removeItem("MODELHUB_MODEL_B_KEY");
                    setModelBApiKey("");
                    setTempModelBKey("");
                    setIsModelBKeyModalOpen(false);
                  }}
                  className="text-red-600 hover:underline text-xs font-bold cursor-pointer"
                >
                  Disconnect / Remove Key
                </button>
              ) : (
                <span />
              )}

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsModelBKeyModalOpen(false)}
                  className="px-4 py-2 border border-zinc-300 text-zinc-700 text-xs font-bold hover:bg-zinc-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={saveModelBKey}
                  className="px-5 py-2 bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  Save Model B Key
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== PAY AS YOU GO MODAL ==================== */}
      {isPayModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border-2 border-[#ea580c] max-w-md w-full p-6 space-y-5 shadow-2xl font-mono text-xs animate-fadeIn">
            <div className="flex items-center justify-between border-b border-[#f4f4f5] pb-3">
              <div className="flex items-center gap-2">
                <HiOutlineCreditCard className="text-[#ea580c] text-base" />
                <h3 className="font-bold text-sm font-sans text-zinc-950">
                  Instant Playground Access (No API Key)
                </h3>
              </div>
              <button
                onClick={() => setIsPayModalOpen(false)}
                className="text-zinc-400 hover:text-black cursor-pointer"
              >
                <HiOutlineXMark className="text-lg" />
              </button>
            </div>

            <p className="text-zinc-600 font-sans text-xs leading-relaxed">
              Top up playground credits to chat with any frontier model instantly without needing an API key.
            </p>

            {/* Plan Choice */}
            <div className="grid grid-cols-2 gap-3 font-sans">
              <div
                onClick={() => setSelectedPlan("starter")}
                className={`p-3.5 border cursor-pointer transition-all space-y-1.5 ${
                  selectedPlan === "starter"
                    ? "bg-orange-50/70 border-[#ea580c] shadow-xs"
                    : "bg-[#fafafa] border-[#e4e4e7] hover:border-zinc-400"
                }`}
              >
                <div className="text-xs font-bold text-zinc-950">Starter Pack</div>
                <div className="text-xl font-bold text-[#ea580c] font-mono">$5.00</div>
                <div className="text-[10px] text-zinc-500 font-mono">500,000 Tokens</div>
              </div>

              <div
                onClick={() => setSelectedPlan("pro")}
                className={`p-3.5 border cursor-pointer transition-all space-y-1.5 ${
                  selectedPlan === "pro"
                    ? "bg-orange-50/70 border-[#ea580c] shadow-xs"
                    : "bg-[#fafafa] border-[#e4e4e7] hover:border-zinc-400"
                }`}
              >
                <div className="text-xs font-bold text-zinc-950">Pro Pack</div>
                <div className="text-xl font-bold text-zinc-900 font-mono">$15.00</div>
                <div className="text-[10px] text-zinc-500 font-mono">2,000,000 Tokens</div>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="p-3 bg-[#fafafa] border border-[#e4e4e7] space-y-1.5 text-[11px] font-mono">
              <div className="flex justify-between text-zinc-600">
                <span>Access Plan:</span>
                <b className="text-zinc-900">{selectedPlan === "starter" ? "Starter ($5.00)" : "Pro ($15.00)"}</b>
              </div>
              <div className="flex justify-between text-zinc-600">
                <span>Current Balance:</span>
                <b className="text-emerald-700">${userCredits.toFixed(2)}</b>
              </div>
              <div className="flex justify-between text-zinc-600 pt-1 border-t border-[#edf0f5]">
                <span>Total Charge:</span>
                <b className="text-[#ea580c] text-xs font-bold">{selectedPlan === "starter" ? "$5.00" : "$15.00"}</b>
              </div>
            </div>

            {paymentSuccessMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-mono flex items-center gap-2">
                <HiOutlineCheckCircle className="text-base shrink-0" />
                <span>{paymentSuccessMsg}</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setIsPayModalOpen(false)}
                disabled={isProcessingPayment}
                className="px-4 py-2 border border-zinc-300 text-zinc-700 text-xs font-bold hover:bg-zinc-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handlePayForCredits}
                disabled={isProcessingPayment}
                className="px-5 py-2 bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
              >
                {isProcessingPayment ? (
                  <>
                    <HiOutlineArrowPath className="animate-spin text-sm" />
                    <span>Processing Payment...</span>
                  </>
                ) : (
                  <>
                    <span>Pay {selectedPlan === "starter" ? "$5.00" : "$15.00"} & Start Chatting</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
