---
id: S13-05
epic: EPIC-13
title: Delete with Confirmation
status: Done
priority: P1
---

# S13-05 — Delete with Confirmation

## User Story

As a lawyer, I want to delete a document with a confirmation step so that I can remove drafts I no longer need without accidental loss.

## Acceptance Criteria

- [x] A document can be deleted
- [x] Deletion requires an explicit confirmation step
- [x] Confirmed deletion removes the document via `DELETE /api/documents/{id}`
- [x] Deleted document no longer appears in the list

## Technical Notes

- API: `DELETE /api/documents/{id}`
- Confirmation dialog before delete to prevent accidental loss
- Persistence: Prisma `Document` model with local document-store fallback

## Definition of Done

- [x] Delete with confirmation working
- [x] Cancelling confirmation does not delete
- [x] Document removed from list after deletion
- [x] Abdullah sign-off
