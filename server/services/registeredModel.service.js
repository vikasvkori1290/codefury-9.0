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
  const timeoutId = setTimeout(() => controller.abort(), 8000); // 8-second safety timeout

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
      throw new Error("Provider request timed out after 8 seconds.");
    }
    throw err;
  }
};

export const runRegisteredModel = async ({ model, prompt }) => {
  const started = performance.now();
  const apiKey = decryptCredential(model.apiKeyEncrypted);
  if (!apiKey) throw new Error("No API credential is configured for this model.");

  const provider = model.apiProvider || "openai";
  const modelIdentifier = model.modelIdentifier || model.name;
  let text = "";
  let usage = {};

  if (provider === "anthropic") {
    const data = await requestJson(model.endpoint || "https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: modelIdentifier,
        max_tokens: 512,
        temperature: 0,
        messages: [{ role: "user", content: prompt }],
      }),
    });
    text = data.content?.map((part) => part.text || "").join("").trim();
    usage = { input_tokens: data.usage?.input_tokens, output_tokens: data.usage?.output_tokens };
  } else if (provider === "google") {
    const requested = (modelIdentifier || "gemini-1.5-flash").replace(/^models\//, "").trim();

    const cacheKey = `${model.apiKeyEncrypted}:${requested}`;
    let candidateModels = googleModelCache.get(cacheKey);

    if (!candidateModels && !model.endpoint) {
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

    if (!candidateModels) {
      candidateModels = [
        requested,
        "gemini-2.0-flash",
        "gemini-1.5-flash",
        "gemini-2.5-flash",
        "gemini-1.5-pro",
        "gemini-1.0-pro",
      ].filter(Boolean);
    }

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
              generationConfig: { temperature: 0, maxOutputTokens: 512 },
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
  } else {
    // OpenAI or compatible REST / vLLM / Ollama OpenAI endpoint
    const base = (model.endpoint || "https://api.openai.com/v1").replace(/\/$/, "");
    const data = await requestJson(`${base}/chat/completions`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${apiKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: modelIdentifier,
        messages: [{ role: "user", content: prompt }],
        temperature: 0,
        max_tokens: 512,
      }),
    });
    text = data.choices?.[0]?.message?.content?.trim();
    usage = { input_tokens: data.usage?.prompt_tokens, output_tokens: data.usage?.completion_tokens };
  }

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
