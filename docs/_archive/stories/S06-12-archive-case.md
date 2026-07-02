---
id: S06-12
epic: EPIC-06
title: Archive a Decided / Closed Case
status: Done
priority: P0
updated: 2026-06-19
---

> **Built & live (2026-06-19):** Archiving is driven by the `archived` boolean (alongside the `status` field) on the `Matter` model; archived matters drop out of the active list at `/chamber` but remain searchable. No hard delete.

# S06-12 — Archive a Decided / Closed Case

## User Story

As a lawyer, I want to archive a decided/closed case so that it leaves my active queue but stays searchable.

## Acceptance Criteria

- [ ] Archive action available on any matter (from matter detail or matter list)
- [ ] Archived matter removed from active list immediately
- [ ] Archived matter still searchable (via search or archived filter)
- [ ] Archive is reversible — lawyer can unarchive if needed

## Technical Notes

- `Matter` status field: Active / Adjourned / Decided / Archived
- Archived filter available in matter list (see S06-02)
- No hard delete — data always preserved

## Definition of Done

- [ ] Archive action working from matter detail
- [ ] Archived matters hidden from default active list
- [ ] Archived matters findable via search/filter
- [ ] Unarchive working
- [ ] Abdullah sign-off
