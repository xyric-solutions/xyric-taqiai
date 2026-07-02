---
id: S06-08
epic: EPIC-06
title: Filing Deadlines & Limitation Dates
status: Done
priority: P0
updated: 2026-06-19
---

> **Built & live (2026-06-19):** Deadlines are surfaced via the "Deadlines" tab under `/chamber` ("Case Management"), driven from matter dates / next-hearing tracking rather than a standalone `Deadline` table.

# S06-08 — Filing Deadlines & Limitation Dates

## User Story

As a lawyer, I want to add filing deadlines and limitation dates to a case so that I never miss a critical date.

## Acceptance Criteria

- [ ] Deadline creation: date, type (filing / limitation / response / compliance), description, priority
- [ ] Deadline linked to correct matter
- [ ] All upcoming deadlines visible in Deadlines Dashboard (see S06-09)
- [ ] Overdue deadlines highlighted in red

## Technical Notes

- New DB entity: `Deadline` model — linked to `Matter` via `matterId`
- Deadline types: filing, limitation, response, compliance
- Limitation period calculator = bonus feature in v1.5

## Definition of Done

- [ ] Deadline creation form working with all required fields
- [ ] Deadlines linked to correct matter
- [ ] Overdue deadlines highlighted red
- [ ] Abdullah sign-off
