<!-- TEMPLATE — How to use:
  The NEXT-STEPS cold-start handoff for a Blueprint run (BLUEPRINT.md Part C5). Write this at the end
  of every meaningful session so the next session resumes without chat history. Keep EXACTLY ONE active
  next action. Canonical path: plans/next-steps-handoff.md. Fill a COPY. Delete this comment when done. -->

# <PRODUCT_NAME> — Blueprint Next-Steps Handoff

- Last updated: <YYYY-MM-DD HH:MM TZ>
- Status: <NOT READY | BUILD_READY | BLOCKED>
- Current stage: <Vision | PRD | Architecture | Phases | Segments | Handoff>
- Exact next action: <one bounded unit of work — e.g. "open the PRD personalization gate">

## Read-First Order
1. `<root CLAUDE.md / AGENTS.md>`
2. `<DOCS_ROOT>/<PRODUCT_NAME>/blueprint-progress.md`
3. `<the latest locked stage doc>`
4. `<DOCS_ROOT>/<PRODUCT_NAME>/personalization-gate.md`

## Start By
```bash
cd <repo>
git log --oneline -3
node blueprint/verify/portability-check.mjs <DOCS_ROOT>/<PRODUCT_NAME>
```
Expected state:
- Last locked stage: <stage>
- Active stage: <stage> — <drafted / gate-open / not-started>
- One active next action: <yes/no>

## Current State
- Stages locked: <list>
- Active stage: <stage + sub-state>
- Open personalization gate? <which stage, how many questions pending>

## Completed Last Session
| Stage / artifact | What changed | Evidence |
|------------------|--------------|----------|
| <stage> | <what was drafted/gated/locked> | `<path>` |

## Open Blockers
| ID | Severity | Blocked work | Next action | Closure condition |
|----|----------|--------------|-------------|-------------------|
| <B-001> | <critical/major/minor> | <what cannot proceed> | <step> | <how unblocked> |

## Do Not Do Yet
- <constraint: stage that must not start until the previous gate is locked or a blocker clears>

## Next Slice
Goal: <single concrete work unit>.
Inputs:
- `<path/source>`
Expected outputs:
- `<path/artifact>`
Done when:
- <observable acceptance criterion>
- <gate recorded + stage locked + ledgers updated>

## Maintenance Contract
- Update this handoff whenever the active stage, next action, or blocker status changes.
- Keep exactly one active next action.
- A stage is `locked` only when its personalization gate is recorded and its validation gate passes.
- If this file conflicts with `blueprint-progress.md`, trust the ledger, log the drift, and fix this file.
