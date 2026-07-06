/**
 * One-off: merge the old Lawyer Diary (DiaryEntry) rows into the Matter table,
 * which now powers the unified "Lawyer Diary" page. Backs everything up to JSON
 * first, then creates a Matter per DiaryEntry. Idempotent — re-running skips
 * entries that already have a matching Matter. Needs DATABASE_URL (auto-loaded
 * from .env by Prisma).
 *
 *   node scripts/pg-migrate/merge-diary-into-matters.mjs
 */
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

// The Railway public proxy drops connections intermittently — retry transient errors.
async function withRetry(fn, tries = 8, delay = 1500) {
  for (let i = 0; i < tries; i++) {
    try {
      return await fn();
    } catch (e) {
      const msg = String(e?.message || e).toLowerCase();
      const transient = msg.includes("reach database") || msg.includes("connection") ||
        msg.includes("timeout") || msg.includes("econnreset") || msg.includes("p1001");
      if (!transient || i === tries - 1) throw e;
      await new Promise((r) => setTimeout(r, delay * (i + 1)));
    }
  }
}

const matters = await withRetry(() => prisma.matter.findMany());
const hearings = await withRetry(() => prisma.matterHearing.findMany());
const diary = await withRetry(() => prisma.diaryEntry.findMany());

// ── Backup first ────────────────────────────────────────────────────────────
const backupPath = path.join("scripts", "pg-migrate", `backup-before-merge-${Date.now()}.json`);
fs.writeFileSync(backupPath, JSON.stringify({ matters, hearings, diary }, null, 2));
console.log(`Backup written: ${backupPath}`);
console.log(`  matters=${matters.length}  hearings=${hearings.length}  diaryEntries=${diary.length}`);

// ── Migrate DiaryEntry -> Matter ─────────────────────────────────────────────
let created = 0;
let skipped = 0;
for (const d of diary) {
  // Idempotency: a Matter already carrying this diary entry (same owner, title,
  // court, and next hearing) is treated as already migrated.
  const existing = await withRetry(() => prisma.matter.findFirst({
    where: {
      userId: d.userId,
      title: d.title,
      court: d.courtName ?? "",
      nextHearing: d.nextDate ?? null,
    },
  }));
  if (existing) {
    skipped++;
    continue;
  }

  await withRetry(() => prisma.matter.create({
    data: {
      userId: d.userId,
      title: d.title,
      caseNo: d.caseNumber ?? null,
      court: d.courtName ?? "",
      caseType: "Civil",
      status: "active",
      role: "",
      clientName: d.title, // Matter requires a clientName; diary had none, so use the case title
      clientPhone: d.clientPhone ?? null,
      nextHearing: d.nextDate ?? null,
      lastDate: d.lastDate ?? null,
      stage: d.stage ?? null,
      proceeding: d.proceeding ?? null,
    },
  }));
  created++;
}

console.log(`\nDone. Migrated ${created} diary entries into matters; skipped ${skipped} already present.`);
console.log(`Matters total now: ${matters.length + created}`);
await prisma.$disconnect();
