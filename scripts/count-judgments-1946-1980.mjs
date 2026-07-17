import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({ log: ["error"] });

function asNumber(value) {
  return Number(value ?? 0);
}

async function main() {
  const totalRows = await prisma.$queryRaw`
    SELECT COUNT(*)::bigint AS n
    FROM legal_judgments
    WHERE year BETWEEN 1946 AND 1980
  `;

  const distinctRows = await prisma.$queryRaw`
    SELECT COUNT(DISTINCT COALESCE(NULLIF(real_citation, ''), NULLIF(citation, ''), id::text))::bigint AS n
    FROM legal_judgments
    WHERE year BETWEEN 1946 AND 1980
  `;

  const withContentRows = await prisma.$queryRaw`
    SELECT COUNT(*)::bigint AS n
    FROM legal_judgments
    WHERE year BETWEEN 1946 AND 1980
      AND COALESCE(length(content), 0) >= 100
  `;

  const byRange = await prisma.$queryRaw`
    SELECT
      CASE
        WHEN year BETWEEN 1946 AND 1950 THEN '1946-1950'
        WHEN year BETWEEN 1951 AND 1960 THEN '1951-1960'
        WHEN year BETWEEN 1961 AND 1970 THEN '1961-1970'
        WHEN year BETWEEN 1971 AND 1980 THEN '1971-1980'
      END AS range,
      COUNT(*)::bigint AS n
    FROM legal_judgments
    WHERE year BETWEEN 1946 AND 1980
    GROUP BY 1
    ORDER BY 1
  `;

  const byYear = await prisma.$queryRaw`
    SELECT year, COUNT(*)::bigint AS n
    FROM legal_judgments
    WHERE year BETWEEN 1946 AND 1980
    GROUP BY year
    ORDER BY year
  `;

  console.log(JSON.stringify({
    totalRows: asNumber(totalRows[0]?.n),
    distinctCitationOrId: asNumber(distinctRows[0]?.n),
    withContentRows: asNumber(withContentRows[0]?.n),
    byRange: byRange.map((row) => ({ range: row.range, n: asNumber(row.n) })),
    byYear: byYear.map((row) => ({ year: row.year, n: asNumber(row.n) }))
  }, null, 2));
}

try {
  await main();
} finally {
  await prisma.$disconnect();
}
