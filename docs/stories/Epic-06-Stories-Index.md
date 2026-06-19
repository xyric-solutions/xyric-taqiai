# EPIC-06 — Chamber / Case Management: Stories Index

> **Status:** Done — built & live (as of 2026-06-19).
> **Epic Goal:** Give every lawyer a structured digital register for their chamber — manage cases, track hearings, and never miss a filing deadline.
> **Total Stories:** 12 | **Priority Breakdown:** P0: 9 | P1: 3
>
> **Built reality:** Shipped at route `/chamber` (labelled "Case Management" in the UI). Built on the Prisma `Matter` + `MatterHearing` models. Tabs: Today / All cases / Calendar / Deadlines. The earlier standalone "cases" / `LegalCase` manager has been retired and redirected into `/chamber` (Matter), so chamber and case management are now one unified module.

---

| Story ID | Title | Priority | Status |
|----------|-------|----------|--------|
| [S06-01](./S06-01-create-matter.md) | Create New Matter (Case) | P0 | Done |
| [S06-02](./S06-02-matter-list-with-filters.md) | Matter List with Filters | P0 | Done |
| [S06-03](./S06-03-add-hearing-date.md) | Add Hearing Date to Matter | P0 | Done |
| [S06-04](./S06-04-todays-list.md) | Today's List — All Today's Hearings | P0 | Done |
| [S06-05](./S06-05-calendar-view.md) | Weekly / Monthly Calendar View | P0 | Done |
| [S06-06](./S06-06-adjournment-tracking.md) | Adjournment Tracking | P0 | Done |
| [S06-07](./S06-07-conflict-detection.md) | Hearing Conflict Detection | P1 | Done |
| [S06-08](./S06-08-filing-deadlines.md) | Filing Deadlines & Limitation Dates | P0 | Done |
| [S06-09](./S06-09-deadlines-dashboard.md) | Deadlines Dashboard (All Cases) | P0 | Done |
| [S06-10](./S06-10-case-notes.md) | Private Case Notes per Matter | P1 | Done |
| [S06-11](./S06-11-link-documents-to-matter.md) | Link Documents to Matter | P1 | Done |
| [S06-12](./S06-12-archive-case.md) | Archive a Decided / Closed Case | P0 | Done |

---

**Epic PRD:** [EPIC-06-chamber-management.md](../epics/EPIC-06-chamber-management.md)
