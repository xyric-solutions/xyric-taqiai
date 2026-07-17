---
name: multiagent-orchestrator
description: Orchestrate large project audits, implementation plans, research sweeps, cross-repo comparisons, or other long complex tasks by converting one big prompt into a model routing plan, ForgeFlow runtime profile, bounded worker task packets, evidence paths, and verification gates. Use when the user asks for multiagent work, model delegation, Opus/Sonnet/Haiku/GLM/DeepSeek/local workers, token-saving decomposition, whole-project audits, long complex tasks, or "one prompt in, orchestrator delegates".
---

# Multiagent Orchestrator

## Overview

Use this skill to run the reusable Xyric multiagent orchestration workflow for
any project. The active Codex session remains the orchestrator unless the user
explicitly hands the run to Claude or another harness.

## Required Reads

Read these files before action:

- `runbooks/multiagent-orchestrator.md`
- `runbooks/runtime-profiles.md`
- `runbooks/worker-task-packets.md`
- `runbooks/pre-development-check.md` before implementation or audit execution
- `runbooks/gateway-router.md` before any gateway/router experiment

## Execution

1. Capture the user's large prompt as intake under `plans/multiagent/<task-id>/`.
2. Build a cheap context map before reading large files.
3. Write `routing-plan.md` with workstreams, model/runtime choices, allowed
   files, denied actions, evidence paths, verify gates, and stop conditions.
4. Create worker task packets before any delegation.
5. Use callable worker runtimes only when they are actually available. Otherwise
   create packets and mark them as pending or mock-worker evidence.
6. Review every worker output as evidence before accepting it into ForgeFlow
   artifacts.
7. Update `plans/next-session-handoff.md` and memory only for durable facts.

## Routing Defaults

Use strong orchestration for architecture, safety, security, privacy, DB writes,
production, and final synthesis. Use cheaper workers for discovery, routine
review, drafts, mechanical transforms, clustering, and bounded evidence
collection.

Do not send secrets, production credentials, raw private data, or sensitive
client/user data to third-party workers.

## Stop Conditions

Stop before destructive, production, rate-limited, or data-mutating actions
unless the user explicitly approves them in the current session.
