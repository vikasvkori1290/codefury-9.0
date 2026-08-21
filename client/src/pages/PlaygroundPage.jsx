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
} from "react-icons/hi2";
import API from "../api/axios";
import { PRELOADED_FRONTIER_MODELS } from "./LiveBenchPage";
import { normalizeModel, GLOBAL_LIVEBENCH_CATALOG } from "./MarketplacePage";

const SUGGESTED_PROMPTS = [
  { label: "💻 Code Synthesis", prompt: "Write an optimal React custom hook `useDebounce` in TypeScript with cleanup on unmount." },
  { label: "🧮 Math & Logic", prompt: "Solve GSM8K: A store sells apples for $2 each and oranges for $3. Alice bought 12 fruits in total for $31. How many apples did she buy?" },
  { label: "⚡ JSON Extraction", prompt: "Extract customer name, order ID, amount, and items into strict JSON from: 'Invoice #8491 for customer Sarah Jenkins on Aug 21, total $249.50 (2x Headphones)'." },
  { label: "🧠 Deep Reasoning", prompt: "Compare the trade-offs of microservices vs monolithic architecture for a fast-growing startup with 5 engineers." },
];

export default function PlaygroundPage() {
  const { modelId } = useParams();
  const navigate = useNavigate();

  const [allModels, setAllModels] = useState(GLOBAL_LIVEBENCH_CATALOG.map(normalizeModel));
  const [selectedModelId, setSelectedModelId] = useState(modelId || "grok-4-6");
  const [testedModels, setTestedModels] = useState([]);
  const [isLoadingModels, setIsLoadingModels] = useState(true);

  // Grok API Key management (saved in localStorage)
  const [grokApiKey, setGrokApiKey] = useState(() => localStorage.getItem("MODELHUB_GROK_API_KEY") || "");
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const [tempApiKey, setTempApiKey] = useState("");

  // Chat conversation state
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [temperature, setTemperature] = useState(0.7);
  const [customSystemPrompt, setCustomSystemPrompt] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const messagesEndRef = useRef(null);

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

  // Current active model
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
      provider: "xAI / Frontier",
      category: "General",
      passRate: 97.1,
      latencyMs: 120,
    };
  }, [combinedCatalog, selectedModelId]);

  // Initial welcome message when model changes
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Hello! I am **${activeModel.displayName}** (${activeModel.creator}).\n\nAsk me any question, request code, or choose one of the benchmark challenge prompts below to start testing.`,
      meta: `${activeModel.latencyMs}ms baseline · ${activeModel.passRate}% pass rate`,
    },
  ]);

  // Update welcome message when switching model
  useEffect(() => {
    setMessages([
      {
        role: "assistant",
        content: `Switched active session to **${activeModel.displayName}** (${activeModel.creator}).\n\nReady for live inference. Type a prompt or select a benchmark query below.`,
        meta: `${activeModel.latencyMs}ms baseline · ${activeModel.passRate}% LiveBench score`,
      },
    ]);
  }, [activeModel.id]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

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

  const copyMessage = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const clearChat = () => {
    setMessages([
      {
        role: "assistant",
        content: `Chat session reset. Ready to test **${activeModel.displayName}**.`,
      },
    ]);
  };

  const sendMessage = async (customText = null) => {
    const textToSend = typeof customText === "string" ? customText : prompt;
    if (!textToSend.trim() || loading) return;

    const userMessage = { role: "user", content: textToSend.trim() };
    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setPrompt("");
    setLoading(true);

    try {
      const response = await API.post("/chat", {
        modelId: activeModel.id,
        modelName: activeModel.displayName,
        messages: newHistory,
        apiKey: grokApiKey || undefined,
        temperature,
        systemPrompt:
          customSystemPrompt.trim() ||
          `You are ${activeModel.displayName} built by ${activeModel.creator}. You are an elite AI model specializing in ${activeModel.category}. Provide accurate, articulate, and well-structured answers using GitHub markdown.`,
      });

      const data = response.data;
      if (data && data.success) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.output,
            meta: `${data.latency_ms}ms · ${data.tokens_used?.total_tokens || 0} tokens · ${data.engine || "Live Engine"}`,
          },
        ]);
      } else {
        throw new Error(data.message || "Inference failed");
      }
    } catch (err) {
      console.error("Chat error:", err);
      const errMsg = err.response?.data?.message || err.message || "Failed to communicate with model.";
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `⚠️ **Inference Notice:** ${errMsg}\n\n*Tip: Click **"🔑 Set Grok API Key"** at the top right to connect your Grok (xAI) API key.*`,
        },
      ]);
    } finally {
      setLoading(false);
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
              <span>Scorecard</span>
            </Link>
            <span className="text-zinc-300">/</span>
            <Link to="/models" className="text-zinc-500 hover:text-zinc-950">
              AI Models
            </Link>
            <span className="text-zinc-300">/</span>
            <span className="font-bold text-[#ea580c]">Interactive Playground</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Grok API Key Status / Button */}
            <button
              onClick={() => {
                setTempApiKey(grokApiKey);
                setIsKeyModalOpen(true);
              }}
              className={`px-3 py-1.5 border text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                grokApiKey
                  ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                  : "bg-orange-50 border-orange-200 text-[#ea580c] hover:bg-orange-100"
              }`}
            >
              <HiOutlineKey />
              <span>{grokApiKey ? "Grok Key Connected" : "🔑 Set Grok API Key"}</span>
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
          {/* ==================== CHAT WORKSPACE (9 cols or full) ==================== */}
          <div className={`${showSettings ? "lg:col-span-8" : "lg:col-span-12"} space-y-4`}>
            {/* Active Model Selector Header Bar */}
            <div className="bg-white border border-[#e4e4e7] p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-zinc-950 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0">
                  {activeModel.displayName.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold font-sans text-zinc-950">
                      {activeModel.displayName}
                    </h2>
                    {activeModel.isTested ? (
                      <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold bg-orange-50 text-[#ea580c] border border-orange-200">
                        TESTED
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.5 text-[9px] font-mono text-zinc-600 bg-zinc-100 border border-zinc-200">
                        LIVEBENCH
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-500 font-mono">
                    {activeModel.creator} • {activeModel.category} • {activeModel.passRate}% Pass Rate
                  </p>
                </div>
              </div>

              {/* Model Switcher Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-zinc-400">Switch:</span>
                <select
                  value={activeModel.id}
                  onChange={(e) => {
                    const newId = e.target.value;
                    setSelectedModelId(newId);
                    navigate(`/playground/${newId}`, { replace: true });
                  }}
                  className="bg-[#fafafa] border border-[#e4e4e7] px-3 py-1.5 text-xs font-mono text-zinc-900 outline-none cursor-pointer focus:border-[#ea580c] max-w-[220px]"
                >
                  {combinedCatalog.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.displayName} ({m.passRate}%)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Suggested Prompt Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 font-mono text-[11px]">
              <span className="text-zinc-400 uppercase text-[10px] shrink-0">Quick Tests:</span>
              {SUGGESTED_PROMPTS.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => sendMessage(item.prompt)}
                  disabled={loading}
                  className="px-2.5 py-1 bg-white border border-[#e4e4e7] hover:border-[#ea580c] hover:text-[#ea580c] text-zinc-700 whitespace-nowrap transition-colors cursor-pointer disabled:opacity-50"
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Chat Messages Container */}
            <div className="bg-white border border-[#e4e4e7] shadow-xs min-h-[460px] max-h-[580px] overflow-y-auto p-5 space-y-4">
              {messages.map((msg, idx) => {
                const isUser = msg.role === "user";
                return (
                  <div
                    key={idx}
                    className={`flex ${isUser ? "justify-end" : "justify-start"} animate-fadeIn`}
                  >
                    <div
                      className={`max-w-[85%] p-4 space-y-2 text-xs leading-relaxed ${
                        isUser
                          ? "bg-zinc-950 text-white font-mono"
                          : "bg-[#fafafa] border border-[#e4e4e7] text-zinc-900 font-sans"
                      }`}
                    >
                      {/* Assistant Header & Copy */}
                      {!isUser && (
                        <div className="flex items-center justify-between gap-4 border-b border-[#edf0f5] pb-1.5 font-mono text-[10px] text-zinc-400">
                          <span className="font-bold text-zinc-700 flex items-center gap-1">
                            <HiOutlineSparkles className="text-[#ea580c]" />
                            {activeModel.displayName}
                          </span>
                          <button
                            onClick={() => copyMessage(msg.content, idx)}
                            className="hover:text-black flex items-center gap-1 cursor-pointer"
                            title="Copy message"
                          >
                            {copiedIndex === idx ? (
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

                      {/* Content Body */}
                      <div className="whitespace-pre-wrap font-sans text-xs">
                        {msg.content}
                      </div>

                      {/* Assistant Metadata Footer */}
                      {!isUser && msg.meta && (
                        <div className="pt-2 border-t border-[#edf0f5] text-[10px] font-mono text-zinc-400 flex items-center gap-2">
                          <span>⚡ {msg.meta}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {loading && (
                <div className="flex justify-start">
                  <div className="p-4 bg-orange-50 border border-orange-200 font-mono text-xs text-[#ea580c] flex items-center gap-2 animate-pulse">
                    <HiOutlineArrowPath className="animate-spin text-sm" />
                    <span>Executing inference with {activeModel.displayName} (via Grok Engine)...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
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
                placeholder={`Type a prompt for ${activeModel.displayName}... (Press Enter to send)`}
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
                  disabled={loading || !prompt.trim()}
                  className="px-5 py-2 bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs disabled:opacity-40 cursor-pointer"
                >
                  <span>Send</span>
                  <HiOutlinePaperAirplane className="text-xs" />
                </button>
              </div>
            </form>
          </div>

          {/* ==================== PARAMETERS SIDEBAR RAIL (3 cols) ==================== */}
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
                  Model Telemetry
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
                  <span>Speed (TPS):</span>
                  <b className="text-zinc-900">{activeModel.tokensPerSecond} TPS</b>
                </div>
                <div className="flex justify-between text-zinc-600">
                  <span>Pricing:</span>
                  <b className="text-[#ea580c]">{activeModel.pricingFormatted}</b>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ==================== GROK API KEY MODAL ==================== */}
      {isKeyModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border-2 border-[#ea580c] max-w-md w-full p-6 space-y-5 shadow-2xl font-mono text-xs animate-fadeIn">
            <div className="flex items-center justify-between border-b border-[#f4f4f5] pb-3">
              <div className="flex items-center gap-2">
                <HiOutlineKey className="text-[#ea580c] text-base" />
                <h3 className="font-bold text-sm font-sans text-zinc-950">
                  Configure Grok (xAI) API Key
                </h3>
              </div>
              <button
                onClick={() => setIsKeyModalOpen(false)}
                className="text-zinc-400 hover:text-black cursor-pointer"
              >
                <HiOutlineXMark className="text-lg" />
              </button>
            </div>

            <p className="text-zinc-600 font-sans text-xs leading-relaxed">
              Enter your <b>xAI / Grok API Key</b> to enable live real-time chat with all frontier models and creator models in the playground.
            </p>

            <div className="space-y-2">
              <label className="font-bold text-zinc-800 text-[11px] block uppercase">
                xAI / Grok API Key:
              </label>
              <input
                type="password"
                value={tempApiKey}
                onChange={(e) => setTempApiKey(e.target.value)}
                placeholder="xai-xxxxxxxxxxxxxxxxxxxxxxxx"
                className="w-full bg-[#fafafa] border border-[#e4e4e7] p-3 text-xs text-zinc-950 font-mono outline-none focus:border-[#ea580c]"
              />
              <span className="text-[10px] text-zinc-400 block font-sans">
                Keys are stored securely in your browser session. You can also define <code>GROK_API_KEY</code> in <code>server/.env</code>.
              </span>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
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
                Save & Connect Key
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
