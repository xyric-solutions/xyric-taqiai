#!/usr/bin/env node
// portability-check.mjs — Blueprint's verify self-check (BLUEPRINT.md Part C6).
//
// Two modes, auto-detected from the target:
//
//   METHOD/STARTER mode — target is the Blueprint method folder or an activated project root.
//     Verifies the shipped payload is whole: a runbook + Claude command + Codex skill for every
//     stage, the reused research-first skill, and no unfilled placeholders in starter files.
//
//   INSTANCE mode — target is a filled product docs folder (e.g. docs/<PRODUCT>/).
//     Verifies the documentation run is build-ready: all five stage docs present and `locked`,
//     no unfilled placeholders, a segments/ folder of batch-shaped segments (each carrying a
//     Test expectation), a BUILD_READY marker, and a traceability matrix with no orphan rows.
//     This is the gate the handoff runbook runs.
//
// Usage:
//   node blueprint/verify/portability-check.mjs [target-dir]   (default ".")
//
// Exit codes: 0 = all checks passed · 1 = one or more findings · 2 = bad usage.

import { readdirSync, statSync, readFileSync, existsSync } from 'node:fs';
import { extname, join, relative, basename } from 'node:path';

const target = process.argv[2] ?? '.';

if (!existsSync(target) || !statSync(target).isDirectory()) {
  console.error(`✖ blueprint portability-check: target directory not found: ${target}`);
  process.exit(2);
}

const WORKFLOWS = [
  'draft-vision',
  'draft-prd',
  'draft-architecture',
  'derive-phases',
  'derive-segments',
  'run-gate',
  'handoff',
];

const STAGE_DOCS = ['vision.md', 'prd.md', 'architecture.md', 'phase-plan.md'];
const SUPPORT_DOCS = [
  'personalization-gate.md',
  'blueprint-progress.md',
  'complexity-rubric.md',
  'traceability-matrix.md',
];

const SCAN_EXT = new Set(['.md', '.mdx']);
const SKIP_DIRS = new Set(['node_modules', '.git', 'templates', 'dist', 'build', 'out']);
const PLACEHOLDER_RE = /<PLACEHOLDER>|<[A-Z][A-Z0-9_ /|-]{2,}>/g;

const findings = [];
const readText = (p) => { try { return readFileSync(p, 'utf8'); } catch { return null; } };
const stripCode = (t) => t.replace(/```[\s\S]*?```/g, '').replace(/~~~[\s\S]*?~~~/g, '').replace(/`[^`\n]*`/g, '');

function placeholderHits(text) {
  const hits = stripCode(text).match(PLACEHOLDER_RE);
  return hits ? [...new Set(hits)].slice(0, 5).join(', ') : null;
}

// ---- mode detection -------------------------------------------------------
const starterBase = existsSync(join(target, 'starter', 'runbooks'))
  ? join(target, 'starter')
  : existsSync(join(target, 'runbooks', 'run-gate.md'))
    ? target
    : null;
const isMethodMode = starterBase !== null;

// ---- METHOD / STARTER mode ------------------------------------------------
function checkMethod(base) {
  const required = [
    'CLAUDE.md',
    'AGENTS.md',
    '.claude/skills/research-first/SKILL.md',
    '.agents/skills/research-first/SKILL.md',
    ...WORKFLOWS.map((w) => `runbooks/${w}.md`),
    ...WORKFLOWS.map((w) => `.claude/commands/blueprint-${w}.md`),
    ...WORKFLOWS.map((w) => `.agents/skills/blueprint-${w}/SKILL.md`),
  ];
  for (const rel of required) {
    if (!existsSync(join(base, rel))) findings.push(`missing starter file: ${rel}`);
  }
  // No unfilled placeholders in working starter files (runbooks + wrappers).
  for (const rel of required) {
    const full = join(base, rel);
    const text = readText(full);
    if (text === null) continue;
    const hit = placeholderHits(text);
    if (hit) findings.push(`unfilled placeholder(s) in starter ${rel}: ${hit}`);
  }
}

// ---- INSTANCE mode --------------------------------------------------------
function findDoc(name) {
  // top-level first, then a shallow walk
  if (existsSync(join(target, name))) return join(target, name);
  let found = null;
  (function walk(dir, depth) {
    if (found || depth > 3) return;
    let entries;
    try { entries = readdirSync(dir, { withFileTypes: true }); } catch { return; }
    for (const e of entries) {
      if (found) return;
      if (e.isDirectory()) { if (!SKIP_DIRS.has(e.name)) walk(join(dir, e.name), depth + 1); }
      else if (e.name === name) found = join(dir, e.name);
    }
  })(target, 0);
  return found;
}

function statusLine(text) {
  const m = text.match(/^-\s*Status:\s*(.+)$/m);
  return m ? m[1].trim() : null;
}

function checkInstance() {
  // 1. required docs present
  const docPaths = {};
  for (const name of [...STAGE_DOCS, ...SUPPORT_DOCS]) {
    const p = findDoc(name);
    if (!p) findings.push(`missing required doc: ${name}`);
    else docPaths[name] = p;
  }

  // 2. each stage doc is `locked`
  for (const name of STAGE_DOCS) {
    const p = docPaths[name];
    if (!p) continue;
    const s = statusLine(readText(p) ?? '');
    if (s === null) findings.push(`${name}: no "- Status:" line found`);
    else if (s.includes('|') || !/\blocked\b/i.test(s)) {
      findings.push(`${name}: stage not locked (status: "${s}")`);
    }
  }

  // 3. no unfilled placeholders in any instance doc
  for (const name of [...STAGE_DOCS, ...SUPPORT_DOCS]) {
    const p = docPaths[name];
    if (!p) continue;
    const hit = placeholderHits(readText(p) ?? '');
    if (hit) findings.push(`unfilled placeholder(s) in ${name}: ${hit}`);
  }

  // 4. segments/ folder with ≥1 batch-shaped segment
  const segDir = existsSync(join(target, 'segments')) ? join(target, 'segments') : null;
  if (!segDir) {
    findings.push('missing segments/ folder');
  } else {
    const segFiles = readdirSync(segDir)
      .filter((f) => extname(f) === '.md' && basename(f).toLowerCase() !== 'readme.md');
    if (segFiles.length === 0) findings.push('segments/ contains no segment files');
    const REQUIRED_SEG_FIELDS = ['- Status:', '- Theme:', 'Traceability', 'Acceptance', 'Test expectation', 'Completion gate'];
    for (const f of segFiles) {
      const text = readText(join(segDir, f)) ?? '';
      for (const field of REQUIRED_SEG_FIELDS) {
        if (!text.includes(field)) findings.push(`segment ${f} not batch-shaped: missing "${field}"`);
      }
      const hit = placeholderHits(text);
      if (hit) findings.push(`unfilled placeholder(s) in segment ${f}: ${hit}`);
    }
  }

  // 5. BUILD_READY marker present (anywhere under segments/ or at target root)
  const hasBuildReady = (() => {
    const roots = [segDir, target].filter(Boolean);
    for (const root of roots) {
      let entries;
      try { entries = readdirSync(root, { withFileTypes: true }); } catch { continue; }
      for (const e of entries) {
        if (e.isFile() && SCAN_EXT.has(extname(e.name))) {
          // Match the marker form the handoff writes ("BUILD_READY: <product>"),
          // not the bare word (which appears in the progress-ledger status enum).
          if (/BUILD_READY:/.test(readText(join(root, e.name)) ?? '')) return true;
        }
      }
    }
    return false;
  })();
  if (!hasBuildReady) findings.push('missing BUILD_READY marker (run the handoff runbook)');

  // 6. traceability matrix: orphan-check rows must all be "none"
  const tm = docPaths['traceability-matrix.md'];
  if (tm) {
    const text = readText(tm) ?? '';
    const sec = text.split(/^##\s+/m).find((s) => /^Orphan check/i.test(s));
    if (!sec) {
      findings.push('traceability-matrix.md: no "## Orphan check" section');
    } else {
      for (const line of sec.split('\n')) {
        const t = line.trim();
        if (!t.startsWith('|')) continue;
        const cells = t.split('|').map((c) => c.trim()).filter((c) => c.length);
        if (cells.length < 2) continue;
        if (/^check$/i.test(cells[0]) || /^-+$/.test(cells[0])) continue; // header/separator
        const orphans = cells[1].toLowerCase();
        if (orphans && orphans !== 'none' && orphans !== '0' && !/^<none>$/.test(orphans)) {
          findings.push(`traceability-matrix.md orphan check not clean: "${cells[0]}" → "${cells[1]}"`);
        }
      }
    }
  }
}

// ---- run ------------------------------------------------------------------
if (isMethodMode) checkMethod(starterBase);
else checkInstance();

const mode = isMethodMode ? 'method/starter' : 'instance';
const label = target === '.' ? 'current dir' : target;

if (findings.length === 0) {
  console.log(`✓ blueprint portability-check (${mode}): ${label} — all checks passed.`);
  process.exit(0);
}

console.error(`✖ blueprint portability-check (${mode}): ${label} — ${findings.length} finding(s):`);
for (const f of findings) console.error(`  - ${f}`);
if (isMethodMode) {
  console.error(`\nFix: restore the missing starter file(s) and clear placeholders in working files.`);
} else {
  console.error(`\nFix: lock every stage (gate recorded + validation passed), fill all placeholders, author segments in batch shape, write the BUILD_READY marker (handoff runbook), and clear all traceability orphans before handing off to Forgeflow.`);
}
process.exit(1);
