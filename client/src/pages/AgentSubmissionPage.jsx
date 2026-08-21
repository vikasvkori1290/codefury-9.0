import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { HiOutlineArrowLeft, HiOutlineArrowUpTray, HiOutlineCheck, HiOutlineCodeBracket, HiOutlineLink, HiOutlinePuzzlePiece } from "react-icons/hi2";

const CATEGORIES = ["Coding", "Research", "Automation", "Customer Support", "Data & Analytics"];
const TYPES = ["Autonomous agent", "Coding agent", "Copilot", "Workflow agent", "Chat agent", "API agent"];
const initialForm = { name: "", publisher: "", category: "Coding", type: "Coding agent", icon: "", description: "", longDescription: "", capabilities: "", tools: "", tags: "", installCommand: "", website: "", docs: "", repository: "", pricingFormatted: "Free" };
const splitValues = (value) => value.split(",").map((item) => item.trim()).filter(Boolean);

export const AgentSubmissionPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const update = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }));
  const previewIcon = form.icon || `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(form.publisher || "Agent")}&backgroundColor=f4f4f5&fontFamily=monospace&fontWeight=700`;
  const inputClass = "w-full border border-[#d4d4d8] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#ea580c]";
  const labelClass = "block text-[11px] font-mono font-bold uppercase tracking-wide text-zinc-600 mb-1.5";

  const handleSubmit = (event) => {
    event.preventDefault();
    if (["name", "publisher", "description", "capabilities", "tools", "installCommand"].some((field) => !form[field].trim())) {
      toast.error("Complete all required fields before submitting.");
      return;
    }
    setIsSubmitting(true);
    const id = `${form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}-${Date.now()}`;
    const agent = {
      ...form, id, displayName: form.name.trim(), company: form.publisher.trim(), creator: form.publisher.trim(), avatar: form.name.trim().slice(0, 2).toUpperCase(),
      icon: form.icon.trim() || undefined, capabilities: splitValues(form.capabilities), tools: splitValues(form.tools), tags: splitValues(form.tags),
      links: { website: form.website.trim(), docs: form.docs.trim(), repository: form.repository.trim() }, rating: 0, installs: "0", installsRaw: 0, successRate: 0, latencyMs: 0, pricingPer1k: 0, priceTier: "Community", verified: false, featured: false, submitted: true,
    };
    try {
      const existing = JSON.parse(localStorage.getItem("modelhub-submitted-agents") || "[]");
      localStorage.setItem("modelhub-submitted-agents", JSON.stringify([agent, ...existing]));
      toast.success("Agent submitted to the marketplace.");
      navigate(`/agents/${id}`);
    } catch { toast.error("Could not save this submission."); }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] px-4 py-8 text-zinc-900 sm:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <Link to="/agents" className="inline-flex items-center gap-1.5 font-mono text-xs text-zinc-500 hover:text-black"><HiOutlineArrowLeft /> Back to Agent Marketplace</Link>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <form onSubmit={handleSubmit} className="space-y-6 border border-[#e4e4e7] bg-white p-6 shadow-xs sm:p-8">
            <header className="border-b border-[#e4e4e7] pb-5"><span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#ea580c]">Publisher intake</span><h1 className="mt-2 text-2xl font-bold tracking-tight">Submit your agent</h1><p className="mt-2 text-sm text-zinc-500">Tell builders what your agent does, how to install it, and where to learn more.</p></header>
            <section className="space-y-4"><h2 className="flex items-center gap-2 text-sm font-bold"><HiOutlinePuzzlePiece className="text-[#ea580c]" /> Identity and description</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <label><span className={labelClass}>Agent name *</span><input required value={form.name} onChange={update("name")} placeholder="e.g. InboxPilot" className={inputClass} /></label>
                <label><span className={labelClass}>Publisher / company *</span><input required value={form.publisher} onChange={update("publisher")} placeholder="e.g. Acme Labs" className={inputClass} /></label>
                <label><span className={labelClass}>Category *</span><select value={form.category} onChange={update("category")} className={inputClass}>{CATEGORIES.map((item) => <option key={item}>{item}</option>)}</select></label>
                <label><span className={labelClass}>Agent type *</span><select value={form.type} onChange={update("type")} className={inputClass}>{TYPES.map((item) => <option key={item}>{item}</option>)}</select></label>
              </div>
              <label><span className={labelClass}>Icon URL</span><input type="url" value={form.icon} onChange={update("icon")} placeholder="https://.../agent-icon.png (optional)" className={inputClass} /></label>
              <label><span className={labelClass}>Short description *</span><textarea required rows="2" maxLength="180" value={form.description} onChange={update("description")} placeholder="One clear sentence describing the outcome your agent delivers." className={inputClass} /></label>
              <label><span className={labelClass}>Full description</span><textarea rows="3" value={form.longDescription} onChange={update("longDescription")} placeholder="Explain the workflow, context, and what makes this agent useful." className={inputClass} /></label>
              <div className="grid gap-4 sm:grid-cols-2"><label><span className={labelClass}>Capabilities * <span className="font-normal normal-case text-zinc-400">(comma separated)</span></span><input required value={form.capabilities} onChange={update("capabilities")} placeholder="Code review, Testing, Debugging" className={inputClass} /></label><label><span className={labelClass}>Tools and integrations *</span><input required value={form.tools} onChange={update("tools")} placeholder="GitHub, Slack, Docker" className={inputClass} /></label></div>
              <label><span className={labelClass}>Tags <span className="font-normal normal-case text-zinc-400">(comma separated)</span></span><input value={form.tags} onChange={update("tags")} placeholder="Open source, Fast, RAG" className={inputClass} /></label>
            </section>
            <section className="space-y-4 border-t border-[#e4e4e7] pt-6"><h2 className="flex items-center gap-2 text-sm font-bold"><HiOutlineCodeBracket className="text-[#ea580c]" /> Installation and links</h2><label><span className={labelClass}>Install line / command *</span><textarea required rows="3" value={form.installCommand} onChange={update("installCommand")} placeholder="npm install @acme/inboxpilot" className={`${inputClass} font-mono text-xs`} /></label>
              <div className="grid gap-4 sm:grid-cols-2"><label><span className={labelClass}>Website</span><input type="url" value={form.website} onChange={update("website")} placeholder="https://your-agent.com" className={inputClass} /></label><label><span className={labelClass}>Documentation</span><input type="url" value={form.docs} onChange={update("docs")} placeholder="https://docs.your-agent.com" className={inputClass} /></label><label><span className={labelClass}>Source repository</span><input type="url" value={form.repository} onChange={update("repository")} placeholder="https://github.com/org/repo" className={inputClass} /></label><label><span className={labelClass}>Pricing</span><input value={form.pricingFormatted} onChange={update("pricingFormatted")} placeholder="Free or $0.01 / run" className={inputClass} /></label></div>
            </section>
            <div className="flex flex-col-reverse gap-3 border-t border-[#e4e4e7] pt-5 sm:flex-row sm:justify-end"><Link to="/agents" className="px-5 py-3 text-center font-mono text-xs font-bold text-zinc-600 hover:text-black">Cancel</Link><button disabled={isSubmitting} className="inline-flex items-center justify-center gap-2 bg-[#ea580c] px-5 py-3 font-mono text-xs font-bold text-white hover:bg-[#c2410c] disabled:opacity-60"><HiOutlineArrowUpTray /> {isSubmitting ? "Submitting..." : "Submit agent"}</button></div>
          </form>
          <aside className="h-fit space-y-4 lg:sticky lg:top-20"><div className="border border-[#e4e4e7] bg-white p-5 shadow-xs"><span className="font-mono text-[10px] font-bold uppercase tracking-widest text-zinc-400">Live preview</span><div className="mt-4 border border-[#e4e4e7] p-4"><div className="flex items-center gap-3"><img src={previewIcon} alt="" className="h-11 w-11 border border-[#e4e4e7] object-contain p-1.5" /><div className="min-w-0"><h3 className="truncate text-base font-bold">{form.name || "Your agent name"}</h3><p className="truncate font-mono text-xs text-zinc-500">Built by {form.publisher || "your team"}</p></div></div><p className="mt-4 text-xs leading-relaxed text-zinc-600">{form.description || "Your short description will appear here."}</p><div className="mt-4 flex flex-wrap gap-1.5">{splitValues(form.capabilities || "Capability one, Capability two").slice(0, 3).map((item) => <span key={item} className="border border-[#e4e4e7] bg-zinc-100 px-2 py-1 font-mono text-[10px]">{item}</span>)}</div></div></div><div className="border border-orange-200 bg-[#fff7ed] p-5 text-xs text-orange-950"><h2 className="font-bold">Submission checklist</h2><ul className="mt-3 space-y-2 text-orange-900"><li><HiOutlineCheck className="mr-1 inline" /> Use an icon URL or initials will be generated</li><li><HiOutlineCheck className="mr-1 inline" /> Keep the install command copy-pasteable</li><li><HiOutlineCheck className="mr-1 inline" /> Link to docs so users can get started</li></ul></div><p className="flex items-center gap-1.5 font-mono text-[10px] text-zinc-400"><HiOutlineLink /> Submissions are reviewed before verification.</p></aside>
        </div>
      </div>
    </div>
  );
};

export default AgentSubmissionPage;
