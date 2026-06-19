---
id: S06-05
epic: EPIC-06
title: Weekly / Monthly Calendar View
status: Done
priority: P0
updated: 2026-06-19
---

> **Built & live (2026-06-19):** Ships as the "Calendar" tab under `/chamber` ("Case Management").

# S06-05 — Weekly / Monthly Calendar View

## User Story

As a lawyer, I want a weekly/monthly calendar view of all my hearings across all cases so that I plan my schedule.

## Acceptance Criteria

- [ ] Weekly and monthly calendar views render correctly
- [ ] All hearings color-coded by case type
- [ ] Calendar usable on mobile screen (375px+)
- [ ] Clicking a hearing opens the matter detail

## Technical Notes

- Calendar UI: react-big-calendar or similar React calendar component
- Color coding by case type: Criminal (red), Civil (blue), Family (green), etc.
- All hearing data fetched per-user from Prisma

## Definition of Done

- [ ] Weekly and monthly views working
- [ ] Color coding by case type visible
- [ ] Calendar usable on mobile
- [ ] Clicking hearing navigates to matter detail
- [ ] Abdullah sign-off
