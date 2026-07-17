import fs from "node:fs";
import { DatabaseSync } from "node:sqlite";
import { PrismaClient } from "@prisma/client";

const SQLITE_PATH = "data/judgments.db";
const BATCH = 100;

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
  if (!/^postgres(?:ql)?:\/\//i.test(url)) {
    throw new Error("DATABASE_URL is not a Postgres URL.");
  }
}

function normalize(value) {
  return value === undefined ? null : value;
}

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
    `
      INSERT INTO "${table}" (${columns.map((col) => `"${col}"`).join(", ")})
      VALUES ${tuples.join(", ")}
      ON CONFLICT (id) DO NOTHING
    `,
    ...values
  );
}

async function pgCounts(prisma) {
  const rows = await prisma.$queryRawUnsafe(`
    SELECT
      (SELECT COUNT(*)::int FROM legal_judgments WHERE court = 'Federal Shariat Court') AS fsc,
      (SELECT COUNT(*)::int FROM legal_judgments WHERE court = 'Federal Shariat Court' AND real_citation IS NOT NULL) AS fsc_reported,
      (SELECT COUNT(*)::int FROM legal_judgment_tags jt JOIN legal_judgments j ON j.id = jt.judgment_id WHERE j.court = 'Federal Shariat Court') AS fsc_tags
  `);
  return rows[0];
}

function sqliteCounts(sqlite) {
  return {
    fsc: sqlite.prepare("SELECT COUNT(*) AS n FROM judgments WHERE court = ?").get("Federal Shariat Court").n,
    fscReported: sqlite.prepare("SELECT COUNT(*) AS n FROM judgments WHERE court = ? AND real_citation IS NOT NULL").get("Federal Shariat Court").n,
    fscTags: sqlite.prepare("SELECT COUNT(*) AS n FROM judgment_tags jt JOIN judgments j ON j.id = jt.judgment_id WHERE j.court = ?").get("Federal Shariat Court").n,
  };
}

async function main() {
  requirePostgresUrl();
  if (!fs.existsSync(SQLITE_PATH)) throw new Error(`Missing ${SQLITE_PATH}`);

  const sqlite = new DatabaseSync(SQLITE_PATH, { readOnly: true });
  const integrity = sqlite.prepare("PRAGMA integrity_check").get()?.integrity_check;
  if (integrity !== "ok") throw new Error(`SQLite integrity_check failed: ${integrity}`);

  const prisma = new PrismaClient();
  try {
    const source = sqliteCounts(sqlite);
    const before = await pgCounts(prisma);
    console.log("Before:", { source, postgres: before });

    const pgIds = await prisma.$queryRawUnsafe(
      "SELECT id FROM legal_judgments WHERE court = 'Federal Shariat Court'"
    );
    const existing = new Set(pgIds.map((row) => Number(row.id)));
    const sourceIds = sqlite
      .prepare("SELECT id FROM judgments WHERE court = ? ORDER BY id")
      .all("Federal Shariat Court")
      .map((row) => Number(row.id));
    const missingIds = sourceIds.filter((id) => !existing.has(id));

    console.log(`Missing FSC judgments to insert: ${missingIds.length}`);
    for (let offset = 0; offset < missingIds.length; offset += BATCH) {
      const ids = missingIds.slice(offset, offset + BATCH);
      const placeholders = ids.map(() => "?").join(",");
      const rows = sqlite
        .prepare(`SELECT ${JUDGMENT_COLUMNS.join(", ")} FROM judgments WHERE id IN (${placeholders}) ORDER BY id`)
        .all(...ids);
      await insertBatch(prisma, "legal_judgments", JUDGMENT_COLUMNS, rows);
      console.log(`judgments ${Math.min(offset + ids.length, missingIds.length)} / ${missingIds.length}`);
    }

    console.log("Importing FSC tags (safe rerun)...");
    const tagTotal = source.fscTags;
    let tagOffset = 0;
    while (tagOffset < tagTotal) {
      const rows = sqlite
        .prepare(
          `
            SELECT ${TAG_COLUMNS.map((col) => `jt.${col}`).join(", ")}
            FROM judgment_tags jt
            JOIN judgments j ON j.id = jt.judgment_id
            WHERE j.court = ?
            ORDER BY jt.id
            LIMIT ? OFFSET ?
          `
        )
        .all("Federal Shariat Court", BATCH * 10, tagOffset);
      if (!rows.length) break;
      await insertBatch(prisma, "legal_judgment_tags", TAG_COLUMNS, rows);
      tagOffset += rows.length;
      console.log(`tags ${Math.min(tagOffset, tagTotal)} / ${tagTotal}`);
    }

    const after = await pgCounts(prisma);
    console.log("After:", { source, postgres: after });
  } finally {
    sqlite.close();
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
