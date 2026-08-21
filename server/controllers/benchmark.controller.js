import {
  runCreatorMistralModel,
  runOpenAIModel,
  runGoogleGeminiModel,
  runAnthropicClaudeModel,
} from "../services/modelProviders.service.js";
import {
  evaluateWithJudge,
  calculateCompositeRankings,
} from "../services/judge.service.js";

/**
 * @desc Run asynchronous multi-model benchmarking in parallel with LLM Judge evaluation
 * @route POST /api/benchmark
 * @access Public
 */
export const runBenchmark = async (req, res, next) => {
  try {
    const {
      prompt,
      category = "extraction",
      priority = "latency",
      test_cases = [],
      expected_output = "",
      selected_models = [],
    } = req.body;

    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return res.status(400).json({
        success: false,
        message: "A valid non-empty prompt string is required for benchmarking.",
      });
    }

    const runnerOptions = {
      prompt: prompt.trim(),
      category: category.toLowerCase(),
      expectedOutput: expected_output,
    };

    // Determine which models to execute
    const modelTasks = [];

    const shouldRun = (id) => {
      if (!selected_models || selected_models.length === 0) return true;
      return selected_models.includes(id);
    };

    if (shouldRun("mistral-7b-niche")) {
      modelTasks.push(runCreatorMistralModel(runnerOptions));
    }
    if (shouldRun("gpt-4o-mini")) {
      modelTasks.push(runOpenAIModel(runnerOptions));
    }
    if (shouldRun("gemini-1.5-flash")) {
      modelTasks.push(runGoogleGeminiModel(runnerOptions));
    }
    if (shouldRun("claude-3-5-haiku")) {
      modelTasks.push(runAnthropicClaudeModel(runnerOptions));
    }

    if (modelTasks.length === 0) {
      modelTasks.push(
        runCreatorMistralModel(runnerOptions),
        runOpenAIModel(runnerOptions),
        runGoogleGeminiModel(runnerOptions),
        runAnthropicClaudeModel(runnerOptions)
      );
    }

    // Step 1: Execute concurrent model inferences
    const settledResults = await Promise.allSettled(modelTasks);

    const initialResults = settledResults.map((r, idx) => {
      if (r.status === "fulfilled") {
        return r.value;
      } else {
        return {
          model_id: `unknown-${idx}`,
          model_name: `Model ${idx + 1}`,
          status: "error",
          error_message: r.reason?.message || "Execution failed",
          latency_ms: 0,
          tokens_used: { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 },
          estimated_cost_usd: 0,
          cost_per_1m: 0,
          accuracy_score: 0,
        };
      }
    });

    // Step 2: Automated LLM-as-a-Judge Quality Evaluation
    const evaluations = await evaluateWithJudge({
      prompt: runnerOptions.prompt,
      category: runnerOptions.category,
      expectedOutput: runnerOptions.expectedOutput,
      results: initialResults,
    });

    // Step 3: Composite Score Weighting & Winner Determination
    const { scoredResults, awards } = calculateCompositeRankings(
      initialResults,
      evaluations,
      priority
    );

    const successful = scoredResults.filter((r) => r.status === "success");
    const bestOverall = scoredResults[0];
    const fastest = [...successful].sort((a, b) => a.latency_ms - b.latency_ms)[0];
    const cheapest = [...successful].sort((a, b) => a.estimated_cost_usd - b.estimated_cost_usd)[0];

    return res.status(200).json({
      success: true,
      timestamp: new Date().toISOString(),
      query: {
        prompt: runnerOptions.prompt,
        category: runnerOptions.category,
        priority,
        test_cases_count: Array.isArray(test_cases) ? test_cases.length : 0,
      },
      summary: {
        fastest_model: fastest?.model_name || null,
        fastest_latency_ms: fastest?.latency_ms || null,
        cheapest_model: cheapest?.model_name || null,
        cheapest_cost_usd: cheapest?.estimated_cost_usd || null,
        best_overall_model: bestOverall?.model_name || null,
        best_overall_score: bestOverall?.composite_score || null,
        recommended_winner: bestOverall?.model_name || null,
        creator_speedup_factor: fastest ? +(610 / Math.max(1, fastest.latency_ms)).toFixed(1) : 2.8,
        awards,
      },
      results: scoredResults,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get available model specifications and benchmark catalog
 * @route GET /api/benchmark/models
 * @access Public
 */
export const getAvailableModels = async (req, res) => {
  return res.status(200).json({
    success: true,
    models: [
      {
        model_id: "mistral-7b-niche",
        model_name: "Mistral-7B-Niche-Extract (by @AIArchitect)",
        creator_type: "creator",
        provider: "Creator / Hugging Face",
        rate_per_1m_tokens: 0.15,
        target_domains: ["extraction", "summarization", "coding"],
      },
      {
        model_id: "gpt-4o-mini",
        model_name: "GPT-4o-mini",
        creator_type: "frontier",
        provider: "OpenAI",
        rate_per_1m_tokens: 0.60,
        target_domains: ["general", "multimodal"],
      },
      {
        model_id: "gemini-1.5-flash",
        model_name: "Gemini 1.5 Flash",
        creator_type: "frontier",
        provider: "Google",
        rate_per_1m_tokens: 0.30,
        target_domains: ["general", "long-context"],
      },
      {
        model_id: "claude-3-5-haiku",
        model_name: "Claude 3.5 Haiku",
        creator_type: "frontier",
        provider: "Anthropic",
        rate_per_1m_tokens: 1.00,
        target_domains: ["reasoning", "coding"],
      },
    ],
  });
};
