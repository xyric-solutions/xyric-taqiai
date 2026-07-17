import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { PrismaClient } from "@prisma/client";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const APP_ROOT = path.resolve(SCRIPT_DIR, "..");
const REPO_ROOT = path.resolve(APP_ROOT, "..");
const DEFAULT_WORKLIST = path.join(REPO_ROOT, "data", "pls_all_courts_2012_worklist.json");
const DEFAULT_REPORT = path.join(REPO_ROOT, "data", "pls_2012_validation_report.json");

function parseArgs(argv) {
  const args = {
    worklist: DEFAULT_WORKLIST,
    report: DEFAULT_REPORT,
    source: "pakistanlawsite",
    year: 2012,
    printIssues: 25,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    const next = () => {
      i += 1;
      if (i >= argv.length) throw new Error(`Missing value after ${arg}`);
      return argv[i];
    };
    if (arg === "--worklist") args.worklist = resolvePath(next());
    else if (arg === "--report") args.report = resolvePath(next());
    else if (arg === "--source") args.source = next();
    else if (arg === "--year") args.year = Number(next());
    else if (arg === "--print-issues") args.printIssues = Number(next());
    else if (arg === "--help" || arg === "-h") {
      console.log("Usage: node scripts/validate-pls-2012.mjs [--worklist PATH] [--report PATH]");
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  args.worklist = resolvePath(args.worklist);
  args.report = resolvePath(args.report);
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

function listingKey(row) {
  return [
    compact(row.citation),
    compact(row.title),
    compact(row.court),
  ].join("\t");
}

function displayListingKey(row) {
  return [
    normSpace(row.citation),
    normSpace(row.title).toUpperCase(),
    normSpace(row.court).toUpperCase(),
  ].join("\t");
}

function normalizeCourt(court) {
  const raw = normSpace(court);
  if (!raw) return "Supreme Court of Pakistan";
  if (/supreme/i.test(raw) || raw === "SUPREME-COURT") return "Supreme Court of Pakistan";
  return raw
    .toLowerCase()
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function sha1(text) {
  return createHash("sha1").update(text || "").digest("hex");
}

function percentile(sortedValues, p) {
  if (!sortedValues.length) return null;
  const index = Math.min(sortedValues.length - 1, Math.max(0, Math.floor((p / 100) * sortedValues.length)));
  return sortedValues[index];
}

function sample(items, limit = 20) {
  return items.slice(0, limit);
}

function issue(severity, code, message, extra = {}) {
  return { severity, code, message, ...extra };
}

function hasHtmlLeak(content) {
  return /<(?:html|body|head|script|style|div|span|table|tr|td|br)\b/i.test(content || "");
}

function hasSessionLeak(content) {
  const text = (content || "").slice(0, 3000).toLowerCase();
  return (
    text.includes("/login/check") ||
    text.includes("enter password") ||
    text.includes("logout") && text.includes("pakistan law site") && text.length < 1500 ||
    text.includes("session") && text.includes("sign in") && text.length < 1500
  );
}

function likelyAbruptEnd(content) {
  const text = normSpace(content);
  if (text.length < 500) return true;
  const tail = text.slice(-120);
  if (/[.?!:;)"'\]]\s*$/.test(tail)) return false;
  if (/\b(allowed|dismissed|disposed|accepted|remanded|acquitted|convicted)\s*$/i.test(tail)) return false;
  return /[A-Za-z0-9]$/.test(tail);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  requirePostgresUrl();

  const worklist = JSON.parse(fs.readFileSync(args.worklist, "utf8"));
  if (!Array.isArray(worklist)) throw new Error(`Worklist is not an array: ${args.worklist}`);

  const prisma = new PrismaClient();
  try {
    const jobs = await prisma.$queryRawUnsafe(
      `
      SELECT
        job.source,
        job.year,
        job.case_type_id AS "caseTypeId",
        job.category,
        job.citation,
        job.title,
        job.court,
        job.row_no AS "rowNo",
        job.status,
        job.attempts,
        job.failure_count AS "failureCount",
        job.last_http_status AS "lastHttpStatus",
        job.last_error AS "lastError",
        job.last_response_preview AS "lastResponsePreview",
        job.content_length AS "jobContentLength",
        job.html_length AS "htmlLength",
        job.legal_judgment_id AS "legalJudgmentId",
        job.completed_at AS "completedAt",
        judgment.id AS "judgmentId",
        judgment.citation AS "internalCitation",
        judgment.real_citation AS "realCitation",
        judgment.title AS "judgmentTitle",
        judgment.court AS "judgmentCourt",
        judgment.year AS "judgmentYear",
        judgment.content,
        judgment.processed
      FROM pls_capture_jobs job
      LEFT JOIN legal_judgments judgment ON judgment.id = job.legal_judgment_id
      WHERE job.source = $1 AND job.year = $2
      ORDER BY job.row_no NULLS LAST, job.case_type_id
      `,
      args.source,
      args.year
    );

    const issues = [];
    const worklistByCase = new Map(worklist.map((row) => [row.caseTypeId, row]));
    const jobsByCase = new Map(jobs.map((row) => [row.caseTypeId, row]));
    const worklistKeys = new Map();
    const jobListingKeys = new Map();
    const contentHashes = new Map();
    const legalIds = new Map();
    const internalCitations = new Map();
    const realListingKeys = new Map();

    for (const row of worklist) {
      const key = listingKey(row);
      if (!worklistKeys.has(key)) worklistKeys.set(key, []);
      worklistKeys.get(key).push(row.caseTypeId);
    }

    for (const job of jobs) {
      const expected = worklistByCase.get(job.caseTypeId);
      if (!expected) {
        issues.push(issue("error", "JOB_NOT_IN_WORKLIST", "PostgreSQL job is not present in the 2012 worklist", {
          caseTypeId: job.caseTypeId,
          rowNo: job.rowNo,
        }));
      }

      if (expected) {
        if (normSpace(expected.citation) !== normSpace(job.citation)) {
          issues.push(issue("error", "JOB_CITATION_MISMATCH", "Job citation differs from worklist citation", {
            caseTypeId: job.caseTypeId,
            expected: expected.citation,
            actual: job.citation,
          }));
        }
        if (normSpace(expected.title) !== normSpace(job.title)) {
          issues.push(issue("warning", "JOB_TITLE_MISMATCH", "Job title differs from worklist title", {
            caseTypeId: job.caseTypeId,
            expected: expected.title,
            actual: job.title,
          }));
        }
        if (normalizeCourt(expected.court) !== normSpace(job.court)) {
          issues.push(issue("warning", "JOB_COURT_MISMATCH", "Job court differs from worklist court", {
            caseTypeId: job.caseTypeId,
            expected: expected.court,
            actual: job.court,
          }));
        }
      }

      const key = listingKey(job);
      if (!jobListingKeys.has(key)) jobListingKeys.set(key, []);
      jobListingKeys.get(key).push(job.caseTypeId);

      if (job.legalJudgmentId != null) {
        const id = Number(job.legalJudgmentId);
        if (!legalIds.has(id)) legalIds.set(id, []);
        legalIds.get(id).push(job.caseTypeId);
      }

      if (job.internalCitation) {
        if (!internalCitations.has(job.internalCitation)) internalCitations.set(job.internalCitation, []);
        internalCitations.get(job.internalCitation).push(job.caseTypeId);
      }

      if (job.status === "completed") {
        if (!job.legalJudgmentId || !job.judgmentId) {
          issues.push(issue("error", "COMPLETED_WITHOUT_LEGAL_ROW", "Completed job is missing its legal_judgments row", {
            caseTypeId: job.caseTypeId,
            legalJudgmentId: job.legalJudgmentId,
          }));
          continue;
        }

        const content = String(job.content || "");
        const contentLength = content.length;
        if (contentLength < 500) {
          issues.push(issue("error", "COMPLETED_SHORT_CONTENT", "Completed judgment content is below the scraper minimum", {
            caseTypeId: job.caseTypeId,
            legalJudgmentId: Number(job.legalJudgmentId),
            contentLength,
          }));
        }
        if (Number(job.jobContentLength || 0) !== contentLength) {
          issues.push(issue("error", "CONTENT_LENGTH_MISMATCH", "Job ledger content_length does not match legal_judgments.content length", {
            caseTypeId: job.caseTypeId,
            legalJudgmentId: Number(job.legalJudgmentId),
            jobContentLength: Number(job.jobContentLength || 0),
            actualContentLength: contentLength,
          }));
        }
        if (Number(job.judgmentYear) !== args.year) {
          issues.push(issue("error", "JUDGMENT_YEAR_MISMATCH", "Final judgment year is not 2012", {
            caseTypeId: job.caseTypeId,
            legalJudgmentId: Number(job.legalJudgmentId),
            judgmentYear: Number(job.judgmentYear),
          }));
        }
        if (normSpace(job.realCitation) !== normSpace(job.citation)) {
          issues.push(issue("error", "REAL_CITATION_MISMATCH", "Final real_citation differs from the PLS worklist citation", {
            caseTypeId: job.caseTypeId,
            legalJudgmentId: Number(job.legalJudgmentId),
            jobCitation: job.citation,
            realCitation: job.realCitation,
          }));
        }
        if (!job.internalCitation || !job.internalCitation.startsWith("PLS_ALL_2012_")) {
          issues.push(issue("error", "INTERNAL_CITATION_PREFIX", "Final internal citation does not use the all-courts 2012 prefix", {
            caseTypeId: job.caseTypeId,
            legalJudgmentId: Number(job.legalJudgmentId),
            internalCitation: job.internalCitation,
          }));
        }
        if (hasHtmlLeak(content)) {
          issues.push(issue("error", "HTML_LEAK_IN_CONTENT", "Final content appears to contain unextracted HTML markup", {
            caseTypeId: job.caseTypeId,
            legalJudgmentId: Number(job.legalJudgmentId),
          }));
        }
        if (hasSessionLeak(content)) {
          issues.push(issue("error", "SESSION_PAGE_STORED", "Final content looks like a login/session shell rather than a judgment", {
            caseTypeId: job.caseTypeId,
            legalJudgmentId: Number(job.legalJudgmentId),
          }));
        }
        if (content.includes("\u0000")) {
          issues.push(issue("error", "NUL_BYTE_IN_CONTENT", "Final content contains NUL bytes", {
            caseTypeId: job.caseTypeId,
            legalJudgmentId: Number(job.legalJudgmentId),
          }));
        }
        if (content.includes("\uFFFD")) {
          issues.push(issue("warning", "REPLACEMENT_CHARACTER_IN_CONTENT", "Final content contains Unicode replacement characters", {
            caseTypeId: job.caseTypeId,
            legalJudgmentId: Number(job.legalJudgmentId),
          }));
        }
        if (job.realCitation && !compact(content).includes(compact(job.realCitation))) {
          issues.push(issue("info", "CITATION_NOT_FOUND_IN_CONTENT", "The listed citation is metadata-only or not visible in the extracted judgment body", {
            caseTypeId: job.caseTypeId,
            legalJudgmentId: Number(job.legalJudgmentId),
            realCitation: job.realCitation,
            contentLength,
          }));
        }
        if (likelyAbruptEnd(content)) {
          issues.push(issue("warning", "POSSIBLE_ABRUPT_END", "The extracted text ends without a normal terminal marker; review if this case matters", {
            caseTypeId: job.caseTypeId,
            legalJudgmentId: Number(job.legalJudgmentId),
            contentLength,
            tail: normSpace(content).slice(-180),
          }));
        }

        const contentHash = sha1(content);
        if (!contentHashes.has(contentHash)) contentHashes.set(contentHash, []);
        contentHashes.get(contentHash).push({
          caseTypeId: job.caseTypeId,
          legalJudgmentId: Number(job.legalJudgmentId),
          citation: job.citation,
          title: job.title,
          court: job.court,
        });

        const realKey = listingKey({
          citation: job.realCitation,
          title: job.judgmentTitle,
          court: job.judgmentCourt,
        });
        if (!realListingKeys.has(realKey)) realListingKeys.set(realKey, []);
        realListingKeys.get(realKey).push(job.caseTypeId);
      } else if (job.status === "manual_review") {
        issues.push(issue("error", "MANUAL_REVIEW_NOT_STORED", "PLS repeatedly returned invalid content; no final judgment was stored", {
          caseTypeId: job.caseTypeId,
          citation: job.citation,
          title: job.title,
          court: job.court,
          attempts: Number(job.attempts || 0),
          failureCount: Number(job.failureCount || 0),
          lastError: job.lastError,
          lastResponsePreview: job.lastResponsePreview,
        }));
      } else {
        issues.push(issue("error", "UNFINISHED_JOB", "Job is not completed or manual_review after scrape run", {
          caseTypeId: job.caseTypeId,
          status: job.status,
          attempts: Number(job.attempts || 0),
          lastError: job.lastError,
        }));
      }
    }

    for (const row of worklist) {
      if (!jobsByCase.has(row.caseTypeId)) {
        issues.push(issue("error", "WORKLIST_CASE_MISSING_JOB", "Worklist case has no PostgreSQL job row", {
          caseTypeId: row.caseTypeId,
          citation: row.citation,
          rowNo: row.row_no,
        }));
      }
    }

    const expectedDuplicateListings = [...worklistKeys.entries()]
      .filter(([, rows]) => rows.length > 1)
      .map(([key, caseTypeIds]) => ({
        key,
        displayKey: displayListingKey(worklistByCase.get(caseTypeIds[0])),
        caseTypeIds,
      }));

    for (const [id, caseTypeIds] of legalIds.entries()) {
      if (caseTypeIds.length <= 1) continue;
      const keys = new Set(caseTypeIds.map((caseTypeId) => listingKey(jobsByCase.get(caseTypeId))));
      const severity = keys.size === 1 ? "info" : "error";
      issues.push(issue(severity, "LEGAL_ROW_LINKED_TO_MULTIPLE_JOBS", "Multiple jobs point at one legal_judgments row", {
        legalJudgmentId: id,
        caseTypeIds,
        sameListing: keys.size === 1,
      }));
    }

    for (const [citation, caseTypeIds] of internalCitations.entries()) {
      if (caseTypeIds.length > 1) {
        const keys = new Set(caseTypeIds.map((caseTypeId) => listingKey(jobsByCase.get(caseTypeId))));
        const severity = keys.size === 1 ? "info" : "error";
        issues.push(issue(severity, "DUPLICATE_INTERNAL_CITATION", "Multiple jobs share one internal PLS citation", {
          internalCitation: citation,
          caseTypeIds,
          sameListing: keys.size === 1,
        }));
      }
    }

    for (const [hash, rows] of contentHashes.entries()) {
      if (rows.length <= 1) continue;
      const keys = new Set(rows.map((row) => listingKey(row)));
      const severity = keys.size === 1 ? "info" : "warning";
      issues.push(issue(severity, "DUPLICATE_CONTENT_HASH", "Multiple completed jobs have identical extracted content", {
        contentHash: hash,
        rows,
        sameListing: keys.size === 1,
      }));
    }

    for (const [key, caseTypeIds] of realListingKeys.entries()) {
      if (caseTypeIds.length <= 1) continue;
      const expected = expectedDuplicateListings.some((item) => item.key === key);
      issues.push(issue(expected ? "info" : "warning", "DUPLICATE_REAL_LISTING", "Multiple completed jobs share citation/title/court metadata", {
        key,
        caseTypeIds,
        expectedDuplicateListing: expected,
      }));
    }

    const completedRows = jobs.filter((row) => row.status === "completed" && row.content);
    const lengths = completedRows.map((row) => String(row.content || "").length).sort((a, b) => a - b);
    const statusCounts = jobs.reduce((acc, row) => {
      acc[row.status] = (acc[row.status] || 0) + 1;
      return acc;
    }, {});
    const severityCounts = issues.reduce((acc, row) => {
      acc[row.severity] = (acc[row.severity] || 0) + 1;
      return acc;
    }, {});

    const report = {
      generatedAt: new Date().toISOString(),
      source: args.source,
      year: args.year,
      worklistPath: args.worklist,
      counts: {
        worklistRows: worklist.length,
        uniqueWorklistCaseTypeIds: new Set(worklist.map((row) => row.caseTypeId)).size,
        postgresqlJobs: jobs.length,
        statusCounts,
        completedJobs: statusCounts.completed || 0,
        completedDistinctLegalJudgments: new Set(
          jobs.filter((row) => row.status === "completed" && row.legalJudgmentId != null).map((row) => Number(row.legalJudgmentId))
        ).size,
        manualReview: statusCounts.manual_review || 0,
        pendingOrRetryOrRunning: (statusCounts.pending || 0) + (statusCounts.retry || 0) + (statusCounts.running || 0),
        expectedDuplicateListings: expectedDuplicateListings.length,
      },
      contentLength: {
        min: lengths[0] || 0,
        p1: percentile(lengths, 1),
        p5: percentile(lengths, 5),
        median: percentile(lengths, 50),
        p95: percentile(lengths, 95),
        max: lengths[lengths.length - 1] || 0,
      },
      expectedDuplicateListings,
      severityCounts,
      issueCount: issues.length,
      issues,
      issueSamples: {
        errors: sample(issues.filter((row) => row.severity === "error"), args.printIssues),
        warnings: sample(issues.filter((row) => row.severity === "warning"), args.printIssues),
        info: sample(issues.filter((row) => row.severity === "info"), args.printIssues),
      },
    };

    fs.mkdirSync(path.dirname(args.report), { recursive: true });
    fs.writeFileSync(args.report, JSON.stringify(report, null, 2), "utf8");

    console.log(JSON.stringify({
      report: args.report,
      counts: report.counts,
      contentLength: report.contentLength,
      severityCounts: report.severityCounts,
      issueSamples: report.issueSamples,
    }, null, 2));
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error?.stack || error?.message || String(error));
  process.exit(1);
});
