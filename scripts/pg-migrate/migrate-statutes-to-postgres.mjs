/**
 * Migrate data/statutes.db (SQLite) -> Postgres.
 *
 * Safety:
 * - Opens SQLite read-only; the local statutes.db is never modified.
 * - Creates separate Postgres tables (legal_acts, legal_sections).
 * - Uses INSERT ... ON CONFLICT DO NOTHING, so reruns resume safely.
 * - Verifies source and target row counts at the end.
 *
 * Usage:
 *   node --experimental-sqlite scripts/pg-migrate/migrate-statutes-to-postgres.mjs --dry-run
 *   node --experimental-sqlite scripts/pg-migrate/migrate-statutes-to-postgres.mjs
 *
 * Optional:
 *   --no-indexes   Skip Postgres full-text index creation for a faster first import.
 */
import fs from "node:fs";
import { DatabaseSync } from "node:sqlite";
import { PrismaClient } from "@prisma/client";

const SQLITE_PATH = "data/statutes.db";
const ACT_BATCH = 50;
const SECTION_BATCH = 1000;

const dryRun = process.argv.includes("--dry-run");
const skipIndexes = process.argv.includes("--no-indexes");

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

async function createSchema(prisma) {
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS legal_acts (
      id INTEGER PRIMARY KEY,
      act_name TEXT NOT NULL,
      act_year INTEGER,
      href TEXT,
      pdf_url TEXT,
      full_text TEXT,
      section_count INTEGER DEFAULT 0,
      status TEXT DEFAULT 'in-force',
      scraped_at TEXT,
      province TEXT DEFAULT 'Federal',
      doc_type TEXT DEFAULT 'act'
    )
  `);

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS legal_sections (
      id INTEGER PRIMARY KEY,
      act_id INTEGER NOT NULL REFERENCES legal_acts(id) ON DELETE CASCADE,
      section_no TEXT,
      title TEXT,
      body TEXT
    )
  `);

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS legal_migration_meta (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `);

  await prisma.$executeRawUnsafe(
    `CREATE INDEX IF NOT EXISTS legal_sections_act_id_idx ON legal_sections (act_id)`
  );
  await prisma.$executeRawUnsafe(
    `CREATE INDEX IF NOT EXISTS legal_sections_section_no_idx ON legal_sections (section_no)`
  );
  await prisma.$executeRawUnsafe(
    `CREATE INDEX IF NOT EXISTS legal_acts_province_idx ON legal_acts (province)`
  );
  await prisma.$executeRawUnsafe(
    `CREATE INDEX IF NOT EXISTS legal_acts_doc_type_idx ON legal_acts (doc_type)`
  );
}

async function createSearchIndexes(prisma) {
  console.log("Creating Postgres full-text indexes...");
  await prisma.$executeRawUnsafe(`
    CREATE INDEX IF NOT EXISTS legal_sections_search_idx
    ON legal_sections
    USING GIN (
      to_tsvector(
        'simple',
        coalesce(section_no, '') || ' ' || coalesce(title, '') || ' ' || coalesce(body, '')
      )
    )
  `);

  await prisma.$executeRawUnsafe(`
    CREATE INDEX IF NOT EXISTS legal_acts_search_idx
    ON legal_acts
    USING GIN (
      to_tsvector(
        'simple',
        coalesce(act_name, '') || ' ' || coalesce(full_text, '')
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

  await prisma.$executeRawUnsafe(sql, ...values);
  return rows.length;
}

async function countPg(prisma, table) {
  const rows = await prisma.$queryRawUnsafe(
    `SELECT COUNT(*)::bigint AS count FROM ${quoteIdent(table)}`
  );
  return Number(rows[0]?.count || 0);
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

async function importTable({ prisma, sqlite, sourceTable, targetTable, columns, batchSize }) {
  const total = sqlite.prepare(`SELECT COUNT(*) AS count FROM ${sourceTable}`).get().count;
  let offset = 0;
  let seen = 0;

  while (offset < total) {
    const rows = sqlite
      .prepare(
        `SELECT ${columns.join(", ")} FROM ${sourceTable} ORDER BY id LIMIT ? OFFSET ?`
      )
      .all(batchSize, offset);

    if (rows.length === 0) break;
    await insertBatch(prisma, targetTable, columns, rows);
    seen += rows.length;
    offset += rows.length;

    const every = sourceTable === "acts" ? 500 : 5000;
    if (seen === total || seen % every === 0) {
      console.log(`${sourceTable.padEnd(8)} ${String(seen).padStart(7)} / ${total}`);
    }
  }

  return total;
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

async function main() {
  const sqlite = openSqlite();
  const sourceCounts = {
    acts: sqlite.prepare("SELECT COUNT(*) AS count FROM acts").get().count,
    sections: sqlite.prepare("SELECT COUNT(*) AS count FROM sections").get().count,
  };

  console.log("SQLite source verified:");
  console.log(`acts=${sourceCounts.acts} sections=${sourceCounts.sections}`);

  if (dryRun) {
    sqlite.close();
    console.log("Dry run complete. No Postgres writes were attempted.");
    return;
  }

  requirePostgresUrl();
  const prisma = new PrismaClient();

  try {
    await createSchema(prisma);
    await setMeta(prisma, "statutes_source_acts", sourceCounts.acts);
    await setMeta(prisma, "statutes_source_sections", sourceCounts.sections);

    const actColumns = [
      "id",
      "act_name",
      "act_year",
      "href",
      "pdf_url",
      "full_text",
      "section_count",
      "status",
      "scraped_at",
      "province",
      "doc_type",
    ];
    const sectionColumns = ["id", "act_id", "section_no", "title", "body"];

    await importTable({
      prisma,
      sqlite,
      sourceTable: "acts",
      targetTable: "legal_acts",
      columns: actColumns,
      batchSize: ACT_BATCH,
    });

    await importTable({
      prisma,
      sqlite,
      sourceTable: "sections",
      targetTable: "legal_sections",
      columns: sectionColumns,
      batchSize: SECTION_BATCH,
    });

    const targetCounts = {
      acts: await countPg(prisma, "legal_acts"),
      sections: await countPg(prisma, "legal_sections"),
    };

    console.log("\n=== count verification ===");
    console.log(
      `acts     sqlite=${sourceCounts.acts} postgres=${targetCounts.acts} ${
        sourceCounts.acts === targetCounts.acts ? "OK" : "CHECK"
      }`
    );
    console.log(
      `sections sqlite=${sourceCounts.sections} postgres=${targetCounts.sections} ${
        sourceCounts.sections === targetCounts.sections ? "OK" : "CHECK"
      }`
    );

    if (!skipIndexes) {
      await createSearchIndexes(prisma);
    }

    const ok =
      sourceCounts.acts === targetCounts.acts &&
      sourceCounts.sections === targetCounts.sections;
    await setMeta(prisma, "statutes_last_import_ok", ok ? "1" : "0");

    if (!ok) {
      process.exitCode = 1;
      console.log("Import finished, but counts differ. Re-run the script before switching the app.");
    } else {
      console.log("Statute import finished safely.");
    }
  } finally {
    sqlite.close();
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error("STATUTE MIGRATION ERROR:", error);
  process.exitCode = 1;
});
