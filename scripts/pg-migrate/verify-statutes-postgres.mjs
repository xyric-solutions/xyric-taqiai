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
      (SELECT COUNT(*)::int FROM legal_acts) AS acts,
      (SELECT COUNT(*)::int FROM legal_sections) AS sections
  `);
  console.log(`legal_acts=${counts[0].acts} legal_sections=${counts[0].sections}`);

  const sample = await prisma.$queryRawUnsafe(`
    SELECT a.act_name, s.section_no, left(coalesce(s.body, ''), 120) AS sample
    FROM legal_sections s
    JOIN legal_acts a ON a.id = s.act_id
    WHERE coalesce(s.body, '') <> ''
    LIMIT 3
  `);

  if (!sample.length) {
    console.log("sample=NONE");
  } else {
    for (const row of sample) {
      console.log(`${row.act_name} | ${row.section_no} | ${row.sample}`);
    }
  }

  const fts = await prisma.$queryRawUnsafe(`
    WITH q AS (SELECT websearch_to_tsquery('simple', '"maintenance"') AS query)
    SELECT a.act_name, s.section_no, left(coalesce(s.body, ''), 120) AS sample
    FROM legal_sections s
    JOIN legal_acts a ON a.id = s.act_id
    CROSS JOIN q
    WHERE to_tsvector(
      'simple',
      COALESCE(s.section_no, '') || ' ' ||
      COALESCE(s.title, '') || ' ' ||
      COALESCE(s.body, '')
    ) @@ q.query
    LIMIT 3
  `);
  console.log(`fts_maintenance_hits=${fts.length}`);
} finally {
  await prisma.$disconnect();
}
