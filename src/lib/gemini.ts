import { GoogleGenerativeAI } from "@google/generative-ai";
import { normalizeGeneratedHtml } from "@/lib/document-html";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Models in order of preference (tried one by one if fails)
const MODEL_CANDIDATES = [
  "gemini-2.5-flash",
  "gemini-3.5-flash",
  "gemini-3.1-flash-lite",
  "gemini-2.5-flash-lite",
];

const TRANSIENT_RETRY_ATTEMPTS = 2;

function isTransientGeminiError(message: string): boolean {
  const msg = message.toLowerCase();
  return (
    msg.includes("fetch failed") ||
    msg.includes("network") ||
    msg.includes("econnreset") ||
    msg.includes("etimedout") ||
    msg.includes("timeout") ||
    msg.includes("503") ||
    msg.includes("500") ||
    msg.includes("overloaded") ||
    msg.includes("service unavailable")
  );
}

function isFallbackGeminiError(message: string): boolean {
  const msg = message.toLowerCase();
  return (
    msg.includes("429") ||
    msg.includes("quota") ||
    msg.includes("resource_exhausted") ||
    msg.includes("404") ||
    msg.includes("not found")
  );
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function tryGenerate(prompt: string, modelIndex = 0, attempt = 0): Promise<string> {
  const modelName = MODEL_CANDIDATES[modelIndex];
  if (!modelName) {
    throw new Error("All Gemini models exhausted their quotas. Please wait or use a different API key.");
  }

  try {
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "";

    if (isTransientGeminiError(msg) && attempt < TRANSIENT_RETRY_ATTEMPTS) {
      console.log(`[Gemini] ${modelName} network issue, retrying...`);
      await sleep(700 * (attempt + 1));
      return tryGenerate(prompt, modelIndex, attempt + 1);
    }

    if (isFallbackGeminiError(msg) || isTransientGeminiError(msg)) {
      console.log(`[Gemini] Model ${modelName} failed, trying next...`);
      return tryGenerate(prompt, modelIndex + 1, 0);
    }

    throw err;
  }
}

const NO_FABRICATION_RULE = `

███ STRICT NO-FABRICATION RULE — HIGHEST PRIORITY ███
- ONLY use information explicitly provided in the form fields above
- If any field value is "N/A" or blank → write "___________" as placeholder in the document
- NEVER invent, guess, or assume any detail not given by the user
- NEVER fill in names, times, dates, addresses, amounts, section numbers, or any facts on your own
- A document with blanks ("___________") is CORRECT — a document with invented details is WRONG
- NEVER add notes, asterisks (*), brackets, or explanations for missing fields — just write "___________"
`;

export async function generateDocument(
  promptTemplate: string,
  formData: Record<string, string>,
  language: string
): Promise<string> {
  let prompt = promptTemplate;
  for (const [key, value] of Object.entries(formData)) {
    prompt = prompt.replace(new RegExp(`\\{\\{${key}\\}\\}`, "g"), value || "N/A");
  }
  prompt = prompt.replace(/\{\{language\}\}/g, language === "ur" ? "Urdu" : "English");
  prompt = prompt.replace(/\{\{[^}]+\}\}/g, "N/A");

  // Inject strict no-fabrication rule into every prompt
  prompt = prompt + NO_FABRICATION_RULE;

  const raw = await tryGenerate(prompt);
  return cleanHtmlOutput(raw);
}

function cleanHtmlOutput(text: string): string {
  return normalizeGeneratedHtml(text);
}

export async function getLegalAdvice(
  message: string,
  history: { role: string; content: string }[]
): Promise<string> {
  const { buildAIPrompt } = await import("./intent-handlers");
  const prompt = buildAIPrompt(message, history);
  return tryGenerate(prompt);
}

export async function getFieldSuggestions(
  fieldName: string,
  documentType: string,
  context: Record<string, string>
): Promise<string[]> {
  const prompt = `You are a Pakistani legal document assistant. Suggest 3 appropriate values for the field "${fieldName}" in a "${documentType}" document.

Context of already filled fields:
${Object.entries(context)
  .map(([k, v]) => `- ${k}: ${v}`)
  .join("\n")}

Return ONLY a JSON array of 3 string suggestions, nothing else. Example: ["suggestion 1", "suggestion 2", "suggestion 3"]`;

  const text = await tryGenerate(prompt);
  try {
    return JSON.parse(text);
  } catch {
    return [];
  }
}
