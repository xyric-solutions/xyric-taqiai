<!-- TEMPLATE - Worker task packet. Copy into a batch evidence folder, fill every field, and delete this comment before delegation. Worker output is evidence only until orchestrator verification. -->

# <BATCH_ID> - Worker Task Packet

- Packet status: `draft` | `issued` | `worker-output-received` | `orchestrator-reviewed` | `closed`
- Parent batch: `<BATCH_ID>`
- Packet ID: `<PACKET_ID>`
- Issued by: `<Codex or Claude active orchestrator>`
- Worker profile: `glm-coding-backend` | `deepseek-coding-backend` | `local-qwen-mlx` | `opencode-worker` | `mock-worker` | `<OTHER>`
- Worker harness: `<Codex session / Claude Code shell profile / OpenCode / Ollama / mock worker / other>`
- Runtime intake source: `<path to batch runtime intake block>`
- Source hierarchy: `<active source hierarchy pointer>`
- Tie-breaker source: `<source that wins when docs disagree>`
- Active root: `<repo-relative path>`
- Verify command: `<deterministic command>`
- Evidence path: `<repo-relative path for worker output>`
- Timeout / stop condition: `<time, turns, failures, or external condition>`

## Exact Scope

<One bounded task. Smaller than the parent batch.>

## Source Links

| Source | Locator | Why it matters |
|--------|---------|----------------|
| `<doc or code path>` | `<section, line, work item, trace row>` | `<reason>` |

## Allowed Files

| Path | Allowed operation |
|------|-------------------|
| `<repo-relative path>` | `read`, `edit`, or `propose-patch-only` |

## Denied Actions

- Do not edit files outside the allowed file list.
- Do not change secrets, auth, billing, production, deployment, or destructive migration settings.
- Do not create active local config files such as `opencode.json`, shell profiles, or provider credential files.
- Do not decide final readiness, architecture, security, privacy, safety, or production policy.
- Do not update ledgers, progress, or handoff as final truth.

## Worker Task Prompt

```text
You are a bounded Forgeflow worker.

Read this packet and only the named source files. Complete the exact scope, stay
inside the allowed files and denied actions, and write evidence to the evidence
path. If you cannot proceed safely, stop and write a blocked note naming the
stop condition.

Your output is evidence only until the orchestrator verifies it.
```

## Worker Output Format

Write to `<EVIDENCE_PATH>`:

```md
# Worker Output - <PACKET_ID>

- Worker profile:
- Harness:
- Started:
- Stopped:
- Stop condition:
- Files read:
- Files changed or proposed:
- Verify command:
- Verify result:

## Summary

## Evidence

## Proposed Patch Or Edits

## Blockers Or Waivers
```

## Orchestrator Review Checklist

- [ ] Packet was complete before delegation.
- [ ] Worker stayed within exact scope.
- [ ] Worker touched only allowed files or proposed a patch.
- [ ] Denied actions were not attempted.
- [ ] Evidence path exists and contains output.
- [ ] Verify command ran, or blocker/waiver is recorded.
- [ ] Output is mapped back to the parent batch item.
- [ ] Accepted findings are written to normal Forgeflow artifacts by the orchestrator.
- [ ] Rejected or deferred findings name the reason and next action.

## Orchestrator Decision

- Decision: `accepted` | `partially accepted` | `rejected` | `deferred`
- Verify result:
- Follow-up:
- Closeout files updated:
