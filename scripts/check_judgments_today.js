// Count judgments added TODAY (2026-07-08) — created_at/tagged_at are Unix epoch bigint.
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
  const TODAY = '2026-07-08';
  try {
    console.log('Connecting to LIVE Railway Postgres (from localhost)...\n');

    // Detect seconds vs milliseconds from max(created_at)
    const probe = await withRetry('probe epoch scale', () =>
      prisma.$queryRawUnsafe(`SELECT MAX(created_at) AS mx, MIN(created_at) AS mn FROM legal_judgments WHERE created_at IS NOT NULL;`)
    );
    const mx = Number(probe[0].mx);
    console.log(`created_at range: min=${probe[0].mn}  max=${probe[0].mx}`);
    const scale = mx > 1e12 ? 1000 : 1; // >1e12 -> milliseconds
    const div = scale === 1000 ? '/1000' : '';
    console.log(`Detected scale: ${scale === 1000 ? 'milliseconds' : 'seconds'} (using /1000 = ${div || 'no'})\n`);

    // Count today — try both UTC and Asia/Karachi (PKT) date boundaries
    for (const tz of ['UTC', 'Asia/Karachi']) {
      const r = await withRetry(`today count (${tz})`, () =>
        prisma.$queryRawUnsafe(`
          SELECT COUNT(*)::bigint AS n
          FROM legal_judgments
          WHERE (to_timestamp(created_at${div}) AT TIME ZONE '${tz}')::date = '${TODAY}'::date;`)
      );
      console.log(`Added TODAY (${TODAY}) [created_at, ${tz}]: ${Number(r[0].n).toLocaleString()}`);
    }

    console.log('');
    // tagged_at today too (in case tagging is the "today" event)
    for (const tz of ['UTC', 'Asia/Karachi']) {
      const r = await withRetry(`tagged today (${tz})`, () =>
        prisma.$queryRawUnsafe(`
          SELECT COUNT(*)::bigint AS n
          FROM legal_judgments
          WHERE tagged_at IS NOT NULL
            AND (to_timestamp(tagged_at${div}) AT TIME ZONE '${tz}')::date = '${TODAY}'::date;`)
      );
      console.log(`Tagged TODAY (${TODAY}) [tagged_at, ${tz}]: ${Number(r[0].n).toLocaleString()}`);
    }

    // Sanity: last few days trend by PKT
    console.log('\nLast 7 days (created_at, Asia/Karachi):');
    const trend = await withRetry('7-day trend', () =>
      prisma.$queryRawUnsafe(`
        SELECT (to_timestamp(created_at${div}) AT TIME ZONE 'Asia/Karachi')::date AS d, COUNT(*)::bigint AS n
        FROM legal_judgments
        WHERE created_at IS NOT NULL
          AND (to_timestamp(created_at${div}) AT TIME ZONE 'Asia/Karachi')::date >= '${TODAY}'::date - 6
        GROUP BY d ORDER BY d;`)
    );
    for (const row of trend) console.log(`  ${row.d}  ${Number(row.n).toLocaleString()}`);

    // If today > 0, show which courts were added today
    console.log('\nBreakdown of TODAY additions by court (PKT):');
    const byc = await withRetry('today by court', () =>
      prisma.$queryRawUnsafe(`
        SELECT COALESCE(court,'(null)') AS court, COUNT(*)::bigint AS n
        FROM legal_judgments
        WHERE (to_timestamp(created_at${div}) AT TIME ZONE 'Asia/Karachi')::date = '${TODAY}'::date
        GROUP BY court ORDER BY n DESC LIMIT 25;`)
    );
    let s = 0;
    for (const row of byc) { console.log(`  ${String(row.court).padEnd(34)} ${Number(row.n).toLocaleString()}`); s += Number(row.n); }
    console.log(`  ${'-' .repeat(46)}\n  ${'TODAY total'.padEnd(34)} ${s.toLocaleString()}`);
  } catch (e) {
    console.error('\nFAILED:', e.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();
