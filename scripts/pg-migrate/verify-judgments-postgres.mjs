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
      (SELECT COUNT(*)::int FROM legal_judgments) AS judgments,
      (SELECT COALESCE(MAX(id), 0)::int FROM legal_judgments) AS max_judgment_id,
      (SELECT COUNT(*)::int FROM legal_judgment_tags) AS tags,
      (SELECT COALESCE(MAX(id), 0)::int FROM legal_judgment_tags) AS max_tag_id
  `);
  console.log(
    `legal_judgments=${counts[0].judgments} max_judgment_id=${counts[0].max_judgment_id}`
  );
  console.log(`legal_judgment_tags=${counts[0].tags} max_tag_id=${counts[0].max_tag_id}`);

  const sample = await prisma.$queryRawUnsafe(`
    SELECT id, citation, real_citation, court, year, left(coalesce(title, ''), 80) AS title
    FROM legal_judgments
    ORDER BY id
    LIMIT 3
  `);
  for (const row of sample) {
    console.log(
      `${row.id} | ${row.real_citation || row.citation} | ${row.court} | ${row.year} | ${row.title}`
    );
  }

  const search = await prisma.$queryRawUnsafe(`
    WITH q AS (SELECT websearch_to_tsquery('simple', '"specific performance"') AS query)
    SELECT j.id, j.real_citation, j.citation, j.court, j.year, left(coalesce(j.title, ''), 80) AS title
    FROM legal_judgments j
    CROSS JOIN q
    WHERE j.processed = 1
      AND j.real_citation IS NOT NULL
      AND to_tsvector(
        'simple',
        COALESCE(j.citation, '') || ' ' ||
        COALESCE(j.real_citation, '') || ' ' ||
        COALESCE(j.title, '') || ' ' ||
        COALESCE(j.content, '')
      ) @@ q.query
    ORDER BY ts_rank_cd(
      to_tsvector(
        'simple',
        COALESCE(j.citation, '') || ' ' ||
        COALESCE(j.real_citation, '') || ' ' ||
        COALESCE(j.title, '') || ' ' ||
        COALESCE(j.content, '')
      ),
      q.query
    ) DESC
    LIMIT 3
  `);
  console.log(`specific_performance_reported_hits=${search.length}`);
  for (const row of search) {
    console.log(`${row.id} | ${row.real_citation || row.citation} | ${row.court} | ${row.year} | ${row.title}`);
  }
} finally {
  await prisma.$disconnect();
}
