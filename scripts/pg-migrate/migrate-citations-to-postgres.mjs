/**
 * Migrate data/citations.db (SQLite) -> Postgres.
 *
 * Imports the citation network used for "cited by / good law" signals:
 * - cited_counts -> legal_cited_counts
 * - edges        -> legal_citation_edges
 *
 * Safety:
 * - Opens SQLite read-only.
 * - Uses SQLite rowid for edge ids, making reruns resumable.
 * - Uses ON CONFLICT DO NOTHING / DO UPDATE.
 */
import fs from "node:fs";
import { DatabaseSync } from "node:sqlite";
import { PrismaClient } from "@prisma/client";

const SQLITE_PATH = "data/citations.db";
const COUNT_BATCH = 5000;
const EDGE_BATCH = 10000;

const dryRun = process.argv.includes("--dry-run");
const skipEdges = process.argv.includes("--skip-edges");

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
    throw new Error("DATABASE_URL is not a Postgres URL.");
  }
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
  if (!fs.existsSync(SQLITE_PATH)) throw new Error(`Missing ${SQLITE_PATH}`);
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
    CREATE TABLE IF NOT EXISTS legal_cited_counts (
      cited_key TEXT PRIMARY KEY,
      n INTEGER NOT NULL DEFAULT 0
    )
  `);

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS legal_citation_edges (
      id INTEGER PRIMARY KEY,
      citing_id INTEGER,
      cited_key TEXT
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

async function createIndexes(prisma) {
  console.log("Creating citation indexes...");
  await prisma.$executeRawUnsafe(
    `CREATE INDEX IF NOT EXISTS legal_citation_edges_citing_idx ON legal_citation_edges (citing_id)`
  );
  await prisma.$executeRawUnsafe(
    `CREATE INDEX IF NOT EXISTS legal_citation_edges_key_idx ON legal_citation_edges (cited_key)`
  );
  await prisma.$executeRawUnsafe(
    `CREATE INDEX IF NOT EXISTS legal_cited_counts_n_idx ON legal_cited_counts (n DESC)`
  );
}

async function countPg(prisma, table) {
  const rows = await withRetry(`count ${table}`, () =>
    prisma.$queryRawUnsafe(`SELECT COUNT(*)::bigint AS count FROM "${table}"`)
  );
  return Number(rows[0]?.count || 0);
}

async function maxEdgeId(prisma) {
  const rows = await withRetry("max legal_citation_edges", () =>
    prisma.$queryRawUnsafe(`SELECT COALESCE(MAX(id), 0)::bigint AS max_id FROM legal_citation_edges`)
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

async function insertCounts(prisma, rows) {
  if (!rows.length) return;
  const values = [];
  let param = 1;
  const tuples = rows.map((row) => {
    values.push(row.cited_key, Number(row.n || 0));
    return `($${param++}, $${param++})`;
  });
  await withRetry("insert legal_cited_counts", () =>
    prisma.$executeRawUnsafe(
      `
        INSERT INTO legal_cited_counts (cited_key, n)
        VALUES ${tuples.join(", ")}
        ON CONFLICT (cited_key) DO UPDATE SET n = EXCLUDED.n
      `,
      ...values
    )
  );
}

async function insertEdges(prisma, rows) {
  if (!rows.length) return;
  const values = [];
  let param = 1;
  const tuples = rows.map((row) => {
    values.push(Number(row.id), row.citing_id === null ? null : Number(row.citing_id), row.cited_key);
    return `($${param++}, $${param++}, $${param++})`;
  });
  await withRetry("insert legal_citation_edges", () =>
    prisma.$executeRawUnsafe(
      `
        INSERT INTO legal_citation_edges (id, citing_id, cited_key)
        VALUES ${tuples.join(", ")}
        ON CONFLICT (id) DO NOTHING
      `,
      ...values
    )
  );
}

async function importCounts(prisma, sqlite) {
  const total = sqlite.prepare("SELECT COUNT(*) AS count FROM cited_counts").get().count;
  let offset = 0;
  while (offset < total) {
    const rows = sqlite
      .prepare("SELECT cited_key, n FROM cited_counts ORDER BY cited_key LIMIT ? OFFSET ?")
      .all(COUNT_BATCH, offset);
    if (!rows.length) break;
    await insertCounts(prisma, rows);
    offset += rows.length;
    if (offset === total || offset % 25000 === 0) {
      console.log(`cited_counts ${String(offset).padStart(8)} / ${total}`);
    }
  }
  return total;
}

async function importEdges(prisma, sqlite) {
  const total = sqlite.prepare("SELECT COUNT(*) AS count FROM edges").get().count;
  let lastId = await maxEdgeId(prisma);
  let seen = lastId > 0
    ? sqlite.prepare("SELECT COUNT(*) AS count FROM edges WHERE rowid <= ?").get(lastId).count
    : 0;

  if (lastId > 0) {
    const pgCount = await countPg(prisma, "legal_citation_edges");
    console.log(`edges resume at source_seen=${seen} / ${total} (postgres=${pgCount}, last_id=${lastId})`);
  }

  while (true) {
    const rows = sqlite
      .prepare(
        `SELECT rowid AS id, citing_id, cited_key
         FROM edges
         WHERE rowid > ?
         ORDER BY rowid
         LIMIT ?`
      )
      .all(lastId, EDGE_BATCH);
    if (!rows.length) break;
    await insertEdges(prisma, rows);
    lastId = rows[rows.length - 1].id;
    seen += rows.length;
    if (seen === total || seen % 100000 === 0) {
      const pgCount = await countPg(prisma, "legal_citation_edges");
      console.log(`edges       ${String(seen).padStart(8)} / ${total} (postgres=${pgCount}, last_id=${lastId})`);
    }
  }
  return total;
}

async function main() {
  const sqlite = openSqlite();
  const sourceCounts = {
    citedCounts: sqlite.prepare("SELECT COUNT(*) AS count FROM cited_counts").get().count,
    edges: sqlite.prepare("SELECT COUNT(*) AS count FROM edges").get().count,
  };
  console.log("SQLite source verified:");
  console.log(`cited_counts=${sourceCounts.citedCounts} edges=${sourceCounts.edges}`);

  if (dryRun) {
    sqlite.close();
    console.log("Dry run complete. No Postgres writes were attempted.");
    return;
  }

  requirePostgresUrl();
  const prisma = new PrismaClient();
  try {
    await createSchema(prisma);
    await setMeta(prisma, "citations_source_cited_counts", sourceCounts.citedCounts);
    await setMeta(prisma, "citations_source_edges", sourceCounts.edges);

    await importCounts(prisma, sqlite);
    if (!skipEdges) await importEdges(prisma, sqlite);
    await createIndexes(prisma);

    const targetCounts = {
      citedCounts: await countPg(prisma, "legal_cited_counts"),
      edges: await countPg(prisma, "legal_citation_edges"),
    };
    console.log("\n=== count verification ===");
    console.log(
      `cited_counts sqlite=${sourceCounts.citedCounts} postgres=${targetCounts.citedCounts} ${
        sourceCounts.citedCounts === targetCounts.citedCounts ? "OK" : "CHECK"
      }`
    );
    if (!skipEdges) {
      console.log(
        `edges        sqlite=${sourceCounts.edges} postgres=${targetCounts.edges} ${
          sourceCounts.edges === targetCounts.edges ? "OK" : "CHECK"
        }`
      );
    }

    const ok =
      sourceCounts.citedCounts === targetCounts.citedCounts &&
      (skipEdges || sourceCounts.edges === targetCounts.edges);
    await setMeta(prisma, "citations_last_import_ok", ok ? "1" : "0");
    if (!ok) {
      process.exitCode = 1;
      console.log("Import finished, but counts differ. Re-run the script before relying on citations.");
    } else {
      console.log("Citation import finished safely.");
    }
  } finally {
    sqlite.close();
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error("CITATION MIGRATION ERROR:", error);
  process.exitCode = 1;
});
