---
id: S08-07
epic: EPIC-08
title: Delete / Close Case from Diary
status: Done
priority: P1
updated: 2026-06-19
---

> **Built & live (2026-06-19):** Delete via `DELETE /api/diary/{id}` (hard delete on `DiaryEntry`); the row is removed from the diary table at `/lawyer-diary`.

# S08-07 — Delete / Close Case from Diary

## User Story

As a lawyer, I want to remove a case from my diary when it is decided or no longer active so that my diary only shows live, ongoing cases.

## Acceptance Criteria

- [ ] Each diary row has a Delete / Close button
- [ ] Confirmation prompt before deletion: "Remove this case from diary? This cannot be undone."
- [ ] On confirm: row removed from diary table immediately
- [ ] Deleted entries are permanently removed (diary is a live register — no archive needed in v1)
- [ ] Accidental deletion recoverable only by re-adding manually (no undo in v1)

## Technical Notes

- DELETE to `/api/diary/:id` — hard delete from `DiaryEntry` table
- Soft delete or archive not required in v1 — diary is intentionally a simple live register
- Confirmation modal prevents accidental tap on mobile

## Definition of Done

- [ ] Delete button present on every row
- [ ] Confirmation prompt shown before deletion
- [ ] Row removed from table immediately on confirm
- [ ] Abdullah sign-off
