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
  HiOutlineCommandLine,
  HiOutlinePlay,
  HiOutlineCodeBracket,
  HiOutlineCube,
} from "react-icons/hi2";
import ModelBadge from "../atoms/ModelBadge";
import API, { API_BASE_URL } from "../../api/axios";

export const DeployModal = ({ isOpen, onClose, selectedModel, prompt: initialPrompt, priority }) => {
  const [modalTab, setModalTab] = useState("tester"); // 'tester' | 'code' | 'selfhost'
  const [activeLang, setActiveLang] = useState("python"); // 'python' | 'curl' | 'node'
  const [apiKey, setApiKey] = useState("");
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployError, setDeployError] = useState("");
  const [isCopiedKey, setIsCopiedKey] = useState(false);
  const [isCopiedCode, setIsCopiedCode] = useState(false);

  // In-Browser Live Tester State
  const [testPrompt, setTestPrompt] = useState(
    initialPrompt || "Extract JSON key fields { name, price, stock } from: 'Item: UltraBook Pro 15, Price: $1299, Stock: 42 units available.'"
  );
  const [testOutput, setTestOutput] = useState("");
  const [isTesting, setIsTesting] = useState(false);
  const [testMetrics, setTestMetrics] = useState(null);

  const modelIdentifier = selectedModel?.model_id || selectedModel?.name || selectedModel?.model_name || "custom-model";

  useEffect(() => {
    if (!isOpen || !selectedModel) return;
    setApiKey("");
    setDeployError("");
    setTestOutput("");
    setTestMetrics(null);
    setIsDeploying(true);

    const targetId = selectedModel._id || selectedModel.id || selectedModel.model_id || selectedModel.name || selectedModel.model_name;
    API.post("/deploy", { modelId: targetId })
      .then(({ data }) => {
        if (!data.apiKey) throw new Error("Deployment did not return an API key");
        setApiKey(data.apiKey);
        toast.success("Deployment gateway ready. API key provisioned.");
      })
      .catch((error) => setDeployError(error.response?.data?.message || error.message || "Could not deploy this model."))
      .finally(() => setIsDeploying(false));
  }, [isOpen, selectedModel]);

  if (!isOpen || !selectedModel) return null;

  const copyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setIsCopiedKey(true);
    toast.success("API key copied to clipboard");
    setTimeout(() => setIsCopiedKey(false), 2000);
  };

  const handleRunTest = async () => {
    if (!testPrompt.trim()) {
      toast.error("Please enter a test prompt");
      return;
    }
    setIsTesting(true);
    setTestOutput("");
    setTestMetrics(null);
    const start = performance.now();

    try {
      const response = await API.post("/proxy/predict", {
        model: modelIdentifier,
        prompt: testPrompt.trim(),
        temperature: 0.2,
      }, {
        headers: {
          "x-api-key": apiKey || "forge_live_gateway_token",
        },
      });

      const elapsed = Math.round(performance.now() - start);
      const outText = response.data?.output || response.data?.text || JSON.stringify(response.data, null, 2);
      const tokenCount = response.data?.tokens || Math.max(12, Math.round(outText.length / 4));
      const costEst = ((tokenCount / 1000) * 0.00015).toFixed(6);

      setTestOutput(outText);
      setTestMetrics({
        latencyMs: response.data?.latencyMs || elapsed,
        tokens: tokenCount,
        cost: `$${costEst}`,
        status: "200 OK",
      });
      toast.success("Inference successful!");
    } catch (err) {
      const elapsed = Math.round(performance.now() - start);
      setTestOutput(`Error executing test inference: ${err.response?.data?.message || err.message}`);
      setTestMetrics({
        latencyMs: elapsed,
        tokens: 0,
        cost: "$0.00",
        status: "Error",
      });
      toast.error("Execution failed");
    } finally {
      setIsTesting(false);
    }
  };

  const getCodeSnippet = () => {
    const cleanPrompt = testPrompt ? testPrompt.slice(0, 52).replace(/"/g, '\\"') : "Your prompt here";

    if (activeLang === "curl") {
      return `curl -X POST ${API_BASE_URL}/proxy/predict \\
  -H "Authorization: Bearer ${apiKey || "forge_live_..."}" \\
  -H "Content-Type: application/json" \\
  -d '{"model": "${modelIdentifier}", "prompt": "${cleanPrompt}..."}'`;
    }

    if (activeLang === "node") {
      return `const response = await fetch("${API_BASE_URL}/proxy/predict", {
  method: "POST",
  headers: {
    "Authorization": "Bearer ${apiKey || "forge_live_..."}",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ model: "${modelIdentifier}", prompt: "${cleanPrompt}..." }),
});

const data = await response.json();
console.log(data);`;
    }

    // Python (default)
    return `import requests

response = requests.post(
    "${API_BASE_URL}/proxy/predict",
    headers={"Authorization": "Bearer ${apiKey || "forge_live_..."}"},
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
      <div className="bg-white border-2 border-zinc-900 w-full max-w-3xl rounded-none shadow-[8px_8px_0_#18181b] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 border-b border-[#e4e4e7] bg-[#fafafa] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-none bg-[#ea580c] text-white flex items-center justify-center font-black text-base font-mono border border-black shadow-[2px_2px_0_#000]">
              F
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-zinc-950 font-sans tracking-tight">
                  Instant Deployment & Live Sandbox
                </h3>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold border border-emerald-300">
                  ONLINE
                </span>
              </div>
              <p className="text-xs text-zinc-500 font-mono">
                Model: <span className="font-bold text-zinc-900">{selectedModel.model_name || modelIdentifier}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-950 p-1.5 rounded-none hover:bg-zinc-100 transition-colors cursor-pointer border border-transparent hover:border-zinc-300"
          >
            <HiOutlineXMark className="text-xl" />
          </button>
        </div>

        {/* Top Mode Selector Tabs */}
        <div className="flex border-b border-[#e4e4e7] bg-zinc-100 font-mono text-xs">
          <button
            onClick={() => setModalTab("tester")}
            className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 font-bold transition-all border-r border-[#e4e4e7] cursor-pointer ${
              modalTab === "tester"
                ? "bg-white text-[#ea580c] border-b-2 border-b-[#ea580c]"
                : "text-zinc-600 hover:bg-zinc-200"
            }`}
          >
            <HiOutlinePlay className="text-base" />
            <span>1. In-Browser Live Tester</span>
          </button>

          <button
            onClick={() => setModalTab("code")}
            className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 font-bold transition-all border-r border-[#e4e4e7] cursor-pointer ${
              modalTab === "code"
                ? "bg-white text-[#ea580c] border-b-2 border-b-[#ea580c]"
                : "text-zinc-600 hover:bg-zinc-200"
            }`}
          >
            <HiOutlineCodeBracket className="text-base" />
            <span>2. SDK & API Key</span>
          </button>

          <button
            onClick={() => setModalTab("selfhost")}
            className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 font-bold transition-all cursor-pointer ${
              modalTab === "selfhost"
                ? "bg-white text-[#ea580c] border-b-2 border-b-[#ea580c]"
                : "text-zinc-600 hover:bg-zinc-200"
            }`}
          >
            <HiOutlineCube className="text-base" />
            <span>3. Docker / Self-Host</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto font-sans">
          {/* TAB 1: IN-BROWSER LIVE TESTER */}
          {modalTab === "tester" && (
            <div className="space-y-4">
              {/* Presets */}
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                <span className="text-zinc-500 font-bold">Quick Presets:</span>
                <button
                  type="button"
                  onClick={() =>
                    setTestPrompt(
                      "Extract JSON key fields { name, price, stock } from: 'Item: UltraBook Pro 15, Price: $1299, Stock: 42 units available.'"
                    )
                  }
                  className="px-2.5 py-1 bg-zinc-100 hover:bg-zinc-200 border border-zinc-300 text-zinc-800 transition-colors cursor-pointer"
                >
                  📑 JSON Extract
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setTestPrompt(
                      "Write an optimized JavaScript function to debounce an async search input."
                    )
                  }
                  className="px-2.5 py-1 bg-zinc-100 hover:bg-zinc-200 border border-zinc-300 text-zinc-800 transition-colors cursor-pointer"
                >
                  ⚡ Write Code
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setTestPrompt(
                      "A reservoir has 3 pipes. Pipe A fills in 6h, B in 8h, C empties in 12h. How many hours to fill from empty?"
                    )
                  }
                  className="px-2.5 py-1 bg-zinc-100 hover:bg-zinc-200 border border-zinc-300 text-zinc-800 transition-colors cursor-pointer"
                >
                  🧠 Math Logic
                </button>
              </div>

              {/* Prompt Input */}
              <div className="space-y-1.5 font-mono text-xs">
                <label className="font-bold text-zinc-900 uppercase tracking-wider block">
                  Input Prompt Payload:
                </label>
                <textarea
                  rows={3}
                  value={testPrompt}
                  onChange={(e) => setTestPrompt(e.target.value)}
                  placeholder="Enter a prompt to test live model inference..."
                  className="w-full bg-[#fafafa] border border-zinc-300 p-3 font-mono text-xs text-zinc-900 focus:outline-none focus:border-[#ea580c] focus:bg-white resize-none"
                />
              </div>

              {/* Execute CTA */}
              <div className="flex items-center justify-between">
                <div className="text-[11px] font-mono text-zinc-500">
                  Routes via <span className="font-bold text-zinc-800">/api/proxy/predict</span>
                </div>
                <button
                  type="button"
                  onClick={handleRunTest}
                  disabled={isTesting}
                  className="px-6 py-2.5 bg-[#ea580c] hover:bg-[#c2410c] text-white font-mono font-bold text-xs flex items-center gap-2 cursor-pointer shadow-xs transition-all active:scale-95 disabled:opacity-50"
                >
                  {isTesting ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Streaming Inference...</span>
                    </>
                  ) : (
                    <>
                      <HiOutlinePlay />
                      <span>Run Live Request</span>
                    </>
                  )}
                </button>
              </div>

              {/* Output Box & Telemetry */}
              <div className="space-y-2">
                <div className="flex items-center justify-between font-mono text-xs">
                  <label className="font-bold text-zinc-900 uppercase tracking-wider">
                    Live Response Stream:
                  </label>
                  {testMetrics && (
                    <div className="flex items-center gap-3 text-[11px]">
                      <span className="text-emerald-700 font-bold">● {testMetrics.status}</span>
                      <span className="text-zinc-600">⏱️ {testMetrics.latencyMs} ms</span>
                      <span className="text-zinc-600">📊 {testMetrics.tokens} tokens</span>
                      <span className="text-zinc-600 font-bold">💰 {testMetrics.cost}</span>
                    </div>
                  )}
                </div>

                <div className="bg-[#0c0c0e] border border-[#27272a] p-4 text-emerald-400 font-mono text-xs min-h-[120px] max-h-56 overflow-y-auto whitespace-pre-wrap">
                  {isTesting ? (
                    <div className="flex items-center gap-2 text-zinc-400">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                      <span>Connecting to gateway and receiving streaming chunks...</span>
                    </div>
                  ) : testOutput ? (
                    testOutput
                  ) : (
                    <span className="text-zinc-500 italic">
                      Click &quot;Run Live Request&quot; to test prompt response in real-time...
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CODE INTEGRATION & API KEY */}
          {modalTab === "code" && (
            <div className="space-y-5">
              {/* Unified API Key */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <label className="font-bold text-zinc-900 uppercase tracking-wider">
                    Unified Forge API Key
                  </label>
                  <span className="text-[11px] text-zinc-500">Live Production Gateway</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-[#fafafa] border border-[#e4e4e7] px-3.5 py-2.5 font-mono text-xs text-zinc-900 rounded-none truncate select-all">
                    {isDeploying ? "Generating deployment key..." : apiKey || "forge_live_key_ready"}
                  </div>
                  <button
                    onClick={copyKey}
                    disabled={!apiKey}
                    className="px-4 py-2.5 bg-zinc-900 hover:bg-black text-white text-xs font-mono font-medium rounded-none transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    {isCopiedKey ? <HiOutlineCheck className="text-emerald-400" /> : <HiOutlineClipboard />}
                    <span>{isCopiedKey ? "Copied" : "Copy"}</span>
                  </button>
                </div>
                {deployError && <p className="text-xs text-red-600 font-mono">{deployError}</p>}
              </div>

              {/* Code Snippets */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-zinc-900 uppercase tracking-wider font-mono">
                    Drop-in SDK Snippets
                  </label>

                  <div className="inline-flex border border-[#e4e4e7] bg-[#fafafa] p-0.5 rounded-none text-xs font-mono">
                    {["python", "curl", "node"].map((lang) => (
                      <button
                        key={lang}
                        onClick={() => setActiveLang(lang)}
                        className={`px-3 py-1 rounded-none transition-all uppercase cursor-pointer ${
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

                <div className="rounded-none border border-[#27272a] bg-[#0c0c0e] overflow-hidden font-mono text-xs">
                  <div className="flex items-center justify-between px-3 py-2 bg-[#141418] border-b border-[#27272a] text-[11px] text-zinc-400">
                    <span className="uppercase">{activeLang}</span>
                    <button
                      onClick={copyCode}
                      className="flex items-center gap-1 text-[11px] text-zinc-300 hover:text-white bg-[#1e1e24] px-2.5 py-1 rounded-none border border-[#27272a] transition-all cursor-pointer"
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
          )}

          {/* TAB 3: SELF-HOSTING & DOCKER */}
          {modalTab === "selfhost" && (
            <div className="space-y-4 font-mono text-xs">
              <div className="p-4 bg-zinc-50 border border-zinc-300 space-y-2">
                <div className="font-bold text-zinc-900">🐳 Option A: Docker Container</div>
                <div className="bg-[#0c0c0e] text-zinc-200 p-3 flex items-center justify-between border border-zinc-800">
                  <code>docker run -d -p 8000:8000 --gpus all forgeai/{modelIdentifier}:latest</code>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`docker run -d -p 8000:8000 --gpus all forgeai/${modelIdentifier}:latest`);
                      toast.success("Docker command copied!");
                    }}
                    className="px-2 py-1 bg-zinc-800 hover:bg-zinc-700 text-white text-[11px]"
                  >
                    Copy
                  </button>
                </div>
              </div>

              <div className="p-4 bg-zinc-50 border border-zinc-300 space-y-2">
                <div className="font-bold text-zinc-900">⚡ Option B: Local Ollama Execution</div>
                <div className="bg-[#0c0c0e] text-zinc-200 p-3 flex items-center justify-between border border-zinc-800">
                  <code>ollama run {modelIdentifier.includes("/") ? modelIdentifier.split("/")[1].toLowerCase() : modelIdentifier.toLowerCase()}</code>
                  <button
                    onClick={() => {
                      const name = modelIdentifier.includes("/") ? modelIdentifier.split("/")[1].toLowerCase() : modelIdentifier.toLowerCase();
                      navigator.clipboard.writeText(`ollama run ${name}`);
                      toast.success("Ollama command copied!");
                    }}
                    className="px-2 py-1 bg-zinc-800 hover:bg-zinc-700 text-white text-[11px]"
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>
          )}
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
              Close
            </button>
            <button
              onClick={() => {
                copyCode();
                onClose();
              }}
              className="px-5 py-2 bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold rounded-none transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <span>Copy SDK & Close</span>
              <HiOutlineArrowRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeployModal;
