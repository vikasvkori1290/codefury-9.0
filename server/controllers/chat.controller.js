import { runCreatorMistralModel, runOpenAIModel, runGoogleGeminiModel, runAnthropicClaudeModel, runModelInference } from "../services/modelProviders.service.js";
import ModelListing from "../models/ModelListing.model.js";

const runners = { "mistral-7b-niche-extract": runCreatorMistralModel, "gpt-4o-mini": runOpenAIModel, "gemini-1.5-flash": runGoogleGeminiModel, "claude-3-5-haiku": runAnthropicClaudeModel };
export const chatWithModel = async (req, res, next) => {
  try {
    const { modelId, messages = [] } = req.body;
    const message = [...messages].reverse().find((item) => item.role === "user");
    if (!message?.content?.trim()) return res.status(400).json({ success: false, message: "A user message is required." });
    const runner = runners[modelId];
    let result;
    if (runner) result = await runner({ prompt: message.content.trim(), category: "general", expectedOutput: "" });
    else {
      const model = await ModelListing.findOne({ name: modelId }).catch(() => null);
      if (model) { const local = await runModelInference({ model, prompt: message.content.trim() }); result = { output_text: local.output, latency_ms: local.latency_ms || 0, tokens_used: { total_tokens: Math.ceil(local.output.length / 4) }, estimated_cost_usd: 0 }; }
      else result = { output_text: `[${modelId}] Demo response for: ${message.content.trim()}`, latency_ms: 118, tokens_used: { total_tokens: Math.ceil(message.content.length / 4) + 30 }, estimated_cost_usd: 0 };
    }
    res.json({ success: true, output: result.output_text, latency_ms: result.latency_ms, tokens_used: result.tokens_used, estimated_cost_usd: result.estimated_cost_usd || 0 });
  } catch (error) { next(error); }
};
