---
id: S05-09
epic: EPIC-05
title: Link Judgment Analysis to Matter
status: Done
priority: P1
updated: 2026-06-19
---

# S05-09 — Link Judgment Analysis to Matter

## User Story

As a lawyer, I want to attach judgment analysis to a matter in my chamber so that all research for a case is in one place.

## Acceptance Criteria

- [ ] Judgment analysis can be linked to a Matter (EPIC-06)
- [ ] Linked analysis accessible from Matter detail view
- [ ] `JudgmentAnalysis` entity has optional `matterId` foreign key
- [ ] Link/unlink operation available from both judgment view and matter view

## Technical Notes

- Requires EPIC-06 `Matter` entity
- `JudgmentAnalysis` entity gets optional `matterId` foreign key (noted in EPIC-05 Technical Notes)
- This is the cross-epic integration between Judgment Intelligence and Chamber Management

## Definition of Done

- [ ] Judgment analysis linkable to a matter
- [ ] Linked analyses visible in matter detail
- [ ] Requires EPIC-06 Matter entity complete
- [ ] Abdullah sign-off
