<!-- TEMPLATE — How to use:
  Stage 4 of Blueprint (BLUEPRINT.md Part A + Part C1). The AI scores the architecture on the
  complexity/risk rubric (complexity-rubric.md) and uses JUDGMENT to cut the work into ordered phases
  — no fixed number. Each phase has a goal, an exit condition, a MoSCoW emphasis, and the components it
  delivers. The gate asks only ambition/sequencing (personal) calls. Fill a COPY. Delete this comment. -->

# <PRODUCT_NAME> — Phase Plan

- Status: `not-started` | `drafted` | `gate-open` | `locked`
- Last updated: <YYYY-MM-DD>
- Source architecture: `<path to architecture.md>` (must be `locked`)
- Rubric scores: see `complexity-rubric.md`
- Personalization gate: see `personalization-gate.md` → Phases

## Rubric summary (why this many phases)
| Dimension | Score (1–5) | Note |
|-----------|-------------|------|
| Scope size | <n> | |
| Dependency depth | <n> | |
| Uncertainty / novelty | <n> | |
| Integration count | <n> | |
| Blast radius | <n> | |
| Context-fit | <n> | <drives segment granularity, not phase count> |
| **Total** | **<sum>** | <one line on how the score shaped the phase cut> |

## Phases (ordered)

### Phase 1 — <name>
- **Goal:** <what this phase makes true>.
- **MoSCoW emphasis:** <mostly Must / etc.>.
- **Components delivered:** <C1, C2…>.
- **Requirements covered:** <R1.1…>.
- **Risk handled / deferred:** <which unknowns this phase resolves or quarantines>.
- **Exit condition (proceed / pivot / hold):** <observable condition that ends the phase>.
- **Depends on:** <earlier phases, or none — never a later phase>.

### Phase 2 — <name>
<…same structure…>

## Sequencing rationale
<One paragraph: why this order. Note any hard sequencing the user required at the gate, and whether a risky unknown was front-loaded or a quick win led.>

## Build order & parallelization (the speed lever)
> Filled when segments are derived (Stage 5). Within each phase, mark which segments are independent (can build concurrently) vs serial, and the critical path. Forgeflow seeds `_progress.md` from this — segments in the same parallel-safe group can be built at once; the critical path is the longest dependency chain that bounds the phase.

| Phase | Parallel-safe groups (build concurrently) | Serial chain (must build in order) | Critical path |
|-------|-------------------------------------------|------------------------------------|---------------|
| Phase 1 | <{S1.1, S1.2}> | <S1.3 after S1.1> | <S1.1 → S1.3 → …> |

## Coverage check (Architecture ↔ Phases)
| Component | Phase |
|-----------|-------|
| C1 | Phase 1 |
| C2 | Phase 1 |

## Validation gate (before `locked`)
- [ ] Every architecture component lands in exactly one phase.
- [ ] No phase depends on a later phase; dependencies respected.
- [ ] Each phase has a goal, MoSCoW emphasis, and an exit condition.
- [ ] Build order & parallelization filled (parallel-safe groups + critical path) once segments exist.
- [ ] Rubric scored; phase count justified by the score.
- [ ] Personalization gate (ambition/sequencing) recorded in `personalization-gate.md`.
- [ ] `blueprint-progress.md` shows Phases = `locked`; `next-steps-handoff.md` points to Segments.
