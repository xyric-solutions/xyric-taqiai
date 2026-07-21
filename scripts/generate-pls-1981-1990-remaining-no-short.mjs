import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "..", "..");
const dataDir = path.join(repoRoot, "data");
const worklistPath = path.join(dataDir, "pls_all_courts_1981_1990_worklist.json");
const capturePath = path.join(dataDir, "pls_1981_1990_fast_capture.jsonl");
const statePath = path.join(dataDir, "pls_1981_1990_fast_capture.state.json");
const failuresPath = path.join(dataDir, "pls_1981_1990_fast_failures.jsonl");
const outWorklistPath = path.join(dataDir, "pls_all_courts_1981_1990_remaining_no_short_worklist.json");
const outReportJsonPath = path.join(dataDir, "pls_1981_1990_remaining_short_content_report.json");
const outReportCsvPath = path.join(dataDir, "pls_1981_1990_remaining_short_content_report.csv");
const SHORT_LIMIT = 500;

function norm(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function shortLength(reason) {
  const match = String(reason || "").match(/short content length\s+(\d+)|content too short\s+\((\d+)\)/i);
  return match ? Number(match[1] || match[2]) : null;
}

async function completedFromJsonl(filePath) {
  const completed = new Set();
  if (!fs.existsSync(filePath)) return completed;
  const rl = readline.createInterface({
    input: fs.createReadStream(filePath, "utf8"),
    crlfDelay: Infinity,
  });
  for await (const line of rl) {
    if (!line.trim()) continue;
    try {
      const record = JSON.parse(line);
      const caseTypeId = norm(record.caseTypeId || record.caseName || record.case_type_id);
      if (caseTypeId) completed.add(caseTypeId);
    } catch {
      // Ignore a partial trailing line if the capture file is being appended.
    }
  }
  return completed;
}

function addShort(shorts, item) {
  const caseTypeId = norm(item.caseTypeId || item.caseName || item.case_type_id);
  if (!caseTypeId) return;
  const reason = item.lastError || item.error || item.reason || item.message || "";
  const length = shortLength(reason);
  if (length === null || length >= SHORT_LIMIT) return;
  const previous = shorts.get(caseTypeId);
  if (!previous || length < previous.shortLength) {
    shorts.set(caseTypeId, {
      caseTypeId,
      citation: norm(item.citation),
      title: norm(item.title),
      court: norm(item.court),
      year: Number(item.year || 0) || null,
      status: norm(item.status),
      attempts: Number(item.attempts || 0),
      failureCount: Number(item.failureCount || item.failure_count || 0),
      transientFailureCount: Number(item.transientFailureCount || item.transient_failure_count || 0),
      shortLength: length,
      lastError: norm(reason),
    });
  }
}

async function addFailures(shorts, filePath) {
  if (!fs.existsSync(filePath)) return;
  const rl = readline.createInterface({
    input: fs.createReadStream(filePath, "utf8"),
    crlfDelay: Infinity,
  });
  for await (const line of rl) {
    if (!line.trim()) continue;
    try {
      addShort(shorts, JSON.parse(line));
    } catch {
      // Ignore corrupt/partial failure lines.
    }
  }
}

function csv(value) {
  const text = String(value ?? "");
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

async function main() {
  const worklist = JSON.parse(fs.readFileSync(worklistPath, "utf8"));
  if (!Array.isArray(worklist)) throw new Error(`Worklist is not an array: ${worklistPath}`);

  const completed = await completedFromJsonl(capturePath);
  const shorts = new Map();
  if (fs.existsSync(statePath)) {
    const state = JSON.parse(fs.readFileSync(statePath, "utf8"));
    for (const job of state.jobs || []) addShort(shorts, job);
  }
  await addFailures(shorts, failuresPath);

  const workByCase = new Map();
  for (const item of worklist) {
    const caseTypeId = norm(item.caseTypeId || item.caseName);
    if (caseTypeId) workByCase.set(caseTypeId, item);
  }

  const shortRemaining = Array.from(shorts.values())
    .filter((item) => workByCase.has(item.caseTypeId) && !completed.has(item.caseTypeId))
    .sort((a, b) => (a.year || 0) - (b.year || 0) || a.caseTypeId.localeCompare(b.caseTypeId));

  const shortSet = new Set(shortRemaining.map((item) => item.caseTypeId));
  const remainingNoShort = worklist.filter((item) => {
    const caseTypeId = norm(item.caseTypeId || item.caseName);
    return caseTypeId && !completed.has(caseTypeId) && !shortSet.has(caseTypeId);
  });

  fs.writeFileSync(outWorklistPath, JSON.stringify(remainingNoShort, null, 2), "utf8");
  fs.writeFileSync(
    outReportJsonPath,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        totalWorklist: worklist.length,
        completed: completed.size,
        remainingBeforeShortFilter: worklist.length - completed.size,
        knownShortRemaining: shortRemaining.length,
        remainingNoShort: remainingNoShort.length,
        shortLimit: SHORT_LIMIT,
        shortReport: shortRemaining,
        outWorklist: outWorklistPath,
      },
      null,
      2
    ),
    "utf8"
  );
  fs.writeFileSync(
    outReportCsvPath,
    [
      ["caseTypeId", "citation", "year", "court", "status", "attempts", "failureCount", "transientFailureCount", "shortLength", "title", "lastError"].join(","),
      ...shortRemaining.map((item) =>
        [
          item.caseTypeId,
          item.citation,
          item.year,
          item.court,
          item.status,
          item.attempts,
          item.failureCount,
          item.transientFailureCount,
          item.shortLength,
          item.title,
          item.lastError,
        ].map(csv).join(",")
      ),
    ].join("\n") + "\n",
    "utf8"
  );

  console.log(JSON.stringify({
    completed: completed.size,
    remainingBeforeShortFilter: worklist.length - completed.size,
    knownShortRemaining: shortRemaining.length,
    remainingNoShort: remainingNoShort.length,
    outWorklist: outWorklistPath,
    reportJson: outReportJsonPath,
    reportCsv: outReportCsvPath,
  }, null, 2));
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
