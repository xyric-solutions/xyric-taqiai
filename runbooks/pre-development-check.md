# Forgeflow Runbook: Pre-Development Check

## Purpose

Prove that the docs, loop choice, runtime profile, and verification path are
ready before any implementation or worker delegation begins. This gate protects
Forgeflow from the common failure mode where an agent starts coding from stale,
conflicting, or unverified planning material.

## Required Context

- Root `AGENTS.md`, `CLAUDE.md`, founding brief, source hierarchy, and active vs archived source list.
- Active batch file or Blueprint segment.
- `_progress.md`, current handoff, open findings, deferred decisions, accepted improvements, blockers, drift, and waivers.
- Filled verification matrix, or `framework/templates/verification-matrix.md` as the scaffold.
- `runbooks/runtime-profiles.md` and the selected loop/runtime intake block.
- `runbooks/worker-task-packets.md` if a worker backend is selected.
- `runbooks/saved-workflows.md` if `ultracode:` or a saved Claude workflow is selected.
- `runbooks/opencode-worker.md` if OpenCode is being evaluated as a worker harness.
- Current file map from `rg --files`.

## Steps

1. Confirm the project names active operational docs, archived/historical docs,
   and the tie-breaker source that wins when docs disagree.
2. Confirm the batch source is active, in the declared active root, and small
   enough to verify in one bounded pass.
3. Confirm every source link in the batch resolves to an active doc, story,
   work item, traceability row, or live code path.
4. If the batch is Blueprint-backed, confirm:
   - the Segment Plan is the batch source;
   - the segment ID is reused as the batch ID;
   - `traceability-matrix.md` exists or the missing matrix is recorded as a blocker;
   - the `BUILD_READY` marker exists, or the batch records that the docs are not locked yet.
5. Select verification gates from the verification matrix before implementation:
   docs/framework readiness, plus every change type the batch is expected to touch.
6. Record the deterministic verify command, expected evidence path, and manual
   review lens. If no deterministic gate exists, stop or record an owner-approved waiver.
7. Confirm the runtime intake block is complete:
   loop primitive, runtime profile, orchestrator role, worker backend, usage guard,
   verify command, evidence path, and closeout writes.
   The orchestrator role is `Codex` when the batch is running through Codex and
   `Claude` when it is running through Claude Code.
8. If a worker backend is selected, require smoke-test or availability evidence
   before the worker receives a task packet. Derive packet scope, allowed files,
   denied actions, verify command, evidence path, and stop condition from the
   active Blueprint segment or Forgeflow batch, source hierarchy, traceability
   row, verification matrix, and current file map. For local workers, record the
   local runner command or API endpoint, model identifier, task packet path, and
   output path. The packet must be filled from
   `framework/templates/worker-task-packet.md`.
9. If OpenCode is selected, treat it as an optional worker harness only. Record
   the provider, local endpoint or endpoint class, model ID, packet path, output
   path, permissions stance, and why no active `opencode.json` is committed.
10. If `ultracode:` or a saved workflow is selected, confirm a small first run,
    source review, scope cap, verify command, evidence path, usage guard, stop
    condition, and closeout writes.
11. Check blockers, deferred decisions, waivers, and known drift. Anything that
   changes source authority, verification, destructive work, credentials, privacy,
   safety, or production access must be resolved or explicitly waived before development.
12. Record the gate result in the batch:
    `READY`, `READY WITH WAIVERS`, or `BLOCKED`.

## Expected Output

- A pre-development gate block in the batch artifact with:
  - active docs list or source hierarchy pointer;
  - archived docs rule;
  - tie-breaker source;
  - selected verification gates;
  - verify command;
  - evidence path;
  - loop/runtime intake status;
  - worker smoke-test status, if any;
  - worker task packet path and output path, if any;
  - saved workflow or `ultracode:` guard, if any;
  - waivers or blockers;
  - final gate result.

## Pre-Shakedown Coverage Checklist

Before a small Forgeflow shakedown batch, confirm coverage for:

- [ ] Normal Blueprint-backed batch: `/goal` plus native orchestration
      (`codex-native` in Codex or `claude-native` in Claude Code), with segment
      ID reused as the batch ID and verification mapped to the traceability matrix.
- [ ] Polling batch: `/loop`, with poll target, cadence, timeout, and closeout
      path.
- [ ] Bounded worker packet: `local-qwen-mlx` or another explicitly selected
      local model via Ollama if available, or a documented `mock-worker`, with
      packet path and evidence path.
- [ ] Optional OpenCode worker evaluation: recorded as optional evidence only,
      not required for the shakedown to pass.

## Quality Bar

- A fresh agent can tell which docs are active and which source wins.
- The batch can be verified from files, commands, and evidence, not chat memory.
- Worker packet fields are derived from repo evidence; the user is asked only
  for missing credentials/tokens, runtime access, safety choices, or approvals.
- The loop/runtime choice cannot expand scope silently.
- Worker output is treated as evidence until the orchestrator verifies it.
- `READY WITH WAIVERS` names owner, blocked work, next action, closure condition,
  and why development may still begin.

## Persistence / Closeout

- Save the pre-development gate block in the batch artifact.
- Update `_progress.md` if the gate changes status or blocks the next slice.
- Add unresolved blockers to `findings-ledger.md` or `deferred-decisions.md`.
- Update `plans/next-session-handoff.md` if development cannot start safely.

## Stop Conditions

- Stop if active docs, archived docs, or the tie-breaker source are missing.
- Stop if active docs conflict and the source hierarchy does not resolve it.
- Stop if the batch lacks a deterministic verify command and no owner-approved waiver exists.
- Stop if Blueprint traceability is required but unavailable.
- Stop if a worker backend is selected without smoke-test or availability evidence.
- Stop if a worker backend is selected without a packet path and output path.
- Stop if OpenCode evaluation requires active local config in the framework repo.
- Stop if a saved workflow lacks small first run, usage guard, or closeout writes.
- Stop if the loop primitive has no proof condition, timeout, or closeout path.
- Stop if destructive, irreversible, credential, privacy, safety, or production decisions are unresolved.
