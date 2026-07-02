<!-- TEMPLATE — How to use:
  Stage 3 of Blueprint (BLUEPRINT.md Part A). Architecture owns THE DESIGN OF THE POSSIBLE
  FUNCTIONALITIES: the components, data, integrations, and cross-cutting concerns that make the PRD
  requirements buildable. The AI DRAFTS it in full with best practice, THEN opens the personalization
  gate (build-vs-buy, stack, residency, debt appetite — where genuinely open). Every component traces
  up to ≥1 PRD requirement. Fill a COPY. Delete this comment when done. -->

# <PRODUCT_NAME> — Architecture

- Status: `not-started` | `drafted` | `gate-open` | `locked`
- Last updated: <YYYY-MM-DD>
- Source PRD: `<path to prd.md>` (must be `locked`)
- Personalization gate: see `personalization-gate.md` → Architecture

## System overview
<One paragraph + a diagram (Mermaid). The shape of the system and how the major pieces relate.>

```mermaid
flowchart LR
  <C1>[<component>] --> <C2>[<component>]
```

## Components
| ID | Component | Responsibility | Satisfies (PRD reqs) | Build / Buy | ADR? |
|----|-----------|----------------|----------------------|-------------|------|
| C1 | <name> | <what it does> | <R1.1, R2.1> | <set at gate> | <yes/no> |
| C2 | <name> | <…> | <…> | | |

## Data models
| Entity | Key fields | Owned by component | Migration / rollback | Notes |
|--------|-----------|--------------------|----------------------|-------|
| <entity> | <fields> | <C-ID> | <new table / additive — reversible? rollback step. "n/a" if no schema change> | <constraints, normalization — best-practice defaults> |

> For any entity whose creation or change touches existing data, the Migration / rollback cell must name the forward step AND how to reverse it. Destructive or irreversible changes are flagged here so a segment can carry an explicit rollback plan.

## Integrations & contracts
| Integration | Direction | Component | Contract / API | Failure handling |
|-------------|-----------|-----------|----------------|------------------|
| <system> | <in/out> | <C-ID> | <contract> | <retry/fallback — best-practice default> |

## Binding standards (best-practice defaults — applied, not gated, but BINDING on every segment)
> These are not just "applied silently" — they are the single definition every segment builds against, so two segments built in separate passes cannot drift into different error formats, auth models, or API shapes. At handoff this section seeds Forgeflow's `_shared-canon.md`. State the actual convention, not a pointer.

| Concern | Standard (the one definition) |
|---------|-------------------------------|
| Error format | <shape of every error response / code taxonomy, e.g. `{code, message, details}` + `DOMAIN_ACTION_ERROR` codes> |
| API conventions | <versioning, naming, pagination, status-code usage> |
| Auth / authz model | <how identity is established and permission is checked, per request> |
| Input validation | <where/how inputs are validated and rejected> |
| Naming / structure | <module/file/identifier conventions the build must follow> |
| Observability | <logging/metrics/tracing baseline> |

## Non-functional targets (quantified — these become hard-gate candidates)
> Quantify, don't gesture. An unmeasured "fast" or "accessible" silently drops. Each row with a target becomes a candidate binary hard-gate at handoff (`hard-gates.md`).

| NFR | Target (measurable) | Applies to |
|-----|---------------------|-----------|
| Performance | <e.g. API p95 < 300ms; web LCP < 2.5s> | <components/flows> |
| Accessibility | <e.g. WCAG 2.1 AA> | <UI components> |
| Security posture | <e.g. authn required on all non-public routes; secrets never logged> | <all> |
| Privacy / data | <e.g. GDPR/CCPA; PII classified + encrypted at rest> | <data components> |
| Reliability | <e.g. graceful degradation; retry/fallback on integration failure> | <integrations> |

## Testing standard (expected levels — segments inherit the relevant ones)
<State the baseline: which test levels apply (unit / integration / E2E), what each level must cover before a unit is "done", and the verify command shape. Segments inherit only the levels relevant to what they touch.>

## Architecture Decision Records (flags)
> One ADR per genuinely open architectural choice. The decision itself may be a personalization-gate item.

| ADR | Decision | Options | Recommended default + reason | Status |
|-----|----------|---------|------------------------------|--------|
| ADR-1 | <decision> | <A / B / C> | <default + why> | <open/decided at gate> |

## Coverage check (PRD ↔ Architecture)
| PRD requirement | Component(s) satisfying it |
|-----------------|----------------------------|
| R1.1 | <C1> |
| R2.1 | <C1, C2> |

## Validation gate (before `locked`)
- [ ] Every PRD requirement is satisfied by ≥1 component; every component traces to ≥1 requirement.
- [ ] ADR flags raised for every genuinely open architectural choice; defaults stated.
- [ ] Binding standards stated as actual conventions (error format, API, auth/authz, validation, naming) — not pointers.
- [ ] NFR targets quantified (measurable values), not gestured.
- [ ] Testing standard states which levels apply and what each must cover.
- [ ] Migration / rollback noted for every entity that changes existing data.
- [ ] Personalization gate recorded in `personalization-gate.md`.
- [ ] `blueprint-progress.md` shows Architecture = `locked`; `next-steps-handoff.md` points to Phases.
