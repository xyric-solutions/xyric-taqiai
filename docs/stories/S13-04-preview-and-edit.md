---
id: S13-04
epic: EPIC-13
title: Preview & Inline Edit
status: Done
priority: P0
---

# S13-04 — Preview & Inline Edit

## User Story

As a lawyer, I want to preview and inline-edit a document so that I can review and adjust it without leaving the vault.

## Acceptance Criteria

- [x] A document can be opened and previewed
- [x] Document detail available at `/documents/{id}`
- [x] Document can be inline-edited
- [x] Edits are saved via `PUT /api/documents/{id}`

## Technical Notes

- Document detail page: `/documents/{id}`
- APIs: `GET /api/documents/{id}` (preview), `PUT /api/documents/{id}` (save edit)
- Persistence: Prisma `Document` model with local document-store fallback

## Definition of Done

- [x] Preview renders document content
- [x] Inline edit working and saving
- [x] Saved edits persist and reload correctly
- [x] Abdullah sign-off
