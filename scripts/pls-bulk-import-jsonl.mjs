/**
 * FAST bulk importer: PLS fast-capture JSONL → Postgres legal_judgments.
 *
 * Why this exists: the standard importer (pls-pg-capture.mjs --import-jsonl)
 * does ~5 DB round-trips per judgment (job ledger + dedup lookups + insert +
 * derived signals + event), which over the flaky Railway proxy is ~1 row/sec
 * ⇒ 7-8 hours for 24K judgments. This script writes ONLY legal_judgments
 * (the table the app/search reads) in batches of 250 per INSERT, finishing
 * the same data in minutes.
 *
 * Correctness: it reuses the EXACT normalization (normalizeCaptureRecord) and
 * dedup key (citation = stableCitation(caseTypeId, "PLS_SCP")) from the slow
 * importer, so mixing with slow-imported rows and re-running is safe — no
 * duplicates. It skips the scraper bookkeeping (pls_capture_jobs ledger,
 * derived signals, audit events) which the app does not need.
 *
 * Usage:
 *   node scripts/pls-bulk-import-jsonl.mjs ../data/pls_1950_1960_fast_capture.jsonl --dry-run
 *   node scripts/pls-bulk-import-jsonl.mjs ../data/pls_1950_1960_fast_capture.jsonl
 *   node scripts/pls-bulk-import-jsonl.mjs ../data/pls_1981_1990_fast_capture.jsonl --prefix PLS_ALL_1981_1990
 *   node scripts/pls-bulk-import-jsonl.mjs ../data/pls_1950_1960_fast_capture.jsonl ../data/pls_1961_1970_fast_capture.jsonl ../data/pls_1971_1980_fast_capture.jsonl
 */
import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";
import { PrismaClient } from "@prisma/client";
import {
  normalizeCaptureRecord,
  stableCitation,
  citationReporter,
  courtLevel,
} from "./pls-pg-capture.mjs";

const BATCH = 250;

function parseCli(argv) {
  const options = { files: [], prefix: "PLS_SCP", dryRun: false, tailState: null };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--dry-run") {
      options.dryRun = true;
    } else if (arg === "--prefix") {
      i += 1;
      if (i >= argv.length) throw new Error("Missing value after --prefix");
      options.prefix = argv[i];
    } else if (arg.startsWith("--prefix=")) {
      options.prefix = arg.slice("--prefix=".length);
    } else if (arg === "--tail-state") {
      i += 1;
      if (i >= argv.length) throw new Error("Missing value after --tail-state");
      options.tailState = argv[i];
    } else if (arg.startsWith("--tail-state=")) {
      options.tailState = arg.slice("--tail-state=".length);
    } else if (arg.startsWith("--")) {
      throw new Error(`Unknown argument: ${arg}`);
    } else {
      options.files.push(arg);
    }
  }
  options.prefix = String(options.prefix || "PLS_SCP").replace(/[^A-Za-z0-9_]+/g, "_").replace(/^_+|_+$/g, "");
  if (!options.prefix) options.prefix = "PLS_SCP";
  return options;
}

const CLI = parseCli(process.argv.slice(2));
const PREFIX = CLI.prefix;
const FILES = CLI.files;
const DRY_RUN = CLI.dryRun;
const TAIL_STATE = CLI.tailState;

const COLS =
  "id, citation, court, year, content, processed, created_at, title, real_citation, " +
  "law_category, case_type, court_level, province, reported_status, citation_reporter, tagged_at";

function ensurePostgresUrl() {
  if (!/^postgres(?:ql)?:\/\//i.test(process.env.DATABASE_URL || "")) {
    for (const f of [".env.local", ".env"]) {
      if (!fs.existsSync(f)) continue;
      for (const line of fs.readFileSync(f, "utf8").split(/\r?\n/)) {
        const m = line.match(/^DATABASE_URL=(.*)$/);
        if (m) {
          process.env.DATABASE_URL = m[1].replace(/^["']|["']$/g, "").trim();
          break;
        }
      }
      if (/^postgres(?:ql)?:\/\//i.test(process.env.DATABASE_URL || "")) break;
    }
  }
  if (!/^postgres(?:ql)?:\/\//i.test(process.env.DATABASE_URL || "")) {
    throw new Error("DATABASE_URL is not a Postgres URL (checked env, .env.local, .env)");
  }
  const parsed = new URL(process.env.DATABASE_URL);
  if (!parsed.searchParams.has("sslmode")) parsed.searchParams.set("sslmode", "disable");
  parsed.searchParams.set("pool_timeout", String(Math.max(60, Number(parsed.searchParams.get("pool_timeout") || 0) || 0)));
  if (!parsed.searchParams.has("connection_limit")) parsed.searchParams.set("connection_limit", "4");
  process.env.DATABASE_URL = parsed.toString();
}

async function withRetry(label, fn, attempts = 6) {
  let lastErr;
  for (let i = 0; i < attempts; i += 1) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      const wait = 1500 * (i + 1);
      console.log(`  [retry] ${label} failed (${err.message?.slice(0, 80)}); waiting ${wait}ms`);
      await new Promise((r) => setTimeout(r, wait));
    }
  }
  throw lastErr;
}

// Read + normalize a JSONL file. Dedup within file by caseTypeId, keep the best
// content (same rule as the slow importer's bestByCase).
function readTailState(filePath) {
  if (!filePath || !fs.existsSync(filePath)) return { version: 1, files: {} };
  try {
    const parsed = JSON.parse(fs.readFileSync(filePath, "utf8"));
    if (parsed && typeof parsed === "object" && parsed.files && typeof parsed.files === "object") return parsed;
  } catch {
    // A corrupt tail checkpoint should not block import; the existing DB dedup remains authoritative.
  }
  return { version: 1, files: {} };
}

function writeTailState(filePath, state) {
  if (!filePath) return;
  fs.mkdirSync(path.dirname(path.resolve(filePath)), { recursive: true });
  const tmp = `${filePath}.${process.pid}.${Date.now()}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(state, null, 2), "utf8");
  fs.renameSync(tmp, filePath);
}

async function readNormalized(filePath, startOffset = 0) {
  const bestByCase = new Map();
  let lines = 0;
  let badJson = 0;
  let invalid = 0;
  let offset = Math.max(0, Number(startOffset || 0));
  const stat = fs.existsSync(filePath) ? fs.statSync(filePath) : null;
  if (!stat) return { entries: [], lines, badJson, invalid, startOffset: 0, endOffset: 0, fileSize: 0 };
  if (offset > stat.size) offset = 0;
  let processedBytes = 0;
  const rl = readline.createInterface({
    input: fs.createReadStream(filePath, { encoding: "utf8", start: offset }),
    crlfDelay: Infinity,
  });
  for await (const line of rl) {
    processedBytes += Buffer.byteLength(line, "utf8") + 1;
    if (!line.trim()) continue;
    lines += 1;
    let record;
    try {
      record = JSON.parse(line);
    } catch {
      badJson += 1;
      continue;
    }
    const n = normalizeCaptureRecord(record, {});
    if (!n.caseTypeId) {
      invalid += 1;
      continue;
    }
    const prev = bestByCase.get(n.caseTypeId);
    const ok = n.validation.ok ? 1 : 0;
    const prevOk = prev ? (prev.validation.ok ? 1 : 0) : -1;
    if (!prev || ok > prevOk || (ok === prevOk && n.contentLength > prev.contentLength)) {
      bestByCase.set(n.caseTypeId, n);
    }
  }
  return {
    entries: Array.from(bestByCase.values()),
    lines,
    badJson,
    invalid,
    startOffset: offset,
    endOffset: Math.min(stat.size, offset + processedBytes),
    fileSize: stat.size,
  };
}

// Build the 16-column row array, matching the slow importer's INSERT exactly.
function rowFromNormalized(n, id, nowMs) {
  const finalCitation = stableCitation(n.caseTypeId, PREFIX);
  const reporter = citationReporter(n.citation, n.category);
  const level = courtLevel(n.court);
  const province = level === "Supreme Court" || level === "Federal Shariat Court" ? "Federal" : null;
  return [
    id, // id
    finalCitation, // citation (dedup key)
    n.court, // court
    n.year, // year
    n.content, // content
    1, // processed
    nowMs, // created_at
    n.title || null, // title
    n.citation || null, // real_citation
    "case_law", // law_category
    n.category || reporter || null, // case_type
    level, // court_level
    province, // province
    n.citation ? "reported" : null, // reported_status
    reporter, // citation_reporter
    nowMs, // tagged_at
  ];
}

async function main() {
  ensurePostgresUrl();
  if (!FILES.length) {
    throw new Error("Usage: node scripts/pls-bulk-import-jsonl.mjs <file.jsonl> [...] [--dry-run]");
  }
  const prisma = new PrismaClient({ log: ["error"] });
  console.log(`Using citation prefix: ${PREFIX}`);
  if (TAIL_STATE) console.log(`Using incremental tail state: ${TAIL_STATE}`);
  // global dedup set: existing in DB + anything we insert this run
  const already = new Set();
  const tailState = readTailState(TAIL_STATE);

  for (const filePath of FILES) {
    const fileKey = fs.existsSync(filePath) ? fs.realpathSync(filePath) : filePath;
    const previousTail = tailState.files[fileKey] || {};
    const startOffset = TAIL_STATE ? Number(previousTail.offset || 0) : 0;
    console.log(`\n>>> ${filePath}`);
    const { entries, lines, badJson, invalid, endOffset, fileSize } = await readNormalized(filePath, startOffset);
    if (TAIL_STATE) console.log(`  tail: from=${startOffset} to=${endOffset} size=${fileSize}`);
    console.log(`  parsed: lines=${lines} unique=${entries.length} badJson=${badJson} invalid=${invalid}`);
    if (!entries.length) {
      if (TAIL_STATE && !DRY_RUN) {
        tailState.files[fileKey] = { offset: endOffset, fileSize, updatedAt: new Date().toISOString(), prefix: PREFIX };
        writeTailState(TAIL_STATE, tailState);
      }
      continue;
    }

    if (DRY_RUN) {
      console.log("  --dry-run: no DB writes");
      continue;
    }

    // 1) dedup against what's already in legal_judgments (chunked)
    const citations = entries.map((n) => stableCitation(n.caseTypeId, PREFIX));
    for (let i = 0; i < citations.length; i += 1000) {
      const chunk = citations.slice(i, i + 1000);
      const rows = await withRetry("existing-check", () =>
        prisma.$queryRawUnsafe(
          `SELECT citation FROM legal_judgments WHERE citation = ANY($1::text[])`,
          chunk
        )
      );
      for (const r of rows) already.add(r.citation);
    }

    // 2) filter out existing + already-inserted-this-run
    const toInsert = entries.filter((n) => {
      const c = stableCitation(n.caseTypeId, PREFIX);
      if (already.has(c)) return false;
      already.add(c);
      return true;
    });
    console.log(`  to insert: ${toInsert.length} (skipped ${entries.length - toInsert.length} existing/dup)`);

    // 3) batch insert
    const nowMs = Date.now();
    let inserted = 0;
    for (let i = 0; i < toInsert.length; i += BATCH) {
      const batch = toInsert.slice(i, i + BATCH);
      const idRows = await withRetry("nextval", () =>
        prisma.$queryRawUnsafe(
          `SELECT nextval('legal_judgments_pls_id_seq')::int AS id FROM generate_series(1, $1::int)`,
          batch.length
        )
      );
      const rows = batch.map((n, j) => rowFromNormalized(n, Number(idRows[j].id), nowMs));
      const placeholders = [];
      const params = [];
      let p = 1;
      for (const r of rows) {
        const ph = [];
        for (const v of r) {
          ph.push(`$${p++}`);
          params.push(v);
        }
        placeholders.push(`(${ph.join(",")})`);
      }
      await withRetry("insert-batch", () =>
        prisma.$executeRawUnsafe(
          `INSERT INTO legal_judgments (${COLS}) VALUES ${placeholders.join(",")} ON CONFLICT (id) DO NOTHING`,
          ...params
        )
      );
      inserted += batch.length;
      console.log(`  inserted ${inserted}/${toInsert.length}`);
    }
    console.log(`<<< ${filePath}: done, inserted ${inserted}`);
    if (TAIL_STATE) {
      tailState.files[fileKey] = { offset: endOffset, fileSize, updatedAt: new Date().toISOString(), prefix: PREFIX };
      writeTailState(TAIL_STATE, tailState);
    }
  }

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err.stack || err.message);
  process.exit(1);
});
