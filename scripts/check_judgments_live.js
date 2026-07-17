// Check how many judgments are in the LIVE Railway Postgres DB.
// Pure raw SQL on the mapped table name -> no Prisma model-name dependency.
const { PrismaClient } = require('@prisma/client');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function withRetry(label, fn, attempts = 6) {
  let lastErr;
  for (let i = 1; i <= attempts; i++) {
    try { return await fn(); }
    catch (e) {
      lastErr = e;
      console.error(`  [retry ${i}/${attempts}] ${label} failed: ${e.message}`);
      await sleep(2500 * i);
    }
  }
  throw lastErr;
}

(async () => {
  const prisma = new PrismaClient({ log: ['error'] });
  try {
    console.log('Connecting to LIVE Railway Postgres...\n');

    const total = await withRetry('count total', () =>
      prisma.$queryRawUnsafe(`SELECT COUNT(*)::bigint AS n FROM legal_judgments;`)
    );
    console.log(`TOTAL judgments (legal_judgments): ${Number(total[0].n).toLocaleString()}\n`);

    const byCourt = await withRetry('group by court', () =>
      prisma.$queryRawUnsafe(`
        SELECT court, court_level AS "courtLevel", COUNT(*)::bigint AS n
        FROM legal_judgments
        GROUP BY court, court_level
        ORDER BY n DESC;`)
    );
    console.log('BY COURT:');
    let sumCheck = 0;
    for (const row of byCourt) {
      console.log(`  ${String(row.court).padEnd(34)} ${String(row.courtLevel || '-').padEnd(12)} ${Number(row.n).toLocaleString()}`);
      sumCheck += Number(row.n);
    }
    console.log(`  ${'-' .repeat(58)}`);
    console.log(`  ${'TOTAL (sum of courts)'.padEnd(46)} ${sumCheck.toLocaleString()}\n`);

    // body-text columns present?
    const cols = await withRetry('columns', () =>
      prisma.$queryRawUnsafe(`SELECT column_name FROM information_schema.columns WHERE table_name='legal_judgments' ORDER BY ordinal_position;`)
    );
    const colNames = cols.map((c) => c.column_name);
    const bodyCols = colNames.filter((c) => /text|body|content/i.test(c));
    console.log('Body-ish columns:', bodyCols.join(', '));

    const hashCols = colNames.filter((c) => /hash/i.test(c));
    if (hashCols.length) {
      const col = hashCols[0];
      const d = await withRetry('distinct hash', () =>
        prisma.$queryRawUnsafe(`SELECT COUNT(DISTINCT ${col})::bigint AS uniq, COUNT(*)::bigint AS total FROM legal_judgments WHERE ${col} IS NOT NULL;`)
      );
      console.log(`Distinct by ${col}: ${Number(d[0].uniq).toLocaleString()} unique / ${Number(d[0].total).toLocaleString()} rows\n`);
    } else {
      console.log('No hash column -> dedup check skipped.\n');
    }

    console.log('LIVE = these counts come straight from DATABASE_URL (Railway Postgres), the same DB the running app reads.');
  } catch (e) {
    console.error('\nFAILED:', e.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();
