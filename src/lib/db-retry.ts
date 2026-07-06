// Small helper to retry Prisma queries that fail with a TRANSIENT connection
// error. In local dev the app talks to the Railway Postgres over a flaky public
// proxy, which occasionally drops a connection ("Can't reach database server",
// P1001/P1017, ECONNRESET). A single retry after a short backoff almost always
// succeeds — this is why a failed login works on the second attempt.

const TRANSIENT_DB_MARKERS = [
  "can't reach database",
  "cannot reach database",
  "p1001", // Can't reach database server
  "p1002", // Database server reached but timed out
  "p1008", // Operations timed out
  "p1017", // Server has closed the connection
  "econnreset",
  "etimedout",
  "connection terminated",
  "connection closed",
  "connection reset",
  "socket hang up",
  "timeout",
];

function isTransientDbError(err: unknown): boolean {
  const msg = (err instanceof Error ? err.message : String(err || "")).toLowerCase();
  const code = (err as { code?: string })?.code?.toLowerCase() || "";
  return TRANSIENT_DB_MARKERS.some((m) => msg.includes(m) || code.includes(m));
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Run a database operation, retrying up to `attempts` times if it fails with a
 * transient connection error. Non-transient errors (e.g. unique constraint
 * violations) are re-thrown immediately.
 */
export async function withDbRetry<T>(fn: () => Promise<T>, attempts = 3, baseDelayMs = 400): Promise<T> {
  let lastErr: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      if (i === attempts - 1 || !isTransientDbError(err)) throw err;
      await sleep(baseDelayMs * (i + 1));
    }
  }
  throw lastErr;
}
