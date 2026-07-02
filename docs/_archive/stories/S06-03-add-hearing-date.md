---
id: S06-03
epic: EPIC-06
title: Add Hearing Date to Matter
status: Done
priority: P0
updated: 2026-06-19
---

> **Built & live (2026-06-19):** Hearings are tracked on the Prisma `MatterHearing` model (fields: date, purpose, result, nextDate), linked to `Matter` via `matterId` — there is no separate `HearingDate` entity. Added from the Matter detail view at `/chamber`.

# S06-03 — Add Hearing Date to Matter

## User Story

As a lawyer, I want to add a hearing date to any matter so that I track when I need to appear in court.

## Acceptance Criteria

- [ ] Hearing date entry requires: date, time, court, hearing type (arguments / evidence / bail / mention / judgment date / other)
- [ ] Hearing date linked to correct matter
- [ ] Hearing entry time < 30 seconds (UX target)
- [ ] Conflict detection triggers if overlapping hearing exists (see S06-07)

## Technical Notes

- DB entity (as built): `MatterHearing` model — linked to `Matter` via `matterId`
- All conflict detection runs server-side
- Dashboard: hearing date entry from Matter detail view

## Definition of Done

- [ ] Hearing date form working with all required fields
- [ ] Hearing correctly linked to matter
- [ ] Conflict detection triggers on overlap
- [ ] Entry time < 30 seconds confirmed in UX test
- [ ] Abdullah sign-off
