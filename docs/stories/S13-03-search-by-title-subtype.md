---
id: S13-03
epic: EPIC-13
title: Search by Title / Subtype
status: Done
priority: P0
---

# S13-03 — Search by Title / Subtype

## User Story

As a lawyer, I want to search my documents by title or subtype so that I can find a specific document fast.

## Acceptance Criteria

- [x] Documents can be searched by title
- [x] Documents can be searched by subtype
- [x] Results update as the lawyer searches
- [x] Empty-result state shown when nothing matches

## Technical Notes

- Search across the `title` and `subtype` fields of the `Document` model
- Applied to the `/documents` list

## Definition of Done

- [x] Search by title working
- [x] Search by subtype working
- [x] Empty-result state handled
- [x] Abdullah sign-off
