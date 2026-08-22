import React from "react";
import { Link } from "react-router-dom";
import {
  HiOutlineBolt,
  HiOutlineCurrencyDollar,
  HiOutlineCube,
  HiOutlineCpuChip,
} from "react-icons/hi2";
import PixelMountainArt from "../components/atoms/PixelMountainArt";
import MetricCard from "../components/atoms/MetricCard";
import ModelBadge from "../components/atoms/ModelBadge";
import WorkflowContainer from "../components/workflow/WorkflowContainer";

const COMPANY_LOGOS = [
  {
    name: "Microsoft",
    icon: (
      <div className="grid grid-cols-2 gap-0.5 w-3.5 h-3.5">
        <span className="bg-[#f25022] w-1.5 h-1.5" />
        <span className="bg-[#7fba00] w-1.5 h-1.5" />
        <span className="bg-[#00a4ef] w-1.5 h-1.5" />
        <span className="bg-[#ffb900] w-1.5 h-1.5" />
      </div>
    ),
  },
  {
    name: "clay",
    icon: <span className="w-3.5 h-3.5 rounded-full bg-gradient-to-r from-blue-400 via-emerald-400 to-amber-400 inline-block" />,
  },
  {
    name: "Amplitude",
    icon: <span className="font-mono font-bold text-xs">▲</span>,
  },
  {
    name: "ramp ◞",
    icon: <span className="font-mono font-bold text-xs text-amber-500">⚡</span>,
  },
  {
    name: "Lovable",
    icon: <span className="text-red-500 text-xs">♥</span>,
  },
  {
    name: "DeepMind",
    icon: <span className="w-3 h-3 rounded-full border-2 border-black inline-block" />,
  },
];

const FEATURED_MODELS = [
  {
    id: "deepseek-coder",
    name: "DeepSeek-Coder-V2-Inst",
    creator: "@aletheia_labs",
    type: "creator",
    domain: "Polyglot Coding",
    latency: "162ms",
    cost: "$0.14/1M",
    mmlu: "90.2%",
    downloads: "42.8k",
  },
  {
    id: "qwen-reasoner",
    name: "Qwen2.5-Math-72B-Lora",
    creator: "@math_nexus",
    type: "fine-tuned",
    domain: "Complex Math & Logic",
    latency: "230ms",
    cost: "$0.45/1M",
    mmlu: "94.6%",
    downloads: "18.1k",
  },
  {
    id: "med-llama",
    name: "BioMistral-Clinical-7B",
    creator: "@health_ai",
    type: "quantized",
    domain: "Medical Diagnosis",
    latency: "88ms",
    cost: "$0.08/1M",
    mmlu: "88.7%",
    downloads: "61.3k",
  },
  {
    id: "finance-bert",
    name: "FinGPT-Sentiment-v4",
    creator: "@alpha_quant",
    type: "creator",
    domain: "SEC & Earnings Parsing",
    latency: "64ms",
    cost: "$0.05/1M",
    mmlu: "92.1%",
    downloads: "34.0k",
  },
  {
    id: "grok-4.6",
    name: "grok-4.6",
    creator: "@my_creator_org",
    type: "creator",
    domain: "Math, Code, Schema & Rules",
    latency: "Live result",
    cost: "MongoDB",
    mmlu: "Verified",
    downloads: "20 cases",
  },
];

const About = () => {
  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans selection:bg-[#ea580c] selection:text-white">
      {/* ==================== BROWSERBASE PIXEL MOUNTAIN ART ==================== */}
      <PixelMountainArt />

      {/* ==================== TRUST BAR / 10,000+ LOGO GRID ==================== */}
      <section className="border-b border-[#e4e4e7] bg-white py-6 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto space-y-4">
          <p className="text-xs font-bold text-zinc-900 tracking-tight">
            10,000+ companies building beyond the API
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            {COMPANY_LOGOS.map((company) => (
              <div
                key={company.name}
                className="bg-[#fafafa] hover:bg-zinc-100 border border-[#e4e4e7] rounded-none py-3 px-4 flex items-center justify-center gap-2 transition-colors cursor-default"
              >
                {company.icon}
                <span className="font-bold text-xs text-zinc-800 tracking-tight">
                  {company.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== MISSION & VALUE STATEMENT ==================== */}
      <section className="py-14 px-4 sm:px-8 max-w-6xl mx-auto space-y-6">
        <div className="max-w-3xl space-y-3">
          <span className="text-xs font-mono font-bold text-[#ea580c] uppercase tracking-wider">
            About ModelHub
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-zinc-950 font-sans leading-tight">
            The Marketplace & Benchmarking Engine for <span className="text-[#ea580c]">Specialized AI</span>.
          </h1>
          <p className="text-base sm:text-lg text-zinc-600 font-sans leading-relaxed">
            ModelHub empowers developers to discover, benchmark on their exact proprietary data, and deploy creator-built fine-tuned LLMs that reliably outperform generic frontier APIs.
          </p>
        </div>

        {/* Metric Cards Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <MetricCard
            label="Avg Speedup"
            value="3.8x"
            delta="+280%"
            deltaType="positive"
            subtext="vs Frontier APIs"
            icon={<HiOutlineBolt className="text-[#ea580c]" />}
          />
          <MetricCard
            label="Cost Reduction"
            value="78%"
            delta="-78% cost"
            deltaType="positive"
            subtext="Per 1M tokens"
            icon={<HiOutlineCurrencyDollar className="text-emerald-600" />}
          />
          <MetricCard
            label="Creator Models"
            value="340+"
            delta="Verified"
            deltaType="neutral"
            subtext="Fine-tuned weights"
            icon={<HiOutlineCube className="text-blue-500" />}
          />
          <MetricCard
            label="Live Evals Run"
            value="1.2M"
            delta="Real-time"
            deltaType="neutral"
            subtext="P99: 142ms"
            icon={<HiOutlineCpuChip className="text-purple-500" />}
          />
        </div>
      </section>

      {/* ==================== HOW IT WORKS WORKFLOW CONTAINER ==================== */}
      <section id="how-it-works" className="py-10 px-4 sm:px-8 max-w-6xl mx-auto border-t border-[#e4e4e7] space-y-4">
        <div>
          <span className="text-xs font-mono font-bold text-[#ea580c] uppercase tracking-wider">
            Workflow Overview
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 mt-1">
            How It Works
          </h2>
          <p className="text-sm text-zinc-500 mt-0.5">
            Benchmark custom creator models against frontier APIs in 3 simple steps.
          </p>
        </div>

        <WorkflowContainer />
      </section>

      {/* ==================== CREATOR MODELS CATALOG ==================== */}
      <section id="models" className="py-16 px-4 sm:px-8 max-w-6xl mx-auto border-t border-[#e4e4e7] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#e4e4e7] pb-4">
          <div>
            <span className="text-[11px] font-mono text-[#ea580c] font-bold uppercase tracking-wider">
              Explore Catalog
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight mt-0.5">
              High-Performance Creator Models
            </h2>
          </div>
          <span className="text-xs text-zinc-500 font-mono">
            340+ domain-specific models available on inference endpoints
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURED_MODELS.filter((model) => model.id === "grok-4.6").map((model) => (
            <div
              key={model.id}
              className="bg-white border border-[#e4e4e7] hover:border-zinc-400 p-5 rounded-none flex flex-col justify-between transition-all group shadow-xs"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <ModelBadge type={model.type} size="sm">{model.type}</ModelBadge>
                  <span className="text-[10px] font-mono text-zinc-500">{model.downloads} runs</span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-zinc-900 group-hover:text-[#ea580c] transition-colors truncate">
                    {model.name}
                  </h3>
                  <p className="text-[11px] font-mono text-zinc-500 mt-0.5">{model.creator}</p>
                </div>

                <div className="text-xs text-zinc-600 bg-[#fafafa] p-2.5 rounded-none border border-[#e4e4e7]">
                  <span className="text-zinc-400 block text-[10px] uppercase font-mono font-medium">Domain</span>
                  {model.domain}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#f4f4f5] flex items-center justify-between font-mono text-xs">
                <div>
                  <span className="text-[10px] text-zinc-400 block">LATENCY</span>
                  <span className="text-emerald-700 font-bold">{model.latency}</span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400 block">COST/1M</span>
                  <span className="text-zinc-800 font-medium">{model.cost}</span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400 block">MMLU</span>
                  <span className="text-zinc-900 font-bold">{model.mmlu}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="border-t border-[#e4e4e7] bg-[#fafafa] py-8 px-4 sm:px-8 text-xs text-zinc-500 font-sans">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-none bg-[#ea580c] text-white flex items-center justify-center font-bold text-[10px] font-mono">
              M
            </div>
            <span className="text-zinc-900 font-bold">ModelHub</span>
            <span className="text-zinc-400">© 2026</span>
          </div>

          <div className="flex items-center gap-6 text-zinc-600 font-medium">
            <Link to="/" className="hover:text-black transition-colors">Home</Link>
            <Link to="/about" className="hover:text-black transition-colors">About</Link>
            <Link to="/login" className="hover:text-black transition-colors">Log in</Link>
            <Link to="/register" className="text-[#ea580c] font-semibold hover:underline">Sign up</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;
