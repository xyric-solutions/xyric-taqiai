---
id: S13-01
epic: EPIC-13
title: Document List with Metadata
status: Done
priority: P0
---

# S13-01 — Document List with Metadata

## User Story

As a lawyer, I want a list of all my AI-generated documents showing title, category, subtype, language, and creation date/time so that I can find any document I made in one place.

## Acceptance Criteria

- [x] Document list shows every user document
- [x] Each row shows: title, category, subtype, language, creation date/time
- [x] All documents are per-user — lawyer sees only their own documents
- [x] Empty state shown when no documents exist yet
- [x] Page is usable on mobile screen (375px+)

## Technical Notes

- Route / page: `/documents`
- API: `GET /api/documents`
- DB entity: Prisma `Document` model with local document-store fallback
- All queries scoped to `userId` — per PRD Q9 isolation decision

## Definition of Done

- [x] List renders all documents with full metadata
- [x] Per-user isolation confirmed
- [x] Empty state shown
- [x] Mobile view readable
- [x] Abdullah sign-off
