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
        prompt: "A store sells notebooks for $4 each and pens for $2 each. Janet buys 5 notebooks and 6 pens. She pays with a $50 bill. How much change does she receive in dollars? Output only the final numeric integer value.",
      },
      assert: [{ type: "regex_numeric", expectedNumber: 18, regex: "\\b18(\\b|\\.00)" }],
      metadata: {
        category: "math_logic",
        title: "GSM8K Multi-Step Transaction Arithmetic",
        expected: "18",
      },
    },
    {
      id: "math_2",
      vars: {
        prompt: "A train travels at 60 mph for 2.5 hours and then 80 mph for 1.5 hours. What is the total distance traveled in miles? Output only the numeric value.",
      },
      assert: [{ type: "regex_numeric", expectedNumber: 270, regex: "\\b270(\\b|\\.0)" }],
      metadata: {
        category: "math_logic",
        title: "Compound Speed-Time Integration",
        expected: "270",
      },
    },
    {
      id: "math_3",
      vars: {
        prompt: "A bakery made 240 cookies. They sold 3/4 of them in the morning and 1/3 of the remainder in the afternoon. How many cookies are left? Output only the integer number.",
      },
      assert: [{ type: "regex_numeric", expectedNumber: 40, regex: "\\b40\\b" }],
      metadata: {
        category: "math_logic",
        title: "Sequential Fractional Depletion Logic",
        expected: "40",
      },
    },
    {
      id: "math_4",
      vars: {
        prompt: "In a round-robin tournament of 8 teams, every team plays every other team exactly once. How many total matches are played? Output only the numeric answer.",
      },
      assert: [{ type: "regex_numeric", expectedNumber: 28, regex: "\\b28\\b" }],
      metadata: {
        category: "math_logic",
        title: "Combinatorics & Graph Clique Sizing",
        expected: "28",
      },
    },
    {
      id: "math_5",
      vars: {
        prompt: "If a 12-hour clock shows exactly 8:00 right now, what hour will it show in exactly 150 hours? Give only the number from 1 to 12.",
      },
      assert: [{ type: "regex_numeric", expectedNumber: 2, regex: "\\b2\\b" }],
      metadata: {
        category: "math_logic",
        title: "Modular Arithmetic Cycle Resolution",
        expected: "2",
      },
    },

    // ==================== 2. CODING & EXECUTION (5 Tests) ====================
    {
      id: "code_1",
      vars: {
        prompt: "Write a JavaScript function `isPalindrome(str)` that returns true if `str` (ignoring non-alphanumeric chars and case) is a palindrome, false otherwise. Output ONLY the executable JavaScript function definition without markdown if possible.",
      },
      assert: [
        {
          type: "code_unit_test",
          fnName: "isPalindrome",
          testCases: [
            { input: ["A man, a plan, a canal: Panama"], expected: true },
            { input: ["race a car"], expected: false },
            { input: ["Was it a car or a cat I saw?"], expected: true },
          ],
        },
      ],
      metadata: {
        category: "code_execution",
        title: "Sanitized Palindrome Algorithm (3 Unit Tests)",
        expected: "Pass 3 hidden assertion vectors",
      },
    },
    {
      id: "code_2",
      vars: {
        prompt: "Write a JavaScript function `deepClone(obj)` that returns a deep copy of an object/array without using JSON.parse. Output ONLY the JavaScript function definition.",
      },
      assert: [
        {
          type: "code_unit_test",
          fnName: "deepClone",
          testCases: [
            {
              evalStr: "const o = { a: 1, b: { c: 2 } }; const c = deepClone(o); c.b.c = 99; return o.b.c === 2;",
              expected: true,
            },
            {
              evalStr: "const arr = [1, [2, 3]]; const cloned = deepClone(arr); cloned[1][0] = 77; return arr[1][0] === 2;",
              expected: true,
            },
            {
              evalStr: "return deepClone({ x: null }).x === null;",
              expected: true,
            },
          ],
        },
      ],
      metadata: {
        category: "code_execution",
        title: "Recursive Deep Clone Execution (3 Mutation Tests)",
        expected: "Pass object & array clone tests",
      },
    },
    {
      id: "code_3",
      vars: {
        prompt: "Write a JavaScript function `uniqueArray(arr)` that returns an array with duplicate primitive elements removed while strictly preserving original order. Output ONLY the JavaScript function.",
      },
      assert: [
        {
          type: "code_unit_test",
          fnName: "uniqueArray",
          testCases: [
            { input: [[1, 2, 2, 3, 1, 4]], expected: [1, 2, 3, 4], isJsonEq: true },
            { input: [["a", "b", "a", "c"]], expected: ["a", "b", "c"], isJsonEq: true },
            { input: [[]], expected: [], isJsonEq: true },
          ],
        },
      ],
      metadata: {
        category: "code_execution",
        title: "Order-Preserving Deduplication (3 Array Tests)",
        expected: "Pass order & edge-case unit tests",
      },
    },
    {
      id: "code_4",
      vars: {
        prompt: "Write a JavaScript function `isValidParentheses(s)` that takes a string containing '()[]{}' and returns true if the brackets are closed in the correct order. Output ONLY the JavaScript function.",
      },
      assert: [
        {
          type: "code_unit_test",
          fnName: "isValidParentheses",
          testCases: [
            { input: ["()[]{}"], expected: true },
            { input: ["(]"], expected: false },
            { input: ["([{}])"], expected: true },
          ],
        },
      ],
      metadata: {
        category: "code_execution",
        title: "Stack-Based Bracket Matching (3 Structure Tests)",
        expected: "Pass nested & unbalanced bracket tests",
      },
    },
    {
      id: "code_5",
      vars: {
        prompt: "Write a JavaScript function `flattenArray(arr)` that recursively flattens an array of arbitrarily nested arrays into a single flat array. Output ONLY the JavaScript function.",
      },
      assert: [
        {
          type: "code_unit_test",
          fnName: "flattenArray",
          testCases: [
            { input: [[1, [2, [3, [4]], 5]]], expected: [1, 2, 3, 4, 5], isJsonEq: true },
            { input: [[]], expected: [], isJsonEq: true },
            { input: [[[1], [2], [3]]], expected: [1, 2, 3], isJsonEq: true },
          ],
        },
      ],
      metadata: {
        category: "code_execution",
        title: "Arbitrary-Depth Array Flattening (3 Depth Tests)",
        expected: "Pass multi-nested array tests",
      },
    },

    // ==================== 3. JSON SCHEMA & EXTRACTION (5 Tests) ====================
    {
      id: "schema_1",
      vars: {
        prompt: "Extract data from: 'Invoice #INV-2026-88 issued on 2026-04-15 to Acme Corp for total amount $1,450.00 with status PAID.' into raw JSON with exact keys: `invoice_id` (string), `date` (string), `recipient` (string), `total` (number), `paid` (boolean). Output ONLY raw JSON.",
      },
      assert: [
        {
          type: "json_schema_validation",
          requiredKeys: ["invoice_id", "date", "recipient", "total", "paid"],
          validateFn: (obj) =>
            obj.invoice_id === "INV-2026-88" &&
            obj.total === 1450 &&
            obj.paid === true &&
            obj.recipient.toLowerCase().includes("acme"),
        },
      ],
      metadata: {
        category: "schema_adherence",
        title: "Unstructured Financial Document Extraction",
        expected: "Valid JSON with typed fields & exact values",
      },
    },
    {
      id: "schema_2",
      vars: {
        prompt: "Extract data from server log: 'ERROR 2026-08-21T14:23:05.120Z [auth-service] User id=usr_9984 login failed from IP 192.168.1.45 (code 401: Invalid Credentials)' into raw JSON with exact keys: `level` (string), `service` (string), `user_id` (string), `ip` (string), `status_code` (number). Output ONLY raw JSON.",
      },
      assert: [
        {
          type: "json_schema_validation",
          requiredKeys: ["level", "service", "user_id", "ip", "status_code"],
          validateFn: (obj) =>
            obj.status_code === 401 &&
            obj.service === "auth-service" &&
            obj.user_id === "usr_9984" &&
            obj.ip === "192.168.1.45",
        },
      ],
      metadata: {
        category: "schema_adherence",
        title: "Server Security Log Telemetry Parsing",
        expected: "Valid JSON schema with status code 401",
      },
    },
    {
      id: "schema_3",
      vars: {
        prompt: "Parse specs: 'Model: Titan RTX Pro. Price: $2499. In Stock: yes. VRAM: 24GB GDDR6X. TDP: 350W.' into raw JSON with exact keys: `model_name` (string), `price_usd` (number), `in_stock` (boolean), `vram_gb` (number), `tdp_watts` (number). Output ONLY raw JSON.",
      },
      assert: [
        {
          type: "json_schema_validation",
          requiredKeys: ["model_name", "price_usd", "in_stock", "vram_gb", "tdp_watts"],
          validateFn: (obj) =>
            obj.price_usd === 2499 &&
            obj.in_stock === true &&
            obj.vram_gb === 24 &&
            obj.tdp_watts === 350,
        },
      ],
      metadata: {
        category: "schema_adherence",
        title: "Hardware Specification Schema Conversion",
        expected: "Valid JSON with exact typed numeric specs",
      },
    },
    {
      id: "schema_4",
      vars: {
        prompt: "Extract customer review breakdown: 'I loved the fast battery charging, but the display brightness in sunlight is terrible. Overall rating: 3 stars.' into raw JSON with exact keys: `sentiment` ('positive'|'negative'|'mixed'), `rating` (number 1-5), `pros` (array of strings), `cons` (array of strings). Output ONLY raw JSON.",
      },
      assert: [
        {
          type: "json_schema_validation",
          requiredKeys: ["sentiment", "rating", "pros", "cons"],
          validateFn: (obj) =>
            typeof obj.rating === "number" &&
            Array.isArray(obj.pros) &&
            Array.isArray(obj.cons) &&
            obj.pros.length >= 1 &&
            obj.cons.length >= 1,
        },
      ],
      metadata: {
        category: "schema_adherence",
        title: "Sentiment & Aspect-Based Opinion Mining",
        expected: "Valid JSON with typed arrays & rating number",
      },
    },
    {
      id: "schema_5",
      vars: {
        prompt: "Extract entities from: 'Dr. Sarah Connor met with Dr. Miles Dyson at Cyberdyne Systems in Sunnyvale, California.' into raw JSON with exact keys: `people` (array of strings) and `locations` (array of strings). Output ONLY raw JSON.",
      },
      assert: [
        {
          type: "json_schema_validation",
          requiredKeys: ["people", "locations"],
          validateFn: (obj) =>
            Array.isArray(obj.people) &&
            Array.isArray(obj.locations) &&
            obj.people.length >= 2 &&
            obj.locations.length >= 1,
        },
      ],
      metadata: {
        category: "schema_adherence",
        title: "Named Entity Structured Relation Extraction",
        expected: "Valid JSON with people & locations arrays",
      },
    },

    // ==================== 4. COMPLEX INSTRUCTION FOLLOWING (5 Tests) ====================
    {
      id: "rule_1",
      vars: {
        prompt: "Write a concise summary about quantum computing that consists of EXACTLY 25 words. Do not write 24 words, do not write 26 words. Count words accurately before outputting.",
      },
      assert: [
        {
          type: "word_count_exact",
          count: 25,
        },
      ],
      metadata: {
        category: "rule_following",
        title: "Exact 25-Word Length Constraint",
        expected: "Exactly 25 whitespace-delimited tokens",
      },
    },
    {
      id: "rule_2",
      vars: {
        prompt: "Write a coherent 2-sentence paragraph explaining what clouds are, without using the letter 'e' anywhere in your response (both uppercase and lowercase). Absolutely no 'e' or 'E'.",
      },
      assert: [
        {
          type: "lipogram_constraint",
          forbiddenLetter: "e",
          minChars: 25,
        },
      ],
      metadata: {
        category: "rule_following",
        title: "Negative Letter Lipogram Constraint (Zero 'e')",
        expected: "Coherent text with zero occurrences of 'e'",
      },
    },
    {
      id: "rule_3",
      vars: {
        prompt: "Output the names of 3 primary colors formatted strictly with triple angle brackets `<<<COLOR_NAME>>>` with each on a new line, and nothing else. Example format:\n<<<Red>>>\n<<<Green>>>\n<<<Blue>>>",
      },
      assert: [
        {
          type: "delimiter_pattern",
          regex: "^(<<<[A-Za-z]+>>>\\s*){3}$",
        },
      ],
      metadata: {
        category: "rule_following",
        title: "Strict Token Delimiter Matching (`<<<Color>>>`)",
        expected: "3 matches matching <<<Color>>> exactly",
      },
    },
    {
      id: "rule_4",
      vars: {
        prompt: "Provide one sentence of security advice. Your response MUST begin exactly with `[SECURITY_ADVISORY_START]` and end exactly with `[SECURITY_ADVISORY_END]` with no trailing text.",
      },
      assert: [
        {
          type: "prefix_suffix_wrap",
          prefix: "[SECURITY_ADVISORY_START]",
          suffix: "[SECURITY_ADVISORY_END]",
        },
      ],
      metadata: {
        category: "rule_following",
        title: "Strict Boundary Tag Encapsulation",
        expected: "Enclosed between [SECURITY_ADVISORY_START] and [SECURITY_ADVISORY_END]",
      },
    },
    {
      id: "rule_5",
      vars: {
        prompt: "Write 4 words describing the ocean where EVERY SINGLE LETTER is in lowercase. Absolutely no capital letters, punctuation, or numbers.",
      },
      assert: [
        {
          type: "lowercase_word_count",
          count: 4,
        },
      ],
      metadata: {
        category: "rule_following",
        title: "Case & Grammar Exclusion (4 Pure Lowercase Words)",
        expected: "Exactly 4 pure lowercase alphabetic words",
      },
    },
  ];
};

/**
 * Generates promptfoo config for local CLI runs if executed directly
 */
export const generatePromptfooConfig = async (modelName = "qwen2.5:3b") => {
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

  const configPath = path.join(process.cwd(), "server", "temp", "promptfoo.config.json");
  const tempDir = path.dirname(configPath);
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

  fs.writeFileSync(configPath, JSON.stringify(config, null, 2), "utf8");
  return configPath;
};
