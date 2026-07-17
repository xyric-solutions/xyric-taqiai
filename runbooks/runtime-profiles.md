# Forgeflow Runbook: Runtime Profiles

## Purpose

Choose the loop primitive and runtime profile for a Forgeflow batch. This is a
core batch-start decision, not a separate Skill Bank skill. The active harness
remains the orchestrator through Forgeflow artifacts: Codex when running in
Codex, Claude when running in Claude Code. Cheaper coding backends are explicit
worker profiles until gateway/router governance exists.

## Required Context

- Active batch or Blueprint segment.
- Source hierarchy, active root, and deterministic verify command.
- Evidence path for worker output, test output, screenshots, logs, or review notes.
- Current usage/quota status, provider status, subscription-plan status, or smoke-test evidence.
- Provider docs for any non-Claude backend.
- `runbooks/worker-task-packets.md` when a worker backend is selected.
- `runbooks/gateway-router.md` before any gateway or router experiment.
- `runbooks/glm-workflow-worker.md` instead of this runbook's `glm-coding-backend`
  profile when GLM should be a cheap sub-worker *inside* a `Workflow` script
  while Claude stays the orchestrator, rather than the whole session.

## API Key Setup (one-time, global)

Provider keys for `glm-coding-backend` and `deepseek-coding-backend` live in a
single file outside any repo, set up once per machine and reused across every
project this framework is copied into:

```sh
mkdir -p ~/.xyric
cp scripts/framework.env.example ~/.xyric/framework.env
# edit ~/.xyric/framework.env and fill in real keys
```

PowerShell on Windows:

```powershell
New-Item -ItemType Directory -Force "$HOME\.xyric" | Out-Null
Copy-Item scripts\framework.env.example "$HOME\.xyric\framework.env"
# edit "$HOME\.xyric\framework.env" and fill in real keys
```

Never commit a filled copy of this file. `scripts/use-profile.sh` (see each
profile's setup notes below) reads it and exports the right `ANTHROPIC_*`
variables for the session. Override the file location with `XYRIC_ENV_FILE`
if you keep it elsewhere.

On Windows PowerShell, use `scripts/use-profile.ps1` for the same profile
switching without requiring Bash.

## Core Rule

At batch start, always record both:

- Loop primitive: `none`, `/goal`, `/loop`, or `ultracode:`.
- Runtime profile: `codex-native`, `claude-native`, `glm-coding-backend`,
  `deepseek-coding-backend`, `local-qwen-mlx`, or `gateway-router`.

Infer execution-control details from Blueprint and Forgeflow evidence when they
are present, including worker scope, allowed files, denied actions, verification,
evidence paths, and stop conditions. Do not ask the user to author worker specs
when the active docs and repo evidence can determine them. Ask the user only for
true personalization, safety-blocking choices, unavailable credentials/tokens,
runtime access, or destructive/irreversible approvals. Never commit API keys,
personal shell profiles, provider dashboards, or private quota screenshots.

## Loop Primitive Ladder

Use the smallest primitive that can close the batch with proof.

| Primitive | Use when | Required proof | Stop when |
|-----------|----------|----------------|-----------|
| `none` | The batch is short and can finish in the current session. | Verify command and closeout checklist. | Verification, ledgers, progress, and handoff are updated. |
| `/goal` | There is one verifiable batch outcome that may need continuation. | Named goal, verify command, evidence path, and closeout writes. | The goal is verified or a blocking stop condition fires. |
| `/loop` | The work is polling or waiting on external state such as CI, deploys, PR checks, queues, or reviews. | Poll target, cadence, timeout, verify command, and closeout writes. | The external state resolves, times out, or needs human action. |
| `ultracode:` | The work is a bounded audit, migration, research sweep, or repeated code operation. | Scope cap, first small run, rollback/verification path, and evidence path. | The bounded slice finishes, repeated failure appears, or scope expands. |

Do not use `ultracode:` for open-ended implementation. Do not use `/loop` as a
substitute for unclear scope.

## Runtime Profiles

Profiles-first is the V2 default. Select one profile per batch, and record a
worker backend only when one is actually used.

| Profile | Default role | When to choose | Guardrail |
|---------|--------------|----------------|-----------|
| `codex-native` | Codex orchestrator and optional worker. | Planning, architecture, safety-sensitive work, final review, or any batch running through Codex without an explicit worker need. | Confirm the Codex session can run the required tools and verification commands; keep provider secrets out of committed files. |
| `claude-native` | Claude orchestrator and optional worker. | Planning, architecture, safety-sensitive work, final review, or any batch running through Claude Code without an explicit worker need. | Confirm `/status`; avoid provider base URLs in the native session. |
| `glm-coding-backend` | Worker only. | Routine coding, narrow refactors, debugging, and bounded implementation slices where the Z.ai GLM Coding Plan subscription is intentionally selected. | Use a dedicated terminal/profile; smoke-test Coding Plan access before the batch counts; record provider/model/plan evidence without committing account URLs or credentials. |
| `deepseek-coding-backend` | Worker only. | Routine coding, narrow refactors, debugging, and bounded implementation slices through the direct DeepSeek API. | Use a dedicated direct-API profile; smoke-test before the batch counts; record provider/model/quota evidence and watch web-search/token costs. |
| `local-qwen-mlx` | Worker only. | Local/offline code search, summarization, draft patches, and bounded routine implementation using the user-provided `qwen3.6:27b-mlx` model or another explicitly selected local model. | Use file-based task packets first; record runner command or local API endpoint, model ID, output path, and verification evidence. |
| `gateway-router` | Future router, not default. | Only after gateway governance, budget controls, logging, and model-routing evidence are in place. | Do not activate as an implicit default. |

## Profile Setup Notes

### `codex-native`

Use Codex without delegating to a separate provider or worker harness. Confirm
the project has the needed local runtime access, repository permissions, and
verification commands before counting the batch.

Record the following before implementation or review:

- Active orchestrator: `Codex`.
- Required tool/runtime access and any unavailable credentials.
- Verify command and evidence path.
- Usage guard, timeout, or stop condition.

Do not commit Codex-local configuration, provider credentials, private runtime
paths, or screenshots of account/quota pages. If a later step delegates to a
worker backend, fill a worker task packet first and keep worker output as
evidence until Codex verifies it.

### `claude-native`

Use Claude Code without a provider override. Confirm account/model state before
counting the batch.

```sh
source scripts/use-profile.sh native
claude
/status
/model default
```

PowerShell:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force
.\scripts\use-profile.ps1 native
claude
/status
/model default
```

Manual (no script, or a non-bash shell):

```sh
unset ANTHROPIC_BASE_URL
unset ANTHROPIC_AUTH_TOKEN
unset ANTHROPIC_API_KEY
claude
/status
/model default
```

Acceptable native model choices are the aliases available in the current Claude
Code session, such as `default`, `sonnet`, `opus`, `haiku`, `best`, `fable`, or
other aliases shown by `/model`.

### `glm-coding-backend`

Use a separate shell profile or terminal session for the Z.ai GLM Coding Plan
subscription. The last reviewed Anthropic-compatible endpoint for the plan is
below; confirm current auth-variable requirements in Z.ai's onboarding docs
before first use.

Do not commit personal plan URLs, account pages, API keys, or subscription
screenshots. Account access is needed only during a real project smoke test, not
to ship this public framework.

```sh
source scripts/use-profile.sh glm
claude
/status
```

PowerShell:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force
.\scripts\use-profile.ps1 glm
claude
/status
```

Manual (no script, or a non-bash shell) -- reads the real key from
`~/.xyric/framework.env` yourself instead of via `scripts/use-profile.sh`:

```sh
export ANTHROPIC_BASE_URL="https://api.z.ai/api/anthropic"
export ANTHROPIC_AUTH_TOKEN="your_z_ai_api_key"
claude
/status
```

Z.ai's model-switching docs currently show GLM-5.2 model settings in
`~/.claude/settings.json`:

```json
{
  "env": {
    "CLAUDE_CODE_AUTO_COMPACT_WINDOW": "1000000",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "glm-4.5-air",
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "glm-5.2[1m]",
    "ANTHROPIC_DEFAULT_OPUS_MODEL": "glm-5.2[1m]"
  }
}
```

If the provider docs require `ANTHROPIC_API_KEY` or another variable instead of
`ANTHROPIC_AUTH_TOKEN`, use the documented current variable and record that in
the batch. Do not commit this shell setup or user-level settings.

### `deepseek-coding-backend`

Use DeepSeek as a direct API worker, not as a gateway default and not as part of
the `claude-native` Pro/Max subscription path. The variables below use
DeepSeek's Anthropic-compatible API endpoint from DeepSeek's Claude Code
integration docs, but the provider and quota are DeepSeek's direct API.

```sh
source scripts/use-profile.sh deepseek
claude
/status
```

PowerShell:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force
.\scripts\use-profile.ps1 deepseek
claude
/status
```

For a direct API key/model smoke test without launching Claude Code:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force
.\scripts\deepseek-worker.ps1 -Ping
```

Manual (no script, or a non-bash shell) -- reads the real key from
`~/.xyric/framework.env` yourself instead of via `scripts/use-profile.sh`:

```sh
export ANTHROPIC_BASE_URL="https://api.deepseek.com/anthropic"
export ANTHROPIC_AUTH_TOKEN="your_deepseek_api_key"
export ANTHROPIC_MODEL="deepseek-v4-pro[1m]"
export ANTHROPIC_DEFAULT_OPUS_MODEL="deepseek-v4-pro[1m]"
export ANTHROPIC_DEFAULT_SONNET_MODEL="deepseek-v4-pro[1m]"
export ANTHROPIC_DEFAULT_HAIKU_MODEL="deepseek-v4-flash"
export CLAUDE_CODE_SUBAGENT_MODEL="deepseek-v4-flash"
export CLAUDE_CODE_EFFORT_LEVEL="max"
claude
/status
```

Treat DeepSeek worker output as evidence until the orchestrator verifies it
against the batch's source hierarchy and deterministic gates.

### `local-qwen-mlx`

Use the local Qwen MLX model, or another explicitly selected local model, as an
explicit worker profile, not as an automatic router. Prefer file-based task
packets until the local runner or API endpoint is reviewed and stable.

Record the following before delegation:

- Model identifier: `qwen3.6:27b-mlx`.
- Local runner command or local API endpoint.
- Task packet path.
- Output/evidence path.
- Verify command.
- Scope cap and stop condition.

The local worker should draft, inspect, summarize, or propose bounded changes.
It should not make final architecture, security, privacy, destructive migration,
production, or readiness decisions. The orchestrator must verify the output
before any result becomes durable Forgeflow truth.

If the local worker is reached through OpenCode, follow
`runbooks/opencode-worker.md`. OpenCode remains an optional worker harness, not
the orchestrator.

Future local LLMs should reuse this shape: name the model, endpoint or runner,
packet path, output path, verify command, and stop condition before delegation.

### `gateway-router`

Document only. Read `runbooks/gateway-router.md` before any experiment. Do not
route automatically until the project has:

- Approved gateway source docs.
- Budget and quota controls.
- Per-request logging that is safe to persist.
- A fallback path when a routed model is unavailable.
- A closeout rule that identifies which model produced each material output.

## Batch Record Fields

Record this intake block in the batch artifact before implementation begins:

```yaml
loop_primitive: none | /goal | /loop | ultracode:
runtime_profile: codex-native | claude-native | glm-coding-backend | deepseek-coding-backend | local-qwen-mlx | gateway-router
orchestrator_role: Codex or Claude orchestrates through Forgeflow artifacts
worker_backend: none | GLM | DeepSeek | local-qwen-mlx | gateway | local
provider: none | Codex | Claude | Z.ai | DeepSeek | Ollama | OpenCode | gateway | mock
model: model id or n/a
endpoint_class: native | provider-api | gateway | local | mock
verify_command: command to run
evidence_path: path to logs, screenshots, notes, or test output
usage_guard: /status, provider smoke test, quota note, or timeout
worker_task_packet: path or n/a
worker_output_path: path or n/a
saved_workflow: path or n/a
closeout_writes:
  - batch file
  - findings-ledger.md
  - deferred-decisions.md
  - accepted-improvements.md
  - _progress.md
  - plans/next-session-handoff.md
```

## Closeout Rule

Worker output is not durable truth until the orchestrator verifies it and writes
the normal Forgeflow closeout artifacts. If a worker backend was used, the batch
must name the backend, evidence path, verify command result, and any usage/quota
issue encountered.

## Sources

- Claude Code model configuration: https://code.claude.com/docs/en/model-config
- Z.ai GLM Coding Plan overview: https://docs.z.ai/devpack/overview
- Z.ai model switching: https://docs.z.ai/devpack/latest-model
- DeepSeek Claude Code integration: https://api-docs.deepseek.com/quick_start/agent_integrations/claude_code
- DeepSeek Anthropic API compatibility: https://api-docs.deepseek.com/guides/anthropic_api
