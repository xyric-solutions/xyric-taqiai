import fs from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";

const APP_ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")), "..");

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  for (const line of fs.readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const match = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!match || process.env[match[1]] !== undefined) continue;
    let value = match[2].trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    process.env[match[1]] = value;
  }
}

function argValue(name, fallback) {
  const index = process.argv.indexOf(name);
  return index >= 0 && index + 1 < process.argv.length ? process.argv[index + 1] : fallback;
}

function jsonSafe(value) {
  return JSON.stringify(value, (_key, item) => (typeof item === "bigint" ? Number(item) : item), 2);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function withRetry(label, fn, attempts = 8) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (attempt >= attempts) break;
      const waitMs = Math.min(30_000, 750 * 2 ** (attempt - 1)) + Math.floor(Math.random() * 500);
      console.error(`[warn] ${label} failed attempt ${attempt}/${attempts}: ${error.message || error}; retrying in ${waitMs}ms`);
      await sleep(waitMs);
    }
  }
  throw lastError;
}

loadEnvFile(path.join(APP_ROOT, ".env.local"));
loadEnvFile(path.join(APP_ROOT, ".env"));

const year = Number(argValue("--year", "1947"));
const source = argValue("--source", "pakistanlawsite");
const prisma = new PrismaClient();

try {
  const summaryRows = await withRetry("summary", () => prisma.$queryRawUnsafe(
    `
    SELECT
      COUNT(*)::int AS total_jobs,
      COUNT(*) FILTER (WHERE status = 'completed')::int AS completed_jobs,
      COUNT(*) FILTER (WHERE status IN ('pending', 'retry', 'running'))::int AS remaining_jobs,
      COUNT(*) FILTER (WHERE status = 'manual_review')::int AS manual_review_jobs,
      COUNT(DISTINCT legal_judgment_id) FILTER (WHERE status = 'completed' AND legal_judgment_id IS NOT NULL)::int AS distinct_legal_rows,
      MIN(content_length) FILTER (WHERE status = 'completed')::int AS min_content_length,
      AVG(content_length) FILTER (WHERE status = 'completed')::int AS avg_content_length,
      MAX(content_length) FILTER (WHERE status = 'completed')::int AS max_content_length
    FROM pls_capture_jobs
    WHERE source = $1 AND year = $2
    `,
    source,
    year
  ));

  const duplicateInternalRows = await withRetry("duplicate internal citations", () => prisma.$queryRawUnsafe(
    `
    SELECT COUNT(*)::int AS duplicate_internal_citations
    FROM (
      SELECT judgment.citation
      FROM pls_capture_jobs job
      JOIN legal_judgments judgment ON judgment.id = job.legal_judgment_id
      WHERE job.source = $1 AND job.year = $2 AND judgment.citation LIKE 'PLS\\_%' ESCAPE '\\'
      GROUP BY judgment.citation
      HAVING COUNT(*) > 1
    ) duplicates
    `,
    source,
    year
  ));

  const duplicateListingRows = await withRetry("duplicate real listings", () => prisma.$queryRawUnsafe(
    `
    SELECT COUNT(*)::int AS duplicate_real_listings
    FROM (
      SELECT COALESCE(judgment.real_citation, job.citation) AS citation, judgment.title, judgment.court, COUNT(*)::int
      FROM pls_capture_jobs job
      JOIN legal_judgments judgment ON judgment.id = job.legal_judgment_id
      WHERE job.source = $1 AND job.year = $2
      GROUP BY COALESCE(judgment.real_citation, job.citation), judgment.title, judgment.court
      HAVING COUNT(*) > 1
    ) duplicates
    `,
    source,
    year
  ));

  const contentIssueRows = await withRetry("content issues", () => prisma.$queryRawUnsafe(
    `
    SELECT
      COUNT(*) FILTER (WHERE LENGTH(COALESCE(judgment.content, '')) < 500)::int AS short_content,
      COUNT(*) FILTER (WHERE judgment.content ~* '(login|password|captcha)' AND judgment.content !~* 'judg(e)?ment')::int AS possible_login_pages,
      COUNT(*) FILTER (WHERE judgment.content IS NULL OR BTRIM(judgment.content) = '')::int AS empty_content
    FROM pls_capture_jobs job
    JOIN legal_judgments judgment ON judgment.id = job.legal_judgment_id
    WHERE job.source = $1 AND job.year = $2 AND job.status = 'completed'
    `,
    source,
    year
  ));

  const derivedRows = await withRetry("derived signals", () => prisma.$queryRawUnsafe(
    `
    SELECT
      (SELECT COUNT(*)::int
       FROM legal_citation_edges edge
       JOIN pls_capture_jobs job ON job.legal_judgment_id = edge.citing_id
       WHERE job.source = $1 AND job.year = $2) AS citation_edges,
      (SELECT COUNT(DISTINCT edge.cited_key)::int
       FROM legal_citation_edges edge
       JOIN pls_capture_jobs job ON job.legal_judgment_id = edge.citing_id
       WHERE job.source = $1 AND job.year = $2) AS distinct_cited_keys,
      (SELECT COUNT(*)::int
       FROM legal_judgment_statute_refs ref
       JOIN pls_capture_jobs job ON job.legal_judgment_id = ref.judgment_id
       WHERE job.source = $1 AND job.year = $2) AS statute_refs,
      (SELECT COUNT(*)::int
       FROM legal_judgment_headnotes headnote
       JOIN pls_capture_jobs job ON job.legal_judgment_id = headnote.judgment_id
       WHERE job.source = $1 AND job.year = $2) AS headnotes
    `,
    source,
    year
  ));

  const failures = await withRetry("failures", () => prisma.$queryRawUnsafe(
    `
    SELECT case_type_id AS "caseTypeId", citation, status, attempts, failure_count AS "failureCount",
           last_http_status AS "lastHttpStatus", last_error AS "lastError"
    FROM pls_capture_jobs
    WHERE source = $1 AND year = $2 AND status <> 'completed'
    ORDER BY row_no NULLS LAST, case_type_id
    LIMIT 50
    `,
    source,
    year
  ));

  const samples = await withRetry("samples", () => prisma.$queryRawUnsafe(
    `
    SELECT job.case_type_id AS "caseTypeId", judgment.id, judgment.real_citation AS "realCitation",
           judgment.citation AS "internalCitation", judgment.court, judgment.year,
           LEFT(COALESCE(judgment.title, ''), 120) AS title,
           LENGTH(COALESCE(judgment.content, ''))::int AS "contentLength"
    FROM pls_capture_jobs job
    JOIN legal_judgments judgment ON judgment.id = job.legal_judgment_id
    WHERE job.source = $1 AND job.year = $2
    ORDER BY job.row_no NULLS LAST, job.case_type_id
    LIMIT 5
    `,
    source,
    year
  ));

  console.log(
    jsonSafe({
      year,
      source,
      summary: summaryRows[0],
      duplicates: {
        internalCitations: duplicateInternalRows[0]?.duplicate_internal_citations || 0,
        realListings: duplicateListingRows[0]?.duplicate_real_listings || 0,
      },
      contentIssues: contentIssueRows[0],
      derivedSignals: derivedRows[0],
      failures,
      samples,
      sqliteUsed: false,
    })
  );
} finally {
  await prisma.$disconnect();
}
