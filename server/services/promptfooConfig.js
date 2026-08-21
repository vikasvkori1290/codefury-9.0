import path from "path";
import fs from "fs";

/**
 * 35 Multi-Category Benchmark Test Cases across 7 Modern LLM Domains (5 Cases Each):
 * 1. Reasoning (5)
 * 2. Coding (5)
 * 3. Agentic Coding (5)
 * 4. Mathematics (5)
 * 5. Data Analysis (5)
 * 6. Language (5)
 * 7. Instruction Following (5)
 */
export const getBenchmarkTestCases = () => {
  return [
    // ==================== 1. REASONING (5 Cases) ====================
    {
      vars: { prompt: "If all Bloops are Razzies and all Razzies are Lizzies, are all Bloops definitely Lizzies? Answer with only 'Yes' or 'No'." },
      assert: [{ type: "contains", value: "Yes" }],
      metadata: { category: "reasoning" },
    },
    {
      vars: { prompt: "Sally has 3 brothers. Each brother has 2 sisters. How many sisters does Sally have? Answer with only the number." },
      assert: [{ type: "contains", value: "1" }],
      metadata: { category: "reasoning" },
    },
    {
      vars: { prompt: "A farmer is taking a wolf, a goat, and a cabbage across a river. If left alone, the wolf eats the goat, and the goat eats the cabbage. Which item must the farmer take across first? Answer with only the item name." },
      assert: [{ type: "contains", value: "goat" }],
      metadata: { category: "reasoning" },
    },
    {
      vars: { prompt: "If today is Tuesday, what day of the week will it be in 100 days? Answer with only the day name." },
      assert: [{ type: "contains", value: "Thursday" }],
      metadata: { category: "reasoning" },
    },
    {
      vars: { prompt: "A bat and a ball cost $1.10 in total. The bat costs $1.00 more than the ball. How much does the ball cost in cents? Give only the number." },
      assert: [{ type: "contains", value: "5" }],
      metadata: { category: "reasoning" },
    },

    // ==================== 2. CODING (5 Cases) ====================
    {
      vars: { prompt: "Write a JavaScript function named `isPalindrome(str)` that returns true if a given string is a palindrome. Output only valid JavaScript code." },
      assert: [{ type: "contains", value: "function isPalindrome" }],
      metadata: { category: "coding" },
    },
    {
      vars: { prompt: "Write a Python function `fibonacci(n)` that returns the nth Fibonacci number (0-indexed where fib(0)=0, fib(1)=1). Output only the Python def block." },
      assert: [{ type: "contains", value: "def fibonacci" }],
      metadata: { category: "coding" },
    },
    {
      vars: { prompt: "Write a SQL query to find the second highest salary from an Employee table with columns (id, salary). Output only the SQL query." },
      assert: [{ type: "contains", value: "SELECT" }],
      metadata: { category: "coding" },
    },
    {
      vars: { prompt: "Write a JavaScript function `flatten(arr)` that flattens a nested array of arbitrary depth. Output only the code." },
      assert: [{ type: "contains", value: "flatten" }],
      metadata: { category: "coding" },
    },
    {
      vars: { prompt: "Write a Python function `two_sum(nums, target)` that returns the indices of two numbers that add up to target. Output only code." },
      assert: [{ type: "contains", value: "def two_sum" }],
      metadata: { category: "coding" },
    },

    // ==================== 3. AGENTIC CODING (5 Cases) ====================
    {
      vars: { prompt: "Given this buggy code `function add(a,b){ return a - b; }`, generate a JSON patch object with keys `bug`, `fix`, and `patchedCode`." },
      assert: [{ type: "is-json" }, { type: "contains", value: "patchedCode" }],
      metadata: { category: "agentic_coding" },
    },
    {
      vars: { prompt: "You are an agent with tools. Output a tool call JSON with `tool`: 'search_file' and `parameters`: { 'query': 'authMiddleware' }." },
      assert: [{ type: "is-json" }, { type: "contains", value: "search_file" }],
      metadata: { category: "agentic_coding" },
    },
    {
      vars: { prompt: "Refactor this synchronous code to use async/await: `function fetchUser(id){ return db.find(id); }`. Output valid async function syntax." },
      assert: [{ type: "contains", value: "async function fetchUser" }],
      metadata: { category: "agentic_coding" },
    },
    {
      vars: { prompt: "Generate an agent execution plan JSON array of 3 step strings to debug a memory leak in a Node.js server." },
      assert: [{ type: "is-json" }],
      metadata: { category: "agentic_coding" },
    },
    {
      vars: { prompt: "Generate a Git diff format patch that changes `const PORT = 3000;` to `const PORT = process.env.PORT || 5000;`." },
      assert: [{ type: "contains", value: "PORT" }],
      metadata: { category: "agentic_coding" },
    },

    // ==================== 4. MATHEMATICS (5 Cases) ====================
    {
      vars: { prompt: "Solve for x: 3x + 15 = 42. Answer with only the number." },
      assert: [{ type: "contains", value: "9" }],
      metadata: { category: "mathematics" },
    },
    {
      vars: { prompt: "What is the derivative of f(x) = 5x^3 - 4x^2 + 7x - 2 with respect to x? Output only the algebraic expression." },
      assert: [{ type: "contains", value: "15x" }],
      metadata: { category: "mathematics" },
    },
    {
      vars: { prompt: "If 4 workers take 6 hours to complete a job, how many hours will 8 workers take at the same rate? Give only the number." },
      assert: [{ type: "contains", value: "3" }],
      metadata: { category: "mathematics" },
    },
    {
      vars: { prompt: "What is the probability of rolling a sum of 7 with two fair 6-sided dice? Answer with only a fraction like 1/6 or decimal." },
      assert: [{ type: "contains-any", value: ["1/6", "0.166", "0.167"] }],
      metadata: { category: "mathematics" },
    },
    {
      vars: { prompt: "Calculate 14 multiplied by 18, then subtract 52. Answer with only the resulting number." },
      assert: [{ type: "contains", value: "200" }],
      metadata: { category: "mathematics" },
    },

    // ==================== 5. DATA ANALYSIS (5 Cases) ====================
    {
      vars: { prompt: "Given this sales data: [{\"q1\": 100}, {\"q2\": 150}, {\"q3\": 200}, {\"q4\": 250}], calculate the total annual sales and average per quarter. Output as JSON with keys `total` and `average`." },
      assert: [{ type: "is-json" }, { type: "contains", value: "700" }],
      metadata: { category: "data_analysis" },
    },
    {
      vars: { prompt: "Parse the following log line and output a JSON object with keys `ip`, `status`, `endpoint`: '192.168.1.1 GET /api/v1/models 200'" },
      assert: [{ type: "is-json" }, { type: "contains", value: "192.168.1.1" }],
      metadata: { category: "data_analysis" },
    },
    {
      vars: { prompt: "Given values [12, 18, 25, 29, 36], what is the median value? Answer with only the number." },
      assert: [{ type: "contains", value: "25" }],
      metadata: { category: "data_analysis" },
    },
    {
      vars: { prompt: "Given users with ages [20, 22, 28, 45, 55], calculate the percentage of users who are 30 or older. Answer with only the percentage number." },
      assert: [{ type: "contains", value: "40" }],
      metadata: { category: "data_analysis" },
    },
    {
      vars: { prompt: "Extract key metrics from this text: 'Revenue grew by 24% to $1.2M while churn dropped to 2%'. Output a JSON object with keys `revenue_growth`, `revenue_amount`, and `churn_rate`." },
      assert: [{ type: "is-json" }, { type: "contains", value: "24%" }],
      metadata: { category: "data_analysis" },
    },

    // ==================== 6. LANGUAGE (5 Cases) ====================
    {
      vars: { prompt: "What is the powerhouse of the biological cell?\nA) Ribosome\nB) Mitochondria\nC) Nucleus\nD) Endoplasmic Reticulum\nAnswer with only the letter: A, B, C, or D." },
      assert: [{ type: "contains", value: "B" }],
      metadata: { category: "language" },
    },
    {
      vars: { prompt: "What is the capital city of Australia?\nA) Sydney\nB) Melbourne\nC) Canberra\nD) Brisbane\nAnswer with only the letter: A, B, C, or D." },
      assert: [{ type: "contains", value: "C" }],
      metadata: { category: "language" },
    },
    {
      vars: { prompt: "Identify the figure of speech in: 'The wind whispered through the dark forest.' Answer with only the term name." },
      assert: [{ type: "contains-any", value: ["Personification", "personification"] }],
      metadata: { category: "language" },
    },
    {
      vars: { prompt: "Which chemical element has the atomic symbol 'Fe'? Answer with only the element name." },
      assert: [{ type: "contains-any", value: ["Iron", "iron"] }],
      metadata: { category: "language" },
    },
    {
      vars: { prompt: "Who is the author of the play 'Hamlet'? Answer with only the author's full name." },
      assert: [{ type: "contains", value: "Shakespeare" }],
      metadata: { category: "language" },
    },

    // ==================== 7. INSTRUCTION FOLLOWING (5 Cases) ====================
    {
      vars: { prompt: "Respond with EXACTLY 5 words describing space exploration. Do not output any preamble or punctuation other than spaces." },
      assert: [{ type: "javascript", value: "output.trim().split(/\\s+/).length === 5" }],
      metadata: { category: "instruction" },
    },
    {
      vars: { prompt: "Output a valid JSON object containing exactly two keys: `status` with value 'ok' and `code` with integer value 200. Nothing else." },
      assert: [{ type: "is-json" }, { type: "contains", value: "200" }],
      metadata: { category: "instruction" },
    },
    {
      vars: { prompt: "Write a short sentence about cats without using the letter 'e' anywhere in your response." },
      assert: [{ type: "not-contains", value: "e" }],
      metadata: { category: "instruction" },
    },
    {
      vars: { prompt: "Confirm receipt by replying with exactly one single word: 'CONFIRMED'. Output nothing else." },
      assert: [{ type: "contains", value: "CONFIRMED" }],
      metadata: { category: "instruction" },
    },
    {
      vars: { prompt: "Provide a JSON array containing three string color names: red, blue, and yellow. Output only the JSON array." },
      assert: [{ type: "is-json" }, { type: "contains", value: "red" }],
      metadata: { category: "instruction" },
    },
  ];
};

/**
 * Generates dynamic promptfoo benchmark configuration for a given model
 */
export const generatePromptfooConfig = async (modelName, configOutputPath = null) => {
  const testCases = getBenchmarkTestCases();

  const config = {
    description: `Automated 7-Category Benchmark for ${modelName}`,
    prompts: ["{{prompt}}"],
    providers: [`ollama:chat:${modelName}`],
    tests: testCases,
    evaluateOptions: {
      maxConcurrency: 4,
    },
  };

  if (configOutputPath) {
    const targetDir = path.dirname(configOutputPath);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    await fs.promises.writeFile(configOutputPath, JSON.stringify(config, null, 2), "utf8");
  }

  return config;
};

export default generatePromptfooConfig;
