import React, { useState, useEffect, useRef } from "react";
import {
  HiOutlineXMark,
  HiOutlinePaperAirplane,
  HiOutlineSparkles,
  HiOutlineBolt,
  HiOutlineTrash,
  HiOutlineClipboardDocument,
  HiOutlineCheck,
  HiOutlineArrowsPointingOut,
  HiOutlineArrowsPointingIn,
} from "react-icons/hi2";
import API from "../../api/axios";

const MODEL_INFO = {
  id: "deepseek-v4-flash",
  name: "DeepSeek V4 Flash Vision Exp",
  tag: "⚡ Ultra-Fast Live Engine",
};

const SUGGESTED_PROMPTS = [
  "⚡ Which model is fastest for production?",
  "📊 How does LiveBench 20-test evaluation work?",
  "🚀 Give me a Python 1-click deployment snippet",
  "🧮 How is the Composite LiveBench Score calculated?",
];

export const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const [messages, setMessages] = useState([
    {
      id: "welcome",
      role: "assistant",
      content:
        "👋 Ask me anything about LiveBench benchmarks, model latency/TPS, or API code.",
      latencyMs: 85,
      modelUsed: MODEL_INFO.name,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages]);

  const handleSendMessage = async (textToSend) => {
    const query = (textToSend || inputMessage).trim();
    if (!query || isTyping) return;

    const userMsg = {
      id: `user_${Date.now()}`,
      role: "user",
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");
    setIsTyping(true);

    const historyPayload = messages
      .filter((m) => m.id !== "welcome")
      .map((m) => ({ role: m.role, content: m.content }));
    historyPayload.push({ role: "user", content: query });

    try {
      const startTime = Date.now();
      const response = await API.post("/chat", {
        modelId: MODEL_INFO.id,
        modelName: MODEL_INFO.name,
        messages: historyPayload,
        isPaidCredit: true,
      });

      const data = response.data;
      const latency = data.latency_ms || Date.now() - startTime;

      const assistantMsg = {
        id: `assistant_${Date.now()}`,
        role: "assistant",
        content: data.output || "I have processed your request.",
        latencyMs: latency,
        tokensPerSec: data.tokens_per_sec || 140,
        modelUsed: MODEL_INFO.name,
        engine: data.engine,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          role: "assistant",
          content:
            "⚠️ **Network Error**: Unable to reach model inference engine. Please check connection.",
          isError: true,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const clearChat = () => {
    setMessages([
      {
        id: `welcome_${Date.now()}`,
        role: "assistant",
        content:
          "🧹 **Chat Cleared**. How can I help you explore Forge models or run benchmarks today?",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* ==================== 1. FLOATING LAUNCH BUTTON ==================== */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-3 bg-zinc-950 hover:bg-[#ea580c] text-white px-4 py-3.5 shadow-2xl border-2 border-zinc-800 hover:border-black transition-all active:scale-95 cursor-pointer"
        >
          <div className="relative">
            <HiOutlineSparkles className="text-xl text-[#ea580c] group-hover:text-white transition-colors" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 animate-ping rounded-full" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full" />
          </div>
          <div className="text-left font-mono">
            <span className="text-[10px] text-zinc-400 group-hover:text-orange-100 block uppercase font-bold tracking-wider leading-none">
              Live AI Assistant
            </span>
            <span className="text-xs font-bold text-white block mt-0.5">
              Ask DeepSeek V4 Flash
            </span>
          </div>
        </button>
      )}

      {/* ==================== 2. CHAT WINDOW ==================== */}
      {isOpen && (
        <div
          className={`flex flex-col bg-white border-2 border-zinc-950 shadow-2xl transition-all duration-200 ${
            isExpanded
              ? "w-[90vw] md:w-[680px] h-[85vh] max-h-[850px]"
              : "w-[92vw] sm:w-[420px] h-[560px] max-h-[90vh]"
          }`}
        >
          {/* Header Bar */}
          <div className="bg-zinc-950 text-white p-3.5 flex items-center justify-between border-b border-zinc-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-[#ea580c] text-white flex items-center justify-center font-bold text-xs font-mono shadow-[2px_2px_0_#000]">
                F
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-xs sm:text-sm">Forge AI Real-Time Assistant</h3>
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                </div>
                <span className="text-[10px] font-mono text-zinc-400 flex items-center gap-1">
                  <HiOutlineBolt className="text-[#ea580c] text-[11px]" /> Powered by {MODEL_INFO.name}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                title={isExpanded ? "Collapse" : "Expand"}
              >
                {isExpanded ? <HiOutlineArrowsPointingIn /> : <HiOutlineArrowsPointingOut />}
              </button>
              <button
                onClick={clearChat}
                className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                title="Clear Chat History"
              >
                <HiOutlineTrash />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                title="Close"
              >
                <HiOutlineXMark className="text-base" />
              </button>
            </div>
          </div>

          {/* Messages Stream Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#fafafa]">
            {messages.map((msg, index) => {
              const isUser = msg.role === "user";
              return (
                <div
                  key={msg.id || index}
                  className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[88%] p-3.5 text-xs leading-relaxed ${
                      isUser
                        ? "bg-zinc-950 text-white font-mono shadow-xs"
                        : "bg-white border border-[#e4e4e7] text-zinc-900 shadow-xs"
                    }`}
                  >
                    {/* Assistant Message Header */}
                    {!isUser && (
                      <div className="flex items-center justify-between gap-2 border-b border-zinc-100 pb-1.5 mb-2 font-mono text-[10px] text-zinc-400">
                        <span className="font-bold text-[#ea580c] flex items-center gap-1">
                          <HiOutlineBolt className="text-xs" /> {MODEL_INFO.name}
                        </span>
                        {msg.latencyMs && (
                          <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 border border-emerald-200">
                            {msg.latencyMs}ms {msg.tokensPerSec ? `• ${msg.tokensPerSec} TPS` : ""}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Content Body */}
                    <div className="whitespace-pre-wrap font-sans text-xs sm:text-[13px] leading-relaxed">
                      {msg.content}
                    </div>

                    {/* Footer Actions */}
                    {!isUser && (
                      <div className="mt-2.5 pt-2 border-t border-zinc-100 flex items-center justify-between font-mono text-[10px] text-zinc-400">
                        <span>{msg.timestamp}</span>
                        <button
                          onClick={() => handleCopy(msg.content, index)}
                          className="flex items-center gap-1 text-zinc-500 hover:text-black cursor-pointer font-bold"
                        >
                          {copiedIndex === index ? (
                            <>
                              <HiOutlineCheck className="text-emerald-600" /> Copied
                            </>
                          ) : (
                            <>
                              <HiOutlineClipboardDocument /> Copy
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-2 p-3 bg-white border border-[#e4e4e7] text-xs font-mono text-zinc-500 w-fit shadow-xs">
                <span className="w-2 h-2 bg-[#ea580c] animate-bounce" />
                <span className="w-2 h-2 bg-[#ea580c] animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 bg-[#ea580c] animate-bounce [animation-delay:0.4s]" />
                <span className="ml-1 text-[11px]">DeepSeek V4 is thinking...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestion Pills */}
          <div className="p-2 bg-white border-t border-[#e4e4e7] flex items-center gap-1.5 overflow-x-auto whitespace-nowrap scrollbar-none font-mono text-[10px]">
            {SUGGESTED_PROMPTS.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(prompt)}
                disabled={isTyping}
                className="px-2.5 py-1 bg-zinc-50 hover:bg-[#fff0e8] hover:text-[#ea580c] border border-zinc-200 hover:border-[#ea580c] text-zinc-600 transition-colors cursor-pointer shrink-0 disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Box Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-zinc-950 flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask DeepSeek V4 Flash Vision..."
              disabled={isTyping}
              className="flex-1 bg-[#fafafa] border border-[#e4e4e7] focus:border-[#ea580c] text-xs text-zinc-900 px-3.5 py-2.5 outline-none font-sans"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isTyping}
              className="px-4 py-2.5 bg-zinc-950 hover:bg-[#ea580c] text-white text-xs font-bold font-mono transition-colors disabled:opacity-40 disabled:hover:bg-zinc-950 flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <span>Send</span>
              <HiOutlinePaperAirplane className="text-xs" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatbotWidget;
