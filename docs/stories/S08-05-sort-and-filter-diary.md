---
id: S08-05
epic: EPIC-08
title: Sort by Next Date & Filter by Court
status: Done
priority: P0
updated: 2026-06-19
---

> **Built & live (2026-06-19):** At `/lawyer-diary`, the diary supports sort by date, filter by proceeding stage, and search by case number. (The shipped filter is by stage / case-number search rather than by court name as originally framed.)

# S08-05 — Sort by Next Date & Filter by Court

## User Story

As a lawyer, I want to sort my diary by next hearing date and filter by court name so that I can quickly see what is coming up in a specific court.

## Acceptance Criteria

- [ ] Table sorted by Next Date ascending by default (soonest at top)
- [ ] Lawyer can click Next Date column header to toggle sort: ascending / descending
- [ ] Court Name filter dropdown — populated from unique court names in the lawyer's own diary entries
- [ ] Selecting a court shows only cases in that court; clearing filter shows all cases
- [ ] Sort and filter can be combined (e.g., filter by Lahore High Court + sort by Next Date)
- [ ] Filter state persists within the session (does not reset on page refresh in v1)

## Technical Notes

- Sort: client-side sort on `next_date` field
- Filter: client-side filter on `court_name` — dropdown options built dynamically from diary data
- No backend query changes needed for v1 (diary size per lawyer is small — client-side is sufficient)

## Definition of Done

- [ ] Default sort by Next Date ascending works
- [ ] Column header click toggles sort direction
- [ ] Court filter dropdown populated from lawyer's own court names
- [ ] Filter + sort combination works correctly
- [ ] Abdullah sign-off
