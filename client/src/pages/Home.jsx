import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  HiOutlineArrowDown,
  HiOutlineArrowRight,
  HiOutlineBolt,
  HiOutlineChartBar,
  HiOutlineCurrencyDollar,
  HiOutlineCube,
  HiOutlineCpuChip,
  HiOutlinePlay,
  HiOutlineRocketLaunch,
  HiOutlineSparkles,
} from "react-icons/hi2";
import API from "../api/axios";
import MetricCard from "../components/atoms/MetricCard";
import ModelBadge from "../components/atoms/ModelBadge";
import PixelMountainArt from "../components/atoms/PixelMountainArt";

const FEATURED_MODELS = [
  { id: "deepseek-coder", name: "DeepSeek-Coder-V2-Inst", creator: "@aletheia_labs", type: "creator", domain: "Polyglot Coding", latency: "162ms", cost: "$0.14/1M", mmlu: "90.2%", downloads: "42.8k" },
  { id: "qwen-reasoner", name: "Qwen2.5-Math-72B-Lora", creator: "@math_nexus", type: "fine-tuned", domain: "Complex Math & Logic", latency: "230ms", cost: "$0.45/1M", mmlu: "94.6%", downloads: "18.1k" },
  { id: "med-llama", name: "BioMistral-Clinical-7B", creator: "@health_ai", type: "quantized", domain: "Medical Diagnosis", latency: "88ms", cost: "$0.08/1M", mmlu: "88.7%", downloads: "61.3k" },
  { id: "finance-bert", name: "FinGPT-Sentiment-v4", creator: "@alpha_quant", type: "creator", domain: "SEC & Earnings Parsing", latency: "64ms", cost: "$0.05/1M", mmlu: "92.1%", downloads: "34.0k" },
];

const COMPANY_LOGOS = ["Microsoft", "clay", "Amplitude", "ramp ◞", "Lovable", "DeepMind"];

const Home = () => {
  const [featuredModels, setFeaturedModels] = useState([]);

  useEffect(() => {
    API.get("/models")
      .then(({ data }) => {
        const models = (data.models || []).map((model) => {
          const metrics = model.latestBenchmark?.metrics || {};
          return {
            id: String(model._id || model.name), name: model.name, creator: model.creator || "@anonymous_creator",
            type: "creator", domain: model.category || "General",
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

  const scrollToAbout = () => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });

  return (
    <main className="bg-white text-zinc-950 font-sans selection:bg-[#ea580c] selection:text-white">
      <section className="relative overflow-hidden border-b border-[#cbd5e1] bg-[#e9f0fa] min-h-[660px] flex flex-col items-center text-center px-4 pt-20 sm:pt-24">
        <div className="absolute inset-0 opacity-40 pointer-events-none [background-image:radial-gradient(#94a3b8_0.7px,transparent_0.7px)] [background-size:5px_5px]" />
        <div className="relative z-10 max-w-4xl space-y-7">
          <span className="inline-flex items-center gap-2 bg-white/70 border border-[#cbd5e1] px-3 py-1.5 text-[11px] font-mono uppercase tracking-wider text-zinc-700">
            <HiOutlineSparkles className="text-[#ea580c]" /> ModelHub 9.0 / AI evaluation infrastructure
          </span>
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold tracking-[-0.07em] leading-[0.95]">
            Find the model that <span className="bg-[#f4511e] text-white px-2">wins on your data.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-base sm:text-xl font-medium leading-relaxed text-zinc-700">
            Discover specialized AI, benchmark it against real workloads, and deploy the winner with confidence.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Link to="/test" className="inline-flex items-center justify-center gap-2 rounded-full bg-black px-6 py-3 text-sm font-bold text-white hover:bg-[#ea580c] transition-colors">
              Launch a benchmark <HiOutlineArrowRight />
            </Link>
            <button onClick={scrollToAbout} className="inline-flex items-center justify-center gap-2 rounded-full border border-zinc-300 bg-white/80 px-6 py-3 text-sm font-bold hover:border-black transition-colors">
              Explore ModelHub <HiOutlineArrowDown />
            </button>
          </div>
        </div>
        <div className="relative z-0 w-full max-w-7xl mt-12 sm:mt-16 -mb-1">
          <PixelMountainArt />
        </div>
        <div className="absolute right-4 bottom-4 hidden lg:block w-72 bg-white border border-[#cbd5e1] text-left shadow-[5px_5px_0_#ea580c]">
          <div className="flex items-center gap-2 border-b border-[#e4e4e7] px-4 py-3 text-[10px] font-mono uppercase tracking-wider text-zinc-500"><span className="text-[#ea580c]">■</span> Live evaluation / 2026</div>
          <div className="p-4"><strong className="block text-lg leading-tight">Benchmark every claim before you ship.</strong><Link to="/test" className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-[#ea580c]">Start testing <HiOutlineArrowRight /></Link></div>
        </div>
      </section>

      <section className="border-b border-[#cbd5e1] px-4 sm:px-8 py-10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">10,000+ evaluations making AI decisions clearer</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 mt-7 gap-2">
            {COMPANY_LOGOS.map((company, index) => <div key={company} className="h-16 bg-[#fafafa] border border-[#e4e4e7] flex items-center justify-center gap-2 font-bold text-sm"><span className={`w-4 h-4 ${index === 0 ? "bg-[#f25022]" : index === 5 ? "rounded-full border-4 border-black" : "rounded-full bg-zinc-900"}`} />{company}</div>)}
          </div>
        </div>
      </section>

      <section id="about" className="border-b border-[#cbd5e1] px-4 sm:px-8 py-20 sm:py-28">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#ea580c]">The ModelHub approach</span>
            <h2 className="mt-4 text-4xl sm:text-6xl font-bold tracking-[-0.05em] leading-[0.98]">Your <span className="text-[#ea580c]">bridge</span> between AI and production.</h2>
            <p className="mt-7 max-w-lg text-lg text-zinc-600 leading-relaxed">Generic benchmarks tell a story. Your own data tells the truth. ModelHub gives teams one place to compare, understand, and operationalize the best model for every job.</p>
            <ul className="mt-8 space-y-4 font-mono text-sm">
              {["Test on proprietary prompts and datasets", "Compare quality, latency, and cost together", "Deploy the winning model without guesswork"].map((item) => <li key={item} className="flex items-center gap-3"><span className="h-5 w-5 bg-[#dff2ff] flex items-center justify-center text-[#ea580c]">✓</span>{item}</li>)}
            </ul>
          </div>
          <div className="relative min-h-[370px] bg-[#e9f0fa] border border-[#cbd5e1] overflow-hidden p-8 flex items-center justify-center">
            <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(#cbd5e1_1px,transparent_1px),linear-gradient(90deg,#cbd5e1_1px,transparent_1px)] [background-size:42px_42px]" />
            <div className="relative w-full max-w-md bg-white border border-[#cbd5e1] shadow-[8px_8px_0_#b8c8dd] p-5 font-mono text-xs">
              <div className="flex gap-1.5 mb-6"><i className="w-2.5 h-2.5 rounded-full bg-[#ea580c]" /><i className="w-2.5 h-2.5 rounded-full bg-zinc-300" /><i className="w-2.5 h-2.5 rounded-full bg-zinc-300" /></div>
              <div className="text-zinc-400">/benchmark/run_1048</div>
              <div className="mt-4 space-y-3"><div className="flex justify-between border-b border-zinc-100 pb-2"><span>creator_model</span><b className="text-emerald-600">92.4%</b></div><div className="flex justify-between border-b border-zinc-100 pb-2"><span>frontier_api</span><b>81.7%</b></div><div className="flex justify-between border-b border-zinc-100 pb-2"><span>latency_delta</span><b className="text-[#ea580c]">-64%</b></div></div>
              <div className="mt-6 bg-[#e9f7ef] p-3 text-emerald-700 font-bold">✓ winner: specialized_model_v2</div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3 mt-16">
          <MetricCard label="Avg Speedup" value="3.8x" delta="+280%" subtext="vs Frontier APIs" icon={<HiOutlineBolt className="text-[#ea580c]" />} />
          <MetricCard label="Cost Reduction" value="78%" delta="-78% cost" subtext="Per 1M tokens" icon={<HiOutlineCurrencyDollar className="text-emerald-600" />} />
          <MetricCard label="Creator Models" value="340+" delta="Verified" deltaType="neutral" subtext="Fine-tuned weights" icon={<HiOutlineCube className="text-blue-500" />} />
          <MetricCard label="Live Evals Run" value="1.2M" delta="Real-time" deltaType="neutral" subtext="P99: 142ms" icon={<HiOutlineCpuChip className="text-purple-500" />} />
        </div>
      </section>

      <section className="border-b border-[#cbd5e1] px-4 sm:px-8 py-20 sm:py-28 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl sm:text-6xl font-bold tracking-[-0.05em]">Anything you can measure, <span className="text-[#ea580c]">you can improve.</span></h2>
          <p className="mt-4 text-lg font-medium text-zinc-600">A practical toolkit for every stage of the model lifecycle.</p>
          <div className="grid md:grid-cols-3 gap-4 mt-12">
            {[{ title: "Discover models", body: "Browse creator-built models by domain, capability, and real benchmark results.", icon: <HiOutlineCube /> }, { title: "Benchmark on reality", body: "Bring your prompts, expected outputs, and datasets. See the tradeoffs instantly.", icon: <HiOutlineChartBar /> }, { title: "Deploy with confidence", body: "Turn a tested winner into a production-ready decision, not another experiment.", icon: <HiOutlineRocketLaunch /> }].map((feature, index) => <article key={feature.title} className="bg-[#e4ebf5] p-7 min-h-[260px] flex flex-col justify-between border border-[#d5deea]"><div><span className="text-3xl text-[#ea580c]">{feature.icon}</span><h3 className="mt-8 text-2xl font-bold tracking-tight">{feature.title}</h3><p className="mt-3 text-zinc-600 leading-relaxed">{feature.body}</p></div><span className="font-mono text-xs text-zinc-500">0{index + 1} / MODELHUB</span></article>)}
          </div>
        </div>
      </section>

      <section className="border-b border-[#cbd5e1] px-4 sm:px-8 py-20 sm:py-28">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[0.75fr_1.25fr] gap-12">
          <div><span className="font-mono text-xs font-bold uppercase tracking-widest text-[#ea580c]">See what models can do</span><h2 className="mt-4 text-4xl sm:text-5xl font-bold tracking-[-0.05em]">The right answer is in the results.</h2><p className="mt-5 text-zinc-600 leading-relaxed">From coding to finance to healthcare, compare specialized intelligence where it matters: in the work.</p><Link to="/models" className="mt-8 inline-flex items-center gap-2 font-mono text-sm font-bold hover:text-[#ea580c]">Explore the catalog <HiOutlineArrowRight /></Link></div>
          <div className="grid sm:grid-cols-2 gap-4">
            {(featuredModels.length ? featuredModels : FEATURED_MODELS).map((model) => <div key={model.id} className="border border-[#e4e4e7] p-5 bg-white hover:border-[#ea580c] transition-colors"><div className="flex justify-between items-center"><ModelBadge type={model.type} size="sm">{model.type}</ModelBadge><span className="text-[10px] font-mono text-zinc-400">{model.downloads} runs</span></div><h3 className="mt-5 font-bold truncate">{model.name}</h3><p className="mt-1 text-xs font-mono text-zinc-500">{model.creator}</p><div className="mt-6 pt-4 border-t border-zinc-100 grid grid-cols-3 gap-2 font-mono"><div><small className="block text-[9px] text-zinc-400">LATENCY</small><b className="text-emerald-700 text-xs">{model.latency}</b></div><div><small className="block text-[9px] text-zinc-400">COST</small><b className="text-xs">{model.cost}</b></div><div><small className="block text-[9px] text-zinc-400">SCORE</small><b className="text-xs">{model.mmlu}</b></div></div></div>)}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#e9f0fa] px-4 sm:px-8 py-20 sm:py-28 text-center"><div className="absolute inset-0 opacity-30 [background-image:radial-gradient(#94a3b8_0.7px,transparent_0.7px)] [background-size:5px_5px]" /><div className="relative max-w-3xl mx-auto"><span className="font-mono text-xs font-bold uppercase tracking-widest text-[#ea580c]">Start with evidence</span><h2 className="mt-4 text-4xl sm:text-6xl font-bold tracking-[-0.06em] leading-none">Stop guessing. Start benchmarking.</h2><p className="mt-6 text-lg text-zinc-600">Your next best model is waiting to meet your data.</p><Link to="/test" className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#ea580c] px-7 py-3.5 text-sm font-bold text-white hover:bg-black transition-colors">Run your first benchmark <HiOutlinePlay /></Link></div></section>

      <footer className="border-t border-[#e4e4e7] bg-white px-4 sm:px-8 py-8"><div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-5 text-xs text-zinc-500"><div className="flex items-center gap-2"><span className="w-6 h-6 bg-[#ea580c] text-white flex items-center justify-center font-bold">M</span><b className="text-zinc-900">ModelHub</b><span>© 2026</span></div><div className="flex items-center gap-5 font-medium"><Link to="/test" className="hover:text-[#ea580c]">Test Bench</Link><Link to="/models" className="hover:text-[#ea580c]">AI Models</Link><Link to="/about" className="hover:text-[#ea580c]">About</Link><Link to="/login" className="hover:text-[#ea580c]">Log in</Link></div></div></footer>
    </main>
  );
};

export default Home;
