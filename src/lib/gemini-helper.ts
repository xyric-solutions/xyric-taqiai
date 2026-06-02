import { GoogleGenerativeAI, Part } from "@google/generative-ai";

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
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent(parts as string | Part[]);
    return result.response.text();
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "";
    const shouldRetry =
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
      msg.includes("overloaded");
    if (shouldRetry) {
      console.log(`[Gemini] ${modelName} failed (${msg.slice(0, 60)}), trying next...`);
      return geminiGenerate(parts, retry + 1);
    }
    throw err;
  }
}
