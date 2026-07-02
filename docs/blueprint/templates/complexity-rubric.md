<!-- TEMPLATE — How to use:
  The scoring sheet that drives the phase cut (Stage 4) and segment granularity (Stage 5) — BLUEPRINT.md
  Part C1/C3. The AI scores each dimension 1–5 from the locked Architecture, then uses JUDGMENT (not a
  formula) to decide how many phases and how fine the segments. This is also where the MoSCoW emphasis
  and stage-gate (proceed/pivot/hold) thinking folded in from the former Product-Manager skill lives.
  Fill a COPY. Delete this comment when done. -->

# <PRODUCT_NAME> — Complexity / Risk Rubric

- Last updated: <YYYY-MM-DD>
- Scored from: `<path to architecture.md>` (must be `locked`)

## Scores
| Dimension | 1 (low) | 3 (medium) | 5 (high) | Score | Evidence |
|-----------|---------|------------|----------|-------|----------|
| Scope size | one capability | several | many interdependent | <n> | <why> |
| Dependency depth | flat | some ordering | deep chains | <n> | <why> |
| Uncertainty / novelty | well-trodden | partly novel | research-grade | <n> | <why> |
| Integration count | self-contained | a few | many contracts | <n> | <why> |
| Blast radius | isolated/reversible | moderate coupling | touches core / hard to reverse | <n> | <why> |
| Context-fit | small surface (few files, mostly new) | moderate (several files, some existing) | large surface (many files / heavy existing-code reading) | <n> | <why> |
| **Total** | | | | **<sum>** | |

> **Context-fit drives segment granularity, not phase count.** It estimates how much a build agent must hold in one context: files/surface touched, new-vs-modified ratio (modifying existing code costs more context than green-field), and spec size. A high context-fit score means cut **finer segments** so no single segment overflows one build context — the failure mode that causes hallucination and quality loss.

## Reading the score (guidance, not a rule)
Six dimensions, max 30. **Scope/dependency/uncertainty/integration/blast-radius** shape the **phase** cut; **context-fit** independently forces **finer segments** regardless of total.
- **≈6–12** → often one phase, a handful of segments.
- **≈13–22** → a few phases; segments cut along dependency seams.
- **≈23–30** → several phases; finer segments; front-load or quarantine the risky unknowns.
- **Context-fit ≥4 on its own** → split segments finer in the affected area even if the total is low, so no segment overflows a build context.

## Per-phase emphasis (folds in MoSCoW + stage-gate)
| Phase | MoSCoW emphasis | Risk this phase resolves | Exit gate (proceed / pivot / hold) |
|-------|-----------------|--------------------------|------------------------------------|
| Phase 1 | <mostly Must> | <unknown resolved> | <observable condition> |

## How this shaped the cut
<One paragraph: how the scores translated into the phase count and segment granularity in phase-plan.md and segments/. Note anything the user's personalization answers overrode (e.g. a required sequencing).>
