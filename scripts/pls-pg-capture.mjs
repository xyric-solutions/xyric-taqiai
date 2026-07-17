/**
 * PostgreSQL-native Pakistan Law Site capture manager.
 *
 * This replaces the old SQLite-backed local capture server. PostgreSQL is used
 * for the work ledger, retry state, final legal_judgments rows, and audit
 * events. The browser runner still uses the logged-in Pakistan Law Site page
 * for /Login/GetCaseFile because that request depends on the active session.
 *
 * Common usage:
 *   node scripts/pls-pg-capture.mjs --setup --worklist ../data/pls_scp_2012_worklist.json --status
 *   node scripts/pls-pg-capture.mjs --setup --serve --from 1950 --to 1960 --worklist ../data/pls_all_courts_1950_1960_worklist.json --port 8781
 *   node scripts/pls-pg-capture.mjs --import-jsonl ../data/pls_scp_2012_full_scmr_8766.jsonl --status
 *   node scripts/pls-pg-capture.mjs --serve --port 8770
 */
import fs from "node:fs";
import { createHash } from "node:crypto";
import http from "node:http";
import os from "node:os";
import path from "node:path";
import readline from "node:readline";
import { fileURLToPath } from "node:url";
import { PrismaClient } from "@prisma/client";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const APP_ROOT = path.resolve(SCRIPT_DIR, "..");
const REPO_ROOT = path.resolve(APP_ROOT, "..");
const DEFAULT_WORKLIST = path.join(REPO_ROOT, "data", "pls_scp_2012_worklist.json");
const DEFAULT_JSONL = path.join(REPO_ROOT, "data", "pls_scp_2012_full_scmr_8766.jsonl");
const DEFAULT_LOG = path.join(REPO_ROOT, "data", "pls_pg_capture_2012.log");
const DEFAULT_PORT = 8770;
const DEFAULT_WORKERS = 3;
const DEFAULT_IMPORT_WORKERS = 4;
const DEFAULT_MAX_ATTEMPTS = 8;
const DEFAULT_STALE_MINUTES = 10;
const MIN_CONTENT_LENGTH = 500;

function parseArgs(argv) {
  const args = {
    setup: false,
    serve: false,
    status: false,
    importJsonl: null,
    worklist: DEFAULT_WORKLIST,
    log: DEFAULT_LOG,
    host: "127.0.0.1",
    port: DEFAULT_PORT,
    year: 2012,
    yearFrom: null,
    yearTo: null,
    workers: DEFAULT_WORKERS,
    importWorkers: DEFAULT_IMPORT_WORKERS,
    maxAttempts: DEFAULT_MAX_ATTEMPTS,
    staleMinutes: DEFAULT_STALE_MINUTES,
    source: "pakistanlawsite",
    citationPrefix: "PLS_SCP",
    dedupeByListing: false,
    reimportCompleted: false,
    fetchHeadnotes: false,
    skipExisting: true,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    const next = () => {
      i += 1;
      if (i >= argv.length) throw new Error(`Missing value after ${arg}`);
      return argv[i];
    };

    if (arg === "--setup") args.setup = true;
    else if (arg === "--serve") args.serve = true;
    else if (arg === "--status") args.status = true;
    else if (arg === "--import-jsonl") args.importJsonl = next() || DEFAULT_JSONL;
    else if (arg === "--worklist") args.worklist = next();
    else if (arg === "--log") args.log = next();
    else if (arg === "--host") args.host = next();
    else if (arg === "--port") args.port = Number(next());
    else if (arg === "--year") args.year = Number(next());
    else if (arg === "--from" || arg === "--year-from" || arg === "--range-start") args.yearFrom = Number(next());
    else if (arg === "--to" || arg === "--year-to" || arg === "--range-end") args.yearTo = Number(next());
    else if (arg === "--workers") args.workers = Number(next());
    else if (arg === "--import-workers") args.importWorkers = Number(next());
    else if (arg === "--max-attempts") args.maxAttempts = Number(next());
    else if (arg === "--stale-minutes") args.staleMinutes = Number(next());
    else if (arg === "--source") args.source = next();
    else if (arg === "--citation-prefix") args.citationPrefix = next();
    else if (arg === "--dedupe-by-listing") args.dedupeByListing = true;
    else if (arg === "--reimport-completed") args.reimportCompleted = true;
    else if (arg === "--fetch-headnotes") args.fetchHeadnotes = true;
    else if (arg === "--no-skip-existing") args.skipExisting = false;
    else if (arg === "--help" || arg === "-h") {
      console.log(fs.readFileSync(fileURLToPath(import.meta.url), "utf8").split("*/", 1)[0] + "*/");
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  args.worklist = resolvePath(args.worklist);
  args.log = resolvePath(args.log);
  if (args.importJsonl) args.importJsonl = resolvePath(args.importJsonl);
  args.yearFrom = Number(args.yearFrom || args.year);
  args.yearTo = Number(args.yearTo || args.yearFrom);
  if (!Number.isInteger(args.yearFrom) || !Number.isInteger(args.yearTo) || args.yearFrom < 1800 || args.yearTo > 2100) {
    throw new Error(`Invalid year range: ${args.yearFrom}-${args.yearTo}`);
  }
  if (args.yearTo < args.yearFrom) throw new Error(`Invalid descending year range: ${args.yearFrom}-${args.yearTo}`);
  args.year = args.yearFrom;
  if (!args.setup && !args.serve && !args.status && !args.importJsonl) args.status = true;
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

function requirePostgresUrl() {
  loadEnvFile(path.join(APP_ROOT, ".env.local"));
  loadEnvFile(path.join(APP_ROOT, ".env"));
  const url = process.env.DATABASE_URL || "";
  if (!/^postgres(?:ql)?:\/\//i.test(url)) {
    throw new Error("DATABASE_URL is not a PostgreSQL URL after loading .env.local/.env");
  }
  const parsed = new URL(url);
  if (!parsed.searchParams.has("sslmode")) parsed.searchParams.set("sslmode", "disable");
  parsed.searchParams.set("pool_timeout", String(Math.max(60, Number(parsed.searchParams.get("pool_timeout") || 0) || 0)));
  if (!parsed.searchParams.has("connection_limit")) parsed.searchParams.set("connection_limit", "10");
  process.env.DATABASE_URL = parsed.toString();
}

function ensureLogDir(logPath) {
  fs.mkdirSync(path.dirname(logPath), { recursive: true });
}

function jsonSafe(value) {
  return JSON.stringify(value, (_key, item) => (typeof item === "bigint" ? Number(item) : item));
}

function writeLog(logPath, event) {
  ensureLogDir(logPath);
  fs.appendFileSync(logPath, jsonSafe({ ts: new Date().toISOString(), ...event }) + "\n", "utf8");
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function withRetry(label, fn, attempts = 6, logPath = DEFAULT_LOG) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      const message = error?.message || String(error);
      writeLog(logPath, { level: "warn", label, attempt, attempts, error: message, stack: error?.stack });
      if (attempt >= attempts) break;
      const waitMs = Math.min(60_000, 750 * 2 ** (attempt - 1)) + Math.floor(Math.random() * 500);
      await sleep(waitMs);
    }
  }
  throw lastError;
}

function normSpace(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function compact(value) {
  return normSpace(value).replace(/[^a-z0-9]+/gi, "").toLowerCase();
}

function sanitizeKey(value) {
  return normSpace(value).replace(/[^A-Za-z0-9]+/g, "_").replace(/^_+|_+$/g, "").slice(0, 100);
}

function stableCitation(caseTypeId, prefix) {
  return `${prefix}_${sanitizeKey(caseTypeId)}`;
}

function stableListingCitation(normalized, prefix) {
  if (!normalized.citation) return stableCitation(normalized.caseTypeId, prefix);
  const listingKey = [
    normalized.year || "unknown-year",
    compact(normalized.citation),
    compact(normalized.title),
    compact(normalized.court),
  ].join("|");
  const hash = createHash("sha1").update(listingKey).digest("hex").slice(0, 12);
  return `${prefix}_${sanitizeKey(normalized.citation)}_${hash}`;
}

function yearLabel(args) {
  return args.yearFrom === args.yearTo ? String(args.yearFrom) : `${args.yearFrom}-${args.yearTo}`;
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

function courtLevel(court) {
  if (/supreme court/i.test(court)) return "Supreme Court";
  if (/high court/i.test(court)) return "High Court";
  if (/shariat/i.test(court)) return "Federal Shariat Court";
  return null;
}

function citationReporter(citation, category) {
  const match = normSpace(citation).match(/\b(SCMR|PLD|PCRLJ|PCrLJ|MLD|CLC|YLR|PLJ|NLR|CLD|KLR)\b/i);
  return (match?.[1] || category || "").toUpperCase() || null;
}

function parseYear(citation, content, fallback) {
  const match = `${citation || ""} ${content || ""}`.match(/\b(19[4-9]\d|20[0-4]\d)\b/);
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
  return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (full, entity) => {
    const lower = entity.toLowerCase();
    if (lower.startsWith("#x")) return String.fromCodePoint(Number.parseInt(lower.slice(2), 16));
    if (lower.startsWith("#")) return String.fromCodePoint(Number.parseInt(lower.slice(1), 10));
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
  const looksHtml = /<html\b|<body\b|<p\b|<div\b/i.test(decoded);
  const content = looksHtml ? htmlToText(decoded) : normSpace(decodeEntities(decoded));
  const transportComplete = looksHtml ? /<\/html\s*>/i.test(decoded) || /<\/body\s*>/i.test(decoded) : true;
  return { content, decoded, looksHtml, transportComplete };
}

function validateContent({ content, decoded, citation, court, transportComplete }) {
  if (!content || content.length < MIN_CONTENT_LENGTH) {
    return { ok: false, reason: `content too short (${content?.length || 0})` };
  }
  const packed = compact(`${content} ${decoded || ""}`);
  const citationPacked = compact(citation || "");
  if (
    /pakistanlawsite|login|password|captcha/i.test(content.slice(0, 2000)) &&
    citationPacked &&
    !packed.includes(citationPacked)
  ) {
    return { ok: false, reason: "response looks like a Pakistan Law Site shell/login page" };
  }
  if (citationPacked && !packed.includes(citationPacked)) {
    return { ok: true, reason: `ok; citation not found in content (${citation})` };
  }
  return { ok: true, reason: "ok" };
}

const REPORTER_SET = new Set([
  "PLD",
  "PLJ",
  "SCMR",
  "CLC",
  "YLR",
  "MLD",
  "PCRLJ",
  "PLC",
  "PLCCS",
  "CLD",
  "GBLR",
  "NLR",
  "PTD",
  "KLR",
  "SCR",
  "PLR",
  "PTCL",
  "CLR",
]);
const CITE_YEAR_FIRST = /\b((?:19|20)\d{2})\s+([A-Za-z][A-Za-z.\s]{0,16}?)\s+(\d{1,4})\b/g;
const CITE_REPORT_FIRST = /\b(PLD|PLJ|PTD)\s+((?:19|20)\d{2})\s+(SC|Lah|Kar|Pesh|Quetta|Isl|FSC|Note|Trib)\s+(\d{1,4})\b/g;

function reporterKey(value) {
  return String(value || "").replace(/[^a-z]/gi, "").toUpperCase();
}

function extractCitations(text, self) {
  if (!text) return [];
  const selfKey = self ? compact(self) : "";
  const seen = new Set();
  const out = [];
  const push = (canonical) => {
    const key = compact(canonical);
    if (!key || key === selfKey || seen.has(key) || key.length < 5) return;
    seen.add(key);
    out.push(canonical);
  };

  CITE_YEAR_FIRST.lastIndex = 0;
  for (const match of text.matchAll(CITE_YEAR_FIRST)) {
    const [, year, mid, num] = match;
    const reporter = reporterKey(mid);
    if (!REPORTER_SET.has(reporter)) continue;
    push(`${year} ${reporter} ${num}`);
  }

  CITE_REPORT_FIRST.lastIndex = 0;
  for (const match of text.matchAll(CITE_REPORT_FIRST)) {
    const [, reporter, year, court, num] = match;
    push(`${reporter.toUpperCase()} ${year} ${court} ${num}`);
  }

  return out.slice(0, 250);
}

function extractStatuteRefs(text) {
  if (!text) return [];
  const seen = new Set();
  const out = [];
  const add = (value) => {
    const ref = normSpace(value);
    const key = ref.toLowerCase();
    if (ref.length < 5 || seen.has(key)) return;
    seen.add(key);
    out.push(ref);
  };

  const named = /\b((?:[A-Z][A-Za-z.&'-]+\s+){1,6}(?:Act|Ordinance|Code|Constitution|Rules|Regulations))(?:,?\s+((?:18|19|20)\d{2}))?/g;
  for (const match of text.matchAll(named)) {
    const name = normSpace(match[1]);
    if (/^(The|This|That|A|An|It|His|Her|Said|Such)\b/i.test(name) && !/\d/.test(match[0])) {
      if (!/Act|Ordinance|Code|Constitution|Rules|Regulations/.test(name)) continue;
    }
    add(match[2] ? `${name}, ${match[2]}` : name);
  }

  for (const match of text.matchAll(/\b(?:Article|Section|S\.)\s+\d+[A-Z]?(?:[-A-Z])?(?:\([^)]+\))*\s*(?:of\s+the\s+)?(?:Constitution|PPC|Cr\.?\s*P\.?\s*C\.?|C\.?\s*P\.?\s*C\.?|QSO|Qanun-e-Shahadat|Evidence Act)?\b/gi)) {
    add(match[0]);
  }

  return out.slice(0, 200);
}

function isSessionFailureReason(reason) {
  return /Pakistan Law Site shell\/login page|login page|captcha|session|unauthori[sz]ed/i.test(String(reason || ""));
}

function isTransientNetworkReason(reason) {
  return /network|internet|offline|failed to fetch|load failed|timed out|timeout|abort|ECONN|ENOTFOUND|ETIMEDOUT|EAI_AGAIN|TLS|Can't reach database server|connection|short content length (?:[0-9]|[1-7][0-9])\b|content too short \((?:[0-9]|[1-7][0-9])\)/i.test(
    String(reason || "")
  );
}

function retryBackoffSeconds(job, { base = 45, cap = 1800 } = {}) {
  const attempts = Math.max(0, Number(job?.attempts || 0));
  const failures = Math.max(0, Number(job?.failure_count || 0));
  const exponent = Math.min(6, Math.max(attempts, failures));
  return Math.min(cap, base * 2 ** exponent) + Math.floor(Math.random() * 20);
}

function normalizeCaptureRecord(record, fallback = {}) {
  const caseTypeId = normSpace(record.caseTypeId || record.caseName || record.case_type_id || fallback.caseTypeId);
  const category = normSpace(record.search_category || record.category || fallback.category);
  const citation = normSpace(record.citation || fallback.citation);
  const title = normSpace(record.title || fallback.title);
  const court = normalizeCourt(record.court || fallback.court);
  const rawContent = record.content ?? record.text ?? record.html ?? record.raw_html ?? "";
  const { content, decoded, looksHtml, transportComplete } = normalizeContent(rawContent);
  const headnoteRaw = record.headnote_content ?? record.headnotes ?? record.headnote ?? "";
  const headnote = normalizeContent(headnoteRaw).content;
  const year = parseYear(citation, content, record.year || fallback.year || 2012);
  const validation = validateContent({ content, decoded, citation, court, transportComplete });
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
    htmlLength: Number(record.html_length || (looksHtml ? decoded.length : 0) || 0),
    httpStatus: Number(record.http_status || 0) || null,
    scrapedAt: record.scraped_at || new Date().toISOString(),
    validation,
    failure: Boolean(record.failed),
    error: normSpace(record.error || record.message),
    stack: String(record.stack || ""),
    rawPreview: normSpace(decoded).slice(0, 1000),
  };
}

async function ensureSchema(prisma, logPath) {
  await withRetry("create legal_judgments", () =>
    prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS legal_judgments (
        id INTEGER PRIMARY KEY,
        citation TEXT NOT NULL,
        court TEXT NOT NULL,
        year INTEGER NOT NULL,
        content TEXT,
        processed INTEGER DEFAULT 0,
        created_at BIGINT,
        title TEXT,
        real_citation TEXT,
        law_category TEXT,
        case_type TEXT,
        court_level TEXT,
        province TEXT,
        reported_status TEXT,
        citation_reporter TEXT,
        authority_score INTEGER,
        template_usefulness_score INTEGER,
        citation_reliability_score INTEGER,
        ocr_quality_score INTEGER,
        tagging_confidence INTEGER,
        tagged_at BIGINT
      )
    `),
    6,
    logPath
  );

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS pls_capture_jobs (
      source TEXT NOT NULL,
      year INTEGER NOT NULL,
      case_type_id TEXT PRIMARY KEY,
      category TEXT,
      citation TEXT,
      title TEXT,
      court TEXT,
      row_no INTEGER,
      status TEXT NOT NULL DEFAULT 'pending',
      attempts INTEGER NOT NULL DEFAULT 0,
      failure_count INTEGER NOT NULL DEFAULT 0,
      lease_token TEXT,
      leased_at TIMESTAMPTZ,
      next_attempt_at TIMESTAMPTZ,
      last_http_status INTEGER,
      last_error TEXT,
      last_stack TEXT,
      last_response_preview TEXT,
      content_length INTEGER,
      html_length INTEGER,
      legal_judgment_id INTEGER REFERENCES legal_judgments(id) ON DELETE SET NULL,
      first_seen_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      completed_at TIMESTAMPTZ,
      last_scraped_at TIMESTAMPTZ
    )
  `);
  await prisma.$executeRawUnsafe(`ALTER TABLE pls_capture_jobs ADD COLUMN IF NOT EXISTS next_attempt_at TIMESTAMPTZ`);

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS pls_capture_events (
      id BIGSERIAL PRIMARY KEY,
      case_type_id TEXT,
      event_type TEXT NOT NULL,
      message TEXT,
      details JSONB,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `);

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS legal_citation_edges (
      id INTEGER PRIMARY KEY,
      citing_id INTEGER REFERENCES legal_judgments(id) ON DELETE CASCADE,
      cited_key TEXT
    )
  `);

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS legal_cited_counts (
      cited_key TEXT PRIMARY KEY,
      n INTEGER NOT NULL DEFAULT 0
    )
  `);

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS legal_judgment_statute_refs (
      id BIGSERIAL PRIMARY KEY,
      judgment_id INTEGER NOT NULL REFERENCES legal_judgments(id) ON DELETE CASCADE,
      ref_text TEXT NOT NULL,
      source TEXT NOT NULL DEFAULT 'pls_capture',
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `);

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS legal_judgment_headnotes (
      id BIGSERIAL PRIMARY KEY,
      judgment_id INTEGER NOT NULL REFERENCES legal_judgments(id) ON DELETE CASCADE,
      headnote_text TEXT NOT NULL,
      source TEXT NOT NULL DEFAULT 'pls_capture',
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `);

  await prisma.$executeRawUnsafe(`CREATE SEQUENCE IF NOT EXISTS legal_judgments_pls_id_seq AS INTEGER`);
  await prisma.$queryRawUnsafe(`
    SELECT setval(
      'legal_judgments_pls_id_seq',
      GREATEST(
        (SELECT COALESCE(MAX(id), 0) FROM legal_judgments),
        (SELECT COALESCE(last_value, 1) FROM legal_judgments_pls_id_seq),
        1
      ),
      true
    )
  `);
  await prisma.$executeRawUnsafe(`CREATE SEQUENCE IF NOT EXISTS legal_citation_edges_pls_id_seq AS INTEGER`);
  await prisma.$queryRawUnsafe(`
    SELECT setval(
      'legal_citation_edges_pls_id_seq',
      GREATEST(
        (SELECT COALESCE(MAX(id), 0) FROM legal_citation_edges),
        (SELECT COALESCE(last_value, 1) FROM legal_citation_edges_pls_id_seq),
        1
      ),
      true
    )
  `);

  await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS legal_judgments_citation_idx ON legal_judgments (citation)`);
  await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS legal_judgments_real_citation_idx ON legal_judgments (real_citation)`);
  await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS legal_judgments_court_year_idx ON legal_judgments (court, year)`);
  await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS pls_capture_jobs_status_idx ON pls_capture_jobs (source, year, status, row_no)`);
  await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS pls_capture_jobs_retry_idx ON pls_capture_jobs (source, year, status, next_attempt_at, row_no)`);
  await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS pls_capture_jobs_legal_judgment_idx ON pls_capture_jobs (legal_judgment_id)`);
  await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS pls_capture_events_case_idx ON pls_capture_events (case_type_id, created_at)`);
  await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS legal_citation_edges_citing_idx ON legal_citation_edges (citing_id)`);
  await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS legal_citation_edges_key_idx ON legal_citation_edges (cited_key)`);
  await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS legal_cited_counts_n_idx ON legal_cited_counts (n)`);
  await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS legal_judgment_statute_refs_judgment_idx ON legal_judgment_statute_refs (judgment_id)`);
  await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS legal_judgment_statute_refs_judgment_ref_uidx ON legal_judgment_statute_refs (judgment_id, ref_text)`);
  await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS legal_judgment_headnotes_judgment_uidx ON legal_judgment_headnotes (judgment_id)`);

  const duplicates = await prisma.$queryRawUnsafe(`
    SELECT citation, COUNT(*)::int AS count
    FROM legal_judgments
    WHERE citation LIKE 'PLS\\_%' ESCAPE '\\'
    GROUP BY citation
    HAVING COUNT(*) > 1
    LIMIT 5
  `);
  if (duplicates.length === 0) {
    await prisma.$executeRawUnsafe(`
      CREATE UNIQUE INDEX IF NOT EXISTS legal_judgments_pls_citation_uidx
      ON legal_judgments (citation)
      WHERE citation LIKE 'PLS\\_%' ESCAPE '\\'
    `);
  } else {
    writeLog(logPath, {
      level: "warn",
      event: "skip_partial_unique_index",
      reason: "duplicate PLS citation rows already exist",
      duplicates,
    });
  }
}

async function seedWorklist(prisma, args) {
  if (!fs.existsSync(args.worklist)) {
    writeLog(args.log, { level: "warn", event: "missing_worklist", path: args.worklist });
    return { seeded: 0, total: 0 };
  }

  const items = JSON.parse(fs.readFileSync(args.worklist, "utf8"));
  if (!Array.isArray(items)) throw new Error(`Worklist is not an array: ${args.worklist}`);

  const rows = items
    .map((item) => {
      const caseTypeId = normSpace(item.caseTypeId || item.caseName);
      if (!caseTypeId) return null;
      return {
        source: args.source,
        year: Number(item.year || args.yearFrom || args.year),
        caseTypeId,
        category: normSpace(item.category),
        citation: normSpace(item.citation),
        title: normSpace(item.title),
        court: normalizeCourt(item.court),
        rowNo: Number(item.row_no || 0) || null,
      };
    })
    .filter(Boolean);

  for (let offset = 0; offset < rows.length; offset += 100) {
    const batch = rows.slice(offset, offset + 100);
    const values = [];
    let param = 1;
    const tuples = batch.map((row) => {
      const placeholders = [
        row.source,
        row.year,
        row.caseTypeId,
        row.category,
        row.citation,
        row.title,
        row.court,
        row.rowNo,
      ].map((value) => {
        values.push(value);
        return `$${param++}`;
      });
      return `(${placeholders.join(", ")}, now())`;
    });
    await prisma.$executeRawUnsafe(
      `
      INSERT INTO pls_capture_jobs
        (source, year, case_type_id, category, citation, title, court, row_no, updated_at)
      VALUES ${tuples.join(", ")}
      ON CONFLICT (case_type_id) DO UPDATE SET
        source = excluded.source,
        year = excluded.year,
        category = excluded.category,
        citation = excluded.citation,
        title = excluded.title,
        court = excluded.court,
        row_no = excluded.row_no,
        updated_at = now()
      `,
      ...values
    );
  }

  writeLog(args.log, { level: "info", event: "seed_worklist", total: rows.length, path: args.worklist });
  if (args.skipExisting) await linkExistingCompletedJobs(prisma, args);
  return { seeded: rows.length, total: rows.length };
}

async function linkExistingCompletedJobs(prisma, args) {
  const linkedRows = await withRetry(
    "link existing judgments",
    () =>
      prisma.$queryRawUnsafe(
        `
        WITH matches AS (
          SELECT DISTINCT ON (job.case_type_id)
            job.case_type_id,
            judgment.id AS legal_judgment_id,
            LENGTH(COALESCE(judgment.content, ''))::int AS content_length
          FROM pls_capture_jobs job
          JOIN legal_judgments judgment
            ON judgment.year = job.year
           AND job.citation IS NOT NULL
           AND job.citation <> ''
           AND job.court IS NOT NULL
           AND job.court <> ''
           AND job.title IS NOT NULL
           AND job.title <> ''
           AND (
             judgment.real_citation = job.citation
             OR judgment.citation = job.citation
           )
           AND regexp_replace(lower(COALESCE(judgment.court, '')), '[^a-z0-9]+', '', 'g')
             = regexp_replace(lower(COALESCE(job.court, '')), '[^a-z0-9]+', '', 'g')
           AND regexp_replace(lower(COALESCE(judgment.title, '')), '[^a-z0-9]+', '', 'g')
             = regexp_replace(lower(COALESCE(job.title, '')), '[^a-z0-9]+', '', 'g')
           AND LENGTH(COALESCE(judgment.content, '')) >= $4
          WHERE job.source = $1
            AND job.year BETWEEN $2 AND $3
            AND job.status IN ('pending', 'retry')
          ORDER BY job.case_type_id,
            CASE WHEN judgment.real_citation = job.citation THEN 0 ELSE 1 END,
            judgment.id
        )
        UPDATE pls_capture_jobs job SET
          status = 'completed',
          legal_judgment_id = matches.legal_judgment_id,
          content_length = matches.content_length,
          completed_at = COALESCE(job.completed_at, now()),
          updated_at = now(),
          last_error = NULL,
          last_stack = NULL,
          last_response_preview = NULL
        FROM matches
        WHERE job.case_type_id = matches.case_type_id
        RETURNING job.case_type_id AS "caseTypeId", job.citation, job.legal_judgment_id AS "legalJudgmentId"
        `,
        args.source,
        args.yearFrom,
        args.yearTo,
        MIN_CONTENT_LENGTH
      ),
    6,
    args.log
  );
  if (linkedRows.length) {
    writeLog(args.log, { level: "info", event: "linked_existing_judgments", years: yearLabel(args), count: linkedRows.length });
  }
  return linkedRows.length;
}

async function insertEvent(tx, caseTypeId, eventType, message, details) {
  await tx.$executeRawUnsafe(
    `
    INSERT INTO pls_capture_events (case_type_id, event_type, message, details)
    VALUES ($1, $2, $3, $4::jsonb)
    `,
    caseTypeId || null,
    eventType,
    message || null,
    JSON.stringify(details || {})
  );
}

async function getJobForUpdate(tx, caseTypeId) {
  const rows = await tx.$queryRawUnsafe(
    `
    SELECT *
    FROM pls_capture_jobs
    WHERE case_type_id = $1
    FOR UPDATE
    `,
    caseTypeId
  );
  return rows[0] || null;
}

async function ensureJob(tx, normalized, args) {
  await tx.$executeRawUnsafe(
    `
    INSERT INTO pls_capture_jobs
      (source, year, case_type_id, category, citation, title, court, row_no, status, updated_at)
    VALUES
      ($1, $2, $3, $4, $5, $6, $7, NULL, 'pending', now())
    ON CONFLICT (case_type_id) DO UPDATE SET
      source = excluded.source,
      year = COALESCE(pls_capture_jobs.year, excluded.year),
      category = COALESCE(pls_capture_jobs.category, excluded.category),
      citation = COALESCE(pls_capture_jobs.citation, excluded.citation),
      title = COALESCE(pls_capture_jobs.title, excluded.title),
      court = COALESCE(pls_capture_jobs.court, excluded.court),
      updated_at = now()
    `,
    args.source,
    normalized.year || args.yearFrom || args.year,
    normalized.caseTypeId,
    normalized.category || null,
    normalized.citation || null,
    normalized.title || null,
    normalized.court || null
  );
  return getJobForUpdate(tx, normalized.caseTypeId);
}

async function refreshCitedCounts(tx, citedKeys) {
  const keys = Array.from(new Set((citedKeys || []).filter(Boolean)));
  if (!keys.length) return;
  await tx.$executeRawUnsafe(
    `
    WITH keys AS (
      SELECT DISTINCT value AS cited_key
      FROM jsonb_array_elements_text($1::jsonb) AS t(value)
    )
    INSERT INTO legal_cited_counts (cited_key, n)
    SELECT keys.cited_key, COUNT(edges.cited_key)::int AS n
    FROM keys
    LEFT JOIN legal_citation_edges AS edges ON edges.cited_key = keys.cited_key
    GROUP BY keys.cited_key
    ON CONFLICT (cited_key) DO UPDATE SET n = excluded.n
    `,
    JSON.stringify(keys)
  );
}

async function replaceDerivedLegalSignals(tx, judgmentId, normalized) {
  const oldCitationRows = await tx.$queryRawUnsafe(
    `SELECT DISTINCT cited_key FROM legal_citation_edges WHERE citing_id = $1 AND cited_key IS NOT NULL`,
    judgmentId
  );
  const oldCitationKeys = oldCitationRows.map((row) => row.cited_key).filter(Boolean);
  await tx.$executeRawUnsafe(`DELETE FROM legal_citation_edges WHERE citing_id = $1`, judgmentId);

  const citationKeys = extractCitations(normalized.content, normalized.citation);
  if (citationKeys.length) {
    await tx.$executeRawUnsafe(
      `
      INSERT INTO legal_citation_edges (id, citing_id, cited_key)
      SELECT nextval('legal_citation_edges_pls_id_seq')::int, $1, value
      FROM jsonb_array_elements_text($2::jsonb) AS t(value)
      `,
      judgmentId,
      JSON.stringify(citationKeys)
    );
  }
  await refreshCitedCounts(tx, Array.from(new Set([...oldCitationKeys, ...citationKeys])));

  await tx.$executeRawUnsafe(`DELETE FROM legal_judgment_statute_refs WHERE judgment_id = $1`, judgmentId);
  const statuteRefs = extractStatuteRefs(normalized.content);
  if (statuteRefs.length) {
    await tx.$executeRawUnsafe(
      `
      INSERT INTO legal_judgment_statute_refs (judgment_id, ref_text, source)
      SELECT $1, value, 'pls_capture'
      FROM jsonb_array_elements_text($2::jsonb) AS t(value)
      ON CONFLICT (judgment_id, ref_text) DO NOTHING
      `,
      judgmentId,
      JSON.stringify(statuteRefs)
    );
  }

  if (normalized.headnoteContent && normalized.headnoteContent.length >= 80) {
    await tx.$executeRawUnsafe(
      `
      INSERT INTO legal_judgment_headnotes (judgment_id, headnote_text, source, updated_at)
      VALUES ($1, $2, 'pls_capture', now())
      ON CONFLICT (judgment_id) DO UPDATE SET
        headnote_text = excluded.headnote_text,
        source = excluded.source,
        updated_at = now()
      `,
      judgmentId,
      normalized.headnoteContent
    );
  }

  return { citationEdges: citationKeys.length, statuteRefs: statuteRefs.length, hasHeadnote: Boolean(normalized.headnoteContent) };
}

async function findExistingReportedJudgment(tx, normalized) {
  if (!normalized.citation) return null;
  const courtKey = compact(normalized.court);
  const titleKey = compact(normalized.title);
  if (!courtKey || !titleKey) return null;
  const rows = await tx.$queryRawUnsafe(
    `
    SELECT id, LENGTH(COALESCE(content, ''))::int AS content_length
    FROM legal_judgments
    WHERE year = $1
      AND LENGTH(COALESCE(content, '')) >= $3
      AND (real_citation = $2 OR citation = $2)
      AND regexp_replace(lower(COALESCE(court, '')), '[^a-z0-9]+', '', 'g') = $4
      AND regexp_replace(lower(COALESCE(title, '')), '[^a-z0-9]+', '', 'g') = $5
    ORDER BY CASE WHEN real_citation = $2 THEN 0 ELSE 1 END, id
    LIMIT 1
    `,
    normalized.year,
    normalized.citation,
    MIN_CONTENT_LENGTH,
    courtKey,
    titleKey
  );
  return rows[0] || null;
}

async function upsertLegalJudgment(tx, normalized, args) {
  const job = await ensureJob(tx, normalized, args);
  const finalCitation = args.dedupeByListing
    ? stableListingCitation(normalized, args.citationPrefix)
    : stableCitation(normalized.caseTypeId, args.citationPrefix);
  let judgmentId = job?.legal_judgment_id ? Number(job.legal_judgment_id) : null;

  if (!judgmentId && args.skipExisting) {
    const existingReported = await findExistingReportedJudgment(tx, normalized);
    if (existingReported?.id) {
      judgmentId = Number(existingReported.id);
      await tx.$executeRawUnsafe(
        `
        UPDATE pls_capture_jobs SET
          status = 'completed',
          lease_token = NULL,
          leased_at = NULL,
          last_http_status = $2,
          last_error = NULL,
          last_stack = NULL,
          last_response_preview = NULL,
          content_length = $3,
          html_length = $4,
          legal_judgment_id = $5,
          completed_at = COALESCE(completed_at, now()),
          last_scraped_at = now(),
          updated_at = now()
        WHERE case_type_id = $1
        `,
        normalized.caseTypeId,
        normalized.httpStatus,
        Number(existingReported.content_length || normalized.contentLength),
        normalized.htmlLength,
        judgmentId
      );
      await insertEvent(tx, normalized.caseTypeId, "completed_existing", "Existing PostgreSQL judgment reused; duplicate PLS insert skipped", {
        legalJudgmentId: judgmentId,
        citation: normalized.citation,
      });
      return judgmentId;
    }
  }

  if (!judgmentId) {
    const existing = await tx.$queryRawUnsafe(
      `SELECT id FROM legal_judgments WHERE citation = $1 ORDER BY id LIMIT 1`,
      finalCitation
    );
    judgmentId = existing[0]?.id ? Number(existing[0].id) : null;
  }

  const nowMs = Date.now();
  const reporter = citationReporter(normalized.citation, normalized.category);
  const level = courtLevel(normalized.court);
  const province = level === "Supreme Court" || level === "Federal Shariat Court" ? "Federal" : null;

  if (judgmentId) {
    await tx.$executeRawUnsafe(
      `
      UPDATE legal_judgments SET
        citation = $2,
        court = $3,
        year = $4,
        content = $5,
        processed = 1,
        title = $6,
        real_citation = $7,
        law_category = $8,
        case_type = $9,
        court_level = $10,
        province = $11,
        reported_status = $12,
        citation_reporter = $13,
        tagged_at = COALESCE(tagged_at, $14)
      WHERE id = $1
      `,
      judgmentId,
      finalCitation,
      normalized.court,
      normalized.year,
      normalized.content,
      normalized.title || null,
      normalized.citation || null,
      "case_law",
      normalized.category || reporter || null,
      level,
      province,
      normalized.citation ? "reported" : null,
      reporter,
      nowMs
    );
  } else {
    const idRows = await tx.$queryRawUnsafe(`SELECT nextval('legal_judgments_pls_id_seq')::int AS id`);
    judgmentId = Number(idRows[0].id);
    await tx.$executeRawUnsafe(
      `
      INSERT INTO legal_judgments
        (id, citation, court, year, content, processed, created_at, title, real_citation,
         law_category, case_type, court_level, province, reported_status, citation_reporter,
         tagged_at)
      VALUES
        ($1, $2, $3, $4, $5, 1, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      `,
      judgmentId,
      finalCitation,
      normalized.court,
      normalized.year,
      normalized.content,
      nowMs,
      normalized.title || null,
      normalized.citation || null,
      "case_law",
      normalized.category || reporter || null,
      level,
      province,
      normalized.citation ? "reported" : null,
      reporter,
      nowMs
    );
  }

  const derived = await replaceDerivedLegalSignals(tx, judgmentId, normalized);

  await tx.$executeRawUnsafe(
    `
    UPDATE pls_capture_jobs SET
      status = 'completed',
      lease_token = NULL,
      leased_at = NULL,
      last_http_status = $2,
      last_error = NULL,
      last_stack = NULL,
      last_response_preview = NULL,
      content_length = $3,
      html_length = $4,
      legal_judgment_id = $5,
      completed_at = COALESCE(completed_at, now()),
      last_scraped_at = now(),
      updated_at = now()
    WHERE case_type_id = $1
    `,
    normalized.caseTypeId,
    normalized.httpStatus,
    normalized.contentLength,
    normalized.htmlLength,
    judgmentId
  );

  await insertEvent(tx, normalized.caseTypeId, "completed", "Judgment stored in PostgreSQL", {
    legalJudgmentId: judgmentId,
    citation: normalized.citation,
    contentLength: normalized.contentLength,
    ...derived,
  });

  return judgmentId;
}

async function markFailure(tx, normalized, args, reason) {
  const job = await ensureJob(tx, normalized, args);
  const attempts = Number(job?.attempts || 0);
  const failureCount = Number(job?.failure_count || 0) + 1;
  const status = attempts >= args.maxAttempts ? "manual_review" : "retry";
  const backoffSeconds = retryBackoffSeconds({ ...job, failure_count: failureCount });
  await tx.$executeRawUnsafe(
    `
    UPDATE pls_capture_jobs SET
      status = $2,
      lease_token = NULL,
      leased_at = NULL,
      failure_count = $3,
      last_http_status = $4,
      last_error = $5,
      last_stack = $6,
      last_response_preview = $7,
      content_length = $8,
      html_length = $9,
      next_attempt_at = CASE WHEN $2 = 'retry' THEN now() + ($10::int * interval '1 second') ELSE NULL END,
      last_scraped_at = now(),
      updated_at = now()
    WHERE case_type_id = $1
    `,
    normalized.caseTypeId,
    status,
    failureCount,
    normalized.httpStatus,
    reason || normalized.error || normalized.validation.reason,
    normalized.stack || null,
    normalized.rawPreview || null,
    normalized.contentLength,
    normalized.htmlLength,
    backoffSeconds
  );
  await insertEvent(tx, normalized.caseTypeId, status, reason || normalized.validation.reason, {
    attempts,
    failureCount,
    httpStatus: normalized.httpStatus,
    contentLength: normalized.contentLength,
    stack: normalized.stack || null,
  });
  return status;
}

async function markTransientFailure(tx, normalized, args, reason) {
  const job = await ensureJob(tx, normalized, args);
  const attempts = Math.max(0, Number(job?.attempts || 0) - 1);
  const backoffSeconds = retryBackoffSeconds(job, { base: 60, cap: 2400 });
  await tx.$executeRawUnsafe(
    `
    UPDATE pls_capture_jobs SET
      status = 'retry',
      attempts = $2,
      lease_token = NULL,
      leased_at = NULL,
      last_http_status = $3,
      last_error = $4,
      last_stack = $5,
      last_response_preview = $6,
      content_length = $7,
      html_length = $8,
      next_attempt_at = now() + ($9::int * interval '1 second'),
      last_scraped_at = now(),
      updated_at = now()
    WHERE case_type_id = $1
    `,
    normalized.caseTypeId,
    attempts,
    normalized.httpStatus,
    reason || normalized.error || normalized.validation.reason,
    normalized.stack || null,
    normalized.rawPreview || null,
    normalized.contentLength,
    normalized.htmlLength,
    backoffSeconds
  );
  await insertEvent(tx, normalized.caseTypeId, "session_retry", reason || normalized.validation.reason, {
    attempts,
    httpStatus: normalized.httpStatus,
    contentLength: normalized.contentLength,
    stack: normalized.stack || null,
  });
  return "retry";
}

async function processCapture(prisma, record, args, fallback = {}) {
  const normalized = normalizeCaptureRecord(record, { ...fallback, year: args.yearFrom || args.year });
  if (!normalized.caseTypeId) throw new Error("Capture record is missing caseTypeId/caseName");

  return withRetry(
    `process ${normalized.caseTypeId}`,
    () =>
      prisma.$transaction(
        async (tx) => {
          if (normalized.failure) {
            if (isSessionFailureReason(normalized.error)) {
              await markTransientFailure(tx, normalized, args, normalized.error || "browser session failure");
              return { ok: false, status: "session_error", caseTypeId: normalized.caseTypeId };
            }
            if (isTransientNetworkReason(normalized.error)) {
              await markTransientFailure(tx, normalized, args, normalized.error || "temporary network failure");
              return { ok: false, status: "network_error", caseTypeId: normalized.caseTypeId };
            }
            const status = await markFailure(tx, normalized, args, normalized.error || "browser fetch failed");
            return { ok: false, status, caseTypeId: normalized.caseTypeId };
          }
          if (!normalized.validation.ok) {
            if (isSessionFailureReason(normalized.validation.reason)) {
              await markTransientFailure(tx, normalized, args, normalized.validation.reason);
              return { ok: false, status: "session_error", caseTypeId: normalized.caseTypeId };
            }
            if (isTransientNetworkReason(normalized.validation.reason)) {
              await markTransientFailure(tx, normalized, args, normalized.validation.reason);
              return { ok: false, status: "network_error", caseTypeId: normalized.caseTypeId };
            }
            const status = await markFailure(tx, normalized, args, normalized.validation.reason);
            return { ok: false, status, caseTypeId: normalized.caseTypeId };
          }
          const legalJudgmentId = await upsertLegalJudgment(tx, normalized, args);
          return {
            ok: true,
            status: "completed",
            caseTypeId: normalized.caseTypeId,
            legalJudgmentId,
            contentLength: normalized.contentLength,
          };
        },
        { timeout: 90_000, maxWait: 60_000 }
      ),
    6,
    args.log
  );
}

async function importJsonl(prisma, args) {
  if (!fs.existsSync(args.importJsonl)) throw new Error(`Missing JSONL file: ${args.importJsonl}`);
  const bestByCase = new Map();
  let lines = 0;
  let badJson = 0;
  let invalid = 0;

  const rl = readline.createInterface({
    input: fs.createReadStream(args.importJsonl, { encoding: "utf8" }),
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    if (!line.trim()) continue;
    lines += 1;
    let record;
    try {
      record = JSON.parse(line);
    } catch (error) {
      badJson += 1;
      writeLog(args.log, { level: "error", event: "bad_jsonl_line", line: lines, error: error.message });
      continue;
    }
    const normalized = normalizeCaptureRecord(record, { year: args.yearFrom || args.year });
    if (!normalized.caseTypeId) {
      invalid += 1;
      continue;
    }
    const prev = bestByCase.get(normalized.caseTypeId);
    const score = [normalized.validation.ok ? 1 : 0, normalized.contentLength];
    const prevScore = prev ? [prev.normalized.validation.ok ? 1 : 0, prev.normalized.contentLength] : [-1, -1];
    if (!prev || score[0] > prevScore[0] || (score[0] === prevScore[0] && score[1] > prevScore[1])) {
      bestByCase.set(normalized.caseTypeId, { record, normalized });
    }
  }

  let stored = 0;
  let failed = 0;
  const started = Date.now();
  let entries = Array.from(bestByCase.values());
  let skippedCompleted = 0;
  if (!args.reimportCompleted) {
    const completedRows = await prisma.$queryRawUnsafe(
      `
      SELECT case_type_id AS "caseTypeId"
      FROM pls_capture_jobs
      WHERE source = $1 AND year BETWEEN $2 AND $3 AND status = 'completed'
      `,
      args.source,
      args.yearFrom,
      args.yearTo
    );
    const completedIds = new Set(completedRows.map((row) => row.caseTypeId));
    const before = entries.length;
    entries = entries.filter(({ normalized }) => !completedIds.has(normalized.caseTypeId));
    skippedCompleted = before - entries.length;
  }
  const workerCount = Math.max(1, Math.min(Number(args.importWorkers || 1), entries.length || 1));
  let cursor = 0;

  async function importWorker(workerId) {
    while (true) {
      const index = cursor;
      cursor += 1;
      if (index >= entries.length) return;
      const { record, normalized } = entries[index];
      const result = await processCapture(prisma, record, args);
      if (result.ok) stored += 1;
      else failed += 1;
      const done = stored + failed;
      if (done % 25 === 0 || done === entries.length) {
        console.log(
          `import progress ${done}/${entries.length} stored=${stored} failed=${failed} workers=${workerCount}`
        );
      }
      if (!normalized.validation.ok) {
        writeLog(args.log, {
          level: "warn",
          event: "invalid_import_record",
          workerId,
          caseTypeId: normalized.caseTypeId,
          reason: normalized.validation.reason,
        });
      }
    }
  }

  await Promise.all(Array.from({ length: workerCount }, (_unused, index) => importWorker(index + 1)));

  const seconds = Math.max(0.001, (Date.now() - started) / 1000);
  const report = {
    lines,
    uniqueCases: bestByCase.size,
    stored,
    failed,
    badJson,
    invalid,
    skippedCompleted,
    workers: workerCount,
    recordsPerSecond: Number((stored / seconds).toFixed(2)),
  };
  writeLog(args.log, { level: "info", event: "import_jsonl_complete", ...report });
  return report;
}

async function leaseJobs(prisma, args, limit) {
  const leaseToken = `${process.pid}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  return withRetry(
    "lease jobs",
    () =>
      prisma.$queryRawUnsafe(
        `
        WITH picked AS (
          SELECT case_type_id
          FROM pls_capture_jobs
          WHERE source = $1
            AND year BETWEEN $2 AND $3
            AND attempts < $4
            AND (
              status = 'pending'
              OR (status = 'retry' AND (next_attempt_at IS NULL OR next_attempt_at <= now()))
              OR (status = 'running' AND leased_at < now() - ($5::int * interval '1 minute'))
            )
          ORDER BY
            CASE
              WHEN status = 'pending' THEN 0
              WHEN status = 'running' THEN 1
              ELSE 2
            END,
            COALESCE(next_attempt_at, now()),
            year,
            row_no NULLS LAST,
            case_type_id
          LIMIT $6
          FOR UPDATE SKIP LOCKED
        )
        UPDATE pls_capture_jobs AS job SET
          status = 'running',
          attempts = attempts + 1,
          lease_token = $7,
          leased_at = now(),
          next_attempt_at = NULL,
          updated_at = now()
        FROM picked
        WHERE job.case_type_id = picked.case_type_id
        RETURNING
          job.case_type_id AS "caseTypeId",
          job.category,
          job.citation,
          job.title,
          job.court,
          job.year,
          job.row_no AS "rowNo",
          job.attempts
        `,
        args.source,
        args.yearFrom,
        args.yearTo,
        args.maxAttempts,
        args.staleMinutes,
        limit,
        leaseToken
      ),
    6,
    args.log
  );
}

async function getStatus(prisma, args) {
  const statusRows = await prisma.$queryRawUnsafe(
    `
    SELECT status, COUNT(*)::int AS count
    FROM pls_capture_jobs
    WHERE source = $1 AND year BETWEEN $2 AND $3
    GROUP BY status
    ORDER BY status
    `,
    args.source,
    args.yearFrom,
    args.yearTo
  );
  const totals = Object.fromEntries(statusRows.map((row) => [row.status, Number(row.count)]));
  const summaryRows = await prisma.$queryRawUnsafe(
    `
    SELECT
      COUNT(*)::int AS total,
      COUNT(*) FILTER (WHERE status = 'completed')::int AS completed,
      COUNT(*) FILTER (WHERE status IN ('pending', 'retry', 'running'))::int AS remaining,
      COUNT(*) FILTER (WHERE status = 'manual_review')::int AS manual_review,
      AVG(content_length) FILTER (WHERE status = 'completed')::int AS avg_content_length,
      MIN(completed_at) FILTER (WHERE status = 'completed') AS first_completed_at,
      MAX(completed_at) FILTER (WHERE status = 'completed') AS last_completed_at
    FROM pls_capture_jobs
    WHERE source = $1 AND year BETWEEN $2 AND $3
    `,
    args.source,
    args.yearFrom,
    args.yearTo
  );
  const pgRows = await prisma.$queryRawUnsafe(
    `
    SELECT COUNT(DISTINCT legal_judgment_id)::int AS stored
    FROM pls_capture_jobs
    WHERE source = $1 AND year BETWEEN $2 AND $3 AND status = 'completed' AND legal_judgment_id IS NOT NULL
    `,
    args.source,
    args.yearFrom,
    args.yearTo
  );
  const duplicateRows = await prisma.$queryRawUnsafe(
    `
    SELECT COUNT(*)::int AS count
    FROM (
      SELECT judgment.citation
      FROM pls_capture_jobs job
      JOIN legal_judgments judgment ON judgment.id = job.legal_judgment_id
      WHERE job.source = $1
        AND job.year BETWEEN $2 AND $3
        AND job.status = 'completed'
        AND judgment.citation LIKE 'PLS\\_%' ESCAPE '\\'
      GROUP BY judgment.citation
      HAVING COUNT(*) > 1
    ) duplicates
    `,
    args.source,
    args.yearFrom,
    args.yearTo
  );
  const failures = await prisma.$queryRawUnsafe(
    `
    SELECT case_type_id AS "caseTypeId", citation, status, attempts, failure_count AS "failureCount",
           last_http_status AS "lastHttpStatus", last_error AS "lastError"
    FROM pls_capture_jobs
    WHERE source = $1 AND year BETWEEN $2 AND $3 AND status IN ('retry', 'manual_review')
    ORDER BY year, row_no NULLS LAST, case_type_id
    LIMIT 20
    `,
    args.source,
    args.yearFrom,
    args.yearTo
  );
  const summary = summaryRows[0] || {};
  const completed = Number(summary.completed || 0);
  const first = summary.first_completed_at ? new Date(summary.first_completed_at).getTime() : null;
  const last = summary.last_completed_at ? new Date(summary.last_completed_at).getTime() : null;
  const elapsedSeconds = first && last && last > first ? (last - first) / 1000 : null;
  const avgPerMinute = elapsedSeconds ? Number(((completed / elapsedSeconds) * 60).toFixed(2)) : null;
  const remaining = Number(summary.remaining || 0);
  const etaMinutes = avgPerMinute && avgPerMinute > 0 ? Number((remaining / avgPerMinute).toFixed(1)) : null;
  return {
    years: yearLabel(args),
    total: Number(summary.total || 0),
    completed,
    storedInPostgres: Number(pgRows[0]?.stored || 0),
    duplicatePlsCitations: Number(duplicateRows[0]?.count || 0),
    remaining,
    manualReview: Number(summary.manual_review || 0),
    statuses: totals,
    avgContentLength: Number(summary.avg_content_length || 0),
    avgPerMinute,
    etaMinutes,
    failures,
    process: {
      pid: process.pid,
      rssMb: Number((process.memoryUsage().rss / 1024 / 1024).toFixed(1)),
      heapUsedMb: Number((process.memoryUsage().heapUsed / 1024 / 1024).toFixed(1)),
      cpuCount: os.cpus().length,
      loadavg: os.loadavg(),
    },
  };
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json; charset=utf-8",
  });
  res.end(jsonSafe(payload));
}

async function readJsonBody(req, maxBytes = 25 * 1024 * 1024) {
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
  const runnerLabel = `PLS ${yearLabel(args)} PostgreSQL runner`;
  const bakedFetchHeadnotes = args.fetchHeadnotes ? "true" : "false";
  return `
(async () => {
  const API = ${JSON.stringify(base)};
  const YEAR = ${Number(args.yearFrom || args.year)};
  const RUNNER_LABEL = ${JSON.stringify(runnerLabel)};
  const DEFAULT_FETCH_HEADNOTES = ${bakedFetchHeadnotes};
  const DEFAULT_WORKERS = ${Number(args.workers)};
  const scriptUrl = new URL((document.currentScript && document.currentScript.src) || API + "/pls_runner.js", location.href);
  const params = scriptUrl.searchParams;
  const WORKERS = Math.max(1, Math.min(8, Number(params.get("workers") || DEFAULT_WORKERS)));
  const BATCH_SIZE = Math.max(1, Math.min(5, Number(params.get("batch") || 1)));
  const DELAY_MS = Math.max(0, Math.min(1000, Number(params.get("delay") || 120)));
  const FETCH_HEADNOTES = params.has("headnotes") ? params.get("headnotes") !== "0" : DEFAULT_FETCH_HEADNOTES;
  const SESSION_ERROR_LIMIT = Math.max(WORKERS * 2, Number(params.get("session-errors") || 0) || WORKERS * 2);
  const FORCE = params.get("force") === "1";
  const MAX_FETCH_RETRIES = 4;
  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
  const jitter = ms => ms + Math.floor(Math.random() * 250);
  if (window.__codexPlsPgRunnerActive && !FORCE) {
    const existing = document.getElementById("codex-pls-pg-runner-status");
    if (existing) existing.textContent = RUNNER_LABEL + " already active";
    return;
  }
  window.__codexPlsPgRunnerActive = true;
  const state = { leased: 0, stored: 0, failed: 0, active: 0, done: false, stop: false, sessionErrors: 0, sessionPauseUntil: 0 };

  function status(text) {
    let box = document.getElementById("codex-pls-pg-runner-status");
    if (!box) {
      box = document.createElement("div");
      box.id = "codex-pls-pg-runner-status";
      box.style.cssText = "position:fixed;z-index:2147483647;right:12px;bottom:12px;background:#111;color:#fff;padding:10px 12px;border-radius:6px;font:13px Arial;max-width:460px;box-shadow:0 4px 18px rgba(0,0,0,.25)";
      document.body.appendChild(box);
    }
    box.textContent = text;
  }

  async function api(path, options = {}) {
    const res = await fetch(API + path, {
      ...options,
      mode: "cors",
      headers: { "Content-Type": "application/json", ...(options.headers || {}) }
    });
    const text = await res.text();
    let payload = {};
    try { payload = text ? JSON.parse(text) : {}; } catch {}
    if (!res.ok) throw new Error(payload.error || text || "HTTP " + res.status);
    return payload;
  }

  async function apiWithRetry(path, options = {}, label = path) {
    let attempt = 1;
    while (!state.stop) {
      try {
        return await api(path, options);
      } catch (error) {
        const message = error && error.message || String(error);
        status(RUNNER_LABEL + " waiting: " + label + " failed (" + message + ")");
        console.warn("PLS runner API retry", { label, attempt, message });
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

  async function waitForOnline(label) {
    let waited = false;
    while (navigator.onLine === false) {
      waited = true;
      status(RUNNER_LABEL + " paused: internet offline; waiting to resume " + label);
      await sleep(5000);
    }
    if (waited) status(RUNNER_LABEL + " internet restored; resuming");
  }

  async function waitForSessionCooldown(workerId) {
    while (!state.stop && state.sessionPauseUntil && Date.now() < state.sessionPauseUntil) {
      const seconds = Math.max(1, Math.ceil((state.sessionPauseUntil - Date.now()) / 1000));
      status(RUNNER_LABEL + " cooling down after PLS shell/login responses; worker " + workerId + " resumes in " + seconds + "s");
      await sleep(Math.min(5000, seconds * 1000));
    }
  }

  function isNetworkError(error) {
    const message = String(error && error.message || error || "");
    return /network|internet|offline|failed to fetch|load failed|timed out|timeout|abort|ERR_/i.test(message);
  }

  async function fetchCaseVariant(item, headNotes) {
    await waitForOnline(item.caseTypeId);
    const started = Date.now();
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 45000);
    try {
      const body = new URLSearchParams();
      body.set("caseName", item.caseTypeId);
      body.set("headNotes", headNotes ? "1" : "0");
      const response = await fetch("/Login/GetCaseFile", {
        method: "POST",
        credentials: "same-origin",
        signal: controller.signal,
        headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
        body: body.toString()
      });
      const raw = await response.text();
      clearTimeout(timer);
      let html = raw;
      try {
        const parsed = JSON.parse(raw);
        if (typeof parsed === "string") html = parsed;
      } catch {}
      const content = textFromHtml(html);
      if (!response.ok) throw new Error("PLS HTTP " + response.status);
      return { html, content, httpStatus: response.status, elapsedMs: Date.now() - started };
    } catch (error) {
      clearTimeout(timer);
      if (isNetworkError(error)) await waitForOnline(item.caseTypeId);
      throw error;
    }
  }

  async function getCase(item) {
    let lastError = null;
    for (let attempt = 1; attempt <= MAX_FETCH_RETRIES; attempt += 1) {
      try {
        const main = await fetchCaseVariant(item, false);
        let headnoteContent = "";
        if (FETCH_HEADNOTES) {
          try {
            const headnote = await fetchCaseVariant(item, true);
            if (headnote.content && headnote.content.length > 80 && headnote.content !== main.content) {
              headnoteContent = headnote.content;
            }
          } catch (headnoteError) {
            console.warn("PLS runner headnote fetch failed", item.caseTypeId, headnoteError);
          }
        }
        const content = main.content;
        if (content.length < 500) throw new Error("short content length " + content.length);
        return {
          source: "PakistanLawSite PostgreSQL runner",
          source_url: location.origin + "/Login/GetCaseFile",
          court: item.court || "Supreme Court of Pakistan",
          caseTypeId: item.caseTypeId,
          caseName: item.caseTypeId,
          citation: item.citation,
          title: item.title,
          year: item.year || YEAR,
          category: item.category,
          content,
          headnote_content: headnoteContent,
          html_length: main.html.length,
          content_length: content.length,
          http_status: main.httpStatus,
          scraped_at: new Date().toISOString(),
          elapsed_ms: main.elapsedMs
        };
      } catch (error) {
        lastError = error;
        if (isNetworkError(error)) {
          status(RUNNER_LABEL + " temporary fetch/network error on " + item.caseTypeId + "; retrying");
          await waitForOnline(item.caseTypeId);
        }
        if (attempt < MAX_FETCH_RETRIES) await sleep(jitter(Math.min(10000, 600 * 2 ** (attempt - 1))));
      }
    }
    return {
      failed: true,
      caseTypeId: item.caseTypeId,
      citation: item.citation,
      title: item.title,
      year: item.year || YEAR,
      category: item.category,
      court: item.court || "Supreme Court of Pakistan",
      error: String(lastError && lastError.message || lastError || "unknown fetch error"),
      stack: String(lastError && lastError.stack || ""),
      scraped_at: new Date().toISOString()
    };
  }

  async function worker(workerId) {
    const queue = [];
    while (!state.stop) {
      await waitForSessionCooldown(workerId);
      if (!queue.length) {
        const lease = await apiWithRetry("/next?limit=" + BATCH_SIZE, {}, "lease");
        queue.push(...(lease.items || []));
        state.leased += queue.length;
      }
      const item = queue.shift();
      if (!item) break;
      state.active += 1;
      status(RUNNER_LABEL + " | active=" + state.active + " leased=" + state.leased + " stored=" + state.stored + " failed=" + state.failed + " | worker " + workerId + " " + item.caseTypeId);
      const payload = await getCase(item);
      const result = await apiWithRetry("/capture", { method: "POST", body: JSON.stringify(payload) }, "capture " + item.caseTypeId);
      if (result.status === "session_error") {
        state.failed += 1;
        state.sessionErrors += 1;
        const cooldown = Math.min(300000, state.sessionErrors >= SESSION_ERROR_LIMIT ? 60000 : 10000 * state.sessionErrors);
        state.sessionPauseUntil = Math.max(state.sessionPauseUntil || 0, Date.now() + cooldown);
        state.active -= 1;
        status(RUNNER_LABEL + " got PLS shell/login response; job requeued and runner cooling down");
        await waitForSessionCooldown(workerId);
        continue;
      }
      if (result.status === "network_error") {
        state.active -= 1;
        status(RUNNER_LABEL + " temporary fetch/network failure; waiting before next lease");
        await waitForOnline(item.caseTypeId);
        await sleep(jitter(10000));
        continue;
      }
      if (result.ok) {
        state.stored += 1;
        state.sessionErrors = 0;
        state.sessionPauseUntil = 0;
      } else {
        state.failed += 1;
      }
      state.active -= 1;
      if (DELAY_MS > 0) await sleep(DELAY_MS);
    }
  }

  status(RUNNER_LABEL + " starting " + WORKERS + " workers batch=" + BATCH_SIZE + " headnotes=" + (FETCH_HEADNOTES ? "on" : "off"));
  try {
    await Promise.all(Array.from({ length: WORKERS }, (_, index) => worker(index + 1)));
    state.done = true;
    const finalStatus = await api("/status");
    status(RUNNER_LABEL + " DONE | stored=" + state.stored + " failed=" + state.failed + " remaining=" + finalStatus.remaining + " manual_review=" + finalStatus.manualReview);
    console.log("PLS PostgreSQL runner final status", finalStatus);
  } catch (error) {
    status(RUNNER_LABEL + " stopped: " + (error && error.message || error));
    console.error(error);
  } finally {
    window.__codexPlsPgRunnerActive = false;
  }
})();
`;
}

function startServer(prisma, args) {
  const server = http.createServer(async (req, res) => {
    try {
      if (req.method === "OPTIONS") return sendJson(res, 200, { ok: true });
      const url = new URL(req.url || "/", `http://${args.host}:${args.port}`);

      if (req.method === "GET" && url.pathname === "/status") {
        return sendJson(res, 200, await getStatus(prisma, args));
      }

      if (req.method === "GET" && url.pathname === "/next") {
        const limit = Math.max(1, Math.min(10, Number(url.searchParams.get("limit") || 1)));
        const items = await leaseJobs(prisma, args, limit);
        return sendJson(res, 200, { ok: true, items });
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
        const result = await processCapture(prisma, record, args);
        return sendJson(res, 200, result);
      }

      sendJson(res, 404, { ok: false, error: "not found" });
    } catch (error) {
      writeLog(args.log, { level: "error", event: "http_error", error: error.message, stack: error.stack });
      sendJson(res, 500, { ok: false, error: error.message });
    }
  });

  server.listen(args.port, args.host, () => {
    const runner = `http://${args.host}:${args.port}/pls_runner.js?workers=${args.workers}`;
    console.log(`READY ${runner}`);
    writeLog(args.log, { level: "info", event: "server_ready", runner, pid: process.pid });
  });

  process.on("SIGINT", async () => {
    console.log("Stopping PLS PostgreSQL capture server...");
    server.close();
    await prisma.$disconnect();
    process.exit(0);
  });

  return server;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  ensureLogDir(args.log);
  requirePostgresUrl();
  const prisma = new PrismaClient({ log: ["warn", "error"] });

  try {
    await ensureSchema(prisma, args.log);
    await seedWorklist(prisma, args);

    if (args.setup) {
      writeLog(args.log, { level: "info", event: "setup_complete" });
    }

    if (args.importJsonl) {
      const report = await importJsonl(prisma, args);
      console.log(jsonSafe({ import: report }));
    }

    if (args.status) {
      console.log(jsonSafe(await getStatus(prisma, args)));
    }

    if (args.serve) {
      startServer(prisma, args);
      return;
    }
  } catch (error) {
    writeLog(args.log, { level: "error", event: "fatal", error: error.message, stack: error.stack });
    throw error;
  }

  await prisma.$disconnect();
}

export { normalizeCaptureRecord, stableCitation, citationReporter, courtLevel };

// Only run main() when executed directly (not when imported as a module).
const __isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (__isDirectRun) {
  main().catch((error) => {
    console.error(error.stack || error.message);
    process.exit(1);
  });
}
