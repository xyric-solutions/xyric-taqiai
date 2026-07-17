<!-- TEMPLATE — How to use:
  The durable batch deliverable (FRAMEWORK.md move Plan & Slice (A4), taxonomy C10). THE batch file IS the deliverable —
  not a thin status table plus notes elsewhere. Every item gets a full compiled section here before the
  batch closes. The completion gate at the bottom is what makes a batch "closed". Delete this comment when
  done. -->

# <BATCH_ID> — <Batch title>

- Status: `not started` | `in progress` | `reviewed` | `closed`
- Theme: <theme>
- Session cap: <N items> (see FRAMEWORK.md §C4 sizing)
- Reviewed date / URL / evidence path: <…>
- Build gate this batch? <yes (every 3rd + foundation) / no — run check always>
- Active root: `<path>`
- Source links: `<active docs/stories/work items>`
- Handoff status target: <READY | READY WITH WAIVERS | BLOCKED>
- Pre-development doc gate: <READY | READY WITH WAIVERS | BLOCKED>
- Documentation evidence path: `<path>`
- Loop primitive: `none` | `/goal` | `/loop` | `ultracode:`
- Runtime profile: `codex-native` | `claude-native` | `glm-coding-backend` | `deepseek-coding-backend` | `local-qwen-mlx` | `gateway-router`
- Orchestrator role: <Codex when using Codex / Claude when using Claude Code / person orchestrating through Forgeflow artifacts>
- Worker backend: <none / GLM / DeepSeek / local-qwen-mlx / gateway / local>
- Provider: <none / Codex / Claude / Z.ai / DeepSeek / Ollama / OpenCode / gateway / mock>
- Model: <model ID or n/a>
- Endpoint class: <native / provider-api / gateway / local / mock>
- Worker task packet: `<path or n/a>`
- Worker output path: `<path or n/a>`
- Saved workflow: `<path or n/a>`
- Usage guard: <subscription status / provider quota / smoke-test evidence>
- Verify command: `<command>`

## Pre-development gate (before status `in progress`)
- [ ] Active docs, archived docs, and tie-breaker source identified
- [ ] Source links resolve to active docs, work items, traceability rows, or live code paths
- [ ] Blueprint `BUILD_READY` marker and traceability matrix checked, if Blueprint-backed
- [ ] Verification matrix gates selected for every expected change type
- [ ] Deterministic verify command and evidence path recorded
- [ ] Loop primitive and runtime profile recorded
- [ ] Worker smoke-test or local availability evidence recorded, if a worker is used
- [ ] Worker task packet filled before delegation, if a worker is used
- [ ] Worker output path recorded, if a worker is used
- [ ] Saved workflow / `ultracode:` small first run, usage guard, and stop condition recorded, if used
- [ ] Blockers, drift, and waivers recorded with owner, next action, and closure condition
- [ ] Gate result: <READY | READY WITH WAIVERS | BLOCKED>

## Shakedown coverage (for framework validation batches)
- [ ] Normal Blueprint-backed batch: `/goal` + native orchestration (`codex-native` or `claude-native`)
- [ ] Polling batch: `/loop`
- [ ] Bounded worker packet: `local-qwen-mlx`, another explicitly selected local model via Ollama, or documented mock worker
- [ ] Optional OpenCode worker evaluation recorded as optional evidence only

## Batch summary
- Ship-ready: <items>
- Must-fix: <items>
- Redesign / rework candidates: <items>
- Open questions for the user: <items>

## Item checklist
| Item | Locator | Status |
|------|---------|--------|
| <item> | `<locator>` | not_started |

## Item notes (one full section per item, in flow order)

### <item id> — <item name>
- First impression / five-second read: <…>
- Primary action / purpose clarity: <…>
- Evidence (screenshot / output path): `<path>`

| Dimension | Score | Notes |
|-----------|-------|-------|
| <dim> |  |  |

| Findings | Severity | Category | Evidence | Recommendation | Status |
|----------|----------|----------|----------|----------------|--------|
| <finding or "No major findings"> |  |  |  |  |  |

| Owner | Blocked work | Next action | Closure condition |
|-------|--------------|-------------|-------------------|
| <owner> | <blocked work or none> | <action> | <observable condition> |

**Decision:** ship-ready | must-fix | rework | needs-user-decision

## Completion gate (before status `closed`)
- [ ] Every worked item has a full notes + scores section in THIS file
- [ ] `<PATH/findings-ledger.md>` updated for all findings
- [ ] `<PATH/deferred-decisions.md>` updated for open decisions
- [ ] `<PATH/accepted-improvements.md>` updated for accepted improvements
- [ ] `<PATH/_progress.md>` updated
- [ ] Pre-development gate result and evidence path were recorded before implementation began
- [ ] Loop primitive, runtime profile, orchestrator role, worker backend, usage guard, evidence path, and closeout writes recorded
- [ ] Worker backend evidence verified by the orchestrator, if a worker was used
- [ ] Worker task packet and worker output path recorded, if a worker was used
- [ ] Saved workflow evidence reviewed, if `ultracode:` or a saved workflow was used
- [ ] Verify command run and result recorded: `<VERIFY_COMMAND>` → <result>
- [ ] Deferred items + open questions listed in the summary
- [ ] `plans/next-session-handoff.md` updated with status, blockers, drift, waivers, dirty-worktree cautions, and exact next slice
