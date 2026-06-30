/**
 * Migrate data/judgments.db (SQLite) -> Postgres.
 *
 * Safety:
 * - Opens SQLite read-only; the local judgments.db is never modified.
 * - Creates separate Postgres tables (legal_judgments, legal_judgment_tags).
 * - Uses INSERT ... ON CONFLICT DO NOTHING, so reruns resume safely.
 * - Verifies source and target row counts at the end.
 *
 * Usage:
 *   node --experimental-sqlite scripts/pg-migrate/migrate-judgments-to-postgres.mjs --dry-run
 *   node --experimental-sqlite scripts/pg-migrate/migrate-judgments-to-postgres.mjs --no-search-index
 *   node --experimental-sqlite scripts/pg-migrate/migrate-judgments-to-postgres.mjs --search-index-only
 *
 * Options:
 *   --skip-tags          Import judgments only.
 *   --no-search-index    Skip the heavy Postgres full-text GIN index.
 *   --search-index-only  Create/recreate search indexes without importing rows.
 */
import fs from "node:fs";
import { DatabaseSync } from "node:sqlite";
import { PrismaClient } from "@prisma/client";

const SQLITE_PATH = "data/judgments.db";
const JUDGMENT_BATCH = 100;
const TAG_BATCH = 5000;

const dryRun = process.argv.includes("--dry-run");
const skipTags = process.argv.includes("--skip-tags");
const skipSearchIndex = process.argv.includes("--no-search-index");
const searchIndexOnly = process.argv.includes("--search-index-only");

const JUDGMENT_COLUMNS = [
  "id",
  "citation",
  "court",
  "year",
  "content",
  "processed",
  "created_at",
  "title",
  "real_citation",
  "law_category",
  "case_type",
  "court_level",
  "province",
  "reported_status",
  "citation_reporter",
  "authority_score",
  "template_usefulness_score",
  "citation_reliability_score",
  "ocr_quality_score",
  "tagging_confidence",
  "tagged_at",
];

const TAG_COLUMNS = [
  "id",
  "judgment_id",
  "tag_type",
  "tag_value",
  "confidence",
  "source",
  "evidence_text",
  "created_at",
];

function loadEnvFile(path) {
  if (!fs.existsSync(path)) return;
  const lines = fs.readFileSync(path, "utf8").split(/\r?\n/);
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
  loadEnvFile(".env.local");
  loadEnvFile(".env");
  const url = process.env.DATABASE_URL || "";
  if (!/^postgres(?:ql)?:\/\//i.test(url)) {
    throw new Error(
      "DATABASE_URL is not a Postgres URL. Set Railway Postgres DATABASE_URL in .env.local/.env or the shell."
    );
  }
}

function quoteIdent(name) {
  return `"${name.replace(/"/g, '""')}"`;
}

function normalize(value) {
  return value === undefined ? null : value;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function withRetry(label, fn, attempts = 6) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      const message = error?.message || String(error);
      if (attempt >= attempts) break;
      const waitMs = Math.min(60_000, 5000 * attempt);
      console.log(`${label} failed (attempt ${attempt}/${attempts}): ${message}`);
      console.log(`Retrying in ${Math.round(waitMs / 1000)}s...`);
      await sleep(waitMs);
    }
  }
  throw lastError;
}

function openSqlite() {
  if (!fs.existsSync(SQLITE_PATH)) {
    throw new Error(`Missing ${SQLITE_PATH}`);
  }

  const sqlite = new DatabaseSync(SQLITE_PATH, { readOnly: true });
  const integrity = sqlite.prepare("PRAGMA integrity_check").get()?.integrity_check;
  if (integrity !== "ok") {
    sqlite.close();
    throw new Error(`SQLite integrity_check failed: ${integrity}`);
  }
  return sqlite;
}

async function createSchema(prisma) {
  await prisma.$executeRawUnsafe(`
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
  `);

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS legal_judgment_tags (
      id INTEGER PRIMARY KEY,
      judgment_id INTEGER NOT NULL REFERENCES legal_judgments(id) ON DELETE CASCADE,
      tag_type TEXT NOT NULL,
      tag_value TEXT NOT NULL,
      confidence INTEGER NOT NULL DEFAULT 70,
      source TEXT NOT NULL DEFAULT 'rule',
      evidence_text TEXT,
      created_at BIGINT NOT NULL
    )
  `);

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS legal_migration_meta (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `);
}

async function createLightIndexes(prisma) {
  console.log("Creating light judgment indexes...");
  await prisma.$executeRawUnsafe(
    `CREATE INDEX IF NOT EXISTS legal_judgments_citation_idx ON legal_judgments (citation)`
  );
  await prisma.$executeRawUnsafe(
    `CREATE INDEX IF NOT EXISTS legal_judgments_real_citation_idx ON legal_judgments (real_citation)`
  );
  await prisma.$executeRawUnsafe(
    `CREATE INDEX IF NOT EXISTS legal_judgments_court_year_idx ON legal_judgments (court, year)`
  );
  await prisma.$executeRawUnsafe(
    `CREATE INDEX IF NOT EXISTS legal_judgments_law_category_idx ON legal_judgments (law_category)`
  );
  await prisma.$executeRawUnsafe(
    `CREATE INDEX IF NOT EXISTS legal_judgments_case_type_idx ON legal_judgments (case_type)`
  );
  await prisma.$executeRawUnsafe(
    `CREATE INDEX IF NOT EXISTS legal_judgment_tags_judgment_idx ON legal_judgment_tags (judgment_id)`
  );
  await prisma.$executeRawUnsafe(
    `CREATE INDEX IF NOT EXISTS legal_judgment_tags_lookup_idx ON legal_judgment_tags (tag_type, tag_value)`
  );
}

async function createSearchIndex(prisma) {
  console.log("Creating heavy judgment full-text index...");
  await prisma.$executeRawUnsafe(`
    CREATE INDEX IF NOT EXISTS legal_judgments_search_idx
    ON legal_judgments
    USING GIN (
      to_tsvector(
        'simple',
        COALESCE(citation, '') || ' ' ||
        COALESCE(real_citation, '') || ' ' ||
        COALESCE(title, '') || ' ' ||
        COALESCE(content, '')
      )
    )
  `);
}

async function insertBatch(prisma, table, columns, rows) {
  if (rows.length === 0) return 0;

  const values = [];
  let param = 1;
  const tuples = rows.map((row) => {
    const placeholders = columns.map((col) => {
      values.push(normalize(row[col]));
      return `$${param++}`;
    });
    return `(${placeholders.join(", ")})`;
  });

  const sql = `
    INSERT INTO ${quoteIdent(table)} (${columns.map(quoteIdent).join(", ")})
    VALUES ${tuples.join(", ")}
    ON CONFLICT (id) DO NOTHING
  `;

  await withRetry(`insert ${table}`, () => prisma.$executeRawUnsafe(sql, ...values));
  return rows.length;
}

async function countPg(prisma, table) {
  const rows = await withRetry(`count ${table}`, () =>
    prisma.$queryRawUnsafe(`SELECT COUNT(*)::bigint AS count FROM ${quoteIdent(table)}`)
  );
  return Number(rows[0]?.count || 0);
}

async function maxPgId(prisma, table) {
  const rows = await withRetry(`max id ${table}`, () =>
    prisma.$queryRawUnsafe(`SELECT COALESCE(MAX(id), 0)::bigint AS max_id FROM ${quoteIdent(table)}`)
  );
  return Number(rows[0]?.max_id || 0);
}

async function setMeta(prisma, key, value) {
  await prisma.$executeRawUnsafe(
    `
      INSERT INTO legal_migration_meta (key, value, updated_at)
      VALUES ($1, $2, now())
      ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now()
    `,
    key,
    String(value)
  );
}

async function importByIdCursor({
  prisma,
  sqlite,
  sourceTable,
  targetTable,
  columns,
  batchSize,
  logEvery,
}) {
  const total = sqlite.prepare(`SELECT COUNT(*) AS count FROM ${sourceTable}`).get().count;
  let lastId = await maxPgId(prisma, targetTable);
  let seen = lastId > 0
    ? sqlite.prepare(`SELECT COUNT(*) AS count FROM ${sourceTable} WHERE id <= ?`).get(lastId).count
    : 0;

  if (lastId > 0) {
    const pgCount = await countPg(prisma, targetTable);
    console.log(
      `${sourceTable.padEnd(14)} resume at source_seen=${seen} / ${total} ` +
        `(postgres=${pgCount}, last_id=${lastId})`
    );
  }

  while (true) {
    const rows = sqlite
      .prepare(
        `SELECT ${columns.join(", ")}
         FROM ${sourceTable}
         WHERE id > ?
         ORDER BY id
         LIMIT ?`
      )
      .all(lastId, batchSize);

    if (rows.length === 0) break;

    await insertBatch(prisma, targetTable, columns, rows);
    lastId = rows[rows.length - 1].id;
    seen += rows.length;

    if (seen === total || seen % logEvery === 0) {
      const pgCount = await countPg(prisma, targetTable);
      console.log(
        `${sourceTable.padEnd(14)} ${String(seen).padStart(8)} / ${total} ` +
          `(postgres=${pgCount}, last_id=${lastId})`
      );
    }
  }

  return total;
}

async function main() {
  const sqlite = searchIndexOnly ? null : openSqlite();
  const sourceCounts = sqlite
    ? {
        judgments: sqlite.prepare("SELECT COUNT(*) AS count FROM judgments").get().count,
        tags: sqlite.prepare("SELECT COUNT(*) AS count FROM judgment_tags").get().count,
      }
    : { judgments: 0, tags: 0 };

  if (sqlite) {
    console.log("SQLite source verified:");
    console.log(`judgments=${sourceCounts.judgments} judgment_tags=${sourceCounts.tags}`);
  }

  if (dryRun) {
    sqlite?.close();
    console.log("Dry run complete. No Postgres writes were attempted.");
    return;
  }

  requirePostgresUrl();
  const prisma = new PrismaClient();

  try {
    await createSchema(prisma);

    if (!searchIndexOnly && sqlite) {
      await setMeta(prisma, "judgments_source_count", sourceCounts.judgments);
      await setMeta(prisma, "judgment_tags_source_count", sourceCounts.tags);

      await importByIdCursor({
        prisma,
        sqlite,
        sourceTable: "judgments",
        targetTable: "legal_judgments",
        columns: JUDGMENT_COLUMNS,
        batchSize: JUDGMENT_BATCH,
        logEvery: 5000,
      });

      if (!skipTags) {
        await importByIdCursor({
          prisma,
          sqlite,
          sourceTable: "judgment_tags",
          targetTable: "legal_judgment_tags",
          columns: TAG_COLUMNS,
          batchSize: TAG_BATCH,
          logEvery: 50000,
        });
      }
    }

    await createLightIndexes(prisma);

    const targetCounts = {
      judgments: await countPg(prisma, "legal_judgments"),
      tags: await countPg(prisma, "legal_judgment_tags"),
    };

    console.log("\n=== count verification ===");
    if (sqlite) {
      console.log(
        `judgments     sqlite=${sourceCounts.judgments} postgres=${targetCounts.judgments} ${
          sourceCounts.judgments === targetCounts.judgments ? "OK" : "CHECK"
        }`
      );
      if (!skipTags) {
        console.log(
          `judgment_tags sqlite=${sourceCounts.tags} postgres=${targetCounts.tags} ${
            sourceCounts.tags === targetCounts.tags ? "OK" : "CHECK"
          }`
        );
      }
    } else {
      console.log(`judgments=${targetCounts.judgments} judgment_tags=${targetCounts.tags}`);
    }

    if (!skipSearchIndex) {
      await createSearchIndex(prisma);
    }

    const ok =
      !sqlite ||
      (sourceCounts.judgments === targetCounts.judgments &&
        (skipTags || sourceCounts.tags === targetCounts.tags));
    await setMeta(prisma, "judgments_last_import_ok", ok ? "1" : "0");

    if (!ok) {
      process.exitCode = 1;
      console.log("Import finished, but counts differ. Re-run the script before switching the app.");
    } else {
      console.log("Judgment import finished safely.");
    }
  } finally {
    sqlite?.close();
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error("JUDGMENT MIGRATION ERROR:", error);
  process.exitCode = 1;
});
