<!-- TEMPLATE — How to use:
  Stage 2 of Blueprint (BLUEPRINT.md Part A). The PRD owns HOW THE VISION BECOMES ACHIEVABLE: each
  Vision capability turned into concrete, testable requirements with personas, acceptance criteria,
  metrics, and MoSCoW scope. The AI DRAFTS it in full using best practice, THEN opens the
  personalization gate. 100% capability coverage — no capability unrequired, no requirement orphaned.
  Fill a COPY. Delete this comment when done. -->

# <PRODUCT_NAME> — PRD

- Status: `not-started` | `drafted` | `gate-open` | `locked`
- Last updated: <YYYY-MM-DD>
- Source vision: `<path to vision.md>` (must be `locked`)
- Personalization gate: see `personalization-gate.md` → PRD

## Personas
| ID | Persona | Goals | Frustrations today | Priority |
|----|---------|-------|--------------------|----------|
| P1 | <persona> | <goals> | <frustrations> | <set at gate> |

## Requirements (grouped by Vision capability)

> Every requirement carries an ID `R<cap>.<seq>` and traces up to a capability. MoSCoW: Must / Should / Could / Won't (this version).

### CAP-1 — <capability name>
#### R1.1 — <requirement title>
- **User story:** As a <persona>, I want <goal>, so that <benefit>.
- **Acceptance criteria (BDD):**
  - Given <context>, when <action>, then <observable outcome>.
  - Given <edge context>, when <action>, then <handled outcome>.
- **Success metric:** <quantified target>.
- **MoSCoW:** <Must | Should | Could | Won't> *(the cut is a gate decision)*.
- **Best-practice defaults applied (not gated):** <validation, error handling, accessibility, security defaults the AI applied silently>.
- **Dependencies:** <other requirement IDs, or none>.

### CAP-2 — <capability name>
#### R2.1 — <requirement title>
<…same structure…>

## Scope summary (MoSCoW)
| MoSCoW | Requirements | Notes |
|--------|--------------|-------|
| Must | <IDs> | v1 core |
| Should | <IDs> | |
| Could | <IDs> | |
| Won't (this version) | <IDs> | deferred |

## Success metrics roll-up
| Metric | Target | Source requirement |
|--------|--------|--------------------|
| <metric> | <target> | <R-ID> |

## Coverage check (Vision ↔ PRD)
| Capability | Requirements covering it |
|------------|--------------------------|
| CAP-1 | <R1.1, R1.2…> |
| CAP-2 | <R2.1…> |

## Validation gate (before `locked`)
- [ ] 100% capability coverage — every capability has ≥1 requirement; every requirement has a parent capability.
- [ ] Every requirement has BDD acceptance criteria and a quantified success metric.
- [ ] MoSCoW cut decided at the gate; no `TBD`.
- [ ] No best-practice questions were asked of the user (defaults applied silently and listed).
- [ ] Personalization gate recorded in `personalization-gate.md`.
- [ ] `blueprint-progress.md` shows PRD = `locked`; `next-steps-handoff.md` points to Architecture.
