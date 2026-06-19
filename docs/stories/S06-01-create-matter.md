---
id: S06-01
epic: EPIC-06
title: Create New Matter (Case)
status: Done
priority: P0
updated: 2026-06-19
---

> **Built & live (2026-06-19):** Create Matter form ships at `/chamber` ("Case Management"). Backed by the Prisma `Matter` model (fields incl. title, caseNo, court, caseType, role, clientName, clientCnic, clientPhone, opponentName, judgeName, dateFiled, status), all scoped to `userId`.

# S06-01 — Create New Matter (Case)

## User Story

As a lawyer, I want to create a new matter (case) with all relevant details (title, case no., court, parties, case type, my role) so that I have a complete record.

## Acceptance Criteria

- [ ] Matter creation form collects: title, case no. (optional), court (dropdown — all Pakistani courts), case type, parties, lawyer role, judge name (optional), date filed, status
- [ ] Court dropdown includes all categories: Apex/Constitutional, High Courts (5), District Courts, Special Courts, Tribunals, free-text fallback
- [ ] All chamber data is per-user — lawyer sees only their own matters
- [ ] Matter creation time < 2 minutes (UX target)

## Technical Notes

- New DB entity: `Matter` model — see PRD Section 15 for schema
- All queries scoped to `userId` — consistent with PRD Q9 decision
- Court dropdown: 20+ courts grouped by tier (Supreme / High Courts / District / Special)
- Dashboard pages: new page at `src/app/(dashboard)/chamber/`

## Definition of Done

- [ ] Matter creation form working with all required fields
- [ ] Court dropdown has all 20+ Pakistani courts grouped correctly
- [ ] Per-user isolation confirmed — lawyers cannot see each other's matters
- [ ] Tested by Abdullah with real case scenario
- [ ] Abdullah sign-off
