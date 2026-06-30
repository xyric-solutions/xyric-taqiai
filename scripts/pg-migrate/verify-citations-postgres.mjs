import fs from "node:fs";
import { PrismaClient } from "@prisma/client";

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

loadEnvFile(".env.local");
loadEnvFile(".env");

const prisma = new PrismaClient();

try {
  const counts = await prisma.$queryRawUnsafe(`
    SELECT
      (SELECT COUNT(*)::int FROM legal_cited_counts) AS cited_counts,
      (SELECT COUNT(*)::int FROM legal_citation_edges) AS edges,
      (SELECT COALESCE(MAX(id), 0)::int FROM legal_citation_edges) AS max_edge_id
  `);
  console.log(
    `legal_cited_counts=${counts[0].cited_counts} legal_citation_edges=${counts[0].edges} max_edge_id=${counts[0].max_edge_id}`
  );

  const top = await prisma.$queryRawUnsafe(`
    SELECT cited_key, n
    FROM legal_cited_counts
    ORDER BY n DESC
    LIMIT 5
  `);
  for (const row of top) {
    console.log(`${row.cited_key} | cited_by=${row.n}`);
  }
} finally {
  await prisma.$disconnect();
}
