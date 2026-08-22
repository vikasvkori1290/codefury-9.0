import React, { useState } from "react";

const getInitials = (creator, displayName) => {
  const label = (creator || displayName || "AI").replace(/[@_.-]/g, " ").trim();
  const parts = label.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return label.slice(0, 2).toUpperCase() || "AI";
};

// Detect provider/model family from any text field
const getProviderKey = (displayName, creator, category) => {
  const hay = `${displayName || ""} ${creator || ""} ${category || ""}`.toLowerCase();
  if (hay.includes("gpt") || hay.includes("openai") || hay.includes("o1") || hay.includes("chatgpt")) return "openai";
  if (hay.includes("gemini") || hay.includes("google") || hay.includes("deepmind") || hay.includes("bison") || hay.includes("palm")) return "google";
  if (hay.includes("grok") || hay.includes("xai") || hay.includes(" x ") || hay.includes("@xai")) return "grok";
  if (hay.includes("claude") || hay.includes("anthropic") || hay.includes("fable")) return "anthropic";
  if (hay.includes("llama") || hay.includes("muse") || hay.includes("meta")) return "meta";
  if (hay.includes("mistral") || hay.includes("mixtral")) return "mistral";
  if (hay.includes("deepseek")) return "deepseek";
  if (hay.includes("qwen") || hay.includes("alibaba") || hay.includes("dashscope")) return "qwen";
  if (hay.includes("glm") || hay.includes("zhipu") || hay.includes("chatglm")) return "glm";
  if (hay.includes("kimi") || hay.includes("moonshot")) return "kimi";
  if (hay.includes("minimax")) return "minimax";
  if (hay.includes("smaug") || hay.includes("abacus")) return "abacus";
  if (hay.includes("inkling")) return "inkling";
  return "generic";
};

// Simple, flat icons – no heavy brutalist shadow, just clean SVG / image
const ProviderIcon = ({ providerKey, sizeClass, onImgError }) => {
  if (providerKey === "openai") {
    return <img src="https://cdn.simpleicons.org/openai/000000" alt="OpenAI" className={`${sizeClass} object-contain`} loading="lazy" onError={onImgError} />;
  }
  if (providerKey === "google") {
    return (
      <svg viewBox="0 0 24 24" className={sizeClass} aria-hidden="true">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
      </svg>
    );
  }
  if (providerKey === "grok") {
    return <img src="https://cdn.simpleicons.org/x/000000" alt="Grok xAI" className={`${sizeClass} object-contain`} loading="lazy" onError={onImgError} />;
  }
  if (providerKey === "anthropic") {
    return <img src="https://cdn.simpleicons.org/anthropic/000000" alt="Anthropic" className={`${sizeClass} object-contain`} loading="lazy" onError={onImgError} />;
  }
  if (providerKey === "meta") {
    return <img src="https://cdn.simpleicons.org/meta/0081FB" alt="Meta" className={`${sizeClass} object-contain`} loading="lazy" onError={onImgError} />;
  }
  if (providerKey === "mistral") {
    return <img src="https://cdn.simpleicons.org/mistralai/000000" alt="Mistral" className={`${sizeClass} object-contain`} loading="lazy" onError={onImgError} />;
  }
  if (providerKey === "deepseek") {
    return <img src="https://cdn.simpleicons.org/deepseek/7c3aed" alt="DeepSeek" className={`${sizeClass} object-contain`} loading="lazy" onError={onImgError} />;
  }
  if (providerKey === "qwen") {
    return <img src="https://cdn.simpleicons.org/alibabacloud/FF6A00" alt="Qwen Alibaba" className={`${sizeClass} object-contain`} loading="lazy" onError={onImgError} />;
  }
  if (providerKey === "glm") {
    return <span className={`${sizeClass} flex items-center justify-center bg-[#0d9488] text-white font-mono font-bold text-xs`}>Z</span>;
  }
  if (providerKey === "kimi") {
    return <span className={`${sizeClass} flex items-center justify-center bg-[#e11d48] text-white font-mono font-bold text-xs`}>K</span>;
  }
  return null;
};

export const ModelLogo = ({ displayName, creator, category, large = false }) => {
  const providerKey = getProviderKey(displayName, creator, category);
  const [imgFailed, setImgFailed] = useState(false);
  const initials = getInitials(creator, displayName);

  const containerSize = large ? "w-16 h-16" : "w-11 h-11";
  const iconSize = large ? "w-8 h-8" : "w-6 h-6";

  const isGeneric = providerKey === "generic" || providerKey === "abacus" || providerKey === "inkling" || providerKey === "minimax";
  const hasIcon = !isGeneric && !imgFailed;

  return (
    <div
      className={`${containerSize} bg-white border border-[#e4e4e7] flex items-center justify-center shrink-0 select-none overflow-hidden`}
      aria-label={`${displayName || "AI model"} logo`}
    >
      {hasIcon ? (
        <ProviderIcon providerKey={providerKey} sizeClass={iconSize} onImgError={() => setImgFailed(true)} />
      ) : (
        <span className={`${large ? "text-[13px]" : "text-xs"} font-mono font-bold tracking-[0.12em] text-zinc-900`}>{initials}</span>
      )}
    </div>
  );
};

export default ModelLogo;
