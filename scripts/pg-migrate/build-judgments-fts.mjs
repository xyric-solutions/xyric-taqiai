/**
 * Build a full-text search (FTS5) index on data/judgments.db so judgment search
 * uses MATCH instead of a 3.4GB `content LIKE '%...%'` scan (47s -> <1s).
 *
 * SAFE: only ADDS a derived index table (judgments_fts). The judgments rows
 * themselves are never modified. Re-runnable (drops + rebuilds the index).
 * External-content FTS5 => indexes judgments.content by rowid=id, no text copy.
 */
import { DatabaseSync } from "node:sqlite";

const DB = "data/judgments.db";
console.log("Opening", DB, "(read-write)…");
const db = new DatabaseSync(DB);

const t0 = process.hrtime.bigint();
console.log("Dropping old index if present…");
db.exec("DROP TABLE IF EXISTS judgments_fts;");

console.log("Creating external-content FTS5 table…");
db.exec(
  "CREATE VIRTUAL TABLE judgments_fts USING fts5(" +
    "content, content='judgments', content_rowid='id');"
);

console.log("Rebuilding index from judgments.content (few minutes)…");
db.exec("INSERT INTO judgments_fts(judgments_fts) VALUES('rebuild');");

console.log("Checkpointing WAL…");
try { db.exec("PRAGMA wal_checkpoint(TRUNCATE);"); } catch {}

const n = db.prepare("SELECT count(*) c FROM judgments_fts").get().c;
const secs = Number(process.hrtime.bigint() - t0) / 1e9;
console.log(`Done. Indexed ${n} docs in ${secs.toFixed(1)}s.`);

// quick sanity: time a MATCH query
const q0 = process.hrtime.bigint();
const hit = db
  .prepare("SELECT count(*) c FROM judgments_fts WHERE judgments_fts MATCH ?")
  .get('"bail cancellation"').c;
const qms = Number(process.hrtime.bigint() - q0) / 1e6;
console.log(`MATCH '"bail cancellation"' -> ${hit} docs in ${qms.toFixed(1)}ms`);

db.close();
