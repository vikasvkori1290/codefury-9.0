import { performance } from "perf_hooks";
import { decryptCredential, redactSecret } from "./credential.service.js";

const estimateTokens = (text) => Math.max(1, Math.ceil(String(text || "").length / 3.8));

const providerError = async (response) => {
  const body = await response.text();
  return new Error(`Provider request failed (${response.status}): ${redactSecret(body).slice(0, 240)}`);
};

const requestJson = async (url, options) => {
  const response = await fetch(url, { ...options, signal: options.signal || AbortSignal.timeout(15000) });
  if (!response.ok) throw await providerError(response);
  return response.json();
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
      headers: { "x-api-key": apiKey, "anthropic-version": "2023-06-01", "content-type": "application/json" },
      body: JSON.stringify({ model: modelIdentifier, max_tokens: 512, temperature: 0, messages: [{ role: "user", content: prompt }] }),
    });
    text = data.content?.map((part) => part.text || "").join("").trim();
    usage = { input_tokens: data.usage?.input_tokens, output_tokens: data.usage?.output_tokens };
  } else if (provider === "google") {
    const modelNames = model.endpoint
      ? [modelIdentifier]
      : [...new Set([modelIdentifier, "gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash-latest"])]
        .map((name) => name.replace(/^models\//, ""));
    let data;
    let lastError;
    for (const candidate of modelNames) {
      const url = `${model.endpoint || `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(candidate)}:generateContent`}${model.endpoint ? "" : `?key=${encodeURIComponent(apiKey)}`}`;
      try {
        data = await requestJson(url, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature: 0, maxOutputTokens: 512 } }),
        });
        break;
      } catch (error) {
        lastError = error;
        if (!String(error.message).includes("(404)")) throw error;
      }
    }
    if (!data) throw lastError || new Error(`No supported Gemini model found for '${modelIdentifier}'.`);
    text = data.candidates?.[0]?.content?.parts?.map((part) => part.text || "").join("").trim();
    usage = { input_tokens: data.usageMetadata?.promptTokenCount, output_tokens: data.usageMetadata?.candidatesTokenCount };
  } else {
    const base = (model.endpoint || "https://api.openai.com/v1").replace(/\/$/, "");
    const data = await requestJson(`${base}/chat/completions`, {
      method: "POST",
      headers: { authorization: `Bearer ${apiKey}`, "content-type": "application/json" },
      body: JSON.stringify({ model: modelIdentifier, messages: [{ role: "user", content: prompt }], temperature: 0, max_tokens: 512 }),
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
