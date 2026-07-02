---
id: S08-03
epic: EPIC-08
title: Update Case Entry After Hearing
status: Done
priority: P0
updated: 2026-06-19
---

> **Built & live (2026-06-19):** Edit via `/api/diary/{id}` on the `DiaryEntry` model; updates reflected in the table at `/lawyer-diary`.

# S08-03 — Update Case Entry After Hearing

## User Story

As a lawyer, I want to quickly update a case entry after returning from court so that my diary reflects what happened today and what the next date is.

## Acceptance Criteria

- [ ] Each diary row has an Edit button (or inline click-to-edit)
- [ ] Lawyer can update any of the 7 fields
- [ ] Most common post-hearing updates work fast: Last Date → today, Proceeding → what happened, Stage → new stage if changed, Next Date → new adjournment date
- [ ] Updated entry saved immediately and visible in table
- [ ] No full page reload required — inline or modal edit
- [ ] Edit completes in under 30 seconds for a typical post-hearing update

## Technical Notes

- PATCH to `/api/diary/:id` — updates only changed fields
- `updated_at` timestamp refreshed on every edit
- Previous values are overwritten — no version history in v1 (diary is a live register, not audit log)
- Inline edit preferred over full form re-open for speed

## Definition of Done

- [ ] Edit works for all 7 fields
- [ ] Post-hearing update (Last Date + Proceeding + Next Date) completes in < 30 seconds
- [ ] Changes reflected in table immediately without page reload
- [ ] Abdullah sign-off — tested with real court return scenario
