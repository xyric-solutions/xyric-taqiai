# Forgeflow Runbook: GLM Workflow Worker

## Purpose

Use the GLM Coding Plan as a cheap generation sub-worker *inside* a `Workflow`
tool script's `agent()` calls — not as the whole `claude` session. GLM handles
bulk generation (drafts, sketches, boilerplate, mechanical transforms); Claude
spends tokens only on orchestration, judging, and verification. This is a
different mechanism from the `glm-coding-backend` runtime profile in
`runbooks/runtime-profiles.md`, which switches the *entire* Claude Code session
to GLM. Use this runbook when Claude stays the orchestrator and GLM does one
narrow generation step; use `glm-coding-backend` when GLM should be the whole
worker session.

Last reviewed against primary sources: 2026-07-01 (Anthropic Messages API
reference, confirmed live against `api.z.ai/api/anthropic` — see Sources).

## Why A Bridge Is Needed

The Workflow `agent()` `model:` field only accepts `sonnet | opus | haiku |
fable`. There is no GLM entry in that enum, so GLM cannot be a first-class
Workflow model. Instead, `scripts/glm-worker.sh` calls GLM directly over HTTP
(the Anthropic Messages API format, since `api.z.ai/api/anthropic` is an
Anthropic-compatible endpoint), and a thin wrapper agent shells out to it. The
wrapper agent runs on `haiku` at `effort: 'low'` so its own Claude overhead is
negligible; the real generation happens in GLM.

## Setup

1. Complete the one-time global env setup in `runbooks/runtime-profiles.md`
   ("API Key Setup") — `scripts/glm-worker.sh` reads the same `ZAI_API_KEY`
   from `~/.xyric/framework.env` that `scripts/use-profile.sh glm` uses. No
   separate credential to manage.
2. Health-check before a run:
   ```bash
   ./scripts/glm-worker.sh --ping   # expect: OK model=glm-5.1 reply=pong
   ```
   PowerShell:
   ```powershell
   Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force
   .\scripts\glm-worker.ps1 -Ping   # expect: OK model=glm-5.1 reply=pong
   ```
3. Paste the `glm()` helper below near the top of any Workflow script that
   needs it (Workflow scripts cannot `import`).

## The `glm()` Helper (canonical snippet)

```js
// GLM worker bridge. Runs scripts/glm-worker.sh via a thin haiku wrapper agent.
// Returns GLM's stdout as a string (evidence only -- see policy below).
function glm(prompt, opts = {}) {
  const flags = []
  if (opts.glmModel) flags.push(`-m ${opts.glmModel}`)
  if (opts.maxTokens) flags.push(`-t ${opts.maxTokens}`)
  return agent(
    `You are a shell runner. Run EXACTLY this command from the repo root and ` +
    `return ONLY the command's verbatim stdout -- no commentary, no code fences:\n\n` +
    `cat <<'GLMEOF' | ./scripts/glm-worker.sh ${flags.join(' ')}\n${prompt}\nGLMEOF\n`,
    {
      agentType: 'general-purpose', // needs Bash; default workflow agent lacks it
      model: 'haiku',
      effort: 'low',
      label: opts.label || 'glm',
      phase: opts.phase,
    }
  )
}
```

Usage inside a phase:

```js
phase('Draft')
const sketches = await parallel(
  bases.map(b => () => glm(`Sketch a minimal ${b} skeleton.`,
                           { label: `glm:${b}`, phase: 'Draft' }))
)
```

## Cost Model — When GLM Pays Off

- **Use GLM for:** first-draft generation, N-way sketches, boilerplate,
  mechanical rewrites — anything where the output is *evidence to be
  reviewed*, not a final decision.
- **Keep on Claude:** judging, scoring, cross-checking, verification, and any
  phase that writes a canonical Forgeflow artifact (ADR, ledger, closeout).
- The Haiku wrapper adds Claude-side overhead per GLM call. Worth it when the
  GLM phase would otherwise be a `sonnet`/`opus` generation call; not worth it
  for tiny prompts — call Claude directly for those.

## Non-Negotiable Guardrails

1. **GLM output is evidence only** until the orchestrator reviews it, verifies
   it, and writes the Forgeflow closeout artifacts. Never let a GLM string
   become a canonical doc unreviewed.
2. **Never send identifiable private/sensitive data** to the GLM worker.
   Schema, resource shapes, architecture, and public-standard content are
   fine; real user/patient/client data is not.
3. **No secrets in the repo.** The key lives in `~/.xyric/framework.env`
   (`ZAI_API_KEY`), outside any repo, read at runtime by
   `scripts/glm-worker.sh`. Never commit keys, quota, subscription pages, or
   screenshots — only a safe smoke-test summary (e.g. `--ping` returned OK).

## Accept Criteria For A Pilot

- `scripts/glm-worker.sh --ping` returns `OK model=... reply=...`.
- On Windows, `scripts/glm-worker.ps1 -Ping` returns the same shape.
- The wrapper agent's stdout is exactly GLM's response, no extra commentary.
- GLM output lands in the evidence path as a draft, not a canonical artifact.
- The orchestrator can accept, reject, or defer the GLM draft from the
  evidence alone.

## Reject Or Defer Criteria

- `ZAI_API_KEY` is missing or the ping check fails — fix the global env file
  before the batch counts.
- A phase tries to write a GLM draft directly into a canonical Forgeflow
  artifact without orchestrator review.
- The prompt would send identifiable private/sensitive data to a third-party
  API.

## Sources

- Anthropic Messages API reference (endpoint, headers, request/response
  shape): https://platform.claude.com/docs/en/api/messages
- Claude Code credential-to-header mapping (`ANTHROPIC_AUTH_TOKEN` →
  `Authorization: Bearer`, confirms the header this script uses):
  https://code.claude.com/docs/en/llm-gateway-connect
- Z.ai GLM Coding Plan overview: https://docs.z.ai/devpack/overview
- Z.ai model switching: https://docs.z.ai/devpack/latest-model
