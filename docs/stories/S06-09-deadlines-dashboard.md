---
id: S06-09
epic: EPIC-06
title: Deadlines Dashboard (All Cases)
status: Done
priority: P0
updated: 2026-06-19
---

> **Built & live (2026-06-19):** Ships as the "Deadlines" tab under `/chamber` ("Case Management"), aggregating upcoming dates across all of the lawyer's matters.

# S06-09 — Deadlines Dashboard (All Cases)

## User Story

As a lawyer, I want to see all upcoming deadlines across all cases in one view, sorted by urgency, so that I prioritize my work.

## Acceptance Criteria

- [ ] Deadlines dashboard shows all upcoming deadlines across all matters
- [ ] Sorted by date — most urgent first
- [ ] Overdue deadlines highlighted in red at the top
- [ ] Each deadline shows: matter name, deadline type, date, description

## Technical Notes

- `Deadline` entity queried across all matters for logged-in lawyer
- Sort: overdue first (red), then upcoming by date ascending
- Dashboard page: `src/app/(dashboard)/chamber/deadlines/`

## Definition of Done

- [ ] Deadlines dashboard shows all deadlines across all matters
- [ ] Sorted correctly: overdue first, then upcoming by date
- [ ] Overdue deadlines visually distinct (red)
- [ ] Abdullah sign-off
