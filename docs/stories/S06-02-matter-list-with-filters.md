---
id: S06-02
epic: EPIC-06
title: Matter List with Filters
status: Done
priority: P0
updated: 2026-06-19
---

> **Built & live (2026-06-19):** The matter list is the "All cases" tab under `/chamber` ("Case Management"). The earlier standalone "cases" / `LegalCase` manager has been retired and redirected here — chamber and case management are now one unified module on the `Matter` model. Archive is a boolean on `Matter` (see S06-12).

# S06-02 — Matter List with Filters

## User Story

As a lawyer, I want to see all my active cases in a list with quick filters (court, case type, status) so that I navigate my portfolio easily.

## Acceptance Criteria

- [ ] Matter list shows all active cases with filters: court, case type, status (Active / Adjourned / Decided / Archived)
- [ ] Archived matters removed from active list but searchable
- [ ] List loads with relevant matter info visible at a glance (title, court, case type, next hearing)
- [ ] All data per-user only

## Technical Notes

- `Matter` entity with status field: Active / Adjourned / Decided / Archived
- Filters applied server-side for performance
- Dashboard page: `src/app/(dashboard)/chamber/matters/`

## Definition of Done

- [ ] Matter list renders with all active cases
- [ ] Court, case type, status filters working
- [ ] Archived matters excluded from default view but findable via search
- [ ] Tested by Abdullah
- [ ] Abdullah sign-off
