import React from "react";
import { Link } from "react-router-dom";
import { HiOutlineArrowRight, HiOutlineCommandLine, HiOutlineSparkles } from "react-icons/hi2";

const ArtFrame = ({ children, shadow = "#ea580c" }) => (
  <div className="relative min-h-[360px] overflow-hidden border border-[#cbd5e1] bg-[#e9f0fa] p-5 sm:p-8" style={{ backgroundImage: "radial-gradient(#9db1c8 1.2px, transparent 1.2px)", backgroundSize: "14px 14px" }}>
    <div className="relative flex h-full min-h-[300px] items-center justify-center bg-white/10">
      <div className="w-full bg-white border border-[#cbd5e1] p-5 shadow-[8px_8px_0_var(--art-shadow)]" style={{ "--art-shadow": shadow }}>{children}</div>
    </div>
  </div>
);

const Home = () => (
  <main className="modelhub-texture text-zinc-950 font-sans selection:bg-[#ea580c] selection:text-white">
    <section id="about" className="relative overflow-hidden border-b border-[#cbd5e1] min-h-[680px] flex flex-col items-center text-center px-4 pt-24 sm:pt-32">
      <div className="absolute inset-0 bg-gradient-to-b from-[#e6f0fb]/95 via-[#e6f0fb]/55 to-transparent pointer-events-none" />
      <div className="relative z-10 max-w-4xl space-y-7">
        <span className="inline-flex items-center gap-2 bg-white/70 border border-[#cbd5e1] px-3 py-1.5 text-[11px] font-mono uppercase tracking-wider text-zinc-700 select-none">
           <HiOutlineSparkles className="text-[#ea580c]" /> Forge 9.0 / AI platform
        </span>
        <h1 className="text-5xl sm:text-7xl lg:text-[84px] font-extrabold tracking-[-0.05em] leading-[1.18] sm:leading-[1.14] flex flex-col items-center select-none">
          <span className="text-zinc-950">Find the model that</span>
          <span className="inline-block mt-3 sm:mt-4 bg-[#f4511e] text-white px-4 sm:px-6 py-1 sm:py-1.5 tracking-[-0.04em] shadow-xs">
            wins on your data.
          </span>
        </h1>
        <p className="max-w-2xl mx-auto text-base sm:text-xl font-medium leading-relaxed text-zinc-700">Discover specialized AI, benchmark it against real workloads, and deploy the winner with confidence.</p>
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <Link to="/live-bench" className="inline-flex items-center justify-center gap-2 border border-zinc-900 bg-black px-5 py-2.5 text-sm font-bold text-white hover:bg-[#ea580c]">Get started <HiOutlineArrowRight /></Link>
        </div>
      </div>
    </section>

    <section id="live-bench" className="modelhub-panel border-b border-[#cbd5e1] px-4 sm:px-8 py-16 sm:py-24">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <div><span className="font-mono text-xs font-bold uppercase tracking-widest text-[#ea580c]">01 / Live Bench</span><h2 className="mt-4 text-4xl sm:text-6xl font-bold tracking-[-0.05em] leading-none">Test models <span className="text-[#ea580c]">side by side.</span></h2><p className="mt-6 text-lg text-zinc-600 leading-relaxed">Bring a real prompt or dataset and compare creator models against frontier APIs with one clear result.</p><ul className="mt-7 space-y-3 text-sm font-mono text-zinc-700"><li>✓ Define your workload</li><li>✓ Watch concurrent evaluations</li><li>✓ Get a quality, speed, and cost verdict</li></ul><Link to="/live-bench" className="mt-8 inline-flex items-center gap-2 border border-zinc-900 bg-black px-6 py-3 text-sm font-bold text-white hover:bg-[#ea580c]">Open Live Bench <HiOutlineArrowRight /></Link></div>
        <ArtFrame><div className="flex justify-between border-b border-zinc-200 pb-3 font-mono text-xs"><span>LIVE BENCH / RUN 1048</span><span className="text-emerald-600">● COMPLETE</span></div><div className="mt-6 space-y-4 font-mono text-xs"><div><div className="flex justify-between mb-1"><span>specialized_model_v2</span><b className="text-emerald-600">92.4%</b></div><div className="h-2 bg-emerald-100"><div className="h-full w-[92%] bg-emerald-500" /></div></div><div><div className="flex justify-between mb-1"><span>frontier_api</span><b>81.7%</b></div><div className="h-2 bg-zinc-100"><div className="h-full w-[81%] bg-zinc-400" /></div></div></div><div className="mt-6 bg-[#e9f7ef] p-3 text-emerald-700 font-mono text-sm font-bold">Winner selected / 64% faster</div></ArtFrame>
      </div>
    </section>

    <section id="ai-models" className="modelhub-panel border-b border-[#cbd5e1] px-4 sm:px-8 py-16 sm:py-24">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <ArtFrame shadow="#b8c8dd"><div className="flex justify-between border-b border-zinc-200 pb-3 font-mono text-xs"><b>CREATOR MODEL / VERIFIED</b><span className="text-[#ea580c]">VIEW <HiOutlineArrowRight className="inline" /></span></div><div className="flex items-center gap-3 mt-8"><div className="w-12 h-12 bg-zinc-950 text-white flex items-center justify-center font-bold font-mono">Q</div><div><h3 className="font-bold">Qwen 2.5 Coder</h3><p className="text-xs text-zinc-500 font-mono">@AIArchitect</p></div></div><div className="grid grid-cols-3 gap-2 mt-7 font-mono text-[11px]"><div className="bg-[#fafafa] p-3"><span className="block text-zinc-400">QUALITY</span><b className="text-emerald-700 text-base">95.8%</b></div><div className="bg-[#fafafa] p-3"><span className="block text-zinc-400">LATENCY</span><b className="text-base">98ms</b></div><div className="bg-[#fafafa] p-3"><span className="block text-zinc-400">CASES</span><b className="text-base">35/35</b></div></div></ArtFrame>
        <div><span className="font-mono text-xs font-bold uppercase tracking-widest text-[#ea580c]">02 / AI Models</span><h2 className="mt-4 text-4xl sm:text-6xl font-bold tracking-[-0.05em] leading-none">Find intelligence built for <span className="text-[#ea580c]">your domain.</span></h2><p className="mt-6 text-lg text-zinc-600 leading-relaxed">Explore creator-built, fine-tuned, and quantized models with the evidence to choose beyond a generic leaderboard.</p><p className="mt-5 text-sm font-mono text-zinc-600">Coding · Math · Healthcare · Finance · Research</p><Link to="/models" className="mt-8 inline-flex items-center gap-2 border border-zinc-900 bg-black px-6 py-3 text-sm font-bold text-white hover:bg-[#ea580c]">Explore AI Models <HiOutlineArrowRight /></Link></div>
      </div>
    </section>

    <section id="agents" className="modelhub-panel border-b border-[#cbd5e1] px-4 sm:px-8 py-16 sm:py-24">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <div><span className="font-mono text-xs font-bold uppercase tracking-widest text-[#ea580c]">03 / Agent Marketplace</span><h2 className="mt-4 text-4xl sm:text-6xl font-bold tracking-[-0.05em] leading-none">Discover agents that <span className="text-[#ea580c]">do the work.</span></h2><p className="mt-6 text-lg text-zinc-600 leading-relaxed">Browse ready-to-use agents with tools, workflows, and purpose-built skills for real tasks.</p><ul className="mt-7 space-y-3 text-sm font-mono text-zinc-700"><li>✓ Task-focused capabilities</li><li>✓ Clear tools and workflow details</li><li>✓ Built for practical outcomes</li></ul><Link to="/agents" className="mt-8 inline-flex items-center gap-2 border border-[#ea580c] bg-[#ea580c] px-6 py-3 text-sm font-bold text-white hover:bg-black">Visit Agent Marketplace <HiOutlineArrowRight /></Link></div>
        <ArtFrame><div className="flex items-center justify-between border-b border-zinc-200 pb-3 font-mono text-xs"><span>AGENT / READY</span><span className="text-emerald-600">● ONLINE</span></div><div className="flex items-center gap-3 mt-7"><div className="h-16 w-16 bg-zinc-950 text-white flex items-center justify-center text-3xl"><HiOutlineCommandLine /></div><div><h3 className="text-xl font-bold">OpenCode Agent</h3><p className="text-xs text-zinc-500 font-mono">OpenCode · Coding Copilot</p></div></div><p className="mt-5 text-sm leading-relaxed text-zinc-600">Plans, edits, tests, and ships changes across your repository from one task.</p><div className="mt-6 flex gap-2 font-mono text-[10px]"><span className="bg-[#fff0e8] text-[#ea580c] px-2 py-1">CODING COPILOT</span><span className="bg-[#e9f0fa] px-2 py-1">GITHUB</span><span className="bg-[#e9f0fa] px-2 py-1">TERMINAL</span></div></ArtFrame>
      </div>
    </section>
  </main>
);

export default Home;
