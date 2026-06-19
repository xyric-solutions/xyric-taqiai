# EPIC-08 — Lawyer Diary (Roznamcha)

---

## Epic Metadata

| Field | Detail |
|-------|--------|
| Epic ID | EPIC-08 |
| Owner | Abdullah |
| Author | Hamza |
| Status | Built — Live |
| Priority | 6 — High |
| Estimated Effort | 1–2 Sprints |
| Depends On | Auth System |
| Can Run In Parallel With | EPIC-06 |
| Route | `/lawyer-diary` |
| Last Updated | 2026-06-19 |

---

## Goal

Give every lawyer a fast, single-screen daily court register (roznamcha) — a log of every hearing and proceeding showing case number, last date, next date, court, and proceeding stage at a glance, replacing the physical diary that lawyers carry to court.

---

## Background

The roznamcha (daily diary) is the most-used artifact in Pakistani legal practice. Every advocate keeps a handwritten register listing each case's last hearing date, the stage it reached, what happened, and the next date fixed. This Epic digitizes that register: a lawyer adds a diary entry per case, records the proceeding stage, and the system keeps a sortable, filterable, searchable list. It is intentionally lighter and faster than full Chamber Management (EPIC-06) — the diary is the daily quick-view a lawyer scans on their phone in the courtroom corridor, where speed and clarity matter more than depth.

---

## Sub-Modules

| ID | Sub-Module | Description |
|----|-----------|-------------|
| A | Diary Entry Log | Create, edit, and delete daily case/hearing entries |
| B | Stage Tracking | Color-coded proceeding stage per entry (Arguments, Evidence, Bail, etc.) |
| C | Sort / Filter / Search | Sort by date, filter by stage, search by case number |

---

## Proceeding Stages (Color-Coded)

When creating or editing a diary entry, the lawyer selects a proceeding stage. Each stage is color-coded for instant visual scanning of the diary:

| Stage | Use |
|-------|-----|
| **Arguments** | Matter listed for arguments |
| **Evidence** | Recording of evidence / witnesses |
| **Bail Hearing** | Bail application hearing |
| **Judgment** | Listed for judgment / order |
| **Mention** | Mentioning before the court |
| **Framing of Charges** | Charge framing stage |
| **Final Arguments** | Final arguments stage |
| **Other** | Free / unlisted stage |

---

## User Stories

| ID | User Story | Priority | Story File |
|----|-----------|---------|-----------|
| US-08-01 | As a lawyer, I want to see all my active cases in one table showing last date, stage, proceeding, and next date so that I check every case at a glance | Must Have | [S08-01](../stories/S08-01-diary-table-view.md) |
| US-08-02 | As a lawyer, I want to add a new case to the diary with all hearing details so that it appears in my daily register | Must Have | [S08-02](../stories/S08-02-add-diary-entry.md) |
| US-08-03 | As a lawyer, I want to update a case entry after a hearing so that the last date, stage, and next date stay current | Must Have | [S08-03](../stories/S08-03-update-entry-after-hearing.md) |
| US-08-04 | As a lawyer, I want today's hearings highlighted so that I instantly see which cases are listed today | Must Have | [S08-04](../stories/S08-04-todays-hearings-highlight.md) |
| US-08-05 | As a lawyer, I want to sort by next date and filter by court/stage so that I organize my diary | Must Have | [S08-05](../stories/S08-05-sort-and-filter-diary.md) |
| US-08-06 | As a lawyer, I want to print / export the diary as PDF so that I can carry a copy to court | Should Have | [S08-06](../stories/S08-06-print-export-diary.md) |
| US-08-07 | As a lawyer, I want to delete or close a case from the diary so that decided cases leave my active list | Should Have | [S08-07](../stories/S08-07-delete-close-case.md) |

---

## Acceptance Criteria

| # | Criteria | Status |
|---|----------|--------|
| AC-01 | Diary entry form collects: case number, last date, next date, title, court name, proceeding stage, client phone | [x] |
| AC-02 | Proceeding stage is one of: Arguments, Evidence, Bail Hearing, Judgment, Mention, Framing of Charges, Final Arguments, Other | [x] |
| AC-03 | Each stage is color-coded in the diary list for fast visual scanning | [x] |
| AC-04 | Diary list can be sorted by date (next date ascending by default) | [x] |
| AC-05 | Diary list can be filtered by stage | [x] |
| AC-06 | Diary list can be searched by case number | [x] |
| AC-07 | Entries can be created, edited, and deleted | [x] |
| AC-08 | Today's hearings are highlighted in the list | [x] |
| AC-09 | Data persisted via Prisma `DiaryEntry` model | [x] |
| AC-10 | APIs implemented: `GET`/`POST` `/api/diary` and `GET`/`PUT`/`DELETE` `/api/diary/{id}` | [x] |
| AC-11 | All diary data is per-user — lawyer sees only their own entries | [x] |
| AC-12 | Diary is usable on mobile screen (375px+) | [x] |

---

## Success Metrics

| Metric | Target | How to Measure |
|--------|--------|---------------|
| Diary entry creation time | < 1 minute | UX timing in beta testing |
| Diary load time | < 2 seconds | Performance logs |
| Today's hearings visible without scroll | Yes | Manual review |
| Mobile usability | Abdullah confirms usable on phone | Manual review |
| Daily active use (lawyers checking diary) | Track in analytics | Dashboard analytics |

---

## Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Lawyers don't trust digital diary over physical roznamcha | Medium | Medium | Make it faster to scan than a handwritten register; color-code stages |
| Overlap/confusion with Chamber Management (EPIC-06) | Medium | Medium | Position diary as the lightweight daily quick-view; chamber is the full case record |
| Data entry feels like extra work | Medium | Medium | One-screen form; update-after-hearing flow keeps last/next dates current quickly |
| Data loss if user clears app cache | Low | High | All data persisted in Prisma database, not browser cache |

---

## Technical Notes

| Component | Detail |
|-----------|--------|
| DB Entity | Prisma `DiaryEntry` model — case number, last date, next date, title, court name, stage, client phone, user scope, timestamps |
| Route / Page | `/lawyer-diary` — `src/app/(dashboard)/lawyer-diary/` |
| APIs | `GET`/`POST` `/api/diary`; `GET`/`PUT`/`DELETE` `/api/diary/{id}` |
| Stage field | Enum: Arguments / Evidence / Bail Hearing / Judgment / Mention / Framing of Charges / Final Arguments / Other |
| Per-user isolation | All queries scoped to `userId` — consistent with PRD Q9 decision |
| Sort / filter / search | Sort by date; filter by stage; search by case number |
| Mobile optimization | Diary list must render cleanly on 375px viewport |

---

## Definition of Done

| # | Condition |
|---|-----------|
| 1 | All User Stories (US-08-01 to US-08-07) implemented and merged |
| 2 | All Acceptance Criteria (AC-01 to AC-12) verified and checked off |
| 3 | Diary entry form collects all fields and saves correctly |
| 4 | Sort by date, filter by stage, and search by case number all working |
| 5 | Color-coded stages render correctly |
| 6 | Diary tested by Abdullah on a real mobile phone |
| 7 | Deployed to production (live) with no critical bugs |
| 8 | Abdullah has reviewed and signed off |

---

## Out of Scope

| Feature | Reason |
|---------|--------|
| Full case portfolio with parties, role, deadlines | Covered by Chamber Management (EPIC-06) |
| Calendar / week-month view | Covered by Chamber Management (EPIC-06) |
| Automated hearing reminders via SMS/WhatsApp | v1.5 |
| Firm-wide diary visibility across lawyers | v1.5 — firm admin feature |

---

## Dependencies

| Dependency | Why Needed |
|-----------|-----------|
| Auth System | All diary data scoped per logged-in lawyer |
| Prisma schema | `DiaryEntry` model |
| Abdullah UX validation | Diary layout must match real roznamcha practice |

---

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-06-19 | Hamza | Initial epic documented from built feature |
