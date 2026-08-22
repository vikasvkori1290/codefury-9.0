import React from "react";
import { Link } from "react-router-dom";
import {
  HiOutlineArrowRight,
  HiOutlineCommandLine,
  HiOutlineSparkles,
  HiOutlineShieldCheck,
  HiOutlineBolt,
  HiOutlineKey,
  HiOutlineCpuChip,
  HiOutlineScale,
} from "react-icons/hi2";

const ArtFrame = ({ children, shadow = "#ea580c" }) => (
  <div
    className="relative min-h-[360px] overflow-hidden border border-[#cbd5e1] bg-[#e9f0fa] p-5 sm:p-8"
    style={{
      backgroundImage: "radial-gradient(#9db1c8 1.2px, transparent 1.2px)",
      backgroundSize: "14px 14px",
    }}
  >
    <div className="relative flex h-full min-h-[300px] items-center justify-center bg-white/10">
      <div
        className="w-full bg-white border border-[#cbd5e1] p-5 shadow-[8px_8px_0_var(--art-shadow)]"
        style={{ "--art-shadow": shadow }}
      >
        {children}
      </div>
    </div>
  </div>
);

const Home = () => (
  <main className="modelhub-texture text-zinc-950 font-sans selection:bg-[#ea580c] selection:text-white">
    {/* ==================== 1. MAIN HERO SECTION ==================== */}
    <section
      id="about"
      className="relative overflow-hidden border-b border-[#cbd5e1] min-h-[640px] flex flex-col items-center text-center px-4 pt-20 sm:pt-28 pb-16"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-[#e6f0fb]/95 via-[#e6f0fb]/55 to-transparent pointer-events-none" />
      <div className="relative z-10 max-w-4xl space-y-7">
        <span className="inline-flex items-center gap-2 bg-white/80 border border-[#cbd5e1] px-3.5 py-1.5 text-[11px] font-mono uppercase tracking-wider text-zinc-800 shadow-xs select-none">
          <HiOutlineSparkles className="text-[#ea580c]" /> Forge • Ground-Truth AI Platform
        </span>

        {/* Primary Headline */}
        <div className="space-y-3 sm:space-y-4 max-w-4xl mx-auto select-none">
          <h1 className="text-4xl sm:text-6xl lg:text-[72px] font-extrabold tracking-[-0.04em] leading-[1.12] text-zinc-950">
            <span>The Transparent AI</span>
            <span className="block mt-2 sm:mt-3 bg-[#ea580c] text-white px-4 sm:px-6 py-1 sm:py-2 tracking-[-0.03em] shadow-xs w-fit mx-auto">
              Marketplace Verified by
            </span>
          </h1>
          <p className="text-3xl sm:text-4xl lg:text-5xl font-['Instrument_Serif',serif] italic font-normal text-zinc-900 tracking-wide">
            Ground-Truth Benchmarks.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
          <Link
            to="/live-bench"
            className="inline-flex items-center justify-center gap-2 border border-zinc-900 bg-black px-6 py-3 text-sm font-bold text-white hover:bg-[#ea580c] transition-all cursor-pointer shadow-xs"
          >
            Explore Live Benchmarks <HiOutlineArrowRight />
          </Link>
          <Link
            to="/creator/benchmark"
            className="inline-flex items-center justify-center gap-2 border border-[#cbd5e1] bg-white px-6 py-3 text-sm font-bold text-zinc-900 hover:bg-zinc-100 transition-all cursor-pointer shadow-xs"
          >
            <HiOutlineCommandLine className="text-[#ea580c]" /> Submit & Benchmark Model
          </Link>
        </div>
      </div>
    </section>

    {/* ==================== 2. HOW IT WORKS (3-STEP VALUE LOOP) ==================== */}
    <section className="border-b border-[#cbd5e1] bg-white px-4 sm:px-8 py-16 sm:py-20">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#ea580c]">
            // 3-STEP VALUE LOOP
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-950">
            How Forge Works
          </h2>
          <p className="text-sm text-zinc-600 font-sans">
            A continuous loop connecting model creators, objective deterministic verification, and 1-click deployments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
          {/* Step 1 */}
          <div className="p-6 bg-[#fafafa] border border-[#e4e4e7] space-y-3 shadow-xs relative group hover:border-zinc-400 transition-all">
            <div className="flex items-center justify-between">
              <span className="w-8 h-8 bg-black text-white font-mono text-xs font-bold flex items-center justify-center">
                01
              </span>
              <HiOutlineCpuChip className="text-xl text-[#ea580c]" />
            </div>
            <h3 className="text-base font-bold text-zinc-950">Step 1: Connect & Test</h3>
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
              Creators connect local Ollama models or remote API endpoints to run our automated, objective test bench.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-6 bg-[#fafafa] border border-[#e4e4e7] space-y-3 shadow-xs relative group hover:border-zinc-400 transition-all">
            <div className="flex items-center justify-between">
              <span className="w-8 h-8 bg-[#ea580c] text-white font-mono text-xs font-bold flex items-center justify-center">
                02
              </span>
              <HiOutlineShieldCheck className="text-xl text-emerald-600" />
            </div>
            <h3 className="text-base font-bold text-zinc-950">Step 2: Ground-Truth Verification</h3>
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
              Models are programmatically evaluated against real unit tests, math equations, and schema constraints—zero LLM judge bias.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-6 bg-[#fafafa] border border-[#e4e4e7] space-y-3 shadow-xs relative group hover:border-zinc-400 transition-all">
            <div className="flex items-center justify-between">
              <span className="w-8 h-8 bg-black text-white font-mono text-xs font-bold flex items-center justify-center">
                03
              </span>
              <HiOutlineKey className="text-xl text-[#ea580c]" />
            </div>
            <h3 className="text-base font-bold text-zinc-950">Step 3: Compare and Play</h3>
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
              Compare models side-by-side on live verified benchmarks and test them directly in the interactive playground sandbox.
            </p>
          </div>
        </div>
      </div>
    </section>

    {/* ==================== 3. LIVE BENCH SECTION ==================== */}
    <section id="live-bench" className="modelhub-panel border-b border-[#cbd5e1] px-4 sm:px-8 py-16 sm:py-24">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <div>
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#ea580c]">
            01 / Live Bench
          </span>
          <h2 className="mt-4 text-4xl sm:text-6xl font-bold tracking-[-0.05em] leading-none">
            Test models <span className="text-[#ea580c]">side by side.</span>
          </h2>
          <p className="mt-6 text-lg text-zinc-600 leading-relaxed">
            Bring a real prompt or dataset and compare creator models against frontier APIs with one clear result.
          </p>
          <ul className="mt-7 space-y-3 text-sm font-mono text-zinc-700">
            <li>✓ Define your workload</li>
            <li>✓ Watch concurrent evaluations</li>
            <li>✓ Get a quality, speed, and cost verdict</li>
          </ul>
          <Link
            to="/live-bench"
            className="mt-8 inline-flex items-center gap-2 border border-zinc-900 bg-black px-6 py-3 text-sm font-bold text-white hover:bg-[#ea580c] transition-all"
          >
            Open Live Bench <HiOutlineArrowRight />
          </Link>
        </div>
        <ArtFrame>
          <div className="flex justify-between border-b border-zinc-200 pb-3 font-mono text-xs">
            <span>LIVE BENCH / RUN 1048</span>
            <span className="text-emerald-600">● COMPLETE</span>
          </div>
          <div className="mt-6 space-y-4 font-mono text-xs">
            <div>
              <div className="flex justify-between mb-1">
                <span>specialized_model_v2</span>
                <b className="text-emerald-600">92.4%</b>
              </div>
              <div className="h-2 bg-emerald-100">
                <div className="h-full w-[92%] bg-emerald-500" />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span>frontier_api</span>
                <b>81.7%</b>
              </div>
              <div className="h-2 bg-zinc-100">
                <div className="h-full w-[81%] bg-zinc-400" />
              </div>
            </div>
          </div>
          <div className="mt-6 bg-[#e9f7ef] p-3 text-emerald-700 font-mono text-sm font-bold">
            Winner selected / 64% faster
          </div>
        </ArtFrame>
      </div>
    </section>

    {/* ==================== 4. AI MODELS SECTION ==================== */}
    <section id="ai-models" className="modelhub-panel border-b border-[#cbd5e1] px-4 sm:px-8 py-16 sm:py-24">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <ArtFrame shadow="#b8c8dd">
          <div className="flex justify-between border-b border-zinc-200 pb-3 font-mono text-xs">
            <b>CREATOR MODEL / VERIFIED</b>
            <span className="text-[#ea580c]">
              VIEW <HiOutlineArrowRight className="inline" />
            </span>
          </div>
          <div className="flex items-center gap-3 mt-8">
            <div className="w-12 h-12 bg-zinc-950 text-white flex items-center justify-center font-bold font-mono">
              Q
            </div>
            <div>
              <h3 className="font-bold">Qwen 2.5 Coder</h3>
              <p className="text-xs text-zinc-500 font-mono">@AIArchitect</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-7 font-mono text-[11px]">
            <div className="bg-[#fafafa] p-3">
              <span className="block text-zinc-400">QUALITY</span>
              <b className="text-emerald-700 text-base">95.8%</b>
            </div>
            <div className="bg-[#fafafa] p-3">
              <span className="block text-zinc-400">LATENCY</span>
              <b className="text-base">98ms</b>
            </div>
            <div className="bg-[#fafafa] p-3">
              <span className="block text-zinc-400">CASES</span>
              <b className="text-base">20/20</b>
            </div>
          </div>
        </ArtFrame>
        <div>
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#ea580c]">
            02 / AI Models
          </span>
          <h2 className="mt-4 text-4xl sm:text-6xl font-bold tracking-[-0.05em] leading-none">
            Find intelligence built for <span className="text-[#ea580c]">your domain.</span>
          </h2>
          <p className="mt-6 text-lg text-zinc-600 leading-relaxed">
            Explore creator-built, fine-tuned, and quantized models with the evidence to choose beyond a generic leaderboard.
          </p>
          <p className="mt-5 text-sm font-mono text-zinc-600">
            Coding · Math · Healthcare · Finance · Research
          </p>
          <Link
            to="/models"
            className="mt-8 inline-flex items-center gap-2 border border-zinc-900 bg-black px-6 py-3 text-sm font-bold text-white hover:bg-[#ea580c] transition-all"
          >
            Explore AI Models <HiOutlineArrowRight />
          </Link>
        </div>
      </div>
    </section>

    {/* ==================== 5. AGENT MARKETPLACE SECTION ==================== */}
    <section id="agents" className="modelhub-panel border-b border-[#cbd5e1] px-4 sm:px-8 py-16 sm:py-24">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <div>
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#ea580c]">
            03 / Agent Marketplace
          </span>
          <h2 className="mt-4 text-4xl sm:text-6xl font-bold tracking-[-0.05em] leading-none">
            Discover agents that <span className="text-[#ea580c]">do the work.</span>
          </h2>
          <p className="mt-6 text-lg text-zinc-600 leading-relaxed">
            Browse ready-to-use agents with tools, workflows, and purpose-built skills for real tasks.
          </p>
          <ul className="mt-7 space-y-3 text-sm font-mono text-zinc-700">
            <li>✓ Task-focused capabilities</li>
            <li>✓ Clear tools and workflow details</li>
            <li>✓ Built for practical outcomes</li>
          </ul>
          <Link
            to="/agents"
            className="mt-8 inline-flex items-center gap-2 border border-[#ea580c] bg-[#ea580c] px-6 py-3 text-sm font-bold text-white hover:bg-black transition-all"
          >
            Visit Agent Marketplace <HiOutlineArrowRight />
          </Link>
        </div>
        <ArtFrame>
          <div className="flex items-center justify-between border-b border-zinc-200 pb-3 font-mono text-xs">
            <span>AGENT / READY</span>
            <span className="text-emerald-600">● ONLINE</span>
          </div>
          <div className="flex items-center gap-3 mt-7">
            <div className="h-16 w-16 bg-zinc-950 text-white flex items-center justify-center text-3xl">
              <HiOutlineCommandLine />
            </div>
            <div>
              <h3 className="text-xl font-bold">OpenCode Agent</h3>
              <p className="text-xs text-zinc-500 font-mono">OpenCode · Coding Copilot</p>
            </div>
          </div>
          <p className="mt-5 text-sm leading-relaxed text-zinc-600">
            Plans, edits, tests, and ships changes across your repository from one task.
          </p>
          <div className="mt-6 flex gap-2 font-mono text-[10px]">
            <span className="bg-[#fff0e8] text-[#ea580c] px-2 py-1">CODING COPILOT</span>
            <span className="bg-[#e9f0fa] px-2 py-1">GITHUB</span>
            <span className="bg-[#e9f0fa] px-2 py-1">TERMINAL</span>
          </div>
        </ArtFrame>
      </div>
    </section>
  </main>
);

export default Home;
