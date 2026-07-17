// Times the exact NEW searchLocalJudgments query shape (FTS subquery) to confirm
// the rewrite is valid SQL and fast. Read-only.
import { DatabaseSync } from "node:sqlite";
const db = new DatabaseSync("data/judgments.db", { readOnly: true });

const courtPriority = `CASE
  WHEN court LIKE 'Supreme Court%' THEN 0
  WHEN court LIKE 'Lahore High Court%' THEN 1
  WHEN court LIKE 'Federal Shariat Court%' THEN 2
  WHEN court LIKE 'Islamabad High Court%' THEN 3
  WHEN court LIKE 'Peshawar High Court%' THEN 3
  WHEN court LIKE 'Balochistan High Court%' THEN 3
  WHEN court LIKE 'Sindh High Court%' THEN 4
  ELSE 5 END`;

for (const q of ["bail cancellation", "murder", "specific performance", "khula"]) {
  const likeQ = `%${q}%`;
  const phrase = `"${q}"`;
  const sql = `
    SELECT id, citation, real_citation, court, year, title, processed,
      CASE WHEN content IS NOT NULL THEN substr(content,1,4000) ELSE NULL END AS content
    FROM judgments
    WHERE (citation LIKE ? COLLATE NOCASE OR real_citation LIKE ? COLLATE NOCASE
           OR (processed = 1 AND id IN (SELECT rowid FROM judgments_fts WHERE judgments_fts MATCH ?)))
    ORDER BY (real_citation IS NOT NULL) DESC, (title IS NOT NULL) DESC, year DESC, ${courtPriority} ASC, id ASC
    LIMIT ?`;
  const t = process.hrtime.bigint();
  const rows = db.prepare(sql).all(likeQ, likeQ, phrase, 150);
  const ms = Number(process.hrtime.bigint() - t) / 1e6;

  // pure-FTS variant (no citation/real_citation OR scan)
  const sql2 = `
    SELECT id, citation, real_citation, court, year, title, processed,
      CASE WHEN content IS NOT NULL THEN substr(content,1,4000) ELSE NULL END AS content
    FROM judgments
    WHERE processed = 1 AND id IN (SELECT rowid FROM judgments_fts WHERE judgments_fts MATCH ?)
    ORDER BY (real_citation IS NOT NULL) DESC, (title IS NOT NULL) DESC, year DESC, ${courtPriority} ASC, id ASC
    LIMIT ?`;
  const t2 = process.hrtime.bigint();
  const rows2 = db.prepare(sql2).all(phrase, 150);
  const ms2 = Number(process.hrtime.bigint() - t2) / 1e6;

  console.log(`"${q}"`.padEnd(22), `with-OR: ${ms.toFixed(0)}ms`.padEnd(16), `pure-FTS: ${ms2.toFixed(0)}ms (${rows2.length} rows)`);
}
db.close();
