import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  HiOutlineArrowLeft,
  HiOutlineArrowDownTray,
  HiOutlineCheck,
  HiOutlineClipboard,
  HiOutlineGlobeAlt,
  HiOutlineBookOpen,
  HiOutlineCodeBracket,
  HiOutlineCpuChip,
  HiOutlinePuzzlePiece,
  HiOutlineShieldCheck,
  HiOutlineWrenchScrewdriver,
} from "react-icons/hi2";
import { AGENTS } from "./AgentMarketplacePage";
import AgentLogo from "../components/AgentLogo";

const PLATFORM_LABELS = [
  ["macos", "macOS"],
  ["linux", "Linux"],
  ["windows", "Windows"],
];

export const AgentDetailPage = () => {
  const { id } = useParams();
  const submittedAgents = (() => { try { return JSON.parse(localStorage.getItem("modelhub-submitted-agents") || "[]"); } catch { return []; } })();
  const agent = [...submittedAgents, ...AGENTS].find((item) => item.id === id);
  const [platform, setPlatform] = useState("macos");
  const [copied, setCopied] = useState(false);

  if (!agent) {
    return (
      <div className="min-h-screen bg-[#fafafa] p-12 text-center font-mono text-xs text-zinc-500">
        Agent not found. <Link to="/agents" className="text-[#ea580c] underline">Return to Agent Marketplace</Link>.
      </div>
    );
  }

  const install = agent.install || {
    label: "Open installation instructions",
    commands: { macos: "See the publisher's installation instructions", linux: "See the publisher's installation instructions", windows: "See the publisher's installation instructions" },
    packageUrl: agent.links?.docs || agent.links?.website,
    note: "This publisher does not provide a universal local installer.",
  };
  const commands = install.commands;

  const copyCommand = () => {
    navigator.clipboard.writeText(commands[platform]);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const scrollToInstall = () => document.getElementById("agent-install")?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <div className="min-h-screen bg-[#fafafa] text-zinc-900 font-sans py-8 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between font-mono text-xs text-zinc-500">
          <Link to="/agents" className="flex items-center gap-1.5 hover:text-black"><HiOutlineArrowLeft /> Back to Agent Marketplace</Link>
          <span className="text-zinc-400">Agent ID: {agent.id}</span>
        </div>

        <section className="bg-white border border-[#e4e4e7] shadow-xs p-6 sm:p-8 flex flex-col lg:flex-row justify-between gap-6">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {agent.verified && <span className="px-2 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-mono font-bold flex items-center gap-1"><HiOutlineShieldCheck /> Verified</span>}
              <span className="px-2 py-1 bg-[#fff7ed] border border-orange-200 text-[#ea580c] text-[11px] font-mono font-bold">{agent.category}</span>
              <span className="px-2 py-1 bg-zinc-100 border border-[#e4e4e7] text-zinc-600 text-[11px] font-mono">{agent.type}</span>
            </div>
            <div className="flex items-center gap-3">
               <AgentLogo agent={agent} large />
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 font-mono">{agent.displayName}</h1>
                <p className="text-xs text-zinc-500 font-mono mt-1">Built by <strong className="text-zinc-800">{agent.company || agent.creator}</strong></p>
              </div>
            </div>
            <p className="max-w-2xl text-sm text-zinc-600 leading-relaxed">{agent.longDescription || agent.description}</p>
            <div className="flex flex-wrap gap-2">
              {agent.capabilities.slice(0, 4).map((capability) => <span key={capability} className="px-2 py-1 bg-white border border-[#e4e4e7] text-[11px] font-mono text-zinc-700">{capability}</span>)}
            </div>
          </div>
          <div className="flex flex-col justify-center gap-3 shrink-0">
            <button onClick={scrollToInstall} className="px-6 py-3 bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-mono font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xs"><HiOutlineArrowDownTray /> Install agent</button>
            <Link to="/live-bench" className="px-6 py-3 bg-white border border-zinc-300 text-zinc-800 text-xs font-mono font-bold text-center hover:bg-zinc-50">Try in Live Bench</Link>
          </div>
        </section>

         {agent.links && <section className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white border border-[#e4e4e7] shadow-xs p-4 font-mono text-xs">
           {[
             [agent.links.website, "Website", HiOutlineGlobeAlt],
             [agent.links.docs, "Documentation", HiOutlineBookOpen],
             [agent.links.repository, "Source repository", HiOutlineCodeBracket],
           ].filter(([url]) => url).map(([url, label, Icon]) => (
             <a key={label} href={url} target="_blank" rel="noreferrer" className="group flex min-h-14 items-center justify-between gap-3 border border-[#e4e4e7] bg-[#fafafa] px-4 py-3 text-zinc-700 transition-colors hover:border-orange-200 hover:bg-[#fff7ed] hover:text-[#ea580c]">
               <span className="flex min-w-0 items-center gap-3"><Icon className="shrink-0 text-lg text-[#ea580c]" /><span className="truncate">{label}</span></span>
               <span className="shrink-0 text-base text-zinc-400 transition-transform group-hover:translate-x-0.5 group-hover:text-[#ea580c]">↗</span>
             </a>
           ))}
         </section>}

        <section className="bg-white border border-[#e4e4e7] shadow-xs p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-2 border-b border-[#e4e4e7] pb-4"><HiOutlinePuzzlePiece className="text-[#ea580c]" /><h2 className="text-base font-bold">Overview</h2></div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-5 bg-[#fafafa] border border-[#e4e4e7]">
              <h3 className="text-xs font-mono uppercase font-bold flex items-center gap-2 mb-3"><HiOutlineCpuChip className="text-[#ea580c]" /> What it can do</h3>
              <ul className="space-y-2 text-xs text-zinc-700">{agent.capabilities.map((item) => <li key={item} className="flex items-center gap-2"><HiOutlineCheck className="text-emerald-600" />{item}</li>)}</ul>
            </div>
            <div className="p-5 bg-[#fafafa] border border-[#e4e4e7]">
              <h3 className="text-xs font-mono uppercase font-bold flex items-center gap-2 mb-3"><HiOutlineWrenchScrewdriver className="text-[#ea580c]" /> Works with</h3>
              <div className="flex flex-wrap gap-2">{agent.tools.map((tool) => <span key={tool} className="px-2 py-1 bg-white border border-[#e4e4e7] text-xs font-mono">{tool}</span>)}</div>
            </div>
          </div>
        </section>

        <section id="agent-install" className="bg-white border border-[#e4e4e7] shadow-xs p-6 sm:p-8 space-y-6 scroll-mt-6">
          <div className="text-center space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#ea580c] font-bold">Get started</span>
            <h2 className="text-xl font-bold font-mono">Install {agent.displayName}</h2>
             <p className="text-xs text-zinc-500">Use the publisher's documented install method for your operating system.</p>
          </div>

          <div className="flex justify-center">
            <div className="inline-flex p-1 bg-[#fafafa] border border-[#e4e4e7] font-mono text-xs">
              {PLATFORM_LABELS.map(([value, label]) => <button key={value} onClick={() => setPlatform(value)} className={`px-6 py-2.5 border cursor-pointer ${platform === value ? "bg-zinc-950 text-white border-zinc-950 font-bold" : "border-transparent text-zinc-600 hover:text-black"}`}>{label}</button>)}
            </div>
          </div>

          <div className="bg-[#0c0c0e] border border-zinc-800 overflow-hidden">
             <div className="flex items-center justify-between px-4 py-2 bg-[#141418] border-b border-zinc-800 text-[11px] text-zinc-400 font-mono"><span>{platform} / {install.label}</span><div className="flex items-center gap-2"><button onClick={copyCommand} className="flex items-center gap-1 px-2 py-1 bg-[#24242a] text-zinc-200 cursor-pointer">{copied ? <HiOutlineCheck className="text-emerald-400" /> : <HiOutlineClipboard />}{copied ? "Copied" : "Copy"}</button>{install.packageUrl && <a href={install.packageUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 px-2 py-1 bg-[#ea580c] text-white hover:bg-[#c2410c]"><HiOutlineArrowDownTray />Official docs</a>}</div></div>
             <pre className="p-5 text-xs text-zinc-200 font-mono leading-6 overflow-x-auto"><code>{commands[platform]}</code></pre>
           </div>

           <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-[#fafafa] border border-[#e4e4e7] text-xs">
             <span className="text-zinc-500 font-mono">{install.note}</span>
            <span className="text-[#ea580c] font-mono font-bold">{agent.pricingFormatted}</span>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AgentDetailPage;
