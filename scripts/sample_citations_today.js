// 5 sample judgments per court FROM TODAY'S batch only (created_at = 2026-07-08).
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
    const rows = await withRetry('today 5 per court', () =>
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
            AND (to_timestamp(created_at/1000) AT TIME ZONE 'Asia/Karachi')::date = '2026-07-08'::date
        )
        SELECT court, citation, real_citation, title, year, cnt
        FROM ranked WHERE rn <= 5
        ORDER BY cnt DESC, court, rn;`)
    );
    console.log(`=== TODAY (2026-07-08) — ${rows.length>0?Number(rows[0].cnt).toLocaleString():0} rows in first court shown ===\n`);
    let cur = null, totalToday = 0, courtCount = 0;
    const seen = new Set();
    for (const r of rows) {
      if (!seen.has(r.court)) { seen.add(r.court); totalToday += Number(r.cnt); courtCount++; }
      if (r.court !== cur) { cur = r.court; console.log(`\n=== ${cur}  (${Number(r.cnt).toLocaleString()} today) ===`); }
      const num = r.real_citation || r.citation;
      const t = r.title ? String(r.title).replace(/\s+/g,' ').slice(0, 55) : '';
      console.log(`  ${String(num).padEnd(26)} ${r.year || ''}  ${t}`);
    }
    console.log(`\n--- TODAY distinct courts: ${courtCount} | total today: ${totalToday.toLocaleString()} ---`);
  } catch (e) { console.error('\nFAILED:', e.message); process.exit(1); }
  finally { await prisma.$disconnect(); }
})();
