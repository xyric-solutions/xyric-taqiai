<!-- TEMPLATE — How to use:
  Stage 5 of Blueprint (BLUEPRINT.md Part A + Part C6). A SEGMENT is the buildable unit: independently
  buildable + verifiable in one build pass, and traceable up the chain. It is authored in FORGEFLOW-BATCH
  SHAPE — the fields below mirror forgeflow/templates/batch-template.md, so Forgeflow's `start-batch`
  consumes this file with no translation and the segment ID becomes the batch ID. Blueprint fills the
  intent (top); Forgeflow fills the build evidence (item notes + completion gate) at build time.
  One file per segment under <DOCS_ROOT>/<PRODUCT_NAME>/segments/. Delete this comment when done. -->

# <SEGMENT_ID> — <Segment title>

<!-- Batch-shape fields (consumed by Forgeflow start-batch). SEGMENT_ID is reused verbatim as BATCH_ID. -->
- Status: `not started` | `in progress` | `reviewed` | `closed`
- Theme: <theme>
- Phase: <Phase N — name>
- Session cap: <N items>
- Reviewed date / URL / evidence path: <…>
- Build gate this batch? <yes (every 3rd + foundation) / no — run check always>
- Active root: `<path — set when Forgeflow builds>`
- Source links: `<vision.md / prd.md / architecture.md / phase-plan.md>`
- Handoff status target: <READY | READY WITH WAIVERS | BLOCKED>

## Why this is one buildable unit
<One or two sentences: why this segment is independently buildable AND independently verifiable in a single pass. If you can't say how it's verified on its own, it's mis-cut — split it.>

## Traceability (Blueprint intent — the build verifies against this)
| This segment satisfies | IDs |
|------------------------|-----|
| Phase | <Phase N> |
| Architecture components | <C1, C2> |
| PRD requirements | <R1.1, R2.1> |
| Vision capabilities | <CAP-1> |

## Acceptance (definition of done for the segment)
- [ ] <observable criterion — derived from the PRD acceptance criteria it satisfies>
- [ ] <observable criterion>
- [ ] Test expectation: <which levels apply (unit / integration / E2E) + what they must cover — inherited from the architecture Testing standard for what this segment touches>
- [ ] NFR checks: <only the architecture NFR targets relevant to this segment, e.g. p95 < 300ms, WCAG AA — "n/a" if none apply>
- [ ] Verification: `<command / check>` → <expected result>

## Batch summary
- Ship-ready: <items>
- Must-fix: <items>
- Redesign / rework candidates: <items>
- Open questions for the user: <items>

## Item checklist
| Item | Locator | Status |
|------|---------|--------|
| <item> | `<locator>` | not_started |

## Item notes (one full section per item — Forgeflow fills these at build time)

### <item id> — <item name>
- Evidence (screenshot / output path): `<path>`

| Findings | Severity | Category | Evidence | Recommendation | Status |
|----------|----------|----------|----------|----------------|--------|
| <finding or "No major findings"> |  |  |  |  |  |

**Decision:** ship-ready | must-fix | rework | needs-user-decision

## Completion gate (before status `closed` — Forgeflow's gate)
- [ ] Every worked item has a full notes section in THIS file
- [ ] Acceptance criteria above all met and verified
- [ ] Traceability still holds (segment satisfied its requirements)
- [ ] Verify command run and result recorded: `<VERIFY_COMMAND>` → <result>
- [ ] `<PATH/_progress.md>` updated (Forgeflow build ledger)
- [ ] `plans/next-session-handoff.md` updated with status, blockers, drift, and exact next slice
