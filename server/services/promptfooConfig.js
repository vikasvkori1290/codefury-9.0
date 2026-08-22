import path from "path";
import fs from "fs";

/**
 * 20-Test High-Rigor Objective Ground-Truth Benchmark Suite (LiveBench Standard)
 * Zero LLM Judge Bias - 100% Programmatically Verified
 * 
 * 4 Core Domains (5 Tests Each):
 * 1. Math & Exact Logic (GSM8K competition logic & exact arithmetic)
 * 2. Coding & Execution (Unit-tested JS algorithms in sandboxed VM)
 * 3. JSON Schema & Extraction (Strict schema & structured data verification)
 * 4. Complex Instruction Following (Multi-constraint, lipogram, and token delimiters)
 */
export const getBenchmarkTestCases = () => {
  return [
    // ==================== 1. MATH & EXACT LOGIC (5 Tests) ====================
    {
      id: "math_1",
      vars: {
        prompt: "A bag contains 5 red, 4 green, and 3 blue marbles. If 3 marbles are drawn uniformly at random without replacement, what is the probability that all 3 marbles have pairwise distinct colors? Output ONLY the simplified fraction in the format P/Q (e.g. 3/11).",
      },
      assert: [{ type: "regex_numeric", expectedNumber: 3/11, regex: "^3/11$", exact: true }],
      metadata: {
        category: "math_logic",
        title: "Combinatorial Hypergeometric Probability",
        expected: "3/11",
      },
    },
    {
      id: "math_2",
      vars: {
        prompt: "Pipe A fills a reservoir in 6 hours, Pipe B in 8 hours, and Pipe C empties it in 12 hours. If all three operate simultaneously from empty, how many hours does it take to completely fill the reservoir? Output ONLY the exact numeric decimal value (e.g. 4.8).",
      },
      assert: [{ type: "regex_numeric", expectedNumber: 4.8, regex: "^4\\.8(?:0+)?$", exact: true }],
      metadata: {
        category: "math_logic",
        title: "Multi-Rate Reservoir Differential Flow",
        expected: "4.8",
      },
    },
    {
      id: "math_3",
      vars: {
        prompt: "Find the smallest positive integer N such that N mod 5 = 3, N mod 7 = 4, and N mod 3 = 2. Output ONLY the integer value of N.",
      },
      assert: [{ type: "regex_numeric", expectedNumber: 53, regex: "^53$", exact: true }],
      metadata: {
        category: "math_logic",
        title: "Chinese Remainder Modular Resolution",
        expected: "53",
      },
    },
    {
      id: "math_4",
      vars: {
        prompt: "An investment portfolio starts at $20,000. It gains 30% in year 1, loses 25% in year 2, and gains 15% in year 3. What is the final value in dollars? Output ONLY the integer value.",
      },
      assert: [{ type: "regex_numeric", expectedNumber: 22425, regex: "^22425(?:\\.0+)?$", exact: true }],
      metadata: {
        category: "math_logic",
        title: "Compound Non-Linear Portfolio Valuation",
        expected: "22425",
      },
    },
    {
      id: "math_5",
      vars: {
        prompt: "A planar connected graph has 18 vertices and divides the plane into 12 faces. According to Euler's formula V - E + F = 2, how many edges does this graph have? Output ONLY the integer value.",
      },
      assert: [{ type: "regex_numeric", expectedNumber: 28, regex: "^28$", exact: true }],
      metadata: {
        category: "math_logic",
        title: "Planar Graph Topology (Euler Characteristic)",
        expected: "28",
      },
    },

    // ==================== 2. CODING & EXECUTION (5 Tests) ====================
    {
      id: "code_1",
      vars: {
        prompt: "Write a JavaScript function `lengthOfLongestSubstring(s)` that returns the length of the longest substring without repeating characters. Output ONLY the executable JavaScript function definition without markdown if possible.",
      },
      assert: [
        {
          type: "code_unit_test",
          fnName: "lengthOfLongestSubstring",
          testCases: [
            { input: ["abcabcbb"], expected: 3 },
            { input: ["bbbbb"], expected: 1 },
            { input: ["pwwkew"], expected: 3 },
            { input: ["dvdf"], expected: 3 },
            { input: [" "], expected: 1 },
            { input: ["au"], expected: 2 },
          ],
        },
      ],
      metadata: {
        category: "code_execution",
        title: "Sliding Window Substring (6 Edge Vectors)",
        expected: "Pass 6 hidden algorithmic test cases",
      },
    },
    {
      id: "code_2",
      vars: {
        prompt: "Write a JavaScript function `deepEqual(a, b)` that returns true if two values/objects/arrays are deeply equal in structure and values, false otherwise. Must handle primitives, nested arrays, and nested objects without using JSON.stringify. Output ONLY the JavaScript function.",
      },
      assert: [
        {
          type: "code_unit_test",
          fnName: "deepEqual",
          testCases: [
            {
              evalStr: "return deepEqual({ a: [1, 2], b: { c: 'x' } }, { a: [1, 2], b: { c: 'x' } }) === true;",
              expected: true,
            },
            {
              evalStr: "return deepEqual({ a: 1, b: 2 }, { a: 1, b: 3 }) === false;",
              expected: true,
            },
            {
              evalStr: "return deepEqual([1, null, { k: 2 }], [1, null, { k: 2 }]) === true;",
              expected: true,
            },
            {
              evalStr: "return deepEqual({ a: 1 }, { a: 1, b: undefined }) === false;",
              expected: true,
            },
          ],
        },
      ],
      metadata: {
        category: "code_execution",
        title: "Recursive Deep Structural Equality Comparator",
        expected: "Pass nested objects & arrays equality checks",
      },
    },
    {
      id: "code_3",
      vars: {
        prompt: "Write a JavaScript function `maxSubarraySum(nums)` that finds the maximum sum of a contiguous non-empty subarray in an array of integers (Kadane's Algorithm). Output ONLY the JavaScript function.",
      },
      assert: [
        {
          type: "code_unit_test",
          fnName: "maxSubarraySum",
          testCases: [
            { input: [[-2, 1, -3, 4, -1, 2, 1, -5, 4]], expected: 6 },
            { input: [[-5, -2, -8, -1]], expected: -1 },
            { input: [[5, 4, -1, 7, 8]], expected: 23 },
            { input: [[-10]], expected: -10 },
          ],
        },
      ],
      metadata: {
        category: "code_execution",
        title: "Contiguous Maximum Subarray (Kadane Dynamic Programming)",
        expected: "Pass positive, negative, and mixed array tests",
      },
    },
    {
      id: "code_4",
      vars: {
        prompt: "Write a JavaScript function `hasCycle(numNodes, edges)` where edges is an array of [dest, src] directed edges. Return true if there is a cycle in the directed graph, false otherwise. Output ONLY the JavaScript function.",
      },
      assert: [
        {
          type: "code_unit_test",
          fnName: "hasCycle",
          testCases: [
            { input: [2, [[1, 0]]], expected: false },
            { input: [2, [[1, 0], [0, 1]]], expected: true },
            { input: [4, [[1, 0], [2, 1], [3, 2], [1, 3]]], expected: true },
            { input: [3, [[1, 0], [2, 0]]], expected: false },
          ],
        },
      ],
      metadata: {
        category: "code_execution",
        title: "Directed Graph Cycle Detection & Topological Validation",
        expected: "Pass acyclic DAG and cyclic graph tests",
      },
    },
    {
      id: "code_5",
      vars: {
        prompt: "Write a JavaScript function `minDistance(word1, word2)` that computes the Levenshtein minimum edit distance (insertions, deletions, substitutions) between two strings. Output ONLY the JavaScript function.",
      },
      assert: [
        {
          type: "code_unit_test",
          fnName: "minDistance",
          testCases: [
            { input: ["horse", "ros"], expected: 3 },
            { input: ["intention", "execution"], expected: 5 },
            { input: ["", "abc"], expected: 3 },
            { input: ["same", "same"], expected: 0 },
          ],
        },
      ],
      metadata: {
        category: "code_execution",
        title: "Levenshtein String Edit Distance Algorithm",
        expected: "Pass dynamic programming matrix tests",
      },
    },

    // ==================== 3. JSON SCHEMA & EXTRACTION (5 Tests) ====================
    {
      id: "schema_1",
      vars: {
        prompt: "Extract invoice data: 'Invoice #INV-2026-X99 for Client ID CLI-402 on 2026-08-20. Subtotal: $1200.00, Tax Rate: 0.15, Tax Amount: $180.00, Total Due: $1380.00. Payment Status: UNPAID. Currency: USD.' into raw JSON with exact keys: `invoice_id` (string), `client_id` (string), `subtotal` (number), `tax_rate` (number), `tax_amount` (number), `total_due` (number), `is_paid` (boolean), `currency` (string). Output ONLY raw JSON.",
      },
      assert: [
        {
          type: "json_schema_validation",
          requiredKeys: ["invoice_id", "client_id", "subtotal", "tax_rate", "tax_amount", "total_due", "is_paid", "currency"],
          exactKeys: true,
          validateFn: (obj) =>
            obj.invoice_id === "INV-2026-X99" &&
            obj.client_id === "CLI-402" &&
            obj.subtotal === 1200 &&
            obj.tax_rate === 0.15 &&
            obj.tax_amount === 180 &&
            obj.total_due === 1380 &&
            obj.is_paid === false &&
            obj.currency === "USD",
        },
      ],
      metadata: {
        category: "schema_adherence",
        title: "Multi-Rate Financial Invoice & Balance Extraction",
        expected: "Valid JSON with exact typed float and boolean keys",
      },
    },
    {
      id: "schema_2",
      vars: {
        prompt: "Parse telemetry span: 'SPAN 4f9a7c2e-8b11-4089-a2de-199c4b220d91 in service payment-gateway duration=42.5ms status=SUCCESS http_code=200 caller_ip=10.0.4.12' into raw JSON with exact keys: `span_id` (string), `service` (string), `duration_ms` (number), `success` (boolean), `http_code` (number), `ip` (string). Output ONLY raw JSON.",
      },
      assert: [
        {
          type: "json_schema_validation",
          requiredKeys: ["span_id", "service", "duration_ms", "success", "http_code", "ip"],
          exactKeys: true,
          validateFn: (obj) =>
            /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(obj.span_id) &&
            obj.service === "payment-gateway" &&
            obj.duration_ms === 42.5 &&
            obj.success === true &&
            obj.http_code === 200 &&
            obj.ip === "10.0.4.12",
        },
      ],
      metadata: {
        category: "schema_adherence",
        title: "Distributed Microservice Telemetry Span Parsing",
        expected: "Valid JSON with UUID span and numeric duration",
      },
    },
    {
      id: "schema_3",
      vars: {
        prompt: "Parse cluster config: 'Node: cluster-us-east-01, Region: us-east-1, Cores: 64, MemoryGB: 256, GPU: NVIDIA-H100-80GB, Active: yes, PricePerHour: 3.85' into raw JSON with exact keys: `node_name` (string), `region` (string), `cores` (number), `memory_gb` (number), `gpu_model` (string), `is_active` (boolean), `hourly_rate` (number). Output ONLY raw JSON.",
      },
      assert: [
        {
          type: "json_schema_validation",
          requiredKeys: ["node_name", "region", "cores", "memory_gb", "gpu_model", "is_active", "hourly_rate"],
          exactKeys: true,
          validateFn: (obj) =>
            obj.node_name === "cluster-us-east-01" &&
            obj.region === "us-east-1" &&
            obj.cores === 64 &&
            obj.memory_gb === 256 &&
            obj.gpu_model === "NVIDIA-H100-80GB" &&
            obj.is_active === true &&
            obj.hourly_rate === 3.85,
        },
      ],
      metadata: {
        category: "schema_adherence",
        title: "Infrastructure Cluster Specification Mapping",
        expected: "Valid JSON with exact typed hardware attributes",
      },
    },
    {
      id: "schema_4",
      vars: {
        prompt: "Parse patient lab result: 'Patient ID: PT-7821. Test: Fasting Blood Glucose. Measured Value: 142.5 mg/dL. Normal Range: 70-99. Flag: HIGH. Fasting: true.' into raw JSON with exact keys: `patient_id` (string), `test_name` (string), `value` (number), `is_abnormal` (boolean), `flag` (string 'HIGH'|'LOW'|'NORMAL'), `fasting` (boolean). Output ONLY raw JSON.",
      },
      assert: [
        {
          type: "json_schema_validation",
          requiredKeys: ["patient_id", "test_name", "value", "is_abnormal", "flag", "fasting"],
          exactKeys: true,
          validateFn: (obj) =>
            obj.patient_id === "PT-7821" &&
            obj.test_name === "Fasting Blood Glucose" &&
            obj.value === 142.5 &&
            obj.is_abnormal === true &&
            obj.flag === "HIGH" &&
            obj.fasting === true,
        },
      ],
      metadata: {
        category: "schema_adherence",
        title: "Clinical Diagnostic Lab Telemetry Extraction",
        expected: "Valid JSON with abnormal diagnostic booleans and flags",
      },
    },
    {
      id: "schema_5",
      vars: {
        prompt: "Extract order: 'Order #ORD-9901 items: 2x Laptop at $999.00 each, 3x Mouse at $25.00 each. Total: $2073.00.' into raw JSON with exact keys: `order_id` (string), `items` (array of objects with { `name`: string, `quantity`: number, `price`: number }), `total` (number). Output ONLY raw JSON.",
      },
      assert: [
        {
          type: "json_schema_validation",
          requiredKeys: ["order_id", "items", "total"],
          exactKeys: true,
          validateFn: (obj) =>
            obj.order_id === "ORD-9901" &&
            Array.isArray(obj.items) &&
            obj.items.length === 2 &&
            obj.total === 2073 &&
            obj.items.some((i) => /laptop/i.test(i.name) && i.quantity === 2 && i.price === 999) &&
            obj.items.some((i) => /mouse/i.test(i.name) && i.quantity === 3 && i.price === 25),
        },
      ],
      metadata: {
        category: "schema_adherence",
        title: "Hierarchical E-Commerce Line-Item Array Schema",
        expected: "Valid nested JSON with items array and calculated total",
      },
    },

    // ==================== 4. COMPLEX INSTRUCTION FOLLOWING (5 Tests) ====================
    {
      id: "rule_1",
      vars: {
        prompt: "Write a description of a dark rainy night that consists of EXACTLY 20 words and contains NO occurrence of the letter 'e' or 'E' anywhere. Count words and check for letter 'e' strictly before outputting.",
      },
      assert: [
        {
          type: "word_count_exact",
          count: 20,
        },
        {
          type: "lipogram_constraint",
          forbiddenLetter: "e",
          minChars: 20,
        },
      ],
      metadata: {
        category: "rule_following",
        title: "Exact 20-Word Length + Negative Lipogram (Zero 'e')",
        expected: "Exactly 20 words with zero occurrences of 'e'",
      },
    },
    {
      id: "rule_2",
      vars: {
        prompt: "Output 3 distinct cybersecurity tips strictly formatted inside sequential numbered tags <[TIP_1]>...</[TIP_1]>, <[TIP_2]>...</[TIP_2]>, <[TIP_3]>...</[TIP_3]> on separate lines with no other text.",
      },
      assert: [
        {
          type: "delimiter_pattern",
          regex: "^<[TIP_1]>[\\s\\S]+<\\/[TIP_1]>\\s*<[TIP_2]>[\\s\\S]+<\\/[TIP_2]>\\s*<[TIP_3]>[\\s\\S]+<\\/[TIP_3]>$",
        },
      ],
      metadata: {
        category: "rule_following",
        title: "Strict Multi-Block XML Delimiter Sequencing",
        expected: "Exact <[TIP_1]> to <[TIP_3]> encapsulated tags",
      },
    },
    {
      id: "rule_3",
      vars: {
        prompt: "Output exactly 4 hex color codes (e.g. #FF0000) enclosed inside triple hash brackets ### #HEX ### with each on a new line and nothing else.",
      },
      assert: [
        {
          type: "delimiter_pattern",
          regex: "^(###\\s*#[0-9A-Fa-f]{6}\\s*###\\s*){4}$",
        },
      ],
      metadata: {
        category: "rule_following",
        title: "Hex Token Matrix Enclosure (4 Delimited Matches)",
        expected: "4 lines of ### #HEX ### format exactly",
      },
    },
    {
      id: "rule_4",
      vars: {
        prompt: "Output a comma-separated list of 5 programming languages wrapped in [LANGUAGES_START] and [LANGUAGES_END] with ZERO whitespace anywhere between the brackets (e.g. [LANGUAGES_START]c,go,rust,python,java[LANGUAGES_END]).",
      },
      assert: [
        {
          type: "prefix_suffix_wrap",
          prefix: "[LANGUAGES_START]",
          suffix: "[LANGUAGES_END]",
        },
        {
          type: "no_internal_whitespace",
        },
      ],
      metadata: {
        category: "rule_following",
        title: "Zero-Whitespace Bracketed Entity Serialization",
        expected: "[LANGUAGES_START]l1,l2,l3,l4,l5[LANGUAGES_END] with 0 whitespace",
      },
    },
    {
      id: "rule_5",
      vars: {
        prompt: "Write a coherent 5-word sentence where EVERY SINGLE WORD starts with the letter 's' (or 'S'). Do not use punctuation. Output ONLY the 5 words.",
      },
      assert: [
        {
          type: "alliteration_constraint",
          letter: "s",
          count: 5,
        },
      ],
      metadata: {
        category: "rule_following",
        title: "Strict 5-Word Alliteration Constraint (Letter 'S')",
        expected: "5 words, all starting with letter S and zero punctuation",
      },
    },
  ];
};

/**
 * Generates promptfoo config for local CLI runs if executed directly
 */
export const generatePromptfooConfig = async (modelName = "qwen2.5:3b", outputPath = null) => {
  const testCases = getBenchmarkTestCases();
  const config = {
    description: `Deterministic LiveBench Standard Benchmark for ${modelName}`,
    prompts: ["{{prompt}}"],
    providers: [`ollama:${modelName}`],
    tests: testCases.map((tc) => ({
      vars: tc.vars,
      assert: tc.assert,
      metadata: tc.metadata,
    })),
  };

  const configPath = outputPath || path.join(
    process.env.VERCEL ? "/tmp" : process.cwd(),
    process.env.VERCEL ? "codefury-benchmarks" : "server/temp",
    "promptfoo.config.json",
  );
  const tempDir = path.dirname(configPath);
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

  fs.writeFileSync(configPath, JSON.stringify(config, null, 2), "utf8");
  return configPath;
};
