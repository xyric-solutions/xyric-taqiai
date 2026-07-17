// 5 sample judgment citations per court — for search testing.
const { PrismaClient } = require('@prisma/client');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function withRetry(label, fn, attempts = 6) {
  let lastErr;
  for (let i = 1; i <= attempts; i++) {
    try { return await fn(); }
    catch (e) { lastErr = e; console.error(`  [retry ${i}/${attempts}] ${label} failed: ${e.message}`); await sleep(2500 * i); }
  }
  throw lastErr;
}
(async () => {
  const prisma = new PrismaClient({ log: ['error'] });
  try {
    // 5 per court, prefer ones that have a real reported citation, then title present
    const rows = await withRetry('5 per court', () =>
      prisma.$queryRawUnsafe(`
        WITH ranked AS (
          SELECT court, citation, real_citation, title, year,
                 ROW_NUMBER() OVER (
                   PARTITION BY court
                   ORDER BY (real_citation IS NULL)::int, (title IS NULL)::int, year DESC NULLS LAST
                 ) AS rn,
                 COUNT(*) OVER (PARTITION BY court) AS cnt
          FROM legal_judgments
          WHERE court IS NOT NULL AND court <> 'Unknown'
        )
        SELECT court, citation, real_citation, title, year, cnt
        FROM ranked
        WHERE rn <= 5
        ORDER BY cnt DESC, court, rn;`)
    );

    let cur = null;
    for (const r of rows) {
      if (r.court !== cur) {
        cur = r.court;
        const c = Number(r.cnt).toLocaleString();
        console.log(`\n=== ${cur}  (${c} total) ===`);
      }
      const num = r.real_citation || r.citation;
      const t = r.title ? String(r.title).replace(/\s+/g,' ').slice(0, 60) : '';
      console.log(`  ${String(num).padEnd(28)} ${r.year || ''}  ${t}`);
    }
  } catch (e) {
    console.error('\nFAILED:', e.message); process.exit(1);
  } finally { await prisma.$disconnect(); }
})();
