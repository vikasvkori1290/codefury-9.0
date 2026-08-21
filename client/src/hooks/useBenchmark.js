import { useState, useCallback } from "react";
import toast from "react-hot-toast";

export const TASK_CATEGORIES = [
  { id: "extraction", name: "Data Extraction / JSON", icon: "📊", desc: "Structured entity & field extraction" },
  { id: "summarization", name: "Text Summarization", icon: "📑", desc: "Long-form compression & TL;DR" },
  { id: "support", name: "Customer Support QA", icon: "💬", desc: "Multi-turn helpdesk & policy adherence" },
  { id: "coding", name: "Code Generation", icon: "💻", desc: "SQL, Python, and async refactoring" },
];

export const DEMO_PRESETS = [
  {
    id: "ecommerce-support",
    name: "E-commerce Support",
    category: "support",
    filename: "ecommerce_support_v2.json",
    testCasesCount: 5,
    samplePrompt: "Customer order #48921 delayed by 3 days. Return refund policy summary with polite tone and coupon code 'SAVE15'.",
    expectedOutput: "Acknowledge 3-day delay on order #48921, offer 100% money-back guarantee, and attach coupon code SAVE15.",
    items: [
      { id: 1, prompt: "Order #48921 delay response", expected: "Polite apology, refund steps, SAVE15 coupon" },
      { id: 2, prompt: "Damaged item received return request", expected: "Prepaid label generated, replacement dispatched" },
      { id: 3, prompt: "Cancel subscription request", expected: "Prorated refund confirmation & cancellation note" },
    ],
  },
  {
    id: "financial-parsing",
    name: "Financial Parsing",
    category: "extraction",
    filename: "q3_earnings_sec.csv",
    testCasesCount: 8,
    samplePrompt: "Extract JSON: { 'quarter': 'Q3 2025', 'revenue_m': float, 'ebitda_margin_pct': float, 'capex_yoy_delta': str } from 10-Q filing snippet.",
    expectedOutput: "{\"quarter\": \"Q3 2025\", \"revenue_m\": 482.5, \"ebitda_margin_pct\": 24.8, \"capex_yoy_delta\": \"+12.4%\"}",
    items: [
      { id: 1, prompt: "Extract revenue & EBITDA margins from 10-Q", expected: "{\"revenue_m\": 482.5, \"margin\": 24.8}" },
      { id: 2, prompt: "Parse balance sheet liabilities", expected: "{\"current_liabilities\": 140.2, \"long_term_debt\": 88.0}" },
    ],
  },
  {
    id: "legal-summaries",
    name: "Legal Summaries",
    category: "summarization",
    filename: "nda_contract_sample.json",
    testCasesCount: 4,
    samplePrompt: "Summarize non-compete clause duration, jurisdiction, liquidated damages, and indemnification caps from Mutual NDA agreement.",
    expectedOutput: "Duration: 24 months post-termination. Jurisdiction: Delaware Chancery Court. Damages capped at $500,000.",
    items: [
      { id: 1, prompt: "Identify indemnification ceiling in SaaS agreement", expected: "Cap equal to 12 months fees paid ($120k)" },
      { id: 2, prompt: "IP assignment clauses for external contractors", expected: "Work-for-hire assignment with moral rights waiver" },
    ],
  },
];

export const INITIAL_MODELS = [
  {
    id: "mistral-7b-niche",
    name: "Mistral-7B-Niche-Extract (by @AIArchitect)",
    shortName: "Mistral-7B-Niche",
    provider: "Creator / Hugging Face",
    type: "creator",
    size: "7B (4-bit AWQ)",
    selected: true,
    baseLatency: 112,
    costPer1M: 0.15,
    accuracyBase: 95.4,
    isCreator: true,
  },
  {
    id: "gpt-4o-mini",
    name: "GPT-4o-mini",
    shortName: "GPT-4o-mini",
    provider: "OpenAI",
    type: "frontier",
    size: "Frontier API",
    selected: true,
    baseLatency: 320,
    costPer1M: 0.60,
    accuracyBase: 93.8,
  },
  {
    id: "gemini-1.5-flash",
    name: "Gemini 1.5 Flash",
    shortName: "Gemini 1.5 Flash",
    provider: "Google",
    type: "frontier",
    size: "Frontier API",
    selected: true,
    baseLatency: 280,
    costPer1M: 0.30,
    accuracyBase: 92.5,
  },
  {
    id: "claude-3-5-haiku",
    name: "Claude 3.5 Haiku",
    shortName: "Claude 3.5 Haiku",
    provider: "Anthropic",
    type: "frontier",
    size: "Frontier API",
    selected: true,
    baseLatency: 295,
    costPer1M: 1.00,
    accuracyBase: 94.6,
  },
];

export const useBenchmark = () => {
  const [category, setCategory] = useState("extraction");
  const [inputMode, setInputMode] = useState("manual");
  const [prompt, setPrompt] = useState(DEMO_PRESETS[1].samplePrompt);
  const [expectedOutput, setExpectedOutput] = useState(DEMO_PRESETS[1].expectedOutput);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [datasetCases, setDatasetCases] = useState([]);
  const [priority, setPriority] = useState("latency");
  const [models, setModels] = useState(INITIAL_MODELS);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleModel = (id) => {
    setModels((prev) => {
      const selectedCount = prev.filter((m) => m.selected).length;
      return prev.map((m) => {
        if (m.id === id) {
          if (m.selected && selectedCount <= 1) {
            toast.error("At least 1 model must be selected for benchmarking");
            return m;
          }
          return { ...m, selected: !m.selected };
        }
        return m;
      });
    });
  };

  const loadPreset = (presetId) => {
    const preset = DEMO_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    setCategory(preset.category);
    setPrompt(preset.samplePrompt);
    setExpectedOutput(preset.expectedOutput);
    setUploadedFile({ name: preset.filename, size: "14.2 KB", testCases: preset.testCasesCount });
    setDatasetCases(preset.items);
    toast.success(`Loaded preset: ${preset.name}`);
  };

  const handleFileUpload = (file) => {
    if (!file) return;
    const name = file.name.toLowerCase();
    if (!name.endsWith(".json") && !name.endsWith(".csv") && !name.endsWith(".txt")) {
      toast.error("Please upload a .json or .csv dataset");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        let cases = [];
        if (name.endsWith(".json")) {
          const parsed = JSON.parse(text);
          cases = Array.isArray(parsed) ? parsed.slice(0, 20) : [parsed];
        } else {
          const lines = text.split("\n").filter((l) => l.trim());
          cases = lines.slice(1, 21).map((line, idx) => ({ id: idx + 1, prompt: line, expected: "" }));
        }

        setUploadedFile({ name: file.name, size: `${(file.size / 1024).toFixed(1)} KB`, testCases: cases.length });
        setDatasetCases(cases);
        if (cases[0]?.prompt) setPrompt(typeof cases[0].prompt === "string" ? cases[0].prompt : JSON.stringify(cases[0]));
        toast.success(`Uploaded ${cases.length} test cases from ${file.name}`);
      } catch (err) {
        toast.error("Could not parse file. Using raw text content.");
        setUploadedFile({ name: file.name, size: `${(file.size / 1024).toFixed(1)} KB`, testCases: 1 });
      }
    };
    reader.readAsText(file);
  };

  const compilePayload = useCallback(() => {
    const activeModels = models.filter((m) => m.selected);
    return {
      category,
      inputMode,
      prompt,
      expectedOutput,
      uploadedFile: uploadedFile ? { name: uploadedFile.name, testCases: uploadedFile.testCases } : null,
      datasetCases,
      priority,
      models: activeModels,
      createdAt: new Date().toISOString(),
    };
  }, [category, inputMode, prompt, expectedOutput, uploadedFile, datasetCases, priority, models]);

  return {
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
    datasetCases,
    priority,
    setPriority,
    models,
    toggleModel,
    loadPreset,
    handleFileUpload,
    compilePayload,
    isSubmitting,
    setIsSubmitting,
  };
};
