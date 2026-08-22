import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../api/axios";
import {
  HiOutlineCpuChip,
  HiOutlineDocumentArrowUp,
  HiOutlineSparkles,
  HiOutlineArrowRight,
  HiOutlineBolt,
  HiOutlineCurrencyDollar,
  HiOutlineTag,
  HiOutlineUserCircle,
} from "react-icons/hi2";

const POPULAR_OLLAMA_MODELS = [
  { tag: "qwen2.5:3b", name: "Qwen 2.5 (3B Coder)", category: "Code" },
  { tag: "llama3.1:8b", name: "Llama 3.1 (8B Instruct)", category: "Reasoning" },
  { tag: "mistral:7b-instruct", name: "Mistral 7B Instruct v0.3", category: "General" },
  { tag: "deepseek-coder:6.7b", name: "DeepSeek Coder 6.7B", category: "Code" },
  { tag: "phi3.5:mini", name: "Phi-3.5 Mini (3.8B)", category: "Reasoning" },
];

const CATEGORIES = [
  "Code",
  "Reasoning",
  "Data Extraction & JSON",
  "Medical & Clinical",
  "Finance & SEC",
  "General",
];

export const CreatorBenchPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("ollama"); // 'ollama' | 'file'
  const [modelName, setModelName] = useState("qwen2.5:3b");
  const [creatorHandle, setCreatorHandle] = useState("@AIArchitect");
  const [category, setCategory] = useState("Code");
  const [pricing, setPricing] = useState("0.00015");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelectPreset = (m) => {
    setModelName(m.tag);
    setCategory(m.category);
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
      toast.error("Please provide a valid model tag or name.");
      return;
    }

    if (activeTab === "file" && !uploadedFile) {
      toast.error("Please drag-and-drop a Modelfile or .gguf weight file.");
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading("Enqueuing model for automated evaluation...");

    try {
      let data;
      if (activeTab === "file" && uploadedFile) {
        const formData = new FormData();
        formData.append("modelName", modelName.trim());
        formData.append("creator", creatorHandle.trim());
        formData.append("category", category);
        formData.append("pricing", pricing);
        formData.append("file", uploadedFile);

        const response = await API.post("/models/register", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        data = response.data;
      } else {
        const response = await API.post("/models/register", {
          modelName: modelName.trim(),
          creator: creatorHandle.trim(),
          category,
          pricing: parseFloat(pricing) || 0.00015,
          provider: "ollama_local",
        });
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

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans selection:bg-emerald-500 selection:text-black py-12 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header Bar (Browserbase dark aesthetic) */}
        <div className="p-6 bg-[#18181b] border border-[#27272a] rounded-none shadow-xl space-y-2">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-400 font-bold">
            <HiOutlineSparkles />
            <span>Creator Test-Bench Engine • Automated Promptfoo Suite</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-sans">
            Register & Benchmark Local Model
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 font-sans">
            Submit your Ollama tag or Modelfile to trigger 35 standardized test assertions across Reasoning, Knowledge, Coding, and Safety.
          </p>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="bg-[#18181b] border border-[#27272a] p-6 sm:p-8 rounded-none shadow-2xl space-y-6 font-sans">
          {/* Submission Mode Tabs */}
          <div className="space-y-2">
            <label className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider block">
              1. Select Submission Mode
            </label>

            <div className="grid grid-cols-2 gap-2 p-1 bg-[#121215] border border-[#27272a] rounded-none font-mono text-xs">
              <button
                type="button"
                onClick={() => setActiveTab("ollama")}
                className={`py-2.5 px-3 rounded-none transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === "ollama"
                    ? "bg-[#27272a] text-emerald-400 font-bold shadow-xs border border-emerald-500/30"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <HiOutlineCpuChip className="text-sm" />
                <span>Ollama Model Tag</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("file")}
                className={`py-2.5 px-3 rounded-none transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === "file"
                    ? "bg-[#27272a] text-emerald-400 font-bold shadow-xs border border-emerald-500/30"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <HiOutlineDocumentArrowUp className="text-sm" />
                <span>Upload Modelfile / .gguf</span>
              </button>
            </div>
          </div>

          {/* Tab A: Ollama Tag Selector & Presets */}
          {activeTab === "ollama" ? (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-semibold text-zinc-300">
                  Ollama Model Tag / Name:
                </label>
                <input
                  type="text"
                  value={modelName}
                  onChange={(e) => setModelName(e.target.value)}
                  placeholder="e.g. qwen2.5:3b, llama3.1:8b, mistral:7b"
                  className="w-full bg-[#121215] border border-[#27272a] focus:border-emerald-500 text-white text-xs font-mono rounded-none px-3.5 py-2.5 outline-none transition-all"
                  required
                />
              </div>

              {/* Quick Presets */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-mono text-zinc-400 block">
                  Quick Select Installed Ollama Tags:
                </span>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_OLLAMA_MODELS.map((m) => (
                    <button
                      key={m.tag}
                      type="button"
                      onClick={() => handleSelectPreset(m)}
                      className={`px-3 py-1 text-[11px] font-mono rounded-none transition-all cursor-pointer border ${
                        modelName === m.tag
                          ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/60 font-bold"
                          : "bg-[#121215] text-zinc-400 border-[#27272a] hover:text-white hover:border-zinc-500"
                      }`}
                    >
                      {m.tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Tab B: Drag-and-drop File Upload */
            <div className="space-y-2">
              <label className="text-xs font-mono font-semibold text-zinc-300">
                Modelfile / GGUF Weights File:
              </label>

              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleFileDrop}
                className="border-2 border-dashed border-[#3f3f46] hover:border-emerald-500 p-8 rounded-none text-center bg-[#121215] transition-all cursor-pointer space-y-2"
                onClick={() => document.getElementById("file-input").click()}
              >
                <input
                  id="file-input"
                  type="file"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <div className="w-10 h-10 rounded-none bg-[#27272a] text-emerald-400 mx-auto flex items-center justify-center text-xl">
                  <HiOutlineDocumentArrowUp />
                </div>
                <div>
                  <p className="text-xs font-mono text-zinc-200">
                    {uploadedFile ? (
                      <span className="text-emerald-400 font-bold">{uploadedFile.name} ({(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB)</span>
                    ) : (
                      "Drag & drop your Modelfile or .gguf here, or click to browse"
                    )}
                  </p>
                  <p className="text-[10px] font-mono text-zinc-500 mt-1">
                    Accepts Modelfile, .gguf, .bin, or quantized weights (up to 5GB)
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Creator Metadata Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-[#27272a]">
            {/* Author Handle */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-semibold text-zinc-300 flex items-center gap-1">
                <HiOutlineUserCircle className="text-emerald-400" />
                <span>Author Handle:</span>
              </label>
              <input
                type="text"
                value={creatorHandle}
                onChange={(e) => setCreatorHandle(e.target.value)}
                placeholder="@AIArchitect"
                className="w-full bg-[#121215] border border-[#27272a] focus:border-emerald-500 text-white text-xs font-mono rounded-none px-3 py-2 outline-none"
              />
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-semibold text-zinc-300 flex items-center gap-1">
                <HiOutlineTag className="text-emerald-400" />
                <span>Domain Category:</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#121215] border border-[#27272a] focus:border-emerald-500 text-white text-xs font-mono rounded-none px-3 py-2 outline-none cursor-pointer"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c} className="bg-[#18181b]">
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Pricing */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-semibold text-zinc-300 flex items-center gap-1">
                <HiOutlineCurrencyDollar className="text-emerald-400" />
                <span>Rate ($/1k tokens):</span>
              </label>
              <input
                type="number"
                step="0.00001"
                value={pricing}
                onChange={(e) => setPricing(e.target.value)}
                placeholder="0.00015"
                className="w-full bg-[#121215] border border-[#27272a] focus:border-emerald-500 text-white text-xs font-mono rounded-none px-3 py-2 outline-none"
              />
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-4 border-t border-[#27272a] flex items-center justify-between">
            <span className="text-[11px] font-mono text-zinc-500">
              35 tests (Reasoning, MMLU, Coding, Safety) will be executed concurrently.
            </span>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs font-mono rounded-none transition-all flex items-center gap-2 cursor-pointer shadow-lg active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Dispatching Job...</span>
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
    </div>
  );
};

export default CreatorBenchPage;
