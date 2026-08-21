import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  HiOutlineXMark,
  HiOutlineKey,
  HiOutlineClipboard,
  HiOutlineCheck,
  HiOutlineSparkles,
  HiOutlineArrowRight,
  HiOutlineShieldCheck,
  HiOutlineCurrencyDollar,
  HiOutlineDocumentArrowDown,
} from "react-icons/hi2";
import ModelBadge from "../atoms/ModelBadge";
import API, { API_BASE_URL } from "../../api/axios";

export const DeployModal = ({ isOpen, onClose, selectedModel, prompt, priority }) => {
  const [activeLang, setActiveLang] = useState("python"); // 'python' | 'curl' | 'node'
  const [apiKey, setApiKey] = useState("");
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployError, setDeployError] = useState("");
  const [isCopiedKey, setIsCopiedKey] = useState(false);
  const [isCopiedCode, setIsCopiedCode] = useState(false);

  useEffect(() => {
    if (!isOpen || !selectedModel) return;
    setApiKey("");
    setDeployError("");
    setIsDeploying(true);
    API.post("/deploy", { modelId: selectedModel.model_id || selectedModel.id })
      .then(({ data }) => {
        if (!data.apiKey) throw new Error("Deployment did not return an API key");
        setApiKey(data.apiKey);
        toast.success("Deployment created. Your live API key is ready.");
      })
      .catch((error) => setDeployError(error.response?.data?.message || error.message || "Could not deploy this model."))
      .finally(() => setIsDeploying(false));
  }, [isOpen, selectedModel]);

  if (!isOpen || !selectedModel) return null;

  const modelIdentifier = selectedModel.is_creator
    ? "creator/mistral-7b-niche"
    : selectedModel.model_id;

  const copyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setIsCopiedKey(true);
    toast.success("API key copied to clipboard");
    setTimeout(() => setIsCopiedKey(false), 2000);
  };

  const getCodeSnippet = () => {
    const cleanPrompt = prompt ? prompt.slice(0, 48).replace(/"/g, '\\"') : "Your data here";

    if (activeLang === "curl") {
      return `curl -X POST ${API_BASE_URL}/proxy/predict \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{"model": "${modelIdentifier}", "prompt": "${cleanPrompt}..."}'`;
    }

    if (activeLang === "node") {
      return `const response = await fetch("${API_BASE_URL}/proxy/predict", {
  method: "POST",
  headers: {
    "Authorization": "Bearer ${apiKey}",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ model: "${modelIdentifier}", prompt: "${cleanPrompt}..." }),
});

console.log(await response.json());`;
    }

    // Python (default)
    return `import requests

response = requests.post(
     "${API_BASE_URL}/proxy/predict",
    headers={"Authorization": "Bearer ${apiKey}"},
    json={
        "model": "${modelIdentifier}",
        "prompt": "${cleanPrompt}...",
        "temperature": 0.2
    }
)

print(response.json())`;
  };

  const copyCode = () => {
    navigator.clipboard.writeText(getCodeSnippet());
    setIsCopiedCode(true);
    toast.success("Code snippet copied!");
    setTimeout(() => setIsCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 font-sans animate-fade-in">
      <div className="bg-white border border-[#e4e4e7] w-full max-w-2xl rounded-none shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-[#e4e4e7] bg-[#fafafa] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-none bg-[#ea580c] text-white flex items-center justify-center font-bold text-sm font-mono">
              <HiOutlineKey />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-950 font-sans">
                Instant Integration & Endpoint Checkout
              </h3>
              <p className="text-[11px] text-zinc-500 font-mono">
                Deploying <span className="font-bold text-zinc-900">{selectedModel.model_name}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-700 p-1.5 rounded-none hover:bg-zinc-100 transition-colors cursor-pointer"
          >
            <HiOutlineXMark className="text-lg" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto font-sans">
          {/* Creator Revenue Share & Billing Tier Info Card */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
            <div className="p-3 bg-[#fafafa] border border-[#e4e4e7] rounded-none space-y-1">
              <span className="text-[10px] text-zinc-500 block uppercase">Billing Tier</span>
              <div className="font-bold text-zinc-900 text-sm">
                ${selectedModel.cost_per_1k_calls || "0.00015"} / req
              </div>
              <span className="text-[10px] text-emerald-700 block font-sans">Pay-per-token pricing</span>
            </div>

            <div className="p-3 bg-[#fafafa] border border-[#e4e4e7] rounded-none space-y-1">
              <span className="text-[10px] text-zinc-500 block uppercase">Creator Share</span>
              <div className="font-bold text-[#ea580c] text-sm">
                {selectedModel.is_creator ? "85% Revenue Share" : "Direct Gateway"}
              </div>
              <span className="text-[10px] text-zinc-500 block font-sans">
                {selectedModel.is_creator ? "Goes to @AIArchitect" : selectedModel.provider}
              </span>
            </div>

            <div className="p-3 bg-[#fafafa] border border-[#e4e4e7] rounded-none space-y-1">
              <span className="text-[10px] text-zinc-500 block uppercase">P99 Latency SLA</span>
              <div className="font-bold text-emerald-700 text-sm">
                {selectedModel.latency_ms || 118} ms
              </div>
              <span className="text-[10px] text-zinc-500 block font-sans">Cold-start free endpoints</span>
            </div>
          </div>

          {/* Unified API Key Generator */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-mono">
              <label className="font-bold text-zinc-900 uppercase tracking-wider">
                Unified ModelHub API Key
              </label>
               <span className="text-[11px] text-zinc-500">Generated securely by the backend</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex-1 bg-[#fafafa] border border-[#e4e4e7] px-3.5 py-2 font-mono text-xs text-zinc-900 rounded-none truncate select-all">
                 {isDeploying ? "Generating deployment key..." : apiKey || "No key generated"}
              </div>
              <button
                 onClick={copyKey}
                 disabled={!apiKey}
                className="px-3.5 py-2 bg-zinc-900 hover:bg-black text-white text-xs font-mono font-medium rounded-none transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                {isCopiedKey ? <HiOutlineCheck className="text-emerald-400" /> : <HiOutlineClipboard />}
                <span>{isCopiedKey ? "Copied" : "Copy"}</span>
              </button>
             </div>
             {deployError && <p className="text-xs text-red-600 font-mono">{deployError}</p>}
           </div>

          {/* Interactive Code Snippets */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-zinc-900 uppercase tracking-wider font-mono">
                Live Integration Code
              </label>

              {/* Language Switcher Tabs */}
              <div className="inline-flex border border-[#e4e4e7] bg-[#fafafa] p-0.5 rounded-none text-xs font-mono">
                {["python", "curl", "node"].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setActiveLang(lang)}
                    className={`px-2.5 py-1 rounded-none transition-all uppercase cursor-pointer ${
                      activeLang === lang
                        ? "bg-white text-zinc-900 font-bold shadow-xs border border-zinc-200"
                        : "text-zinc-500 hover:text-black"
                    }`}
                  >
                    {lang === "node" ? "Node.js" : lang}
                  </button>
                ))}
              </div>
            </div>

            {/* Code Box */}
            <div className="rounded-none border border-[#27272a] bg-[#0c0c0e] overflow-hidden font-mono text-xs">
              <div className="flex items-center justify-between px-3 py-1.5 bg-[#141418] border-b border-[#27272a] text-[11px] text-zinc-400">
                <span className="uppercase">{activeLang}</span>
                <button
                  onClick={copyCode}
                  className="flex items-center gap-1 text-[11px] text-zinc-300 hover:text-white bg-[#1e1e24] px-2 py-0.5 rounded-none border border-[#27272a] transition-all cursor-pointer"
                >
                  {isCopiedCode ? <HiOutlineCheck className="text-emerald-400" /> : <HiOutlineClipboard />}
                  <span>{isCopiedCode ? "Copied" : "Copy Snippet"}</span>
                </button>
              </div>
              <div className="p-4 overflow-x-auto text-zinc-200 max-h-48 scrollbar-thin">
                <pre className="font-mono text-xs leading-5">
                  <code>{getCodeSnippet()}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#e4e4e7] bg-[#fafafa] flex items-center justify-between font-mono text-xs">
          <span className="text-[11px] text-zinc-500 font-sans">
            Ready to route traffic immediately.
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-zinc-300 text-zinc-700 hover:bg-white rounded-none transition-colors cursor-pointer"
            >
              Done
            </button>
            <button
              onClick={() => {
                copyCode();
                onClose();
              }}
              className="px-5 py-2 bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold rounded-none transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <span>Copy & Close</span>
              <HiOutlineArrowRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeployModal;
