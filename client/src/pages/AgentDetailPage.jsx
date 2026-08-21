import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  HiOutlineArrowLeft,
  HiOutlineShieldCheck,
  HiOutlineStar,
  HiOutlineBolt,
  HiOutlineCpuChip,
  HiOutlineWrenchScrewdriver,
  HiOutlinePuzzlePiece,
  HiOutlineCheckCircle,
  HiOutlinePlay,
  HiOutlineCurrencyDollar,
  HiOutlineChartBar,
  HiOutlineClipboard,
  HiOutlineCheck,
  HiOutlineArrowDownTray,
  HiOutlineRocketLaunch,
  HiOutlineSparkles,
} from "react-icons/hi2";
import { AGENTS } from "./AgentMarketplacePage";

const SAMPLE_TASKS = [
  { prompt: "Migrate this Express app to use ES modules and add health checks", status: "pass", latency: 1250, toolsUsed: ["Terminal", "GitHub"] },
  { prompt: "Research latest LLM eval harnesses and produce 1-pager with citations", status: "pass", latency: 2100, toolsUsed: ["Tavily", "Notion"] },
  { prompt: "Auto-triage 20 Zendesk tickets and draft replies (deflect if possible)", status: "pass", latency: 980, toolsUsed: ["Zendesk", "Slack"] },
  { prompt: "Generate monthly revenue dashboard from BigQuery + narrative", status: "pass", latency: 1650, toolsUsed: ["BigQuery", "Python"] },
];

const REVIEWS = [
  { user: "@sarah_dev", rating: 5, comment: "Saved us 12 hrs/week on PR reviews. Feels like a senior eng on the team.", date: "2d ago" },
  { user: "@mike_ops", rating: 5, comment: "Workflow healing is insane — auto-retries with correct context. No more Zapier pain.", date: "1w ago" },
  { user: "@priya_ai", rating: 4, comment: "SupportGenius deflected 60% day one. Handoff to human is seamless.", date: "3d ago" },
];

export const AgentDetailPage = () => {
  const { id } = useParams();
  const agent = AGENTS.find((a) => a.id === id);
  const [activeTab, setActiveTab] = useState("overview"); // overview | tools | benchmark | pricing | reviews
  const [isInstallCopied, setIsInstallCopied] = useState(false);
  const [installMode, setInstallMode] = useState("curl"); // curl | python | node

  if (!agent) {
    return (
      <div className="min-h-screen bg-[#fafafa] p-12 text-center font-mono text-xs text-zinc-500">
        Agent not found. <Link to="/agents" className="text-[#ea580c] underline">Return to Agent Marketplace</Link>.
      </div>
    );
  }

  const installSnippet = {
    curl: `curl -X POST https://api.modelhub.dev/v1/agents/${agent.id}/run \\
  -H "Authorization: Bearer $MODELHUB_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"task": "Your task here", "tools": ["${agent.tools.slice(0, 2).join('", "')}"]}'`,
    python: `from modelhub import Agent

agent = Agent("${agent.id}", api_key="sk-...")
result = agent.run("Your task here")
print(result.output)`,
    node: `import { ModelHubAgent } from "@modelhub/sdk";

const agent = new ModelHubAgent("${agent.id}");
const result = await agent.run("Your task here");
console.log(result.output);`,
  };

  const copySnippet = () => {
    navigator.clipboard.writeText(installSnippet[installMode]);
    setIsInstallCopied(true);
    setTimeout(() => setIsInstallCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-zinc-900 font-sans selection:bg-[#ea580c] selection:text-white py-10 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center justify-between font-mono text-xs text-zinc-500">
          <Link to="/agents" className="flex items-center gap-1.5 hover:text-black transition-colors">
            <HiOutlineArrowLeft /> <span>Back to Agent Marketplace</span>
          </Link>
          <span className="text-zinc-400">Agent ID: {agent.id}</span>
        </div>

        {/* HERO */}
        <div className="p-6 sm:p-8 bg-white border border-[#e4e4e7] shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-800 font-mono text-xs font-bold flex items-center gap-1">
                <HiOutlineShieldCheck /> Verified Publisher
              </span>
              <span className="px-2.5 py-0.5 bg-zinc-100 border border-[#e4e4e7] text-zinc-700 font-mono text-xs">{agent.category}</span>
              <span className="px-2.5 py-0.5 bg-amber-50 border border-amber-200 text-amber-700 font-mono text-xs font-bold flex items-center gap-1">
                <HiOutlineStar className="text-amber-500" /> {agent.rating} • {agent.installs} installs
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-zinc-900 text-white flex items-center justify-center font-mono font-bold text-lg">
                {agent.avatar}
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950">{agent.displayName}</h1>
                <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-zinc-500">
                  <span className="text-zinc-800 font-bold">{agent.creator}</span>
                  <span>•</span>
                  <span className="uppercase font-bold text-[#ea580c]">{agent.type}</span>
                  <span>•</span>
                  <span>{agent.pricingFormatted}</span>
                </div>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-zinc-600 max-w-xl leading-relaxed">{agent.longDescription}</p>

            <div className="flex flex-wrap gap-2">
              {agent.tags.map((t) => (
                <span key={t} className="px-2 py-0.5 bg-[#fff7ed] border border-orange-200 text-[#ea580c] font-mono text-[11px] font-bold">{t}</span>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 shrink-0 lg:items-end">
            <div className="p-5 bg-white border border-emerald-300 text-right font-mono space-y-1 shadow-xs min-w-[180px]">
              <span className="text-[10px] text-zinc-500 block uppercase">Task Success Rate</span>
              <div className="text-3xl font-bold text-emerald-700">{agent.successRate}%</div>
              <span className="text-[10px] text-zinc-400 block">Avg latency {agent.latencyMs}ms</span>
            </div>
            <button
              onClick={() => setActiveTab("pricing")}
              className="w-full sm:w-auto px-6 py-3 bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold text-xs font-mono flex items-center justify-center gap-2 shadow-xs active:scale-95 cursor-pointer"
            >
              <HiOutlineArrowDownTray /> <span>Install Agent (1-Click)</span>
            </button>
            <Link
              to="/live-bench"
              className="w-full sm:w-auto px-6 py-2.5 bg-white border border-zinc-300 text-zinc-800 font-bold text-xs font-mono text-center hover:bg-zinc-50 flex items-center justify-center gap-2"
            >
              <HiOutlinePlay /> Try in Live Bench
            </Link>
          </div>
        </div>

        {/* STATS BAR */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
          <div className="p-4 bg-white border border-[#e4e4e7] shadow-xs space-y-1">
            <span className="text-[10px] text-zinc-400 block uppercase font-semibold">Installs</span>
            <div className="text-xl font-bold text-zinc-900">{agent.installs}</div>
            <span className="text-[10px] text-zinc-500">Across ModelHub teams</span>
          </div>
          <div className="p-4 bg-white border border-[#e4e4e7] shadow-xs space-y-1">
            <span className="text-[10px] text-zinc-400 block uppercase font-semibold">Avg Completion</span>
            <div className="text-xl font-bold text-emerald-700">{agent.successRate}%</div>
            <span className="text-[10px] text-zinc-500">Last 30 days</span>
          </div>
          <div className="p-4 bg-white border border-[#e4e4e7] shadow-xs space-y-1">
            <span className="text-[10px] text-zinc-400 block uppercase font-semibold">Median Latency</span>
            <div className="text-xl font-bold text-zinc-900">{agent.latencyMs} ms</div>
            <span className="text-[10px] text-zinc-500">End-to-end run</span>
          </div>
          <div className="p-4 bg-white border border-[#e4e4e7] shadow-xs space-y-1">
            <span className="text-[10px] text-zinc-400 block uppercase font-semibold">Pricing</span>
            <div className="text-xl font-bold text-[#ea580c]">{agent.pricingFormatted}</div>
            <span className="text-[10px] text-zinc-500">Tier: {agent.priceTier}</span>
          </div>
        </div>

        {/* TABS */}
        <div className="bg-white border border-[#e4e4e7] shadow-xs">
          <div className="flex flex-wrap gap-1 p-2 bg-[#fafafa] border-b border-[#e4e4e7] font-mono text-xs">
            {[
              { id: "overview", label: "Overview", icon: <HiOutlinePuzzlePiece /> },
              { id: "tools", label: "Tools & Capabilities", icon: <HiOutlineWrenchScrewdriver /> },
              { id: "benchmark", label: "Benchmark & Runs", icon: <HiOutlineChartBar /> },
              { id: "pricing", label: "Install & Pricing", icon: <HiOutlineCurrencyDollar /> },
              { id: "reviews", label: "Reviews", icon: <HiOutlineStar /> },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`px-3 py-2 border flex items-center gap-1.5 transition-all cursor-pointer ${activeTab === t.id ? "bg-white text-zinc-900 font-bold border-[#e4e4e7] shadow-xs" : "text-zinc-600 hover:text-black border-transparent"}`}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {activeTab === "overview" && (
              <>
                <div>
                  <h3 className="text-sm font-bold text-zinc-950 flex items-center gap-2"><HiOutlineSparkles className="text-[#ea580c]" /> What this agent does</h3>
                  <p className="text-xs text-zinc-600 leading-relaxed mt-2">{agent.longDescription}</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-[#fafafa] border border-[#e4e4e7] space-y-2">
                    <h4 className="text-xs font-bold font-mono uppercase text-zinc-900 flex items-center gap-1"><HiOutlineBolt className="text-[#ea580c]" /> Capabilities</h4>
                    <ul className="space-y-1.5">
                      {agent.capabilities.map((c) => (
                        <li key={c} className="text-xs flex items-center gap-2 text-zinc-700"><HiOutlineCheckCircle className="text-emerald-600 shrink-0" /> {c}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-4 bg-[#fafafa] border border-[#e4e4e7] space-y-2">
                    <h4 className="text-xs font-bold font-mono uppercase text-zinc-900 flex items-center gap-1"><HiOutlineCpuChip className="text-[#ea580c]" /> Ideal Use Cases</h4>
                    <ul className="space-y-1.5">
                      {agent.useCases.map((u) => (
                        <li key={u} className="text-xs flex items-center gap-2 text-zinc-700"><span className="w-1 h-1 bg-[#ea580c] shrink-0" /> {u}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="p-4 bg-zinc-900 text-zinc-100 border border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold font-mono">Run it where your work already lives — Slack, GitHub, or API</p>
                    <p className="text-[11px] text-zinc-400 font-mono">All runs are logged, auditable & reversible. Human-in-loop approvals supported.</p>
                  </div>
                  <button onClick={() => setActiveTab("pricing")} className="px-5 py-2.5 bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold text-xs font-mono flex items-center gap-1.5 shrink-0 cursor-pointer">
                    <HiOutlineRocketLaunch /> Install to Workspace
                  </button>
                </div>
              </>
            )}

            {activeTab === "tools" && (
              <>
                <div>
                  <h3 className="text-sm font-bold text-zinc-950">Tool Integrations</h3>
                  <p className="text-xs text-zinc-500 font-mono mt-1">Agent uses ReAct + tool-calling. Each tool is sandboxed with scoped permissions.</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                  {agent.tools.map((tool) => (
                    <div key={tool} className="p-4 bg-[#fafafa] border border-[#e4e4e7] text-center space-y-1.5 hover:border-zinc-400 transition-colors">
                      <div className="w-8 h-8 mx-auto bg-white border border-[#e4e4e7] flex items-center justify-center text-[10px] font-mono font-bold text-zinc-700">{tool.slice(0, 2).toUpperCase()}</div>
                      <div className="text-xs font-bold text-zinc-900">{tool}</div>
                      <div className="text-[10px] font-mono text-emerald-700">● Connected</div>
                    </div>
                  ))}
                </div>

                <div className="grid sm:grid-cols-3 gap-3 font-mono text-xs">
                  <div className="p-4 bg-white border border-[#e4e4e7] space-y-1">
                    <span className="text-[10px] text-zinc-400 block uppercase font-semibold">Auth</span>
                    <div className="font-bold text-zinc-900">OAuth + Scoped Tokens</div>
                    <span className="text-[11px] text-zinc-500">Revoke per-tool anytime</span>
                  </div>
                  <div className="p-4 bg-white border border-[#e4e4e7] space-y-1">
                    <span className="text-[10px] text-zinc-400 block uppercase font-semibold">Sandbox</span>
                    <div className="font-bold text-zinc-900">Docker + No egress by default</div>
                    <span className="text-[11px] text-zinc-500">Network allowlist required</span>
                  </div>
                  <div className="p-4 bg-white border border-[#e4e4e7] space-y-1">
                    <span className="text-[10px] text-zinc-400 block uppercase font-semibold">Audit</span>
                    <div className="font-bold text-zinc-900">Full trace & replay</div>
                    <span className="text-[11px] text-zinc-500">Every tool call logged</span>
                  </div>
                </div>
              </>
            )}

            {activeTab === "benchmark" && (
              <>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#e4e4e7] pb-4">
                  <div>
                    <h3 className="text-sm font-bold text-zinc-950 flex items-center gap-2"><HiOutlineChartBar className="text-[#ea580c]" /> Task Success Benchmark</h3>
                    <p className="text-xs text-zinc-500 font-mono">Real user tasks • Pass = completed without human correction • n = 1.2k runs</p>
                  </div>
                  <span className="px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 font-mono text-xs font-bold">{agent.successRate}% Success • {agent.latencyMs}ms median</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse font-mono text-xs">
                    <thead>
                      <tr className="bg-[#fafafa] text-zinc-500 border-b border-[#e4e4e7] text-[11px]">
                        <th className="p-3">Task Prompt</th>
                        <th className="p-3">Tools Used</th>
                        <th className="p-3">Latency</th>
                        <th className="p-3 text-center">Result</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e4e4e7] text-zinc-700">
                      {SAMPLE_TASKS.map((t, i) => (
                        <tr key={i} className="hover:bg-zinc-50">
                          <td className="p-3 max-w-xs text-zinc-800 font-sans text-xs">{t.prompt}</td>
                          <td className="p-3"><span className="flex flex-wrap gap-1">{t.toolsUsed.map((tool) => <span key={tool} className="px-1.5 py-0.5 bg-white border border-[#e4e4e7] text-[10px]">{tool}</span>)}</span></td>
                          <td className="p-3">{t.latency} ms</td>
                          <td className="p-3 text-center"><span className="px-2 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold">✓ PASS</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-[11px] text-zinc-500 font-mono">Want custom eval? <Link to="/live-bench" className="text-[#ea580c] font-bold hover:underline">Run your own tasks in Live Bench →</Link></p>
              </>
            )}

            {activeTab === "pricing" && (
              <>
                <div className="grid sm:grid-cols-3 gap-4 font-mono text-xs">
                  <div className="p-5 bg-white border-2 border-zinc-900 space-y-2">
                    <span className="text-[10px] text-zinc-500 block uppercase font-semibold">Starter</span>
                    <div className="text-2xl font-bold text-zinc-900">Free <span className="text-xs font-normal text-zinc-500">• {agent.tools.length} tools</span></div>
                    <ul className="text-[11px] text-zinc-600 space-y-1 pt-2">
                      <li>• 100 runs / month</li>
                      <li>• Community support</li>
                      <li>• Standard latency</li>
                    </ul>
                    <button className="w-full mt-3 py-2 bg-white border border-zinc-300 font-bold hover:bg-zinc-50 cursor-pointer">Start Free</button>
                  </div>
                  <div className="p-5 bg-[#fff7ed] border-2 border-[#ea580c] space-y-2 relative">
                    <span className="absolute -top-2 left-4 px-2 py-0.5 bg-[#ea580c] text-white text-[10px] font-bold">MOST POPULAR</span>
                    <span className="text-[10px] text-[#ea580c] block uppercase font-bold">Pro</span>
                    <div className="text-2xl font-bold text-zinc-900">{agent.pricingFormatted} <span className="text-xs font-normal text-zinc-500">per run</span></div>
                    <ul className="text-[11px] text-zinc-600 space-y-1 pt-2">
                      <li>• Unlimited runs</li>
                      <li>• Priority queue & 1.5x faster</li>
                      <li>• Human-in-loop approvals</li>
                    </ul>
                    <button className="w-full mt-3 py-2 bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold cursor-pointer shadow-xs">Install Pro</button>
                  </div>
                  <div className="p-5 bg-white border border-[#e4e4e7] space-y-2">
                    <span className="text-[10px] text-zinc-500 block uppercase font-semibold">Enterprise</span>
                    <div className="text-2xl font-bold text-zinc-900">Custom</div>
                    <ul className="text-[11px] text-zinc-600 space-y-1 pt-2">
                      <li>• VPC / Self-hosted</li>
                      <li>• SSO, audit & SLA</li>
                      <li>• Dedicated support</li>
                    </ul>
                    <button className="w-full mt-3 py-2 bg-zinc-900 hover:bg-black text-white font-bold cursor-pointer">Contact Sales</button>
                  </div>
                </div>

                {/* Install snippet */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold font-mono uppercase">Install via API / SDK</h4>
                    <div className="inline-flex border border-[#e4e4e7] bg-[#fafafa] p-0.5 text-xs font-mono">
                      {["curl", "python", "node"].map((m) => (
                        <button key={m} onClick={() => setInstallMode(m)} className={`px-3 py-1 border cursor-pointer ${installMode === m ? "bg-white font-bold border-[#e4e4e7] shadow-xs" : "border-transparent text-zinc-600 hover:text-black"}`}>
                          {m === "node" ? "Node" : m}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="border border-[#27272a] bg-[#0c0c0e] overflow-hidden">
                    <div className="flex items-center justify-between px-3 py-1.5 bg-[#141418] border-b border-[#27272a] text-[11px] text-zinc-400 font-mono">
                      <span className="uppercase">{installMode}</span>
                      <button onClick={copySnippet} className="flex items-center gap-1 text-zinc-300 hover:text-white bg-[#1e1e24] px-2 py-0.5 border border-[#27272a] cursor-pointer">
                        {isInstallCopied ? <HiOutlineCheck className="text-emerald-400" /> : <HiOutlineClipboard />} {isInstallCopied ? "Copied" : "Copy Snippet"}
                      </button>
                    </div>
                    <pre className="p-4 text-xs text-zinc-200 font-mono overflow-x-auto leading-5"><code>{installSnippet[installMode]}</code></pre>
                  </div>
                  <p className="text-[11px] text-zinc-500 font-mono">All installs are routed through ModelHub — unified billing, auth & tracing. <span className="text-zinc-800 font-bold">85% to creator {agent.creator}</span>.</p>
                </div>
              </>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-[#fafafa] border border-[#e4e4e7]">
                  <div className="text-3xl font-bold text-zinc-900 font-mono">{agent.rating} <span className="text-amber-500">★</span></div>
                  <div className="text-xs font-mono">
                    <div className="font-bold text-zinc-900">Excellent • {agent.installs} installs</div>
                    <div className="text-zinc-500">{agent.successRate}% tasks succeeded without edit</div>
                  </div>
                </div>
                <div className="space-y-3">
                  {REVIEWS.map((r) => (
                    <div key={r.user} className="p-4 bg-white border border-[#e4e4e7] flex gap-3">
                      <div className="w-8 h-8 bg-zinc-100 border border-[#e4e4e7] flex items-center justify-center font-mono font-bold text-xs shrink-0">{r.user.slice(1, 3).toUpperCase()}</div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs font-mono">
                          <span className="font-bold text-zinc-900">{r.user}</span>
                          <span className="text-amber-500">{"★".repeat(r.rating)}</span>
                          <span className="text-zinc-400">• {r.date}</span>
                        </div>
                        <p className="text-xs text-zinc-600 leading-relaxed">{r.comment}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related */}
        <div className="bg-white border border-[#e4e4e7] p-6 shadow-xs space-y-3">
          <h3 className="text-xs font-mono font-bold uppercase text-zinc-900">Similar Agents</h3>
          <div className="grid sm:grid-cols-3 gap-3">
            {AGENTS.filter((a) => a.id !== agent.id && a.category === agent.category).slice(0, 3).map((a) => (
              <Link key={a.id} to={`/agents/${a.id}`} className="p-4 border border-[#e4e4e7] hover:border-zinc-400 bg-[#fafafa] hover:bg-white transition-colors group">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-zinc-900 text-white flex items-center justify-center font-mono font-bold text-xs">{a.avatar}</div>
                  <div className="font-bold text-xs text-zinc-900 group-hover:text-[#ea580c]">{a.displayName}</div>
                </div>
                <p className="text-[11px] text-zinc-500 font-mono mt-1 line-clamp-2">{a.description}</p>
                <span className="text-[11px] font-mono text-[#ea580c] font-bold">View →</span>
              </Link>
            ))}
            {AGENTS.filter((a) => a.id !== agent.id && a.category === agent.category).length === 0 &&
              AGENTS.filter((a) => a.id !== agent.id).slice(0, 3).map((a) => (
                <Link key={a.id} to={`/agents/${a.id}`} className="p-4 border border-[#e4e4e7] hover:border-zinc-400 bg-[#fafafa] hover:bg-white transition-colors group">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-zinc-900 text-white flex items-center justify-center font-mono font-bold text-xs">{a.avatar}</div>
                    <div className="font-bold text-xs text-zinc-900 group-hover:text-[#ea580c]">{a.displayName}</div>
                  </div>
                  <p className="text-[11px] text-zinc-500 font-mono mt-1 line-clamp-2">{a.description}</p>
                  <span className="text-[11px] font-mono text-[#ea580c] font-bold">View →</span>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentDetailPage;
