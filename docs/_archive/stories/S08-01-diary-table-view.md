---
id: S08-01
epic: EPIC-08
title: Diary Table View — All Active Cases
status: Done
priority: P0
updated: 2026-06-19
---

> **Built & live (2026-06-19):** Ships at `/lawyer-diary` on the Prisma `DiaryEntry` model, served via `/api/diary`. Color-coded by proceeding stage.

# S08-01 — Diary Table View — All Active Cases

## User Story

As a lawyer, I want to see all my active cases in one table so that I can check every case's status, last hearing, and next date at a single glance without opening individual case records.

## Acceptance Criteria

- [ ] Diary page shows a table with exactly these columns: Case Number | Last Date | Title | Court Name | Stage | Proceeding | Next Date
- [ ] Every active case the lawyer has added appears as one row
- [ ] Table is sorted by Next Date ascending by default (soonest hearing at top)
- [ ] Empty state shown when no cases added yet — with "Add First Case" prompt
- [ ] Table is readable on mobile screen (lawyer checks in court on phone)
- [ ] All data is per-lawyer — lawyer sees only their own diary entries

## Technical Notes

- New DB entity: `DiaryEntry` — fields: id, case_number, last_date, title, court_name, stage, proceeding, next_date, user_id, created_at, updated_at
- New page: `src/app/(dashboard)/lawyer-diary/`
- All queries scoped to `userId` — per PRD Q9 isolation decision
- Stage field: enum type — Arguments | Evidence | Bail Hearing | Judgment | Mention | Framing of Charges | Final Arguments | Other

## Definition of Done

- [ ] Diary table renders with all 7 columns
- [ ] Shows all lawyer's active cases correctly
- [ ] Default sort by Next Date ascending works
- [ ] Mobile view is readable without horizontal scroll
- [ ] Empty state shown with call-to-action
- [ ] Abdullah sign-off
