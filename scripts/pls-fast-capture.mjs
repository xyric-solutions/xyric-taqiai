/**
 * Local-first Pakistan Law Site capture manager.
 *
 * This runner is intentionally independent from PostgreSQL while scraping.
 * The browser fetches /Login/GetCaseFile from the logged-in Pakistan Law Site
 * tab, then this local server durably appends good records to JSONL and updates
 * a small checkpoint. If PLS, Chrome, Railway/Postgres, or the network hiccups,
 * the capture can resume from the last completed case without losing saved data.
 *
 * Typical 1950-1960 usage:
 *   node scripts/pls-fast-capture.mjs --serve --from 1950 --to 1960 --workers 5
 *   # Open the printed /pls_runner.js URL inside the logged-in PLS tab.
 *
 * The output JSONL can be imported later:
 *   node scripts/pls-pg-capture.mjs --import-jsonl ../data/pls_1950_1960_fast_capture.jsonl --from 1950 --to 1960 --citation-prefix PLS_ALL_1950_1960 --dedupe-by-listing
 */
import fs from "node:fs";
import http from "node:http";
import os from "node:os";
import path from "node:path";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const APP_ROOT = path.resolve(SCRIPT_DIR, "..");
const REPO_ROOT = path.resolve(APP_ROOT, "..");
const DEFAULT_HOST = "127.0.0.1";
const DEFAULT_PORT = 8781;
const DEFAULT_WORKERS = 5;
const DEFAULT_BATCH_SIZE = 2;
const DEFAULT_DELAY_MS = 80;
const DEFAULT_MAX_ATTEMPTS = 8;
const DEFAULT_MAX_EMPTY_ATTEMPTS = 2;
const DEFAULT_MAX_TRANSIENT_ATTEMPTS = 0;
const DEFAULT_STALE_MINUTES = 3;
const DEFAULT_FETCH_TIMEOUT_MS = 180_000;
const DEFAULT_FETCH_RETRIES = 8;
const DEFAULT_SESSION_PAUSE_SECONDS = 120;
const DEFAULT_SESSION_PAUSE_THRESHOLD = 3;
const DEFAULT_CHECKPOINT_MS = 5_000;
const MIN_CONTENT_LENGTH = 500;
const VERY_SHORT_CONTENT_LENGTH = 80;

function parseArgs(argv) {
  const args = {
    serve: false,
    status: false,
    selfTest: false,
    worklist: null,
    out: null,
    failures: null,
    state: null,
    log: null,
    host: DEFAULT_HOST,
    port: DEFAULT_PORT,
    year: 2012,
    yearFrom: null,
    yearTo: null,
    workers: DEFAULT_WORKERS,
    batchSize: DEFAULT_BATCH_SIZE,
    delayMs: DEFAULT_DELAY_MS,
    maxAttempts: DEFAULT_MAX_ATTEMPTS,
    maxEmptyAttempts: DEFAULT_MAX_EMPTY_ATTEMPTS,
    maxTransientAttempts: DEFAULT_MAX_TRANSIENT_ATTEMPTS,
    staleMinutes: DEFAULT_STALE_MINUTES,
    fetchTimeoutMs: DEFAULT_FETCH_TIMEOUT_MS,
    fetchRetries: DEFAULT_FETCH_RETRIES,
    fetchHeadnotes: false,
    resetRunning: true,
    retryBaseSeconds: 45,
    transientRetryBaseSeconds: 15,
    postgresCompleted: false,
    postgresSource: "pakistanlawsite",
    sessionPauseSeconds: DEFAULT_SESSION_PAUSE_SECONDS,
    sessionPauseThreshold: DEFAULT_SESSION_PAUSE_THRESHOLD,
    transientPauseSeconds: 60,
    transientPauseThreshold: 20,
    emptyPauseSeconds: 120,
    emptyPauseThreshold: 25,
    emptyPauseWindowSeconds: 60,
    checkpointMs: DEFAULT_CHECKPOINT_MS,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    const next = () => {
      i += 1;
      if (i >= argv.length) throw new Error(`Missing value after ${arg}`);
      return argv[i];
    };

    if (arg === "--serve") args.serve = true;
    else if (arg === "--status") args.status = true;
    else if (arg === "--self-test") args.selfTest = true;
    else if (arg === "--worklist") args.worklist = next();
    else if (arg === "--out") args.out = next();
    else if (arg === "--failures") args.failures = next();
    else if (arg === "--state") args.state = next();
    else if (arg === "--log") args.log = next();
    else if (arg === "--host") args.host = next();
    else if (arg === "--port") args.port = Number(next());
    else if (arg === "--year") args.year = Number(next());
    else if (arg === "--from" || arg === "--year-from" || arg === "--range-start") args.yearFrom = Number(next());
    else if (arg === "--to" || arg === "--year-to" || arg === "--range-end") args.yearTo = Number(next());
    else if (arg === "--workers") args.workers = Number(next());
    else if (arg === "--batch" || arg === "--batch-size") args.batchSize = Number(next());
    else if (arg === "--delay-ms") args.delayMs = Number(next());
    else if (arg === "--max-attempts") args.maxAttempts = Number(next());
    else if (arg === "--max-empty-attempts") args.maxEmptyAttempts = Number(next());
    else if (arg === "--max-transient-attempts") args.maxTransientAttempts = Number(next());
    else if (arg === "--stale-minutes") args.staleMinutes = Number(next());
    else if (arg === "--fetch-timeout-ms") args.fetchTimeoutMs = Number(next());
    else if (arg === "--fetch-retries") args.fetchRetries = Number(next());
    else if (arg === "--fetch-headnotes") args.fetchHeadnotes = true;
    else if (arg === "--no-reset-running") args.resetRunning = false;
    else if (arg === "--retry-base-seconds") args.retryBaseSeconds = Number(next());
    else if (arg === "--transient-retry-base-seconds") args.transientRetryBaseSeconds = Number(next());
    else if (arg === "--postgres-completed") args.postgresCompleted = true;
    else if (arg === "--postgres-source") args.postgresSource = next();
    else if (arg === "--session-pause-seconds") args.sessionPauseSeconds = Number(next());
    else if (arg === "--session-pause-threshold") args.sessionPauseThreshold = Number(next());
    else if (arg === "--transient-pause-seconds") args.transientPauseSeconds = Number(next());
    else if (arg === "--transient-pause-threshold") args.transientPauseThreshold = Number(next());
    else if (arg === "--empty-pause-seconds") args.emptyPauseSeconds = Number(next());
    else if (arg === "--empty-pause-threshold") args.emptyPauseThreshold = Number(next());
    else if (arg === "--empty-pause-window-seconds") args.emptyPauseWindowSeconds = Number(next());
    else if (arg === "--checkpoint-ms") args.checkpointMs = Number(next());
    else if (arg === "--help" || arg === "-h") {
      console.log(fs.readFileSync(fileURLToPath(import.meta.url), "utf8").split("*/", 1)[0] + "*/");
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  args.yearFrom = Number(args.yearFrom || args.year);
  args.yearTo = Number(args.yearTo || args.yearFrom);
  if (!Number.isInteger(args.yearFrom) || !Number.isInteger(args.yearTo) || args.yearFrom < 1800 || args.yearTo > 2100) {
    throw new Error(`Invalid year range: ${args.yearFrom}-${args.yearTo}`);
  }
  if (args.yearTo < args.yearFrom) throw new Error(`Invalid descending year range: ${args.yearFrom}-${args.yearTo}`);
  args.year = args.yearFrom;

  const label = yearLabel(args);
  args.worklist = resolvePath(args.worklist || path.join(REPO_ROOT, "data", `pls_all_courts_${label}_worklist.json`));
  args.out = resolvePath(args.out || path.join(REPO_ROOT, "data", `pls_${label}_fast_capture.jsonl`));
  args.failures = resolvePath(args.failures || path.join(REPO_ROOT, "data", `pls_${label}_fast_failures.jsonl`));
  args.state = resolvePath(args.state || path.join(REPO_ROOT, "data", `pls_${label}_fast_capture.state.json`));
  args.log = resolvePath(args.log || path.join(REPO_ROOT, "data", `pls_${label}_fast_capture.log`));
  args.workers = clampInt(args.workers, 1, 12, DEFAULT_WORKERS);
  args.batchSize = clampInt(args.batchSize, 1, 10, DEFAULT_BATCH_SIZE);
  args.delayMs = clampInt(args.delayMs, 0, 5000, DEFAULT_DELAY_MS);
  args.maxAttempts = clampInt(args.maxAttempts, 1, 1000, DEFAULT_MAX_ATTEMPTS);
  args.maxEmptyAttempts = clampInt(args.maxEmptyAttempts, 1, 100, DEFAULT_MAX_EMPTY_ATTEMPTS);
  args.maxTransientAttempts = clampInt(args.maxTransientAttempts, 0, 100_000, DEFAULT_MAX_TRANSIENT_ATTEMPTS);
  args.staleMinutes = clampInt(args.staleMinutes, 1, 240, DEFAULT_STALE_MINUTES);
  args.fetchTimeoutMs = clampInt(args.fetchTimeoutMs, 10_000, 300_000, DEFAULT_FETCH_TIMEOUT_MS);
  args.fetchRetries = clampInt(args.fetchRetries, 1, 50, DEFAULT_FETCH_RETRIES);
  args.retryBaseSeconds = clampInt(args.retryBaseSeconds, 1, 3600, 45);
  args.transientRetryBaseSeconds = clampInt(args.transientRetryBaseSeconds, 1, 300, 15);
  args.sessionPauseSeconds = clampInt(args.sessionPauseSeconds, 30, 3600, DEFAULT_SESSION_PAUSE_SECONDS);
  args.sessionPauseThreshold = clampInt(args.sessionPauseThreshold, 1, 25, DEFAULT_SESSION_PAUSE_THRESHOLD);
  args.transientPauseSeconds = clampInt(args.transientPauseSeconds, 10, 1800, 60);
  args.transientPauseThreshold = clampInt(args.transientPauseThreshold, 1, 200, 20);
  args.emptyPauseSeconds = clampInt(args.emptyPauseSeconds, 10, 1800, 120);
  args.emptyPauseThreshold = clampInt(args.emptyPauseThreshold, 1, 500, 25);
  args.emptyPauseWindowSeconds = clampInt(args.emptyPauseWindowSeconds, 10, 600, 60);
  args.checkpointMs = clampInt(args.checkpointMs, 250, 60_000, DEFAULT_CHECKPOINT_MS);

  if (!args.serve && !args.status && !args.selfTest) args.status = true;
  return args;
}

function resolvePath(value) {
  if (!value) return value;
  if (path.isAbsolute(value)) return value;
  const candidates = [
    path.resolve(process.cwd(), value),
    path.resolve(APP_ROOT, value),
    path.resolve(REPO_ROOT, value),
  ];
  return candidates.find((candidate) => fs.existsSync(candidate)) || candidates[0];
}

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const match = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!match) continue;
    const [, key, rawValue] = match;
    if (process.env[key] !== undefined) continue;
    let value = rawValue.trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    process.env[key] = value;
  }
}

function preparePostgresUrl() {
  loadEnvFile(path.join(APP_ROOT, ".env.local"));
  loadEnvFile(path.join(APP_ROOT, ".env"));
  const url = process.env.DATABASE_URL || "";
  if (!/^postgres(?:ql)?:\/\//i.test(url)) {
    throw new Error("DATABASE_URL is not a PostgreSQL URL after loading .env.local/.env");
  }
  const parsed = new URL(url);
  if (!parsed.searchParams.has("sslmode")) parsed.searchParams.set("sslmode", "disable");
  parsed.searchParams.set("pool_timeout", String(Math.max(60, Number(parsed.searchParams.get("pool_timeout") || 0) || 0)));
  if (!parsed.searchParams.has("connection_limit")) parsed.searchParams.set("connection_limit", "4");
  process.env.DATABASE_URL = parsed.toString();
}

async function withRetryAsync(label, fn, attempts, logPath) {
  let lastError = null;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      writeLog(logPath, { level: "warn", label, attempt, attempts, error: error.message, stack: error.stack });
      if (attempt >= attempts) break;
      await sleep(Math.min(30_000, 750 * 2 ** (attempt - 1)) + Math.floor(Math.random() * 500));
    }
  }
  throw lastError;
}

async function loadPostgresCompletedJobs(args) {
  if (!args.postgresCompleted) return new Map();
  preparePostgresUrl();
  const { PrismaClient } = await import("@prisma/client");
  const prisma = new PrismaClient({ log: ["warn", "error"] });
  try {
    const rows = await withRetryAsync(
      "postgres completed lookup",
      () =>
        prisma.$queryRawUnsafe(
          `
          SELECT
            job.case_type_id AS "caseTypeId",
            job.citation,
            job.title,
            job.court,
            job.year,
            job.content_length AS "contentLength",
            job.completed_at AS "completedAt"
          FROM pls_capture_jobs job
          WHERE job.source = $1
            AND job.year BETWEEN $2 AND $3
            AND job.status = 'completed'
          ORDER BY job.year, job.row_no NULLS LAST, job.case_type_id
          `,
          args.postgresSource,
          args.yearFrom,
          args.yearTo
        ),
      5,
      args.log
    );
    const completed = new Map();
    for (const row of rows) {
      const caseTypeId = normSpace(row.caseTypeId);
      if (!caseTypeId) continue;
      completed.set(caseTypeId, {
        completedAt: row.completedAt ? new Date(row.completedAt).toISOString() : new Date().toISOString(),
        contentLength: Number(row.contentLength || 0) || null,
        citation: normSpace(row.citation),
        title: normSpace(row.title),
        court: normalizeCourt(row.court),
        year: Number(row.year || args.yearFrom || args.year),
      });
    }
    writeLog(args.log, {
      level: "info",
      event: "postgres_completed_loaded",
      source: args.postgresSource,
      years: displayYearLabel(args),
      count: completed.size,
    });
    return completed;
  } catch (error) {
    if (/relation .*pls_capture_jobs.* does not exist|does not exist/i.test(error.message || "")) {
      writeLog(args.log, { level: "warn", event: "postgres_completed_missing_table", error: error.message });
      return new Map();
    }
    writeLog(args.log, { level: "error", event: "postgres_completed_failed", error: error.message, stack: error.stack });
    throw new Error(`Postgres completed lookup failed; refusing to start from the beginning: ${error.message}`);
  } finally {
    await prisma.$disconnect();
  }
}

function clampInt(value, min, max, fallback) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.max(min, Math.min(max, Math.trunc(number)));
}

function yearLabel(args) {
  return args.yearFrom === args.yearTo ? String(args.yearFrom) : `${args.yearFrom}_${args.yearTo}`;
}

function displayYearLabel(args) {
  return args.yearFrom === args.yearTo ? String(args.yearFrom) : `${args.yearFrom}-${args.yearTo}`;
}

function normSpace(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function compact(value) {
  return normSpace(value).replace(/[^a-z0-9]+/gi, "").toLowerCase();
}

function normalizeCourt(court) {
  const raw = normSpace(court);
  if (!raw) return "Supreme Court of Pakistan";
  if (/supreme/i.test(raw) || raw === "SUPREME-COURT") return "Supreme Court of Pakistan";
  return raw
    .toLowerCase()
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function parseYear(citation, content, fallback) {
  const match = `${citation || ""} ${content || ""}`.match(/\b(18\d{2}|19\d{2}|20[0-4]\d)\b/);
  return Number(match?.[1] || fallback || 0) || 0;
}

function decodeMaybeJsonString(value) {
  let text = String(value || "");
  for (let i = 0; i < 3; i += 1) {
    const trimmed = text.trim();
    if (!(trimmed.startsWith('"') && trimmed.endsWith('"'))) break;
    try {
      const parsed = JSON.parse(trimmed);
      if (typeof parsed !== "string") break;
      text = parsed;
    } catch {
      break;
    }
  }
  return text;
}

function decodeEntities(text) {
  const named = {
    amp: "&",
    lt: "<",
    gt: ">",
    quot: '"',
    apos: "'",
    nbsp: " ",
    ndash: "-",
    mdash: "-",
  };
  return String(text || "").replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (full, entity) => {
    const lower = entity.toLowerCase();
    try {
      if (lower.startsWith("#x")) return String.fromCodePoint(Number.parseInt(lower.slice(2), 16));
      if (lower.startsWith("#")) return String.fromCodePoint(Number.parseInt(lower.slice(1), 10));
    } catch {
      return full;
    }
    return named[lower] ?? full;
  });
}

function htmlToText(html) {
  let body = String(html || "");
  const bodyMatch = body.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i);
  if (bodyMatch) body = bodyMatch[1];
  body = body
    .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<\/(p|div|tr|h[1-6]|li|table)>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, " ");
  return normSpace(decodeEntities(body));
}

function normalizeContent(raw) {
  const decoded = decodeMaybeJsonString(raw);
  const looksHtml = /<html\b|<body\b|<p\b|<div\b|<span\b|<table\b/i.test(decoded);
  const content = looksHtml ? htmlToText(decoded) : normSpace(decodeEntities(decoded));
  const transportComplete = looksHtml ? /<\/html\s*>|<\/body\s*>|<\/div\s*>|<\/p\s*>/i.test(decoded) : true;
  return { content, decoded, looksHtml, transportComplete };
}

function citationLikelyPresent(text, citation) {
  const packed = compact(text || "");
  const citationPacked = compact(citation || "");
  if (!citationPacked) return false;
  if (packed.includes(citationPacked)) return true;

  const year = citationPacked.match(/(?:18|19|20)\d{2}/)?.[0] || "";
  const page = citationPacked.match(/\d+$/)?.[0] || "";
  const reporter = citationPacked.replace(year, "").replace(new RegExp(`${page}$`), "");
  if (!year || !page || !reporter) return false;

  const reporterYear = packed.indexOf(`${reporter}${year}`);
  if (reporterYear >= 0) {
    const pageAfter = packed.indexOf(page, reporterYear + reporter.length + year.length);
    if (pageAfter >= 0 && pageAfter - reporterYear <= 80) return true;
  }

  const yearReporter = packed.indexOf(`${year}${reporter}`);
  if (yearReporter >= 0) {
    const pageAfter = packed.indexOf(page, yearReporter + year.length + reporter.length);
    if (pageAfter >= 0 && pageAfter - yearReporter <= 80) return true;
  }

  return false;
}

function looksLikeJudgmentDocument({ content, decoded, citation }) {
  const text = `${content || ""} ${decoded || ""}`;
  if (citationLikelyPresent(text, citation)) return true;

  const wordHtmlSignals = [
    /urn:schemas-microsoft-com:office:word/i,
    /<meta\s+name\s*=\s*["']?ProgId["']?\s+content\s*=\s*["']?Word\.Document/i,
    /<meta\s+name\s*=\s*["']?Generator["']?\s+content\s*=\s*["']?Microsoft Word/i,
    /<o:DocumentProperties\b/i,
  ].filter((pattern) => pattern.test(String(decoded || ""))).length;

  const reporterTitle = /<title>\s*(?:P\s*L\s*D|P\s*C\s*r?\s*L\s*J|S\s*C\s*M\s*R|C\s*L\s*C|P\s*L\s*C|Y\s*L\s*R)\b/i.test(String(decoded || ""));
  return wordHtmlSignals >= 3 || (wordHtmlSignals >= 2 && reporterTitle);
}

function looksLikePlsShell({ content, decoded, citation }) {
  const text = normSpace(`${content || ""} ${decoded || ""}`).slice(0, 80_000);
  if (looksLikeJudgmentDocument({ content, decoded, citation })) return false;
  const shellSignals = [
    /Pakistan\s*Law\s*Site/i,
    /The Only Comprehensive Online Law Library/i,
    /Case\s*Law\s*Search/i,
    /Enter\s+Keyword/i,
    /Enter\s+Court/i,
    /Login|Password|Captcha|Sign\s*In|Subscription/i,
    /contact_Us_company_details_para|field-validation-error|mainPagecontentHeading/i,
    /\/Login\/Check|GetCaseFile|bookSearch|courtSearch/i,
  ].filter((pattern) => pattern.test(text)).length;
  return shellSignals >= 2;
}

function validateContent({ content, decoded, citation, transportComplete }) {
  if (!content || content.length < MIN_CONTENT_LENGTH) {
    return { ok: false, reason: `content too short (${content?.length || 0})` };
  }
  if (looksLikePlsShell({ content, decoded, citation })) {
    return { ok: false, reason: "response looks like a Pakistan Law Site shell/login page" };
  }
  const packed = compact(`${content} ${decoded || ""}`);
  const citationPacked = compact(citation || "");
  if (!transportComplete && (!citationPacked || !packed.includes(citationPacked))) {
    return { ok: false, reason: "response appears truncated before HTML completed" };
  }
  return { ok: true, reason: "ok" };
}

function normalizeCaptureRecord(record, fallback = {}) {
  const caseTypeId = normSpace(record.caseTypeId || record.caseName || record.case_type_id || fallback.caseTypeId);
  const category = normSpace(record.search_category || record.category || fallback.category);
  const citation = normSpace(record.citation || fallback.citation);
  const title = normSpace(record.title || fallback.title);
  const court = normalizeCourt(record.court || fallback.court);
  const rawHtml = record.raw_html ?? record.html ?? "";
  const rawContent = record.content ?? record.text ?? rawHtml ?? "";
  const { content, decoded, looksHtml, transportComplete } = normalizeContent(rawContent);
  const htmlNormalized = rawHtml ? normalizeContent(rawHtml) : null;
  const validationDecoded = htmlNormalized?.decoded || decoded;
  const headnoteRaw = record.headnote_content ?? record.headnotes ?? record.headnote ?? "";
  const headnote = normalizeContent(headnoteRaw).content;
  const year = parseYear(citation, content, record.year || fallback.year);
  const validation = validateContent({
    content,
    decoded: validationDecoded,
    citation,
    court,
    transportComplete: htmlNormalized ? htmlNormalized.transportComplete : transportComplete,
  });
  return {
    caseTypeId,
    category,
    citation,
    title,
    court,
    year,
    content,
    headnoteContent: headnote && compact(headnote) !== compact(content) ? headnote : "",
    contentLength: content.length,
    htmlLength: Number(record.html_length || (rawHtml ? String(rawHtml).length : 0) || (looksHtml ? decoded.length : 0) || 0),
    httpStatus: Number(record.http_status || 0) || null,
    elapsedMs: Number(record.elapsed_ms || 0) || null,
    scrapedAt: record.scraped_at || new Date().toISOString(),
    validation,
    failure: Boolean(record.failed),
    error: normSpace(record.error || record.message),
    stack: String(record.stack || ""),
    rawPreview: normSpace(validationDecoded).slice(0, 1200),
  };
}

function isSessionFailureReason(reason) {
  return /Pakistan Law Site shell\/login page|login page|captcha|session|unauthori[sz]ed|subscription|sign in/i.test(String(reason || ""));
}

function isTransientNetworkReason(reason) {
  return /network|internet|offline|failed to fetch|load failed|timed out|timeout|abort|ECONN|ENOTFOUND|ETIMEDOUT|EAI_AGAIN|TLS|connection|ERR_|truncated|response appears truncated|citation mismatch|mismatched response|wrong judgment/i.test(
    String(reason || "")
  );
}

function contentLengthFromReason(reason) {
  const match = String(reason || "").match(/content too short \((\d+)\)|short content length (\d+)/i);
  return match ? Number(match[1] || match[2]) : null;
}

function isEffectivelyEmptyContentLength(length) {
  return length !== null && length < MIN_CONTENT_LENGTH;
}

function isEffectivelyEmptyReason(reason) {
  return isEffectivelyEmptyContentLength(contentLengthFromReason(reason));
}

function classifyCapture(normalized) {
  const reason = normalized.error || normalized.validation.reason;
  if (normalized.failure) {
    if (isSessionFailureReason(reason)) return { kind: "session", reason };
    if (isTransientNetworkReason(reason)) return { kind: "transient", reason };
    const shortLength = contentLengthFromReason(reason);
    if (isEffectivelyEmptyContentLength(shortLength)) return { kind: "failure", reason };
    if (shortLength !== null && shortLength < VERY_SHORT_CONTENT_LENGTH) return { kind: "failure", reason };
    return { kind: "failure", reason: reason || "browser fetch failed" };
  }
  if (normalized.validation.ok) return { kind: "ok", reason: "ok" };
  if (isSessionFailureReason(reason)) return { kind: "session", reason };
  if (isTransientNetworkReason(reason)) return { kind: "transient", reason };
  const shortLength = contentLengthFromReason(reason);
  if (isEffectivelyEmptyContentLength(shortLength)) return { kind: "failure", reason };
  if (shortLength !== null && shortLength < VERY_SHORT_CONTENT_LENGTH) return { kind: "failure", reason };
  return { kind: "failure", reason };
}

function retryBackoffSeconds(job, base, cap = 1800) {
  const attempts = Math.max(0, Number(job?.attempts || 0));
  const failures = Math.max(0, Number(job?.failureCount || 0));
  const transientFailures = Math.max(0, Number(job?.transientFailureCount || 0));
  const exponent = Math.min(6, Math.max(attempts, failures, transientFailures));
  return Math.min(cap, base * 2 ** exponent) + Math.floor(Math.random() * 20);
}

function transientRetryBackoffSeconds(job, base, cap = 300) {
  const failures = Math.max(1, Number(job?.transientFailureCount || 1));
  const exponent = Math.min(4, failures - 1);
  return Math.min(cap, base * 2 ** exponent) + Math.floor(Math.random() * 6);
}

function ensureDir(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function writeLog(logPath, event) {
  ensureDir(logPath);
  fs.appendFileSync(logPath, JSON.stringify({ ts: new Date().toISOString(), ...event }) + "\n", "utf8");
}

function appendLineDurable(filePath, value) {
  ensureDir(filePath);
  const fd = fs.openSync(filePath, "a");
  try {
    fs.writeSync(fd, value + "\n", null, "utf8");
    fs.fsyncSync(fd);
  } finally {
    fs.closeSync(fd);
  }
}

function writeJsonAtomic(filePath, payload) {
  ensureDir(filePath);
  const tmp = checkpointTempPath(filePath);
  const text = JSON.stringify(payload, null, 2);
  const fd = fs.openSync(tmp, "w");
  try {
    fs.writeSync(fd, text, null, "utf8");
    fs.fsyncSync(fd);
  } finally {
    fs.closeSync(fd);
  }
  if (fs.existsSync(filePath)) {
    try {
      fs.copyFileSync(filePath, `${filePath}.bak`);
    } catch {
      // A checkpoint backup is helpful, not mandatory.
    }
  }
  replaceFileWithRetry(tmp, filePath);
  cleanupStateTemps(filePath);
}

function checkpointTempPath(filePath) {
  const systemTmp = path.resolve(os.tmpdir());
  const targetDir = path.resolve(path.dirname(filePath));
  const base = `${path.basename(filePath)}.${process.pid}.${Date.now()}.tmp`;
  if (targetDir.toLowerCase().startsWith(systemTmp.toLowerCase())) {
    return path.join(targetDir, base);
  }
  return path.join(systemTmp, base);
}

function sleepSync(ms) {
  const buffer = new SharedArrayBuffer(4);
  const view = new Int32Array(buffer);
  Atomics.wait(view, 0, 0, ms);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function replaceFileWithRetry(tmp, filePath) {
  let lastError = null;
  for (let attempt = 1; attempt <= 8; attempt += 1) {
    try {
      fs.renameSync(tmp, filePath);
      return;
    } catch (error) {
      lastError = error;
      if (error?.code === "EXDEV") break;
      if (error?.code === "EPERM" || error?.code === "EACCES" || error?.code === "EEXIST") {
        try {
          fs.rmSync(filePath, { force: true });
        } catch {
          // The next retry may succeed after the handle is released.
        }
        sleepSync(25 * attempt);
        continue;
      }
      throw error;
    }
  }
  try {
    const content = fs.readFileSync(tmp);
    const fd = fs.openSync(filePath, "w");
    try {
      fs.writeSync(fd, content);
      fs.fsyncSync(fd);
    } finally {
      fs.closeSync(fd);
    }
    try {
      fs.rmSync(tmp, { force: true });
    } catch {
      // Some Windows/sandbox combinations allow creating temp files but deny
      // deleting them immediately. They are harmless and cleaned best-effort.
    }
    return;
  } catch (fallbackError) {
    fallbackError.message = `${fallbackError.message}; rename fallback failed after ${lastError?.message || lastError}`;
    throw fallbackError;
  }
}

function cleanupStateTemps(filePath) {
  const dir = path.dirname(filePath);
  const prefix = `${path.basename(filePath)}.`;
  try {
    for (const entry of fs.readdirSync(dir)) {
      if (!entry.startsWith(prefix) || !entry.endsWith(".tmp")) continue;
      fs.rmSync(path.join(dir, entry), { force: true });
    }
  } catch {
    // Stale temp files are harmless; cleanup is best effort.
  }
}

function readJsonWithBackup(filePath, fallback) {
  for (const candidate of [filePath, `${filePath}.bak`]) {
    if (!fs.existsSync(candidate)) continue;
    try {
      return JSON.parse(fs.readFileSync(candidate, "utf8"));
    } catch {
      // Try backup or fallback.
    }
  }
  return fallback;
}

function readJsonlCompleted(filePath, fallbackYear) {
  const completed = new Map();
  if (!fs.existsSync(filePath)) return completed;
  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    if (!line.trim()) continue;
    try {
      const record = JSON.parse(line);
      const normalized = normalizeCaptureRecord(record, { year: fallbackYear });
      if (normalized.caseTypeId && normalized.validation.ok) {
        completed.set(normalized.caseTypeId, {
          completedAt: normalized.scrapedAt || new Date().toISOString(),
          contentLength: normalized.contentLength,
          htmlLength: normalized.htmlLength,
          httpStatus: normalized.httpStatus,
          citation: normalized.citation,
          title: normalized.title,
          court: normalized.court,
          year: normalized.year || fallbackYear,
        });
      }
    } catch {
      // Ignore partial or corrupt trailing lines; earlier durable lines remain usable.
    }
  }
  return completed;
}

function loadWorklist(args) {
  if (!fs.existsSync(args.worklist)) throw new Error(`Missing worklist: ${args.worklist}`);
  const items = JSON.parse(fs.readFileSync(args.worklist, "utf8"));
  if (!Array.isArray(items)) throw new Error(`Worklist is not an array: ${args.worklist}`);
  const rows = [];
  const seen = new Set();
  for (const item of items) {
    const caseTypeId = normSpace(item.caseTypeId || item.caseName);
    if (!caseTypeId || seen.has(caseTypeId)) continue;
    const year = Number(item.year || args.yearFrom || args.year);
    if (year < args.yearFrom || year > args.yearTo) continue;
    seen.add(caseTypeId);
    rows.push({
      source: "pakistanlawsite",
      year,
      caseTypeId,
      category: normSpace(item.category),
      citation: normSpace(item.citation),
      title: normSpace(item.title),
      court: normalizeCourt(item.court),
      rowNo: Number(item.row_no || item.rowNo || rows.length + 1) || rows.length + 1,
    });
  }
  rows.sort((a, b) => a.year - b.year || a.rowNo - b.rowNo || a.caseTypeId.localeCompare(b.caseTypeId));
  return rows;
}

class LocalLedger {
  constructor(args) {
    this.args = args;
    this.jobs = new Map();
    this.loadedAt = new Date().toISOString();
    this.pausedUntil = 0;
    this.pauseReason = null;
    this.sessionFailureStreak = 0;
    this.transientFailureStreak = 0;
    this.emptyFailureTimes = [];
    this.saveTimer = null;
    this.saveDirty = false;
    this.lastSaveMs = 0;
  }

  async load() {
    const rows = loadWorklist(this.args);
    const state = readJsonWithBackup(this.args.state, {});
    const oldJobs = new Map((state.jobs || []).map((job) => [job.caseTypeId, job]));
    const postgresCompleted = await loadPostgresCompletedJobs(this.args);

    for (const row of rows) {
      const previous = oldJobs.get(row.caseTypeId) || {};
      this.jobs.set(row.caseTypeId, {
        ...row,
        status: previous.status || "pending",
        attempts: Number(previous.attempts || 0),
        failureCount: Number(previous.failureCount || previous.failure_count || 0),
        transientFailureCount: Number(previous.transientFailureCount || previous.transient_failure_count || 0),
        leaseToken: previous.leaseToken || null,
        leasedAt: previous.leasedAt || null,
        nextAttemptAt: previous.nextAttemptAt || null,
        lastError: previous.lastError || null,
        lastStack: previous.lastStack || null,
        lastResponsePreview: previous.lastResponsePreview || null,
        lastHttpStatus: previous.lastHttpStatus || null,
        contentLength: previous.contentLength || null,
        htmlLength: previous.htmlLength || null,
        completedAt: previous.completedAt || null,
        completedExternally: Boolean(previous.completedExternally),
        completedSource: previous.completedSource || (previous.completedExternally ? "postgres" : null),
        updatedAt: previous.updatedAt || this.loadedAt,
      });
    }

    const completed = readJsonlCompleted(this.args.out, this.args.yearFrom || this.args.year);
    for (const [caseTypeId, saved] of completed.entries()) {
      const job = this.jobs.get(caseTypeId);
      if (!job) continue;
      Object.assign(job, {
        status: "completed",
        leaseToken: null,
        leasedAt: null,
        nextAttemptAt: null,
        lastError: null,
        lastStack: null,
        lastResponsePreview: null,
        lastHttpStatus: saved.httpStatus || job.lastHttpStatus,
        contentLength: saved.contentLength || job.contentLength,
        htmlLength: saved.htmlLength || job.htmlLength,
        completedAt: saved.completedAt || job.completedAt || this.loadedAt,
        completedExternally: false,
        completedSource: "jsonl",
        updatedAt: this.loadedAt,
      });
    }

    for (const [caseTypeId, saved] of postgresCompleted.entries()) {
      const job = this.jobs.get(caseTypeId);
      if (!job) continue;
      Object.assign(job, {
        status: "completed",
        leaseToken: null,
        leasedAt: null,
        nextAttemptAt: null,
        lastError: null,
        lastStack: null,
        lastResponsePreview: null,
        contentLength: saved.contentLength || job.contentLength,
        completedAt: saved.completedAt || job.completedAt || this.loadedAt,
        completedExternally: true,
        completedSource: "postgres",
        updatedAt: this.loadedAt,
      });
    }

    if (this.args.resetRunning) {
      for (const job of this.jobs.values()) {
        if (job.status === "running") {
          job.status = "retry";
          job.leaseToken = null;
          job.leasedAt = null;
          job.nextAttemptAt = null;
          job.lastError = job.lastError || "Reset stale running job on startup";
          job.updatedAt = this.loadedAt;
        }
      }
    }

    this.save({ immediate: true });
    writeLog(this.args.log, {
      level: "info",
      event: "ledger_loaded",
      total: this.jobs.size,
      completedFromJsonl: completed.size,
      completedFromPostgres: postgresCompleted.size,
      worklist: this.args.worklist,
      out: this.args.out,
      state: this.args.state,
    });
    return this;
  }

  checkpointPayload() {
    const jobs = Array.from(this.jobs.values()).sort((a, b) => a.year - b.year || a.rowNo - b.rowNo || a.caseTypeId.localeCompare(b.caseTypeId));
    const checkpointJobs = jobs.filter((job) => (job.status !== "pending" && job.status !== "completed") || job.completedExternally);
    return {
      version: 1,
      updatedAt: new Date().toISOString(),
      years: displayYearLabel(this.args),
      worklist: this.args.worklist,
      out: this.args.out,
      totals: this.status({ includeFailures: false }),
      jobs: checkpointJobs,
    };
  }

  saveNow() {
    if (this.saveTimer) {
      clearTimeout(this.saveTimer);
      this.saveTimer = null;
    }
    this.saveDirty = false;
    writeJsonAtomic(this.args.state, this.checkpointPayload());
    this.lastSaveMs = Date.now();
  }

  save({ immediate = false } = {}) {
    if (immediate) {
      this.saveNow();
      return;
    }
    this.saveDirty = true;
    const elapsed = this.lastSaveMs ? Date.now() - this.lastSaveMs : this.args.checkpointMs;
    if (elapsed >= this.args.checkpointMs) {
      this.saveNow();
      return;
    }
    if (!this.saveTimer) {
      this.saveTimer = setTimeout(() => {
        this.saveTimer = null;
        if (this.saveDirty) this.saveNow();
      }, Math.max(50, this.args.checkpointMs - elapsed));
      if (typeof this.saveTimer.unref === "function") this.saveTimer.unref();
    }
  }

  flushSave() {
    this.saveNow();
  }

  status({ includeFailures = true } = {}) {
    const now = Date.now();
    const counts = {};
    let total = 0;
    let completed = 0;
    let remaining = 0;
    let manualReview = 0;
    let avgContentLengthTotal = 0;
    let avgContentLengthN = 0;
    let firstCompleted = null;
    let lastCompleted = null;
    let recentCompleted = 0;
    const recentWindowMs = 5 * 60_000;
    const failures = [];
    for (const job of this.jobs.values()) {
      total += 1;
      counts[job.status] = (counts[job.status] || 0) + 1;
      if (job.status === "completed") {
        completed += 1;
        if (job.contentLength) {
          avgContentLengthTotal += Number(job.contentLength);
          avgContentLengthN += 1;
        }
        const completedMs = job.completedAt ? Date.parse(job.completedAt) : null;
        if (completedMs) {
          firstCompleted = firstCompleted === null ? completedMs : Math.min(firstCompleted, completedMs);
          lastCompleted = lastCompleted === null ? completedMs : Math.max(lastCompleted, completedMs);
          if (now - completedMs <= recentWindowMs) recentCompleted += 1;
        }
      } else if (job.status === "manual_review") {
        manualReview += 1;
        if (includeFailures && failures.length < 30) failures.push(failureSummary(job));
      } else {
        remaining += 1;
        if (includeFailures && job.lastError && failures.length < 30) failures.push(failureSummary(job));
      }
    }
    const elapsedSeconds = firstCompleted && lastCompleted && lastCompleted > firstCompleted ? (lastCompleted - firstCompleted) / 1000 : null;
    const avgPerMinute = elapsedSeconds ? Number(((completed / elapsedSeconds) * 60).toFixed(2)) : null;
    const recentPerMinute = Number((recentCompleted / 5).toFixed(2));
    const etaRate = recentPerMinute > 0 ? recentPerMinute : avgPerMinute;
    const etaMinutes = etaRate && etaRate > 0 ? Number((remaining / etaRate).toFixed(1)) : null;
    return {
      years: displayYearLabel(this.args),
      total,
      completed,
      remaining,
      manualReview,
      statuses: counts,
      avgContentLength: avgContentLengthN ? Math.round(avgContentLengthTotal / avgContentLengthN) : 0,
      avgPerMinute,
      recentPerMinute,
      recentCompleted5m: recentCompleted,
      etaMinutes,
      out: this.args.out,
      paused: this.isPaused(),
      pausedUntil: this.pausedUntil ? new Date(this.pausedUntil).toISOString() : null,
      pauseReason: this.pauseReason,
      sessionFailureStreak: this.sessionFailureStreak,
      transientFailureStreak: this.transientFailureStreak,
      recentEmptyFailures: this.recentEmptyFailureCount(),
      failures: includeFailures ? failures : undefined,
      process: includeFailures
        ? {
            pid: process.pid,
            rssMb: Number((process.memoryUsage().rss / 1024 / 1024).toFixed(1)),
            heapUsedMb: Number((process.memoryUsage().heapUsed / 1024 / 1024).toFixed(1)),
            uptimeSeconds: Math.round(process.uptime()),
            cpuCount: os.cpus().length,
            now,
          }
        : undefined,
    };
  }

  lease(limit) {
    if (this.isPaused()) return [];
    const now = Date.now();
    const staleMs = this.args.staleMinutes * 60_000;
    const candidates = Array.from(this.jobs.values())
      .filter((job) => {
        if (job.status === "completed" || job.status === "manual_review") return false;
        if (job.status === "pending") return true;
        if (job.status === "retry") return !job.nextAttemptAt || Date.parse(job.nextAttemptAt) <= now;
        if (job.status === "running") return !job.leasedAt || Date.parse(job.leasedAt) < now - staleMs;
        return false;
      })
      .sort((a, b) => statusRank(a.status) - statusRank(b.status) || a.year - b.year || a.rowNo - b.rowNo || a.caseTypeId.localeCompare(b.caseTypeId))
      .slice(0, limit);

    const leaseToken = `${process.pid}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const leasedAt = new Date().toISOString();
    for (const job of candidates) {
      job.status = "running";
      job.attempts += 1;
      job.leaseToken = leaseToken;
      job.leasedAt = leasedAt;
      job.nextAttemptAt = null;
      job.updatedAt = leasedAt;
    }
    if (candidates.length) this.save();
    return candidates.map((job) => ({
      caseTypeId: job.caseTypeId,
      category: job.category,
      citation: job.citation,
      title: job.title,
      court: job.court,
      year: job.year,
      rowNo: job.rowNo,
      attempts: job.attempts,
    }));
  }

  leaseResponse(limit) {
    if (this.isPaused()) {
      return {
        ok: true,
        paused: true,
        pausedUntil: new Date(this.pausedUntil).toISOString(),
        pauseReason: this.pauseReason,
        items: [],
      };
    }
    return { ok: true, paused: false, items: this.lease(limit) };
  }

  heartbeat(record) {
    const caseTypeId = normSpace(record?.caseTypeId || record?.caseName || record?.case_type_id);
    const job = this.jobs.get(caseTypeId);
    if (!job) return { ok: false, status: "not_found", caseTypeId };
    if (job.status !== "running") {
      return { ok: true, status: job.status, caseTypeId };
    }
    const now = new Date().toISOString();
    job.leasedAt = now;
    job.updatedAt = now;
    this.save();
    return { ok: true, status: "running", caseTypeId, leasedAt: now };
  }

  isPaused() {
    if (!this.pausedUntil) return false;
    if (Date.now() < this.pausedUntil) return true;
    this.pausedUntil = 0;
    this.pauseReason = null;
    return false;
  }

  capture(record) {
    const incomingId = normSpace(record?.caseTypeId || record?.caseName || record?.case_type_id);
    const fallback = this.jobs.get(incomingId) || {};
    const normalized = normalizeCaptureRecord(record || {}, { ...fallback, year: this.args.yearFrom || this.args.year });
    if (!normalized.caseTypeId) throw new Error("Capture record is missing caseTypeId/caseName");
    if (!this.jobs.has(normalized.caseTypeId)) {
      writeLog(this.args.log, {
        level: "warn",
        event: "ignored_out_of_worklist_capture",
        caseTypeId: normalized.caseTypeId,
        citation: normalized.citation,
        year: normalized.year,
        reason: "caseTypeId is not in the active worklist",
      });
      return {
        ok: false,
        status: "ignored_out_of_worklist",
        caseTypeId: normalized.caseTypeId,
        reason: "caseTypeId is not in the active worklist",
      };
    }
    const job = this.ensureJob(normalized);
    const classification = classifyCapture(normalized);

    if (classification.kind === "ok") {
      const output = this.outputRecord(normalized, job);
      appendLineDurable(this.args.out, JSON.stringify(output));
      Object.assign(job, {
        status: "completed",
        leaseToken: null,
        leasedAt: null,
        nextAttemptAt: null,
        lastError: null,
        lastStack: null,
        lastResponsePreview: null,
        lastHttpStatus: normalized.httpStatus,
        contentLength: normalized.contentLength,
        htmlLength: normalized.htmlLength,
        completedAt: new Date().toISOString(),
        completedExternally: false,
        completedSource: "jsonl",
        updatedAt: new Date().toISOString(),
      });
      this.save();
      this.recordCircuitResult({ kind: "ok" });
      writeLog(this.args.log, {
        level: "info",
        event: "completed",
        caseTypeId: job.caseTypeId,
        citation: output.citation,
        contentLength: output.content_length,
      });
      return { ok: true, status: "completed", caseTypeId: job.caseTypeId, contentLength: normalized.contentLength };
    }

    const status = this.markRetryOrFailure(job, normalized, classification);
    this.recordCircuitResult(classification);
    this.save();
    appendLineDurable(
      this.args.failures,
      JSON.stringify({
        ts: new Date().toISOString(),
        status,
        kind: classification.kind,
        reason: classification.reason,
        caseTypeId: job.caseTypeId,
        citation: job.citation || normalized.citation,
        title: job.title || normalized.title,
        year: job.year || normalized.year,
        court: job.court || normalized.court,
        attempts: job.attempts,
        failureCount: job.failureCount,
        transientFailureCount: job.transientFailureCount,
        httpStatus: normalized.httpStatus,
        contentLength: normalized.contentLength,
        preview: normalized.rawPreview,
      })
    );
    writeLog(this.args.log, {
      level: status === "manual_review" ? "error" : "warn",
      event: status,
      kind: classification.kind,
      caseTypeId: job.caseTypeId,
      reason: classification.reason,
      attempts: job.attempts,
      failureCount: job.failureCount,
      transientFailureCount: job.transientFailureCount,
    });
    return {
      ok: false,
      status: classification.kind === "session" ? "session_error" : classification.kind === "transient" ? "network_error" : status,
      caseTypeId: job.caseTypeId,
      retryStatus: status,
      reason: classification.reason,
      paused: this.isPaused(),
      pausedUntil: this.pausedUntil ? new Date(this.pausedUntil).toISOString() : null,
      pauseReason: this.pauseReason,
    };
  }

  recordCircuitResult(classification) {
    if (classification.kind === "ok") {
      this.sessionFailureStreak = 0;
      this.transientFailureStreak = 0;
      return;
    }
    if (classification.kind === "session") {
      this.sessionFailureStreak += 1;
      this.transientFailureStreak = 0;
      if (this.sessionFailureStreak >= this.args.sessionPauseThreshold) {
        this.pauseFor(this.args.sessionPauseSeconds, classification.reason || "PLS session/login response");
      }
      return;
    }
    if (classification.kind === "transient") {
      this.transientFailureStreak += 1;
      if (this.transientFailureStreak >= this.args.transientPauseThreshold) {
        this.pauseFor(this.args.transientPauseSeconds, classification.reason || "repeated transient failures");
      }
      return;
    }
    if (isEffectivelyEmptyReason(classification.reason)) {
      this.recordEmptyFailure();
      this.sessionFailureStreak = 0;
      this.transientFailureStreak = 0;
      return;
    }
    this.transientFailureStreak = 0;
  }

  recentEmptyFailureCount() {
    const cutoff = Date.now() - this.args.emptyPauseWindowSeconds * 1000;
    this.emptyFailureTimes = this.emptyFailureTimes.filter((ts) => ts >= cutoff);
    return this.emptyFailureTimes.length;
  }

  recordEmptyFailure() {
    this.emptyFailureTimes.push(Date.now());
    const count = this.recentEmptyFailureCount();
    if (count === this.args.emptyPauseThreshold) {
      writeLog(this.args.log, {
        level: "warn",
        event: "empty_response_burst",
        count,
        windowSeconds: this.args.emptyPauseWindowSeconds,
        action: "continuing; empty responses are handled per judgment",
      });
    }
  }

  pauseFor(seconds, reason) {
    this.pausedUntil = Date.now() + seconds * 1000;
    this.pauseReason = reason;
    writeLog(this.args.log, {
      level: "warn",
      event: "capture_paused",
      seconds,
      reason,
      pausedUntil: new Date(this.pausedUntil).toISOString(),
    });
  }

  clearPause(reason) {
    this.pausedUntil = 0;
    this.pauseReason = null;
    this.sessionFailureStreak = 0;
    this.transientFailureStreak = 0;
    writeLog(this.args.log, {
      level: "info",
      event: "capture_pause_cleared",
      reason,
    });
  }

  probeJob() {
    const completed = Array.from(this.jobs.values())
      .filter((job) => job.status === "completed" && job.caseTypeId && job.citation)
      .sort((a, b) => {
        const aTime = a.completedAt ? Date.parse(a.completedAt) || 0 : 0;
        const bTime = b.completedAt ? Date.parse(b.completedAt) || 0 : 0;
        return bTime - aTime || b.year - a.year || b.rowNo - a.rowNo;
      });
    const job = completed[0] || Array.from(this.jobs.values()).find((item) => item.caseTypeId && item.citation);
    if (!job) return null;
    return {
      caseTypeId: job.caseTypeId,
      category: job.category,
      citation: job.citation,
      title: job.title,
      court: job.court,
      year: job.year,
      rowNo: job.rowNo,
    };
  }

  ensureJob(normalized) {
    let job = this.jobs.get(normalized.caseTypeId);
    if (!job) {
      job = {
        source: "pakistanlawsite",
        year: normalized.year || this.args.yearFrom || this.args.year,
        caseTypeId: normalized.caseTypeId,
        category: normalized.category,
        citation: normalized.citation,
        title: normalized.title,
        court: normalized.court,
        rowNo: this.jobs.size + 1,
        status: "pending",
        attempts: 0,
        failureCount: 0,
        transientFailureCount: 0,
        leaseToken: null,
        leasedAt: null,
        nextAttemptAt: null,
        lastError: null,
        lastStack: null,
        lastResponsePreview: null,
        lastHttpStatus: null,
        contentLength: null,
        htmlLength: null,
        completedAt: null,
        completedExternally: false,
        completedSource: null,
        updatedAt: new Date().toISOString(),
      };
      this.jobs.set(normalized.caseTypeId, job);
    }
    job.category = job.category || normalized.category;
    job.citation = job.citation || normalized.citation;
    job.title = job.title || normalized.title;
    job.court = job.court || normalized.court;
    job.year = job.year || normalized.year || this.args.yearFrom || this.args.year;
    return job;
  }

  markRetryOrFailure(job, normalized, classification) {
    const now = new Date();
    const isTransient = classification.kind === "session" || classification.kind === "transient";
    if (isTransient) job.transientFailureCount += 1;
    else job.failureCount += 1;

    const transientLimit = Number(this.args.maxTransientAttempts || 0);
    const emptyLimit = !isTransient && isEffectivelyEmptyReason(classification.reason) ? Number(this.args.maxEmptyAttempts || DEFAULT_MAX_EMPTY_ATTEMPTS) : 0;
    const exhausted =
      emptyLimit > 0
        ? job.failureCount >= emptyLimit
        : isTransient && transientLimit > 0
          ? job.transientFailureCount >= transientLimit
          : !isTransient && job.failureCount >= this.args.maxAttempts;
    const status = exhausted ? "manual_review" : "retry";
    const base = isTransient ? this.args.transientRetryBaseSeconds : this.args.retryBaseSeconds;
    const backoffSeconds = isTransient
      ? transientRetryBackoffSeconds(job, base, 300)
      : retryBackoffSeconds(job, base, 1800);
    Object.assign(job, {
      status,
      leaseToken: null,
      leasedAt: null,
      nextAttemptAt: status === "retry" ? new Date(now.getTime() + backoffSeconds * 1000).toISOString() : null,
      lastError: classification.reason || normalized.error || normalized.validation.reason,
      lastStack: normalized.stack || null,
      lastResponsePreview: normalized.rawPreview || null,
      lastHttpStatus: normalized.httpStatus,
      contentLength: normalized.contentLength,
      htmlLength: normalized.htmlLength,
      updatedAt: now.toISOString(),
    });
    return status;
  }

  outputRecord(normalized, job) {
    return {
      source: "PakistanLawSite fast local runner",
      source_url: "https://www.pakistanlawsite.com/Login/GetCaseFile",
      court: normalized.court || job.court,
      caseTypeId: normalized.caseTypeId,
      caseName: normalized.caseTypeId,
      citation: normalized.citation || job.citation,
      title: normalized.title || job.title,
      year: normalized.year || job.year,
      category: normalized.category || job.category,
      content: normalized.content,
      headnote_content: normalized.headnoteContent,
      html_length: normalized.htmlLength,
      content_length: normalized.contentLength,
      http_status: normalized.httpStatus,
      elapsed_ms: normalized.elapsedMs,
      scraped_at: normalized.scrapedAt,
      capture_stored_at: new Date().toISOString(),
      scrape_mode: "full_description_post_local_first",
    };
  }
}

function statusRank(status) {
  if (status === "pending") return 0;
  if (status === "running") return 1;
  if (status === "retry") return 2;
  return 3;
}

function failureSummary(job) {
  return {
    caseTypeId: job.caseTypeId,
    citation: job.citation,
    status: job.status,
    attempts: job.attempts,
    failureCount: job.failureCount,
    transientFailureCount: job.transientFailureCount,
    nextAttemptAt: job.nextAttemptAt,
    lastHttpStatus: job.lastHttpStatus,
    lastError: job.lastError,
  };
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json; charset=utf-8",
  });
  res.end(JSON.stringify(payload));
}

async function readJsonBody(req, maxBytes = 35 * 1024 * 1024) {
  let size = 0;
  const chunks = [];
  for await (const chunk of req) {
    size += chunk.length;
    if (size > maxBytes) throw new Error(`Request body too large (${size} bytes)`);
    chunks.push(chunk);
  }
  const text = Buffer.concat(chunks).toString("utf8");
  return text ? JSON.parse(text) : {};
}

function runnerScript(args) {
  const base = `http://${args.host}:${args.port}`;
  const runnerLabel = `PLS ${displayYearLabel(args)} fast local runner`;
  return `
(async () => {
  const API = ${JSON.stringify(base)};
  const RUNNER_LABEL = ${JSON.stringify(runnerLabel)};
  const DEFAULT_WORKERS = ${Number(args.workers)};
  const DEFAULT_BATCH_SIZE = ${Number(args.batchSize)};
  const DEFAULT_DELAY_MS = ${Number(args.delayMs)};
  const DEFAULT_FETCH_HEADNOTES = ${args.fetchHeadnotes ? "true" : "false"};
  const DEFAULT_FETCH_TIMEOUT_MS = ${Number(args.fetchTimeoutMs)};
  const DEFAULT_FETCH_RETRIES = ${Number(args.fetchRetries)};
  const DEFAULT_SESSION_PAUSE_THRESHOLD = ${Number(args.sessionPauseThreshold)};
  const DEFAULT_SESSION_PAUSE_SECONDS = ${Number(args.sessionPauseSeconds)};
  const scriptUrl = new URL((document.currentScript && document.currentScript.src) || API + "/pls_runner.js", location.href);
  const params = scriptUrl.searchParams;
  const WORKERS = Math.max(1, Math.min(12, Number(params.get("workers") || DEFAULT_WORKERS)));
  const BATCH_SIZE = Math.max(1, Math.min(10, Number(params.get("batch") || DEFAULT_BATCH_SIZE)));
  const DELAY_MS = Math.max(0, Math.min(5000, Number(params.get("delay") || DEFAULT_DELAY_MS)));
  const FETCH_HEADNOTES = params.has("headnotes") ? params.get("headnotes") !== "0" : DEFAULT_FETCH_HEADNOTES;
  const FETCH_TIMEOUT_MS = Math.max(10000, Math.min(300000, Number(params.get("timeout") || DEFAULT_FETCH_TIMEOUT_MS)));
  const FETCH_RETRIES = Math.max(1, Math.min(50, Number(params.get("fetchRetries") || DEFAULT_FETCH_RETRIES)));
  const RETRY_BASE_MS = Math.max(250, Math.min(10000, Number(params.get("retryBase") || 1500)));
  const RETRY_CAP_MS = Math.max(RETRY_BASE_MS, Math.min(60000, Number(params.get("retryCap") || 30000)));
  const NETWORK_PAUSE_THRESHOLD = Math.max(3, Math.min(100, Number(params.get("networkPauseThreshold") || 20)));
  const NETWORK_PAUSE_MS = Math.max(5000, Math.min(300000, Number(params.get("networkPauseMs") || 30000)));
  const HEARTBEAT_MS = Math.max(10000, Math.min(120000, Number(params.get("heartbeatMs") || 30000)));
  const LOCAL_API_TIMEOUT_MS = Math.max(5000, Math.min(120000, Number(params.get("localTimeout") || 30000)));
  const SHORT_SKIP_LENGTH = Math.max(0, Math.min(500, Number(params.get("shortSkip") || 500)));
  const SESSION_STOP_THRESHOLD = Math.max(3, Math.min(50, Number(params.get("sessionStop") || Math.max(8, DEFAULT_SESSION_PAUSE_THRESHOLD * 3))));
  const SESSION_PROBE_MS = Math.max(10000, Math.min(300000, Number(params.get("sessionProbeMs") || Math.max(30000, DEFAULT_SESSION_PAUSE_SECONDS * 500))));
  const SESSION_PROBE_MAX = Math.max(1, Math.min(30, Number(params.get("sessionProbeMax") || 5)));
  const FORCE = params.get("force") === "1";
  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
  const jitter = ms => ms + Math.floor(Math.random() * 300);

  if (window.__codexPlsFastRunnerState && FORCE) {
    window.__codexPlsFastRunnerState.stop = true;
    window.__codexPlsFastRunnerActive = false;
  }

  if (window.__codexPlsFastRunnerActive && !FORCE) {
    const existing = document.getElementById("codex-pls-fast-runner-status");
    if (existing) existing.textContent = RUNNER_LABEL + " already active";
    return;
  }
  window.__codexPlsFastRunnerActive = true;
  const state = { leased: 0, stored: 0, retry: 0, empty: 0, failed: 0, active: 0, stop: false, sessionErrors: 0, sessionPauseUntil: 0, clearQueuesAt: 0, stoppedForSession: false, sessionRecoveryActive: false, recoveryPromise: null, networkErrors: 0, networkPauseUntil: 0 };
  window.__codexPlsFastRunnerState = state;

  function status(text) {
    let box = document.getElementById("codex-pls-fast-runner-status");
    if (!box) {
      box = document.createElement("div");
      box.id = "codex-pls-fast-runner-status";
      box.style.cssText = "position:fixed;z-index:2147483647;right:12px;bottom:12px;background:#111;color:#fff;padding:10px 12px;border-radius:6px;font:13px Arial;max-width:500px;box-shadow:0 4px 18px rgba(0,0,0,.25)";
      document.body.appendChild(box);
    }
    box.textContent = text;
  }

  async function api(path, options = {}) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), LOCAL_API_TIMEOUT_MS);
    try {
      const res = await fetch(API + path, {
        ...options,
        mode: "cors",
        signal: controller.signal,
        headers: { "Content-Type": "application/json", ...(options.headers || {}) }
      });
      const text = await res.text();
      let payload = {};
      try { payload = text ? JSON.parse(text) : {}; } catch {}
      if (!res.ok) throw new Error(payload.error || text || "HTTP " + res.status);
      return payload;
    } catch (error) {
      if (controller.signal.aborted) throw new Error("local capture server timed out after " + LOCAL_API_TIMEOUT_MS + "ms");
      throw error;
    } finally {
      clearTimeout(timer);
    }
  }

  async function apiWithRetry(path, options = {}, label = path) {
    let attempt = 1;
    while (!state.stop) {
      try {
        return await api(path, options);
      } catch (error) {
        const message = error && error.message || String(error);
        status(RUNNER_LABEL + " waiting for local capture server: " + label + " failed (" + message + ")");
        console.warn("PLS local API retry", { label, attempt, message });
        await sleep(jitter(Math.min(60000, 1000 * 2 ** Math.min(6, attempt - 1))));
        attempt += 1;
      }
    }
    throw new Error("runner stopped while waiting for " + label);
  }

  function textFromHtml(html) {
    const div = document.createElement("div");
    div.innerHTML = html;
    return (div.innerText || div.textContent || "").replace(/\\s+/g, " ").trim();
  }

  function compact(value) {
    return String(value || "").replace(/[^a-z0-9]+/gi, "").toLowerCase();
  }

  function hasMismatchedLeadingCitation(item, content) {
    const expected = compact(item && item.citation);
    const leading = compact(String(content || "").slice(0, 12000));
    if (!expected || !leading || leading.includes(expected)) return false;
    const year = (expected.match(/(?:18|19|20)\d{2}/) || [""])[0];
    const page = (expected.match(/\d+$/) || [""])[0];
    const reporter = expected.replace(year, "").replace(new RegExp(page + "$"), "");
    if (!year || !page || !reporter) return false;
    return leading.includes(year + reporter) || leading.includes(reporter + year);
  }

  function looksLikePlsShell(content) {
    const text = String(content || "").slice(0, 60000);
    const signals = [
      /Pakistan\\s*Law\\s*Site/i,
      /The Only Comprehensive Online Law Library/i,
      /Case\\s*Law\\s*Search/i,
      /Enter\\s+Keyword/i,
      /Enter\\s+Court/i,
      /Login|Password|Captcha|Sign\\s*In|Subscription/i,
      /PAKISTANLAWSITE ensembles the idea of LAWONLINE/i
    ].filter(pattern => pattern.test(text)).length;
    return signals >= 2;
  }

  function isNetworkError(error) {
    const message = String(error && error.message || error || "");
    return /network|internet|offline|failed to fetch|load failed|timed out|timeout|abort|ERR_|AbortError/i.test(message);
  }

  function isTemporaryPlsError(error) {
    const message = String(error && error.message || error || "");
    return isNetworkError(error) || /PLS HTTP (408|425|429|5\d\d)|citation mismatch|mismatched response|wrong judgment/i.test(message);
  }

  function retryDelayMs(attempt, error) {
    const retryAfter = Math.max(0, Number(error && error.retryAfterMs || 0));
    const exponential = Math.min(RETRY_CAP_MS, RETRY_BASE_MS * 2 ** Math.min(6, Math.max(0, attempt - 1)));
    const withJitter = Math.round(exponential * (0.75 + Math.random() * 0.5));
    return Math.max(retryAfter, withJitter);
  }

  function recordTemporaryFailure() {
    state.networkErrors += 1;
    if (state.networkErrors >= NETWORK_PAUSE_THRESHOLD) {
      state.networkPauseUntil = Math.max(state.networkPauseUntil || 0, Date.now() + NETWORK_PAUSE_MS);
      state.networkErrors = 0;
    }
  }

  function recordPlsSuccess() {
    state.networkErrors = 0;
    state.networkPauseUntil = 0;
  }

  async function waitForNetworkCooldown(workerId) {
    while (!state.stop && (navigator.onLine === false || Date.now() < (state.networkPauseUntil || 0))) {
      const offline = navigator.onLine === false;
      const remaining = offline ? 5 : Math.max(1, Math.ceil((state.networkPauseUntil - Date.now()) / 1000));
      status(RUNNER_LABEL + (offline ? " browser is offline" : " PakistanLawSite is temporarily unavailable") + "; worker " + workerId + " retries in " + remaining + "s");
      await sleep(Math.min(5000, remaining * 1000));
    }
  }

  function shortContentLengthFromMessage(message) {
    const match = String(message || "").match(/short content length (\\d+)|content too short \\((\\d+)\\)/i);
    return match ? Number(match[1] || match[2]) : null;
  }

  async function waitForSessionCooldown(workerId) {
    while (!state.stop && state.sessionPauseUntil && Date.now() < state.sessionPauseUntil) {
      const seconds = Math.max(1, Math.ceil((state.sessionPauseUntil - Date.now()) / 1000));
      status(RUNNER_LABEL + " cooling down after login/session-looking responses; worker " + workerId + " resumes in " + seconds + "s");
      await sleep(Math.min(5000, seconds * 1000));
    }
  }

  async function fetchCaseRaw(caseTypeId, headNotes) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    try {
      const body = new URLSearchParams();
      body.set("caseName", caseTypeId);
      body.set("headNotes", headNotes ? "1" : "0");
      const response = await fetch("/Login/GetCaseFile", {
        method: "POST",
        credentials: "same-origin",
        signal: controller.signal,
        cache: "no-store",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          "X-Requested-With": "XMLHttpRequest",
          "Accept": "application/json, text/html, */*; q=0.01",
          "Cache-Control": "no-cache"
        },
        body: body.toString()
      });
      const raw = await response.text();
      let html = raw;
      try {
        const parsed = JSON.parse(raw);
        if (typeof parsed === "string") html = parsed;
      } catch {}
      return { response, raw, html, content: textFromHtml(html) };
    } catch (error) {
      if (controller.signal.aborted) {
        const timeoutError = new Error("PLS request timed out after " + FETCH_TIMEOUT_MS + "ms");
        timeoutError.name = "TimeoutError";
        throw timeoutError;
      }
      throw error;
    } finally {
      clearTimeout(timer);
    }
  }

  async function probePlsSession() {
    const probe = await apiWithRetry("/probe-job", {}, "session probe job");
    if (!probe.item) return { ok: false, reason: "no completed probe judgment is available yet" };
    try {
      await fetch("/Login/Check?codex_keepalive=" + Date.now(), {
        method: "GET",
        credentials: "same-origin",
        cache: "no-store",
        headers: { "X-Requested-With": "XMLHttpRequest", "Cache-Control": "no-cache" }
      }).catch(() => null);
      const result = await fetchCaseRaw(probe.item.caseTypeId, false);
      const content = result.content || "";
      const hasCitation = compact(probe.item.citation) && compact(content).includes(compact(probe.item.citation));
      if (result.response.ok && content.length >= 500 && hasCitation && !looksLikePlsShell(content)) {
        await apiWithRetry("/session-ok", { method: "POST", body: JSON.stringify({ caseTypeId: probe.item.caseTypeId }) }, "session-ok");
        return { ok: true, caseTypeId: probe.item.caseTypeId, citation: probe.item.citation, length: content.length };
      }
      return {
        ok: false,
        reason: "probe detail still returned shell/invalid content",
        caseTypeId: probe.item.caseTypeId,
        status: result.response.status,
        length: content.length,
        hasCitation,
        shell: looksLikePlsShell(content)
      };
    } catch (error) {
      return { ok: false, reason: String(error && error.message || error) };
    }
  }

  async function runSessionRecovery(workerId) {
    state.sessionRecoveryActive = true;
    state.clearQueuesAt = Date.now();
    let attempt = 0;
    while (!state.stop) {
      attempt += 1;
      const cycleAttempt = ((attempt - 1) % SESSION_PROBE_MAX) + 1;
      const waitMs = attempt === 1 ? 5000 : cycleAttempt === 1 ? Math.min(300000, SESSION_PROBE_MS * 2) : SESSION_PROBE_MS;
      status(RUNNER_LABEL + " waiting for PakistanLawSite detail session to recover; probe " + cycleAttempt + "/" + SESSION_PROBE_MAX + " in " + Math.ceil(waitMs / 1000) + "s (automatic resume enabled)");
      await sleep(waitMs);
      const probe = await probePlsSession();
      if (probe.ok) {
        state.sessionErrors = 0;
        state.sessionPauseUntil = 0;
        state.sessionRecoveryActive = false;
        status(RUNNER_LABEL + " session recovered on " + probe.citation + "; continuing");
        return true;
      }
      console.warn("PLS session probe failed", probe);
      status(RUNNER_LABEL + " detail session still unavailable: " + (probe.reason || "probe failed") + "; continuing automatic probes");
    }
    state.sessionRecoveryActive = false;
    return false;
  }

  async function ensureSessionRecovery(workerId) {
    if (!state.recoveryPromise) {
      state.recoveryPromise = runSessionRecovery(workerId).finally(() => {
        state.recoveryPromise = null;
      });
    }
    return state.recoveryPromise;
  }

  async function fetchCaseVariant(item, headNotes) {
    const started = Date.now();
    const { response, html, content } = await fetchCaseRaw(item.caseTypeId, headNotes);
    if (!response.ok) {
      const error = new Error("PLS HTTP " + response.status);
      const retryAfter = response.headers.get("Retry-After");
      if (retryAfter) {
        const seconds = Number(retryAfter);
        const dateMs = Date.parse(retryAfter);
        error.retryAfterMs = Number.isFinite(seconds)
          ? Math.max(0, seconds * 1000)
          : Number.isFinite(dateMs) ? Math.max(0, dateMs - Date.now()) : 0;
      }
      throw error;
    }
    return { html, content, httpStatus: response.status, elapsedMs: Date.now() - started };
  }

  async function getCase(item, workerId) {
    let lastError = null;
    for (let attempt = 1; attempt <= FETCH_RETRIES; attempt += 1) {
      try {
        await waitForNetworkCooldown(workerId);
        const main = await fetchCaseVariant(item, false);
        let headnoteContent = "";
        if (FETCH_HEADNOTES) {
          try {
            const headnote = await fetchCaseVariant(item, true);
            if (headnote.content && headnote.content.length > 80 && headnote.content !== main.content) {
              headnoteContent = headnote.content;
            }
          } catch (headnoteError) {
            console.warn("PLS headnote fetch failed", item.caseTypeId, headnoteError);
          }
        }
        if (main.content.length < 500) throw new Error("short content length " + main.content.length);
        if (hasMismatchedLeadingCitation(item, main.content)) {
          throw new Error("PLS citation mismatch: requested " + item.citation + " but received a different judgment");
        }
        recordPlsSuccess();
        return {
          source: "PakistanLawSite fast local runner",
          source_url: location.origin + "/Login/GetCaseFile",
          court: item.court,
          caseTypeId: item.caseTypeId,
          caseName: item.caseTypeId,
          citation: item.citation,
          title: item.title,
          year: item.year,
          category: item.category,
          content: main.content,
          raw_html: main.html,
          headnote_content: headnoteContent,
          html_length: main.html.length,
          content_length: main.content.length,
          http_status: main.httpStatus,
          scraped_at: new Date().toISOString(),
          elapsed_ms: main.elapsedMs
        };
      } catch (error) {
        lastError = error;
        const message = String(error && error.message || error);
        const shortLength = shortContentLengthFromMessage(message);
        if (shortLength !== null && SHORT_SKIP_LENGTH > 0 && shortLength < SHORT_SKIP_LENGTH) {
          status(RUNNER_LABEL + " short PLS response on " + item.caseTypeId + " length=" + shortLength + "; saving and moving on");
          break;
        }
        const offlineHint = navigator.onLine === false ? "; browser reports offline" : "";
        const temporary = isTemporaryPlsError(error);
        if (temporary) {
          recordTemporaryFailure();
        } else {
          state.networkErrors = 0;
        }
        if (attempt < FETCH_RETRIES) {
          const waitMs = retryDelayMs(attempt, error);
          if (temporary) {
            status(RUNNER_LABEL + " temporary PakistanLawSite response issue on " + item.caseTypeId + offlineHint + "; retry " + (attempt + 1) + "/" + FETCH_RETRIES + " in " + Math.ceil(waitMs / 1000) + "s");
          } else {
            status(RUNNER_LABEL + " fetch issue on " + item.caseTypeId + ": " + message + "; retry " + (attempt + 1) + "/" + FETCH_RETRIES + " in " + Math.ceil(waitMs / 1000) + "s");
          }
          await sleep(waitMs);
        } else {
          status(RUNNER_LABEL + " saved " + item.caseTypeId + " for a later automatic retry after " + FETCH_RETRIES + " temporary attempts");
        }
      }
    }
    return {
      failed: true,
      caseTypeId: item.caseTypeId,
      citation: item.citation,
      title: item.title,
      year: item.year,
      category: item.category,
      court: item.court,
      error: String(lastError && lastError.message || lastError || "unknown fetch error"),
      stack: String(lastError && lastError.stack || ""),
      scraped_at: new Date().toISOString()
    };
  }

  function startLeaseHeartbeat(item) {
    let stopped = false;
    let inFlight = false;
    const beat = async () => {
      if (stopped || inFlight) return;
      inFlight = true;
      try {
        await api("/heartbeat", {
          method: "POST",
          body: JSON.stringify({ caseTypeId: item.caseTypeId })
        });
      } catch (error) {
        console.warn("PLS lease heartbeat failed", item.caseTypeId, error);
      } finally {
        inFlight = false;
      }
    };
    beat();
    const timer = setInterval(beat, HEARTBEAT_MS);
    return () => {
      stopped = true;
      clearInterval(timer);
    };
  }

  async function worker(workerId) {
    const queue = [];
    let queueLeasedAt = 0;
    while (!state.stop) {
      if (state.sessionRecoveryActive) {
        const recovered = await ensureSessionRecovery(workerId);
        if (!recovered) break;
        continue;
      }
      await waitForSessionCooldown(workerId);
      if (queue.length && queueLeasedAt && queueLeasedAt <= state.clearQueuesAt) {
        const dropped = queue.splice(0).length;
        status(RUNNER_LABEL + " discarded " + dropped + " queued leases after session pause; waiting for safe resume");
        await sleep(1000);
        continue;
      }
      if (!queue.length) {
        const lease = await apiWithRetry("/next?limit=" + BATCH_SIZE, {}, "lease");
        if (lease.paused) {
          const resumeAt = lease.pausedUntil ? Date.parse(lease.pausedUntil) : Date.now() + 30000;
          const waitMs = Math.max(5000, Math.min(60000, resumeAt - Date.now()));
          status(RUNNER_LABEL + " paused by local server: " + (lease.pauseReason || "waiting") + "; resumes " + new Date(resumeAt).toLocaleTimeString());
          if (/login|session|shell|search page/i.test(String(lease.pauseReason || ""))) {
            await ensureSessionRecovery(workerId);
          }
          await sleep(waitMs);
          continue;
        }
        const items = lease.items || [];
        if (items.length) queueLeasedAt = Date.now();
        queue.push(...items);
        state.leased += items.length;
      }
      const item = queue.shift();
      if (!item) {
        const current = await apiWithRetry("/status", {}, "empty-lease status");
        if (current.remaining > 0 || current.paused) {
          const waitMs = current.pausedUntil ? Math.max(5000, Math.min(60000, Date.parse(current.pausedUntil) - Date.now())) : 15000;
          status(RUNNER_LABEL + " waiting for retry window; remaining=" + current.remaining + " paused=" + Boolean(current.paused));
          await sleep(waitMs);
          continue;
        }
        break;
      }
      state.active += 1;
      const stopHeartbeat = startLeaseHeartbeat(item);
      try {
        status(RUNNER_LABEL + " | active=" + state.active + " leased=" + state.leased + " stored=" + state.stored + " retry=" + state.retry + " empty=" + state.empty + " failed=" + state.failed + " | worker " + workerId + " " + item.caseTypeId);
        const payload = await getCase(item, workerId);
        const result = await apiWithRetry("/capture", { method: "POST", body: JSON.stringify(payload) }, "capture " + item.caseTypeId);
        if (result.status === "session_error") {
          state.retry += 1;
          state.sessionErrors += 1;
          const serverPause = result.pausedUntil ? Date.parse(result.pausedUntil) : 0;
          state.sessionPauseUntil = Math.max(state.sessionPauseUntil || 0, serverPause || Date.now() + Math.min(120000, 10000 * state.sessionErrors));
          state.clearQueuesAt = Date.now();
          queue.length = 0;
          status(RUNNER_LABEL + " saw a login/session-looking response; cooling down and retrying automatically (" + state.sessionErrors + "/" + SESSION_STOP_THRESHOLD + ")");
          const recovered = await ensureSessionRecovery(workerId);
          if (!recovered) break;
        } else if (result.status === "network_error") {
          state.retry += 1;
          if (result.pausedUntil) {
            state.sessionPauseUntil = Math.max(state.sessionPauseUntil || 0, Date.parse(result.pausedUntil));
            status(RUNNER_LABEL + " paused after repeated temporary failures; waiting");
            await waitForSessionCooldown(workerId);
          } else {
            status(RUNNER_LABEL + " temporary failure saved for retry; continuing");
          }
        } else if (result.status === "retry") {
          state.retry += 1;
          if (/short content length [0-5]\\b|content too short \\([0-5]\\)/i.test(String(result.reason || ""))) {
            state.empty += 1;
            status(RUNNER_LABEL + " empty PLS response saved for retry; continuing");
          } else {
            status(RUNNER_LABEL + " failed fetch saved for retry; continuing");
          }
          if (result.pausedUntil) {
            state.sessionPauseUntil = Math.max(state.sessionPauseUntil || 0, Date.parse(result.pausedUntil));
            await waitForSessionCooldown(workerId);
          }
        } else if (result.status === "manual_review") {
          state.failed += 1;
          status(RUNNER_LABEL + " moved one judgment to manual review; continuing");
        } else if (result.ok) {
          state.stored += 1;
          state.sessionErrors = 0;
          state.sessionPauseUntil = 0;
        } else {
          state.failed += 1;
        }
      } finally {
        stopHeartbeat();
        state.active -= 1;
      }
      if (DELAY_MS > 0) await sleep(DELAY_MS);
    }
  }

  status(RUNNER_LABEL + " starting " + WORKERS + " workers batch=" + BATCH_SIZE + " headnotes=" + (FETCH_HEADNOTES ? "on" : "off"));
  try {
    await Promise.all(Array.from({ length: WORKERS }, (_, index) => worker(index + 1)));
    let finalStatus = null;
    try {
      finalStatus = await api("/status");
    } catch (statusError) {
      console.warn("PLS final status lookup failed", statusError);
    }
    if (state.stoppedForSession) {
      status(RUNNER_LABEL + " stopped safely after repeated PLS login/search responses. Refresh/login and restart. stored this run=" + state.stored);
    } else if (finalStatus) {
      status(RUNNER_LABEL + " DONE | stored this run=" + state.stored + " remaining=" + finalStatus.remaining + " manual_review=" + finalStatus.manualReview);
      console.log("PLS fast local runner final status", finalStatus);
    } else {
      status(RUNNER_LABEL + " stopped after local status lookup failed; saved data is safe. stored this run=" + state.stored);
    }
  } catch (error) {
    status(RUNNER_LABEL + " stopped: " + (error && error.message || error));
    console.error(error);
  } finally {
    window.__codexPlsFastRunnerActive = false;
  }
})();
`;
}

function startServer(ledger, args) {
  const server = http.createServer(async (req, res) => {
    try {
      if (req.method === "OPTIONS") return sendJson(res, 200, { ok: true });
      const url = new URL(req.url || "/", `http://${args.host}:${args.port}`);

      if (req.method === "GET" && url.pathname === "/status") {
        return sendJson(res, 200, ledger.status());
      }

      if (req.method === "GET" && url.pathname === "/probe-job") {
        return sendJson(res, 200, { ok: true, item: ledger.probeJob() });
      }

      if (req.method === "POST" && url.pathname === "/session-ok") {
        ledger.clearPause("browser session probe succeeded");
        ledger.save({ immediate: true });
        return sendJson(res, 200, { ok: true });
      }

      if (req.method === "POST" && url.pathname === "/heartbeat") {
        const record = await readJsonBody(req, 64 * 1024);
        return sendJson(res, 200, ledger.heartbeat(record));
      }

      if (req.method === "GET" && url.pathname === "/next") {
        const limit = clampInt(url.searchParams.get("limit") || 1, 1, 10, 1);
        return sendJson(res, 200, ledger.leaseResponse(limit));
      }

      if (req.method === "GET" && url.pathname === "/pls_runner.js") {
        res.writeHead(200, {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/javascript; charset=utf-8",
        });
        res.end(runnerScript(args));
        return;
      }

      if (req.method === "POST" && url.pathname === "/capture") {
        const record = await readJsonBody(req);
        return sendJson(res, 200, ledger.capture(record));
      }

      sendJson(res, 404, { ok: false, error: "not found" });
    } catch (error) {
      writeLog(args.log, { level: "error", event: "http_error", error: error.message, stack: error.stack });
      sendJson(res, 500, { ok: false, error: error.message });
    }
  });

  server.keepAliveTimeout = 75_000;
  server.headersTimeout = 80_000;
  server.listen(args.port, args.host, () => {
    const runner = `http://${args.host}:${args.port}/pls_runner.js?workers=${args.workers}&batch=${args.batchSize}`;
    console.log(`READY ${runner}`);
    console.log(`OUT ${args.out}`);
    console.log(`STATE ${args.state}`);
    writeLog(args.log, { level: "info", event: "server_ready", runner, pid: process.pid, out: args.out, state: args.state });
  });

  process.on("SIGINT", () => {
    console.log("Stopping PLS fast local capture server...");
    ledger.flushSave();
    server.close();
    process.exit(0);
  });

  return server;
}

async function selfTest() {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "pls-fast-capture-"));
  const worklist = path.join(tmp, "worklist.json");
  const out = path.join(tmp, "out.jsonl");
  const failures = path.join(tmp, "failures.jsonl");
  const state = path.join(tmp, "state.json");
  const log = path.join(tmp, "capture.log");
  fs.writeFileSync(
    worklist,
    JSON.stringify([
      { caseTypeId: "1950L1", category: "PLD", citation: "1950 PLD 1", court: "LAHORE-HIGH-COURT-LAHORE", row_no: 1, title: "ONE VS TWO", year: 1950 },
      { caseTypeId: "1950S1", category: "PLD", citation: "1950 PLD 2", court: "SUPREME-COURT", row_no: 2, title: "THREE VS FOUR", year: 1950 },
      { caseTypeId: "1951D1", category: "PLD", citation: "1951 PLD 1", court: "DHAKA-HIGH-COURT", row_no: 3, title: "FIVE VS SIX", year: 1951 },
    ]),
    "utf8"
  );

  const args = {
    ...parseArgs([
      "--from",
      "1950",
      "--to",
      "1951",
      "--worklist",
      worklist,
      "--out",
      out,
      "--failures",
      failures,
      "--state",
      state,
      "--log",
      log,
      "--retry-base-seconds",
      "1",
      "--transient-retry-base-seconds",
      "1",
      "--empty-pause-threshold",
      "2",
      "--empty-pause-seconds",
      "10",
      "--max-empty-attempts",
      "10",
      "--session-pause-threshold",
      "3",
      "--session-pause-seconds",
      "30",
    ]),
    serve: false,
    status: false,
  };

  const ledger = new LocalLedger(args);
  await ledger.load();
  assert.equal(ledger.status().total, 3);
  const leased = ledger.lease(2);
  assert.equal(leased.length, 2);
  assert.equal(ledger.status().statuses.running, 2);
  const heartbeat = ledger.heartbeat({ caseTypeId: "1950L1" });
  assert.equal(heartbeat.ok, true);
  assert.equal(heartbeat.status, "running");

  const longContent = `1950 PLD 1 ${"Judgment text ".repeat(80)}`;
  const saved = ledger.capture({
    caseTypeId: "1950L1",
    citation: "1950 PLD 1",
    title: "ONE VS TWO",
    court: "LAHORE-HIGH-COURT-LAHORE",
    year: 1950,
    content: longContent,
    http_status: 200,
  });
  assert.equal(saved.ok, true);
  assert.equal(ledger.status().completed, 1);
  assert.equal(fs.readFileSync(out, "utf8").trim().split(/\r?\n/).length, 1);

  const failed = ledger.capture({
    failed: true,
    caseTypeId: "1950S1",
    citation: "1950 PLD 2",
    year: 1950,
    error: "Failed to fetch",
  });
  assert.equal(failed.status, "network_error");
  assert.equal(ledger.jobs.get("1950S1").status, "retry");

  const empty1 = ledger.capture({
    failed: true,
    caseTypeId: "1950S1",
    citation: "1950 PLD 2",
    year: 1950,
    error: "short content length 1",
  });
  assert.equal(empty1.status, "retry");
  const empty2 = ledger.capture({
    failed: true,
    caseTypeId: "1950S1",
    citation: "1950 PLD 2",
    year: 1950,
    error: "short content length 1",
  });
  assert.equal(empty2.status, "retry");
  assert.equal(ledger.isPaused(), false);
  assert.equal(ledger.status().recentEmptyFailures, 2);

  const shellResult = ledger.capture({
    caseTypeId: "1951D1",
    citation: "1951 PLD 1",
    title: "FIVE VS SIX",
    court: "DHAKA-HIGH-COURT",
    year: 1951,
    content: "Pakistan Law Site Case Law Search Enter Keyword Enter Court Login Password Subscription " + "style text ".repeat(120),
    raw_html: "<html><body><h1>Pakistan Law Site</h1><input id='bookSearch'><input id='courtSearch'>Case Law Search Login Password Subscription</body>",
    http_status: 200,
  });
  assert.equal(shellResult.status, "session_error");
  assert.equal(ledger.isPaused(), false);
  ledger.capture({
    caseTypeId: "1951D1",
    citation: "1951 PLD 1",
    title: "FIVE VS SIX",
    court: "DHAKA-HIGH-COURT",
    year: 1951,
    content: "Pakistan Law Site Case Law Search Enter Keyword Enter Court Login Password Subscription " + "style text ".repeat(120),
    raw_html: "<html><body><h1>Pakistan Law Site</h1><input id='bookSearch'><input id='courtSearch'>Case Law Search Login Password Subscription</body>",
    http_status: 200,
  });
  assert.equal(ledger.isPaused(), false);
  ledger.capture({
    caseTypeId: "1951D1",
    citation: "1951 PLD 1",
    title: "FIVE VS SIX",
    court: "DHAKA-HIGH-COURT",
    year: 1951,
    content: "Pakistan Law Site Case Law Search Enter Keyword Enter Court Login Password Subscription " + "style text ".repeat(120),
    raw_html: "<html><body><h1>Pakistan Law Site</h1><input id='bookSearch'><input id='courtSearch'>Case Law Search Login Password Subscription</body>",
    http_status: 200,
  });
  assert.equal(ledger.isPaused(), true);
  assert.equal(ledger.leaseResponse(1).paused, true);
  ledger.pausedUntil = 0;

  const wordJudgment = normalizeCaptureRecord({
    caseTypeId: "1980L4",
    citation: "1980 PLD 15",
    title: "KHAWAJ DIN VS RATIONING CONTROLLER FOOD, FAISALABAD",
    year: 1980,
    content:
      `<html xmlns:w="urn:schemas-microsoft-com:office:word"><head>` +
      `<script>window.open('http://www.pakistanlawsite.com');</script>` +
      `<meta name=ProgId content=Word.Document><meta name=Generator content="Microsoft Word 9">` +
      `<title>P L D 1980 Lahore 15</title><o:DocumentProperties></o:DocumentProperties></head>` +
      `<body>${"Judgment body text ".repeat(120)}</body></html>`,
    raw_html:
      `<html xmlns:w="urn:schemas-microsoft-com:office:word"><head>` +
      `<script>window.open('http://www.pakistanlawsite.com');</script>` +
      `<meta name=ProgId content=Word.Document><meta name=Generator content="Microsoft Word 9">` +
      `<title>P L D 1980 Lahore 15</title><o:DocumentProperties></o:DocumentProperties></head>` +
      `<body>${"Judgment body text ".repeat(120)}</body></html>`,
    http_status: 200,
  });
  assert.equal(wordJudgment.validation.ok, true);

  const untitledWordJudgment = normalizeCaptureRecord({
    caseTypeId: "1980K105",
    citation: "1980 PLD 609",
    title: "MAHER ALVI VS PAKISTAN",
    year: 1980,
    content:
      `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word">` +
      `<head><script>window.open('http://www.pakistanlawsite.com');</script>` +
      `<meta name=ProgId content=Word.Document><meta name=Generator content="Microsoft Word 9">` +
      `<o:DocumentProperties><o:Author>KHALED</o:Author></o:DocumentProperties></head>` +
      `<body>${"Judgment body text ".repeat(160)}</body></html>`,
    raw_html:
      `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word">` +
      `<head><script>window.open('http://www.pakistanlawsite.com');</script>` +
      `<meta name=ProgId content=Word.Document><meta name=Generator content="Microsoft Word 9">` +
      `<o:DocumentProperties><o:Author>KHALED</o:Author></o:DocumentProperties></head>` +
      `<body>${"Judgment body text ".repeat(160)}</body></html>`,
    http_status: 200,
  });
  assert.equal(untitledWordJudgment.validation.ok, true);

  fs.writeFileSync(out, fs.readFileSync(out, "utf8").replace(/\s*$/, "\n") + "{partial", "utf8");
  fs.rmSync(state, { force: true });
  fs.rmSync(`${state}.bak`, { force: true });
  const recovered = new LocalLedger(args);
  await recovered.load();
  assert.equal(recovered.status().completed, 1);
  assert.equal(recovered.jobs.get("1950L1").status, "completed");
  assert.equal(recovered.lease(10).length, 2);

  console.log(JSON.stringify({ ok: true, tmp, status: recovered.status({ includeFailures: false }) }));
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.selfTest) {
    await selfTest();
    return;
  }

  const ledger = new LocalLedger(args);
  await ledger.load();
  if (args.status) {
    console.log(JSON.stringify(ledger.status(), null, 2));
  }
  if (args.serve) {
    startServer(ledger, args);
  }
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
