import React, { useState } from "react";
import {
  HiOutlineSparkles,
  HiOutlineMagnifyingGlass,
  HiPlus,
  HiMinus,
  HiOutlineQuestionMarkCircle,
  HiOutlineScale,
  HiOutlineKey,
  HiOutlineCodeBracket,
  HiOutlineShieldCheck,
  HiOutlineCheckCircle,
  HiOutlineCommandLine,
  HiOutlineCpuChip,
  HiOutlineWrenchScrewdriver,
  HiOutlineInformationCircle,
  HiOutlineDocumentText,
  HiOutlineArrowTopRightOnSquare,
  HiOutlineChevronDown,
} from "react-icons/hi2";

// 20 Standardized Benchmark Questions & Assertions
const BENCHMARK_QUESTIONS = [
  // 1. MATH & EXACT LOGIC
  {
    id: "math_1",
    category: "Math & Logic",
    title: "GSM8K Multi-Step Transaction Arithmetic",
    type: "Regex Numeric Match",
    question:
      "A store sells notebooks for $4 each and pens for $2 each. Janet buys 5 notebooks and 6 pens. She pays with a $50 bill. How much change does she receive in dollars? Output only the final numeric integer value.",
    expected: "18",
    verification: "Evaluates exact numeric change: 50 - ((5 × 4) + (6 × 2)) = 18",
  },
  {
    id: "math_2",
    category: "Math & Logic",
    title: "Compound Speed-Time Integration",
    type: "Regex Numeric Match",
    question:
      "A train travels at 60 mph for 2.5 hours and then 80 mph for 1.5 hours. What is the total distance traveled in miles? Output only the numeric value.",
    expected: "270",
    verification: "Calculates total miles: (60 × 2.5) + (80 × 1.5) = 150 + 120 = 270",
  },
  {
    id: "math_3",
    category: "Math & Logic",
    title: "Sequential Fractional Depletion Logic",
    type: "Regex Numeric Match",
    question:
      "A bakery made 240 cookies. They sold 3/4 of them in the morning and 1/3 of the remainder in the afternoon. How many cookies are left? Output only the integer number.",
    expected: "40",
    verification: "Evaluates remaining cookies: 240 - 180 = 60 remainder; 60 - (1/3 × 60) = 40",
  },
  {
    id: "math_4",
    category: "Math & Logic",
    title: "Combinatorics & Round-Robin Game Count",
    type: "Regex Numeric Match",
    question:
      "In a round-robin tournament of 8 teams, every team plays every other team exactly once. How many total matches are played? Output only the numeric answer.",
    expected: "28",
    verification: "Formula n(n-1)/2: (8 × 7) / 2 = 28 total matches",
  },
  {
    id: "math_5",
    category: "Math & Logic",
    title: "Modular Arithmetic Cycle Resolution",
    type: "Regex Numeric Match",
    question:
      "If a 12-hour clock shows exactly 8:00 right now, what hour will it show in exactly 150 hours? Give only the number from 1 to 12.",
    expected: "2",
    verification: "Evaluates modulo 12: 150 mod 12 = 6 hours; (8 + 6) = 14 => 2:00",
  },

  // 2. CODING & EXECUTION
  {
    id: "code_1",
    category: "Coding & Execution",
    title: "Sanitized Palindrome Algorithm",
    type: "Sandboxed VM Unit Tests (3 vectors)",
    question:
      "Write a JavaScript function `isPalindrome(str)` that returns true if `str` (ignoring non-alphanumeric chars and case) is a palindrome, false otherwise. Output ONLY the executable JavaScript function definition.",
    expected: "Pass 3 hidden unit tests in sandboxed VM",
    verification:
      "Tested on: 'A man, a plan, a canal: Panama' (true), 'race a car' (false), 'Was it a car or a cat I saw?' (true)",
  },
  {
    id: "code_2",
    category: "Coding & Execution",
    title: "Recursive Deep Clone Implementation",
    type: "Sandboxed VM Mutation Tests",
    question:
      "Write a JavaScript function `deepClone(obj)` that returns a deep copy of an object/array without using JSON.parse. Output ONLY the JavaScript function definition.",
    expected: "Pass object & array mutation tests without mutating original",
    verification: "Executes in VM sandbox and verifies deep references are distinct in memory",
  },
  {
    id: "code_3",
    category: "Coding & Execution",
    title: "Order-Preserving Deduplication",
    type: "Sandboxed VM Unit Tests (3 vectors)",
    question:
      "Write a JavaScript function `uniqueArray(arr)` that returns an array with duplicate primitive elements removed while strictly preserving original order. Output ONLY the JavaScript function.",
    expected: "[1, 2, 3, 4] for [1, 2, 2, 3, 1, 4]",
    verification: "Verifies strict array equality across primitive types and empty edge cases",
  },
  {
    id: "code_4",
    category: "Coding & Execution",
    title: "Stack-Based Bracket Matching",
    type: "Sandboxed VM Unit Tests (3 vectors)",
    question:
      "Write a JavaScript function `isValidParentheses(s)` that takes a string containing '()[]{}' and returns true if the brackets are closed in the correct order. Output ONLY the JavaScript function.",
    expected: "True for '()[]{}' and '([{}])', False for '(]'",
    verification: "Runs stack verification against nested, interleaved, and unbalanced bracket strings",
  },
  {
    id: "code_5",
    category: "Coding & Execution",
    title: "Arbitrary-Depth Array Flattening",
    type: "Sandboxed VM Unit Tests (3 vectors)",
    question:
      "Write a JavaScript function `flattenArray(arr)` that recursively flattens an array of arbitrarily nested arrays into a single flat array. Output ONLY the JavaScript function.",
    expected: "[1, 2, 3, 4, 5] for [1, [2, [3, [4]], 5]]",
    verification: "Verifies arbitrary recursive nesting depths and empty nested sub-arrays",
  },

  // 3. JSON SCHEMA & EXTRACTION
  {
    id: "schema_1",
    category: "JSON Schema & Extraction",
    title: "Unstructured Financial Invoice Extraction",
    type: "Strict JSON Schema Validator",
    question:
      "Extract data from: 'Invoice #INV-2026-88 issued on 2026-04-15 to Acme Corp for total amount $1,450.00 with status PAID.' into raw JSON with exact keys: `invoice_id` (string), `date` (string), `recipient` (string), `total` (number), `paid` (boolean). Output ONLY raw JSON.",
    expected: '{"invoice_id": "INV-2026-88", "date": "2026-04-15", "recipient": "Acme Corp", "total": 1450, "paid": true}',
    verification: "Verifies JSON parser, required keys, correct types, and numerical amount 1450",
  },
  {
    id: "schema_2",
    category: "JSON Schema & Extraction",
    title: "Server Security Log Telemetry Parsing",
    type: "Strict JSON Schema Validator",
    question:
      "Extract data from server log: 'ERROR 2026-08-21T14:23:05.120Z [auth-service] User id=usr_9984 login failed from IP 192.168.1.45 (code 401: Invalid Credentials)' into raw JSON with exact keys: `level` (string), `service` (string), `user_id` (string), `ip` (string), `status_code` (number). Output ONLY raw JSON.",
    expected: '{"level": "ERROR", "service": "auth-service", "user_id": "usr_9984", "ip": "192.168.1.45", "status_code": 401}',
    verification: "Validates parsed error level, service name, client IP, and status code 401",
  },
  {
    id: "schema_3",
    category: "JSON Schema & Extraction",
    title: "Hardware Spec Sheet Parsing",
    type: "Strict JSON Schema Validator",
    question:
      "Parse specs: 'Model: Titan RTX Pro. Price: $2499. In Stock: yes. VRAM: 24GB GDDR6X. TDP: 350W.' into raw JSON with exact keys: `model_name` (string), `price_usd` (number), `in_stock` (boolean), `vram_gb` (number), `tdp_watts` (number). Output ONLY raw JSON.",
    expected: '{"model_name": "Titan RTX Pro", "price_usd": 2499, "in_stock": true, "vram_gb": 24, "tdp_watts": 350}',
    verification: "Checks boolean conversion ('yes' => true) and integer units (24, 350, 2499)",
  },
  {
    id: "schema_4",
    category: "JSON Schema & Extraction",
    title: "Product Feedback Sentiment Synthesis",
    type: "Strict JSON Schema Validator",
    question:
      "Analyze review: 'Fast battery charging was great, but the display brightness in direct sunlight is too poor. Overall average product.' into raw JSON with keys: `sentiment` ('positive'|'neutral'|'mixed'|'negative'), `rating` (1-5 integer), `pros` (string array), `cons` (string array). Output ONLY raw JSON.",
    expected: '{"sentiment": "mixed"|"neutral", "rating": 3, "pros": [...], "cons": [...]}',
    verification: "Verifies array structures for pros/cons and enum validation on sentiment",
  },
  {
    id: "schema_5",
    category: "JSON Schema & Extraction",
    title: "Named Entity Extraction",
    type: "Strict JSON Schema Validator",
    question:
      "Extract entities from: 'Dr. Sarah Connor and Dr. Miles Dyson founded Cyberdyne Systems in Sunnyvale, California.' into raw JSON with exact keys: `people` (array of full names) and `locations` (array of location strings). Output ONLY raw JSON.",
    expected: '{"people": ["Dr. Sarah Connor", "Dr. Miles Dyson"], "locations": ["Cyberdyne Systems", "Sunnyvale, California"]}',
    verification: "Verifies correct multi-entity clustering in arrays",
  },

  // 4. COMPLEX RULE FOLLOWING
  {
    id: "rule_1",
    category: "Rule Following",
    title: "Exact Word Count Constraint",
    type: "Exact Word Count (Regex Split)",
    question:
      "Explain the fundamental benefit of quantum computing in EXACTLY 20 words. No more, no less.",
    expected: "Exactly 20 words in total length",
    verification: "Regex tokenizes words and enforces words.length === 20",
  },
  {
    id: "rule_2",
    category: "Rule Following",
    title: "Lipogram (Forbidden Letter 'e')",
    type: "Negative Letter Constraint",
    question:
      "Write a short paragraph of at least 25 words describing rain without using the letter 'e' or 'E' anywhere in your response.",
    expected: "No letter 'e' present and minimum 25 words",
    verification: "Regex checks !/e/i.test(text) and words.length >= 25",
  },
  {
    id: "rule_3",
    category: "Rule Following",
    title: "Custom Token Delimiter Formatting",
    type: "Delimiter Token Matcher",
    question:
      "List the three primary colors (Red, Green, Blue). Wrap each color name in triple angle brackets like `<<<Color>>>`, with each item on a new line.",
    expected: "<<<Red>>>\\n<<<Green>>>\\n<<<Blue>>>",
    verification: "Verifies strict delimiter pattern match on each line",
  },
  {
    id: "rule_4",
    category: "Rule Following",
    title: "Prefix and Suffix Boundary Wrapping",
    type: "Boundary Token Encapsulation",
    question:
      "Provide a single cybersecurity tip. Your entire response MUST start with `[SECURITY_ADVISORY_START]` and MUST end with `[SECURITY_ADVISORY_END]`.",
    expected: "Starts with [SECURITY_ADVISORY_START] and ends with [SECURITY_ADVISORY_END]",
    verification: "Checks startsWith and endsWith boundary markers",
  },
  {
    id: "rule_5",
    category: "Rule Following",
    title: "All-Lowercase Pure Word Constraint",
    type: "Lowercase Pure Alphabetic Count",
    question:
      "Write EXACTLY 4 words that describe the ocean. All characters MUST be lowercase with no punctuation.",
    expected: "4 lowercase words with no capital letters or punctuation (e.g. 'deep blue vast tide')",
    verification: "Verifies text === text.toLowerCase(), pure alphabet, and count === 4",
  },
];

const QUESTION_CATEGORIES = ["All Questions", "Math & Logic", "Coding & Execution", "JSON Schema & Extraction", "Rule Following"];

const SIDEBAR_ITEMS = [
  { id: "quickstart", label: "Quickstart Guide", icon: HiOutlineCommandLine, badge: "2 min" },
  { id: "questions", label: "Questions", icon: HiOutlineQuestionMarkCircle, badge: "20" },
  { id: "judging_criteria", label: "Judging Criteria", icon: HiOutlineScale, badge: "6 Pillars" },
  { id: "api_keys", label: "API Keys", icon: HiOutlineKey, badge: "Auth" },
  { id: "ollama", label: "Ollama & Modelfiles", icon: HiOutlineCpuChip, badge: "Local GPU" },
  { id: "agents", label: "Agent Marketplace", icon: HiOutlineSparkles, badge: "Market" },
  { id: "faq", label: "FAQ & Troubleshooting", icon: HiOutlineInformationCircle, badge: "Help" },
  { id: "requests_no_sub", label: "Requests Without Subscription", icon: HiOutlineWrenchScrewdriver, badge: "Engine" },
];

const FAQS = [
  {
    q: "How does ModelHub eliminate LLM-as-a-judge bias?",
    a: "Traditional benchmarks query larger frontier models to 'rate' answers on a 1-10 scale, which introduces severe subjective drift, self-enhancement bias, and non-deterministic results. ModelHub uses 100% deterministic ground-truth verification: mathematical regex extraction, isolated Node.js VM execution with unit test suites, and strict AST JSON schema parsers.",
  },
  {
    q: "How is global rank calculated on LiveBench?",
    a: "Every model that completes the 20 test assertions receives a verified composite pass rate (0% - 100%). This score is benchmarked directly against the 44 frontier models on the global LiveBench leaderboard (e.g., GPT-4o at 83.0%, Claude 3.5 Sonnet at 81.0%, Gemini 1.5 Pro at 78.8%) to determine its exact global percentile and leaderboard rank.",
  },
  {
    q: "Are my remote API keys safe when testing custom models?",
    a: "Yes. Remote API keys (Google Gemini, Groq, OpenAI) are held only ephemerally in RAM during active test assertion execution. They are never written to MongoDB, never logged to serverless telemetry, and immediately purged from memory once the benchmark completes.",
  },
  {
    q: "Can I benchmark local Ollama models without internet access?",
    a: "Yes. By selecting 'Ollama Local' and providing your locally installed model tag (e.g. qwen2.5:3b), the benchmark worker sends requests to your local Ollama daemon (http://127.0.0.1:11434) and executes the unit assertions without routing inference through external third-party cloud servers.",
  },
  {
    q: "How long does an automated 20-case benchmark run take?",
    a: "Typical benchmark jobs complete in 15 to 45 seconds depending on provider latency and model reasoning speed. Real-time telemetry streams live test execution logs and passing badges directly to your browser as assertions run.",
  },
];

const DocsPage = () => {
  const [activeTab, setActiveTab] = useState("quickstart");
  const [selectedCategory, setSelectedCategory] = useState("All Questions");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedIds, setExpandedIds] = useState(new Set());
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const toggleExpand = (id) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const expandAll = () => {
    setExpandedIds(new Set(BENCHMARK_QUESTIONS.map((q) => q.id)));
  };

  const collapseAll = () => {
    setExpandedIds(new Set());
  };

  const filteredQuestions = BENCHMARK_QUESTIONS.filter((q) => {
    const matchesCat = selectedCategory === "All Questions" || q.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === "" ||
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#fafafa] text-zinc-900 font-sans selection:bg-[#ea580c] selection:text-white py-8 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ==================== SIDEBAR NAVIGATION ==================== */}
          <aside className="lg:col-span-3 bg-white border border-[#e4e4e7] p-3 sticky top-24 shadow-xs">
            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 font-bold px-3 py-2 block">
              Documentation Index
            </span>
            <nav className="space-y-1 font-mono text-xs">
              {SIDEBAR_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 text-left transition-all cursor-pointer border ${
                      active
                        ? "bg-black text-white font-bold border-black shadow-xs"
                        : "bg-transparent text-zinc-700 hover:text-black hover:bg-zinc-100 border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon className={active ? "text-[#ea580c]" : "text-zinc-400"} />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.5 rounded-none ${
                          active
                            ? "bg-zinc-800 text-white"
                            : "bg-zinc-100 text-zinc-600"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* ==================== MAIN CONTENT AREA ==================== */}
          <main className="lg:col-span-9 space-y-6">
            {/* 1. QUESTIONS SECTION */}
            {activeTab === "questions" && (
              <div className="space-y-4">
                {/* Action Header: Expand/Collapse All */}
                <div className="flex items-center justify-between text-xs font-mono text-zinc-500 px-1">
                  <span>Showing {BENCHMARK_QUESTIONS.length} Standardized Benchmark Questions</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={expandAll}
                      className="text-[#ea580c] hover:underline font-bold cursor-pointer"
                    >
                      Expand All
                    </button>
                    <span>•</span>
                    <button
                      onClick={collapseAll}
                      className="text-zinc-600 hover:text-black cursor-pointer"
                    >
                      Collapse All
                    </button>
                  </div>
                </div>

                {/* Accordion Questions List */}
                <div className="bg-white border border-[#e4e4e7] divide-y divide-[#e4e4e7] shadow-xs">
                  {BENCHMARK_QUESTIONS.map((item, index) => {
                    const isExpanded = expandedIds.has(item.id);

                    return (
                      <div key={item.id} className="transition-colors">
                        {/* Accordion Header Row (Clickable) */}
                        <button
                          type="button"
                          onClick={() => toggleExpand(item.id)}
                          aria-expanded={isExpanded}
                          className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left hover:bg-zinc-50 transition-colors cursor-pointer group"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="w-6 h-6 bg-zinc-100 group-hover:bg-[#ea580c] group-hover:text-white text-zinc-700 font-mono text-xs font-bold flex items-center justify-center shrink-0 transition-colors">
                              {String(index + 1).padStart(2, "0")}
                            </span>
                            <div className="min-w-0">
                              <h2 className="text-sm font-bold text-zinc-900 font-sans group-hover:text-[#ea580c] transition-colors truncate">
                                {item.title}
                              </h2>
                              <div className="flex items-center gap-2 mt-0.5 font-mono text-[10px]">
                                <span className="text-zinc-400">ID: {item.id}</span>
                                <span className="text-zinc-300">•</span>
                                <span className="text-zinc-500">{item.category}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            <span className="hidden sm:inline px-2 py-0.5 bg-orange-50 border border-orange-200 text-[10px] font-mono font-bold text-[#ea580c]">
                              {item.type}
                            </span>
                            <div className="w-7 h-7 flex items-center justify-center border border-zinc-200 bg-white text-zinc-700 group-hover:border-zinc-400">
                              {isExpanded ? (
                                <HiMinus className="text-sm text-[#ea580c]" />
                              ) : (
                                <HiPlus className="text-sm text-zinc-500" />
                              )}
                            </div>
                          </div>
                        </button>

                        {/* Accordion Expanded Body */}
                        {isExpanded && (
                          <div className="px-4 pb-5 pt-2 sm:px-6 sm:pb-6 bg-[#fafafa] border-t border-zinc-100 space-y-4 font-sans text-xs">
                            {/* Prompt / Question */}
                            <div className="space-y-1.5">
                              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-bold block">
                                Prompt / Question Given to Model:
                              </span>
                              <div className="p-3 bg-white border border-[#e4e4e7] font-mono text-xs text-zinc-800 leading-relaxed select-all">
                                {item.question}
                              </div>
                            </div>

                            {/* Verification & Expected Ground Truth */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono">
                              <div className="p-3 bg-white border border-zinc-200 space-y-1">
                                <span className="text-[10px] text-zinc-400 uppercase font-bold block">
                                  Expected Output / Ground Truth
                                </span>
                                <span className="text-zinc-900 font-bold block break-words">
                                  {item.expected}
                                </span>
                              </div>

                              <div className="p-3 bg-emerald-50 border border-emerald-200 space-y-1">
                                <span className="text-[10px] text-emerald-700 uppercase font-bold block">
                                  Verification Mechanism
                                </span>
                                <span className="text-emerald-900 block leading-relaxed">
                                  {item.verification}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 2. JUDGING CRITERIA SECTION */}
            {activeTab === "judging_criteria" && (
              <div className="space-y-6">
                {/* Criteria Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-sans text-xs">
                  {/* Criterion 1: Math & Logic */}
                  <div className="bg-white border border-[#e4e4e7] p-5 space-y-3 shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 bg-orange-50 border border-orange-200 text-[#ea580c] font-mono font-bold text-[10px]">
                        Weight: 30%
                      </span>
                      <span className="font-mono text-zinc-400 text-[10px]">01 / ACCURACY</span>
                    </div>
                    <h3 className="text-sm font-bold text-zinc-950 font-sans">
                      1. Mathematical & Numerical Precision
                    </h3>
                    <p className="text-zinc-600 text-xs leading-relaxed">
                      Evaluates multi-step arithmetic, combinatorics, and modular cycles. Verified with regex numerical parsers requiring exact ground-truth values with zero tolerance for intermediate calculation hallucinations.
                    </p>
                    <div className="pt-2 border-t border-zinc-100 font-mono text-[11px] text-zinc-500">
                      <span>Method: </span>
                      <strong className="text-zinc-800">Deterministic Regex Number Extraction</strong>
                    </div>
                  </div>

                  {/* Criterion 2: Sandboxed Code Execution */}
                  <div className="bg-white border border-[#e4e4e7] p-5 space-y-3 shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 bg-orange-50 border border-orange-200 text-[#ea580c] font-mono font-bold text-[10px]">
                        Weight: 30%
                      </span>
                      <span className="font-mono text-zinc-400 text-[10px]">02 / EXECUTION</span>
                    </div>
                    <h3 className="text-sm font-bold text-zinc-950 font-sans">
                      2. Algorithmic Correctness (Sandboxed VM)
                    </h3>
                    <p className="text-zinc-600 text-xs leading-relaxed">
                      Generated code is executed directly in an isolated Node.js <code className="bg-zinc-100 px-1">vm</code> sandbox against multiple hidden unit tests, mutation tests, and edge cases.
                    </p>
                    <div className="pt-2 border-t border-zinc-100 font-mono text-[11px] text-zinc-500">
                      <span>Method: </span>
                      <strong className="text-zinc-800">Sandboxed Node.js VM Unit Test Runner</strong>
                    </div>
                  </div>

                  {/* Criterion 3: JSON Schema */}
                  <div className="bg-white border border-[#e4e4e7] p-5 space-y-3 shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 bg-orange-50 border border-orange-200 text-[#ea580c] font-mono font-bold text-[10px]">
                        Weight: 20%
                      </span>
                      <span className="font-mono text-zinc-400 text-[10px]">03 / STRUCTURE</span>
                    </div>
                    <h3 className="text-sm font-bold text-zinc-950 font-sans">
                      3. JSON Schema & Key Adherence
                    </h3>
                    <p className="text-zinc-600 text-xs leading-relaxed">
                      Tests structured output capabilities. Validates parseable JSON syntax, exact schema key presence, data types (numbers, booleans, arrays), and lack of hallucinated wrapping text.
                    </p>
                    <div className="pt-2 border-t border-zinc-100 font-mono text-[11px] text-zinc-500">
                      <span>Method: </span>
                      <strong className="text-zinc-800">Strict Schema Parser & Key Validator</strong>
                    </div>
                  </div>

                  {/* Criterion 4: Constraint Following */}
                  <div className="bg-white border border-[#e4e4e7] p-5 space-y-3 shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 bg-orange-50 border border-orange-200 text-[#ea580c] font-mono font-bold text-[10px]">
                        Weight: 20%
                      </span>
                      <span className="font-mono text-zinc-400 text-[10px]">04 / CONSTRAINTS</span>
                    </div>
                    <h3 className="text-sm font-bold text-zinc-950 font-sans">
                      4. Complex Rule & Constraint Compliance
                    </h3>
                    <p className="text-zinc-600 text-xs leading-relaxed">
                      Assesses negative constraints (lipograms avoiding specific letters), exact word count requirements, custom delimiter tokens, and boundary start/end encapsulation.
                    </p>
                    <div className="pt-2 border-t border-zinc-100 font-mono text-[11px] text-zinc-500">
                      <span>Method: </span>
                      <strong className="text-zinc-800">Exact Word & Character Token Matcher</strong>
                    </div>
                  </div>

                  {/* Criterion 5: Inference Latency */}
                  <div className="bg-white border border-[#e4e4e7] p-5 space-y-3 shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-700 font-mono font-bold text-[10px]">
                        Telemetry
                      </span>
                      <span className="font-mono text-zinc-400 text-[10px]">05 / SPEED</span>
                    </div>
                    <h3 className="text-sm font-bold text-zinc-950 font-sans">
                      5. Inference Latency & Velocity
                    </h3>
                    <p className="text-zinc-600 text-xs leading-relaxed">
                      Measures execution duration in milliseconds (<code className="bg-zinc-100 px-1">ms</code>) for each test case to gauge real-time responsiveness and compute efficiency.
                    </p>
                    <div className="pt-2 border-t border-zinc-100 font-mono text-[11px] text-zinc-500">
                      <span>Method: </span>
                      <strong className="text-zinc-800">Precision Microsecond Timer (perf_hooks)</strong>
                    </div>
                  </div>

                  {/* Criterion 6: Global Ranking */}
                  <div className="bg-white border border-[#e4e4e7] p-5 space-y-3 shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-700 font-mono font-bold text-[10px]">
                        Global Rank
                      </span>
                      <span className="font-mono text-zinc-400 text-[10px]">06 / BENCHMARK</span>
                    </div>
                    <h3 className="text-sm font-bold text-zinc-950 font-sans">
                      6. Multi-Criteria LiveBench Rank
                    </h3>
                    <p className="text-zinc-600 text-xs leading-relaxed">
                      Aggregates overall pass rate into a composite score and computes global rank against 44 LiveBench frontier models (GPT-4o, Claude 3.5 Sonnet, Gemini 1.5 Pro).
                    </p>
                    <div className="pt-2 border-t border-zinc-100 font-mono text-[11px] text-zinc-500">
                      <span>Method: </span>
                      <strong className="text-zinc-800">LiveBench Global Frontier Percentile</strong>
                    </div>
                  </div>
                </div>

                {/* Comparison Table: Ground-Truth vs LLM Judge */}
                <div className="bg-white border border-[#e4e4e7] p-6 shadow-xs space-y-3">
                  <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-zinc-900">
                    Why Deterministic Ground-Truth Over "LLM-as-a-Judge"?
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left font-mono text-xs border border-zinc-200">
                      <thead>
                        <tr className="bg-zinc-100 border-b border-zinc-200 text-zinc-700">
                          <th className="p-3">Evaluation Dimension</th>
                          <th className="p-3 text-red-700">Traditional LLM-as-a-Judge</th>
                          <th className="p-3 text-emerald-700">ModelHub Deterministic Engine</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-200 text-zinc-600">
                        <tr>
                          <td className="p-3 font-bold text-zinc-900">Evaluation Bias</td>
                          <td className="p-3 text-red-600">Subjective, self-enhancement bias</td>
                          <td className="p-3 text-emerald-700 font-bold">Zero bias (100% mathematical logic)</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-bold text-zinc-900">Code Verification</td>
                          <td className="p-3 text-red-600">Visual inspection only</td>
                          <td className="p-3 text-emerald-700 font-bold">Sandboxed live VM execution</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-bold text-zinc-900">Schema Validation</td>
                          <td className="p-3 text-red-600">Approximate visual check</td>
                          <td className="p-3 text-emerald-700 font-bold">Strict JSON AST parsing & key validator</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-bold text-zinc-900">Reproducibility</td>
                          <td className="p-3 text-red-600">Varies per run & temperature</td>
                          <td className="p-3 text-emerald-700 font-bold">100% deterministic & repeatable</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* 3. API KEYS SECTION */}
            {activeTab === "api_keys" && (
              <div className="space-y-6">
                {/* Intro Card */}
                <div className="bg-white border border-[#e4e4e7] p-6 shadow-xs space-y-3 font-sans">
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-orange-50 border border-orange-200 text-xs font-mono text-[#ea580c] font-bold">
                    <HiOutlineKey />
                    <span>Security & Provider Integration Guide</span>
                  </div>
                  <h2 className="text-xl font-bold text-zinc-950">
                    API Keys & Remote Model Providers
                  </h2>
                  <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                    ModelHub allows creators to benchmark and evaluate remote models by providing their own API keys for Google Gemini, OpenAI, Groq, and custom API endpoints.
                  </p>
                </div>

                {/* Security Shield Card */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-sans text-xs">
                  <div className="bg-white border border-[#e4e4e7] p-5 space-y-2 shadow-xs">
                    <div className="text-emerald-700 font-bold text-sm flex items-center gap-1.5 font-mono">
                      <HiOutlineShieldCheck className="text-base" />
                      <span>In-Memory Encryption</span>
                    </div>
                    <p className="text-zinc-600 text-xs leading-relaxed">
                      API keys are held ephemerally in RAM only for the duration of test assertion execution and are immediately wiped from memory upon benchmark completion.
                    </p>
                  </div>

                  <div className="bg-white border border-[#e4e4e7] p-5 space-y-2 shadow-xs">
                    <div className="text-emerald-700 font-bold text-sm flex items-center gap-1.5 font-mono">
                      <HiOutlineCheckCircle className="text-base" />
                      <span>Zero-Telemetry Logging</span>
                    </div>
                    <p className="text-zinc-600 text-xs leading-relaxed">
                      Secret strings are sanitized and masked with <code className="bg-zinc-100 px-1 font-mono">redactSecret()</code> filters to prevent any leakage in serverless logs or websocket feeds.
                    </p>
                  </div>

                  <div className="bg-white border border-[#e4e4e7] p-5 space-y-2 shadow-xs">
                    <div className="text-emerald-700 font-bold text-sm flex items-center gap-1.5 font-mono">
                      <HiOutlineCodeBracket className="text-base" />
                      <span>JWT Authenticated</span>
                    </div>
                    <p className="text-zinc-600 text-xs leading-relaxed">
                      All model submissions require a valid logged-in session token (<code className="bg-zinc-100 px-1 font-mono">Bearer &lt;token&gt;</code>) protected against CSRF and replay attacks.
                    </p>
                  </div>
                </div>

                {/* How to Obtain API Keys */}
                <div className="bg-white border border-[#e4e4e7] p-6 shadow-xs space-y-4 font-sans text-xs">
                  <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-zinc-900">
                    Supported Remote Providers & Where to Get Keys
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
                    <div className="p-4 bg-zinc-50 border border-zinc-200 space-y-1.5">
                      <span className="text-zinc-900 font-bold block text-sm">Google Gemini</span>
                      <p className="text-zinc-500 text-[11px] leading-relaxed">
                        Gemini 2.5 Flash, 1.5 Pro, Flash Thinking
                      </p>
                      <a
                        href="https://aistudio.google.com/app/apikey"
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#ea580c] font-bold text-[11px] hover:underline block pt-1"
                      >
                        Get Free Key at Google AI Studio ↗
                      </a>
                    </div>

                    <div className="p-4 bg-zinc-50 border border-zinc-200 space-y-1.5">
                      <span className="text-zinc-900 font-bold block text-sm">Groq Cloud</span>
                      <p className="text-zinc-500 text-[11px] leading-relaxed">
                        Llama 3.3 70B, DeepSeek R1 Distill, Mixtral 8x7B
                      </p>
                      <a
                        href="https://console.groq.com/keys"
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#ea580c] font-bold text-[11px] hover:underline block pt-1"
                      >
                        Get Free Key at Groq Console ↗
                      </a>
                    </div>

                    <div className="p-4 bg-zinc-50 border border-zinc-200 space-y-1.5">
                      <span className="text-zinc-900 font-bold block text-sm">OpenAI Platform</span>
                      <p className="text-zinc-500 text-[11px] leading-relaxed">
                        GPT-4o, GPT-4o-mini, o1, o3-mini
                      </p>
                      <a
                        href="https://platform.openai.com/api-keys"
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#ea580c] font-bold text-[11px] hover:underline block pt-1"
                      >
                        Get Key at OpenAI Platform ↗
                      </a>
                    </div>
                  </div>
                </div>

                {/* API Key Usage Example */}
                <div className="bg-white border border-[#e4e4e7] p-6 shadow-xs space-y-3 font-sans text-xs">
                  <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-zinc-900">
                    Programmatic Benchmark Registration Example
                  </h3>
                  <div className="p-4 bg-zinc-950 text-zinc-300 font-mono text-xs leading-relaxed overflow-x-auto">
                    <pre className="text-emerald-400">{`curl -X POST https://codefury-9-0-eta.vercel.app/api/models/register \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \\
  -d '{
    "modelName": "gemini-2.5-flash",
    "creator": "@vikas",
    "category": "Code",
    "provider": "custom_api",
    "apiProvider": "google",
    "apiKey": "AIzaSyD-YOUR_GEMINI_KEY"
  }'`}</pre>
                  </div>
                </div>
              </div>
            )}

            {/* 4. QUICKSTART GUIDE */}
            {activeTab === "quickstart" && (
              <div className="space-y-6 font-sans">
                <div className="bg-white border border-[#e4e4e7] p-6 shadow-xs space-y-2">
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-orange-50 border border-orange-200 text-xs font-mono text-[#ea580c] font-bold">
                    <HiOutlineCommandLine />
                    <span>Quickstart • Get Started in Under 2 Minutes</span>
                  </div>
                  <h2 className="text-xl font-bold text-zinc-950">Quickstart Tutorial</h2>
                  <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                    Learn how to sign up, connect your model weights or remote API key, launch a benchmark job, and view live rank placements.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="bg-white border border-[#e4e4e7] p-6 shadow-xs space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 bg-black text-white font-mono text-xs font-bold flex items-center justify-center">1</span>
                      <h3 className="font-bold text-sm text-zinc-950">Create an Account with Email OTP</h3>
                    </div>
                    <p className="text-xs text-zinc-600 leading-relaxed ml-9">
                      Visit the <strong>Sign Up</strong> page, fill in your username, email, and password. You will receive a 6-digit numeric OTP code delivered directly to your inbox via SMTP. Enter the code to generate your authenticated session token.
                    </p>
                  </div>

                  <div className="bg-white border border-[#e4e4e7] p-6 shadow-xs space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 bg-black text-white font-mono text-xs font-bold flex items-center justify-center">2</span>
                      <h3 className="font-bold text-sm text-zinc-950">Navigate to the Test Bench</h3>
                    </div>
                    <p className="text-xs text-zinc-600 leading-relaxed ml-9">
                      Click <strong>Test Bench</strong> from the top navigation bar. Select your submission mode: <em>Ollama Local Model Tag</em>, <em>Upload Modelfile / GGUF</em>, or <em>Remote API Key</em> (Google Gemini, Groq, OpenAI).
                    </p>
                  </div>

                  <div className="bg-white border border-[#e4e4e7] p-6 shadow-xs space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 bg-black text-white font-mono text-xs font-bold flex items-center justify-center">3</span>
                      <h3 className="font-bold text-sm text-zinc-950">Launch Automated Benchmark</h3>
                    </div>
                    <p className="text-xs text-zinc-600 leading-relaxed ml-9">
                      Click <strong>Start Automated Benchmark</strong>. You will be redirected to the real-time job monitor where you can watch live assertion tests, category progress meters, latency graphs, and ground-truth validation output.
                    </p>
                  </div>

                  <div className="bg-white border border-[#e4e4e7] p-6 shadow-xs space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 bg-black text-white font-mono text-xs font-bold flex items-center justify-center">4</span>
                      <h3 className="font-bold text-sm text-zinc-950">Compare & Inspect Global Rank</h3>
                    </div>
                    <p className="text-xs text-zinc-600 leading-relaxed ml-9">
                      Once benchmarked, your model automatically populates the <strong>Live Bench Global Leaderboard</strong> with verified scorecards, radar charts, and comparative head-to-head metrics against frontier models.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 5. OLLAMA & MODELFILES */}
            {activeTab === "ollama" && (
              <div className="space-y-6 font-sans">
                <div className="bg-white border border-[#e4e4e7] p-6 shadow-xs space-y-2">
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-orange-50 border border-orange-200 text-xs font-mono text-[#ea580c] font-bold">
                    <HiOutlineCpuChip />
                    <span>Local Quantization & Self-Hosted Weights</span>
                  </div>
                  <h2 className="text-xl font-bold text-zinc-950">Ollama & Modelfile Specifications</h2>
                  <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                    Evaluate your open-source quantized GGUF weights, customized prompt templates, and local Ollama daemon endpoints completely offline.
                  </p>
                </div>

                {/* Modelfile Syntax Guide */}
                <div className="bg-white border border-[#e4e4e7] p-6 shadow-xs space-y-3 font-mono text-xs">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-900 font-sans">
                    Standard Modelfile Syntax Example
                  </h3>
                  <div className="p-4 bg-zinc-950 text-zinc-300 font-mono text-xs leading-relaxed overflow-x-auto">
                    <pre className="text-emerald-400">{`# 1. Base weights from quantized GGUF file
FROM ./qwen2.5-coder-7b-instruct.Q4_K_M.gguf

# 2. System Prompt & Reasoning Guardrails
SYSTEM """You are a high-precision deterministic coding engine. 
Follow instructions exactly and output only pure code/JSON when requested."""

# 3. Model Parameters & Sampling Controls
PARAMETER temperature 0.1
PARAMETER top_p 0.9
PARAMETER stop "<|im_end|>"
PARAMETER stop "<|endoftext|>"`}</pre>
                  </div>
                </div>

                {/* Popular Local Model Recommendations */}
                <div className="bg-white border border-[#e4e4e7] p-6 shadow-xs space-y-4">
                  <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-zinc-900">
                    Recommended Local Ollama Tags for Benchmarking
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
                    <div className="p-3 bg-zinc-50 border border-zinc-200 space-y-1">
                      <strong className="text-zinc-900 block">qwen2.5:3b</strong>
                      <span className="text-zinc-500 text-[11px]">Best-in-class lightweight code generation</span>
                    </div>
                    <div className="p-3 bg-zinc-50 border border-zinc-200 space-y-1">
                      <strong className="text-zinc-900 block">llama3.1:8b</strong>
                      <span className="text-zinc-500 text-[11px]">Frontier general instruction & reasoning</span>
                    </div>
                    <div className="p-3 bg-zinc-50 border border-zinc-200 space-y-1">
                      <strong className="text-zinc-900 block">deepseek-coder:6.7b</strong>
                      <span className="text-zinc-500 text-[11px]">Specialized algorithmic and regex unit testing</span>
                    </div>
                    <div className="p-3 bg-zinc-50 border border-zinc-200 space-y-1">
                      <strong className="text-zinc-900 block">mistral:7b-instruct</strong>
                      <span className="text-zinc-500 text-[11px]">Robust multilingual & schema extraction</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 6. HOW WE MANAGE REQUESTS WITHOUT SUBSCRIPTION */}
            {activeTab === "requests_no_sub" && (
              <div className="space-y-6 font-sans">
                {/* Header Banner */}
                <div className="bg-white border border-[#e4e4e7] p-6 shadow-xs space-y-2">
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-orange-50 border border-orange-200 text-xs font-mono text-[#ea580c] font-bold">
                    <HiOutlineWrenchScrewdriver />
                    <span>Architecture Case Study • Resilient Zero-Cost Infrastructure</span>
                  </div>
                  <h2 className="text-xl font-bold text-zinc-950">
                    How We Manage Requests Without Subscription
                  </h2>
                  <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                    A deep dive into the real-world production errors we encountered (404 console endpoint failures & 429 rate limit spikes) and the engineering solutions implemented to achieve a 100% resilient zero-cost benchmarking pipeline.
                  </p>
                </div>

                {/* ==================== INCIDENT 1: 404 ENDPOINT & CONSOLE TELEMETRY ==================== */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between font-mono text-xs px-1">
                    <span className="font-bold text-zinc-900 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 bg-red-500 rounded-none animate-pulse" />
                      <span>Phase 1 Incident: Terminal Console 404 Errors & Telemetry Drop</span>
                    </span>
                    <span className="text-zinc-400 text-[11px]">Figure 1.0 & 1.1</span>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* 0.png: Live Benchmark Console Error */}
                    <div className="bg-white border border-[#e4e4e7] p-4 shadow-xs space-y-2">
                      <div className="flex items-center justify-between border-b border-zinc-100 pb-2 font-mono text-[11px]">
                        <span className="font-bold text-zinc-800">Benchmark Console Terminal Logs</span>
                        <span className="text-red-600 font-bold">404 Provider Error</span>
                      </div>
                      <div className="overflow-hidden border border-zinc-900 bg-black">
                        <img
                          src="/0.png"
                          alt="Benchmark Terminal Console 404 Error Log"
                          className="w-full h-auto object-contain"
                        />
                      </div>
                      <p className="text-[11px] font-mono text-zinc-500 leading-relaxed">
                        <strong>Figure 1.0:</strong> Live benchmark monitor console logging: <code className="text-red-600 bg-zinc-100 px-1">Provider request failed (404): models/gemini-1.5-flash-latest is not found for API version v1beta</code>.
                      </p>
                    </div>

                    {/* 1.jpeg: API Telemetry Dashboard Error Spike */}
                    <div className="bg-white border border-[#e4e4e7] p-4 shadow-xs space-y-2">
                      <div className="flex items-center justify-between border-b border-zinc-100 pb-2 font-mono text-[11px]">
                        <span className="font-bold text-zinc-800">Aggregate API Telemetry Dashboard</span>
                        <span className="text-red-600 font-bold">Success Rate Drop</span>
                      </div>
                      <div className="overflow-hidden border border-zinc-900 bg-black">
                        <img
                          src="/1.jpeg"
                          alt="API Analytics Dashboard 404 Error Spike"
                          className="w-full h-auto object-contain"
                        />
                      </div>
                      <p className="text-[11px] font-mono text-zinc-500 leading-relaxed">
                        <strong>Figure 1.1:</strong> The resulting aggregate analytics dashboard showing the 404 NotFound error spike and platform success rate dropping to ~40%.
                      </p>
                    </div>
                  </div>
                </div>

                {/* ==================== INCIDENT 2: 429 TOO MANY REQUESTS BURST ==================== */}
                <div className="bg-white border border-[#e4e4e7] p-5 shadow-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-zinc-100 pb-3 font-mono text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 bg-red-500 rounded-none animate-pulse" />
                      <span className="font-bold text-zinc-900">Phase 2 Incident: Gemini API Key 429 TooManyRequests Burst</span>
                    </div>
                    <span className="text-zinc-400 text-[10px]">Figure 2.0</span>
                  </div>

                  <div className="overflow-hidden border border-zinc-900 bg-black max-w-2xl mx-auto">
                    <img
                      src="/2.jpeg"
                      alt="Gemini API Key 429 TooManyRequests Error Spike"
                      className="w-full h-auto object-contain"
                    />
                  </div>

                  <p className="text-xs font-mono text-zinc-500 pt-1 leading-relaxed text-center">
                    <strong>Figure 2.0:</strong> Firing 20 concurrent benchmark assertions simultaneously blasted through Gemini's 15 RPM free quota window, triggering 429 error bursts and driving success rate to 0%.
                  </p>
                </div>

                {/* ==================== HOW WE HANDLED & RESOLVED BOTH INCIDENTS ==================== */}
                <div className="bg-white border border-[#e4e4e7] p-6 shadow-xs space-y-4">
                  <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-zinc-900">
                    How We Systematically Handled & Resolved All Three Failure Modes
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
                    {/* Solution A: Handling Console 404s & Routing (0.png & 1.jpeg) */}
                    <div className="p-4 bg-zinc-50 border border-zinc-200 space-y-2">
                      <div className="flex items-center gap-2 text-emerald-800 font-bold font-mono text-xs">
                        <HiOutlineCheckCircle className="text-base text-emerald-600 shrink-0" />
                        <span>Resolution for 404 Endpoint Errors (0.png & 1.jpeg)</span>
                      </div>
                      <ul className="list-disc list-inside space-y-1.5 text-zinc-600 font-mono text-[11px] leading-relaxed">
                        <li><strong>Canonical Model Alias Normalizer:</strong> Replaced deprecated <code className="bg-zinc-200 px-1 text-zinc-800">-latest</code> endpoint suffixes with dynamic canonical model IDs (<code className="bg-zinc-200 px-1 text-zinc-800">gemini-2.5-flash</code>, <code className="bg-zinc-200 px-1 text-zinc-800">gemini-1.5-flash</code>).</li>
                        <li><strong>Decentralized BYOK Pipeline:</strong> Eliminated single-key quota burnout by allowing users to inject their own API keys directly.</li>
                        <li><strong>Ollama Local Fallback:</strong> Added zero-dependency local compute (<code className="bg-zinc-200 px-1 text-zinc-800">127.0.0.1:11434</code>) for offline execution.</li>
                      </ul>
                    </div>

                    {/* Solution B: Handling 429 TooManyRequests (2.jpeg) */}
                    <div className="p-4 bg-zinc-50 border border-zinc-200 space-y-2">
                      <div className="flex items-center gap-2 text-emerald-800 font-bold font-mono text-xs">
                        <HiOutlineCheckCircle className="text-base text-emerald-600 shrink-0" />
                        <span>Resolution for 429 Rate Limits (2.jpeg)</span>
                      </div>
                      <ul className="list-disc list-inside space-y-1.5 text-zinc-600 font-mono text-[11px] leading-relaxed">
                        <li><strong>Adaptive Micro-Batching & Pacing:</strong> Paced prompt assertions with 800ms–1500ms intervals to stay strictly sub-15 RPM without hitting burst ceilings.</li>
                        <li><strong>Exponential Backoff + Jitter:</strong> Transparent retry interceptors catch 429 responses and wait for token bucket windows to refill.</li>
                        <li><strong>In-Memory VM Grader:</strong> Zero LLM-judge calls—assertions run in 2ms in isolated Node.js VM sandbox, slashing API request volume by &gt;70%.</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* 4 Architectural Pillars Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-sans">
                  <div className="bg-white border border-[#e4e4e7] p-4 space-y-1 shadow-xs">
                    <span className="font-mono text-[10px] text-[#ea580c] font-bold block">Pillar 01</span>
                    <strong className="text-zinc-950 block text-xs">BYOK Free Allowances</strong>
                    <p className="text-zinc-500 text-[11px] leading-relaxed">Distributed per-user quotas with 0 platform fees.</p>
                  </div>
                  <div className="bg-white border border-[#e4e4e7] p-4 space-y-1 shadow-xs">
                    <span className="font-mono text-[10px] text-[#ea580c] font-bold block">Pillar 02</span>
                    <strong className="text-zinc-950 block text-xs">Self-Hosted Ollama</strong>
                    <p className="text-zinc-500 text-[11px] leading-relaxed">100% local GPU execution for zero cloud cost.</p>
                  </div>
                  <div className="bg-white border border-[#e4e4e7] p-4 space-y-1 shadow-xs">
                    <span className="font-mono text-[10px] text-[#ea580c] font-bold block">Pillar 03</span>
                    <strong className="text-zinc-950 block text-xs">Adaptive Pacing & Retries</strong>
                    <p className="text-zinc-500 text-[11px] leading-relaxed">Automatic cooldowns preventing 429 burst rate limits.</p>
                  </div>
                  <div className="bg-white border border-[#e4e4e7] p-4 space-y-1 shadow-xs">
                    <span className="font-mono text-[10px] text-[#ea580c] font-bold block">Pillar 04</span>
                    <strong className="text-zinc-950 block text-xs">Deterministic Sandbox</strong>
                    <p className="text-zinc-500 text-[11px] leading-relaxed">VM-executed unit tests replacing expensive LLM judges.</p>
                  </div>
                </div>
              </div>
            )}

            {/* 7. AGENT MARKETPLACE */}
            {activeTab === "agents" && (
              <div className="space-y-6 font-sans">
                <div className="bg-white border border-[#e4e4e7] p-6 shadow-xs space-y-2">
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-xs font-mono text-emerald-800 font-bold">
                    <HiOutlineSparkles className="text-emerald-600" />
                    <span>Autonomous AI Workflows & Specialized Agents</span>
                  </div>
                  <h2 className="text-xl font-bold text-zinc-950">Agent Marketplace & Custom Requests</h2>
                  <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                    Explore curated, domain-specific AI agents optimized for Code Refactoring, Automated Testing, Security Auditing, and Data Pipelines.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-white border border-[#e4e4e7] p-5 space-y-2 shadow-xs">
                    <span className="font-bold text-zinc-900 text-sm block">1. Discover Agents</span>
                    <p className="text-xs text-zinc-600 leading-relaxed">
                      Browse verified agents categorized by capability, input/output specifications, pricing models, and creator ratings.
                    </p>
                  </div>

                  <div className="bg-white border border-[#e4e4e7] p-5 space-y-2 shadow-xs">
                    <span className="font-bold text-zinc-900 text-sm block">2. Request Custom Pipeline</span>
                    <p className="text-xs text-zinc-600 leading-relaxed">
                      Submit bespoke agent specifications detailing role, required tool capabilities, and target latency directly through the agent submission portal.
                    </p>
                  </div>

                  <div className="bg-white border border-[#e4e4e7] p-5 space-y-2 shadow-xs">
                    <span className="font-bold text-zinc-900 text-sm block">3. One-Click Playground</span>
                    <p className="text-xs text-zinc-600 leading-relaxed">
                      Test any agent in a live interactive sandbox before integrating or deploying it into production environments.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 8. FAQ SECTION */}
            {activeTab === "faq" && (
              <div className="space-y-6 font-sans">
                <div className="bg-white border border-[#e4e4e7] p-6 shadow-xs space-y-2">
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-orange-50 border border-orange-200 text-xs font-mono text-[#ea580c] font-bold">
                    <HiOutlineInformationCircle />
                    <span>Frequently Asked Questions & Troubleshooting</span>
                  </div>
                  <h2 className="text-xl font-bold text-zinc-950">Developer FAQ</h2>
                  <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                    Answers to common questions regarding evaluation methodology, ranking calculations, API security, and local Ollama execution.
                  </p>
                </div>

                <div className="bg-white border border-[#e4e4e7] divide-y divide-[#e4e4e7] shadow-xs">
                  {FAQS.map((faq, index) => {
                    const isOpen = openFaqIndex === index;
                    return (
                      <div key={index} className="transition-colors">
                        <button
                          type="button"
                          onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                          className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left hover:bg-zinc-50 cursor-pointer group"
                        >
                          <h3 className="font-bold text-xs sm:text-sm text-zinc-900 group-hover:text-[#ea580c] transition-colors">
                            {faq.q}
                          </h3>
                          <div className="w-6 h-6 flex items-center justify-center border border-zinc-200 bg-white text-zinc-700 shrink-0">
                            {isOpen ? <HiMinus className="text-xs text-[#ea580c]" /> : <HiPlus className="text-xs text-zinc-500" />}
                          </div>
                        </button>
                        {isOpen && (
                          <div className="px-4 pb-5 pt-1 sm:px-6 sm:pb-6 bg-[#fafafa] border-t border-zinc-100 text-xs text-zinc-700 leading-relaxed">
                            {faq.a}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default DocsPage;
