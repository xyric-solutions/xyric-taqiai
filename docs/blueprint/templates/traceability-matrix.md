<!-- TEMPLATE — How to use:
  The end-to-end traceability chain (BLUEPRINT.md Part C4). One row per leaf, greppable. The validation
  rule is NO ORPHANS: every requirement has a parent capability, every component a parent requirement,
  every segment a parent phase and the requirements it satisfies. An orphan row is a finding, not a
  detail — it is what guarantees the build can't drift from the intent. Fill a COPY. Delete this comment. -->

# <PRODUCT_NAME> — Traceability Matrix

- Last updated: <YYYY-MM-DD>
- Chain: `vision-capability → prd-requirement → architecture-component → phase → segment → forgeflow-batch`

## Forward chain (one row per segment)
| Capability | Requirement | Component(s) | Phase | Segment | Batch (= Segment ID) |
|------------|-------------|--------------|-------|---------|----------------------|
| CAP-1 | R1.1 | C1 | Phase 1 | S1.1 | S1.1 |
| CAP-1 | R1.2 | C1, C2 | Phase 1 | S1.2 | S1.2 |
| CAP-2 | R2.1 | C2 | Phase 2 | S2.1 | S2.1 |

## Orphan check (all must be empty)
| Check | Orphans found |
|-------|---------------|
| Requirements with no parent capability | <none> |
| Components with no parent requirement | <none> |
| Phases with no component | <none> |
| Segments with no phase | <none> |
| Segments with no requirement satisfied | <none> |
| Capabilities with no requirement (uncovered intent) | <none> |

## Coverage roll-up
| Level | Count | Covered | Gap |
|-------|-------|---------|-----|
| Capabilities | <n> | <n> | <0> |
| Requirements | <n> | <n> | <0> |
| Components | <n> | <n> | <0> |
| Segments | <n> | <n> | <0> |
