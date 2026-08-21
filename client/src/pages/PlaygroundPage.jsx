import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { HiOutlineArrowLeft, HiOutlinePaperAirplane, HiOutlineSparkles } from "react-icons/hi2";
import { getModel } from "../data/modelCatalog";

export default function PlaygroundPage() {
  const model = getModel(useParams().modelId);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([{ role: "assistant", content: `You are chatting with ${model.name}. Try one of the suggested tasks or ask your own question.` }]);
  const send = async (event) => {
    event?.preventDefault();
    if (!prompt.trim() || loading) return;
    const text = prompt.trim(); setPrompt(""); setMessages((items) => [...items, { role: "user", content: text }]); setLoading(true);
    try { const response = await fetch("http://localhost:5000/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ modelId: model.id, messages: [{ role: "user", content: text }] }) }); const data = await response.json(); if (!response.ok) throw new Error(data.message); setMessages((items) => [...items, { role: "assistant", content: data.output, meta: `${data.latency_ms}ms · ${data.tokens_used?.total_tokens || 0} tokens` }]); } catch { setMessages((items) => [...items, { role: "assistant", content: `Demo response from ${model.name}. Add the provider key on the server for live inference.` }]); } finally { setLoading(false); }
  };
  return <div className="min-h-screen bg-[#fafafa] p-5 sm:p-8"><div className="max-w-5xl mx-auto space-y-4"><div className="flex justify-between text-xs"><Link to={`/models/${model.id}`} className="flex items-center gap-2 text-zinc-500"><HiOutlineArrowLeft /> Back to model research</Link><Link to="/models" className="text-orange-600 font-bold">AI Models</Link></div><main className="bg-white border border-zinc-200 min-h-[calc(100vh-130px)] flex flex-col"><header className="p-5 border-b border-zinc-200 flex justify-between"><div><h1 className="font-bold flex gap-2 items-center"><HiOutlineSparkles className="text-orange-600" /> {model.name}</h1><p className="text-xs text-zinc-500 mt-1">{model.category} · {model.provider}</p></div><span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-1">READY</span></header><div className="flex-1 p-5 space-y-4">{messages.map((message, index) => <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}><div className={`max-w-[80%] p-4 text-sm whitespace-pre-wrap ${message.role === "user" ? "bg-zinc-950 text-white" : "bg-zinc-100 text-zinc-800"}`}>{message.content}{message.meta && <div className="text-[10px] text-zinc-500 mt-2">{message.meta}</div>}</div></div>)}{loading && <span className="text-xs text-orange-600 animate-pulse">Running model...</span>}</div><form onSubmit={send} className="p-4 border-t border-zinc-200 flex gap-2"><textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Ask this model anything..." rows="2" className="flex-1 border border-zinc-300 p-3 text-sm outline-none focus:border-orange-500"/><button disabled={loading || !prompt.trim()} className="bg-orange-600 disabled:bg-zinc-300 text-white px-4"><HiOutlinePaperAirplane /></button></form></main></div></div>;
}
