/**
 * Sync newly-imported judgments from the local SQLite corpus (data/judgments.db)
 * into the live Railway Postgres so they become searchable in the deployed app.
 *
 * Safe + idempotent:
 *   - Only INSERTs; never updates or deletes existing rows.
 *   - IDs are preserved 1:1 (the original migration did the same), and every
 *     insert uses ON CONFLICT (id) DO NOTHING, so rows already in Postgres are
 *     skipped. Re-running is harmless. It can run WHILE the importer is still
 *     writing — rows added afterwards are simply caught on the next run.
 *   - Reads the SQLite file read-only, so it never disturbs the import.
 *
 * Also carries over each new judgment's classification tags (judgment_tags ->
 * legal_judgment_tags).
 *
 *   node scripts/pg-migrate/sync-new-judgments-to-postgres.mjs
 */
import fs from "node:fs";
import { DatabaseSync } from "node:sqlite";
import { PrismaClient } from "@prisma/client";

const SQLITE_PATH = "data/judgments.db";
const JUDGMENT_BATCH = 50;   // rows carry full content, keep the statement small
const TAG_BATCH = 200;

const JUDGMENT_COLUMNS = [
  "id", "citation", "court", "year", "content", "processed", "created_at",
  "title", "real_citation", "law_category", "case_type", "court_level",
  "province", "reported_status", "citation_reporter", "authority_score",
  "template_usefulness_score", "citation_reliability_score",
  "ocr_quality_score", "tagging_confidence", "tagged_at",
];
const TAG_COLUMNS = [
  "id", "judgment_id", "tag_type", "tag_value", "confidence", "source",
  "evidence_text", "created_at",
];

function loadEnvFile(path) {
  if (!fs.existsSync(path)) return;
  for (const line of fs.readFileSync(path, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const match = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!match || process.env[match[1]] !== undefined) continue;
    let value = match[2].trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    process.env[match[1]] = value;
  }
}

function requirePostgresUrl() {
  loadEnvFile(".env.local");
  loadEnvFile(".env");
  const url = process.env.DATABASE_URL || "";
  if (!/^postgres(?:ql)?:\/\//i.test(url)) throw new Error("DATABASE_URL is not a Postgres URL.");
}

// The Railway public proxy drops connections intermittently — retry transient errors.
async function withRetry(fn, tries = 8, delay = 1500) {
  for (let i = 0; i < tries; i++) {
    try {
      return await fn();
    } catch (e) {
      const m = String(e?.message || e).toLowerCase();
      const transient = m.includes("reach database") || m.includes("connection") ||
        m.includes("timeout") || m.includes("econnreset") || m.includes("p1001") ||
        m.includes("closed") || m.includes("terminating");
      if (!transient || i === tries - 1) throw e;
      await new Promise((r) => setTimeout(r, delay * (i + 1)));
    }
  }
}

const normalize = (v) => (v === undefined ? null : v);

async function insertBatch(prisma, table, columns, rows) {
  if (!rows.length) return;
  const values = [];
  let param = 1;
  const tuples = rows.map((row) => {
    const placeholders = columns.map((col) => {
      values.push(normalize(row[col]));
      return `$${param++}`;
    });
    return `(${placeholders.join(", ")})`;
  });
  await prisma.$executeRawUnsafe(
    `INSERT INTO "${table}" (${columns.map((c) => `"${c}"`).join(", ")})
     VALUES ${tuples.join(", ")}
     ON CONFLICT (id) DO NOTHING`,
    ...values
  );
}

async function main() {
  requirePostgresUrl();
  if (!fs.existsSync(SQLITE_PATH)) throw new Error(`Missing ${SQLITE_PATH}`);

  const sqlite = new DatabaseSync(SQLITE_PATH, { readOnly: true });
  const prisma = new PrismaClient();
  try {
    const localCount = sqlite.prepare("SELECT COUNT(*) AS n FROM judgments").get().n;
    const pgBefore = (await withRetry(() => prisma.$queryRawUnsafe(
      "SELECT COUNT(*)::int AS c, COALESCE(MAX(id),0)::int AS m FROM legal_judgments")))[0];
    console.log(`Local judgments: ${localCount}`);
    console.log(`Postgres before: ${pgBefore.c} (max id ${pgBefore.m})`);

    // Load existing Postgres ids in id-range chunks (proxy-friendly).
    console.log("Loading existing Postgres ids...");
    const pgIds = new Set();
    for (let lo = 0; lo <= pgBefore.m; lo += 100000) {
      const rows = await withRetry(() => prisma.$queryRawUnsafe(
        "SELECT id FROM legal_judgments WHERE id >= $1 AND id < $2", lo, lo + 100000));
      for (const r of rows) pgIds.add(Number(r.id));
    }
    console.log(`  loaded ${pgIds.size} ids`);

    const localIds = sqlite.prepare("SELECT id FROM judgments ORDER BY id").all().map((r) => Number(r.id));
    const missing = localIds.filter((id) => !pgIds.has(id));
    console.log(`New judgments to insert: ${missing.length}`);

    // ── Insert new judgments ────────────────────────────────────────────────
    let done = 0;
    for (let off = 0; off < missing.length; off += JUDGMENT_BATCH) {
      const ids = missing.slice(off, off + JUDGMENT_BATCH);
      const rows = sqlite.prepare(
        `SELECT ${JUDGMENT_COLUMNS.join(", ")} FROM judgments WHERE id IN (${ids.map(() => "?").join(",")}) ORDER BY id`
      ).all(...ids);
      await withRetry(() => insertBatch(prisma, "legal_judgments", JUDGMENT_COLUMNS, rows));
      done += ids.length;
      if (done % 500 === 0 || done === missing.length) console.log(`  judgments ${done} / ${missing.length}`);
    }

    // ── Insert their classification tags ────────────────────────────────────
    let hasTags = false;
    try { sqlite.prepare("SELECT 1 FROM judgment_tags LIMIT 1").get(); hasTags = true; } catch { hasTags = false; }
    if (hasTags && missing.length) {
      console.log("Inserting classification tags for new judgments...");
      let tagDone = 0, tagTotal = 0;
      for (let off = 0; off < missing.length; off += TAG_BATCH) {
        const ids = missing.slice(off, off + TAG_BATCH);
        const rows = sqlite.prepare(
          `SELECT ${TAG_COLUMNS.join(", ")} FROM judgment_tags WHERE judgment_id IN (${ids.map(() => "?").join(",")})`
        ).all(...ids);
        if (rows.length) {
          for (let t = 0; t < rows.length; t += TAG_BATCH) {
            await withRetry(() => insertBatch(prisma, "legal_judgment_tags", TAG_COLUMNS, rows.slice(t, t + TAG_BATCH)));
          }
          tagTotal += rows.length;
        }
        tagDone += ids.length;
        if (tagDone % 2000 === 0 || tagDone >= missing.length) console.log(`  tag scan ${Math.min(tagDone, missing.length)} / ${missing.length} (inserted ~${tagTotal})`);
      }
    }

    const pgAfter = (await withRetry(() => prisma.$queryRawUnsafe(
      "SELECT COUNT(*)::int AS c, COALESCE(MAX(id),0)::int AS m FROM legal_judgments")))[0];
    console.log(`\nDone. Postgres after: ${pgAfter.c} (max id ${pgAfter.m})  [+${pgAfter.c - pgBefore.c}]`);
  } finally {
    sqlite.close();
    await prisma.$disconnect();
  }
}

main().catch((e) => { console.error(e); process.exitCode = 1; });
