import ModelListing from "../models/ModelListing.model.js";

export const chatWithModel = async (req, res, next) => {
  const startTime = Date.now();
  try {
    const {
      modelId,
      modelName,
      messages = [],
      apiKey: userApiKey,
      temperature = 0.7,
      systemPrompt,
    } = req.body;

    if (!messages || messages.length === 0) {
      return res.status(400).json({ success: false, message: "Messages array is required." });
    }

    const grokKey = userApiKey || process.env.GROK_API_KEY || process.env.XAI_API_KEY;

    // 1. If Grok / xAI API key is provided, execute live inference with Grok
    if (grokKey) {
      const defaultSystem = systemPrompt || `You are ${modelName || modelId || "an advanced AI model"}, an elite frontier neural network. Respond accurately, clearly, and concisely using rich GitHub-flavored markdown with code formatting when appropriate.`;

      const formattedMessages = [
        { role: "system", content: defaultSystem },
        ...messages.map((m) => ({
          role: m.role === "user" ? "user" : "assistant",
          content: String(m.content || ""),
        })),
      ];

      try {
        const xaiResponse = await fetch("https://api.x.ai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${grokKey.trim()}`,
          },
          body: JSON.stringify({
            model: "grok-2-latest",
            messages: formattedMessages,
            temperature: Number(temperature) || 0.7,
            stream: false,
          }),
        });

        if (!xaiResponse.ok) {
          const errData = await xaiResponse.json().catch(() => ({}));
          // If grok-2-latest isn't accepted, try grok-beta fallback
          const fallbackRes = await fetch("https://api.x.ai/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${grokKey.trim()}`,
            },
            body: JSON.stringify({
              model: "grok-beta",
              messages: formattedMessages,
              temperature: Number(temperature) || 0.7,
              stream: false,
            }),
          });

          if (!fallbackRes.ok) {
            const fallbackErr = await fallbackRes.json().catch(() => ({}));
            throw new Error(errData.error?.message || fallbackErr.error?.message || `xAI API returned status ${xaiResponse.status}`);
          }

          const fallbackData = await fallbackRes.json();
          const latencyMs = Date.now() - startTime;
          const output = fallbackData.choices?.[0]?.message?.content || "";
          return res.json({
            success: true,
            output,
            latency_ms: latencyMs,
            tokens_used: fallbackData.usage || {
              prompt_tokens: Math.ceil(messages.map((m) => m.content).join(" ").length / 4),
              completion_tokens: Math.ceil(output.length / 4),
              total_tokens: Math.ceil(output.length / 4) + 50,
            },
            model_used: fallbackData.model || "grok-beta",
            engine: "xAI Grok Live Engine",
          });
        }

        const data = await xaiResponse.json();
        const latencyMs = Date.now() - startTime;
        const output = data.choices?.[0]?.message?.content || "";

        return res.json({
          success: true,
          output,
          latency_ms: latencyMs,
          tokens_used: data.usage || {
            prompt_tokens: Math.ceil(messages.map((m) => m.content).join(" ").length / 4),
            completion_tokens: Math.ceil(output.length / 4),
            total_tokens: Math.ceil(output.length / 4) + 50,
          },
          model_used: data.model || "grok-2-latest",
          engine: "xAI Grok Live Engine",
        });
      } catch (apiErr) {
        console.error("Grok inference call error:", apiErr.message);
        // If xAI fails, return clean informative error
        return res.status(502).json({
          success: false,
          message: `Grok API error: ${apiErr.message}`,
        });
      }
    }

    // 2. Try local Ollama if running
    try {
      const lastUserMsg = [...messages].reverse().find((m) => m.role === "user")?.content || "";
      const ollamaRes = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: modelId || "qwen2.5:3b",
          prompt: lastUserMsg,
          stream: false,
        }),
      });

      if (ollamaRes.ok) {
        const odata = await ollamaRes.json();
        const latencyMs = Date.now() - startTime;
        return res.json({
          success: true,
          output: odata.response || "",
          latency_ms: latencyMs,
          tokens_used: { total_tokens: odata.eval_count || 120 },
          engine: "Local Ollama Inference",
        });
      }
    } catch {
      // Ollama not running
    }

    // 3. Fallback when no Grok key is configured yet
    const lastUserMsg = [...messages].reverse().find((m) => m.role === "user")?.content || "";
    const latencyMs = Date.now() - startTime;
    return res.json({
      success: true,
      output: `Connected to **${modelName || modelId}**!\n\nTo enable live responses, please paste your **Grok (xAI) API Key** in the top-right **"🔑 Set Grok API Key"** button or add \`GROK_API_KEY=your_key\` to \`server/.env\`.\n\n*Received test prompt:* "${lastUserMsg}"`,
      latency_ms: latencyMs > 0 ? latencyMs : 85,
      tokens_used: { total_tokens: 45 },
      engine: "ModelHub Simulation (Add Grok API Key for live chat)",
    });
  } catch (error) {
    next(error);
  }
};
