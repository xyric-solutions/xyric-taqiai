---
id: S06-11
epic: EPIC-06
title: Link Documents to Matter
status: Done
priority: P1
updated: 2026-06-19
---

> **Built & live (2026-06-19):** Documents are linked to a matter via the `documentIds` JSON field on the `Matter` model; linked drafts are visible from the Matter detail view at `/chamber`.

# S06-11 — Link Documents to Matter

## User Story

As a lawyer, I want to link documents I generated (from EPIC-01) to a matter so that all drafts for a case are in one place.

## Acceptance Criteria

- [ ] Documents from Drafting Engine (EPIC-01) can be linked to a matter
- [ ] Linked documents visible from Matter detail view
- [ ] Link/unlink operation available from both document view and matter view
- [ ] `Document` entity has optional `matterId` foreign key

## Technical Notes

- Cross-epic integration: EPIC-01 (Document) ↔ EPIC-06 (Matter)
- As built: the link is stored on the `Matter` side as a `documentIds` JSON array (rather than a `matterId` FK on `Document`)
- Requires EPIC-01 documents and the EPIC-06 `Matter` entity both in place

## Definition of Done

- [ ] Document linkable to a matter from document view
- [ ] Linked documents visible in matter detail
- [ ] Requires EPIC-01 Document entity complete
- [ ] Abdullah sign-off
