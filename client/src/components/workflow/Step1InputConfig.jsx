import React, { useRef } from "react";
import toast from "react-hot-toast";
import {
  HiOutlineDocumentText,
  HiOutlineArrowUpTray,
  HiOutlinePlay,
  HiOutlineBolt,
  HiOutlineCurrencyDollar,
  HiOutlineShieldCheck,
  HiOutlineCheck,
  HiOutlineXMark,
  HiOutlineSparkles,
} from "react-icons/hi2";
import { TASK_CATEGORIES, DEMO_PRESETS } from "../../hooks/useBenchmark";
import ModelBadge from "../atoms/ModelBadge";

export const Step1InputConfig = ({
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
  onRunBenchmark,
}) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFileUpload(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer?.files?.[0];
    if (file) handleFileUpload(file);
  };

  const handleValidateAndSubmit = () => {
    if (!prompt.trim()) {
      toast.error("Please enter a test prompt or load a dataset preset");
      return;
    }
    const selectedCount = models.filter((m) => m.selected).length;
    if (selectedCount === 0) {
      toast.error("Please select at least 1 model to benchmark");
      return;
    }
    onRunBenchmark();
  };

  return (
    <div className="space-y-6 font-sans">
      {/* ==================== 1. TASK CATEGORY SELECTOR ==================== */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-zinc-900 uppercase tracking-wider font-mono">
            1. Select Task Domain
          </label>
          <span className="text-[11px] text-zinc-400 font-mono">Specialized creator weights</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {TASK_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`p-3 rounded-none border text-left transition-all cursor-pointer flex flex-col justify-between ${
                category === cat.id
                  ? "border-[#ea580c] bg-orange-50/50 shadow-xs"
                  : "border-[#e4e4e7] bg-white hover:border-zinc-400"
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span className="text-lg">{cat.icon}</span>
                {category === cat.id && (
                  <span className="w-2 h-2 rounded-none bg-[#ea580c]" />
                )}
              </div>
              <div>
                <div className="text-xs font-bold text-zinc-900 leading-tight">{cat.name}</div>
                <div className="text-[10px] text-zinc-500 mt-0.5 truncate">{cat.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ==================== 2. DUAL-MODE BENCHMARK INPUT ==================== */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-zinc-900 uppercase tracking-wider font-mono">
            2. Benchmark Input Area
          </label>

          {/* Mode Switcher Tabs */}
          <div className="inline-flex border border-[#e4e4e7] bg-[#fafafa] p-0.5 rounded-none text-xs font-mono">
            <button
              onClick={() => setInputMode("manual")}
              className={`px-3 py-1 rounded-none transition-all cursor-pointer flex items-center gap-1.5 ${
                inputMode === "manual"
                  ? "bg-white text-zinc-900 font-bold shadow-xs border border-zinc-200"
                  : "text-zinc-600 hover:text-black"
              }`}
            >
              <HiOutlineDocumentText className="text-xs" />
              <span>Mode A: Custom Prompt</span>
            </button>

            <button
              onClick={() => setInputMode("upload")}
              className={`px-3 py-1 rounded-none transition-all cursor-pointer flex items-center gap-1.5 ${
                inputMode === "upload"
                  ? "bg-white text-zinc-900 font-bold shadow-xs border border-zinc-200"
                  : "text-zinc-600 hover:text-black"
              }`}
            >
              <HiOutlineArrowUpTray className="text-xs" />
              <span>Mode B: Dataset Upload</span>
            </button>
          </div>
        </div>

        {/* MODE A: MANUAL PROMPT */}
        {inputMode === "manual" ? (
          <div className="space-y-3 bg-[#fafafa] p-4 border border-[#e4e4e7] rounded-none">
            <div className="space-y-1">
              <label className="text-[11px] font-mono font-bold text-zinc-700 uppercase">
                Evaluation Input Prompt:
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={3}
                placeholder="Enter prompt to benchmark across models (e.g. Extract JSON from this raw invoice snippet...)"
                className="w-full bg-white border border-[#e4e4e7] focus:border-[#ea580c] text-zinc-900 text-xs font-mono rounded-none p-3 outline-none transition-all resize-none shadow-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-mono font-bold text-zinc-700 uppercase flex items-center justify-between">
                <span>Expected Ground-Truth Output (Optional Validation):</span>
                <span className="text-[10px] text-zinc-400 font-normal">Used to calculate Accuracy %</span>
              </label>
              <input
                type="text"
                value={expectedOutput}
                onChange={(e) => setExpectedOutput(e.target.value)}
                placeholder="Expected answer or target JSON schema for automated correctness grading..."
                className="w-full bg-white border border-[#e4e4e7] focus:border-[#ea580c] text-zinc-900 text-xs font-mono rounded-none px-3 py-2 outline-none transition-all shadow-xs"
              />
            </div>
          </div>
        ) : (
          /* MODE B: DATASET UPLOAD & QUICK DEMO PRESETS */
          <div className="space-y-3 bg-[#fafafa] p-4 border border-[#e4e4e7] rounded-none">
            {/* Quick Demo Presets */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-mono font-bold text-zinc-700 uppercase flex items-center gap-1.5">
                <HiOutlineSparkles className="text-[#ea580c]" />
                <span>Clickable Quick Demo Presets (1-Click Load):</span>
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {DEMO_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => loadPreset(preset.id)}
                    className="p-2.5 bg-white hover:bg-orange-50/50 border border-[#e4e4e7] hover:border-[#ea580c] rounded-none text-left transition-all cursor-pointer shadow-xs"
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-zinc-900">
                      <span>{preset.name}</span>
                      <span className="text-[10px] font-mono text-zinc-500">{preset.testCasesCount} cases</span>
                    </div>
                    <span className="text-[10px] font-mono text-zinc-400 truncate block mt-0.5">
                      {preset.filename}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Drag and drop file uploader box */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-[#e4e4e7] hover:border-[#ea580c] bg-white p-6 text-center rounded-none cursor-pointer transition-colors space-y-2"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.json,.txt"
                onChange={handleFileChange}
                className="hidden"
              />
              <HiOutlineArrowUpTray className="text-2xl text-zinc-400 mx-auto" />
              <div className="text-xs font-bold text-zinc-800">
                Drop your CSV or JSON dataset here, or <span className="text-[#ea580c] underline">browse</span>
              </div>
              <p className="text-[11px] text-zinc-500 font-mono">
                Supports up to 20 evaluation test cases • UTF-8 JSON/CSV
              </p>

              {uploadedFile && (
                <div className="inline-flex items-center gap-2 mt-2 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono rounded-none">
                  <HiOutlineCheck className="text-emerald-600" />
                  <span className="font-bold">{uploadedFile.name}</span>
                  <span>({uploadedFile.testCases} test cases)</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ==================== 3. OPTIMIZATION PRIORITY SELECTOR ==================== */}
      <div className="space-y-2 pt-1">
        <label className="text-xs font-bold text-zinc-900 uppercase tracking-wider font-mono flex items-center justify-between">
          <span>3. Optimization Priority</span>
          <span className="text-[11px] text-zinc-400 font-normal">Weights benchmark ranking engine</span>
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
          {[
            {
              id: "latency",
              title: "Lowest Latency",
              desc: "Prioritize Time-to-First-Token (TTFT) & streaming speed",
              icon: <HiOutlineBolt className="text-[#ea580c]" />,
            },
            {
              id: "cost",
              title: "Lowest Cost",
              desc: "Minimize cost per 1M tokens without degrading quality",
              icon: <HiOutlineCurrencyDollar className="text-emerald-600" />,
            },
            {
              id: "quality",
              title: "Highest Quality / Accuracy",
              desc: "Maximize task precision and strict ground-truth match",
              icon: <HiOutlineShieldCheck className="text-blue-500" />,
            },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setPriority(item.id)}
              className={`p-3 rounded-none border text-left transition-all cursor-pointer flex items-start gap-3 ${
                priority === item.id
                  ? "border-[#ea580c] bg-orange-50/50 shadow-xs"
                  : "border-[#e4e4e7] bg-white hover:border-zinc-400"
              }`}
            >
              <div className="text-lg mt-0.5">{item.icon}</div>
              <div>
                <div className="font-bold text-zinc-900 flex items-center gap-1.5">
                  <span>{item.title}</span>
                  {priority === item.id && (
                    <span className="w-1.5 h-1.5 rounded-none bg-[#ea580c]" />
                  )}
                </div>
                <div className="text-[11px] text-zinc-500 leading-tight mt-0.5 font-sans">
                  {item.desc}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ==================== 4. MODELS TO COMPARE (4 PRE-SELECTED) ==================== */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-zinc-900 uppercase tracking-wider font-mono">
            4. Competing Models ({models.filter((m) => m.selected).length} Active)
          </label>
          <span className="text-[11px] text-zinc-400 font-mono">Toggle models on/off</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 font-mono text-xs">
          {models.map((model) => (
            <div
              key={model.id}
              onClick={() => toggleModel(model.id)}
              className={`p-3 rounded-none border transition-all cursor-pointer flex flex-col justify-between select-none ${
                model.selected
                  ? model.isCreator
                    ? "border-[#ea580c] bg-orange-50/30 shadow-xs"
                    : "border-zinc-400 bg-white shadow-xs"
                  : "border-zinc-200 bg-zinc-50 opacity-60 hover:opacity-100"
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <ModelBadge type={model.type} size="sm">{model.provider}</ModelBadge>
                  <div
                    className={`w-4 h-4 rounded-none border flex items-center justify-center text-[10px] ${
                      model.selected
                        ? "border-[#ea580c] bg-[#ea580c] text-white"
                        : "border-zinc-300 bg-white"
                    }`}
                  >
                    {model.selected && <HiOutlineCheck />}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-bold text-zinc-900 truncate">{model.name}</div>
                  <div className="text-[10px] text-zinc-500 font-mono mt-0.5">{model.size}</div>
                </div>
              </div>

              <div className="mt-2 pt-2 border-t border-[#f4f4f5] flex items-center justify-between text-[10px] text-zinc-500">
                <span>~{model.baseLatency}ms</span>
                <span>${model.costPer1M.toFixed(2)}/1M</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ==================== 5. RUN REAL-TIME BENCHMARK BUTTON ==================== */}
      <div className="pt-4 border-t border-[#e4e4e7] flex items-center justify-between">
        <div className="text-[11px] text-zinc-500 font-mono">
          Ready to benchmark <span className="font-bold text-zinc-900">{models.filter((m) => m.selected).length} models</span> concurrently.
        </div>

        <button
          onClick={handleValidateAndSubmit}
          className="bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold text-xs px-6 py-3 rounded-none transition-all flex items-center gap-2 shadow-xs cursor-pointer active:scale-95"
        >
          <HiOutlinePlay className="text-base" />
          <span>Run Real-Time Benchmark</span>
        </button>
      </div>
    </div>
  );
};

export default Step1InputConfig;
