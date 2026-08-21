export const chatWithModel = async (req, res, next) => {
  const startTime = Date.now();
  try {
    const {
      modelId = "",
      modelName = "",
      messages = [],
      apiKey: userApiKey,
      isPaidCredit = false,
      temperature = 0.7,
      systemPrompt,
    } = req.body;

    if (!messages || messages.length === 0) {
      return res.status(400).json({ success: false, message: "Messages array is required." });
    }

    const platformKey = process.env.GROQ_API_KEY || process.env.GROK_API_KEY || "";
    const apiKey = userApiKey ? String(userApiKey).trim() : isPaidCredit ? platformKey : "";

    if (!apiKey && !isPaidCredit) {
      return res.status(401).json({
        success: false,
        message: `No API Key provided for ${modelName || modelId || "this model"}. Please set its API Key in the top navigation bar.`,
      });
    }

    const effectiveKey = apiKey || platformKey;
    const isGeminiKey = effectiveKey.startsWith("AIza");
    const isGroqKey = effectiveKey.startsWith("gsk_");
    const isXaiKey = effectiveKey.startsWith("xai-");
    const isGeminiModel = String(modelId).toLowerCase().includes("gemini") || String(modelName).toLowerCase().includes("gemini");

    const defaultSystem = systemPrompt || `You are ${modelName || modelId || "an advanced AI model"}, an elite frontier neural network. Respond accurately, clearly, and concisely using rich GitHub-flavored markdown with code formatting when appropriate.`;

    // =========================================================================
    // 1. GOOGLE GEMINI API (Triggered if key starts with AIza or model is Gemini with Gemini key)
    // =========================================================================
    if (isGeminiKey || (isGeminiModel && !isGroqKey && !isXaiKey)) {
      const lastUserMessage = [...messages].reverse().find((m) => m.role === "user")?.content || "";
      const historyContext = messages.length > 1
        ? messages.slice(0, -1).map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`).join("\n\n")
        : "";

      const promptText = historyContext
        ? `${defaultSystem}\n\nPrevious conversation:\n${historyContext}\n\nCurrent Request:\n${lastUserMessage}`
        : `${defaultSystem}\n\n${lastUserMessage}`;

      const geminiBody = {
        contents: [
          {
            role: "user",
            parts: [{ text: promptText }],
          },
        ],
        generationConfig: {
          temperature: Number(temperature) || 0.7,
        },
      };

      // Step A: Dynamically discover active models on this key via ListModels
      let discoveredModels = [];
      try {
        const listRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${effectiveKey}`);
        if (listRes.ok) {
          const listData = await listRes.json();
          discoveredModels = (listData.models || [])
            .filter((m) => m.supportedGenerationMethods?.includes("generateContent"))
            .map((m) => m.name.replace(/^models\//, ""));
        }
      } catch (listErr) {
        console.warn("Gemini ListModels failed:", listErr.message);
      }

      // Step B: Build targeted candidate model list
      const isPro = String(modelId || modelName).toLowerCase().includes("pro");
      let candidateModels = [];

      if (discoveredModels.length > 0) {
        if (isPro) {
          const proModels = discoveredModels.filter((m) => m.includes("pro"));
          candidateModels = [...proModels, ...discoveredModels];
        } else {
          const flashModels = discoveredModels.filter((m) => m.includes("flash"));
          candidateModels = [...flashModels, ...discoveredModels];
        }
      } else {
        candidateModels = isPro
          ? ["gemini-1.5-pro", "gemini-2.0-flash", "gemini-2.0-flash-exp", "gemini-1.5-flash", "gemini-pro"]
          : ["gemini-1.5-flash", "gemini-2.0-flash", "gemini-2.0-flash-exp", "gemini-1.5-pro", "gemini-flash"];
      }

      // Remove duplicates
      const uniqueCandidates = Array.from(new Set(candidateModels));
      let lastGeminiError = null;

      for (const gModel of uniqueCandidates) {
        // Try v1beta first, then v1
        for (const apiVer of ["v1beta", "v1"]) {
          try {
            const geminiUrl = `https://generativelanguage.googleapis.com/${apiVer}/models/${gModel}:generateContent?key=${effectiveKey}`;
            const geminiRes = await fetch(geminiUrl, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(geminiBody),
            });

            if (geminiRes.ok) {
              const gData = await geminiRes.json();
              const latencyMs = Date.now() - startTime;
              const output = gData.candidates?.[0]?.content?.parts?.[0]?.text || "";
              const tokenCount = gData.usageMetadata?.candidatesTokenCount || gData.usageMetadata?.totalTokenCount || Math.ceil(output.length / 4) || 1;
              const tps = Math.max(1, Math.round(tokenCount / (Math.max(1, latencyMs) / 1000)));

              return res.json({
                success: true,
                output,
                latency_ms: latencyMs,
                tokens_per_sec: tps,
                tokens_used: gData.usageMetadata ? {
                  prompt_tokens: gData.usageMetadata.promptTokenCount,
                  completion_tokens: gData.usageMetadata.candidatesTokenCount,
                  total_tokens: gData.usageMetadata.totalTokenCount,
                } : { total_tokens: Math.ceil(output.length / 4) + 40 },
                model_used: modelName || gModel,
                engine: "Google Gemini Live Engine",
              });
            } else {
              const errData = await geminiRes.json().catch(() => ({}));
              lastGeminiError = errData.error?.message || `Status ${geminiRes.status}`;
            }
          } catch (callErr) {
            lastGeminiError = callErr.message;
          }
        }
      }

      console.error("All Gemini candidates failed. Last error:", lastGeminiError);
      return res.status(502).json({
        success: false,
        message: `Google Gemini API Error: ${lastGeminiError}`,
      });
    }

    // =========================================================================
    // 2. xAI GROK INFERENCE (keys starting with xai-)
    // =========================================================================
    if (isXaiKey) {
      try {
        const xaiResponse = await fetch("https://api.x.ai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${effectiveKey}`,
          },
          body: JSON.stringify({
            model: "grok-2-latest",
            messages: [
              { role: "system", content: defaultSystem },
              ...messages.map((m) => ({ role: m.role === "user" ? "user" : "assistant", content: String(m.content || "") })),
            ],
            temperature: Number(temperature) || 0.7,
            stream: false,
          }),
        });

        if (xaiResponse.ok) {
          const data = await xaiResponse.json();
          const latencyMs = Date.now() - startTime;
          const output = data.choices?.[0]?.message?.content || "";
          const tokenCount = data.usage?.completion_tokens || Math.ceil(output.length / 4) || 1;
          const tps = Math.max(1, Math.round(tokenCount / (Math.max(1, latencyMs) / 1000)));
          return res.json({
            success: true,
            output,
            latency_ms: latencyMs,
            tokens_per_sec: tps,
            tokens_used: data.usage,
            model_used: modelName || "grok-2-latest",
            engine: "xAI Live Engine",
          });
        }
      } catch (xaiErr) {
        return res.status(502).json({
          success: false,
          message: `xAI Connection Error: ${xaiErr.message}`,
        });
      }
    }

    // =========================================================================
    // 3. GROQ CLOUD LPU INFERENCE (Default / keys starting with gsk_)
    // =========================================================================
    const formattedMessages = [
      { role: "system", content: defaultSystem },
      ...messages.map((m) => ({
        role: m.role === "user" ? "user" : "assistant",
        content: String(m.content || ""),
      })),
    ];

    const groqCandidateModels = [
      "groq/compound",
      "openai/gpt-oss-120b",
      "qwen/qwen3.6-27b",
      "groq/compound-mini",
      "openai/gpt-oss-20b",
    ];

    let lastError = null;

    for (const groqModel of groqCandidateModels) {
      try {
        const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${effectiveKey}`,
          },
          body: JSON.stringify({
            model: groqModel,
            messages: formattedMessages,
            temperature: Number(temperature) || 0.7,
            stream: false,
          }),
        });

        if (groqResponse.ok) {
          const data = await groqResponse.json();
          const latencyMs = Date.now() - startTime;
          const output = data.choices?.[0]?.message?.content || "";
          const tokenCount = data.usage?.completion_tokens || Math.ceil(output.length / 4) || 1;
          const tps = Math.max(1, Math.round(tokenCount / (Math.max(1, latencyMs) / 1000)));

          return res.json({
            success: true,
            output,
            latency_ms: latencyMs,
            tokens_per_sec: tps,
            tokens_used: data.usage || {
              prompt_tokens: Math.ceil(messages.map((m) => m.content).join(" ").length / 4),
              completion_tokens: Math.ceil(output.length / 4),
              total_tokens: Math.ceil(output.length / 4) + 40,
            },
            model_used: modelName || data.model || groqModel,
            engine: isPaidCredit ? "ModelHub Cloud Credits" : "Groq LPU Ultra-Fast Engine",
          });
        } else {
          const errData = await groqResponse.json().catch(() => ({}));
          lastError = errData.error?.message || `Status ${groqResponse.status}`;
        }
      } catch (callErr) {
        lastError = callErr.message;
      }
    }

    return res.status(502).json({
      success: false,
      message: `Inference API Error: ${lastError}`,
    });
  } catch (error) {
    next(error);
  }
};
