/**
 * Migrate prisma/dev.db (SQLite) -> Railway Postgres.
 *
 * SAFETY:
 *  - Reads SQLite strictly read-only (original file is never modified).
 *  - Writes to Postgres via the (postgres) Prisma client using createMany +
 *    skipDuplicates, so re-running is safe and never duplicates rows.
 *  - Converts Prisma/SQLite quirks: DateTime is stored as epoch-ms NUMBER and
 *    Boolean as 0/1 in SQLite -> real Date / boolean for Postgres.
 *
 * PREREQUISITES (run in order, see README.md):
 *   1. schema.prisma provider switched to "postgresql"
 *   2. DATABASE_URL pointed at Railway Postgres
 *   3. npx prisma db push      (creates tables + indexes in Postgres)
 *   4. npx prisma generate     (Prisma client now targets Postgres)
 *   5. node --experimental-sqlite scripts/pg-migrate/migrate-devdb-to-postgres.mjs
 */
import { DatabaseSync } from "node:sqlite";
import { PrismaClient } from "@prisma/client";

const SQLITE_PATH = "prisma/dev.db";

// FK-safe insertion order (parents before children).
const ORDER = [
  "User",
  "Document",
  "ChatSession",
  "ChatMessage",
  "Matter",
  "MatterHearing",
  "DiaryEntry",
  "SavedJudgment",
  "LegalCase",
  "CaseHearing",
];

// Prisma model accessors (camelCase) for each SQLite table.
const ACCESSOR = {
  User: "user",
  Document: "document",
  ChatSession: "chatSession",
  ChatMessage: "chatMessage",
  Matter: "matter",
  MatterHearing: "matterHearing",
  DiaryEntry: "diaryEntry",
  SavedJudgment: "savedJudgment",
  LegalCase: "legalCase",
  CaseHearing: "caseHearing",
};

// DateTime columns per table — stored as epoch-ms numbers in SQLite.
const DATE_FIELDS = {
  User: ["createdAt", "updatedAt"],
  Document: ["deletedAt", "createdAt", "updatedAt"],
  ChatSession: ["createdAt", "updatedAt"],
  ChatMessage: ["createdAt"],
  Matter: ["dateFiled", "nextHearing", "createdAt", "updatedAt"],
  MatterHearing: ["date", "nextDate", "createdAt"],
  DiaryEntry: ["lastDate", "nextDate", "createdAt", "updatedAt"],
  SavedJudgment: ["createdAt", "updatedAt"],
  LegalCase: ["nextHearingDate", "createdAt", "updatedAt"],
  CaseHearing: ["date", "nextDate", "createdAt"],
};

// Boolean columns per table — stored as 0/1 in SQLite.
const BOOL_FIELDS = {
  Matter: ["archived"],
};

function convertRow(table, row) {
  const out = { ...row };
  for (const f of DATE_FIELDS[table] || []) {
    if (out[f] !== null && out[f] !== undefined) out[f] = new Date(Number(out[f]));
  }
  for (const f of BOOL_FIELDS[table] || []) {
    if (out[f] !== null && out[f] !== undefined) out[f] = Boolean(out[f]);
  }
  return out;
}

const sqlite = new DatabaseSync(SQLITE_PATH, { readOnly: true });
const prisma = new PrismaClient();

const summary = [];
let failed = false;

try {
  for (const table of ORDER) {
    const rows = sqlite.prepare(`SELECT * FROM "${table}"`).all();
    const data = rows.map((r) => convertRow(table, r));

    if (data.length > 0) {
      await prisma[ACCESSOR[table]].createMany({ data, skipDuplicates: true });
    }

    const pgCount = await prisma[ACCESSOR[table]].count();
    const ok = pgCount >= data.length;
    if (!ok) failed = true;
    summary.push({ table, sqlite: data.length, postgres: pgCount, ok });
    console.log(
      `${table.padEnd(16)} sqlite=${String(data.length).padEnd(5)} postgres=${String(
        pgCount
      ).padEnd(5)} ${ok ? "OK" : "MISMATCH!"}`
    );
  }

  console.log("\n=== verification ===");
  const allOk = summary.every((s) => s.ok);
  console.log(allOk ? "ALL TABLES OK — data migrated, counts match." : "MISMATCH FOUND — review above.");
  if (!allOk) process.exitCode = 1;
} catch (e) {
  console.error("MIGRATION ERROR:", e);
  process.exitCode = 1;
} finally {
  sqlite.close();
  await prisma.$disconnect();
}
