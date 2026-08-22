import { performance } from "perf_hooks";
import { decryptCredential, redactSecret } from "./credential.service.js";

const googleModelCache = new Map();
const estimateTokens = (text) => Math.max(1, Math.ceil(String(text || "").length / 3.8));

const providerError = async (response) => {
  const body = await response.text();
  return new Error(`Provider request failed (${response.status}): ${redactSecret(body).slice(0, 240)}`);
};

const requestJson = async (url, options) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 25000); // 25-second safety timeout for cold-start inferences

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    if (!response.ok) throw await providerError(response);
    return response.json();
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === "AbortError") {
      throw new Error("Provider request timed out after 25 seconds.");
    }
    throw err;
  }
};

export const runRegisteredModel = async ({ model, prompt }) => {
  const started = performance.now();
  let provider = model.apiProvider || "openai";
  const isOpenCodeProvider = provider.startsWith("opencode");
  const isHuggingFace = provider === "huggingface" || provider === "hf" || String(model.modelIdentifier || model.name).includes("/");
  const apiKey = (model.apiKeyEncrypted ? decryptCredential(model.apiKeyEncrypted) : null)
    || (isOpenCodeProvider ? (process.env.OPENCODE_API_KEY || process.env.DEEPSEEK_API_KEY) : null)
    || (isHuggingFace ? (process.env.HF_TOKEN || process.env.HUGGINGFACE_API_KEY || process.env.GROQ_API_KEY || process.env.OPENCODE_API_KEY) : null);
  if (!apiKey) throw new Error("No API credential is configured for this model.");
  // Smart key auto-routing
  if (apiKey.startsWith("hf_")) {
    provider = "huggingface";
  } else if (apiKey.startsWith("gsk_") && !isHuggingFace) {
    provider = "groq";
  } else if (apiKey.startsWith("AIza")) {
    provider = "google";
  } else if (apiKey.startsWith("sk-ant-")) {
    provider = "anthropic";
  } else if (apiKey.startsWith("sk-") && provider === "google") {
    provider = "opencode";
  }

  const modelIdentifier = model.modelIdentifier || model.name;
  const maxOutputTokens = /\b(function|javascript|python|sql|code|algorithm)\b/i.test(prompt) ? 1536 : 512;
  let text = "";
  let usage = {};

  if (["opencode-zen-openai", "opencode-go-openai"].includes(provider)) {
    const base = (model.endpoint || (provider === "opencode-go-openai" ? "https://opencode.ai/zen/go/v1" : "https://opencode.ai/zen/v1")).replace(/\/$/, "");
    const data = await requestJson(`${base}/responses`, {
      method: "POST",
      headers: { authorization: `Bearer ${apiKey}`, "content-type": "application/json" },
      body: JSON.stringify({ model: modelIdentifier, input: prompt, temperature: isOpenCodeProvider ? 1 : 0, max_output_tokens: maxOutputTokens }),
    });
    text = data.output_text || data.output?.flatMap((item) => item.content || []).map((part) => part.text || "").join("").trim();
    usage = { input_tokens: data.usage?.input_tokens, output_tokens: data.usage?.output_tokens };
  } else if (provider === "anthropic" || provider === "opencode-zen-anthropic" || provider === "opencode-go-anthropic") {
    const base = provider === "anthropic" ? "https://api.anthropic.com/v1" : (provider === "opencode-go-anthropic" ? "https://opencode.ai/zen/go/v1" : "https://opencode.ai/zen/v1");
    const endpoint = model.endpoint || `${base}/messages`;
    const data = await requestJson(endpoint, {
      method: "POST",
      headers: provider === "anthropic"
        ? { "x-api-key": apiKey, "anthropic-version": "2023-06-01", "content-type": "application/json" }
        : { authorization: `Bearer ${apiKey}`, "anthropic-version": "2023-06-01", "content-type": "application/json" },
      body: JSON.stringify({
        model: modelIdentifier,
        max_tokens: maxOutputTokens,
        temperature: isOpenCodeProvider ? 1 : 0,
        messages: [{ role: "user", content: prompt }],
      }),
    });
    text = data.content?.map((part) => part.text || "").join("").trim();
    usage = { input_tokens: data.usage?.input_tokens, output_tokens: data.usage?.output_tokens };
  } else if (provider === "google" || provider === "opencode-zen-google") {
    const requested = (modelIdentifier || "gemini-1.5-flash").replace(/^models\//, "").trim();

    const cacheKey = `${model.apiKeyEncrypted}:${requested}`;
    let candidateModels = googleModelCache.get(cacheKey);

    if (!candidateModels && provider === "google" && !model.endpoint) {
      try {
        const listRes = await requestJson(
          `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(apiKey)}`,
          { method: "GET", headers: { "content-type": "application/json" } }
        );
        if (Array.isArray(listRes.models)) {
          const supported = listRes.models
            .filter((m) => m.supportedGenerationMethods?.includes("generateContent"))
            .map((m) => m.name.replace(/^models\//, ""));

          const exactMatch = supported.find((m) => m.toLowerCase() === requested.toLowerCase());
          const partialMatch = supported.find((m) => m.toLowerCase().includes(requested.toLowerCase().replace(/gemini-?/i, "")));
          const flashMatch = supported.find((m) => /flash/i.test(m));

          candidateModels = [
            exactMatch,
            partialMatch,
            flashMatch,
            ...supported,
            requested,
            "gemini-2.0-flash",
            "gemini-1.5-flash",
            "gemini-1.5-pro",
          ].filter(Boolean);

          googleModelCache.set(cacheKey, candidateModels);
        }
      } catch (_) {}
    }

    if (!candidateModels && provider === "google") {
      candidateModels = [
        requested,
        "gemini-2.0-flash",
        "gemini-1.5-flash",
        "gemini-2.5-flash",
        "gemini-1.5-pro",
        "gemini-1.0-pro",
      ].filter(Boolean);
    }

    if (provider === "opencode-zen-google") {
      const endpoint = model.endpoint || `https://opencode.ai/zen/v1/models/${encodeURIComponent(requested)}`;
      const data = await requestJson(endpoint, {
        method: "POST",
        headers: { authorization: `Bearer ${apiKey}`, "content-type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature: 0, maxOutputTokens: maxOutputTokens } }),
      });
      text = data.candidates?.[0]?.content?.parts?.map((part) => part.text || "").join("").trim();
      usage = { input_tokens: data.usageMetadata?.promptTokenCount, output_tokens: data.usageMetadata?.candidatesTokenCount };
    } else {
    let data = null;
    let lastError = null;

    for (const candidate of [...new Set(candidateModels)]) {
      const urls = model.endpoint
        ? [`${model.endpoint}${model.endpoint.includes("?") ? "&" : "?"}key=${encodeURIComponent(apiKey)}`]
        : [
            `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(candidate)}:generateContent?key=${encodeURIComponent(apiKey)}`,
            `https://generativelanguage.googleapis.com/v1/models/${encodeURIComponent(candidate)}:generateContent?key=${encodeURIComponent(apiKey)}`,
          ];

      for (const url of urls) {
        try {
          data = await requestJson(url, {
            method: "POST",
            headers: { "content-type": "application/json" },
              body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: { temperature: 0, maxOutputTokens },
            }),
          });
          if (data) break;
        } catch (error) {
          lastError = error;
          if (String(error.message).includes("(404)")) {
            continue;
          }
          throw error;
        }
      }

      if (data) break;
    }

    if (!data) {
      throw lastError || new Error(`No supported Gemini model found for '${modelIdentifier}'.`);
    }

    text = data.candidates?.[0]?.content?.parts?.map((part) => part.text || "").join("").trim();
    usage = {
      input_tokens: data.usageMetadata?.promptTokenCount,
      output_tokens: data.usageMetadata?.candidatesTokenCount,
    };
    }
  } else if (["opencode-zen-compatible", "opencode-go-compatible", "opencode", "opencode-go", "deepseek", "moonshot", "xai"].includes(provider)) {
    // OpenCode / DeepSeek API Endpoint
    const defaultBase = provider === "moonshot"
      ? "https://api.moonshot.ai/v1"
      : provider === "xai"
        ? "https://api.x.ai/v1"
      : ["opencode-go", "opencode-go-compatible"].includes(provider)
        ? (process.env.OPENCODE_BASE_URL || "https://opencode.ai/zen/go/v1")
        : provider === "opencode-zen-compatible"
          ? (process.env.OPENCODE_BASE_URL || "https://opencode.ai/zen/v1")
        : provider === "opencode"
          ? (process.env.OPENCODE_BASE_URL || "https://opencode.ai/zen/v1")
        : "https://api.deepseek.com/v1";
    const base = (model.endpoint || defaultBase).replace(/\/$/, "");
    const endpointUrl = base.endsWith("/chat/completions") ? base : `${base}/chat/completions`;
    const candidateModels = ["moonshot", "xai", "opencode-go", "opencode-go-compatible", "opencode-zen-compatible"].includes(provider)
      ? [modelIdentifier].filter(Boolean)
      : [modelIdentifier, "deepseek-chat", "deepseek-coder"].filter(Boolean);

    let lastError = null;
    for (const candidate of candidateModels) {
      try {
        const data = await requestJson(endpointUrl, {
          method: "POST",
          headers: {
            authorization: `Bearer ${apiKey}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            model: candidate,
            messages: [{ role: "user", content: prompt }],
            temperature: isOpenCodeProvider ? 1 : 0,
                max_tokens: maxOutputTokens,
          }),
        });
        text = data.choices?.[0]?.message?.content?.trim();
        usage = { input_tokens: data.usage?.prompt_tokens, output_tokens: data.usage?.completion_tokens };
        if (text) break;
      } catch (err) {
        lastError = err;
      }
    }
    if (!text && lastError) throw lastError;
  } else if (provider === "groq") {
    // Groq Cloud LPU endpoint
    const base = (model.endpoint || "https://api.groq.com/openai/v1").replace(/\/$/, "");
    const candidateModels = [
      modelIdentifier,
      "openai/gpt-oss-120b",
      "openai/gpt-oss-20b",
      "qwen/qwen3.6-27b",
      "groq/compound",
    ].filter(Boolean);

    let lastError = null;
    for (const candidate of candidateModels) {
      try {
        const data = await requestJson(`${base}/chat/completions`, {
          method: "POST",
          headers: {
            authorization: `Bearer ${apiKey}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            model: candidate,
            messages: [{ role: "user", content: prompt }],
            temperature: 0,
            max_tokens: maxOutputTokens,
          }),
        });
        text = data.choices?.[0]?.message?.content?.trim();
        usage = { input_tokens: data.usage?.prompt_tokens, output_tokens: data.usage?.completion_tokens };
        if (text) break;
      } catch (err) {
        lastError = err;
      }
    }
    if (!text && lastError) throw lastError;
  } else if (provider === "huggingface" || provider === "hf") {
    // Hugging Face Serverless Inference / Router / Dedicated Endpoints
    const isCustomEndpoint = Boolean(model.endpoint);
    const candidateUrls = isCustomEndpoint
      ? [model.endpoint]
      : [
          "https://router.huggingface.co/hf-inference/v1/chat/completions",
          `https://api-inference.huggingface.co/models/${encodeURIComponent(modelIdentifier)}/v1/chat/completions`,
          `https://api-inference.huggingface.co/models/${encodeURIComponent(modelIdentifier)}`,
        ];

    let lastError = null;
    if (apiKey && apiKey.startsWith("hf_")) {
      for (const url of candidateUrls) {
        try {
          if (url.endsWith("/chat/completions") || isCustomEndpoint) {
            const data = await requestJson(url, {
              method: "POST",
              headers: {
                authorization: `Bearer ${apiKey}`,
                "content-type": "application/json",
              },
              body: JSON.stringify({
                model: modelIdentifier,
                messages: [{ role: "user", content: prompt }],
                temperature: 0.1,
                max_tokens: maxOutputTokens,
              }),
            });
            text = data.choices?.[0]?.message?.content?.trim() || data.output_text;
            usage = { input_tokens: data.usage?.prompt_tokens, output_tokens: data.usage?.completion_tokens };
          } else {
            // Raw pipeline inference format
            const data = await requestJson(url, {
              method: "POST",
              headers: {
                authorization: `Bearer ${apiKey}`,
                "content-type": "application/json",
              },
              body: JSON.stringify({
                inputs: prompt,
                parameters: {
                  max_new_tokens: maxOutputTokens,
                  temperature: 0.1,
                  return_full_text: false,
                },
              }),
            });
            if (Array.isArray(data) && data[0]?.generated_text) {
              text = data[0].generated_text.trim();
            } else if (typeof data === "object" && data.generated_text) {
              text = data.generated_text.trim();
            }
          }
          if (text) break;
        } catch (err) {
          lastError = err;
        }
      }
    }

    // High-availability open-weight fallback if HF router has no token or is unavailable
    if (!text) {
      const groqKey = process.env.GROQ_API_KEY || process.env.GROK_API_KEY;
      const opencodeKey = process.env.OPENCODE_API_KEY || process.env.DEEPSEEK_API_KEY;
      
      const mLower = modelIdentifier.toLowerCase();
      let fallbackModel = "llama-3.1-8b-instant";
      if (mLower.includes("qwen")) fallbackModel = "qwen/qwen3.6-27b";
      else if (mLower.includes("llama")) fallbackModel = "llama-3.3-70b-versatile";
      else if (mLower.includes("deepseek")) fallbackModel = "openai/gpt-oss-120b";
      else if (mLower.includes("mistral")) fallbackModel = "llama-3.1-8b-instant";

      if (groqKey) {
        const candidateFallbacks = [
          fallbackModel,
          "llama-3.1-8b-instant",
          "qwen/qwen3.6-27b",
          "openai/gpt-oss-120b",
        ];
        for (const fModel of [...new Set(candidateFallbacks)]) {
          try {
            const gData = await requestJson("https://api.groq.com/openai/v1/chat/completions", {
              method: "POST",
              headers: { authorization: `Bearer ${groqKey}`, "content-type": "application/json" },
              body: JSON.stringify({
                model: fModel,
                messages: [{ role: "user", content: prompt }],
                temperature: 0.1,
                max_tokens: maxOutputTokens,
              }),
            });
            text = gData.choices?.[0]?.message?.content?.trim();
            usage = { input_tokens: gData.usage?.prompt_tokens, output_tokens: gData.usage?.completion_tokens };
            if (text) break;
          } catch (err) {
            lastError = err;
          }
        }
      }
    }

    if (!text && lastError) throw lastError;
  } else {
    // OpenAI or compatible REST / vLLM / Ollama OpenAI endpoint
    const base = (model.endpoint || "https://api.openai.com/v1").replace(/\/$/, "");
    const endpointUrl = base.endsWith("/chat/completions") ? base : `${base}/chat/completions`;
    const data = await requestJson(endpointUrl, {
      method: "POST",
      headers: {
        authorization: `Bearer ${apiKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: modelIdentifier,
        messages: [{ role: "user", content: prompt }],
        temperature: 0,
        max_tokens: maxOutputTokens,
      }),
    });
    text = data.choices?.[0]?.message?.content?.trim();
    usage = { input_tokens: data.usage?.prompt_tokens, output_tokens: data.usage?.completion_tokens };
  }

  // Clean reasoning thought tags from output if present
  text = String(text || "").replace(/<think>[\s\S]*?<\/think>/gi, "").trim();

  if (!text) throw new Error("Provider returned an empty response.");
  const inputTokens = usage.input_tokens || estimateTokens(prompt);
  const outputTokens = usage.output_tokens || estimateTokens(text);
  return {
    output: text,
    latencyMs: Math.round(performance.now() - started),
    tokens: { input_tokens: inputTokens, output_tokens: outputTokens, total_tokens: inputTokens + outputTokens },
    provider,
  };
};

export default runRegisteredModel;
