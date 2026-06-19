---
id: S06-04
epic: EPIC-06
title: Today's List — All Today's Hearings
status: Done
priority: P0
updated: 2026-06-19
---

> **Built & live (2026-06-19):** Ships as the "Today" tab under `/chamber` ("Case Management"), with next-hearing alerts surfaced on the dashboard.

# S06-04 — Today's List — All Today's Hearings

## User Story

As a lawyer, I want to see "Today's List" — all my hearings for today sorted by time — so that I know exactly where to be and when.

## Acceptance Criteria

- [ ] Today's List shows all hearings for current date sorted chronologically
- [ ] Each entry shows: matter name, court, hearing type, time
- [ ] Today's List load time < 2 seconds
- [ ] Fully usable on mobile screen (375px+)

## Technical Notes

- This is the #1 daily-use feature — optimize heavily for speed and mobile
- Mobile optimization: 375px viewport — test on actual phones
- In-app alerts: 1 day before and 1 hour before hearings (push notifications in v1.5)
- Dashboard: prominent "Today's List" view at `src/app/(dashboard)/chamber/today/`

## Definition of Done

- [ ] Today's List shows all today's hearings sorted by time
- [ ] Load time < 2 seconds
- [ ] Mobile usability confirmed by Abdullah on real phone
- [ ] Abdullah sign-off
