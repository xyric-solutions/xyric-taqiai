# EPIC-08 — Lawyer Diary: Stories Index

> **Status:** Done — built & live (as of 2026-06-19).
> **Epic Goal:** Give every lawyer a quick-view daily case register (roznamcha) — all active cases in one table showing last date, stage, proceeding, and next hearing date at a glance.
> **Total Stories:** 7 | **Priority Breakdown:** P0: 5 | P1: 2
>
> **Built reality:** Shipped at route `/lawyer-diary`. Built on the Prisma `DiaryEntry` model with APIs `/api/diary` and `/api/diary/{id}`. Entry fields: case number, last date, next date, title, court name, proceeding stage, client phone. Color-coded stages (Arguments, Evidence, Bail Hearing, Judgment, Mention, Framing of Charges, Final Arguments, Other). Sort by date, filter by stage, search by case number; create / edit / delete supported.

---

| Story ID | Title | Priority | Status |
|----------|-------|----------|--------|
| [S08-01](./S08-01-diary-table-view.md) | Diary Table View — All Active Cases | P0 | Done |
| [S08-02](./S08-02-add-diary-entry.md) | Add New Case to Diary | P0 | Done |
| [S08-03](./S08-03-update-entry-after-hearing.md) | Update Case Entry After Hearing | P0 | Done |
| [S08-04](./S08-04-todays-hearings-highlight.md) | Today's Hearings Highlight | P0 | Done |
| [S08-05](./S08-05-sort-and-filter-diary.md) | Sort by Next Date & Filter by Court | P0 | Done |
| [S08-06](./S08-06-print-export-diary.md) | Print / Export Diary as PDF | P1 | Done |
| [S08-07](./S08-07-delete-close-case.md) | Delete / Close Case from Diary | P1 | Done |

---

**PRD Reference:** [Product-Requirements-Document.md — Section 6.9](../Product-Requirements-Document.md#69-module-8--lawyer-diary)
