// Read-only inspection of prisma/dev.db — counts rows + shows column types.
// Safe: opens SQLite read-only, never writes.
import { DatabaseSync } from "node:sqlite";

const db = new DatabaseSync("prisma/dev.db", { readOnly: true });

const tbls = db
  .prepare(
    "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '_prisma%' ORDER BY name"
  )
  .all();

let total = 0;
console.log("=== row counts ===");
for (const t of tbls) {
  const c = db.prepare(`SELECT COUNT(*) AS n FROM "${t.name}"`).get();
  total += c.n;
  console.log(t.name.padEnd(18), c.n);
}
console.log("TOTAL rows:", total);

console.log("\n=== sample User row (raw types) ===");
const u = db.prepare("SELECT * FROM User LIMIT 1").get();
if (u) {
  for (const k of Object.keys(u)) {
    console.log(k.padEnd(14), typeof u[k], JSON.stringify(u[k])?.slice(0, 50));
  }
} else {
  console.log("(no users)");
}

console.log("\n=== sample Matter row (DateTime/Boolean check) ===");
const m = db.prepare("SELECT * FROM Matter LIMIT 1").get();
if (m) {
  for (const k of ["dateFiled", "nextHearing", "archived", "createdAt"]) {
    console.log(k.padEnd(14), typeof m[k], JSON.stringify(m[k]));
  }
} else {
  console.log("(no matters)");
}

db.close();
