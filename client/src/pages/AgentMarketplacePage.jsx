import React, { useEffect, useState, useMemo } from "react";
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
import AgentLogo from "../components/AgentLogo";

export const AGENT_CATEGORIES = ["All", "Coding", "Research", "Automation", "Customer Support", "Data & Analytics"];

const CATALOG_AGENTS = [
  {
    id: "openhands",
    name: "OpenHands",
    displayName: "OpenHands",
    company: "OpenHands",
    creator: "OpenHands",
    avatar: "OH",
    category: "Coding",
    type: "autonomous agent",
    rating: 4.8,
    installs: "Open source",
    installsRaw: 90000,
    successRate: 92.0,
    latencyMs: 720,
    pricingPer1k: 0,
    pricingFormatted: "Free / bring your own model",
    priceTier: "Free",
    verified: true,
    featured: true,
    description: "Open-source AI software engineer that edits code, runs commands, browses, and works in a sandbox.",
    longDescription: "OpenHands runs locally or in the cloud with a web UI and CLI. Connect your own model provider and keep execution inside a Docker sandbox.",
    capabilities: ["Code Generation", "Browser Automation", "Terminal", "Sandboxed Execution"],
    tools: ["GitHub", "Terminal", "Docker", "Browser"],
    useCases: ["Fix repository issues", "Build features", "Explore a codebase"],
    tags: ["Open source", "Self-hosted", "Docker"],
  },
  {
    id: "cline",
    name: "Cline",
    displayName: "Cline",
    company: "Cline",
    creator: "Cline",
    avatar: "CL",
    category: "Coding",
    type: "coding agent",
    rating: 4.7,
    installs: "VS Code extension",
    installsRaw: 180000,
    successRate: 90.0,
    latencyMs: 460,
    pricingPer1k: 0,
    pricingFormatted: "Free extension / model costs apply",
    priceTier: "Free",
    verified: true,
    featured: true,
    description: "Open-source coding agent for VS Code that creates files, runs terminal commands, and uses a browser.",
    longDescription: "Cline is an extension for VS Code and compatible editors. Bring an API key or local model and approve tool actions from your workspace.",
    capabilities: ["Multi-file Editing", "Terminal Commands", "Browser Use", "Human Approval"],
    tools: ["VS Code", "GitHub", "Terminal", "Browser"],
    useCases: ["Build an app from a prompt", "Refactor a project", "Debug a failing test"],
    tags: ["Open source", "VS Code", "Bring your own key"],
  },
  {
    id: "aider",
    name: "Aider",
    displayName: "Aider",
    company: "Aider AI",
    creator: "Aider AI",
    avatar: "AI",
    category: "Coding",
    type: "coding agent",
    rating: 4.7,
    installs: "Open source",
    installsRaw: 70000,
    successRate: 89.0,
    latencyMs: 380,
    pricingPer1k: 0,
    pricingFormatted: "Free / model costs apply",
    priceTier: "Free",
    verified: true,
    featured: false,
    description: "Terminal pair-programming agent that edits your Git repository and creates clean commits.",
    longDescription: "Aider works in an existing Git repository, maps the codebase, edits files through chat, and uses your configured model API or local model.",
    capabilities: ["Code Editing", "Repo Map", "Git Commits", "Test Driven Changes"],
    tools: ["Git", "Terminal", "GitHub", "Python"],
    useCases: ["Make a focused code change", "Add tests", "Explain and refactor code"],
    tags: ["Open source", "CLI", "Git native"],
  },
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
    name: "Perplexity",
    displayName: "Perplexity",
    company: "Perplexity AI",
    creator: "Perplexity AI",
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
    name: "Zapier Agents",
    displayName: "Zapier Agents",
    company: "Zapier",
    creator: "Zapier",
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
    name: "Fin",
    displayName: "Intercom Fin",
    company: "Intercom",
    creator: "Intercom",
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
    name: "Julius AI",
    displayName: "Julius AI",
    company: "Julius AI",
    creator: "Julius AI",
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
    name: "Harvey",
    displayName: "Harvey AI",
    company: "Harvey",
    creator: "Harvey",
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
    verified: true,
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
    name: "Breeze",
    displayName: "HubSpot Breeze",
    company: "HubSpot",
    creator: "HubSpot",
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
    name: "Snyk Agent",
    displayName: "Snyk Agent",
    company: "Snyk",
    creator: "Snyk",
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
  {
    id: "content-crafter",
    name: "Jasper",
    displayName: "Jasper",
    company: "Jasper",
    creator: "Jasper",
    avatar: "CC",
    category: "Writing",
    type: "assistant",
    rating: 4.7,
    installs: "14.8k",
    installsRaw: 14800,
    successRate: 93.6,
    latencyMs: 240,
    pricingPer1k: 0.001,
    pricingFormatted: "$0.001 / run",
    priceTier: "Standard",
    verified: true,
    featured: false,
    description: "Writing agent that turns briefs into polished, on-brand content across every channel.",
    longDescription: "ContentCrafter learns your brand voice, drafts campaign content, and adapts long-form ideas into channel-ready copy with editorial controls.",
    capabilities: ["Content Creation", "Brand Voice", "Copy Editing", "Content Repurposing"],
    tools: ["Notion", "Google Docs", "Slack", "CMS"],
    useCases: ["Draft a launch campaign", "Repurpose a blog post", "Edit marketing copy"],
    tags: ["Brand voice", "Multi-channel", "Editorial"],
  },
  {
    id: "design-director",
    name: "Magic Studio",
    displayName: "Canva Magic Studio",
    company: "Canva",
    creator: "Canva",
    avatar: "DD",
    category: "Design",
    type: "copilot",
    rating: 4.6,
    installs: "9.6k",
    installsRaw: 9600,
    successRate: 91.7,
    latencyMs: 520,
    pricingPer1k: 0.002,
    pricingFormatted: "$0.002 / run",
    priceTier: "Pro",
    verified: true,
    featured: false,
    description: "Design copilot that turns product requirements into cohesive interfaces and visual systems.",
    longDescription: "Design Director explores references, creates wireframes and UI directions, and keeps components aligned with your design system.",
    capabilities: ["UI Concepts", "Design Systems", "Wireframing", "Visual Review"],
    tools: ["Figma", "FigJam", "Notion", "Browser"],
    useCases: ["Prototype a feature", "Audit a design system", "Prepare a design review"],
    tags: ["Figma", "Design system", "Product UI"],
  },
  {
    id: "study-guide",
    name: "Khanmigo",
    displayName: "Khanmigo",
    company: "Khan Academy",
    creator: "Khan Academy",
    avatar: "SG",
    category: "Education",
    type: "assistant",
    rating: 4.8,
    installs: "18.3k",
    installsRaw: 18300,
    successRate: 95.1,
    latencyMs: 190,
    pricingPer1k: 0.0008,
    pricingFormatted: "$0.0008 / run",
    priceTier: "Free",
    verified: true,
    featured: false,
    description: "Personal learning agent that explains difficult topics, builds study plans, and quizzes for retention.",
    longDescription: "StudyGuide adapts explanations to each learner, turns notes into practice material, and tracks progress toward a target exam or course.",
    capabilities: ["Lesson Planning", "Adaptive Quizzes", "Concept Explanation", "Progress Tracking"],
    tools: ["PDF Parser", "Notion", "Google Calendar", "Chat UI"],
    useCases: ["Prepare for an exam", "Learn a new concept", "Build a weekly study plan"],
    tags: ["Personalized", "Exam prep", "Learning plans"],
  },
  {
    id: "claude-code",
    name: "Claude Code",
    displayName: "Claude Code",
    company: "Anthropic",
    creator: "Anthropic",
    avatar: "CC",
    icon: "https://cdn.simpleicons.org/anthropic/191919",
    category: "Coding",
    type: "coding agent",
    rating: 4.9,
    installs: "125k",
    installsRaw: 125000,
    successRate: 97.4,
    latencyMs: 510,
    pricingPer1k: 0.003,
    pricingFormatted: "Usage based",
    priceTier: "Pro",
    verified: true,
    featured: true,
    description: "Anthropic's terminal-native coding agent for understanding codebases, editing files, and running tests.",
    longDescription: "Claude Code works directly in your terminal and uses Claude to inspect repositories, implement changes, run commands, and review diffs.",
    capabilities: ["Code Generation", "Code Review", "Debugging", "Testing"],
    tools: ["Terminal", "GitHub", "Docker", "VS Code"],
    useCases: ["Fix failing tests", "Refactor a repository", "Open a pull request"],
    tags: ["Claude", "Terminal", "GitHub"],
  },
  {
    id: "openai-codex",
    name: "Codex",
    displayName: "OpenAI Codex",
    company: "OpenAI",
    creator: "OpenAI",
    avatar: "CX",
    icon: "https://cdn.simpleicons.org/openai/191919",
    category: "Coding",
    type: "coding agent",
    rating: 4.8,
    installs: "98k",
    installsRaw: 98000,
    successRate: 95.9,
    latencyMs: 460,
    pricingPer1k: 0.003,
    pricingFormatted: "Usage based",
    priceTier: "Pro",
    verified: true,
    featured: true,
    description: "OpenAI's software engineering agent for writing, reviewing, and shipping code across repositories.",
    longDescription: "Codex can work on isolated coding tasks, make changes in a repository, and return reviewable results for developers.",
    capabilities: ["Code Generation", "Code Review", "Debugging", "DevOps"],
    tools: ["GitHub", "Terminal", "Docker", "VS Code"],
    useCases: ["Implement a feature", "Review a pull request", "Diagnose CI failures"],
    tags: ["GPT", "GitHub", "Cloud"],
  },
  {
    id: "devin",
    name: "Devin",
    displayName: "Devin",
    company: "Cognition",
    creator: "Cognition",
    avatar: "DV",
    icon: "https://api.dicebear.com/9.x/initials/svg?seed=Cognition&backgroundColor=18181b&fontFamily=monospace&fontWeight=700&fontSize=34",
    category: "Coding",
    type: "autonomous agent",
    rating: 4.7,
    installs: "76k",
    installsRaw: 76000,
    successRate: 94.8,
    latencyMs: 720,
    pricingPer1k: 0.005,
    pricingFormatted: "Team plan",
    priceTier: "Enterprise",
    verified: true,
    featured: true,
    description: "An autonomous software engineer with its own browser, shell, editor, and ability to complete larger tasks.",
    longDescription: "Devin plans work, writes code, uses a browser and shell, and collaborates with engineers through reviewable progress.",
    capabilities: ["Code Generation", "Browser Automation", "Testing", "DevOps"],
    tools: ["GitHub", "Browser", "Terminal", "Docker"],
    useCases: ["Build a feature end-to-end", "Migrate an application", "Investigate an issue"],
    tags: ["Autonomous", "Browser", "Cloud"],
  },
  {
    id: "cursor-agent",
    name: "Cursor Agent",
    displayName: "Cursor Agent",
    company: "Cursor",
    creator: "Cursor",
    avatar: "CU",
    icon: "https://cdn.simpleicons.org/cursor/191919",
    category: "Coding",
    type: "copilot",
    rating: 4.8,
    installs: "210k",
    installsRaw: 210000,
    successRate: 96.1,
    latencyMs: 360,
    pricingPer1k: 0.002,
    pricingFormatted: "Subscription",
    priceTier: "Pro",
    verified: true,
    featured: true,
    description: "AI-first code editor agent that understands your codebase and applies multi-file changes from natural language.",
    longDescription: "Cursor Agent combines repository context, inline editing, terminal commands, and multiple frontier models inside the editor.",
    capabilities: ["Code Generation", "Code Review", "Refactoring", "Testing"],
    tools: ["VS Code", "GitHub", "Terminal", "Docker"],
    useCases: ["Generate a component", "Refactor multiple files", "Write tests from a spec"],
    tags: ["Multi-model", "VS Code", "GitHub"],
  },
  {
    id: "gemini-code-assist",
    name: "Gemini Code Assist",
    displayName: "Gemini Code Assist",
    company: "Google",
    creator: "Google",
    avatar: "GC",
    icon: "https://cdn.simpleicons.org/google/191919",
    category: "Coding",
    type: "copilot",
    rating: 4.6,
    installs: "142k",
    installsRaw: 142000,
    successRate: 93.8,
    latencyMs: 390,
    pricingPer1k: 0,
    pricingFormatted: "Free tier",
    priceTier: "Free",
    verified: true,
    featured: false,
    description: "Google's coding assistant for IDE help, code generation, debugging, and Google Cloud development.",
    longDescription: "Gemini Code Assist provides completions and chat-based coding help across popular IDEs with deep Google Cloud support.",
    capabilities: ["Code Generation", "Debugging", "Code Review", "DevOps"],
    tools: ["VS Code", "Google Cloud", "GitHub", "Terminal"],
    useCases: ["Explain unfamiliar code", "Generate boilerplate", "Deploy to Google Cloud"],
    tags: ["Gemini", "IDE", "Google Cloud"],
  },
];

const REAL_AGENT_INSTALLS = {
  openhands: { label: "Install with uv", commands: { macos: "uv tool install openhands --python 3.12 && openhands", linux: "uv tool install openhands --python 3.12 && openhands", windows: "wsl -d Ubuntu -e bash -lc 'uv tool install openhands --python 3.12 && openhands'" }, packageUrl: "https://docs.openhands.dev/openhands/usage/cli/installation", note: "Requires Python 3.12+ and uv. Docker is recommended when you need a sandbox." },
  cline: { label: "Install from VS Code", commands: { macos: "code --install-extension saoudrizwan.claude-dev", linux: "code --install-extension saoudrizwan.claude-dev", windows: "code --install-extension saoudrizwan.claude-dev" }, packageUrl: "https://marketplace.visualstudio.com/items?itemName=saoudrizwan.claude-dev", note: "Open Cline from the VS Code activity bar and configure your preferred model provider." },
  aider: { label: "Install with pip", commands: { macos: "python -m pip install aider-install && aider-install", linux: "python -m pip install aider-install && aider-install", windows: "python -m pip install aider-install && aider-install" }, packageUrl: "https://aider.chat/docs/install.html", note: "Configure an API key, then run aider inside a Git repository." },
  "claude-code": { label: "Install Claude Code", commands: { macos: "curl -fsSL https://claude.ai/install.sh | bash", linux: "curl -fsSL https://claude.ai/install.sh | bash", windows: "irm https://claude.ai/install.ps1 | iex" }, packageUrl: "https://code.claude.com/docs/en/install", note: "Run claude in a project directory and sign in with your Anthropic account." },
  "openai-codex": { label: "Install Codex CLI", commands: { macos: "npm install -g @openai/codex", linux: "npm install -g @openai/codex", windows: "npm install -g @openai/codex" }, packageUrl: "https://developers.openai.com/codex", note: "Run codex in a project directory, then sign in with ChatGPT or an API key." },
  devin: { label: "Open Devin", commands: { macos: "open https://devin.ai", linux: "xdg-open https://devin.ai", windows: "start https://devin.ai" }, packageUrl: "https://devin.ai", note: "Devin is a hosted service. Request access or sign in on the official website; there is no local package." },
  "cursor-agent": { label: "Install Cursor", commands: { macos: "brew install --cask cursor", linux: "See the Linux download", windows: "winget install Anysphere.Cursor" }, packageUrl: "https://www.cursor.com/downloads", note: "Cursor Agent is included in the Cursor desktop editor. Open a folder after installation to start." },
  "gemini-code-assist": { label: "Install the IDE extension", commands: { macos: "code --install-extension Google.geminicodeassist", linux: "code --install-extension Google.geminicodeassist", windows: "code --install-extension Google.geminicodeassist" }, packageUrl: "https://marketplace.visualstudio.com/items?itemName=Google.geminicodeassist", note: "Install the extension in VS Code or JetBrains, then sign in with your Google account." },
};

const REAL_AGENT_LINKS = {
  openhands: { website: "https://openhands.dev", docs: "https://docs.openhands.dev", repository: "https://github.com/All-Hands-AI/OpenHands" },
  cline: { website: "https://cline.bot", docs: "https://docs.cline.bot", repository: "https://github.com/cline/cline" },
  aider: { website: "https://aider.chat", docs: "https://aider.chat/docs", repository: "https://github.com/Aider-AI/aider" },
  "claude-code": { website: "https://www.anthropic.com/claude-code", docs: "https://code.claude.com/docs/en/overview", repository: "https://github.com/anthropics/claude-code" },
  "openai-codex": { website: "https://openai.com/codex", docs: "https://developers.openai.com/codex", repository: "https://github.com/openai/codex" },
  devin: { website: "https://devin.ai", docs: "https://docs.devin.ai" },
  "cursor-agent": { website: "https://www.cursor.com", docs: "https://docs.cursor.com" },
  "gemini-code-assist": { website: "https://codeassist.google", docs: "https://cloud.google.com/gemini/docs/codeassist/overview" },
  "research-scout-pro": { website: "https://www.perplexity.ai", docs: "https://www.perplexity.ai/hub/faq" },
  "ops-automator": { website: "https://zapier.com/ai", docs: "https://help.zapier.com/hc/en-us/articles/24582823478669-Use-Zapier-Agents" },
  "support-genius": { website: "https://www.intercom.com/fin", docs: "https://www.intercom.com/help/en/articles/7839287-fin" },
  "dataforge-analyst": { website: "https://julius.ai", docs: "https://support.julius.ai" },
  "legal-eagle": { website: "https://www.harvey.ai" },
  "growth-hacker": { website: "https://www.hubspot.com/products/artificial-intelligence", docs: "https://knowledge.hubspot.com/ai" },
  "secops-guardian": { website: "https://snyk.io", docs: "https://docs.snyk.io/" },
  "content-crafter": { website: "https://www.jasper.ai", docs: "https://www.jasper.ai/help" },
  "design-director": { website: "https://www.canva.com/magic/", docs: "https://www.canva.com/help/magic-studio/" },
  "study-guide": { website: "https://www.khanmigo.ai", docs: "https://support.khanacademy.org/hc/en-us/categories/13889143388813-Khanmigo" },
};

export const AGENTS = CATALOG_AGENTS.map((agent) => ({ ...agent, install: REAL_AGENT_INSTALLS[agent.id], links: REAL_AGENT_LINKS[agent.id] }));

const FILTER_GROUPS = [
  { key: "capability", label: "Capability", options: ["Coding & Development", "Research & Web", "Writing & Content", "Data & Analytics", "Automation", "Customer Support", "Marketing & Sales", "Productivity", "Design & Creative", "Security", "Finance", "Education"] },
  { key: "worksOn", label: "Works on", options: ["GitHub", "VS Code", "Terminal", "Browser", "GUI", "TUI / CLI", "Workflow UI", "Chat UI", "Docker"] },
  { key: "useCase", label: "Use case", options: ["Code Generation", "Code Review", "Debugging", "Testing", "Web Research", "Competitor Research", "Document Analysis", "PDF Analysis", "Data Extraction", "Report Generation", "Email Management", "Lead Generation", "Customer Support", "Browser Automation", "DevOps", "Content Creation", "Data Analysis"] },
  { key: "type", label: "Agent type", options: ["Autonomous Agent", "Copilot", "Workflow Agent", "Chat Agent", "Browser Agent", "Coding Agent", "Multi-Agent", "API Agent"] },
  { key: "integration", label: "Integrations", options: ["GitHub", "GitLab", "VS Code", "Docker", "Terminal", "Notion", "Slack", "Gmail", "Google Drive", "Google Calendar", "PostgreSQL", "MongoDB", "Google Sheets", "Snowflake", "Browser", "Tavily", "Search", "PDF Parser", "OCR"] },
  { key: "model", label: "Model", options: ["GPT", "Claude", "Gemini", "Qwen", "Llama", "Mistral", "DeepSeek", "Custom Model"] },
  { key: "provider", label: "Provider", options: ["OpenAI", "Anthropic", "Google", "Ollama", "OpenRouter", "Hugging Face", "Self-hosted", "Custom"] },
  { key: "deployment", label: "Deployment", options: ["Cloud", "Local", "Self-hosted", "Docker", "API", "Browser", "Desktop"] },
  { key: "pricing", label: "Pricing", options: ["Free", "Open Source", "Free Tier", "Pay per Use", "Subscription"] },
  { key: "quality", label: "Quality", options: ["Verified", "Benchmarked", "Highly Rated", "Popular", "Recently Updated"] },
  { key: "rating", label: "Rating", options: ["4+ Stars", "3+ Stars"] },
  { key: "benchmark", label: "Benchmark score", options: ["90%+", "80%+", "70%+"] },
  { key: "latency", label: "Latency", options: ["< 1 sec", "< 3 sec", "< 5 sec"] },
  { key: "cost", label: "Cost / task", options: ["Free", "< $0.01 / task", "< $0.05 / task", "< $0.10 / task"] },
];

const AGENT_FILTER_META = {
  "codepilot-autonomous": { capability: ["Coding & Development"], useCase: ["Code Generation", "Code Review", "Debugging", "Testing", "DevOps"], type: ["Autonomous Agent", "Coding Agent"], integration: ["GitHub", "VS Code", "Docker", "Terminal"], model: ["Qwen", "DeepSeek"], provider: ["Ollama", "Hugging Face"], deployment: ["Local", "Docker", "API"], pricing: ["Pay per Use"], benchmark: ["90%+"], latency: ["< 1 sec"], cost: ["< $0.05 / task"] },
  "research-scout-pro": { capability: ["Research & Web"], useCase: ["Web Research", "Competitor Research", "PDF Analysis", "Report Generation"], type: ["Copilot", "API Agent"], integration: ["Tavily", "Notion", "PDF Parser", "Slack", "Search"], model: ["GPT", "Claude"], provider: ["OpenRouter", "Anthropic"], deployment: ["Cloud", "API", "Browser"], pricing: ["Pay per Use"], benchmark: ["90%+"], latency: ["< 3 sec"], cost: ["< $0.05 / task"] },
  "ops-automator": { capability: ["Automation", "Productivity"], useCase: ["Email Management", "Browser Automation", "DevOps"], type: ["Workflow Agent", "Multi-Agent"], integration: ["Slack", "Gmail", "Google Sheets", "Browser"], model: ["GPT", "Claude"], provider: ["OpenAI", "Anthropic"], deployment: ["Cloud", "API", "Browser"], pricing: ["Free Tier", "Subscription"], benchmark: ["90%+"], latency: ["< 1 sec"], cost: ["< $0.01 / task"] },
  "support-genius": { capability: ["Customer Support"], useCase: ["Customer Support", "Document Analysis"], type: ["Chat Agent", "Copilot"], integration: ["Slack", "Gmail", "Search"], model: ["GPT", "Claude"], provider: ["OpenAI", "Anthropic"], deployment: ["Cloud", "API"], pricing: ["Pay per Use", "Subscription"], benchmark: ["90%+"], latency: ["< 1 sec"], cost: ["< $0.01 / task"] },
  "dataforge-analyst": { capability: ["Data & Analytics"], useCase: ["Data Extraction", "Data Analysis", "Report Generation"], type: ["Autonomous Agent", "API Agent"], integration: ["Snowflake", "Google Sheets", "PostgreSQL", "MongoDB"], model: ["Llama", "Mistral"], provider: ["Self-hosted", "Hugging Face"], deployment: ["Cloud", "Self-hosted", "API"], pricing: ["Pay per Use"], benchmark: ["90%+"], latency: ["< 3 sec"], cost: ["< $0.10 / task"] },
  "legal-eagle": { capability: ["Research & Web", "Finance"], useCase: ["Document Analysis", "PDF Analysis", "Data Extraction"], type: ["Copilot", "Chat Agent"], integration: ["PDF Parser", "Notion", "Google Drive"], model: ["Claude", "GPT"], provider: ["Anthropic", "OpenAI"], deployment: ["Cloud", "API"], pricing: ["Pay per Use"], benchmark: ["80%+"], latency: ["< 3 sec"], cost: ["< $0.05 / task"] },
  "growth-hacker": { capability: ["Marketing & Sales", "Automation"], useCase: ["Lead Generation", "Email Management", "Content Creation"], type: ["Workflow Agent", "Autonomous Agent"], integration: ["Gmail", "Google Sheets", "Search"], model: ["GPT", "Gemini"], provider: ["OpenAI", "Google"], deployment: ["Cloud", "API"], pricing: ["Free Tier", "Subscription"], benchmark: ["80%+"], latency: ["< 1 sec"], cost: ["< $0.01 / task"] },
  "secops-guardian": { capability: ["Security", "Automation"], useCase: ["DevOps", "Data Analysis", "Report Generation"], type: ["Autonomous Agent", "Multi-Agent"], integration: ["Docker", "Terminal", "Search"], model: ["Llama", "DeepSeek"], provider: ["Self-hosted", "Ollama"], deployment: ["Self-hosted", "Docker", "API"], pricing: ["Subscription"], benchmark: ["90%+"], latency: ["< 1 sec"], cost: ["< $0.05 / task"] },
  "content-crafter": { capability: ["Writing & Content"], useCase: ["Content Creation"], type: ["Chat Agent", "Copilot"], integration: ["Notion", "Google Drive", "Slack"], model: ["GPT", "Claude"], provider: ["OpenAI", "Anthropic"], deployment: ["Cloud", "API"], pricing: ["Pay per Use"], benchmark: ["80%+"], latency: ["< 1 sec"], cost: ["< $0.01 / task"] },
  "design-director": { capability: ["Design & Creative"], useCase: ["Design Review", "UI Design"], type: ["Copilot"], integration: ["Browser", "Notion"], model: ["GPT", "Claude"], provider: ["OpenAI", "Anthropic"], deployment: ["Cloud", "API", "Browser"], pricing: ["Subscription"], benchmark: ["80%+"], latency: ["< 3 sec"], cost: ["< $0.05 / task"] },
  "study-guide": { capability: ["Education"], useCase: ["Document Analysis", "Content Creation"], type: ["Chat Agent", "Copilot"], integration: ["PDF Parser", "Notion", "Google Calendar"], model: ["GPT", "Claude"], provider: ["OpenAI", "Anthropic"], deployment: ["Cloud", "API"], pricing: ["Free"], benchmark: ["90%+"], latency: ["< 1 sec"], cost: ["< $0.01 / task"] },
};

const getAgentFilterValues = (agent) => {
  const meta = AGENT_FILTER_META[agent.id] || {};
  const capabilityFallback = agent.category === "Coding" ? ["Coding & Development"] : [agent.category];
  const typeFallback = agent.type.includes("autonomous") ? ["Autonomous Agent"] : agent.type.includes("assistant") || agent.type.includes("copilot") ? ["Copilot"] : agent.type.includes("coding") ? ["Coding Agent"] : ["Workflow Agent"];
  const worksOnFallback = [
    agent.tools.includes("GitHub") && "GitHub",
    agent.tools.includes("VS Code") && "VS Code",
    agent.tools.includes("Terminal") && "Terminal",
    agent.tools.includes("Browser") && "Browser",
    agent.tools.includes("Docker") && "Docker",
    agent.type.includes("autonomous") && "TUI / CLI",
    (agent.type.includes("assistant") || agent.type.includes("copilot")) && "Chat UI",
    agent.type.includes("workflow") && "Workflow UI",
  ].filter(Boolean);
  return {
    ...meta,
    capability: meta.capability || capabilityFallback,
    type: meta.type || typeFallback,
    worksOn: meta.worksOn || worksOnFallback,
    integration: meta.integration || agent.tools,
    pricing: meta.pricing || [agent.priceTier === "Free" ? "Free" : "Pay per Use"],
    tags: agent.tags,
    capabilities: agent.capabilities,
    integrations: agent.tools,
    name: agent.name,
    company: agent.company || agent.creator,
    creator: agent.creator,
    description: agent.description,
  };
};

export const AgentMarketplacePage = () => {
  const [submittedAgents, setSubmittedAgents] = useState([]);
  const [search, setSearch] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [sortBy, setSortBy] = useState("relevant");
  const [selectedFilters, setSelectedFilters] = useState({});
  const [expandedGroups, setExpandedGroups] = useState({ capability: true, useCase: true });

  // Let the user see that their description is being interpreted before the match appears.
  useEffect(() => {
    if (!search.trim()) {
      setIsSearching(false);
      return undefined;
    }
    setIsSearching(true);
    const timer = window.setTimeout(() => setIsSearching(false), 650);
    return () => window.clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    try { setSubmittedAgents(JSON.parse(localStorage.getItem("modelhub-submitted-agents") || "[]")); } catch { setSubmittedAgents([]); }
  }, []);

  const toggleFilter = (key, value) => setSelectedFilters((current) => {
    const values = current[key] || [];
    const nextValues = values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
    return { ...current, [key]: nextValues };
  });

  const clearFilters = () => { setSearch(""); setSelectedFilters({}); };

  const activeFilters = Object.entries(selectedFilters).flatMap(([key, values]) => values.map((value) => ({ key, value })));
  const primaryGroups = FILTER_GROUPS.filter((group) => ["capability", "worksOn"].includes(group.key));
  const advancedGroups = FILTER_GROUPS.filter((group) => ["pricing", "rating", "latency", "cost"].includes(group.key));

  const filtered = useMemo(() => {
    let list = [...submittedAgents, ...AGENTS].filter((a) => {
      const q = search.toLowerCase().trim();
      const searchable = JSON.stringify(getAgentFilterValues(a)).toLowerCase();
      const ignoredWords = new Set(["a", "an", "and", "for", "i", "in", "need", "the", "to", "with", "that", "can", "do"]);
      const searchTerms = q.split(/\s+/).filter((term) => term.length > 1 && !ignoredWords.has(term));
      const matchedTerms = searchTerms.filter((term) => searchable.includes(term)).length;
      const matchesSearch = !q || searchable.includes(q) || matchedTerms >= Math.max(1, Math.ceil(searchTerms.length * 0.5));
      const meta = getAgentFilterValues(a);
      const matchesFilters = Object.entries(selectedFilters).every(([key, values]) => values.length === 0 || values.some((value) => (meta[key] || []).includes(value)));
      return matchesSearch && matchesFilters;
    });
    if (sortBy === "rating") list = [...list].sort((a, b) => b.rating - a.rating);
    else if (sortBy === "benchmark") list = [...list].sort((a, b) => b.successRate - a.successRate);
    else if (sortBy === "price") list = [...list].sort((a, b) => a.pricingPer1k - b.pricingPer1k);
    else if (sortBy === "latency") list = [...list].sort((a, b) => a.latencyMs - b.latencyMs);
    else list = [...list].sort((a, b) => b.installsRaw - a.installsRaw);
    return list;
  }, [search, sortBy, selectedFilters, submittedAgents]);

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
              {(search || activeFilters.length > 0) && (
                <button onClick={clearFilters} className="text-[#ea580c] font-bold hover:underline cursor-pointer">Clear all</button>
              )}
            </div>

            <div className="space-y-2 max-h-[calc(100vh-235px)] overflow-y-auto pr-1">
              {[...primaryGroups, ...advancedGroups].map((group) => {
                const selectedCount = (selectedFilters[group.key] || []).length;
                const isExpanded = expandedGroups[group.key];
                const visibleOptions = isExpanded ? group.options : [];
                return (
                  <div key={group.key} className="border-b border-[#f0f0f1] pb-2">
                    <button
                      type="button"
                      onClick={() => setExpandedGroups((current) => ({ ...current, [group.key]: !current[group.key] }))}
                      className="w-full flex items-center justify-between py-1.5 text-left cursor-pointer"
                    >
                      <span className="text-[10px] text-zinc-500 uppercase font-bold">{group.label}{selectedCount > 0 && <span className="ml-1.5 text-[#ea580c]">({selectedCount})</span>}</span>
                      <span className="text-zinc-400 text-sm">{isExpanded ? "−" : "+"}</span>
                    </button>
                    {isExpanded && (
                      <div className="grid grid-cols-1 gap-1 pb-1">
                        {visibleOptions.map((option) => {
                          const checked = (selectedFilters[group.key] || []).includes(option);
                          return (
                            <label key={option} className="flex items-center gap-2 text-[11px] text-zinc-600 hover:text-zinc-950 cursor-pointer py-0.5">
                              <input type="checkbox" checked={checked} onChange={() => toggleFilter(group.key, option)} className="accent-[#ea580c]" />
                              <span className="truncate">{option}</span>
                            </label>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          </aside>

          <main className="space-y-4">
            <div className="relative bg-white border border-[#e4e4e7] shadow-xs">
              <HiOutlineMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 text-lg" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Describe the agent and we will search it for you"
                className="w-full bg-white focus:border-[#ea580c] pl-11 pr-4 py-4 outline-none text-sm text-zinc-900 placeholder:text-zinc-400"
              />
            </div>

            {isSearching && (
              <div className="marketplace-search-scan" role="status" aria-live="polite">
                <span className="marketplace-search-orbit"><HiOutlineSparkles /></span>
                <div>
                  <p className="font-mono text-[11px] font-bold uppercase tracking-wide text-zinc-900">Searching the agent catalog</p>
                  <p className="text-xs text-zinc-500">Matching your goal with the right tools and workflow...</p>
                </div>
                <span className="marketplace-search-dots" aria-hidden="true"><i /><i /><i /></span>
              </div>
            )}

            {!isSearching && search.trim() && filtered.length > 0 && (
              <div className="border border-orange-200 bg-[#fffaf5] p-4 shadow-xs animate-fadeIn">
                <div className="flex items-center gap-2">
                  <HiOutlineSparkles className="text-[#ea580c]" />
                  <p className="font-mono text-[10px] font-bold uppercase tracking-wide text-[#ea580c]">Top suggestions for your request</p>
                </div>
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {filtered.slice(0, 2).map((agent, index) => (
                    <div key={agent.id} className="flex flex-col justify-between gap-3 border border-orange-100 bg-white p-3">
                      <div>
                        <p className="font-mono text-[10px] text-zinc-400">0{index + 1} / RECOMMENDED</p>
                        <p className="mt-1 text-sm font-bold text-zinc-950">{agent.displayName}</p>
                        <p className="mt-1 text-xs leading-relaxed text-zinc-600 line-clamp-2">{agent.description}</p>
                      </div>
                      <Link to={`/agents/${agent.id}`} className="self-start bg-zinc-900 px-3 py-2 text-xs font-bold text-white hover:bg-[#ea580c]">Explore agent →</Link>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between font-mono text-xs">
              <span className="text-zinc-500"><strong className="text-zinc-900">{filtered.length}</strong> agents found</span>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-white border border-[#e4e4e7] text-zinc-700 px-2.5 py-1.5 outline-none cursor-pointer focus:border-[#ea580c]">
                <option value="relevant">Most Relevant</option>
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="benchmark">Highest Benchmark</option>
                <option value="price">Lowest Price</option>
                <option value="latency">Lowest Latency</option>
              </select>
            </div>

            {(search || activeFilters.length > 0) && (
              <div className="flex flex-wrap items-center gap-2 bg-white border border-[#e4e4e7] p-3 font-mono text-[11px]">
                <span className="text-zinc-500 uppercase font-bold">Active filters:</span>
                {search && <button onClick={() => setSearch("")} className="px-2 py-1 bg-zinc-900 text-white cursor-pointer">“{search}” ×</button>}
                {activeFilters.map(({ key, value }) => <button key={`${key}-${value}`} onClick={() => toggleFilter(key, value)} className="px-2 py-1 bg-[#fff7ed] border border-orange-200 text-[#ea580c] cursor-pointer">{value} ×</button>)}
                <button onClick={clearFilters} className="text-zinc-500 hover:text-[#ea580c] font-bold cursor-pointer">Clear all</button>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filtered.map((agent) => {
                const primaryTag = agent.category === "Data & Analytics"
                  ? "Data Analysis"
                  : agent.type.includes("copilot")
                    ? "Coding Copilot"
                    : agent.type.includes("coding")
                      ? "Coding Agent"
                      : agent.category;
                return (
                <article key={agent.id} className="bg-white border border-[#e4e4e7] hover:border-zinc-400 p-5 transition-all group shadow-xs">
                  <div className="flex items-start gap-3">
                     <AgentLogo agent={agent} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="text-base font-bold text-zinc-950 group-hover:text-[#ea580c] transition-colors truncate">{agent.displayName}</h3>
                          <p className="text-xs text-zinc-500 font-mono flex items-center gap-1 mt-0.5"><HiOutlinePuzzlePiece className="text-zinc-400" /> Built by {agent.company || agent.creator}</p>
                        </div>
                        {agent.verified && <HiOutlineShieldCheck className="text-emerald-600 text-lg shrink-0" title="Verified publisher" />}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-600 leading-relaxed mt-4 line-clamp-2">{agent.description}</p>

                  <div className="mt-4 pt-3 border-t border-[#e4e4e7] space-y-3">
                    <div>
                      <span className="text-[10px] font-mono text-zinc-400 uppercase font-bold">What it does</span>
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {agent.capabilities.slice(0, 3).map((capability) => <span key={capability} className="px-2 py-1 bg-zinc-100 border border-[#e4e4e7] text-[10px] font-mono text-zinc-700">{capability}</span>)}
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-zinc-400 uppercase font-bold flex items-center gap-1"><HiOutlineWrenchScrewdriver /> Works with</span>
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {agent.tools.slice(0, 4).map((tool) => <span key={tool} className="px-2 py-1 bg-white border border-[#e4e4e7] text-[10px] font-mono text-zinc-700">{tool}</span>)}
                        {agent.tools.length > 4 && <span className="px-2 py-1 text-[10px] font-mono text-zinc-400">+{agent.tools.length - 4} more</span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 mt-4 pt-3 border-t border-[#e4e4e7] font-mono">
                    <div className="flex items-center gap-2 text-[11px] text-zinc-500">
                      <span className="px-1.5 py-1 bg-[#fff7ed] border border-orange-200 text-[10px] text-[#ea580c] font-bold">{primaryTag}</span>
                    </div>
                    <Link to={`/agents/${agent.id}`} className="px-4 py-2 bg-zinc-900 hover:bg-[#ea580c] text-white text-xs font-bold transition-colors shrink-0">View Agent →</Link>
                  </div>
                </article>
                );
              })}
            </div>

            {filtered.length === 0 && <div className="bg-white border border-dashed border-[#e4e4e7] p-10 text-center font-mono text-xs text-zinc-500">No agents match your filters. Try resetting the sidebar.</div>}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AgentMarketplacePage;
