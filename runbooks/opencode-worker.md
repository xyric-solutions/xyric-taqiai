# Forgeflow Runbook: OpenCode Worker Evaluation

## Purpose

Evaluate OpenCode as an optional worker harness for bounded Forgeflow task
packets. OpenCode can help test provider breadth, local Ollama workers, custom
agents, custom commands, permissions, and its server API, but it must not become
the core Forgeflow orchestrator by default. The active harness remains the
orchestrator: Codex in Codex, Claude in Claude Code. Forgeflow artifacts remain
the source of truth.

Last reviewed against primary OpenCode docs: 2026-06-29.

## Current Recommendation

Use OpenCode only as an optional worker harness behind
`runbooks/worker-task-packets.md`. Do not route Claude Pro/Max subscription work
through OpenCode plugins, and do not commit a real project `opencode.json`
unless a project explicitly adopts OpenCode as a governed local tool. For this
framework library, ship only examples under `framework/templates/capabilities/`.

## Why OpenCode Is Worth Evaluating

OpenCode currently documents:

- project and global config via `opencode.json` / `opencode.jsonc`;
- many providers plus custom OpenAI-compatible providers;
- Ollama local model configuration through `http://localhost:11434/v1`;
- custom agents with `primary`, `subagent`, or `all` modes;
- agent permissions for read, edit, bash, web, external-directory, and task
  controls;
- custom commands;
- `opencode serve`, which exposes an HTTP server and OpenAPI 3.1 spec;
- session, message, diff, file, command, tool, agent, and event APIs.

Those features make OpenCode a plausible worker harness, especially for local
or provider-diverse experiments. They do not replace Forgeflow's source
hierarchy, batch files, ledgers, verification matrix, or closeout rules.

## Evaluation Setup

1. Start with a worker task packet, not with broad repository access.
2. Use `framework/templates/capabilities/opencode-worker.example.jsonc` as an
   example only. Copy it into a sandbox project only after the project owner
   accepts OpenCode for that project.
3. For local Qwen, or a future local model via Ollama, use placeholders:
   - provider: `Ollama`;
   - local endpoint: `http://localhost:11434/v1`;
   - model example: `qwen3.6:27b-mlx`, replaceable in a copied project file
     with the explicitly selected local model.
4. Keep credentials outside the repository. Do not commit provider auth,
   personal config, or shell profiles.
5. Configure a conservative agent:
   - read, grep, glob, and list: allowed;
   - edit and bash: ask or deny, depending on packet scope;
   - web fetch/search and external-directory access: deny unless explicitly
     required by the packet;
   - task/subagent use: deny unless the packet authorizes it.
6. Run one small packet first. Save OpenCode transcript, diff, verify output, and
   blocked notes under the packet evidence path.
7. The orchestrator reviews output exactly as any other worker output.

## Accept Criteria For A Pilot

- OpenCode can read the packet and named files without extra chat context.
- The configured agent respects file scope and denied actions.
- The model/provider used is recorded in the worker output.
- The worker writes evidence to the packet evidence path.
- The deterministic verify command can be run or the blocker is recorded.
- The orchestrator can decide accept, reject, or defer from the evidence alone.

## Reject Or Defer Criteria

- OpenCode requires active local config committed to this framework library.
- The run needs real secrets, private provider state, or personal shell paths.
- The worker tries to become the orchestrator or update Forgeflow ledgers as
  final truth.
- Permissions cannot be made narrow enough for the packet.
- Local model output is not good enough for the selected risk level.
- Server API use would require a long-running service without auth, logging, or
  owner approval.

## Server API Policy

OpenCode's server API is useful for future harness experiments because it can
drive sessions programmatically and expose OpenAPI metadata. Treat it as a
future integration point, not a default router:

- Bind to localhost by default.
- Use server authentication if exposing it beyond the default local path.
- Record the OpenCode server version, endpoint, session ID, and evidence path.
- Do not leave a background server running as hidden project state.
- Do not route ordinary Claude Pro/Max work through this API.

## Shakedown Status

Optional only. A Forgeflow shakedown can pass with a documented mock worker or a
local Ollama worker packet. OpenCode evaluation is an extra evidence item, not a
required gate.

## Sources

- OpenCode config docs: https://opencode.ai/docs/config/
- OpenCode provider docs: https://opencode.ai/docs/providers/
- OpenCode agents docs: https://opencode.ai/docs/agents/
- OpenCode commands docs: https://opencode.ai/docs/commands/
- OpenCode CLI docs: https://opencode.ai/docs/cli/
- OpenCode server docs: https://opencode.ai/docs/server/
