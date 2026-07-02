---
id: S04-07
epic: EPIC-04
title: Save AI Response as Case Note
status: Done
priority: P2
updated: 2026-06-19
---

# S04-07 — Save AI Response as Case Note

## User Story

As a lawyer, I want to save a useful AI response as a note linked to a specific case or draft so that I can reference it during drafting.

## Acceptance Criteria

- [ ] "Save as Note" button on each AI response (after approval)
- [ ] Saved note can be linked to a specific Matter (EPIC-06)
- [ ] Saved note accessible from Matter detail view
- [ ] Notes saved in Prisma `CaseNote` model (from EPIC-06)

## Technical Notes

- Depends on EPIC-06 `CaseNote` entity being available
- Only approved responses can be saved as notes — not unreviewed AI output
- Database: Prisma `CaseNote` model

## Definition of Done

- [ ] "Save as Note" button appears on approved responses
- [ ] Note saved and linked to selected matter
- [ ] Note retrievable from Matter detail
- [ ] Requires EPIC-06 Matter entity in place
- [ ] Abdullah sign-off
