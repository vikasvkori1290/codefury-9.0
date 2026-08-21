import React, { useEffect, useMemo, useState } from "react";
import {
  HiOutlineArrowTopRightOnSquare,
  HiOutlineCpuChip,
  HiOutlineExclamationTriangle,
  HiOutlineMagnifyingGlass,
  HiOutlineSparkles,
} from "react-icons/hi2";

const DATA_URL =
  "https://raw.githubusercontent.com/swe-bench/swe-bench.github.io/master/data/leaderboards.json";

const BOARDS = [
  { id: "Verified", label: "Verified", instances: 500, description: "A human-filtered subset of SWE-bench." },
  { id: "Multimodal", label: "Multimodal", instances: 517, description: "Issues described with visual elements." },
  { id: "Multilingual", label: "Multilingual", instances: 300, description: "Tasks across 9 programming languages." },
  { id: "Lite", label: "Lite", instances: 300, description: "A curated subset for lower-cost evaluation." },
  { id: "Test", label: "Full", instances: 2294, description: "The original SWE-bench benchmark." },
  { id: "bash-only", label: "Bash Only", instances: 500, description: "Language models evaluated in a minimal bash environment." },
];

const DISPLAY_FIELDS = [
  ["agent", "Agent"],
  ["model_display", "Model"],
  ["model_org", "Model org"],
  ["agent_org", "Agent org"],
  ["reasoning_effort", "Reasoning effort"],
  ["model_release_date", "Model release date"],
  ["mini-swe-agent_version", "mini-SWE-agent version"],
  ["folder", "Submission folder"],
  ["cost", "Cost"],
  ["instance_calls", "Instance calls"],
  ["instance_cost", "Instance cost"],
  ["os_model", "Open model"],
  ["os_system", "Open system"],
  ["checked", "Checked"],
  ["tags", "Tags"],
];

const formatValue = (value) => {
  if (value === null || value === undefined || value === "") return "Not reported";
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "number") return value.toLocaleString(undefined, { maximumFractionDigits: 4 });
  return String(value);
};

const scoreLabel = (score) =>
  typeof score === "number" ? `${score.toFixed(2).replace(/\.00$/, "")}%` : "-";

const LiveBenchPage = () => {
  const [boards, setBoards] = useState([]);
  const [activeBoard, setActiveBoard] = useState("Verified");
  const [searchQuery, setSearchQuery] = useState("");
  const [agentFilter, setAgentFilter] = useState("all");
  const [openWeightsOnly, setOpenWeightsOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    fetch(DATA_URL, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`Leaderboard request failed (${response.status})`);
        return response.json();
      })
      .then((payload) => setBoards(payload.leaderboards || []))
      .catch((requestError) => {
        if (requestError.name !== "AbortError") setError(requestError.message);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  const currentBoard = useMemo(
    () => boards.find((board) => board.name.toLowerCase() === activeBoard.toLowerCase()),
    [activeBoard, boards],
  );

  const agents = useMemo(
    () => [...new Set((currentBoard?.results || []).map((entry) => entry.agent).filter(Boolean))].sort(),
    [currentBoard],
  );

  const results = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return (currentBoard?.results || [])
      .filter((entry) => {
        if (entry.warning) return false;
        if (agentFilter !== "all" && entry.agent !== agentFilter) return false;
        if (openWeightsOnly && !entry.os_model) return false;
        if (!query) return true;
        return [entry.name, entry.agent, entry.model_display, entry.model_org, ...(entry.tags || [])]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(query);
      })
      .sort((a, b) => (b.resolved || 0) - (a.resolved || 0));
  }, [agentFilter, currentBoard, openWeightsOnly, searchQuery]);

  const boardInfo = BOARDS.find((board) => board.id === activeBoard) || BOARDS[0];

  return (
    <main className="min-h-screen bg-[#fafafa] px-4 py-8 text-zinc-900 selection:bg-[#ea580c] selection:text-white sm:px-8">
      <div className="mx-auto max-w-7xl space-y-5">
        <header className="space-y-3 border border-[#e4e4e7] bg-white p-6 shadow-xs">
          <div className="inline-flex items-center gap-2 border border-orange-200 bg-orange-50 px-2.5 py-0.5 font-mono text-xs font-bold text-[#ea580c]">
            <HiOutlineSparkles />
            <span>Core Fury / Live Bench</span>
          </div>
          <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-end">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-zinc-950 sm:text-3xl">SWE-bench Leaderboards</h1>
              <p className="mt-1 max-w-3xl text-xs text-zinc-500 sm:text-sm">
                Official model and coding-agent results, synchronized from the SWE-bench leaderboard data.
              </p>
            </div>
            <a className="inline-flex items-center gap-2 self-start border border-zinc-200 px-3 py-2 font-mono text-[11px] font-bold text-zinc-700 hover:border-[#ea580c] hover:text-[#ea580c] lg:self-auto" href="https://www.swebench.com/" target="_blank" rel="noreferrer">
              Source leaderboard <HiOutlineArrowTopRightOnSquare />
            </a>
          </div>
        </header>

        <nav className="flex gap-1 overflow-x-auto border border-[#e4e4e7] bg-white p-2 shadow-xs" aria-label="SWE-bench benchmark tabs">
          {BOARDS.map((board) => (
            <button key={board.id} type="button" onClick={() => { setActiveBoard(board.id); setAgentFilter("all"); }} className={`whitespace-nowrap px-4 py-2 font-mono text-[11px] font-bold transition-colors ${activeBoard === board.id ? "bg-zinc-950 text-white" : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"}`}>
              {board.label}
            </button>
          ))}
        </nav>

        <section className="space-y-4 border border-[#e4e4e7] bg-white p-4 shadow-xs">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="font-bold text-zinc-900">{boardInfo.label}</h2>
              <p className="font-mono text-[11px] text-zinc-500">{boardInfo.description} {boardInfo.instances.toLocaleString()} instances.</p>
            </div>
            <div className="flex flex-wrap gap-2 font-mono text-[11px]">
              <span className="border border-zinc-200 bg-zinc-50 px-2.5 py-1.5">{results.length} results</span>
              <span className="border border-zinc-200 bg-zinc-50 px-2.5 py-1.5">Sorted by resolved</span>
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative flex-1">
              <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} className="w-full border border-[#e4e4e7] bg-[#fafafa] py-2 pl-9 pr-3 font-mono text-xs outline-none focus:border-[#ea580c]" placeholder="Search model, agent, organization, or tag..." />
            </div>
            <select value={agentFilter} onChange={(event) => setAgentFilter(event.target.value)} className="border border-[#e4e4e7] bg-[#fafafa] px-3 py-2 font-mono text-xs outline-none focus:border-[#ea580c]">
              <option value="all">All agents</option>
              {agents.map((agent) => <option key={agent} value={agent}>{agent}</option>)}
            </select>
            <label className="flex items-center gap-2 border border-[#e4e4e7] px-3 py-2 font-mono text-xs text-zinc-600">
              <input type="checkbox" checked={openWeightsOnly} onChange={(event) => setOpenWeightsOnly(event.target.checked)} /> Open weights
            </label>
          </div>
        </section>

        {loading && <div className="border border-[#e4e4e7] bg-white p-12 text-center font-mono text-xs text-zinc-500"><HiOutlineCpuChip className="mx-auto mb-3 text-2xl" />Loading official leaderboard data...</div>}
        {error && <div className="flex items-center gap-2 border border-red-200 bg-red-50 p-4 font-mono text-xs text-red-700"><HiOutlineExclamationTriangle />{error}. Check your connection and reload the page.</div>}
        {!loading && !error && (
          <div className="overflow-hidden border border-[#e4e4e7] bg-white shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[940px] border-collapse text-left">
                <thead className="bg-zinc-950 font-mono text-[10px] uppercase tracking-wide text-white">
                  <tr><th className="w-14 px-4 py-3">#</th><th className="px-4 py-3">Model / system</th><th className="px-4 py-3">Agent</th><th className="px-4 py-3">Resolved</th><th className="px-4 py-3">Date</th><th className="px-4 py-3">Cost</th><th className="px-4 py-3">Details</th></tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {results.map((entry, index) => (
                    <tr key={`${entry.folder || entry.name}-${index}`} className="align-top hover:bg-orange-50/40">
                      <td className="px-4 py-4 font-mono text-xs text-zinc-400">{index + 1}</td>
                      <td className="max-w-[360px] px-4 py-4"><div className="font-bold text-zinc-900">{entry.name}</div><div className="mt-1 font-mono text-[10px] text-zinc-500">{entry.model_display || entry.model || "Model not specified"}{entry.model_org ? ` / ${entry.model_org}` : ""}</div>{entry.tags?.length > 0 && <div className="mt-2 flex flex-wrap gap-1">{entry.tags.map((tag) => <span key={tag} className="border border-zinc-200 px-1.5 py-0.5 font-mono text-[9px] text-zinc-500">{tag}</span>)}</div>}</td>
                      <td className="px-4 py-4 text-xs text-zinc-700">{entry.agent || "-"}<div className="mt-1 font-mono text-[10px] text-zinc-400">{entry.agent_org || ""}</div></td>
                      <td className="px-4 py-4 font-mono text-sm font-bold text-emerald-700">{scoreLabel(entry.resolved)}</td>
                      <td className="whitespace-nowrap px-4 py-4 font-mono text-xs text-zinc-600">{entry.date || "-"}</td>
                      <td className="whitespace-nowrap px-4 py-4 font-mono text-xs text-zinc-600">{entry.cost == null ? "-" : `$${Number(entry.cost).toFixed(2)}`}</td>
                      <td className="px-4 py-4"><details className="min-w-[110px]"><summary className="cursor-pointer font-mono text-[10px] font-bold text-[#ea580c]">View entry</summary><div className="mt-3 space-y-2 border-l-2 border-orange-200 pl-3 text-[11px]">{DISPLAY_FIELDS.map(([field, label]) => <div key={field}><span className="font-bold text-zinc-500">{label}: </span><span className="break-words text-zinc-700">{formatValue(entry[field])}</span></div>)}<div className="flex flex-wrap gap-2 pt-1">{entry.site && <a href={entry.site} target="_blank" rel="noreferrer" className="font-bold text-[#ea580c]">Model site</a>}{entry.logs && <a href={entry.logs} target="_blank" rel="noreferrer" className="font-bold text-[#ea580c]">Logs</a>}{entry.trajs && <a href={entry.trajs} target="_blank" rel="noreferrer" className="font-bold text-[#ea580c]">Trajectories</a>}</div></div></details></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!results.length && <div className="p-12 text-center font-mono text-xs text-zinc-500">No leaderboard entries match these filters.</div>}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default LiveBenchPage;
