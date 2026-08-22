import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../../api/axios";

import {
  HiOutlineCpuChip,
  HiOutlineDocumentArrowUp,
  HiOutlineKey,
  HiOutlineSparkles,
  HiOutlineArrowRight,
  HiOutlineBolt,
  HiOutlineCurrencyDollar,
  HiOutlineTag,
  HiOutlineUserCircle,
  HiOutlineGlobeAlt,
  HiOutlineEye,
  HiOutlineEyeSlash,
} from "react-icons/hi2";

const POPULAR_OLLAMA_MODELS = [
  { tag: "qwen2.5:3b", name: "Qwen 2.5 (3B Coder)", category: "Code" },
  { tag: "llama3.1:8b", name: "Llama 3.1 (8B Instruct)", category: "Reasoning" },
  { tag: "mistral:7b-instruct", name: "Mistral 7B Instruct v0.3", category: "General" },
  { tag: "deepseek-coder:6.7b", name: "DeepSeek Coder 6.7B", category: "Code" },
  { tag: "phi3.5:mini", name: "Phi-3.5 Mini (3.8B)", category: "Reasoning" },
];

const API_PROVIDERS = [
  {
    id: "opencode-zen-compatible",
    name: "OpenCode Zen / Compatible",
    defaultModel: "kimi-k3",
    defaultEndpoint: "https://opencode.ai/zen/v1",
    models: [
      "kimi-k3", "kimi-k2.7-code", "kimi-k2.6", "kimi-k2.5",
      "deepseek-v4-pro",
      "deepseek-v4-flash",
      "minimax-m3", "minimax-m2.7", "minimax-m2.5",
      "glm-5.2", "glm-5.1", "glm-5",
      "big-pickle", "x-preview-f-free", "mimo-v2.5-free", "hy3-free",
      "nemotron-3-ultra-free", "nemotron-3.5-lightning-free",
    ],
  },
  {
    id: "opencode-zen-openai",
    name: "OpenCode Zen / OpenAI Responses",
    defaultModel: "gpt-5.6-luna",
    defaultEndpoint: "https://opencode.ai/zen/v1",
    models: ["gpt-5.6-sol", "gpt-5.6-terra", "gpt-5.6-luna", "gpt-5.5", "gpt-5.5-pro", "gpt-5.4", "gpt-5.4-pro", "gpt-5.4-mini", "gpt-5.4-nano", "gpt-5.3-codex", "gpt-5.3-codex-spark", "gpt-5.2", "gpt-5.2-codex", "gpt-5.1", "gpt-5.1-codex", "gpt-5.1-codex-max", "gpt-5.1-codex-mini", "gpt-5", "gpt-5-codex", "gpt-5-nano", "grok-4.6", "grok-4.5", "grok-build-0.1", "muse-spark-1.2"],
  },
  {
    id: "opencode-zen-anthropic",
    name: "OpenCode Zen / Anthropic Messages",
    defaultModel: "claude-haiku-4-5",
    defaultEndpoint: "https://opencode.ai/zen/v1",
    models: ["claude-fable-5", "claude-opus-5", "claude-opus-4-8", "claude-opus-4-7", "claude-opus-4-6", "claude-opus-4-5", "claude-sonnet-5", "claude-sonnet-4-6", "claude-sonnet-4-5", "claude-haiku-4-5", "qwen3.7-max", "qwen3.7-plus", "qwen3.6-plus", "qwen3.5-plus"],
  },
  {
    id: "opencode-zen-google",
    name: "OpenCode Zen / Google Generate Content",
    defaultModel: "gemini-3-flash",
    defaultEndpoint: "https://opencode.ai/zen/v1",
    models: ["gemini-3.7-flash", "gemini-3.6-flash", "gemini-3.5-flash", "gemini-3.5-flash-lite", "gemini-3.1-pro", "gemini-3-flash"],
  },
  {
    id: "opencode-go-compatible",
    name: "OpenCode Go / Compatible",
    defaultModel: "kimi-k3",
    defaultEndpoint: "https://opencode.ai/zen/go/v1",
    models: ["kimi-k3", "kimi-k2.7-code", "kimi-k2.6", "glm-5.3", "glm-5.2", "glm-5.1", "deepseek-v4-pro", "deepseek-v4-flash", "deepseek-v4-flash-vision-exp", "mimo-v2.5", "mimo-v2.5-pro", "hy3", "ox-alpha-free"],
  },
  {
    id: "opencode-go-anthropic",
    name: "OpenCode Go / Anthropic Messages",
    defaultModel: "minimax-m3",
    defaultEndpoint: "https://opencode.ai/zen/go/v1",
    models: ["minimax-m3", "minimax-m2.7", "minimax-m2.5", "qwen3.8-max", "qwen3.7-max", "qwen3.7-plus", "qwen3.6-plus"],
  },
  {
    id: "opencode-go-openai",
    name: "OpenCode Go / OpenAI Responses",
    defaultModel: "gpt-5.6-luna",
    defaultEndpoint: "https://opencode.ai/zen/go/v1",
    models: ["gpt-5.6-luna", "grok-4.5", "muse-spark-1.2-contributor"],
  },
  {
    id: "moonshot",
    name: "Moonshot AI / Kimi",
    defaultModel: "kimi-k3",
    defaultEndpoint: "https://api.moonshot.ai/v1",
    models: ["kimi-k3", "kimi-k3-256k", "kimi-k2.7"],
  },
  {
    id: "opencode-go",
    name: "OpenCode Go / Kimi",
    defaultModel: "kimi-k3",
    defaultEndpoint: "https://opencode.ai/zen/go/v1",
    models: ["kimi-k3", "kimi-k2.7-code", "kimi-k2.6"],
  },
  {
    id: "google",
    name: "Google Gemini",
    defaultModel: "gemini-2.5-flash",
    models: [
      "gemini-2.5-flash",
      "gemini-2.0-flash",
      "gemini-1.5-flash",
      "gemini-1.5-pro",
    ],
  },
  {
    id: "xai",
    name: "xAI / Grok",
    defaultModel: "grok-4.6",
    defaultEndpoint: "https://api.x.ai/v1",
    models: ["grok-4.6", "grok-4.5", "grok-4.3", "grok-build-0.1"],
  },
  {
    id: "openai",
    name: "OpenAI",
    defaultModel: "gpt-4o-mini",
    models: ["gpt-4o-mini", "gpt-4o", "o3-mini", "gpt-3.5-turbo"],
  },
  {
    id: "anthropic",
    name: "Anthropic Claude",
    defaultModel: "claude-3-5-haiku-20241022",
    models: ["claude-3-5-haiku-20241022", "claude-3-5-sonnet-20241022", "claude-3-haiku-20240307"],
  },
  {
    id: "groq",
    name: "Groq Cloud LPU",
    defaultModel: "openai/gpt-oss-120b",
    models: [
      "llama-3.1-8b-instant",
      "llama-3.3-70b-versatile",
      "openai/gpt-oss-120b",
      "openai/gpt-oss-20b",
      "qwen/qwen3.6-27b",
      "groq/compound",
    ],
  },
  {
    id: "huggingface",
    name: "Hugging Face Serverless",
    defaultModel: "mistralai/Mistral-7B-Instruct-v0.3",
    models: ["mistralai/Mistral-7B-Instruct-v0.3", "meta-llama/Llama-3.1-8B-Instruct"],
  },
  {
    id: "custom",
    name: "⚡ Choose Your Own Provider (Custom REST / vLLM / OpenCode)",
    defaultModel: "deepseek-v4-pro",
    models: ["deepseek-v4-pro", "custom-model"],
  },
];

const CATEGORIES = [
  "Code",
  "Reasoning",
  "Data Extraction & JSON",
  "Medical & Clinical",
  "Finance & SEC",
  "General",
];

const POPULAR_HUGGINGFACE_MODELS = [
  { repo: "meta-llama/Llama-3.2-3B-Instruct", name: "Llama 3.2 (3B Instruct)", category: "Reasoning" },
  { repo: "deepseek-ai/DeepSeek-R1-Distill-Qwen-8B", name: "DeepSeek R1 Distill (8B)", category: "Reasoning" },
  { repo: "Qwen/Qwen2.5-Coder-7B-Instruct", name: "Qwen 2.5 Coder (7B)", category: "Code" },
  { repo: "mistralai/Mistral-7B-Instruct-v0.3", name: "Mistral 7B Instruct v0.3", category: "General" },
  { repo: "google/gemma-2-2b-it", name: "Gemma 2 (2B IT)", category: "General" },
  { repo: "microsoft/Phi-3.5-mini-instruct", name: "Phi-3.5 Mini Instruct", category: "Reasoning" },
];

export const CreatorModelSubmitForm = () => {
  const navigate = useNavigate();
  const [submissionMode, setSubmissionMode] = useState("ollama"); // 'ollama' | 'file' | 'huggingface' | 'api_key'
  const [modelName, setModelName] = useState("qwen2.5:3b");
  const [isCustomModel, setIsCustomModel] = useState(false);
  const [creatorHandle, setCreatorHandle] = useState("@my_creator_org");
  const [category, setCategory] = useState("Code");
  const [pricing, setPricing] = useState("0.00015");
  const [uploadedFile, setUploadedFile] = useState(null);

  // API Key & Hugging Face fields
  const [apiProvider, setApiProvider] = useState("google");
  const [apiKey, setApiKey] = useState("");
  const [customEndpoint, setCustomEndpoint] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelectOllamaPreset = (m) => {
    setModelName(m.tag);
    setIsCustomModel(false);
    setCategory(m.category);
  };

  const handleSelectHuggingFacePreset = (m) => {
    setModelName(m.repo);
    setIsCustomModel(false);
    setCategory(m.category);
  };

  const handleSelectApiProvider = (pId) => {
    setApiProvider(pId);
    const prov = API_PROVIDERS.find((p) => p.id === pId);
    if (prov) {
      setIsCustomModel(false);
      setModelName(prov.defaultModel);
    }
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setUploadedFile(file);
      if (!modelName || modelName.includes(":")) {
        setModelName(file.name.replace(/\.[^/.]+$/, "").toLowerCase());
      }
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFile(file);
      if (!modelName || modelName.includes(":")) {
        setModelName(file.name.replace(/\.[^/.]+$/, "").toLowerCase());
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!modelName.trim()) {
      toast.error("Please specify a model name or repository tag.");
      return;
    }

    if (submissionMode === "file" && !uploadedFile) {
      toast.error("Please select or drop a Modelfile / .gguf weight file.");
      return;
    }

    if (submissionMode === "api_key" && !apiKey.trim() && !apiProvider.startsWith("opencode")) {
      toast.error("Please enter a valid API key for model access.");
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading("Enqueuing model for automated evaluation...");

    try {
      let data;
      if (submissionMode === "file" && uploadedFile) {
        const formData = new FormData();
        formData.append("modelName", modelName.trim());
        formData.append("creator", creatorHandle.trim());
        formData.append("category", category);
        formData.append("pricing", pricing);
        formData.append("file", uploadedFile);
        formData.append("provider", "modelfile_upload");

        const response = await API.post("/models/register", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        data = response.data;
      } else {
        const payload = {
          modelName: modelName.trim(),
          creator: creatorHandle.trim(),
          category,
          pricing: parseFloat(pricing) || 0.00015,
          provider: (submissionMode === "api_key" || submissionMode === "huggingface") ? "custom_api" : "ollama_local",
        };

        if (submissionMode === "huggingface") {
          payload.apiProvider = "huggingface";
          if (apiKey.trim()) payload.apiKey = apiKey.trim();
          if (customEndpoint.trim()) payload.endpoint = customEndpoint.trim();
        } else if (submissionMode === "api_key") {
          if (apiKey.trim()) payload.apiKey = apiKey.trim();
          payload.apiProvider = apiProvider;
          payload.endpoint = customEndpoint.trim() || undefined;
        }

        const response = await API.post("/models/register", payload);
        data = response.data;
      }

      if (!data?.success) {
        throw new Error(data?.message || "Failed to register model for benchmark");
      }

      toast.success("Benchmark job queued!", { id: toastId });
      navigate(`/creator/benchmark/${data.jobId}`);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || err.message || "Could not connect to server.", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedProviderObj = API_PROVIDERS.find((p) => p.id === apiProvider) || API_PROVIDERS[0];

  return (
    <div className="bg-white border border-[#e4e4e7] rounded-none shadow-xs font-sans">
      <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
        {/* ==================== 1. SELECT SUBMISSION MODE ==================== */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-mono font-bold text-zinc-900 uppercase tracking-wider block">
              1. Select Submission Mode
            </label>
            <span className="text-[11px] font-mono text-zinc-400">
              Ollama Local • Hugging Face • Remote API Key
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-1 bg-[#fafafa] border border-[#e4e4e7] rounded-none font-mono text-xs">
            {/* Mode A: Ollama Tag */}
            <button
              type="button"
              onClick={() => {
                setSubmissionMode("ollama");
                if (!modelName || modelName.includes("/") || modelName.includes("gpt") || modelName.includes("gemini")) {
                  setModelName("qwen2.5:3b");
                }
              }}
              className={`py-3 px-3 rounded-none transition-all flex items-center justify-center gap-2 cursor-pointer border ${
                submissionMode === "ollama"
                  ? "bg-white text-zinc-950 font-bold border-[#e4e4e7] shadow-xs"
                  : "bg-transparent text-zinc-600 hover:text-zinc-950 border-transparent hover:bg-zinc-100"
              }`}
            >
              <HiOutlineCpuChip className={`text-sm ${submissionMode === "ollama" ? "text-[#ea580c]" : "text-zinc-500"}`} />
              <span>Ollama Model Tag</span>
            </button>

            {/* Mode C: Hugging Face */}
            <button
              type="button"
              onClick={() => {
                setSubmissionMode("huggingface");
                if (!modelName || !modelName.includes("/")) {
                  setModelName("meta-llama/Llama-3.2-3B-Instruct");
                }
              }}
              className={`py-3 px-3 rounded-none transition-all flex items-center justify-center gap-2 cursor-pointer border ${
                submissionMode === "huggingface"
                  ? "bg-white text-zinc-950 font-bold border-[#e4e4e7] shadow-xs"
                  : "bg-transparent text-zinc-600 hover:text-zinc-950 border-transparent hover:bg-zinc-100"
              }`}
            >
              <HiOutlineSparkles className={`text-sm ${submissionMode === "huggingface" ? "text-[#ea580c]" : "text-zinc-500"}`} />
              <span>🤗 Hugging Face</span>
            </button>

            {/* Mode D: API Key */}
            <button
              type="button"
              onClick={() => {
                setSubmissionMode("api_key");
                if (!modelName || modelName.includes(":")) {
                  setModelName("gemini-2.5-flash");
                }
              }}
              className={`py-3 px-3 rounded-none transition-all flex items-center justify-center gap-2 cursor-pointer border ${
                submissionMode === "api_key"
                  ? "bg-white text-zinc-950 font-bold border-[#e4e4e7] shadow-xs"
                  : "bg-transparent text-zinc-600 hover:text-zinc-950 border-transparent hover:bg-zinc-100"
              }`}
            >
              <HiOutlineKey className={`text-sm ${submissionMode === "api_key" ? "text-[#ea580c]" : "text-zinc-500"}`} />
              <span>Remote API Key</span>
            </button>
          </div>
        </div>

        {/* ==================== SUBMISSION MODE CONTENT ==================== */}
        
        {/* A. OLLAMA MODEL TAG */}
        {submissionMode === "ollama" && (
          <div className="space-y-4 pt-1">
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-semibold text-zinc-800">
                Ollama Model Tag / Identifier:
              </label>
              <input
                type="text"
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
                placeholder="e.g. qwen2.5:3b, llama3.1:8b, mistral:7b-instruct"
                className="w-full bg-[#fafafa] border border-[#e4e4e7] focus:border-[#ea580c] text-zinc-900 text-xs font-mono rounded-none px-3.5 py-2.5 outline-none transition-all"
                required
              />
            </div>

            {/* Quick Presets */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-mono text-zinc-500 block">
                Quick Select Installed Ollama Tags:
              </span>
              <div className="flex flex-wrap gap-2">
                {POPULAR_OLLAMA_MODELS.map((m) => (
                  <button
                    key={m.tag}
                    type="button"
                    onClick={() => handleSelectOllamaPreset(m)}
                    className={`px-3 py-1 text-[11px] font-mono rounded-none transition-all cursor-pointer border ${
                      modelName === m.tag
                        ? "bg-orange-50 text-[#ea580c] border-[#ea580c] font-bold"
                        : "bg-[#fafafa] text-zinc-600 border-[#e4e4e7] hover:border-zinc-400 hover:text-black"
                    }`}
                  >
                    {m.tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}


        {/* C. HUGGING FACE INFERENCE */}
        {submissionMode === "huggingface" && (
          <div className="space-y-4 pt-1">
            {/* Model Repo Identifier */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-semibold text-zinc-800">
                Hugging Face Model Repo / Tag:
              </label>
              <input
                type="text"
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
                placeholder="e.g. meta-llama/Llama-3.2-3B-Instruct, deepseek-ai/DeepSeek-R1-Distill-Qwen-8B, Qwen/Qwen2.5-Coder-7B-Instruct"
                className="w-full bg-[#fafafa] border border-[#e4e4e7] focus:border-[#ea580c] text-zinc-900 text-xs font-mono rounded-none px-3.5 py-2.5 outline-none transition-all"
                required
              />
            </div>

            {/* Quick Presets */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-mono text-zinc-500 block">
                Quick Select Popular Hugging Face Models:
              </span>
              <div className="flex flex-wrap gap-2">
                {POPULAR_HUGGINGFACE_MODELS.map((m) => (
                  <button
                    key={m.repo}
                    type="button"
                    onClick={() => handleSelectHuggingFacePreset(m)}
                    className={`px-3 py-1 text-[11px] font-mono rounded-none transition-all cursor-pointer border ${
                      modelName === m.repo
                        ? "bg-orange-50 text-[#ea580c] border-[#ea580c] font-bold"
                        : "bg-[#fafafa] text-zinc-600 border-[#e4e4e7] hover:border-zinc-400 hover:text-black"
                    }`}
                  >
                    {m.name}
                  </button>
                ))}
              </div>
            </div>

            {/* HF Access Token */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-1 items-start">
              <div className="space-y-1.5 flex flex-col">
                <div className="flex items-center justify-between min-h-[20px]">
                  <label className="text-xs font-mono font-semibold text-zinc-800 leading-none">
                    Hugging Face Access Token (hf_...):
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="text-[10px] font-mono text-zinc-500 hover:text-zinc-900 flex items-center gap-1 cursor-pointer shrink-0 leading-none"
                  >
                    {showApiKey ? <HiOutlineEyeSlash className="text-xs" /> : <HiOutlineEye className="text-xs" />}
                    <span>{showApiKey ? "Hide" : "Show"}</span>
                  </button>
                </div>
                <input
                  type={showApiKey ? "text" : "password"}
                  name="hf_token_no_autofill"
                  autoComplete="new-password"
                  data-lpignore="true"
                  data-1p-ignore="true"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="hf_xxxxxxxxxxxxxxxxxxxxxxx"
                  className="w-full h-[40px] bg-[#fafafa] border border-[#e4e4e7] focus:border-[#ea580c] text-zinc-900 text-xs font-mono rounded-none px-3.5 outline-none"
                />
                <p className="text-[10px] font-mono text-zinc-400 leading-relaxed min-h-[16px]">
                  Required for gated/private models. Encrypted with AES-256-GCM.
                </p>
              </div>

              {/* Optional Custom Dedicated Endpoint */}
              <div className="space-y-1.5 flex flex-col">
                <div className="flex items-center min-h-[20px]">
                  <label className="text-xs font-mono font-semibold text-zinc-800 leading-none">
                    Custom Dedicated Endpoint URL (Optional):
                  </label>
                  <span className="ml-auto text-[10px] font-mono invisible flex items-center gap-1 leading-none select-none" aria-hidden="true">
                    <HiOutlineEye className="text-xs" />
                    <span>Show</span>
                  </span>
                </div>
                <input
                  type="text"
                  value={customEndpoint}
                  onChange={(e) => setCustomEndpoint(e.target.value)}
                  placeholder="https://xxxx.us-east-1.aws.endpoints.huggingface.cloud"
                  className="w-full h-[40px] bg-[#fafafa] border border-[#e4e4e7] focus:border-[#ea580c] text-zinc-900 text-xs font-mono rounded-none px-3.5 outline-none"
                />
                <p className="text-[10px] font-mono text-zinc-400 leading-relaxed min-h-[16px]">
                  Leave empty to use Hugging Face Serverless Inference Router.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* D. REMOTE API KEY */}
        {submissionMode === "api_key" && (
          <div className="space-y-4 pt-1">
            {/* Provider Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-semibold text-zinc-800">
                Model API Provider:
              </label>
              <select
                value={apiProvider}
                onChange={(e) => handleSelectApiProvider(e.target.value)}
                className="w-full bg-[#fafafa] border border-[#e4e4e7] focus:border-[#ea580c] text-zinc-900 text-xs font-mono rounded-none px-3 py-2.5 outline-none cursor-pointer"
              >
                {API_PROVIDERS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-start">
              {/* AI Model Name / Selection */}
              <div className="space-y-1.5 flex flex-col">
                <div className="flex items-center justify-between min-h-[20px]">
                  <label className="text-xs font-mono font-semibold text-zinc-800 leading-none">
                    AI Model:
                  </label>
                  {isCustomModel ? (
                    <button
                      type="button"
                      onClick={() => {
                        setIsCustomModel(false);
                        setModelName(selectedProviderObj.defaultModel);
                      }}
                      className="text-[10px] font-mono text-[#ea580c] hover:underline cursor-pointer leading-none shrink-0"
                    >
                      ← Back to Presets
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setIsCustomModel(true);
                        setModelName("");
                      }}
                      className="text-[10px] font-mono text-zinc-500 hover:text-black cursor-pointer leading-none shrink-0"
                    >
                      + Custom Name
                    </button>
                  )}
                </div>

                {isCustomModel ? (
                  <input
                    type="text"
                    value={modelName}
                    autoFocus
                    onChange={(e) => {
                      const val = e.target.value;
                      if (
                        val.startsWith("AIza") ||
                        val.startsWith("AQ.") ||
                        val.startsWith("gsk_") ||
                        val.startsWith("sk-") ||
                        val.startsWith("xai-") ||
                        val.length > 30
                      ) {
                        setApiKey(val);
                        setModelName("");
                        toast.success("Detected API Key! Moved to Secret Key field.");
                      } else {
                        setModelName(val);
                      }
                    }}
                    placeholder="Type custom model name (e.g. gemini-pro-latest, gpt-4o-2024-08-06)..."
                    className="w-full h-[40px] bg-[#fafafa] border border-[#ea580c] focus:ring-1 focus:ring-[#ea580c] text-zinc-900 text-xs font-mono rounded-none px-3.5 outline-none"
                    required
                  />
                ) : (
                  <select
                    value={selectedProviderObj.models.includes(modelName) ? modelName : "__custom__"}
                    onChange={(e) => {
                      if (e.target.value === "__custom__") {
                        setIsCustomModel(true);
                        setModelName("");
                      } else {
                        setModelName(e.target.value);
                      }
                    }}
                    className="w-full h-[40px] bg-[#fafafa] border border-[#e4e4e7] focus:border-[#ea580c] text-zinc-900 text-xs font-mono rounded-none px-3.5 outline-none cursor-pointer"
                  >
                    {selectedProviderObj.models.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                    <option value="__custom__">+ Enter Custom Model Name...</option>
                  </select>
                )}
                <p className="text-[10px] font-mono text-zinc-400 leading-relaxed min-h-[16px] invisible select-none" aria-hidden="true">
                  placeholder
                </p>
              </div>

              {/* API Key Input (Encrypted / Masked) */}
              <div className="space-y-1.5 flex flex-col">
                <div className="flex items-center justify-between min-h-[20px]">
                  <label className="text-xs font-mono font-semibold text-zinc-800 leading-none">
                    API Secret Key (Never displayed publicly):
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="text-[10px] font-mono text-zinc-500 hover:text-[#ea580c] flex items-center gap-1 cursor-pointer shrink-0 leading-none"
                  >
                    {showApiKey ? <HiOutlineEyeSlash className="text-xs" /> : <HiOutlineEye className="text-xs" />}
                    <span>{showApiKey ? "Hide" : "Show"}</span>
                  </button>
                </div>
                <input
                  type={showApiKey ? "text" : "password"}
                  name="api_secret_key_no_autofill"
                  autoComplete="new-password"
                  data-lpignore="true"
                  data-1p-ignore="true"
                  value={apiKey}
                  onChange={(e) => {
                    const trimmed = e.target.value.trim();
                    setApiKey(trimmed);

                    if (trimmed.startsWith("gsk_") && apiProvider !== "groq") {
                      setApiProvider("groq");
                      setModelName("openai/gpt-oss-120b");
                      toast.success("Detected Groq API Key! Automatically switched provider to Groq Cloud LPU.");
                    } else if (trimmed.startsWith("AIza") && apiProvider !== "google") {
                      setApiProvider("google");
                      setModelName("gemini-2.0-flash");
                      toast.success("Detected Google Gemini Key! Automatically switched provider to Google Gemini.");
                    } else if (trimmed.startsWith("sk-") && apiProvider === "google") {
                      setApiProvider("opencode");
                      setModelName("deepseek-v4-pro");
                      toast.success("Detected OpenCode / DeepSeek Key! Automatically switched provider to OpenCode / DeepSeek.");
                    }
                  }}
                  placeholder="Paste API key here (AIzaSy..., gsk_..., sk-...)"
                  className="w-full h-[40px] bg-[#fafafa] border border-[#e4e4e7] focus:border-[#ea580c] text-zinc-900 text-xs font-mono rounded-none px-3.5 outline-none"
                  required
                />
                <p className="text-[10px] text-zinc-500 font-mono leading-relaxed min-h-[16px]">
                  Encrypted securely and never exposed in telemetry or logs.
                </p>
              </div>
            </div>

            {/* Custom Endpoint URL (optional) */}
            {apiProvider === "custom" && (
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-semibold text-zinc-800 flex items-center gap-1">
                  <HiOutlineGlobeAlt className="text-zinc-500" />
                  <span>Custom Base URL / Endpoint:</span>
                </label>
                <input
                  type="text"
                  value={customEndpoint}
                  onChange={(e) => setCustomEndpoint(e.target.value)}
                  placeholder="https://api.your-vllm-host.com/v1"
                  className="w-full bg-[#fafafa] border border-[#e4e4e7] focus:border-[#ea580c] text-zinc-900 text-xs font-mono rounded-none px-3 py-2 outline-none"
                />
              </div>
            )}
          </div>
        )}

        {/* ==================== 2. CREATOR METADATA ROW ==================== */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-4 border-t border-[#e4e4e7] items-start">
          {/* Author Handle */}
          <div className="space-y-1.5 flex flex-col">
            <label className="text-xs font-mono font-semibold text-zinc-800 flex items-center gap-1.5 min-h-[20px] leading-none">
              <HiOutlineUserCircle className="text-[#ea580c] text-[14px] shrink-0" />
              <span>Author Handle:</span>
            </label>
            <input
              type="text"
              value={creatorHandle}
              onChange={(e) => setCreatorHandle(e.target.value)}
              placeholder="@AIArchitect"
              className="w-full h-[40px] bg-[#fafafa] border border-[#e4e4e7] focus:border-[#ea580c] text-zinc-900 text-xs font-mono rounded-none px-3.5 outline-none"
            />
          </div>

          {/* Domain Category */}
          <div className="space-y-1.5 flex flex-col">
            <label className="text-xs font-mono font-semibold text-zinc-800 flex items-center gap-1.5 min-h-[20px] leading-none">
              <HiOutlineTag className="text-[#ea580c] text-[14px] shrink-0" />
              <span>Domain Category:</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full h-[40px] bg-[#fafafa] border border-[#e4e4e7] focus:border-[#ea580c] text-zinc-900 text-xs font-mono rounded-none px-3.5 outline-none cursor-pointer"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Rate ($/1k) */}
          <div className="space-y-1.5 flex flex-col">
            <label className="text-xs font-mono font-semibold text-zinc-800 flex items-center gap-1.5 min-h-[20px] leading-none">
              <HiOutlineCurrencyDollar className="text-[#ea580c] text-[14px] shrink-0" />
              <span>Rate ($/1k tokens):</span>
            </label>
            <input
              type="number"
              step="0.00001"
              value={pricing}
              onChange={(e) => setPricing(e.target.value)}
              placeholder="0.00015"
              className="w-full h-[40px] bg-[#fafafa] border border-[#e4e4e7] focus:border-[#ea580c] text-zinc-900 text-xs font-mono rounded-none px-3.5 outline-none"
            />
          </div>
        </div>

        {/* ==================== 3. SUBMIT ACTION BUTTON ==================== */}
        <div className="pt-4 border-t border-[#e4e4e7] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-mono text-xs">
          <span className="text-[11px] text-zinc-500">
            35 test cases (Reasoning, Knowledge, Coding, Safety) will be evaluated concurrently.
          </span>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold text-xs font-mono rounded-none transition-all flex items-center gap-2 cursor-pointer shadow-xs active:scale-95 disabled:opacity-50 w-full sm:w-auto justify-center"
          >
            {isSubmitting ? (
              <span>Dispatching Evaluation...</span>
            ) : (
              <>
                <HiOutlineBolt className="text-sm" />
                <span>Start Automated Benchmark</span>
                <HiOutlineArrowRight />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatorModelSubmitForm;
