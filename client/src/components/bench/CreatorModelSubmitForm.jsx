import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

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
  { id: "openai", name: "OpenAI (gpt-4o-mini)", defaultModel: "gpt-4o-mini" },
  { id: "google", name: "Google Gemini (gemini-2.5-flash)", defaultModel: "gemini-2.5-flash" },
  { id: "anthropic", name: "Anthropic Claude (claude-3-5-haiku)", defaultModel: "claude-3-5-haiku-20241022" },
  { id: "huggingface", name: "Hugging Face (Mistral-7B)", defaultModel: "mistralai/Mistral-7B-Instruct-v0.3" },
  { id: "custom", name: "Custom REST / vLLM Endpoint", defaultModel: "custom-model" },
];

const CATEGORIES = [
  "Code",
  "Reasoning",
  "Data Extraction & JSON",
  "Medical & Clinical",
  "Finance & SEC",
  "General",
];

export const CreatorModelSubmitForm = () => {
  const navigate = useNavigate();
  const [submissionMode, setSubmissionMode] = useState("ollama"); // 'ollama' | 'file' | 'api_key'
  const [modelName, setModelName] = useState("qwen2.5:3b");
  const [creatorHandle, setCreatorHandle] = useState("@AIArchitect");
  const [category, setCategory] = useState("Code");
  const [pricing, setPricing] = useState("0.00015");
  const [uploadedFile, setUploadedFile] = useState(null);

  // API Key fields
  const [apiProvider, setApiProvider] = useState("openai");
  const [apiKey, setApiKey] = useState("");
  const [customEndpoint, setCustomEndpoint] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelectOllamaPreset = (m) => {
    setModelName(m.tag);
    setCategory(m.category);
  };

  const handleSelectApiProvider = (pId) => {
    setApiProvider(pId);
    const prov = API_PROVIDERS.find((p) => p.id === pId);
    if (prov) setModelName(prov.defaultModel);
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
      toast.error("Please specify a model name or tag.");
      return;
    }

    if (submissionMode === "file" && !uploadedFile) {
      toast.error("Please select or drop a Modelfile / .gguf weight file.");
      return;
    }

    if (submissionMode === "api_key" && !apiKey.trim()) {
      toast.error("Please enter a valid API key for model access.");
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading("Enqueuing model for automated evaluation...");

    try {
      let res;
      if (submissionMode === "file" && uploadedFile) {
        const formData = new FormData();
        formData.append("modelName", modelName.trim());
        formData.append("creator", creatorHandle.trim());
        formData.append("category", category);
        formData.append("pricing", pricing);
        formData.append("file", uploadedFile);
        formData.append("provider", "modelfile_upload");

        res = await fetch("http://localhost:5000/api/models/register", {
          method: "POST",
          body: formData,
        });
      } else {
        const payload = {
          modelName: modelName.trim(),
          creator: creatorHandle.trim(),
          category,
          pricing: parseFloat(pricing) || 0.00015,
          provider: submissionMode === "api_key" ? "custom_api" : "ollama_local",
        };

        if (submissionMode === "api_key") {
          payload.apiKey = apiKey.trim();
          payload.apiProvider = apiProvider;
          payload.endpoint = customEndpoint.trim() || undefined;
        }

        res = await fetch("http://localhost:5000/api/models/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to register model for benchmark");
      }

      toast.success("Benchmark job queued!", { id: toastId });
      navigate(`/creator/benchmark/${data.jobId}`);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Could not connect to server.", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

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
              Ollama Local • Modelfile / GGUF • Remote API Key
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-1 bg-[#fafafa] border border-[#e4e4e7] rounded-none font-mono text-xs">
            {/* Mode A: Ollama Tag */}
            <button
              type="button"
              onClick={() => {
                setSubmissionMode("ollama");
                if (!modelName || modelName.includes("gpt") || modelName.includes("gemini")) {
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

            {/* Mode B: Modelfile / GGUF */}
            <button
              type="button"
              onClick={() => setSubmissionMode("file")}
              className={`py-3 px-3 rounded-none transition-all flex items-center justify-center gap-2 cursor-pointer border ${
                submissionMode === "file"
                  ? "bg-white text-zinc-950 font-bold border-[#e4e4e7] shadow-xs"
                  : "bg-transparent text-zinc-600 hover:text-zinc-950 border-transparent hover:bg-zinc-100"
              }`}
            >
              <HiOutlineDocumentArrowUp className={`text-sm ${submissionMode === "file" ? "text-[#ea580c]" : "text-zinc-500"}`} />
              <span>Upload Modelfile / .gguf</span>
            </button>

            {/* Mode C: API Key */}
            <button
              type="button"
              onClick={() => {
                setSubmissionMode("api_key");
                if (!modelName || modelName.includes(":")) {
                  setModelName("gpt-4o-mini");
                }
              }}
              className={`py-3 px-3 rounded-none transition-all flex items-center justify-center gap-2 cursor-pointer border ${
                submissionMode === "api_key"
                  ? "bg-white text-zinc-950 font-bold border-[#e4e4e7] shadow-xs"
                  : "bg-transparent text-zinc-600 hover:text-zinc-950 border-transparent hover:bg-zinc-100"
              }`}
            >
              <HiOutlineKey className={`text-sm ${submissionMode === "api_key" ? "text-[#ea580c]" : "text-zinc-500"}`} />
              <span>API Key</span>
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

        {/* B. UPLOAD MODELFILE / GGUF */}
        {submissionMode === "file" && (
          <div className="space-y-3 pt-1">
            <label className="text-xs font-mono font-semibold text-zinc-800">
              Modelfile / Quantized GGUF Weights File:
            </label>

            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleFileDrop}
              onClick={() => document.getElementById("modelfile-upload-input").click()}
              className="border-2 border-dashed border-zinc-300 hover:border-[#ea580c] p-8 rounded-none text-center bg-[#fafafa] hover:bg-orange-50/20 transition-all cursor-pointer space-y-2"
            >
              <input
                id="modelfile-upload-input"
                type="file"
                onChange={handleFileSelect}
                className="hidden"
              />
              <div className="w-10 h-10 rounded-none bg-zinc-100 border border-zinc-200 text-[#ea580c] mx-auto flex items-center justify-center text-xl">
                <HiOutlineDocumentArrowUp />
              </div>
              <div>
                <p className="text-xs font-mono text-zinc-800">
                  {uploadedFile ? (
                    <span className="text-[#ea580c] font-bold">
                      {uploadedFile.name} ({(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB)
                    </span>
                  ) : (
                    "Drag & drop your Modelfile or .gguf here, or click to browse"
                  )}
                </p>
                <p className="text-[10px] font-mono text-zinc-400 mt-1">
                  Accepts Modelfile, .gguf, .bin, or quantized weights (up to 5GB)
                </p>
              </div>
            </div>
          </div>
        )}

        {/* C. API KEY */}
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Model Tag/Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-semibold text-zinc-800">
                  Model Endpoint Identifier:
                </label>
                <input
                  type="text"
                  value={modelName}
                  onChange={(e) => setModelName(e.target.value)}
                  placeholder="e.g. gpt-4o-mini, gemini-1.5-flash"
                  className="w-full bg-[#fafafa] border border-[#e4e4e7] focus:border-[#ea580c] text-zinc-900 text-xs font-mono rounded-none px-3 py-2 outline-none"
                  required
                />
              </div>

              {/* API Key Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-semibold text-zinc-800 flex items-center justify-between">
                  <span>API Secret Key:</span>
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="text-[10px] text-zinc-500 hover:text-[#ea580c] flex items-center gap-1 cursor-pointer"
                  >
                    {showApiKey ? <HiOutlineEyeSlash /> : <HiOutlineEye />}
                    <span>{showApiKey ? "Hide" : "Show"}</span>
                  </button>
                </label>
                <input
                  type={showApiKey ? "text" : "password"}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-... or AIzaSy..."
                  className="w-full bg-[#fafafa] border border-[#e4e4e7] focus:border-[#ea580c] text-zinc-900 text-xs font-mono rounded-none px-3 py-2 outline-none"
                  required
                />
              </div>
            </div>

            {/* Custom Endpoint URL (optional) */}
            {apiProvider === "custom" && (
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-semibold text-zinc-800 flex items-center gap-1">
                  <HiOutlineGlobeAlt className="text-zinc-500" />
                  <span>Custom Base URL (Optional):</span>
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-[#e4e4e7]">
          {/* Author Handle */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-semibold text-zinc-800 flex items-center gap-1">
              <HiOutlineUserCircle className="text-[#ea580c]" />
              <span>Author Handle:</span>
            </label>
            <input
              type="text"
              value={creatorHandle}
              onChange={(e) => setCreatorHandle(e.target.value)}
              placeholder="@AIArchitect"
              className="w-full bg-[#fafafa] border border-[#e4e4e7] focus:border-[#ea580c] text-zinc-900 text-xs font-mono rounded-none px-3 py-2 outline-none"
            />
          </div>

          {/* Domain Category */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-semibold text-zinc-800 flex items-center gap-1">
              <HiOutlineTag className="text-[#ea580c]" />
              <span>Domain Category:</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-[#fafafa] border border-[#e4e4e7] focus:border-[#ea580c] text-zinc-900 text-xs font-mono rounded-none px-3 py-2 outline-none cursor-pointer"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Rate ($/1k) */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-semibold text-zinc-800 flex items-center gap-1">
              <HiOutlineCurrencyDollar className="text-[#ea580c]" />
              <span>Rate ($/1k tokens):</span>
            </label>
            <input
              type="number"
              step="0.00001"
              value={pricing}
              onChange={(e) => setPricing(e.target.value)}
              placeholder="0.00015"
              className="w-full bg-[#fafafa] border border-[#e4e4e7] focus:border-[#ea580c] text-zinc-900 text-xs font-mono rounded-none px-3 py-2 outline-none"
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
