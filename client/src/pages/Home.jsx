import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  HiOutlineBolt,
  HiOutlineCurrencyDollar,
  HiOutlineCube,
  HiOutlineCpuChip,
  HiOutlineSparkles,
  HiOutlinePlay,
  HiOutlineArrowDown,
} from "react-icons/hi2";
import MetricCard from "../components/atoms/MetricCard";
import ModelBadge from "../components/atoms/ModelBadge";
import API from "../api/axios";

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
];

const Home = () => {
  const [featuredModels, setFeaturedModels] = useState([]);

  useEffect(() => {
    API.get("/models")
      .then(({ data }) => {
        const models = (data.models || []).map((model) => {
          const metrics = model.latestBenchmark?.metrics || {};
          return {
            id: String(model._id || model.name),
            name: model.name,
            creator: model.creator || "@anonymous_creator",
            type: "creator",
            domain: model.category || "General",
            latency: metrics.avgLatencyMs ? `${metrics.avgLatencyMs}ms` : "Pending",
            cost: `$${Number(model.pricingPer1kTokens || 0).toFixed(5)}/1k`,
            mmlu: metrics.overallPassRate ? `${metrics.overallPassRate}%` : "Pending",
            downloads: metrics.totalCases ? `${metrics.totalCases} cases` : "No runs",
          };
        });
        setFeaturedModels(models.slice(0, 4));
      })
      .catch(() => setFeaturedModels([]));
  }, []);

  const scrollToAbout = () => {
    const el = document.getElementById("about");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans selection:bg-[#ea580c] selection:text-white">
      {/* ==================== HERO SECTION ==================== */}
      <section className="min-h-[75vh] flex flex-col justify-center items-center text-center px-4 sm:px-8 max-w-5xl mx-auto py-16 space-y-8">
        {/* Top Tagline */}
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-100 border border-zinc-200 text-xs font-mono text-zinc-700">
          <HiOutlineSparkles className="text-[#ea580c]" />
          <span>ModelHub 9.0 • AI Marketplace & Benchmarking Engine</span>
        </div>

        {/* Hero Title */}
        <div className="max-w-3xl space-y-4">
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-zinc-950 font-sans leading-tight">
            See what <span className="text-[#ea580c]">specialized models</span> can do on your data.
          </h1>
          <p className="text-base sm:text-lg text-zinc-600 font-sans leading-relaxed max-w-2xl mx-auto">
            From latency to task completion, ModelHub powers creator fine-tuned models that{" "}
            <span className="underline decoration-zinc-400 decoration-1 underline-offset-4">
              reliably
            </span>{" "}
            outperform frontier LLMs.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            to="/test"
            className="w-full sm:w-auto bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold text-xs px-6 py-3 rounded-none transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-95 font-mono"
          >
            <HiOutlinePlay className="text-sm" />
            <span>Launch Test Benchmark</span>
          </Link>

          <button
            onClick={scrollToAbout}
            className="w-full sm:w-auto bg-white hover:bg-zinc-50 border border-zinc-300 text-zinc-800 font-bold text-xs px-6 py-3 rounded-none transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-95 font-mono"
          >
            <span>Read About & Showcase</span>
            <HiOutlineArrowDown className="text-sm text-zinc-500" />
          </button>
        </div>
      </section>

      {/* ==================== ABOUT / SHOWCASE SECTION ==================== */}
      <div id="about" className="border-t border-[#e4e4e7] bg-[#fbfbfb]">
        {/* Mission Statement */}
        <section className="py-14 px-4 sm:px-8 max-w-6xl mx-auto space-y-6">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-mono font-bold text-[#ea580c] uppercase tracking-wider">
              About ModelHub
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 font-sans">
              The Marketplace & Benchmarking Engine for <span className="text-[#ea580c]">Specialized AI</span>.
            </h2>
            <p className="text-sm sm:text-base text-zinc-600 font-sans leading-relaxed">
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

        {/* High-Performance Creator Models Catalog */}
        <section className="py-14 px-4 sm:px-8 max-w-6xl mx-auto border-t border-[#e4e4e7] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#e4e4e7] pb-4">
            <div>
              <span className="text-[11px] font-mono text-[#ea580c] font-bold uppercase tracking-wider">
                Explore Catalog
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight mt-0.5">
                High-Performance Creator Models
              </h3>
            </div>
            <Link to="/test" className="text-xs text-[#ea580c] font-mono font-bold hover:underline flex items-center gap-1">
              <span>Benchmark these models</span>
              <span>→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredModels.map((model) => (
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
                    <h4 className="text-sm font-bold text-zinc-900 group-hover:text-[#ea580c] transition-colors truncate">
                      {model.name}
                    </h4>
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
          {!featuredModels.length && <p className="border border-dashed border-zinc-200 p-6 text-center font-mono text-xs text-zinc-500">No models are currently registered in MongoDB.</p>}
        </section>
      </div>

      {/* ==================== CLEAN FOOTER ==================== */}
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
            <Link to="/test" className="text-[#ea580c] font-bold hover:underline">Test Benchmark</Link>
            <button onClick={scrollToAbout} className="hover:text-black transition-colors cursor-pointer">About</button>
            <a href="https://github.com/vikasvkori1290/codefury-9.0" target="_blank" rel="noreferrer" className="hover:text-black transition-colors">Docs</a>
            <Link to="/login" className="hover:text-black transition-colors">Log in</Link>
            <Link to="/register" className="text-zinc-900 font-semibold hover:underline">Sign up</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
