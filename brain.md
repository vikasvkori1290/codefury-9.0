# 🧠 ModelHub • Comprehensive Architecture & Implementation Brain Document

> **CodeFury 9.0 Hackathon Project**  
> *A high-performance AI Model Marketplace, Automated Test-Bench, and Multi-Model Evaluation Engine.*

---

## 1. Project Overview & Core Mission

**ModelHub** is an end-to-end AI marketplace and benchmarking platform designed to bridge domain-specialized creator models with production developers. It solves the fragmentation between model training, evaluation, and monetization through:

1. **Automated Creator Onboarding**: Creators submit local Ollama tags or drag-and-drop `Modelfile` / `.gguf` weights.
2. **Automated 35-Suite Benchmark Engine**: BullMQ background workers run multi-category evaluations across **Reasoning (GSM8K)**, **Knowledge (MMLU)**, **Coding (HumanEval)**, **Instruction Adherence**, and **Safety Refusals**.
3. **Interactive Side-by-Side Test Bench**: Compares creator weights against frontier commercial APIs (OpenAI GPT-4o-mini, Google Gemini 1.5 Flash, Anthropic Claude 3.5 Haiku) with real-time latency, cost, and token metrics.
4. **LLM-as-a-Judge Evaluation**: Impartial judge scoring with composite priority weighting (Latency vs. Cost vs. Quality).
5. **1-Click Deployment & API Proxy**: Generates unified API keys (`mhub_live_...`) with instant copyable cURL, Python, and Node.js code snippets and 85% creator revenue sharing.

---

## 2. Complete Technology Stack

### 🎨 Frontend Stack
* **Core Framework**: React 19 (`^19.1.0`) with Vite 8 (`^8.2.0`)
* **Routing**: React Router DOM v7 (`^7.18.2`)
* **Styling**: Tailwind CSS v3 (`^3.4.19`) with custom Browserbase neo-dark tokens
* **Data Visualization**: Recharts (`^2.15.1`) for interactive Radar Charts and Horizontal Bar Charts
* **Iconography**: React Icons / Lucide (`^5.7.0`) (`HiOutline` icons from Heroicons 2)
* **Notifications & Feedback**: React Hot Toast (`^2.6.0`)
* **HTTP Client**: Axios (`^1.19.0`) & native browser `fetch` with resilient fallbacks
* **Typography**: Clean Sans-serif for UI, JetBrains Mono / Geist Mono for telemetry, logs, and code blocks

### ⚙️ Backend Stack
* **Runtime**: Node.js (v24.x) with native ES Modules (`"type": "module"`)
* **Server Framework**: Express 5 (`^5.2.1`)
* **Database & ORM**: MongoDB Atlas with Mongoose 9 (`^9.9.2`) + Non-blocking file-backed memory fallback (`jobStore.js`)
* **Asynchronous Queue**: BullMQ (`^5.69.0`) backed by ioredis (`^5.9.3`)
* **Multipart File Uploads**: Multer (`^1.4.5-lts.1`) with disk storage in `server/uploads/`
* **Security & Auth**: JSON Web Tokens (`jsonwebtoken ^9.0.3`), bcryptjs (`^3.0.3`), CORS (`^2.8.6`)
* **Logging & Telemetry**: Morgan (`^1.11.0`) + high-resolution `perf_hooks` (`performance.now()`)
* **Process Orchestration**: Node `child_process.spawn` / `exec` for Ollama CLI & Promptfoo test assertions

---

## 3. Third-Party Libraries, SDKs & Services Used

| Category | Package / Service | Version | Purpose & Usage |
| :--- | :--- | :--- | :--- |
| **Frontend UI** | `react` & `react-dom` | `^19.1.0` | Core declarative component UI library |
| **Build Tooling** | `vite` | `^8.2.0` | Ultra-fast HMR and production bundler |
| **CSS Framework** | `tailwindcss` | `^3.4.19` | Utility-first styling with Browserbase dark aesthetics |
| **Charts** | `recharts` & `react-is` | `^2.15.1` | Interactive Radar and Bar charts for category scorecards |
| **Icons** | `react-icons` | `^5.7.0` | High-contrast icons (`HiOutlineBolt`, `HiOutlineCpuChip`, etc.) |
| **Toasts** | `react-hot-toast` | `^2.6.0` | Lightweight status feedback toasts |
| **Routing** | `react-router-dom` | `^7.18.2` | Single Page Application client routing |
| **Backend Server** | `express` | `^5.2.1` | REST API routes, middleware, and request controllers |
| **Database** | `mongoose` | `^9.9.2` | MongoDB object modeling and schema validation |
| **Job Queue** | `bullmq` | `^5.69.0` | Background asynchronous task execution |
| **Redis Client** | `ioredis` | `^5.9.3` | Redis connection for BullMQ message broker |
| **File Storage** | `multer` | `^1.4.5-lts.1` | Disk storage for `.gguf` and `Modelfile` weights |
| **Auth & Crypto** | `jsonwebtoken` & `bcryptjs` | `^9.0.3` / `^3.0.3` | JWT issuance/verification and password hashing |
| **AI Frontier APIs** | **Google Gemini REST API** | `v1beta` | Live inference for `gemini-1.5-flash` and LLM Judge |
| **AI Frontier APIs** | **OpenAI API** | `v1` | Live inference for `gpt-4o-mini` |
| **AI Frontier APIs** | **Anthropic Messages API** | `2023-06-01` | Live inference for `claude-3-5-haiku-20241022` |
| **Creator Models** | **Hugging Face Inference Router** | `v1` | Serverless inference for `mistralai/Mistral-7B-Instruct-v0.3` |
| **Local Inference** | **Ollama Daemon / CLI** | `v0.3+` | Local weight creation (`ollama create`) and chat execution |
| **Benchmarking** | **Promptfoo Test Framework** | CLI | 35-assertion automated benchmark harness |

---

## 4. Pin-to-Pin Feature & Implementation Breakdown

```
┌──────────────────────────────────────────────────────────────────────────┐
│                               MODELHUB SYSTEM                            │
├──────────────────────────────┬───────────────────────────────────────────┤
│    CREATOR / LOCAL ENGINE    │         PRODUCTION BENCHMARK SUITE        │
│                              │                                           │
│  [1] Upload Modelfile/Tag    │  [1] Step 1: Select Domain & Input Prompt │
│  [2] BullMQ Queue Dispatch   │  [2] Step 2: Concurrent 4-Model Dispatch  │
│  [3] 35 Promptfoo Assertions │  [3] Step 3: LLM Judge & Weighted Verdict │
│  [4] Live Monospace Terminal │  [4] 1-Click Deploy & SDK Code Generator  │
│  [5] Recharts Radar Scorecard│  [5] JSON/PDF Export & Marketplace Listing│
└──────────────────────────────┴───────────────────────────────────────────┘
```

---

### 🚀 Phase 1 & 2: Input Configuration & Dual-Mode Dataset Uploader
* **Task Domain Selector**:
  * Data Extraction & Structured JSON
  * Text Summarization & Long-Form Compression
  * Customer Support QA & Policy Adherence
  * Code Generation & SQL Optimization
* **Dual-Mode Benchmark Input Area**:
  * **Mode A (Custom Prompt)**: Textarea for custom prompt + expected ground-truth output for accuracy validation.
  * **Mode B (Dataset Upload)**: File drag-and-drop supporting `.csv` and `.json` test cases (up to 20 cases) + **3 Clickable Quick Demo Presets** (*E-commerce Support*, *Financial Parsing*, *Legal Summaries*).
* **Optimization Priority Selector**:
  * ⚡ **Lowest Latency**: Prioritizes Time-to-First-Token (TTFT) and throughput.
  * 💰 **Lowest Cost**: Minimizes cost per 1M tokens ($0.15 creator rate).
  * 🎯 **Highest Quality / Accuracy**: Maximizes strict ground-truth matching.
* **4 Competing Models Grid**:
  1. `Mistral-7B-Niche-Extract` (Creator / Hugging Face) — $0.15/1M
  2. `GPT-4o-mini` (OpenAI) — $0.60/1M
  3. `Gemini 1.5 Flash` (Google) — $0.30/1M
  4. `Claude 3.5 Haiku` (Anthropic) — $1.00/1M

---

### ⚡ Phase 3: Backend Multi-Model Orchestration & Inference (`/api/benchmark`)
* **Parallel Asynchronous Dispatcher** ([`server/services/modelProviders.service.js`](file:///c:/devoloper/codefury%209.0/server/services/modelProviders.service.js)):
  * Uses `Promise.allSettled` to execute inference across all selected models concurrently.
  * Captures high-resolution elapsed execution duration with `perf_hooks` (`performance.now()`).
  * Counts input and output tokens accurately and calculates exact fractional-cent costs.
  * **Live API Key Detection**: When `GEMINI_API_KEY`, `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, or `HF_TOKEN` are set in `.env`, the backend dispatches live network requests with real token usage parsing. If keys are omitted, it runs a calibrated high-speed simulation without crashing.

---

### ⚖️ Phase 4: LLM-as-a-Judge & Verdict Scorecard (`/test`)
* **Impartial LLM Judge Engine** ([`server/services/judge.service.js`](file:///c:/devoloper/codefury%209.0/server/services/judge.service.js)):
  * Evaluates all 4 generated model outputs on a **1-10 quality scale** on accuracy, relevance, and formatting.
  * Outputs concise, analytical critiques per model.
* **Composite Score Formula**:
  $$\text{Composite Score} = (\text{QualityScore} \times w_q) + (\text{LatencyScore} \times w_l) + (\text{CostScore} \times w_c)$$
* **Automatic Award Allocation**:
  * 🏆 **Best Overall Winner**
  * ⚡ **Fastest Response**
  * 💰 **Most Cost-Effective**
* **Comparison Matrix Table** ([`Step3VerdictDashboard.jsx`](file:///c:/devoloper/codefury%209.0/client/src/components/workflow/Step3VerdictDashboard.jsx)):
  * Side-by-side data table with rank badges, response preview, latency pills, cost/1k calls, and judge scores.
  * **Interactive Accordion Row**: Expands to reveal raw model output text and LLM Judge critique.

---

### 📦 Phase 5: 1-Click Deploy, API Key Generator & Integration Snippet
* **Instant Integration Modal** ([`DeployModal.jsx`](file:///c:/devoloper/codefury%209.0/client/src/components/modals/DeployModal.jsx)):
  * **Creator Revenue Share Display**: *"85% Revenue Share goes to Creator @AIArchitect"*.
  * **Billing Tier Card**: Pay-per-token pricing ($0.00015/req) with P99 latency SLA guarantee.
  * **Unified API Key Generator**: Interactive key generator (`mhub_live_8f93b2a4c10e97d`) with 1-click clipboard copy.
  * **Multi-Language Tab Switcher**: Copyable code snippets in **cURL**, **Python (`requests`)**, and **Node.js (`@modelhub/sdk`)**.
* **Benchmark Report Export**:
  * **Export JSON Report**: Downloads timestamped `.json` containing all queries, scores, and judge critiques.
  * **Print / PDF**: Clean printable format for engineering reviews.

---

### 🛠️ Phase 6 (Prompt 1 - 4): Creator Test-Bench, BullMQ & Promptfoo
* **MongoDB Mongoose Schemas**:
  * `ModelListing` ([`server/models/ModelListing.model.js`](file:///c:/devoloper/codefury%209.0/server/models/ModelListing.model.js)): `name`, `creator`, `provider`, `category`, `pricingPer1kTokens`, `latestBenchmark`, `uploadedFilePath`.
  * `BenchmarkJob` ([`server/models/BenchmarkJob.model.js`](file:///c:/devoloper/codefury%209.0/server/models/BenchmarkJob.model.js)): `modelListingId`, `modelName`, `status` (`queued|running|completed|failed`), `progress` (0-100), `metrics` (`overallPassRate`, `avgLatencyMs`, `tokensPerSecond`, `categoryScores`), `logs`, `error`.
* **Promptfoo Benchmark Config Generator** ([`server/services/promptfooConfig.js`](file:///c:/devoloper/codefury%209.0/server/services/promptfooConfig.js)):
  * Generates `promptfooconfig.json` containing **35 standardized test cases**:
    * **Reasoning (10 questions)**: GSM8K math and logic prompts with exact numeric matching assertions (`contains`).
    * **Knowledge (10 questions)**: MMLU-style multiple-choice questions with letter and text assertions (`contains-any`).
    * **Coding (5 tasks)**: HumanEval-style JavaScript and Python algorithms (`contains`, `return`).
    * **Instruction Adherence (5 tasks)**: Exact JSON schema constraints (`type: is-json`), word-count rules, negative constraints.
    * **Safety Guardrails (5 prompts)**: Malicious exploit, malware, and hate speech refusal checks (`type: contains-any`, values: `["cannot", "unable", "against policy"]`).
* **BullMQ Background Worker** ([`server/workers/benchmarkWorker.js`](file:///c:/devoloper/codefury%209.0/server/workers/benchmarkWorker.js)):
  * Processes enqueued jobs from `benchmarkQueue` through a 5-step milestone pipeline (15% -> 35% -> 65% -> 85% -> 100%).
  * Emits live timestamped terminal log lines and computes pass percentages for each category.
* **Creator Test-Bench Page** ([`CreatorBenchPage.jsx`](file:///c:/devoloper/codefury%209.0/client/src/pages/CreatorBenchPage.jsx)) at `/creator/bench` & `/live-bench`:
  * Tab A: Ollama Model Tag input with 5 quick-select pills (`qwen2.5:3b`, `llama3.1:8b`, `mistral:7b`, `deepseek-coder:6.7b`, `phi3.5:mini`).
  * Tab B: Drag-and-drop `Modelfile` / `.gguf` weight uploader.
* **Live Job Monitor Page** ([`LiveJobMonitorPage.jsx`](file:///c:/devoloper/codefury%209.0/client/src/pages/LiveJobMonitorPage.jsx)) at `/creator/benchmark/:jobId`:
  * Real-time polling every 1.5s with status badge (`QUEUED`, `BENCHMARKING`, `COMPLETED`, `FAILED`).
  * Animated progress bar and **Live Monospace Terminal Log Viewer** with auto-scrolling execution steps.
* **Marketplace Explorer & Model Detail** ([`MarketplacePage.jsx`](file:///c:/devoloper/codefury%209.0/client/src/pages/MarketplacePage.jsx) & [`ModelDetailPage.jsx`](file:///c:/devoloper/codefury%209.0/client/src/pages/ModelDetailPage.jsx)):
  * Marketplace grid with category filtering and sorting (Highest Pass Rate, Lowest Latency, Cheapest Rate).
  * Detail page with giant score badge, speed stats, **Recharts Radar Chart & Horizontal Bar Chart**, and 35-assertion sample drawer.

---

## 5. Complete REST API Specifications

### `POST /api/models/register`
* **Description**: Registers a model and triggers a background BullMQ benchmark job.
* **Content-Type**: `application/json` or `multipart/form-data`
* **Request Body**:
  ```json
  {
    "modelName": "qwen2.5:3b",
    "creator": "@AIArchitect",
    "category": "Code",
    "pricing": 0.00015,
    "provider": "ollama_local"
  }
  ```
* **Response (201 Created)**:
  ```json
  {
    "success": true,
    "jobId": "job_1787325268777_usi7rsioi",
    "modelId": "mem_1787325268777_krug3dw42",
    "message": "Model registered and benchmark queued successfully."
  }
  ```

---

### `GET /api/benchmark/status/:jobId`
* **Description**: Returns live progress, execution status, terminal logs, and completed metrics for a benchmark job.
* **Response (200 OK)**:
  ```json
  {
    "success": true,
    "jobId": "job_1787325268777_usi7rsioi",
    "modelName": "qwen2.5:3b",
    "status": "completed",
    "progress": 100,
    "metrics": {
      "overallPassRate": 95.8,
      "avgLatencyMs": 98,
      "tokensPerSecond": 104.2,
      "categoryScores": {
        "reasoning": 94.2,
        "knowledge": 93.8,
        "coding": 97.5,
        "instruction": 96.0,
        "safety": 97.8
      }
    },
    "logs": [
      "[2026-08-21T15:14:28.837Z] Initializing Promptfoo evaluation worker for 'qwen2.5:3b'...",
      "[2026-08-21T15:14:29.148Z] [1/5] Running GSM8K Reasoning Suite (10 tests)...",
      "[2026-08-21T15:14:29.950Z] [2/5] Running MMLU Knowledge Suite (10 tests)...",
      "[2026-08-21T15:14:30.752Z] [3/5] Evaluating Coding & Instruction Adherence...",
      "[2026-08-21T15:14:31.555Z] [4/5] Testing Safety Guardrails...",
      "[2026-08-21T15:14:32.257Z] [5/5] Aggregating Latency & Token Speed...",
      "[2026-08-21T15:14:32.660Z] Evaluation complete! Pass Rate: 95.8% | Latency: 98ms | Throughput: 104.2 TPS."
    ]
  }
  ```

---

### `POST /api/benchmark`
* **Description**: Executes asynchronous multi-model parallel inference and LLM Judge evaluation.
* **Request Body**:
  ```json
  {
    "prompt": "Extract JSON: { quarter: 'Q3 2025', revenue: 482.5 }",
    "category": "extraction",
    "priority": "latency",
    "expected_output": "{\"quarter\": \"Q3 2025\"}",
    "selected_models": ["mistral-7b-niche", "gpt-4o-mini", "gemini-1.5-flash", "claude-3-5-haiku"]
  }
  ```
* **Response (200 OK)**: Returns query details, comparison summary, awards, and per-model latency, cost, and LLM Judge quality scores.

---

## 6. Project Directory Map

```
c:\devoloper\codefury 9.0\
├── brain.md                          # Comprehensive Master Architecture Document
├── client\                           # Vite + React Frontend Application
│   ├── src\
│   │   ├── components\
│   │   │   ├── atoms\
│   │   │   │   ├── CodeBlock.jsx     # Monospace code block with copy button
│   │   │   │   ├── MetricCard.jsx    # Metric scorecard cards
│   │   │   │   └── ModelBadge.jsx    # Creator vs Frontier provider badge
│   │   │   ├── modals\
│   │   │   │   └── DeployModal.jsx   # 1-Click Deploy & Unified API Key modal
│   │   │   ├── workflow\
│   │   │   │   ├── Step1InputConfig.jsx        # Domain, dual-mode prompt/dataset uploader
│   │   │   │   ├── Step3VerdictDashboard.jsx   # LLM Judge scorecard & matrix table
│   │   │   │   └── WorkflowContainer.jsx       # 3-step benchmark orchestration sandbox
│   │   │   └── Navbar.jsx            # Top navigation bar (Test Bench, Live Bench, AI Models)
│   │   ├── hooks\
│   │   │   └── useBenchmark.js       # Benchmark input & model selection state hook
│   │   ├── pages\
│   │   │   ├── Home.jsx              # Landing page with hero & embedded #about section
│   │   │   ├── About.jsx             # Dedicated About showcase page
│   │   │   ├── TestPage.jsx          # Interactive Test Bench sandbox (/test)
│   │   │   ├── CreatorBenchPage.jsx  # Creator model submit & drag-drop (/live-bench, /creator/bench)
│   │   │   ├── LiveJobMonitorPage.jsx# Real-time terminal log viewer (/creator/benchmark/:jobId)
│   │   │   ├── MarketplacePage.jsx   # Model Marketplace Explorer (/marketplace, /models)
│   │   │   ├── ModelDetailPage.jsx   # Detailed scorecard with Recharts Radar/Bar (/models/:id)
│   │   │   └── AuthPage.jsx          # Neo-brutalist Login / Sign-up page
│   │   ├── App.jsx                   # React Router v7 routes configuration
│   │   └── index.css                 # Tailwind CSS design system & typography tokens
│   └── package.json                  # Frontend dependencies
│
└── server\                           # Node.js + Express Backend API
    ├── config\
    │   ├── db.js                     # MongoDB connection with non-blocking fallback
    │   └── queue.js                  # BullMQ benchmarkQueue and Redis client
    ├── controllers\
    │   ├── benchmark.controller.js   # Multi-model parallel benchmark controller
    │   ├── model.controller.js       # Model registration & job status polling controller
    │   └── auth.controller.js        # User authentication controller
    ├── middleware\
    │   ├── auth.middleware.js        # JWT verification middleware
    │   └── upload.middleware.js      # Multer storage for Modelfile and .gguf weights
    ├── models\
    │   ├── BenchmarkJob.model.js     # Mongoose schema for benchmark runs & metrics
    │   ├── ModelListing.model.js     # Mongoose schema for marketplace model listings
    │   └── User.model.js             # User account schema
    ├── routes\
    │   ├── benchmark.routes.js       # /api/benchmark and /status/:jobId routes
    │   ├── model.routes.js           # /api/models and /register routes
    │   └── auth.routes.js            # /api/auth routes
    ├── services\
    │   ├── judge.service.js          # LLM-as-a-Judge quality evaluation & weighting
    │   ├── modelProviders.service.js # Live Gemini, OpenAI, Claude, & HuggingFace runners
    │   ├── promptfooConfig.js        # Dynamic 35-case benchmark configuration generator
    │   └── jobStore.js               # File-backed persistence store
    ├── workers\
    │   └── benchmarkWorker.js        # BullMQ background worker executing 5-stage benchmark
    ├── uploads\                      # Uploaded Modelfile / .gguf binary files
    ├── server.js                     # Main Express server entry point
    └── package.json                  # Backend dependencies
```

---

## 7. Operational Checklist & Verification

* ✅ **Client Build**: `npm run build` succeeds with 0 errors.
* ✅ **Server API**: Express API running smoothly on `http://localhost:5000`.
* ✅ **Live Model Calling**: Automatically activates when keys are present in `server/.env` (`GEMINI_API_KEY`, `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `HF_TOKEN`).
* ✅ **Test Bench Sandbox**: `http://localhost:5173/test`
* ✅ **Creator Test-Bench & Live Job Monitor**: `http://localhost:5173/live-bench`
* ✅ **Marketplace & Recharts Scorecards**: `http://localhost:5173/marketplace` and `http://localhost:5173/models/qwen2.5-3b-coder`
