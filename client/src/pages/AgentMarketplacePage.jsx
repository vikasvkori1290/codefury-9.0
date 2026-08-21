import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  HiOutlineMagnifyingGlass,
  HiOutlineSparkles,
  HiOutlineBolt,
  HiOutlineCpuChip,
  HiOutlineShieldCheck,
  HiOutlineWrenchScrewdriver,
  HiOutlineChartBar,
  HiOutlineCurrencyDollar,
  HiOutlineStar,
  HiOutlineArrowDownTray,
  HiOutlinePlay,
  HiOutlinePuzzlePiece,
} from "react-icons/hi2";

export const AGENT_CATEGORIES = ["All", "Coding", "Research", "Automation", "Customer Support", "Data & Analytics"];

export const AGENTS = [
  {
    id: "codepilot-autonomous",
    name: "CodePilot Autonomous",
    displayName: "CodePilot Autonomous",
    creator: "@aletheia_labs",
    avatar: "CP",
    category: "Coding",
    type: "autonomous",
    rating: 4.9,
    installs: "42.8k",
    installsRaw: 42800,
    successRate: 96.2,
    latencyMs: 420,
    pricingPer1k: 0.0025,
    pricingFormatted: "$0.0025 / run",
    priceTier: "Pro",
    verified: true,
    featured: true,
    description: "Full-stack autonomous coding agent. Plans, writes, tests and opens PRs from a single prompt.",
    longDescription: "CodePilot runs a ReAct loop with tools: filesystem, terminal, browser, git and code-review. Battle-tested on SWE-Bench with 96.2% task completion.",
    capabilities: ["Repo Scaffolding", "Bug Fix & PR", "Test Generation", "Code Review"],
    tools: ["GitHub", "Terminal", "VS Code", "Docker", "Browser"],
    useCases: ["Migrate codebase to TS", "Fix failing CI", "Generate E2E tests"],
    tags: ["SWE-Bench 96.2%", "PR-ready", "Dockerized"],
  },
  {
    id: "research-scout-pro",
    name: "ResearchScout Pro",
    displayName: "ResearchScout Pro",
    creator: "@deep_research",
    avatar: "RS",
    category: "Research",
    type: "assistant",
    rating: 4.8,
    installs: "31.5k",
    installsRaw: 31500,
    successRate: 94.5,
    latencyMs: 890,
    pricingPer1k: 0.0018,
    pricingFormatted: "$0.0018 / run",
    priceTier: "Standard",
    verified: true,
    featured: true,
    description: "Deep-research agent that cites sources, builds reports and keeps a research memory graph.",
    longDescription: "Crawls arXiv, web, PDFs, and internal docs. Produces structured reports with citations, tables and executive summaries.",
    capabilities: ["Web + PDF Crawl", "Citation Engine", "Report Builder", "Memory Graph"],
    tools: ["Tavily", "Notion", "PDF Parser", "ArXiv", "Slack"],
    useCases: ["Market research in 10 mins", "Literature review", "Competitor teardown"],
    tags: ["Citations", "Multi-source", "Memory"],
  },
  {
    id: "ops-automator",
    name: "OpsAutomator",
    displayName: "OpsAutomator",
    creator: "@infra_wizards",
    avatar: "OA",
    category: "Automation",
    type: "workflow",
    rating: 4.7,
    installs: "27.2k",
    installsRaw: 27200,
    successRate: 95.8,
    latencyMs: 310,
    pricingPer1k: 0.0012,
    pricingFormatted: "$0.0012 / run",
    verified: true,
    featured: false,
    description: "No-code workflow agent: connects 200+ apps, retries, and self-heals failed runs.",
    longDescription: "Trigger via webhook, cron or chat. Visual builder, human-in-loop approvals and audit logs for every step.",
    capabilities: ["200+ Integrations", "Cron & Webhooks", "Human Approval", "Auto Retry"],
    tools: ["Zapier", "Slack", "Sheets", "Gmail", "Webhook"],
    useCases: ["Auto-onboard hires", "Invoice reconciliation", "Alert triage"],
    tags: ["No-code", "Self-healing", "Audit Log"],
  },
  {
    id: "support-genius",
    name: "SupportGenius",
    displayName: "SupportGenius",
    creator: "@cx_collective",
    avatar: "SG",
    category: "Customer Support",
    type: "assistant",
    rating: 4.9,
    installs: "58.1k",
    installsRaw: 58100,
    successRate: 97.1,
    latencyMs: 180,
    pricingPer1k: 0.0009,
    pricingFormatted: "$0.0009 / run",
    priceTier: "Pro",
    verified: true,
    featured: true,
    description: "Human-like support agent with RAG on your docs, ticket deflection and handoff to human.",
    longDescription: "Integrates Zendesk, Intercom, Slack. Deflects 63% of tickets, CSAT 4.9/5, multilingual.",
    capabilities: ["RAG on Docs", "Ticket Deflection", "Sentiment Aware", "Human Handoff"],
    tools: ["Zendesk", "Intercom", "Slack", "HelpDocs", "Stripe"],
    useCases: ["Instant L1 support", "Refund flow automation", "Onboarding Q&A"],
    tags: ["63% deflection", "CSAT 4.9", "Multilingual"],
  },
  {
    id: "dataforge-analyst",
    name: "DataForge Analyst",
    displayName: "DataForge Analyst",
    creator: "@quant_fox",
    avatar: "DF",
    category: "Data & Analytics",
    type: "autonomous",
    rating: 4.6,
    installs: "19.4k",
    installsRaw: 19400,
    successRate: 92.4,
    latencyMs: 620,
    pricingPer1k: 0.0032,
    pricingFormatted: "$0.0032 / run",
    priceTier: "Enterprise",
    verified: true,
    featured: false,
    description: "Text-to-SQL + notebook agent. Turns natural language into charts, SQL and insights.",
    longDescription: "Connects warehouses, cleans data, runs SQL/Python, and publishes dashboards with commentary.",
    capabilities: ["Text-to-SQL", "Notebook Runner", "Auto Charts", "Insight Narrative"],
    tools: ["BigQuery", "Snowflake", "Python", "Sheets", "Metabase"],
    useCases: ["Weekly KPI auto-report", "Ad-hoc data exploration", "Funnel diagnosis"],
    tags: ["SQL + Python", "Auto viz", "Warehouse native"],
  },
  {
    id: "legal-eagle",
    name: "LegalEagle",
    displayName: "LegalEagle",
    creator: "@lex_ai",
    avatar: "LE",
    category: "Research",
    type: "assistant",
    rating: 4.5,
    installs: "11.2k",
    installsRaw: 11200,
    successRate: 93.0,
    latencyMs: 740,
    pricingPer1k: 0.0021,
    pricingFormatted: "$0.0021 / run",
    priceTier: "Standard",
    verified: false,
    featured: false,
    description: "Contract review agent that redlines, risks-scores and suggests clauses.",
    longDescription: "Upload NDA/MSA, get risk heatmap, clause suggestions and negotiation playbook in minutes.",
    capabilities: ["Clause Extract", "Risk Scoring", "Redline Draft", "Playbook Gen"],
    tools: ["DocuSign", "PDF Parser", "Clio", "Notion"],
    useCases: ["NDA review", "Vendor contract triage", "Policy compliance check"],
    tags: ["Risk heatmap", "Redline", "SOC2"],
  },
  {
    id: "growth-hacker",
    name: "GrowthHacker",
    displayName: "GrowthHacker",
    creator: "@growth_lab",
    avatar: "GH",
    category: "Automation",
    type: "workflow",
    rating: 4.7,
    installs: "22.9k",
    installsRaw: 22900,
    successRate: 91.8,
    latencyMs: 280,
    pricingPer1k: 0.0015,
    pricingFormatted: "$0.0015 / run",
    priceTier: "Standard",
    verified: true,
    featured: false,
    description: "Outbound + enrichment agent that finds leads, personalizes and follows up autonomously.",
    longDescription: "LinkedIn, Crunchbase, Apollo enrichment. Writes hyper-personalized sequences with A/B testing.",
    capabilities: ["Lead Enrichment", "Personalized Outreach", "A/B Testing", "CRM Sync"],
    tools: ["Apollo", "LinkedIn", "HubSpot", "Gmail", "Clearbit"],
    useCases: [" outbound prospecting", "Event follow-up", "Re-engagement campaign"],
    tags: ["Outbound", "Enrichment", "CRM sync"],
  },
  {
    id: "secops-guardian",
    name: "SecOps Guardian",
    displayName: "SecOps Guardian",
    creator: "@security_ai",
    avatar: "SG",
    category: "Automation",
    type: "autonomous",
    rating: 4.8,
    installs: "16.7k",
    installsRaw: 16700,
    successRate: 96.8,
    latencyMs: 210,
    pricingPer1k: 0.0028,
    pricingFormatted: "$0.0028 / run",
    priceTier: "Enterprise",
    verified: true,
    featured: false,
    description: "Security triage agent: correlates logs, suggests fixes and opens Jira with proof.",
    longDescription: "Ingests CloudTrail, WAF, Snyk. Auto-correlates alerts, drafts runbooks and patches low-risk findings.",
    capabilities: ["Log Correlation", "Vuln Triage", "Auto Patch (low-risk)", "Runbook Gen"],
    tools: ["Jira", "PagerDuty", "AWS", "Snyk", "Datadog"],
    useCases: ["Alert fatigue reduction", "Incident first response", "Compliance check"],
    tags: ["SOC friendly", "Auto correlation", "Audit trail"],
  },
];

export const AgentMarketplacePage = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("popular"); // popular | rating | price | latency
  const [toolFilter, setToolFilter] = useState("All");

  const allTools = useMemo(() => {
    const s = new Set();
    AGENTS.forEach((a) => a.tools.forEach((t) => s.add(t)));
    return ["All", ...Array.from(s).slice(0, 8)];
  }, []);

  const filtered = useMemo(() => {
    let list = AGENTS.filter((a) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        a.name.toLowerCase().includes(q) ||
        a.displayName.toLowerCase().includes(q) ||
        a.creator.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        a.tools.some((t) => t.toLowerCase().includes(q));
      const matchesCat = category === "All" || a.category === category;
      const matchesTool = toolFilter === "All" || a.tools.includes(toolFilter);
      return matchesSearch && matchesCat && matchesTool;
    });
    if (sortBy === "rating") list = [...list].sort((a, b) => b.rating - a.rating);
    else if (sortBy === "price") list = [...list].sort((a, b) => a.pricingPer1k - b.pricingPer1k);
    else if (sortBy === "latency") list = [...list].sort((a, b) => a.latencyMs - b.latencyMs);
    else list = [...list].sort((a, b) => b.installsRaw - a.installsRaw);
    return list;
  }, [search, category, sortBy, toolFilter]);

  return (
    <div className="min-h-screen bg-[#fafafa] text-zinc-900 font-sans selection:bg-[#ea580c] selection:text-white py-10 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Hero */}
        <div className="p-6 sm:p-8 bg-white border border-[#e4e4e7] shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2.5">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-[#fff7ed] border border-orange-200 text-xs font-mono text-[#ea580c] font-bold">
              <HiOutlinePuzzlePiece />
              <span>Agent Marketplace • 8 Verified Agents • Tool-Using & Autonomous</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950">
              Agent Marketplace
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 max-w-2xl leading-relaxed">
              Discover production-ready AI agents. Filter by capability, stack & tools. Install in one click with ModelHub routing, auth & billing.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-[11px]">
              <span className="px-2 py-1 bg-zinc-900 text-white font-bold">58k+ installs</span>
              <span className="px-2 py-1 bg-white border border-[#e4e4e7] text-zinc-700">200+ tool integrations</span>
              <span className="px-2 py-1 bg-white border border-[#e4e4e7] text-zinc-700">Avg 94% task success</span>
            </div>
          </div>

          <div className="flex flex-col gap-3 shrink-0">
            <Link
              to="/agents/request"
              className="px-5 py-2.5 bg-zinc-900 hover:bg-black text-white font-bold text-xs font-mono text-center transition-all shadow-xs"
            >
              + Submit Your Agent
            </Link>
            <Link
              to="/live-bench"
              className="px-5 py-2.5 bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold text-xs font-mono text-center flex items-center justify-center gap-1.5 shadow-xs"
            >
              <HiOutlinePlay />
              <span>Try in Live Bench</span>
            </Link>
            <p className="text-[11px] text-zinc-500 font-mono text-center">85% creator revenue share • 1-click deploy</p>
          </div>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
          <div className="p-4 bg-white border border-[#e4e4e7] shadow-xs">
            <span className="text-[10px] text-zinc-400 block uppercase font-semibold">Agents Listed</span>
            <div className="text-xl font-bold text-zinc-900">{AGENTS.length} Agents</div>
            <span className="text-[10px] text-zinc-500">Verified & sandboxed</span>
          </div>
          <div className="p-4 bg-white border border-[#e4e4e7] shadow-xs">
            <span className="text-[10px] text-zinc-400 block uppercase font-semibold">Avg Rating</span>
            <div className="text-xl font-bold text-amber-600 flex items-center gap-1"><HiOutlineStar className="text-amber-500" /> 4.75 / 5</div>
            <span className="text-[10px] text-zinc-500">Across all categories</span>
          </div>
          <div className="p-4 bg-white border border-[#e4e4e7] shadow-xs">
            <span className="text-[10px] text-zinc-400 block uppercase font-semibold">Tools Connected</span>
            <div className="text-xl font-bold text-zinc-900">200+ Integrations</div>
            <span className="text-[10px] text-zinc-500">Slack, GitHub, Jira, Notion…</span>
          </div>
          <div className="p-4 bg-white border border-[#e4e4e7] shadow-xs">
            <span className="text-[10px] text-zinc-400 block uppercase font-semibold">Monthly Runs</span>
            <div className="text-xl font-bold text-emerald-700">1.2M+</div>
            <span className="text-[10px] text-zinc-500">P95 latency 420ms</span>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="bg-white border border-[#e4e4e7] p-4 shadow-xs space-y-3 font-mono text-xs">
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="flex-1 relative">
              <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-sm" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search agents, creators (@aletheia_labs), tools (GitHub, Slack) or capability..."
                className="w-full bg-[#fafafa] border border-[#e4e4e7] focus:border-[#ea580c] text-zinc-900 pl-9 pr-3.5 py-2 outline-none"
              />
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-zinc-500 uppercase text-[11px] font-bold">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-[#fafafa] border border-[#e4e4e7] text-zinc-800 px-3 py-2 outline-none cursor-pointer focus:border-[#ea580c]"
              >
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="price">Lowest Price</option>
                <option value="latency">Lowest Latency</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold text-zinc-500 uppercase">Category:</span>
            {AGENT_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-1 text-[11px] border transition-all cursor-pointer ${category === cat ? "bg-zinc-900 text-white font-bold border-zinc-900" : "bg-[#fafafa] text-zinc-600 border-[#e4e4e7] hover:border-zinc-400 hover:text-black"}`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold text-zinc-500 uppercase flex items-center gap-1"><HiOutlineWrenchScrewdriver /> Stack:</span>
            {allTools.map((t) => (
              <button
                key={t}
                onClick={() => setToolFilter(t)}
                className={`px-2.5 py-1 text-[11px] border transition-all cursor-pointer ${toolFilter === t ? "bg-[#ea580c] text-white font-bold border-[#ea580c]" : "bg-white text-zinc-600 border-[#e4e4e7] hover:border-zinc-400 hover:text-black"}`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between pt-1 text-[11px] text-zinc-500">
            <span>{filtered.length} agents found • {AGENTS.filter(a=>a.verified).length} verified</span>
            {(search || category !== "All" || toolFilter !== "All") && (
              <button onClick={() => {setSearch(""); setCategory("All"); setToolFilter("All");}} className="text-[#ea580c] font-bold hover:underline cursor-pointer">Clear filters</button>
            )}
          </div>
        </div>

        {/* Agent Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((agent) => (
            <Link
              key={agent.id}
              to={`/agents/${agent.id}`}
              className="bg-white border border-[#e4e4e7] hover:border-zinc-400 p-5 flex flex-col justify-between transition-all group shadow-xs space-y-4 text-left"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-zinc-900 text-white flex items-center justify-center font-mono font-bold text-sm shrink-0">
                      {agent.avatar}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-zinc-950 group-hover:text-[#ea580c] transition-colors truncate">{agent.displayName}</h3>
                      <p className="text-xs font-mono text-zinc-500">{agent.creator}</p>
                    </div>
                  </div>
                  {agent.verified && (
                    <span className="px-2 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-700 font-mono text-[10px] font-bold flex items-center gap-1 shrink-0">
                      <HiOutlineShieldCheck /> Verified
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 bg-zinc-100 border border-[#e4e4e7] text-[11px] font-mono text-zinc-700">{agent.category}</span>
                  <span className={`px-2 py-0.5 border text-[11px] font-mono font-bold uppercase ${agent.type === "autonomous" ? "bg-orange-50 border-orange-200 text-[#ea580c]" : agent.type === "assistant" ? "bg-blue-50 border-blue-200 text-blue-700" : "bg-zinc-50 border-zinc-200 text-zinc-700"}`}>{agent.type}</span>
                  {agent.featured && <span className="px-2 py-0.5 bg-amber-50 border border-amber-200 text-amber-700 text-[11px] font-mono font-bold">★ Featured</span>}
                </div>

                <p className="text-xs text-zinc-600 leading-relaxed line-clamp-2">{agent.description}</p>

                <div className="flex flex-wrap gap-1.5">
                  {agent.capabilities.slice(0, 3).map((c) => (
                    <span key={c} className="px-2 py-0.5 bg-[#fafafa] border border-[#e4e4e7] text-[11px] font-mono text-zinc-600">{c}</span>
                  ))}
                </div>

                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase font-semibold flex items-center gap-1"><HiOutlineWrenchScrewdriver /> Tools:</span>
                  {agent.tools.slice(0, 4).map((t) => (
                    <span key={t} className="px-1.5 py-0.5 bg-white border border-[#e4e4e7] text-[10px] font-mono text-zinc-700">{t}</span>
                  ))}
                  {agent.tools.length > 4 && <span className="text-[10px] text-zinc-400">+{agent.tools.length - 4}</span>}
                </div>
              </div>

              <div className="space-y-3 pt-3 border-t border-[#e4e4e7] font-mono">
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-zinc-400 block uppercase font-semibold flex items-center gap-1"><HiOutlineStar className="text-amber-500" /> Rating</span>
                    <span className="text-zinc-900 font-bold">{agent.rating} ★</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-400 block uppercase font-semibold">Installs</span>
                    <span className="text-zinc-800 font-bold flex items-center gap-1"><HiOutlineArrowDownTray className="text-zinc-500" />{agent.installs}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-400 block uppercase font-semibold">Price</span>
                    <span className="text-zinc-700 font-medium">{agent.pricingFormatted}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <span className="px-2 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-center">{agent.successRate}% Success</span>
                  <span className="px-2 py-1 bg-white border border-[#e4e4e7] text-zinc-700 text-center">{agent.latencyMs}ms avg</span>
                </div>
                <div className="flex gap-2">
                  <span className="flex-1 py-2 bg-white border border-zinc-300 text-zinc-800 text-xs font-bold text-center group-hover:bg-zinc-50 transition-colors">View Agent →</span>
                  <span className="flex-1 py-2 bg-[#ea580c] group-hover:bg-[#c2410c] text-white text-xs font-bold text-center transition-colors">Install</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="bg-white border border-dashed border-[#e4e4e7] p-10 text-center font-mono text-xs text-zinc-500">
            No agents match your filters. Try clearing filters or search with a different term.
          </div>
        )}

        {/* Bottom CTA */}
        <div className="bg-zinc-900 border border-zinc-800 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-white">
          <div className="space-y-1">
            <h3 className="text-base font-bold flex items-center gap-2"><HiOutlineSparkles className="text-[#ea580c]" /> Build & monetize your own agent</h3>
            <p className="text-xs text-zinc-400 font-mono">Publish to the marketplace, get discovery, managed auth, billing & 85% revenue share.</p>
          </div>
          <div className="flex gap-3 font-mono text-xs">
            <Link to="/test" className="px-5 py-2.5 bg-white text-zinc-900 font-bold hover:bg-zinc-100 transition-colors">Benchmark First</Link>
            <Link to="/agents/request" className="px-5 py-2.5 bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold transition-colors">Submit Agent</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentMarketplacePage;
