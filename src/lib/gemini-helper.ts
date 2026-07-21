import { GoogleGenerativeAI, Part, type GenerationConfig } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const MODEL_CANDIDATES = [
  "gemini-2.5-flash",
  "gemini-3.5-flash",
  "gemini-3.1-flash-lite",
  "gemini-2.5-flash-lite",
];

const STREAM_MODEL_CANDIDATES = [
  "gemini-2.5-flash",
  "gemini-3.5-flash",
  "gemini-3.1-flash-lite",
  "gemini-2.5-flash-lite",
];

const MODEL_START_TIMEOUT_MS = 6_000;
const STREAM_IDLE_TIMEOUT_MS = 8_000;

function withTimeout<T>(promise: Promise<T>, timeoutMs: number, message: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(message)), timeoutMs);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      },
    );
  });
}

function shouldRetry(msg: string): boolean {
  const normalized = msg.toLowerCase();
  return (
    normalized.includes("429") ||
    normalized.includes("quota") ||
    normalized.includes("resource_exhausted") ||
    normalized.includes("404") ||
    normalized.includes("not found") ||
    normalized.includes("fetch failed") ||
    normalized.includes("econnreset") ||
    normalized.includes("etimedout") ||
    normalized.includes("timed out") ||
    normalized.includes("503") ||
    normalized.includes("500") ||
    normalized.includes("overloaded")
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

function fastConfig(modelName: string, maxOutputTokens = 1400): FastGenerationConfig {
  const config: FastGenerationConfig = { maxOutputTokens, temperature: 0.25 };
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
  const modelName = STREAM_MODEL_CANDIDATES[retry];
  if (!modelName) {
    throw new Error("All Gemini models exhausted. Please wait or update API key.");
  }

  let result: Awaited<ReturnType<ReturnType<typeof genAI.getGenerativeModel>["generateContentStream"]>>;
  try {
    const model = genAI.getGenerativeModel({ model: modelName, generationConfig: fastConfig(modelName, 900) });
    result = await withTimeout(
      model.generateContentStream(parts as string | Part[]),
      MODEL_START_TIMEOUT_MS,
      `${modelName} timed out before starting its response`,
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "";
    if (shouldRetry(msg)) {
      console.log(`[Gemini] ${modelName} stream failed (${msg.slice(0, 60)}), trying next...`);
      yield* geminiGenerateStream(parts, retry + 1);
      return;
    }
    throw err;
  }

  const iterator = result.stream[Symbol.asyncIterator]();
  let emittedText = false;
  let combinedText = "";
  while (true) {
    try {
      const next = await withTimeout(
        iterator.next(),
        STREAM_IDLE_TIMEOUT_MS,
        `${modelName} response stream timed out`,
      );
      if (next.done) {
        const trimmed = combinedText.trim();
        if (trimmed.length >= 60 && !/[.!?…)'"\]]$/.test(trimmed)) {
          throw new Error(`${modelName} response ended before completing the answer`);
        }
        return;
      }
      const text = next.value.text();
      if (text) {
        emittedText = true;
        combinedText += text;
        yield text;
      }
    } catch (err: unknown) {
      try {
        await iterator.return?.(undefined);
      } catch {
        // The upstream stream may already be closed.
      }
      const msg = err instanceof Error ? err.message : "";
      if (!emittedText && shouldRetry(msg)) {
        console.log(`[Gemini] ${modelName} stream stalled (${msg.slice(0, 60)}), trying next...`);
        yield* geminiGenerateStream(parts, retry + 1);
        return;
      }
      throw err;
    }
  }
}
