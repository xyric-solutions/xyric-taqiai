<!-- TEMPLATE — How to use:
  The durable PROGRESS ledger for a Blueprint run (BLUEPRINT.md Part C5). A fresh session reconstructs
  the whole run from this file: which stages are locked, which phase/segment is active, every gate's
  Q/A status, and the verification evidence. The status tables ARE the "visually seen" board — no
  separate dashboard needed. Fill a COPY. Delete this comment when done. -->

# <PRODUCT_NAME> — Blueprint Progress Ledger

- Last updated: <YYYY-MM-DD>
- Current stage: <Vision | PRD | Architecture | Phases | Segments | Handoff>
- Docs root: `<DOCS_ROOT>/<PRODUCT_NAME>/`
- Handoff status: <NOT READY | BUILD_READY | BLOCKED>

## Do Not Assume
- <warning future sessions must not assume, e.g. a stage is locked when its gate is still open>

## Stage Status
| Stage | Status | Gate status | Doc | Last evidence |
|-------|--------|-------------|-----|---------------|
| Vision | not-started \| drafted \| gate-open \| locked | pending \| answered \| accepted-default \| locked | `vision.md` | — |
| PRD | not-started | pending | `prd.md` | — |
| Architecture | not-started | pending | `architecture.md` | — |
| Phases | not-started | pending | `phase-plan.md` | — |
| Segments | not-started | pending | `segments/` | — |

## Phase Status
| Phase | Status | Components | Segments | Notes |
|-------|--------|-----------|----------|-------|
| Phase 1 — <name> | not-started \| drafted \| locked | <C1, C2> | <S1.1, S1.2> | — |

## Segment Status (these become Forgeflow batches 1:1)
| Segment ID | Phase | Status | Buildable+verifiable? | Traces to (caps/reqs) |
|------------|-------|--------|-----------------------|-----------------------|
| S1.1 | Phase 1 | not-started \| drafted \| locked | <yes/no> | <CAP-1 / R1.1> |

## Gate Q/A Status
| Stage | Questions | Answered | Accepted-default | Locked |
|-------|-----------|----------|------------------|--------|
| Vision | <n> | <n> | <n> | <yes/no> |

## Current Blockers
| ID | Severity | Blocked work | Next action | Closure condition |
|----|----------|--------------|-------------|-------------------|
| <B-001> | <critical/major/minor> | <work> | <action> | <condition> |

## Verification Evidence
| Date | Check | Result | Evidence | Notes |
|------|-------|--------|----------|-------|
| <YYYY-MM-DD> | `node blueprint/verify/portability-check.mjs .` | <pass/fail> | `<summary>` | <notes> |
