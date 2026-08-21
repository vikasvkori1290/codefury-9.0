import React from "react";
import { Link } from "react-router-dom";
import { HiOutlineArrowDown, HiOutlineArrowRight, HiOutlinePlay, HiOutlineRocketLaunch, HiOutlineSparkles } from "react-icons/hi2";

const Home = () => {
  return (
    <main className="modelhub-texture text-zinc-950 font-sans selection:bg-[#ea580c] selection:text-white">
      <section id="about" className="relative overflow-hidden border-b border-[#cbd5e1] min-h-[760px] flex flex-col items-center text-center px-4 pt-20 sm:pt-24 bg-transparent">
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#e6f0fb]/95 via-[#e6f0fb]/55 to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-4xl space-y-7">
          <span className="inline-flex items-center gap-2 bg-white/70 border border-[#cbd5e1] px-3 py-1.5 text-[11px] font-mono uppercase tracking-wider text-zinc-700">
            <HiOutlineSparkles className="text-[#ea580c]" /> ModelHub 9.0 / AI evaluation infrastructure
          </span>
          <h1 className="text-5xl sm:text-7xl lg:text-[84px] font-extrabold tracking-[-0.05em] leading-[1.08] flex flex-col items-center select-none">
            <span className="text-zinc-950">Find the model that</span>
            <span className="inline-block mt-2 sm:mt-3 bg-[#f4511e] text-white px-4 sm:px-6 py-1 sm:py-1.5 tracking-[-0.04em]">
              wins on your data.
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-base sm:text-xl font-medium leading-relaxed text-zinc-700">
            Discover specialized AI, benchmark it against real workloads, and deploy the winner with confidence.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Link to="/live-bench" className="inline-flex items-center justify-center gap-2 rounded-full bg-black px-6 py-3 text-sm font-bold text-white hover:bg-[#ea580c] transition-colors">
              Get started in Live Bench <HiOutlineArrowRight />
            </Link>
            <button onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })} className="inline-flex items-center justify-center gap-2 rounded-full border border-zinc-300 bg-white/80 px-6 py-3 text-sm font-bold hover:border-black transition-colors">
              Explore the platform <HiOutlineArrowDown />
            </button>
          </div>
        </div>
        <div className="absolute right-4 bottom-8 z-10 hidden lg:block w-72 bg-white border border-[#cbd5e1] text-left shadow-[5px_5px_0_#ea580c]">
          <div className="flex items-center gap-2 border-b border-[#e4e4e7] px-4 py-3 text-[10px] font-mono uppercase tracking-wider text-zinc-500"><span className="text-[#ea580c]">■</span> Live evaluation / 2026</div>
          <div className="p-4"><strong className="block text-lg leading-tight">Benchmark every claim before you ship.</strong><Link to="/live-bench" className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-[#ea580c]">Start testing <HiOutlineArrowRight /></Link></div>
        </div>
      </section>

      <section id="live-bench" className="modelhub-panel border-b border-[#cbd5e1] px-4 sm:px-8 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div><span className="font-mono text-xs font-bold uppercase tracking-widest text-[#ea580c]">01 / Live Bench</span><h2 className="mt-4 text-4xl sm:text-6xl font-bold tracking-[-0.05em] leading-none">Test models <span className="text-[#ea580c]">side by side.</span></h2><p className="mt-6 text-lg text-zinc-600 leading-relaxed">Bring a real prompt or dataset and run it against creator models and frontier APIs at the same time. Live Bench turns a subjective choice into a clear, comparable result.</p><ul className="mt-7 space-y-3 text-sm font-mono text-zinc-700"><li>✓ Define your workload</li><li>✓ Watch concurrent evaluations</li><li>✓ Get a quality, speed, and cost verdict</li></ul><Link to="/live-bench" className="mt-8 inline-flex items-center gap-2 rounded-full bg-black px-6 py-3 text-sm font-bold text-white hover:bg-[#ea580c] transition-colors">Open Live Bench <HiOutlineArrowRight /></Link></div>
          <div className="relative min-h-[390px] overflow-hidden border border-[#cbd5e1] bg-[#e9f0fa] bg-[radial-gradient(#9db1c8_1px,transparent_1px)] bg-[size:14px_14px] p-6 flex items-center"><div className="relative w-full bg-white/95 border border-[#cbd5e1] shadow-[8px_8px_0_#ea580c] p-5 font-mono text-xs"><div className="flex justify-between border-b border-zinc-200 pb-3"><span>LIVE BENCH / RUN 1048</span><span className="text-emerald-600">● COMPLETE</span></div><div className="mt-5 space-y-3"><div className="flex justify-between"><span>specialized_model_v2</span><b className="text-emerald-600">92.4%</b></div><div className="h-2 bg-emerald-100"><div className="h-full w-[92%] bg-emerald-500" /></div><div className="flex justify-between"><span>frontier_api</span><b>81.7%</b></div><div className="h-2 bg-zinc-100"><div className="h-full w-[81%] bg-zinc-400" /></div></div><div className="mt-5 bg-[#e9f7ef] p-3 text-emerald-700 font-bold">Winner selected / 64% faster</div></div></div>
        </div>
      </section>

      <section id="ai-models" className="modelhub-panel border-b border-[#cbd5e1] px-4 sm:px-8 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-20 items-center"><div className="order-2 lg:order-1 relative min-h-[390px] overflow-hidden border border-[#cbd5e1] bg-[#dfe8f4] bg-[radial-gradient(#9db1c8_1px,transparent_1px)] bg-[size:14px_14px] p-5"><div className="absolute bottom-5 left-5 right-5 bg-white/95 border border-[#cbd5e1] p-4 shadow-[6px_6px_0_#b8c8dd] font-mono text-xs"><div className="flex justify-between"><b>CREATOR MODEL / VERIFIED</b><span className="text-[#ea580c]">VIEW →</span></div><p className="mt-3 text-zinc-500">Coding · 162ms · 90.2% quality</p></div></div><div className="order-1 lg:order-2"><span className="font-mono text-xs font-bold uppercase tracking-widest text-[#ea580c]">02 / AI Models</span><h2 className="mt-4 text-4xl sm:text-6xl font-bold tracking-[-0.05em] leading-none">Find intelligence built for <span className="text-[#ea580c]">your domain.</span></h2><p className="mt-6 text-lg text-zinc-600 leading-relaxed">Explore creator-built, fine-tuned, and quantized models made for specific work. Every listing gives you the context to choose beyond a generic leaderboard.</p><p className="mt-5 text-sm font-mono text-zinc-600">Coding · Math · Healthcare · Finance · Research</p><Link to="/models" className="mt-8 inline-flex items-center gap-2 rounded-full bg-black px-6 py-3 text-sm font-bold text-white hover:bg-[#ea580c] transition-colors">Explore AI Models <HiOutlineArrowRight /></Link></div></div>
      </section>

      <section id="agents" className="modelhub-panel border-b border-[#cbd5e1] px-4 sm:px-8 py-16 sm:py-24"><div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-20 items-center"><div><span className="font-mono text-xs font-bold uppercase tracking-widest text-[#ea580c]">03 / Agent Marketplace</span><h2 className="mt-4 text-4xl sm:text-6xl font-bold tracking-[-0.05em] leading-none">Discover agents that <span className="text-[#ea580c]">do the work.</span></h2><p className="mt-6 text-lg text-zinc-600 leading-relaxed">Go beyond models. Browse ready-to-use AI agents with tools, workflows, and purpose-built skills for real tasks. Find an agent, understand its capabilities, and put it to work.</p><ul className="mt-7 space-y-3 text-sm font-mono text-zinc-700"><li>✓ Task-focused capabilities</li><li>✓ Clear tools and workflow details</li><li>✓ Built for practical outcomes</li></ul><Link to="/agents" className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#ea580c] px-6 py-3 text-sm font-bold text-white hover:bg-black transition-colors">Visit Agent Marketplace <HiOutlineArrowRight /></Link></div><div className="relative min-h-[390px] overflow-hidden border border-[#cbd5e1] bg-[#e9f0fa] bg-[radial-gradient(#9db1c8_1px,transparent_1px)] bg-[size:14px_14px] flex items-center justify-center"><div className="relative w-64 bg-white border border-[#cbd5e1] p-5 shadow-[7px_7px_0_#ea580c]"><div className="flex items-center justify-between font-mono text-[10px] text-zinc-500"><span>AGENT / READY</span><span className="text-emerald-600">● ONLINE</span></div><div className="mt-8 h-16 w-16 bg-[#ea580c] text-white flex items-center justify-center text-3xl"><HiOutlineRocketLaunch /></div><h3 className="mt-5 text-xl font-bold">Research Navigator</h3><p className="mt-2 text-xs leading-relaxed text-zinc-500">Search, compare, and summarize complex information.</p><div className="mt-5 flex gap-2"><span className="bg-[#e9f0fa] px-2 py-1 text-[10px] font-mono">RESEARCH</span><span className="bg-[#e9f0fa] px-2 py-1 text-[10px] font-mono">SEARCH</span></div></div></div></div></section>

      <footer className="border-t border-[#e4e4e7] bg-white px-4 sm:px-8 py-8"><div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-5 text-xs text-zinc-500"><div className="flex items-center gap-2"><span className="w-6 h-6 bg-[#ea580c] text-white flex items-center justify-center font-bold">M</span><b className="text-zinc-900">ModelHub</b><span>© 2026</span></div><div className="flex items-center gap-5 font-medium"><Link to="/test" className="hover:text-[#ea580c]">Test Bench</Link><Link to="/models" className="hover:text-[#ea580c]">AI Models</Link><Link to="/about" className="hover:text-[#ea580c]">About</Link><Link to="/login" className="hover:text-[#ea580c]">Log in</Link></div></div></footer>
    </main>
  );
};

export default Home;
