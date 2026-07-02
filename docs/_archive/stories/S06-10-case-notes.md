---
id: S06-10
epic: EPIC-06
title: Private Case Notes per Matter
status: Done
priority: P1
updated: 2026-06-19
---

> **Built & live (2026-06-19):** Case notes are stored in the `notes` field on the `Matter` model (per-user, per-matter), edited from the Matter detail view at `/chamber` — there is no separate `CaseNote` table.

# S06-10 — Private Case Notes per Matter

## User Story

As a lawyer, I want to add private notes to any case so that I record client instructions and court observations.

## Acceptance Criteria

- [ ] Case notes can be added and edited per matter
- [ ] Notes are private — per-lawyer, per-matter
- [ ] Notes support free-text entry
- [ ] Notes visible from Matter detail view

## Technical Notes

- As built: notes stored in the `notes` field on the `Matter` model (no separate `CaseNote` entity)
- Notes are per-user (same `userId` scoping as all chamber data)
- S04-07 (Save AI Response as Note) links to this entity

## Definition of Done

- [ ] Case notes add/edit working
- [ ] Notes visible in matter detail
- [ ] Per-user isolation confirmed
- [ ] Abdullah sign-off
