/**
 * Pakistan Law Site range worklist discovery server.
 *
 * This serves a browser-side discovery script that runs inside the logged-in
 * Pakistan Law Site tab, searches each reporter category for each year, and
 * saves PostgreSQL capture worklists as JSON files. It does not use SQLite and
 * does not store final judgment data. Final data capture is handled by
 * scripts/pls-pg-capture.mjs against PostgreSQL.
 *
 * Usage:
 *   node scripts/pls-discover-range.mjs --from 1950 --to 1960 --port 8780
 *   # paste printed bootstrap in the logged-in PLS tab
 */
import fs from "node:fs";
import http from "node:http";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const APP_ROOT = path.resolve(SCRIPT_DIR, "..");
const REPO_ROOT = path.resolve(APP_ROOT, "..");
const DEFAULT_PORT = 8780;

function parseArgs(argv) {
  const args = {
    host: "127.0.0.1",
    port: DEFAULT_PORT,
    from: 1950,
    to: 1960,
    dataDir: path.join(REPO_ROOT, "data"),
    force: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    const next = () => {
      i += 1;
      if (i >= argv.length) throw new Error(`Missing value after ${arg}`);
      return argv[i];
    };
    if (arg === "--host") args.host = next();
    else if (arg === "--port") args.port = Number(next());
    else if (arg === "--from" || arg === "--year-from") args.from = Number(next());
    else if (arg === "--to" || arg === "--year-to") args.to = Number(next());
    else if (arg === "--data-dir") args.dataDir = path.resolve(next());
    else if (arg === "--force") args.force = true;
    else if (arg === "--help" || arg === "-h") {
      console.log("Usage: node scripts/pls-discover-range.mjs --from 1950 --to 1960 [--port 8780] [--force]");
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  if (!Number.isInteger(args.from) || !Number.isInteger(args.to) || args.from < 1800 || args.to > 2100 || args.to < args.from) {
    throw new Error(`Invalid year range: ${args.from}-${args.to}`);
  }
  fs.mkdirSync(args.dataDir, { recursive: true });
  return args;
}

function jsonSafe(value) {
  return JSON.stringify(value, (_key, item) => (typeof item === "bigint" ? Number(item) : item));
}

function normSpace(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function compact(value) {
  return normSpace(value).replace(/[^a-z0-9]+/gi, "").toLowerCase();
}

function rangeName(args) {
  return `${args.from}_${args.to}`;
}

function yearWorklistPath(args, year) {
  return path.join(args.dataDir, `pls_all_courts_${year}_worklist.json`);
}

function yearSummaryPath(args, year) {
  return path.join(args.dataDir, `pls_all_courts_${year}_worklist_summary.json`);
}

function combinedWorklistPath(args) {
  return path.join(args.dataDir, `pls_all_courts_${rangeName(args)}_worklist.json`);
}

function combinedSummaryPath(args) {
  return path.join(args.dataDir, `pls_all_courts_${rangeName(args)}_worklist_summary.json`);
}

function readJsonFile(filePath, fallback) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return fallback;
  }
}

function uniqueItems(items) {
  const seen = new Set();
  const duplicateCaseTypeIds = [];
  const out = [];
  for (const item of items || []) {
    const caseTypeId = normSpace(item.caseTypeId);
    if (!caseTypeId) continue;
    if (seen.has(caseTypeId)) {
      duplicateCaseTypeIds.push(caseTypeId);
      continue;
    }
    seen.add(caseTypeId);
    out.push({
      caseTypeId,
      category: normSpace(item.category),
      citation: normSpace(item.citation),
      court: normSpace(item.court),
      row_no: Number(item.row_no || 0) || null,
      title: normSpace(item.title),
      year: Number(item.year || 0) || null,
    });
  }
  out.sort(
    (a, b) =>
      Number(a.year || 0) - Number(b.year || 0) ||
      String(a.citation || "").localeCompare(String(b.citation || ""), undefined, { numeric: true }) ||
      String(a.caseTypeId || "").localeCompare(String(b.caseTypeId || ""), undefined, { numeric: true })
  );
  return { items: out, duplicateCaseTypeIds };
}

function courtBreakdown(items) {
  const counts = new Map();
  for (const item of items) counts.set(item.court || "", (counts.get(item.court || "") || 0) + 1);
  return [...counts.entries()].map(([court, count]) => ({ court, count })).sort((a, b) => b.count - a.count || a.court.localeCompare(b.court));
}

function saveCombined(args) {
  const all = [];
  const byYear = [];
  for (let year = args.from; year <= args.to; year += 1) {
    const items = readJsonFile(yearWorklistPath(args, year), []);
    if (Array.isArray(items)) {
      all.push(...items);
      byYear.push({ year, rows: items.length, exists: fs.existsSync(yearWorklistPath(args, year)) });
    } else {
      byYear.push({ year, rows: 0, exists: false });
    }
  }
  const unique = uniqueItems(all);
  const summary = {
    generatedAt: new Date().toISOString(),
    search: { type: "Index Search by reporter categories", from: args.from, to: args.to, court: "" },
    rows: unique.items.length,
    uniqueCaseTypeIds: unique.items.length,
    duplicateCaseTypeIds: unique.duplicateCaseTypeIds,
    byYear,
    courtBreakdown: courtBreakdown(unique.items),
    first: unique.items.slice(0, 5),
    last: unique.items.slice(-5),
  };
  fs.writeFileSync(combinedWorklistPath(args), JSON.stringify(unique.items, null, 2), "utf8");
  fs.writeFileSync(combinedSummaryPath(args), JSON.stringify(summary, null, 2), "utf8");
  return summary;
}

function saveYear(args, payload) {
  const year = Number(payload.year || 0);
  if (year < args.from || year > args.to) throw new Error(`Year ${year} is outside configured range ${args.from}-${args.to}`);
  const unique = uniqueItems((payload.items || []).map((item) => ({ ...item, year })));
  const categoryBreakdown = Array.isArray(payload.categoryBreakdown) ? payload.categoryBreakdown : [];
  const summary = {
    generatedAt: new Date().toISOString(),
    sourceUrl: normSpace(payload.sourceUrl),
    search: { type: "Index Search by reporter categories", year, court: "" },
    rows: unique.items.length,
    uniqueCaseTypeIds: unique.items.length,
    duplicateCaseTypeIds: unique.duplicateCaseTypeIds,
    categoryBreakdown,
    courtBreakdown: courtBreakdown(unique.items),
    first: unique.items.slice(0, 5),
    last: unique.items.slice(-5),
  };
  fs.writeFileSync(yearWorklistPath(args, year), JSON.stringify(unique.items, null, 2), "utf8");
  fs.writeFileSync(yearSummaryPath(args, year), JSON.stringify(summary, null, 2), "utf8");
  const combined = saveCombined(args);
  return { year, rows: unique.items.length, summary, combined };
}

function statusPayload(args) {
  const years = [];
  for (let year = args.from; year <= args.to; year += 1) {
    const items = readJsonFile(yearWorklistPath(args, year), []);
    years.push({
      year,
      discovered: Array.isArray(items) && fs.existsSync(yearWorklistPath(args, year)),
      rows: Array.isArray(items) ? items.length : 0,
      worklistPath: yearWorklistPath(args, year),
    });
  }
  const combined = fs.existsSync(combinedWorklistPath(args)) ? readJsonFile(combinedSummaryPath(args), null) : saveCombined(args);
  return {
    ok: true,
    from: args.from,
    to: args.to,
    force: args.force,
    years,
    combined,
    paths: {
      combinedWorklist: combinedWorklistPath(args),
      combinedSummary: combinedSummaryPath(args),
    },
    process: {
      pid: process.pid,
      rssMb: Number((process.memoryUsage().rss / 1024 / 1024).toFixed(1)),
      cpuCount: os.cpus().length,
    },
  };
}

async function readJsonBody(req, maxBytes = 10 * 1024 * 1024) {
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

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json; charset=utf-8",
  });
  res.end(jsonSafe(payload));
}

function discoverScript(args) {
  const api = `http://${args.host}:${args.port}`;
  return `
(async () => {
  const API = ${JSON.stringify(api)};
  const FROM = ${Number(args.from)};
  const TO = ${Number(args.to)};
  const FORCE = new URL((document.currentScript && document.currentScript.src) || API + "/pls_discover_range.js").searchParams.get("force") === "1";
  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
  const jitter = ms => ms + Math.floor(Math.random() * 250);

  function status(text) {
    let box = document.getElementById("codex-pls-discovery-status");
    if (!box) {
      box = document.createElement("div");
      box.id = "codex-pls-discovery-status";
      box.style.cssText = "position:fixed;z-index:2147483647;left:12px;bottom:12px;background:#093;color:#fff;padding:10px 12px;border-radius:6px;font:13px Arial;max-width:520px;box-shadow:0 4px 18px rgba(0,0,0,.25)";
      document.body.appendChild(box);
    }
    box.textContent = text;
  }

  async function api(path, options = {}) {
    const res = await fetch(API + path, {
      ...options,
      mode: "cors",
      headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    });
    const text = await res.text();
    let payload = {};
    try { payload = text ? JSON.parse(text) : {}; } catch {}
    if (!res.ok) throw new Error(payload.error || text || "HTTP " + res.status);
    return payload;
  }

  async function apiWithRetry(path, options = {}, label = path) {
    let attempt = 1;
    while (true) {
      try {
        return await api(path, options);
      } catch (error) {
        status("PLS discovery waiting: " + label + " failed (" + (error && error.message || error) + ")");
        await sleep(jitter(Math.min(60000, 1000 * 2 ** Math.min(6, attempt - 1))));
        attempt += 1;
      }
    }
  }

  async function waitForOnline(label) {
    while (navigator.onLine === false) {
      status("PLS discovery paused: internet offline; waiting to resume " + label);
      await sleep(5000);
    }
  }

  function norm(text) {
    return String(text || "").replace(/\\s+/g, " ").trim();
  }

  function valueSetter(el, value) {
    const proto = Object.getPrototypeOf(el);
    const desc = Object.getOwnPropertyDescriptor(proto, "value");
    if (desc && desc.set) desc.set.call(el, value);
    else el.value = value;
    el.dispatchEvent(new Event("input", { bubbles: true }));
    el.dispatchEvent(new Event("change", { bubbles: true }));
  }

  function controls() {
    const select = document.querySelector("#Index_Category_Search_dropdown");
    const year = document.querySelector("#Index_Year_Search_input");
    const court = document.querySelector("#Index_Court_Search_input");
    const search = document.querySelector(".Index_Search_btn, button.Index_Search_btn") || [...document.querySelectorAll("button")].find(button => norm(button.textContent) === "Search");
    if (!select || !year || !court || !search) throw new Error("PLS Index Search controls are not visible. Open Caselaw/Index Search after login.");
    return { select, year, court, search };
  }

  function options() {
    const { select } = controls();
    return [...select.options].map(option => ({ value: option.value, label: norm(option.textContent) })).filter(option => option.value);
  }

  function isNoResult() {
    return /No\\s+more\\s+result|No\\s+Record|No\\s+Data|not\\s+found|No Result/i.test(document.body.innerText || "");
  }

  function extractRows(year, option) {
    const rows = [];
    for (const tr of [...document.querySelectorAll("tr")]) {
      const button = tr.querySelector("input.courtWiseSearchBtn[casetypeid], input[casetypeid]");
      if (!button) continue;
      const cells = [...tr.querySelectorAll("td")].map(td => norm(td.innerText)).filter(Boolean);
      if (cells.length < 4) continue;
      const caseTypeId = norm(button.getAttribute("casetypeid"));
      const citation = norm(cells[1]);
      if (!caseTypeId || !caseTypeId.toLowerCase().startsWith(String(year))) continue;
      if (!new RegExp("\\\\b" + year + "\\\\b").test(citation)) continue;
      rows.push({
        caseTypeId,
        category: option.label || option.value,
        citation,
        court: norm(cells[3]),
        row_no: Number(String(cells[0] || "").replace(/[^0-9]/g, "")) || null,
        title: norm((cells[2] || "").split(/\\n/)[0]),
        year,
      });
    }
    return rows;
  }

  async function searchCategory(year, option) {
    await waitForOnline(year + " " + option.label);
    const { select, year: yearInput, court, search } = controls();
    select.scrollIntoView({ block: "center" });
    valueSetter(select, option.value);
    valueSetter(yearInput, String(year));
    valueSetter(court, "");
    await sleep(120);
    if (select.value !== option.value) throw new Error("Reporter option did not select: " + option.label + " value=" + option.value);
    search.click();
    await sleep(1400);
    const started = Date.now();
    let rows = [];
    while (Date.now() - started < 35000) {
      await waitForOnline(year + " " + option.label);
      const body = document.body.innerText || "";
      const waiting = /Please\\s+Wait/i.test(body);
      rows = extractRows(year, option);
      if (!waiting && (rows.length > 0 || isNoResult())) break;
      await sleep(700);
    }
    rows = extractRows(year, option);
    return {
      category: option.label || option.value,
      optionValue: option.value,
      rows,
      waiting: /Please\\s+Wait/i.test(document.body.innerText || ""),
      noResult: rows.length === 0,
      firstCitation: rows[0] && rows[0].citation || null,
      buttons: document.querySelectorAll("input[casetypeid]").length,
    };
  }

  function unique(items) {
    const seen = new Set();
    const out = [];
    for (const item of items) {
      if (seen.has(item.caseTypeId)) continue;
      seen.add(item.caseTypeId);
      out.push(item);
    }
    out.sort((a, b) =>
      String(a.citation || "").localeCompare(String(b.citation || ""), undefined, { numeric: true }) ||
      String(a.caseTypeId || "").localeCompare(String(b.caseTypeId || ""), undefined, { numeric: true })
    );
    return out;
  }

  let reporters = [];
  try {
    reporters = options();
  } catch (error) {
    throw new Error("Pakistan Law Site Index Search controls are not visible. Sign in, open the main PLS search page, then rerun discovery. " + (error && error.message || error));
  }
  if (!reporters.length) throw new Error("Pakistan Law Site reporter dropdown has no options; refresh the logged-in PLS page, then rerun discovery.");

  const initial = await apiWithRetry("/status", {}, "status");
  const discovered = new Set((initial.years || []).filter(row => row.discovered && row.rows > 0).map(row => Number(row.year)));
  status("PLS discovery starting " + FROM + "-" + TO + " with " + reporters.length + " reporter categories");

  for (let year = FROM; year <= TO; year += 1) {
    if (!FORCE && discovered.has(year)) {
      status("PLS discovery skipping existing year " + year);
      continue;
    }
    const all = [];
    const breakdown = [];
    for (const option of reporters) {
      status("PLS discovery " + year + " " + option.label);
      const result = await searchCategory(year, option);
      all.push(...result.rows);
      breakdown.push({
        category: result.category,
        optionValue: result.optionValue,
        rows: result.rows.length,
        waiting: result.waiting,
        noResult: result.noResult,
        firstCitation: result.firstCitation,
        buttons: result.buttons,
      });
      await sleep(jitter(250));
    }
    const items = unique(all);
    const saved = await apiWithRetry("/worklist", {
      method: "POST",
      body: JSON.stringify({ year, sourceUrl: location.href, items, categoryBreakdown: breakdown }),
    }, "save " + year);
    status("PLS discovery saved " + year + " rows=" + saved.rows + " combined=" + saved.combined.rows);
  }

  const finalStatus = await apiWithRetry("/status", {}, "final status");
  status("PLS discovery DONE " + FROM + "-" + TO + " combined rows=" + (finalStatus.combined && finalStatus.combined.rows || 0));
  console.log("PLS discovery final status", finalStatus);
})();
`;
}

function startServer(args) {
  saveCombined(args);
  const server = http.createServer(async (req, res) => {
    try {
      if (req.method === "OPTIONS") return sendJson(res, 200, { ok: true });
      const url = new URL(req.url || "/", `http://${args.host}:${args.port}`);

      if (req.method === "GET" && url.pathname === "/status") {
        return sendJson(res, 200, statusPayload(args));
      }

      if (req.method === "GET" && url.pathname === "/pls_discover_range.js") {
        res.writeHead(200, {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/javascript; charset=utf-8",
        });
        res.end(discoverScript(args));
        return;
      }

      if (req.method === "POST" && url.pathname === "/worklist") {
        return sendJson(res, 200, saveYear(args, await readJsonBody(req)));
      }

      sendJson(res, 404, { ok: false, error: "not found" });
    } catch (error) {
      sendJson(res, 500, { ok: false, error: error.message, stack: error.stack });
    }
  });

  server.listen(args.port, args.host, () => {
    const runner = `http://${args.host}:${args.port}/pls_discover_range.js?from=${args.from}&to=${args.to}`;
    console.log(`READY ${runner}`);
    console.log("Paste in logged-in PLS tab:");
    console.log(`javascript:(()=>{const s=document.createElement('script');s.src='${runner}&t='+Date.now();document.head.appendChild(s);})()`);
    console.log(`Combined worklist: ${combinedWorklistPath(args)}`);
  });

  process.on("SIGINT", () => {
    server.close();
    process.exit(0);
  });

  return server;
}

const args = parseArgs(process.argv.slice(2));
startServer(args);
