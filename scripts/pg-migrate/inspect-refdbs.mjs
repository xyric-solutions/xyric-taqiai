// Read-only inspection of the raw reference DBs (judgments/statutes/semantic/citations).
// Lists tables, row counts, FTS virtual tables, and column schema.
import { DatabaseSync } from "node:sqlite";

const DBS = {
  "judgments.db": "data/judgments.db",
  "statutes.db": "data/statutes.db",
  "semantic.db": "data/semantic.db",
  "citations.db": "data/citations.db",
};

for (const [label, path] of Object.entries(DBS)) {
  console.log("\n========================================");
  console.log("DB:", label);
  console.log("========================================");
  let db;
  try {
    db = new DatabaseSync(path, { readOnly: true });
  } catch (e) {
    console.log("  open error:", e.message);
    continue;
  }
  const objs = db
    .prepare(
      "SELECT name, type FROM sqlite_master WHERE name NOT LIKE 'sqlite_%' ORDER BY type, name"
    )
    .all();
  for (const o of objs) {
    if (o.type === "table") {
      let n = "?";
      try {
        n = db.prepare(`SELECT COUNT(*) c FROM "${o.name}"`).get().c;
      } catch (e) {
        n = "(" + e.message.slice(0, 30) + ")";
      }
      // detect FTS virtual tables via their sql
      const sql = db
        .prepare("SELECT sql FROM sqlite_master WHERE name = ?")
        .get(o.name)?.sql || "";
      const fts = /fts\d|USING fts/i.test(sql) ? "  [FTS]" : "";
      console.log(`  TABLE ${o.name.padEnd(22)} rows=${String(n).padEnd(8)}${fts}`);
    } else {
      console.log(`  ${o.type.toUpperCase()} ${o.name}`);
    }
  }
  // show columns of the biggest/main table
  const mainGuess = objs.find(
    (o) => o.type === "table" && /judgment|statute|section|embedding|vec|cite|cited/i.test(o.name)
  );
  if (mainGuess) {
    console.log(`  -- columns of ${mainGuess.name}:`);
    const cols = db.prepare(`PRAGMA table_info("${mainGuess.name}")`).all();
    for (const c of cols) console.log(`     ${c.name} : ${c.type}`);
  }
  db.close();
}
