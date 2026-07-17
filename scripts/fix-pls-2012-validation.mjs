import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { PrismaClient } from "@prisma/client";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const APP_ROOT = path.resolve(SCRIPT_DIR, "..");
const REPO_ROOT = path.resolve(APP_ROOT, "..");
const DEFAULT_WORKLIST = path.join(REPO_ROOT, "data", "pls_all_courts_2012_worklist.json");

function parseArgs(argv) {
  const args = {
    apply: false,
    worklist: DEFAULT_WORKLIST,
    source: "pakistanlawsite",
    year: 2012,
    citationPrefix: "PLS_ALL_2012",
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    const next = () => {
      i += 1;
      if (i >= argv.length) throw new Error(`Missing value after ${arg}`);
      return argv[i];
    };
    if (arg === "--apply") args.apply = true;
    else if (arg === "--worklist") args.worklist = resolvePath(next());
    else if (arg === "--source") args.source = next();
    else if (arg === "--year") args.year = Number(next());
    else if (arg === "--citation-prefix") args.citationPrefix = next();
    else if (arg === "--help" || arg === "-h") {
      console.log("Usage: node scripts/fix-pls-2012-validation.mjs [--apply]");
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  args.worklist = resolvePath(args.worklist);
  return args;
}

function resolvePath(value) {
  if (!value) return value;
  if (path.isAbsolute(value)) return value;
  return path.resolve(process.cwd(), value);
}

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);
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

function requirePostgresUrl() {
  loadEnvFile(path.join(APP_ROOT, ".env.local"));
  loadEnvFile(path.join(APP_ROOT, ".env"));
  const url = process.env.DATABASE_URL || "";
  if (!/^postgres(?:ql)?:\/\//i.test(url)) {
    throw new Error("DATABASE_URL is not a PostgreSQL URL after loading .env.local/.env");
  }
}

function normSpace(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function compact(value) {
  return normSpace(value).replace(/[^a-z0-9]+/gi, "").toLowerCase();
}

function sanitizeKey(value) {
  return normSpace(value).replace(/[^A-Za-z0-9]+/g, "_").replace(/^_+|_+$/g, "").slice(0, 100);
}

function stableListingCitation(row, prefix) {
  if (!row.citation) return `${prefix}_${sanitizeKey(row.caseTypeId)}`;
  const listingKey = [
    row.year || 2012,
    compact(row.citation),
    compact(row.title),
    compact(row.court),
  ].join("|");
  const hash = createHash("sha1").update(listingKey).digest("hex").slice(0, 12);
  return `${prefix}_${sanitizeKey(row.citation)}_${hash}`;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  requirePostgresUrl();

  JSON.parse(fs.readFileSync(args.worklist, "utf8"));
  const prisma = new PrismaClient();

  try {
    const rows = await prisma.$queryRawUnsafe(
      `
      SELECT
        job.case_type_id AS "caseTypeId",
        job.year,
        job.citation,
        job.title,
        job.court,
        job.legal_judgment_id AS "legalJudgmentId",
        judgment.citation AS "internalCitation"
      FROM pls_capture_jobs job
      JOIN legal_judgments judgment ON judgment.id = job.legal_judgment_id
      WHERE job.source = $1 AND job.year = $2 AND job.status = 'completed'
      ORDER BY job.row_no NULLS LAST, job.case_type_id
      `,
      args.source,
      args.year
    );

    const targetByLegalId = new Map();
    const conflicts = [];
    for (const row of rows) {
      const target = stableListingCitation(row, args.citationPrefix);
      const id = Number(row.legalJudgmentId);
      if (!targetByLegalId.has(id)) targetByLegalId.set(id, new Set());
      targetByLegalId.get(id).add(target);
    }

    const citationUpdates = [];
    for (const [legalJudgmentId, targets] of targetByLegalId.entries()) {
      if (targets.size !== 1) {
        conflicts.push({ legalJudgmentId, targets: [...targets] });
        continue;
      }
      const targetCitation = [...targets][0];
      const current = rows.find((row) => Number(row.legalJudgmentId) === legalJudgmentId)?.internalCitation;
      if (current !== targetCitation) {
        citationUpdates.push({ legalJudgmentId, current, targetCitation });
      }
    }

    const targetCitations = [...new Set(citationUpdates.map((update) => update.targetCitation))];
    const existingTargets = targetCitations.length
      ? await prisma.$queryRawUnsafe(
          `SELECT id, citation FROM legal_judgments WHERE citation = ANY($1::text[])`,
          targetCitations
        )
      : [];
    const existingByCitation = new Map();
    for (const row of existingTargets) {
      if (!existingByCitation.has(row.citation)) existingByCitation.set(row.citation, []);
      existingByCitation.get(row.citation).push({ id: Number(row.id), citation: row.citation });
    }
    const collisions = [];
    for (const update of citationUpdates) {
      const existing = (existingByCitation.get(update.targetCitation) || []).filter(
        (row) => row.id !== update.legalJudgmentId
      );
      if (existing.length) collisions.push({ ...update, existing });
    }

    const safeCitationUpdates = citationUpdates.filter(
      (update) => !collisions.some((collision) => collision.legalJudgmentId === update.legalJudgmentId)
    );

    const lengthMismatches = await prisma.$queryRawUnsafe(
      `
      SELECT
        job.case_type_id AS "caseTypeId",
        job.legal_judgment_id AS "legalJudgmentId",
        job.content_length AS "jobContentLength",
        char_length(judgment.content) AS "actualContentLength"
      FROM pls_capture_jobs job
      JOIN legal_judgments judgment ON judgment.id = job.legal_judgment_id
      WHERE job.source = $1
        AND job.year = $2
        AND job.status = 'completed'
        AND COALESCE(job.content_length, -1) <> char_length(judgment.content)
      ORDER BY job.row_no NULLS LAST, job.case_type_id
      `,
      args.source,
      args.year
    );

    if (args.apply) {
      await prisma.$transaction(
        async (tx) => {
          for (const update of safeCitationUpdates) {
            await tx.$executeRawUnsafe(
              `UPDATE legal_judgments SET citation = $2 WHERE id = $1`,
              update.legalJudgmentId,
              update.targetCitation
            );
          }
          await tx.$executeRawUnsafe(
            `
            UPDATE pls_capture_jobs AS job
            SET content_length = char_length(judgment.content),
                updated_at = now()
            FROM legal_judgments judgment
            WHERE judgment.id = job.legal_judgment_id
              AND job.source = $1
              AND job.year = $2
              AND job.status = 'completed'
              AND COALESCE(job.content_length, -1) <> char_length(judgment.content)
            `,
            args.source,
            args.year
          );
        },
        { timeout: 120_000 }
      );
    }

    console.log(JSON.stringify({
      apply: args.apply,
      citationUpdates: safeCitationUpdates.length,
      citationUpdateSamples: safeCitationUpdates.slice(0, 10),
      citationConflicts: conflicts,
      citationCollisions: collisions,
      contentLengthLedgerFixes: lengthMismatches.length,
      contentLengthSamples: lengthMismatches.slice(0, 10),
    }, null, 2));
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error?.stack || error?.message || String(error));
  process.exit(1);
});
