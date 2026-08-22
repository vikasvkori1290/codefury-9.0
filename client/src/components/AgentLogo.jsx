import React, { useState } from "react";
import {
  HiOutlineCodeBracket,
  HiOutlineCommandLine,
  HiOutlineCpuChip,
  HiOutlineBolt,
  HiOutlineChartBar,
  HiOutlineGlobeAlt,
  HiOutlineBookOpen,
  HiOutlineSparkles,
  HiOutlineShieldCheck,
} from "react-icons/hi2";

const LOGO_STYLES = {
  openhands: { initials: "OH", icon: HiOutlineCodeBracket, color: "bg-orange-100 text-orange-700" },
  cline: { initials: "CL", icon: HiOutlineSparkles, color: "bg-violet-100 text-violet-700" },
  aider: { initials: "AI", icon: HiOutlineCommandLine, color: "bg-emerald-100 text-emerald-700" },
  "claude-code": { initials: "CC", icon: HiOutlineSparkles, color: "bg-amber-100 text-amber-700" },
  "openai-codex": { initials: "CX", icon: HiOutlineCpuChip, color: "bg-teal-100 text-teal-700" },
  devin: { initials: "DV", icon: HiOutlineGlobeAlt, color: "bg-blue-100 text-blue-700" },
  "cursor-agent": { initials: "CU", icon: HiOutlineCodeBracket, color: "bg-zinc-200 text-zinc-800" },
  "gemini-code-assist": { initials: "GC", icon: HiOutlineSparkles, color: "bg-sky-100 text-sky-700" },
  "research-scout-pro": { initials: "P", icon: HiOutlineGlobeAlt, color: "bg-indigo-100 text-indigo-700" },
  "ops-automator": { initials: "Z", icon: HiOutlineBolt, color: "bg-orange-100 text-orange-700" },
  "support-genius": { initials: "F", icon: HiOutlineSparkles, color: "bg-blue-100 text-blue-700" },
  "dataforge-analyst": { initials: "J", icon: HiOutlineChartBar, color: "bg-violet-100 text-violet-700" },
  "legal-eagle": { initials: "H", icon: HiOutlineShieldCheck, color: "bg-emerald-100 text-emerald-700" },
  "growth-hacker": { initials: "B", icon: HiOutlineChartBar, color: "bg-orange-100 text-orange-700" },
  "secops-guardian": { initials: "S", icon: HiOutlineShieldCheck, color: "bg-red-100 text-red-700" },
  "content-crafter": { initials: "J", icon: HiOutlineSparkles, color: "bg-amber-100 text-amber-700" },
  "design-director": { initials: "C", icon: HiOutlineSparkles, color: "bg-cyan-100 text-cyan-700" },
  "study-guide": { initials: "K", icon: HiOutlineBookOpen, color: "bg-green-100 text-green-700" },
};

// Prefer SVG brand marks, then use the publisher's own website favicon. The
// second source keeps the card useful when an SVG asset is unavailable.
const LOGO_SOURCES = {
  openhands: ["https://cdn.simpleicons.org/openhands", "https://www.google.com/s2/favicons?domain=openhands.dev&sz=128"],
  cline: ["https://cline.bot/assets/branding/logos/cline-icon-black.svg", "https://www.google.com/s2/favicons?domain=cline.bot&sz=128"],
  aider: ["https://aider.chat/assets/aider-square.jpg", "https://www.google.com/s2/favicons?domain=aider.chat&sz=128"],
  "claude-code": ["https://cdn.simpleicons.org/anthropic", "https://www.google.com/s2/favicons?domain=anthropic.com&sz=128"],
  "openai-codex": ["https://www.google.com/s2/favicons?domain=openai.com&sz=128"],
  devin: ["https://cdn.simpleicons.org/devin", "https://www.google.com/s2/favicons?domain=devin.ai&sz=128"],
  "cursor-agent": ["https://cdn.simpleicons.org/cursor", "https://www.google.com/s2/favicons?domain=cursor.com&sz=128"],
  "gemini-code-assist": ["https://www.google.com/s2/favicons?domain=codeassist.google&sz=128"],
  "research-scout-pro": ["https://www.google.com/s2/favicons?domain=perplexity.ai&sz=128"],
  "ops-automator": ["https://www.google.com/s2/favicons?domain=zapier.com&sz=128"],
  "support-genius": ["https://www.google.com/s2/favicons?domain=intercom.com&sz=128"],
  "dataforge-analyst": ["https://www.google.com/s2/favicons?domain=julius.ai&sz=128"],
  "legal-eagle": ["https://www.google.com/s2/favicons?domain=harvey.ai&sz=128"],
  "growth-hacker": ["https://www.google.com/s2/favicons?domain=hubspot.com&sz=128"],
  "secops-guardian": ["https://www.google.com/s2/favicons?domain=snyk.io&sz=128"],
  "content-crafter": ["https://www.google.com/s2/favicons?domain=jasper.ai&sz=128"],
  "design-director": ["https://www.google.com/s2/favicons?domain=canva.com&sz=128"],
  "study-guide": ["https://www.google.com/s2/favicons?domain=khanmigo.ai&sz=128"],
};

export const AgentLogo = ({ agent, large = false }) => {
  const sources = LOGO_SOURCES[agent.id] || [];
  const [sourceIndex, setSourceIndex] = useState(0);
  const style = LOGO_STYLES[agent.id] || { initials: "AI", icon: HiOutlineCpuChip, color: "bg-zinc-100 text-zinc-700" };
  const Icon = style.icon;

  return (
    <div className={`${large ? "h-14 w-14 p-2.5" : "h-11 w-11 p-2"} ${style.color} relative flex shrink-0 items-center justify-center overflow-hidden border border-current/10`} aria-label={`${agent.company || agent.creator} logo`}>
      {sourceIndex < sources.length && <img src={sources[sourceIndex]} alt="" className="relative z-10 h-full w-full object-contain" onError={() => setSourceIndex((index) => index + 1)} />}
      {sourceIndex >= sources.length && <><Icon className={`${large ? "text-2xl" : "text-lg"} absolute opacity-25`} /><span className={`${large ? "text-sm" : "text-[11px]"} relative font-mono font-bold tracking-tight`}>{style.initials}</span></>}
    </div>
  );
};

export default AgentLogo;
