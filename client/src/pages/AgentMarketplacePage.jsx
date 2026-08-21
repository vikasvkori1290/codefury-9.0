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
    <div className="min-h-screen bg-[#fafafa] text-zinc-900 font-sans selection:bg-[#ea580c] selection:text-white py-8 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#e4e4e7] pb-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-[#ea580c] font-bold uppercase tracking-wide">
              <HiOutlinePuzzlePiece /> Agent Marketplace
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950">Find the right agent for the job.</h1>
            <p className="text-xs sm:text-sm text-zinc-500 max-w-2xl">Production-ready agents with verified capabilities, connected tools, and transparent run history.</p>
          </div>
          <Link to="/agents/request" className="px-4 py-2 bg-zinc-900 hover:bg-black text-white font-bold text-xs font-mono text-center shadow-xs shrink-0">+ Submit Your Agent</Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[220px_minmax(0,1fr)] gap-6 items-start">
          {/* Left filter rail */}
          <aside className="bg-white border border-[#e4e4e7] p-4 shadow-xs space-y-5 font-mono text-xs lg:sticky lg:top-20">
            <div className="flex items-center justify-between border-b border-[#e4e4e7] pb-3">
              <h2 className="font-bold uppercase tracking-wide text-zinc-900">Filter agents</h2>
              {(search || category !== "All" || toolFilter !== "All") && (
                <button onClick={() => { setSearch(""); setCategory("All"); setToolFilter("All"); }} className="text-[#ea580c] font-bold hover:underline cursor-pointer">Reset</button>
              )}
            </div>

            <label className="block space-y-1.5">
              <span className="text-[10px] text-zinc-500 uppercase font-bold">Search</span>
              <div className="relative">
                <HiOutlineMagnifyingGlass className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Name or company" className="w-full bg-[#fafafa] border border-[#e4e4e7] focus:border-[#ea580c] pl-8 pr-2 py-2 outline-none text-xs" />
              </div>
            </label>

            <div className="space-y-2">
              <span className="text-[10px] text-zinc-500 uppercase font-bold">Category</span>
              <div className="space-y-1">
                {AGENT_CATEGORIES.map((cat) => (
                  <button key={cat} onClick={() => setCategory(cat)} className={`w-full text-left px-2.5 py-1.5 border transition-all cursor-pointer ${category === cat ? "bg-zinc-900 text-white border-zinc-900 font-bold" : "bg-white text-zinc-600 border-transparent hover:bg-zinc-50 hover:border-[#e4e4e7]"}`}>{cat}</button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] text-zinc-500 uppercase font-bold flex items-center gap-1"><HiOutlineWrenchScrewdriver /> Connected tool</span>
              <div className="flex flex-wrap gap-1.5">
                {allTools.map((tool) => (
                  <button key={tool} onClick={() => setToolFilter(tool)} className={`px-2 py-1 border text-[10px] transition-all cursor-pointer ${toolFilter === tool ? "bg-[#ea580c] text-white border-[#ea580c] font-bold" : "bg-white text-zinc-600 border-[#e4e4e7] hover:border-zinc-400"}`}>{tool}</button>
                ))}
              </div>
            </div>

            <label className="block space-y-1.5 border-t border-[#e4e4e7] pt-4">
              <span className="text-[10px] text-zinc-500 uppercase font-bold">Sort by</span>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-full bg-[#fafafa] border border-[#e4e4e7] text-zinc-800 px-2 py-2 outline-none cursor-pointer focus:border-[#ea580c]">
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="price">Lowest Price</option>
                <option value="latency">Lowest Latency</option>
              </select>
            </label>
          </aside>

          <main className="space-y-4">
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="text-zinc-500"><strong className="text-zinc-900">{filtered.length}</strong> agents available</span>
              <span className="text-zinc-400">{AGENTS.filter((agent) => agent.verified).length} verified publishers</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filtered.map((agent) => (
                <article key={agent.id} className="bg-white border border-[#e4e4e7] hover:border-zinc-400 p-5 transition-all group shadow-xs">
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 bg-zinc-900 text-white flex items-center justify-center font-mono font-bold shrink-0">{agent.avatar}</div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="text-base font-bold text-zinc-950 group-hover:text-[#ea580c] transition-colors truncate">{agent.displayName}</h3>
                          <p className="text-xs text-zinc-500 font-mono flex items-center gap-1 mt-0.5"><HiOutlinePuzzlePiece className="text-zinc-400" /> {agent.creator}</p>
                        </div>
                        {agent.verified && <HiOutlineShieldCheck className="text-emerald-600 text-lg shrink-0" title="Verified publisher" />}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-600 leading-relaxed mt-4 line-clamp-2">{agent.description}</p>

                  <div className="flex flex-wrap gap-1.5 mt-4">
                    <span className="px-2 py-1 bg-zinc-100 border border-[#e4e4e7] text-[10px] font-mono text-zinc-700">{agent.category}</span>
                    <span className="px-2 py-1 bg-[#fff7ed] border border-orange-200 text-[10px] font-mono text-[#ea580c] font-bold uppercase">{agent.type}</span>
                    {agent.tags.slice(0, 2).map((tag) => <span key={tag} className="px-2 py-1 bg-white border border-[#e4e4e7] text-[10px] font-mono text-zinc-600">{tag}</span>)}
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap mt-4 pt-3 border-t border-[#e4e4e7]">
                    <span className="text-[10px] font-mono text-zinc-400 uppercase font-bold flex items-center gap-1"><HiOutlineWrenchScrewdriver /> Tools</span>
                    {agent.tools.slice(0, 3).map((tool) => <span key={tool} className="px-1.5 py-0.5 bg-[#fafafa] border border-[#e4e4e7] text-[10px] font-mono text-zinc-700">{tool}</span>)}
                    {agent.tools.length > 3 && <span className="text-[10px] text-zinc-400">+{agent.tools.length - 3}</span>}
                  </div>

                  <div className="flex items-end justify-between gap-3 mt-4 font-mono">
                    <div className="flex items-center gap-4 text-xs">
                      <span><span className="block text-[10px] text-zinc-400 uppercase">Rating</span><strong>{agent.rating} ★</strong></span>
                      <span><span className="block text-[10px] text-zinc-400 uppercase">Runs</span><strong>{agent.installs}</strong></span>
                      <span><span className="block text-[10px] text-zinc-400 uppercase">Price</span><strong className="text-[#ea580c]">{agent.pricingFormatted}</strong></span>
                    </div>
                    <Link to={`/agents/${agent.id}`} className="px-4 py-2 bg-zinc-900 hover:bg-[#ea580c] text-white text-xs font-bold transition-colors shrink-0">View Agent →</Link>
                  </div>
                </article>
              ))}
            </div>

            {filtered.length === 0 && <div className="bg-white border border-dashed border-[#e4e4e7] p-10 text-center font-mono text-xs text-zinc-500">No agents match your filters. Try resetting the sidebar.</div>}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AgentMarketplacePage;
