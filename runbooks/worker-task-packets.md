# Forgeflow Runbook: Worker Task Packets

## Purpose

Delegate a bounded slice to a worker model, tool, or harness without letting the
worker become the source of truth. The orchestrator derives the packet from the
active Blueprint segment or Forgeflow batch, source hierarchy, traceability row,
verification matrix, and current file map. The worker receives a file-based
packet with exact scope, allowed files, denied actions, verify command, output
path, and stop condition. The active harness remains the orchestrator: Codex
when running in Codex, Claude when running in Claude Code. Worker output is
evidence only until orchestrator review verifies it and writes normal Forgeflow
closeout artifacts.

Use this runbook after `runbooks/pre-development-check.md` has selected a worker
runtime profile and confirmed availability or a documented mock worker.

## Required Context

- Active batch file and source hierarchy.
- Runtime intake block from `runbooks/runtime-profiles.md`.
- Deterministic verify command and evidence path.
- Allowed file list, denied actions, and stop condition.
- Worker profile: `glm-coding-backend`, `deepseek-coding-backend`,
  `local-qwen-mlx`, `opencode-worker`, `mock-worker`, or another explicitly
  documented worker.
- Template: `framework/templates/worker-task-packet.md`.
- User-provided credentials/tokens or runtime access only when they are
  unavailable to the orchestrator. Do not ask the user to author packet scope,
  file lists, verification, or stop conditions when the repo evidence can
  determine them.

## Core Rule

A worker task packet is an AI-derived contract, not a handoff of authority and
not a form the user fills manually. The worker may inspect, draft, summarize,
propose patches, or write bounded edits only inside the packet scope. The
orchestrator must independently review the output, run or record the verify
gate, and decide whether anything becomes durable project truth.

## Packet Creation Steps

1. Confirm the active batch is `READY` or `READY WITH WAIVERS` in the
   pre-development gate.
2. Copy `framework/templates/worker-task-packet.md` into the batch evidence
   folder, for example `plans/batches/<batch-id>/worker-task-packet.md`.
3. Fill every required field from the active docs and repo evidence:
   - batch ID;
   - source hierarchy and tie-breaker source;
   - exact scope;
   - allowed files;
   - denied actions;
   - worker profile and harness;
   - task prompt;
   - verify command;
   - evidence path;
   - timeout or stop condition;
   - output format;
   - orchestrator review checklist.
4. Ask the user only for unavailable credentials/tokens, runtime access,
   safety-blocking choices, or approvals for destructive/irreversible work.
   Credential material must stay outside committed files.
5. Keep the scope smaller than the parent batch. A packet should fit one worker
   run and one orchestrator review pass.
6. Include only repo-relative paths, public docs, and placeholders. Do not add
   secrets, API keys, user-level config, provider dashboards, private quota
   screenshots, or personal shell paths.
7. Attach any worker-specific setup note as evidence, not as committed active
   config. For local Qwen, or another future local LLM via Ollama, record:
   - provider: `Ollama`;
   - local endpoint: `http://localhost:11434/v1`;
   - model example: `qwen3.6:27b-mlx` or the explicitly selected local model;
   - availability check or documented mock-worker reason.
8. Give the worker only the packet and the named files. Do not ask the worker to
   infer project rules from chat memory.
9. Save worker output at the packet's evidence path. If the worker edits files,
   capture the diff path and verification result in the same evidence folder.

## Worker Output Rules

Worker output must be one of:

- read-only findings with file and line evidence;
- a proposed patch or diff;
- bounded edits in allowed files only;
- verify output;
- an explicit blocked note naming the stop condition.

Worker output must not be:

- final readiness status;
- final architecture, security, privacy, safety, production, or destructive
  migration decisions;
- a replacement for `findings-ledger.md`, `_progress.md`, or
  `plans/next-session-handoff.md`;
- unreviewed truth in the batch closeout.

## Orchestrator Review Checklist

Before accepting any worker output:

- [ ] Packet fields were complete before delegation.
- [ ] Worker stayed inside exact scope and allowed files.
- [ ] Denied actions were not attempted.
- [ ] Evidence path exists and contains the worker output.
- [ ] Verify command was run, or a blocker/waiver was recorded.
- [ ] Findings are evidence-backed and mapped to the parent batch item.
- [ ] Any edits are reviewed against source hierarchy and tie-breaker source.
- [ ] Normal Forgeflow artifacts are updated by the orchestrator, not the
      worker: batch file, findings ledger, deferred decisions, accepted
      improvements, `_progress.md`, and next-session handoff.

## Shakedown Coverage

For the next small Forgeflow shakedown batch, prepare at least one worker packet
case without making OpenCode a required dependency:

- Normal Blueprint-backed batch: `/goal` plus native orchestration
  (`codex-native` in Codex or `claude-native` in Claude Code), no worker packet
  required unless the segment deliberately delegates a small slice.
- Polling batch: `/loop`, with poll target, cadence, timeout, and closeout path.
- Bounded worker packet: `local-qwen-mlx` or another explicitly selected local
  model via Ollama if available, or `mock-worker` that writes evidence only.
- Optional OpenCode worker evaluation: use `runbooks/opencode-worker.md`, but do
  not require it to pass the shakedown.

## Stop Conditions

- Stop if the batch is not through the pre-development gate.
- Stop if source hierarchy, exact scope, verify command, evidence path, or stop
  condition is missing.
- Stop if the worker needs credentials, network access, production access, or a
  destructive action that was not explicitly approved and recorded.
- Stop if the worker crosses denied actions or unlisted files.
- Stop if output cannot be verified by the orchestrator.

## Closeout

Record in the parent batch:

- packet path;
- worker profile and harness;
- worker output path;
- verify command and result;
- accepted, rejected, or deferred worker findings;
- orchestrator review decision;
- any follow-up packets or blockers.
