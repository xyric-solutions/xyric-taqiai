export interface SafeAiError {
  error: string;
  status: number;
}

export function getSafeAiError(
  error: unknown,
  fallback = "AI request failed. Please try again.",
  quotaMessage = "AI quota exhausted. Please wait a moment and try again."
): SafeAiError {
  const message = error instanceof Error ? error.message.toLowerCase() : "";

  if (
    message.includes("429") ||
    message.includes("quota") ||
    message.includes("exhausted") ||
    message.includes("resource_exhausted")
  ) {
    return { error: quotaMessage, status: 429 };
  }

  if (
    message.includes("api_key") ||
    message.includes("api key") ||
    message.includes("401") ||
    message.includes("403") ||
    message.includes("permission")
  ) {
    return {
      error: "AI service is not configured correctly. Please check the server settings.",
      status: 503,
    };
  }

  if (
    message.includes("fetch failed") ||
    message.includes("network") ||
    message.includes("econnreset") ||
    message.includes("etimedout") ||
    message.includes("timeout") ||
    message.includes("503") ||
    message.includes("500") ||
    message.includes("overloaded") ||
    message.includes("service unavailable")
  ) {
    return {
      error: "AI service is temporarily unavailable. Please try again.",
      status: 503,
    };
  }

  return { error: fallback, status: 500 };
}
