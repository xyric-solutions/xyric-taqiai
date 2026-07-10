import { GoogleGenerativeAI, Part, type GenerationConfig } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const MODEL_CANDIDATES = [
  "gemini-2.5-flash",
  "gemini-2.5-flash-lite",
  "gemini-1.5-flash-latest",
  "gemini-1.5-flash",
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite",
  "gemini-flash-latest",
];

function shouldRetry(msg: string): boolean {
  return (
    msg.includes("429") ||
    msg.includes("quota") ||
    msg.includes("RESOURCE_EXHAUSTED") ||
    msg.includes("404") ||
    msg.includes("not found") ||
    msg.includes("fetch failed") ||
    msg.includes("ECONNRESET") ||
    msg.includes("ETIMEDOUT") ||
    msg.includes("503") ||
    msg.includes("500") ||
    msg.includes("overloaded")
  );
}

// Generate with automatic fallback across models
export async function geminiGenerate(
  parts: string | Part[],
  retry = 0
): Promise<string> {
  const modelName = MODEL_CANDIDATES[retry];
  if (!modelName) {
    throw new Error("All Gemini models exhausted. Please wait or update API key.");
  }

  try {
    const model = genAI.getGenerativeModel({ model: modelName, generationConfig: fastConfig(modelName) });
    const result = await model.generateContent(parts as string | Part[]);
    return result.response.text();
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "";
    if (shouldRetry(msg)) {
      console.log(`[Gemini] ${modelName} failed (${msg.slice(0, 60)}), trying next...`);
      return geminiGenerate(parts, retry + 1);
    }
    throw err;
  }
}

/**
 * Generation config tuned for fast, short legal answers.
 * Crucially, on Gemini 2.5 models we set thinkingBudget: 0 — by default these
 * models "think" for several seconds before emitting any text, which is the
 * long pause users saw before the answer appeared. These answers are short
 * (200-300 words) so the thinking phase adds latency with no real benefit.
 */
type FastGenerationConfig = GenerationConfig & {
  thinkingConfig?: { thinkingBudget: number };
};

function fastConfig(modelName: string): FastGenerationConfig {
  const config: FastGenerationConfig = { maxOutputTokens: 1400, temperature: 0.7 };
  if (modelName.startsWith("gemini-2.5")) {
    config.thinkingConfig = { thinkingBudget: 0 };
  }
  return config;
}

/**
 * Streaming variant: yields text chunks as the model produces them, so the UI
 * can render the answer progressively instead of waiting for the full response.
 * Falls back across models only if the *initial* request fails (before any
 * chunk is emitted) — once streaming has begun we can't switch models.
 */
export async function* geminiGenerateStream(
  parts: string | Part[],
  retry = 0
): AsyncGenerator<string> {
  const modelName = MODEL_CANDIDATES[retry];
  if (!modelName) {
    throw new Error("All Gemini models exhausted. Please wait or update API key.");
  }

  let result: Awaited<ReturnType<ReturnType<typeof genAI.getGenerativeModel>["generateContentStream"]>>;
  try {
    const model = genAI.getGenerativeModel({ model: modelName, generationConfig: fastConfig(modelName) });
    result = await model.generateContentStream(parts as string | Part[]);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "";
    if (shouldRetry(msg)) {
      console.log(`[Gemini] ${modelName} stream failed (${msg.slice(0, 60)}), trying next...`);
      yield* geminiGenerateStream(parts, retry + 1);
      return;
    }
    throw err;
  }

  for await (const chunk of result.stream) {
    const text = chunk.text();
    if (text) yield text;
  }
}
