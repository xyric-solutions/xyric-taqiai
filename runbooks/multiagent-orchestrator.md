# Xyric Runbook: Multiagent Orchestrator

## Purpose

Turn one large project task prompt into a bounded orchestration plan, model
routing table, worker task packets, evidence paths, and verification gates. Use
this when the user wants Codex, Claude, Opus, Sonnet, Haiku, GLM, DeepSeek, or a
local model to split a complex audit, implementation, research sweep, or
cross-repo comparison instead of one model reading everything itself.

This runbook sits on top of ForgeFlow. It does not replace
`runbooks/start-batch.md`, `runbooks/runtime-profiles.md`, or
`runbooks/worker-task-packets.md`; it composes them for large tasks.

## Core Rule

The active session remains the orchestrator:

- Codex orchestrates when the user is working in Codex.
- Claude orchestrates when the user is working in Claude Code.
- Opus may be selected inside Claude for planning, high-risk review, or final
  adjudication when available and justified.

Workers do not become the source of truth. Worker output is evidence until the
orchestrator reviews it, verifies it, and writes normal ForgeFlow closeout
artifacts.

## What This Automates

The orchestrator should automatically derive:

- the task decomposition;
- the model/runtime routing plan;
- the minimal context each worker needs;
- worker task packets;
- evidence paths;
- verification commands;
- stop conditions;
- closeout writes.

The user should not need to hand-author worker specs. Ask the user only for
unavailable credentials, runtime access, true personalization decisions, or
approval for destructive, production, expensive, or irreversible actions.

## What This Does Not Automate

Do not pretend an unavailable model can run. If a worker runtime is not
available, create a packet and mark it `mock-worker`, `pending-runtime`, or
`blocked`.

Do not enable hidden gateway routing. Follow `runbooks/gateway-router.md` before
any automatic router experiment.

Do not send secrets, production credentials, private client/user data, or
sensitive raw records to third-party worker backends. Use schema, public docs,
code paths, synthetic examples, or redacted summaries instead.

Do not run destructive, production, database-write, migration, ingestion,
compute, ETL, rate-limited API, or other irreversible commands without explicit
user approval.

## One-Time Runtime Setup

Native orchestration works without extra provider keys:

- Codex: use the current Codex session.
- Claude: run `/status`, then choose `/model default`, `/model sonnet`, or
  `/model opus` only if the alias is available and the task justifies it.

Provider workers use a private file outside every repo:

```powershell
New-Item -ItemType Directory -Force "$HOME\.xyric" | Out-Null
Copy-Item scripts\framework.env.example "$HOME\.xyric\framework.env"
# Edit the copied file and fill ZAI_API_KEY and/or DEEPSEEK_API_KEY.
```

PowerShell helpers:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force
.\scripts\use-profile.ps1 native
.\scripts\use-profile.ps1 glm
.\scripts\use-profile.ps1 deepseek
.\scripts\glm-worker.ps1 -Ping
.\scripts\deepseek-worker.ps1 -Ping
```

Bash helpers remain available where Bash/WSL is present:

```sh
source scripts/use-profile.sh native
source scripts/use-profile.sh glm
source scripts/use-profile.sh deepseek
./scripts/glm-worker.sh --ping
```

Never commit filled env files, account pages, API keys, quota screenshots, or
provider dashboards.

`ANTHROPIC_API_KEY` and `SUPERMEMORY_CC_API_KEY` in the example env file are
optional. They are not required for the normal Claude subscription path, Codex
native work, GLM direct worker pings, or DeepSeek profile switching. Add
`ANTHROPIC_API_KEY` only if you intentionally use Anthropic direct API billing.
Add `SUPERMEMORY_CC_API_KEY` only if a future Supermemory skill/tool is enabled.

Current direct GLM worker default is `ZAI_MODEL=glm-5.1`, verified with
`scripts/glm-worker.ps1 -Ping` on 2026-07-08. If provider docs or a teammate's
account expose a different model, record the model in the routing plan and
worker output.

## Model Routing Policy

Route by risk first, then by cost/usage pressure.

| Task type | Preferred model/runtime | Worker profile | Guardrail |
|-----------|-------------------------|----------------|-----------|
| Initial decomposition, architecture, final synthesis, safety/security/privacy, migration/data-loss risk | Codex native or Claude Opus when available and justified | none by default | Strong model keeps final authority. |
| Routine code review, bounded implementation, test drafting, doc cleanup, narrow refactor | Sonnet/default or Codex native | `glm-coding-backend`, `deepseek-coding-backend`, or local worker if explicitly selected | Worker gets a packet and evidence path. |
| Cheap discovery, file inventory, grep summaries, duplicate finding clustering, index building | Haiku/small/default fast model | local worker or mock worker | Read-only, compact output, no final decisions. |
| Bulk first drafts, sketches, boilerplate, mechanical transforms | GLM or DeepSeek worker | `glm-coding-backend` or `deepseek-coding-backend` | No sensitive data; evidence only. |
| Local/offline summarization or draft patches | Local Qwen/Ollama/OpenCode when available | `local-qwen-mlx` or `opencode-worker` | Record endpoint, model, output path, and verify result. |
| Automatic provider router | none | `gateway-router` only after policy approval | Not a default. |

If a cheaper model fails twice, gives unsupported claims, crosses scope, or
cannot produce file/line evidence, escalate the slice to the orchestrator or a
stronger available model.

## Workflow

### 1. Intake The Big Prompt

Capture the user's request in `plans/multiagent/<task-id>/intake.md` with:

- objective;
- non-goals;
- active roots;
- denied actions;
- likely verification commands;
- whether the task is audit-only, propose-patch-only, or edit-capable;
- available runtimes or unknown runtimes.

Use a task ID like `MA-20260708-project-audit`.

### 2. Build A Context Map Before Deep Reading

Use cheap discovery first:

- `rg --files`;
- targeted `rg -n` searches;
- directory listings;
- docs index reads;
- read-only schema/count checks only when needed and allowed.

Do not dump large files into context. Produce
`plans/multiagent/<task-id>/context-map.md` with:

- source hierarchy;
- active docs;
- major modules;
- suspected lanes/workstreams;
- high-risk files;
- files explicitly excluded from worker access.

### 3. Create The Routing Plan

Write `plans/multiagent/<task-id>/routing-plan.md` before delegation.

Required table:

| Workstream | Question to answer | Runtime/model | Worker profile | Allowed sources | Denied actions | Output path | Verify gate | Stop condition |
|------------|--------------------|---------------|----------------|-----------------|----------------|-------------|-------------|----------------|

Rules:

- Keep each workstream smaller than the parent task.
- Give workers source files, not chat memory.
- Prefer read-only workers for audits.
- Use strong-model review for architecture, security, privacy, data mutation,
  production, and final readiness decisions.
- Use `mock-worker` when the runtime is not currently available but the packet
  should exist for a later worker.

### 4. Start Or Reference A ForgeFlow Batch

For serious work, create or update a batch artifact from
`framework/templates/batch-template.md`. Record:

- loop primitive;
- runtime profile;
- orchestrator role;
- worker backend;
- provider and model;
- evidence path;
- usage guard;
- closeout writes.

Apply `runbooks/pre-development-check.md` before execution. A large task should
not start deep work until the pre-development gate is `READY` or
`READY WITH WAIVERS`.

### 5. Issue Worker Packets

For every delegated slice, create a packet from
`framework/templates/worker-task-packet.md` under:

`plans/multiagent/<task-id>/workers/<packet-id>.md`

The packet must include:

- exact scope;
- source links;
- allowed files;
- denied actions;
- worker profile;
- harness or model;
- verify command;
- evidence path;
- timeout or stop condition;
- output format.

Workers may inspect, summarize, propose patches, or make bounded edits only if
the packet explicitly allows it.

### 6. Execute Workers By Available Harness

Codex mode:

- Use this runbook and the Codex skill wrapper.
- If Codex multi-agent tooling is available, use it only with the packet as the
  worker prompt.
- If no worker runtime is callable, create packets and perform the highest-risk
  orchestrator pass natively.

Claude mode:

- Use `/multiagent-orchestrator`.
- Use `.claude/agents/project-map-scout.md` for cheap read-only discovery.
- Use `.claude/agents/project-routine-reviewer.md` for Sonnet/default review.
- Use `.claude/agents/project-risk-adjudicator.md` for Opus/high-risk review.
- Use `.claude/agents/packet-summarizer.md` to compress worker evidence.
- Use `runbooks/glm-workflow-worker.md` when GLM should draft inside a Claude
  Workflow while Claude stays the orchestrator.

External worker mode:

- Start a dedicated shell/profile for GLM, DeepSeek, local Qwen, OpenCode, or a
  mock worker.
- Give the worker only the packet and named files.
- Save output exactly at the packet evidence path.

### 7. Orchestrator Review

Before accepting any worker result:

- confirm the packet existed before delegation;
- confirm allowed files and denied actions were respected;
- check evidence paths;
- rerun or record the verify command;
- reject unsupported claims;
- merge accepted findings into normal ForgeFlow artifacts;
- leave rejected/deferred findings with a reason.

For audits, the orchestrator should consolidate duplicate findings, preserve
severity, and keep file/line evidence.

### 8. Close Out

Update:

- batch artifact;
- `findings-ledger.md` if present for the lane;
- `deferred-decisions.md`;
- `accepted-improvements.md`;
- `_progress.md` if present;
- `plans/next-session-handoff.md`;
- memory facts only for durable decisions.

Record which model/provider produced material output and which verification
proved or rejected it.

## Default Whole-Project Audit Split

For a large audit in any project, start with these workstreams unless the user
narrows the scope:

| Workstream | Default routing |
|------------|-----------------|
| Source hierarchy and stale-doc map | Haiku/map scout or Codex native |
| Main app/service modules | Sonnet/default reviewer; strong orchestrator adjudication |
| Data/schema/storage rules | Data governance or project-specific skill plus strong orchestrator review |
| Product/API/integration boundary | Sonnet/default reviewer; domain skill if one is installed |
| Secrets, auth, privacy, production, and data-write guardrails | Opus/Codex orchestrator only |
| Verification matrix and test gaps | Sonnet/default reviewer, final orchestrator consolidation |
| Duplicate findings and final report synthesis | Cheap worker for clustering, strong orchestrator for final report |

Do not include production credentials, raw private data, or mutation commands in
any worker packet.

## User Prompt Template

Use `plans/multiagent/task-prompt-template.md` when starting from scratch. The
short version is:

```text
Use $multiagent-orchestrator.

Objective:
Scope:
Allowed roots:
Denied actions:
Preferred orchestrator:
Available worker runtimes:
Verification target:
Output I want:
```

If the user gives only a natural-language prompt, infer the missing fields from
project docs and ask only for blocking approvals or unavailable runtime access.

## Stop Conditions

Stop and ask before proceeding if:

- the task requires production credentials, production writes, data mutation,
  ingestion, compute, ETL, migration, backtest, or rate-limited API calls;
- no deterministic verification target can be named;
- source hierarchy cannot resolve conflicting active docs;
- a worker would need sensitive data;
- automatic gateway routing is requested without approved router governance;
- a worker result cannot be verified by the orchestrator.
