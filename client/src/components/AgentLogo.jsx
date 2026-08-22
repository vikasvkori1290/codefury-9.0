import React, { useState } from "react";
import {
  HiOutlineCodeBracket,
  HiOutlineCommandLine,
  HiOutlineCpuChip,
  HiOutlineGlobeAlt,
  HiOutlineSparkles,
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
