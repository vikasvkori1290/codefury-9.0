# ⚡ FORGE PLATFORM — COMPLETE PIN-TO-PIN MVP SPECIFICATION & FEATURE DIRECTORY

> **The Transparent AI Marketplace Verified by Ground-Truth Benchmarks.**  
> *Zero LLM Judge Bias • Deterministic Evaluation • Sub-100ms Inference • Creator Monetization*

---

## 📑 TABLE OF CONTENTS
1. [Executive Summary & Core Value Loop](#1-executive-summary--core-value-loop)
2. [Full-Stack Architecture & Technology Matrix](#2-full-stack-architecture--technology-matrix)
3. [Pin-to-Pin Feature Breakdown (By Page & Module)](#3-pin-to-pin-feature-breakdown)
   - [3.1 Main Hero & Marketplace Home (`/`)](#31-main-hero--marketplace-home-)
   - [3.2 Creator Test-Bench Engine (`/test` & `/creator/bench`)](#32-creator-test-bench-engine-test--creatorbench)
   - [3.3 Objective LiveBench Benchmark Suite (20 Deterministic Tests)](#33-objective-livebench-benchmark-suite-20-deterministic-tests)
   - [3.4 LiveBench Public Leaderboard (`/live-bench`)](#34-livebench-public-leaderboard-live-bench)
   - [3.5 AI Models Marketplace & Model Detail (`/models`, `/models/:id`)](#35-ai-models-marketplace--model-detail-models-modelsid)
   - [3.6 Side-by-Side Model Playground (`/playground`)](#36-side-by-side-model-playground-playground)
   - [3.7 Autonomous Agent Marketplace (`/agents`)](#37-autonomous-agent-marketplace-agents)
   - [3.8 Real-Time AI Chatbot Assistant (DeepSeek V4 Flash Vision)](#38-real-time-ai-chatbot-assistant-deepseek-v4-flash-vision)
   - [3.9 Developer Documentation & Judging Criteria (`/docs`)](#39-developer-documentation--judging-criteria-docs)
   - [3.10 Pricing & Subscription Plans (`/pricing` & `/plan`)](#310-pricing--subscription-plans-pricing--plan)
4. [Backend Infrastructure & API Directory](#4-backend-infrastructure--api-directory)
5. [Security, Encryption & Automated Heartbeat Service](#5-security-encryption--automated-heartbeat-service)
6. [File Structure & Component Map](#6-file-structure--component-map)

---

## 1. EXECUTIVE SUMMARY & CORE VALUE LOOP

Forge solves the **"Marketing Claim vs. Real Performance"** trust problem in the AI ecosystem. Instead of relying on subjective LLM-as-a-judge reviews or creator self-reporting, Forge programmatically stress-tests every model against a **20-test ground-truth deterministic benchmark suite inspired by LiveBench.ai**.

### The 3-Step Value Loop:
```
┌─────────────────────────┐      ┌─────────────────────────┐      ┌─────────────────────────┐
│ 1. SUBMIT & CONNECT     │ ───> │ 2. ZERO-BIAS BENCHMARK  │ ───> │ 3. COMPARE & PLAY       │
│ Upload GGUF / Modelfile │      │ 20 Programmatic Tests   │      │ Live Leaderboard,       │
│ or connect Remote API   │      │ Math, VM Code, Schema   │      │ Playground & 1-Click API│
└─────────────────────────┘      └─────────────────────────┘      └─────────────────────────┘
```

---

## 2. FULL-STACK ARCHITECTURE & TECHNOLOGY MATRIX

| Layer | Technologies Used | Purpose |
| :--- | :--- | :--- |
| **Frontend UI** | **React 19, TailwindCSS v4, Vite 8, Lucide & Heroicons, Recharts** | High-performance responsive web client, dark/light contrast styling, glassmorphism, instant HMR. |
| **Routing & State** | **React Router DOM v7, Context API, Axios Interceptors** | Client-side routing, protected auth wrappers, global telemetry and warm-up pings. |
| **Backend API** | **Node.js 20+ (ES Modules), Express.js** | RESTful endpoints, streaming responses, model execution pipelines. |
| **Database** | **MongoDB Atlas + Mongoose ODM** | Model listings, user accounts, benchmark scorecards, telemetry logs. |
| **Execution Sandboxing** | **Node.js `vm` Module, Child Process CLI** | Isolated JavaScript VM execution for algorithmic code verification; local Ollama execution. |
| **Real-Time Inference Engines** | **Groq LPU Engine, Google Gemini API, OpenCode / DeepSeek API, OpenAI API** | Sub-100ms inference for chatbot and benchmark verification. |
| **Security & Cryptography** | **AES-256-CBC, bcrypt.js, JSON Web Tokens (JWT)** | Zero-exposure API key encryption at rest. |

---

## 3. PIN-TO-PIN FEATURE BREAKDOWN

### 3.1 Main Hero & Marketplace Home (`/`)
- **Branded Headline Hierarchy**:
  - Line 1: `The Transparent AI` (Zinc-900 bold display).
  - Line 2: `Marketplace Verified by` with high-contrast `#ea580c` badge.
  - Line 3: `Ground-Truth Benchmarks.` in elegant cursive italic serif (`font-['Instrument_Serif',serif]`).
- **3-Step Micro-Copy Value Loop Cards**:
  - **Step 1: Submit & Connect**: Connect local Ollama, custom GGUF, or remote API endpoint.
  - **Step 2: Zero-Bias Verification**: 20 deterministic tests with 0% LLM judge bias.
  - **Step 3: Compare and Play**: Live latency, pass rates, side-by-side playground, and 1-click cURL/Python deployments.
- **Dynamic Model Feed**: Real-time cards displaying pass rates, latency badges, pricing per 1K tokens, and category tags.

---

### 3.2 Creator Test-Bench Engine (`/test` & `/creator/bench`)
Allows model creators and AI researchers to register and verify models across 3 distinct submission modes:

1. **Local Ollama CLI Mode**:
   - Auto-discovers local models via `ollama list`.
   - Supports popular presets (`qwen2.5:3b`, `llama3.1:8b`, `mistral:7b-instruct`, `phi3.5:mini`).
2. **Modelfile / Quantized GGUF Weights Upload**:
   - Drag & drop interface accepting `.gguf`, `.bin`, or Modelfiles (up to 5GB).
   - Automatically builds Ollama model instances on the fly.
3. **Remote API Endpoint Connection**:
   - **Supported Providers**:
     - **OpenCode / DeepSeek API** (`deepseek-v4-pro`, `deepseek-v4-flash`, `deepseek-chat`, `deepseek-coder`).
     - **Google Gemini** (`gemini-2.0-flash`, `gemini-1.5-flash`, `gemini-1.5-pro`).
     - **OpenAI** (`gpt-4o-mini`, `gpt-4o`, `o3-mini`).
     - **Anthropic Claude** (`claude-3-5-haiku`, `claude-3-5-sonnet`).
     - **Groq Cloud LPU** (`openai/gpt-oss-120b`, `openai/gpt-oss-20b`, `qwen/qwen3.6-27b`).
     - **⚡ Choose Your Own Provider**: Custom REST/vLLM base URL endpoint configuration.
   - **Smart Key Auto-Detection**: Pasting `gsk_...`, `AIza...`, or `sk-...` automatically switches the provider dropdown and default model.
   - **Live Progress Pipeline**: Terminal-style animated progress bar showing live case-by-case execution (`[Case 12/20: Server Security Log Parsing] PASS ✓`).

---

### 3.3 Objective LiveBench Benchmark Suite (20 Deterministic Tests)
Replaces subjective judge grading with 100% programmatic ground truth across 4 categories:

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                    20 DETERMINISTIC GROUND-TRUTH TEST SUITE                     │
├───────────────────────┬─────────────────────────┬───────────────────────────────┤
│ Category              │ Test Count              │ Verification Mechanism        │
├───────────────────────┼─────────────────────────┼───────────────────────────────┤
│ 1. Math & Exact Logic │ 5 GSM8K Problems        │ Strict numerical regex        │
│ 2. Coding & Execution │ 5 JS Algorithms         │ Sandboxed Node `vm` + 3 tests │
│ 3. JSON Schema & Extr │ 5 Unstructured Invoices │ Strict AST schema validation  │
│ 4. Complex Rules      │ 5 Strict Constraints    │ Lipogram ('e'), word counts   │
└───────────────────────┴─────────────────────────┴───────────────────────────────┘
```

#### Detailed Test Catalog:
1. **Math 1 (GSM8K Compound Multi-Step)**: Baker revenue after wholesale & retail sales $\rightarrow$ Expected: `132`.
2. **Math 2 (Factorial Combination Arithmetic)**: $\frac{6!}{(3! \times 2!)} + 7^3$ $\rightarrow$ Expected: `403`.
3. **Math 3 (Modular Exponentiation & Primes)**: $(17^5) \pmod{13}$ $\rightarrow$ Expected: `10`.
4. **Math 4 (Distance-Rate-Time Harmonic Mean)**: Train travel speed comparison $\rightarrow$ Expected: `120`.
5. **Math 5 (Financial Tax & Compounding)**: Compound interest minus tax bracket $\rightarrow$ Expected: `1215`.
6. **Code 1 (Case/Punctuation-Insensitive Palindrome)**: Unit vectors on empty, alphanumeric, and non-alphanumeric strings.
7. **Code 2 (Recursive Deep Object Cloning)**: Validates object mutation isolation.
8. **Code 3 (Array Deduplication with Type Preservation)**: Preserves numbers vs string types.
9. **Code 4 (Two Sum Linear Complexity)**: Returns exact index tuple for target sums.
10. **Code 5 (Balanced Parentheses/Brackets Stack)**: Validates complex bracket nesting.
11. **JSON 1 (Medical Clinical Encounter Parsing)**: Extracts patient, systolic, diastolic, and medications into typed schema.
12. **JSON 2 (Server Security Log Telemetry)**: Parses timestamp, IP, status code, and HTTP verb.
13. **JSON 3 (Hardware Spec Conversion)**: Normalizes CPU cores, RAM GB, and SSD capacity.
14. **JSON 4 (Sentiment & Aspect-Based Opinion)**: Extracts entity sentiments and confidence scores.
15. **JSON 5 (Named Entity Relation Graph)**: Extracts subject-relation-object triples.
16. **Rule 1 (Exact 25-Word Length Constraint)**: Word count validator (must equal exactly 25 words).
17. **Rule 2 (Negative Letter Lipogram - Zero 'e')**: Strict regex ensuring zero instances of letter `e`/`E`.
18. **Rule 3 (Strict Token Delimiters `<<<Color>>>`)**: Requires all color tokens wrapped in triple chevrons.
19. **Rule 4 (Alphabetical Line Sorting)**: Line-by-line alphabetical order verification.
20. **Rule 5 (XML Tag Containment `<summary>...</summary>`)**: Validates opening and closing tag integrity.

---

### 3.4 LiveBench Public Leaderboard (`/live-bench`)
- **44+ Frontier & Creator Model Rankings**: Side-by-side comparison across Google, OpenAI, Anthropic, Meta, DeepSeek, and community creators.
- **Multi-Dimensional Metrics**:
  - **LiveBench Composite Quality Score** ($\%$).
  - **4-Pillar Breakdown Bars**: Math, Code, Schema, Rules.
  - **Latency (TTFT)** in milliseconds.
  - **Throughput (TPS)** tokens per second.
  - **API Price ($)** per 1M tokens.
- **Interactive Radar Chart**: Recharts radar visualization comparing model strengths.
- **Search & Filter**: Real-time filtering by category, creator handle, or minimum pass rate.

---

### 3.5 AI Models Marketplace & Model Detail (`/models`, `/models/:id`)
- **Marketplace Grid**: Searchable model repository with category filters (Code, Reasoning, JSON Extraction, Healthcare, Finance).
- **Model Detail Page**:
  - **Deterministic LiveBench Scorecard Badge**: Displays the verified seal with LiveBench standards.
  - **4 Category Metric Cards**: Shows individual pass rates for Math, Coding, Schema, and Rules.
  - **1-Click Deployment Generator**: Instant code snippets in **cURL**, **Python (requests)**, and **JavaScript (fetch)**.
  - **Try Playground Direct Link**: Loads the model directly into the live sandbox.

---

### 3.6 Side-by-Side Model Playground (`/playground`)
- **Multi-Model Prompt Sandbox**: Compare outputs of 2 or more models simultaneously on the same prompt.
- **Real-Time Telemetry Stopwatch**: Tracks live Time-to-First-Token (TTFT) and total generation time.
- **System Prompt Customization**: Modify system-level instructions per session.
- **Parameter Controls**: Slider adjustments for temperature (0.0 – 1.0) and max token output.

---

### 3.7 Autonomous Agent Marketplace (`/agents`)
- **Pre-Built Copilot Agents**: Catalog of autonomous agents (Code Reviewer, SQL Synthesizer, Invoice Pipeline Agent, API Debugger).
- **Agent Integration Snippets**: Ready-to-use SDK configurations for Node.js and Python.

---

### 3.8 Real-Time AI Chatbot Assistant (DeepSeek V4 Flash Vision)
- **Floating Global Widget**: Always accessible at the bottom-right of every page.
- **Ultra-Fast Sub-100ms Inference**: Powered by **DeepSeek V4 Flash Vision Exp** and Groq LPU engine.
- **Live Dynamic Platform Grounding (RAG Context)**:
  - Injects live MongoDB model listings, creator names, pass rates, and prices directly into context.
  - Understands questions about "this website", "best creator models", "pricing", and "leaderboard ranks".
- **Concise & Direct Tuning**: Formatted for 1–3 short sentences or clean code blocks with zero conversational fluff.
- **1-Click Code Block Copy & Telemetry Badge**: Shows real-time latency (e.g. `280ms • 140 TPS`).

---

### 3.9 Developer Documentation & Judging Criteria (`/docs`)
- **LiveBench Architecture Breakdown**: Explains the 20-test methodology and mathematical scoring.
- **Judging Criteria & Rubric**: Outlines how pass rates, speed, and cost efficiency are weighted.
- **Question Bank Directory**: Public view of sample benchmark evaluation vectors.

---

### 3.10 Pricing & Subscription Plans (`/pricing` & `/plan`)
- **Tiered Model**:
  - **Free Developer Tier**: Unlimited playground exploration, public leaderboard access, standard chatbot.
  - **Creator Pro**: Automated model benchmarking, verified scorecards, API monetization.
  - **Enterprise**: Custom benchmark suites, dedicated private vLLM endpoints, SLA guarantees.

---

## 4. BACKEND INFRASTRUCTURE & API DIRECTORY

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/models/register` | Public / Auth | Registers a model (Ollama / GGUF / API) and triggers benchmark job. |
| `GET` | `/api/models` | Public | Fetches all approved marketplace models and benchmark scores. |
| `GET` | `/api/models/:id` | Public | Fetches single model details and 4-pillar scorecard. |
| `POST` | `/api/benchmark` | Protected | Runs parallel multi-model benchmarking. |
| `GET` | `/api/benchmark/status/:jobId`| Protected | Polls live benchmark execution status, logs, and progress. |
| `POST` | `/api/chat` | Public / Auth | Real-time chat inference (DeepSeek V4 Flash / Groq / Gemini). |
| `POST` | `/api/deployments` | Protected | Creates a 1-click model API key and deployment instance. |
| `POST` | `/api/auth/register` | Public | Registers a new creator/developer account. |
| `POST` | `/api/auth/login` | Public | Authenticates user and returns JWT token. |
| `GET` | `/api/auth/me` | Protected | Returns current authenticated user profile. |
| `GET` | `/api/health` | Public | Healthcheck and heartbeat self-ping endpoint. |

---

## 5. SECURITY, ENCRYPTION & AUTOMATED HEARTBEAT SERVICE

### 1. API Secret Key Security:
- All creator API keys are encrypted at rest using **AES-256-CBC** before saving to MongoDB.
- Mongoose schema fields use `select: false` so secret keys are never leaked to client responses or telemetry logs.

### 2. Automated 8-Minute Backend Heartbeat:
- Both `client/src/App.jsx` and `server/services/selfPing.service.js` run an automated 8-minute activity pulse:
  - Sends a ping to `/api/health`.
  - Verifies the MongoDB connection pool is active.
  - Keeps serverless functions warm and prevents cold-start delays.

### 3. Temporary Authentication Bypass & Restoration:
- Auth guards are currently set to a frictionless developer session for testing.
- Complete step-by-step restoration instructions with exact diff snippets are documented in [`AUTH_RESTORATION_GUIDE.md`](file:///c:/devoloper/codefury%209.0/AUTH_RESTORATION_GUIDE.md).

---

## 6. FILE STRUCTURE & COMPONENT MAP

```
codefury 9.0/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── bench/
│   │   │   │   └── CreatorModelSubmitForm.jsx   # 3-mode submission & key auto-detection
│   │   │   ├── chat/
│   │   │   │   └── ChatbotWidget.jsx            # Dedicated DeepSeek V4 Flash assistant
│   │   │   ├── Navbar.jsx                       # Navigation & live status indicators
│   │   │   ├── Footer.jsx                       # Footer links & copyright
│   │   │   └── ProtectedRoute.jsx               # Route guard
│   │   ├── pages/
│   │   │   ├── Home.jsx                         # Landing page with 3-step value loop
│   │   │   ├── LiveBenchPage.jsx                # 44-model public leaderboard
│   │   │   ├── ModelMarketplacePage.jsx         # Models marketplace
│   │   │   ├── ModelDetailPage.jsx              # Model scorecard & 1-click deploy
│   │   │   ├── PlaygroundPage.jsx               # Side-by-side prompt sandbox
│   │   │   ├── AgentsPage.jsx                   # Agent marketplace
│   │   │   ├── TestPage.jsx / CreatorBenchPage  # Creator evaluation engine
│   │   │   └── DocsPage.jsx                     # Architecture & question bank
│   │   ├── App.jsx                              # Global router & chatbot mount
│   │   └── main.jsx
├── server/
│   ├── controllers/
│   │   ├── chat.controller.js                   # Grounded DeepSeek/Groq real-time chat
│   │   ├── model.controller.js                  # Model registration & job dispatcher
│   │   ├── benchmark.controller.js              # Multi-model benchmarking
│   │   └── auth.controller.js                   # JWT auth & user sessions
│   ├── services/
│   │   ├── promptfooConfig.js                   # 20-test deterministic LiveBench suite
│   │   ├── registeredModel.service.js           # Live API model execution runner
│   │   ├── credential.service.js                # AES-256 encryption/decryption
│   │   ├── selfPing.service.js                  # 8-minute keepalive heartbeat
│   │   └── jobStore.js                          # In-memory/JSON fallback datastore
│   ├── workers/
│   │   └── benchmarkWorker.js                   # Live evaluation engine & Sandboxed VM
│   ├── models/
│   │   ├── ModelListing.model.js                # Model catalog schema
│   │   ├── BenchmarkJob.model.js                # Benchmark scorecard schema
│   │   └── User.model.js                        # User profile schema
│   └── server.js                                # Express bootstrap & DB connection
├── AUTH_RESTORATION_GUIDE.md                    # Exact guide to re-enable strict JWT auth
└── FORGE_MVP_PLATFORM_DETAILS.md                # Complete pin-to-pin specifications
```

---

*Verified and staged locally for Forge MVP 1.0.* 🚀
