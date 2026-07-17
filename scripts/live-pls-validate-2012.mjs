import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { PrismaClient } from "@prisma/client";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const APP_ROOT = path.resolve(SCRIPT_DIR, "..");
const REPO_ROOT = path.resolve(APP_ROOT, "..");
const DEFAULT_VALIDATION_REPORT = path.join(REPO_ROOT, "data", "pls_2012_validation_report_after_fix.json");
const DEFAULT_LIVE_REPORT = path.join(REPO_ROOT, "data", "pls_2012_live_validation_report.json");

function parseArgs(argv) {
  const args = {
    apply: false,
    host: "127.0.0.1",
    port: 8772,
    source: "pakistanlawsite",
    year: 2012,
    report: DEFAULT_VALIDATION_REPORT,
    out: DEFAULT_LIVE_REPORT,
    limit: 0,
    workers: 3,
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
    else if (arg === "--host") args.host = next();
    else if (arg === "--port") args.port = Number(next());
    else if (arg === "--source") args.source = next();
    else if (arg === "--year") args.year = Number(next());
    else if (arg === "--report") args.report = resolvePath(next());
    else if (arg === "--out") args.out = resolvePath(next());
    else if (arg === "--limit") args.limit = Number(next());
    else if (arg === "--workers") args.workers = Number(next());
    else if (arg === "--help" || arg === "-h") {
      console.log("Usage: node scripts/live-pls-validate-2012.mjs [--apply] [--limit N]");
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  args.report = resolvePath(args.report);
  args.out = resolvePath(args.out);
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

function citationReporter(citation, category) {
  const match = normSpace(citation).match(/\b(SCMR|PLD|PCRLJ|PCrLJ|MLD|CLC|YLR|PLJ|NLR|CLD|KLR)\b/i);
  return (match?.[1] || category || "").toUpperCase() || null;
}

function courtLevel(court) {
  if (/supreme court/i.test(court)) return "Supreme Court";
  if (/high court/i.test(court)) return "High Court";
  if (/shariat/i.test(court)) return "Federal Shariat Court";
  return null;
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json; charset=utf-8",
  });
  res.end(JSON.stringify(payload, (_key, value) => (typeof value === "bigint" ? Number(value) : value)));
}

function firstDiffIndex(a, b) {
  const limit = Math.min(a.length, b.length);
  for (let i = 0; i < limit; i += 1) {
    if (a[i] !== b[i]) return i;
  }
  return a.length === b.length ? -1 : limit;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function withRetry(label, fn, attempts = 6) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (attempt >= attempts) break;
      const waitMs = Math.min(30_000, 1000 * 2 ** (attempt - 1)) + Math.floor(Math.random() * 500);
      console.warn(`${label} failed attempt ${attempt}/${attempts}: ${error.message}`);
      await sleep(waitMs);
    }
  }
  throw lastError;
}

async function readJsonBody(req, maxBytes = 25 * 1024 * 1024) {
  let size = 0;
  const chunks = [];
  for await (const chunk of req) {
    size += chunk.length;
    if (size > maxBytes) throw new Error(`Request body too large (${size} bytes)`);
    chunks.push(chunk);
  }
  const text = Buffer.concat(chunks).toString("utf8");
  return text ? JSON.parse(text) : {};
}

function selectCaseIds(reportPath, limit) {
  const report = JSON.parse(fs.readFileSync(reportPath, "utf8"));
  const ids = [];
  for (const row of report.issues || []) {
    if (row.code === "POSSIBLE_ABRUPT_END" || row.code === "MANUAL_REVIEW_NOT_STORED") {
      ids.push(row.caseTypeId);
    }
  }
  const unique = [...new Set(ids)].filter(Boolean);
  return limit > 0 ? unique.slice(0, limit) : unique;
}

function browserScript(baseUrl, workers) {
  return `
(async () => {
  const API = ${JSON.stringify(baseUrl)};
  const WORKERS = ${Number(workers)};
  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
  function status(text) {
    let box = document.getElementById("codex-pls-live-validator-status");
    if (!box) {
      box = document.createElement("div");
      box.id = "codex-pls-live-validator-status";
      box.style.cssText = "position:fixed;z-index:2147483647;right:12px;bottom:58px;background:#063;color:#fff;padding:10px 12px;border-radius:6px;font:13px Arial;max-width:520px;box-shadow:0 4px 18px rgba(0,0,0,.25)";
      document.body.appendChild(box);
    }
    box.textContent = text;
  }
  function textFromHtml(html) {
    html = String(html || "")
      .replace(/<script\\b[\\s\\S]*?<\\/script>/gi, " ")
      .replace(/<style\\b[\\s\\S]*?<\\/style>/gi, " ")
      .replace(/<!--[\\s\\S]*?-->/g, " ");
    const div = document.createElement("div");
    div.innerHTML = html;
    return (div.innerText || div.textContent || "").replace(/\\s+/g, " ").trim();
  }
  async function api(path, options = {}) {
    const res = await fetch(API + path, {
      ...options,
      mode: "cors",
      headers: { "Content-Type": "application/json", ...(options.headers || {}) }
    });
    const text = await res.text();
    let payload = {};
    try { payload = text ? JSON.parse(text) : {}; } catch {}
    if (!res.ok) throw new Error(payload.error || text || "HTTP " + res.status);
    return payload;
  }
  async function fetchCase(item) {
    const started = Date.now();
    const body = new URLSearchParams();
    body.set("caseName", item.caseTypeId);
    body.set("headNotes", "0");
    const response = await fetch("/Login/GetCaseFile", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
      body: body.toString()
    });
    const raw = await response.text();
    let html = raw;
    try {
      const parsed = JSON.parse(raw);
      if (typeof parsed === "string") html = parsed;
    } catch {}
    const content = textFromHtml(html);
    return {
      caseTypeId: item.caseTypeId,
      httpStatus: response.status,
      ok: response.ok && content.length >= 500,
      content,
      contentLength: content.length,
      htmlLength: html.length,
      textTail: content.slice(-220),
      htmlTail: html.slice(-500),
      elapsedMs: Date.now() - started
    };
  }
  const config = await api("/config");
  let index = 0;
  let done = 0;
  async function worker(workerId) {
    while (index < config.items.length) {
      const item = config.items[index++];
      status("PLS live validator | " + done + "/" + config.items.length + " | worker " + workerId + " " + item.caseTypeId);
      try {
        const result = await fetchCase(item);
        await api("/result", { method: "POST", body: JSON.stringify(result) });
      } catch (error) {
        await api("/result", {
          method: "POST",
          body: JSON.stringify({ caseTypeId: item.caseTypeId, ok: false, error: String(error && error.message || error) })
        });
      }
      done += 1;
      await sleep(150);
    }
  }
  await Promise.all(Array.from({ length: WORKERS }, (_, idx) => worker(idx + 1)));
  const finalStatus = await api("/done", { method: "POST", body: JSON.stringify({ done }) });
  status("PLS live validator DONE | checked=" + finalStatus.checked + " updated=" + finalStatus.updated + " failed=" + finalStatus.failed);
  console.log("PLS live validation final", finalStatus);
})();
`;
}

async function upsertManualReview(prisma, job, live, args) {
  const targetCitation = stableListingCitation(job, args.citationPrefix);
  const nowMs = Date.now();
  const reporter = citationReporter(job.citation, job.category);
  const level = courtLevel(job.court);
  const province = level === "Supreme Court" || level === "Federal Shariat Court" ? "Federal" : null;
  let judgmentId = job.legalJudgmentId ? Number(job.legalJudgmentId) : null;
  if (!judgmentId) {
    const existing = await prisma.$queryRawUnsafe(
      `SELECT id FROM legal_judgments WHERE citation = $1 ORDER BY id LIMIT 1`,
      targetCitation
    );
    judgmentId = existing[0]?.id ? Number(existing[0].id) : null;
  }
  await prisma.$transaction(
    async (tx) => {
      if (!judgmentId) {
        const idRows = await tx.$queryRawUnsafe(`SELECT nextval('legal_judgments_pls_id_seq')::int AS id`);
        judgmentId = Number(idRows[0].id);
        await tx.$executeRawUnsafe(
          `
          INSERT INTO legal_judgments
            (id, citation, court, year, content, processed, created_at, title, real_citation,
             law_category, case_type, court_level, province, reported_status, citation_reporter, tagged_at)
          VALUES
            ($1, $2, $3, $4, $5, 1, $6, $7, $8, 'case_law', $9, $10, $11, $12, $13, $14)
          `,
          judgmentId,
          targetCitation,
          job.court,
          Number(job.year || args.year),
          live.content,
          nowMs,
          job.title || null,
          job.citation || null,
          job.category || reporter || null,
          level,
          province,
          job.citation ? "reported" : null,
          reporter,
          nowMs
        );
      } else {
        await tx.$executeRawUnsafe(
          `
          UPDATE legal_judgments SET
            citation = $2,
            court = $3,
            year = $4,
            content = $5,
            processed = 1,
            title = $6,
            real_citation = $7,
            law_category = 'case_law',
            case_type = $8,
            court_level = $9,
            province = $10,
            reported_status = $11,
            citation_reporter = $12,
            tagged_at = COALESCE(tagged_at, $13)
          WHERE id = $1
          `,
          judgmentId,
          targetCitation,
          job.court,
          Number(job.year || args.year),
          live.content,
          job.title || null,
          job.citation || null,
          job.category || reporter || null,
          level,
          province,
          job.citation ? "reported" : null,
          reporter,
          nowMs
        );
      }
      await tx.$executeRawUnsafe(
        `
        UPDATE pls_capture_jobs SET
          status = 'completed',
          lease_token = NULL,
          leased_at = NULL,
          last_http_status = $2,
          last_error = NULL,
          last_stack = NULL,
          last_response_preview = NULL,
          content_length = $3,
          html_length = $4,
          legal_judgment_id = $5,
          completed_at = COALESCE(completed_at, now()),
          last_scraped_at = now(),
          updated_at = now()
        WHERE case_type_id = $1
        `,
        job.caseTypeId,
        live.httpStatus || 200,
        live.contentLength,
        live.htmlLength || null,
        judgmentId
      );
    },
    { timeout: 120_000 }
  );
  return judgmentId;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  requirePostgresUrl();
  const prisma = new PrismaClient();
  const caseIds = selectCaseIds(args.report, args.limit);
  if (!caseIds.length) throw new Error(`No live validation cases selected from ${args.report}`);

  const rows = await withRetry(
    "load live validation cases",
    () => prisma.$queryRawUnsafe(
      `
      SELECT
        job.case_type_id AS "caseTypeId",
        job.year,
        job.category,
        job.citation,
        job.title,
        job.court,
        job.status,
        job.legal_judgment_id AS "legalJudgmentId",
        judgment.content AS "storedContent"
      FROM pls_capture_jobs job
      LEFT JOIN legal_judgments judgment ON judgment.id = job.legal_judgment_id
      WHERE job.source = $1 AND job.year = $2 AND job.case_type_id = ANY($3::text[])
      ORDER BY job.row_no NULLS LAST, job.case_type_id
      `,
      args.source,
      args.year,
      caseIds
    )
  );
  const jobs = new Map(rows.map((row) => [row.caseTypeId, row]));
  const results = [];
  const summary = {
    total: rows.length,
    checked: 0,
    exactMatches: 0,
    liveExtendsStored: 0,
    storedExtendsLive: 0,
    different: 0,
    failed: 0,
    updated: 0,
    manualRecovered: 0,
  };

  function writeReport() {
    fs.mkdirSync(path.dirname(args.out), { recursive: true });
    fs.writeFileSync(args.out, JSON.stringify({
      generatedAt: new Date().toISOString(),
      apply: args.apply,
      source: args.source,
      year: args.year,
      summary,
      results,
    }, null, 2), "utf8");
  }

  const server = http.createServer(async (req, res) => {
    try {
      if (req.method === "OPTIONS") return sendJson(res, 200, { ok: true });
      const url = new URL(req.url || "/", `http://${args.host}:${args.port}`);
      if (req.method === "GET" && url.pathname === "/config") {
        return sendJson(res, 200, {
          ok: true,
          items: rows.map((row) => ({
            caseTypeId: row.caseTypeId,
            citation: row.citation,
            title: row.title,
            court: row.court,
            category: row.category,
            year: row.year,
          })),
        });
      }
      if (req.method === "GET" && url.pathname === "/pls_live_validate.js") {
        res.writeHead(200, {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/javascript; charset=utf-8",
        });
        res.end(browserScript(`http://${args.host}:${args.port}`, args.workers));
        return;
      }
      if (req.method === "GET" && url.pathname === "/summary") {
        return sendJson(res, 200, { ok: true, summary, report: args.out });
      }
      if (req.method === "POST" && url.pathname === "/result") {
        const live = await readJsonBody(req);
        const job = jobs.get(live.caseTypeId);
        const stored = String(job?.storedContent || "");
        const item = {
          caseTypeId: live.caseTypeId,
          citation: job?.citation,
          title: job?.title,
          statusBefore: job?.status,
          ok: Boolean(live.ok),
          httpStatus: live.httpStatus || null,
          storedLength: stored.length,
          liveLength: Number(live.contentLength || 0),
          relation: null,
          updated: false,
          error: live.error || null,
          storedTail: stored.slice(-220),
          liveTail: String(live.textTail || ""),
          htmlTail: String(live.htmlTail || ""),
        };
        item.storedHead = stored.slice(0, 300);
        item.liveHead = String(live.content || "").slice(0, 300);
        item.firstDiffIndex = firstDiffIndex(stored, String(live.content || ""));
        if (item.firstDiffIndex >= 0) {
          item.storedAroundDiff = stored.slice(Math.max(0, item.firstDiffIndex - 120), item.firstDiffIndex + 220);
          item.liveAroundDiff = String(live.content || "").slice(Math.max(0, item.firstDiffIndex - 120), item.firstDiffIndex + 220);
        }
        item.storedSnippetFoundInLive = stored.length >= 1000
          ? String(live.content || "").includes(stored.slice(0, 1000))
          : Boolean(stored && String(live.content || "").includes(stored));
        summary.checked += 1;
        if (!live.ok || !job) {
          item.relation = "failed";
          summary.failed += 1;
        } else if (!stored && job.status === "manual_review") {
          item.relation = "manual_recovered";
          if (args.apply) {
            item.legalJudgmentId = await upsertManualReview(prisma, job, live, args);
            item.updated = true;
            job.status = "completed";
            job.storedContent = live.content;
            job.legalJudgmentId = item.legalJudgmentId;
            summary.updated += 1;
            summary.manualRecovered += 1;
          }
        } else if (live.content === stored) {
          item.relation = "exact_match";
          summary.exactMatches += 1;
        } else if (live.content.startsWith(stored)) {
          item.relation = "live_extends_stored";
          summary.liveExtendsStored += 1;
          if (args.apply) {
            await prisma.$transaction(async (tx) => {
              await tx.$executeRawUnsafe(
                `UPDATE legal_judgments SET content = $2 WHERE id = $1`,
                Number(job.legalJudgmentId),
                live.content
              );
              await tx.$executeRawUnsafe(
                `
                UPDATE pls_capture_jobs SET
                  content_length = $2,
                  html_length = $3,
                  last_scraped_at = now(),
                  updated_at = now()
                WHERE case_type_id = $1
                `,
                live.caseTypeId,
                live.contentLength,
                live.htmlLength || null
              );
            });
            item.updated = true;
            job.storedContent = live.content;
            summary.updated += 1;
          }
        } else if (stored.startsWith(live.content)) {
          item.relation = "stored_extends_live";
          summary.storedExtendsLive += 1;
        } else {
          item.relation = "different";
          summary.different += 1;
        }
        results.push(item);
        writeReport();
        return sendJson(res, 200, { ok: true, item, summary });
      }
      if (req.method === "POST" && url.pathname === "/done") {
        writeReport();
        sendJson(res, 200, { ok: true, ...summary, report: args.out });
        setTimeout(async () => {
          server.close();
          await prisma.$disconnect();
          process.exit(0);
        }, 500);
        return;
      }
      return sendJson(res, 404, { ok: false, error: "not found" });
    } catch (error) {
      return sendJson(res, 500, { ok: false, error: error.message, stack: error.stack });
    }
  });

  server.listen(args.port, args.host, () => {
    writeReport();
    console.log(`READY http://${args.host}:${args.port}/pls_live_validate.js`);
    console.log(`REPORT ${args.out}`);
    console.log(`CASES ${rows.length}`);
  });
}

main().catch((error) => {
  console.error(error?.stack || error?.message || String(error));
  process.exit(1);
});
