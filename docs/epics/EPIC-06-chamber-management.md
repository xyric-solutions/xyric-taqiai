# EPIC-06 — Chamber Management

---

## Epic Metadata

| Field | Detail |
|-------|--------|
| Epic ID | EPIC-06 |
| Owner | Abdullah |
| Author | Hamza |
| Status | Built — Live |
| Priority | 6 — High |
| Estimated Effort | 2–3 Sprints |
| Depends On | Auth System |
| Can Run In Parallel With | EPIC-05 |
| Last Updated | 2026-06-19 |

---

## Goal

Give every lawyer a structured digital register for their chamber — manage all active cases, track hearing dates across all Pakistani courts, see today's court list at a glance, and never miss a filing deadline.

---

## Background

Pakistani lawyers currently manage their case portfolios through physical diaries, WhatsApp reminders, or memory. There is no digital chamber management tool built for Pakistani legal practice. A lawyer with 30–50 active cases across multiple courts (District Court, High Court, ATC, Family Court) needs a reliable daily view of hearings, an adjournment history per case, and deadline tracking. This Epic delivers that system — per-lawyer, private, and mobile-optimized since lawyers check schedules on their phones while at court.

> **Built status:** Chamber Management is **built and live at `/chamber`**, surfaced in the product as "Case Management". It supports Matters with full metadata, hearing tracking (Prisma `Matter` / `MatterHearing`), tabs for Today / All cases / Calendar / Deadlines, client and opponent details including phone and CNIC, next-hearing alerts, document linking, case notes, and archive. The earlier separate "cases" manager has been **retired and redirected into `/chamber`** — there is now a single case manager.

---

## Sub-Modules

| ID | Sub-Module | Description |
|----|-----------|-------------|
| A | Case Portfolio (Matter Register) | Create and manage all chamber cases with full metadata |
| B | Hearing Timetable & Calendar | Add hearing dates, today's list, week/month view, adjournment tracking |
| C | Deadlines & Reminders | Filing deadlines, limitation periods, overdue alerts |

---

## Court Dropdown (All Pakistani Courts)

When creating a matter or adding a hearing, lawyer selects from:

| Category | Courts |
|----------|--------|
| **Apex / Constitutional** | Supreme Court of Pakistan, Federal Shariat Court |
| **High Courts** | Lahore High Court, Sindh High Court (Karachi), Peshawar High Court, Balochistan High Court (Quetta), Islamabad High Court |
| **District Courts** | District & Sessions Court, Civil Court, Judicial Magistrate Court (+ district name field) |
| **Special Courts** | Anti-Terrorism Court (ATC), Accountability Court (NAB), Banking Court, Labour Court, Family Court, Drug Court, Environmental Court, Commercial Court |
| **Tribunals** | Service Tribunal, Revenue Court / Board of Revenue, Income Tax Appellate Tribunal, Customs Appellate Tribunal |
| **Other** | Free-text entry for unlisted courts |

---

## User Stories

| ID | User Story | Priority |
|----|-----------|---------|
| US-06-01 | As a lawyer, I want to create a new matter (case) with all relevant details (title, case no., court, parties, case type, my role) so that I have a complete record | Must Have |
| US-06-02 | As a lawyer, I want to see all my active cases in a list with quick filters (court, case type, status) so that I navigate my portfolio easily | Must Have |
| US-06-03 | As a lawyer, I want to add a hearing date to any matter so that I track when I need to appear in court | Must Have |
| US-06-04 | As a lawyer, I want to see "Today's List" — all my hearings for today sorted by time — so that I know exactly where to be and when | Must Have |
| US-06-05 | As a lawyer, I want a weekly/monthly calendar view of all my hearings across all cases so that I plan my schedule | Must Have |
| US-06-06 | As a lawyer, I want to mark a hearing as adjourned and set the new date so that adjournment history is automatically maintained | Must Have |
| US-06-07 | As a lawyer, I want the system to warn me if I have two hearings at the same time in different courts so that I catch scheduling conflicts | Should Have |
| US-06-08 | As a lawyer, I want to add filing deadlines and limitation dates to a case so that I never miss a critical date | Must Have |
| US-06-09 | As a lawyer, I want to see all upcoming deadlines across all cases in one view, sorted by urgency, so that I prioritize my work | Must Have |
| US-06-10 | As a lawyer, I want to add private notes to any case so that I record client instructions and court observations | Should Have |
| US-06-11 | As a lawyer, I want to link documents I generated (from EPIC-01) to a matter so that all drafts for a case are in one place | Should Have |
| US-06-12 | As a lawyer, I want to archive a decided/closed case so that it leaves my active queue but stays searchable | Must Have |

---

## Acceptance Criteria

| # | Criteria | Status |
|---|----------|--------|
| AC-01 | Matter creation form collects: title, case no. (optional), court (dropdown — all Pakistani courts), case type, parties, lawyer role, judge name (optional), date filed, status | [ ] |
| AC-02 | Matter list shows all active cases with filters: court, case type, status (Active / Adjourned / Decided / Archived) | [ ] |
| AC-03 | Hearing date entry requires: date, time, court, hearing type (arguments / evidence / bail / mention / judgment date / other) | [ ] |
| AC-04 | Today's List shows all hearings for current date sorted chronologically with matter name, court, and hearing type | [ ] |
| AC-05 | Weekly and monthly calendar views render correctly with all hearings color-coded by case type | [ ] |
| AC-06 | Adjournment flow: mark hearing as adjourned → enter new date → old date moves to adjournment history | [ ] |
| AC-07 | Conflict detection: system warns if two hearings overlap in time | [ ] |
| AC-08 | Deadline creation: date, type (filing / limitation / response / compliance), description, priority | [ ] |
| AC-09 | Deadlines dashboard shows all upcoming deadlines sorted by date; overdue deadlines highlighted in red | [ ] |
| AC-10 | Case notes can be added and edited per matter | [ ] |
| AC-11 | Documents from Drafting Engine (EPIC-01) can be linked to a matter | [ ] |
| AC-12 | Judgment analysis from Judgment Library (EPIC-05) can be linked to a matter | [ ] |
| AC-13 | Archived matter removed from active list but searchable | [ ] |
| AC-14 | Today's List and timetable views are fully usable on mobile screen (375px+) | [ ] |
| AC-15 | All chamber data is per-user — lawyer sees only their own matters | [ ] |

---

## Success Metrics

| Metric | Target | How to Measure |
|--------|--------|---------------|
| Matter creation time | < 2 minutes | UX timing in beta testing |
| Today's List load time | < 2 seconds | Performance logs |
| Hearing date entry time | < 30 seconds | UX timing |
| Scheduling conflict detection accuracy | 100% | Test with known conflicting dates |
| Mobile usability score (Today's List) | Abdullah confirms usable on phone | Manual review |
| Daily active use (lawyers checking today's list) | Track in analytics | Dashboard analytics |

---

## Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Lawyers don't trust digital diary over physical | Medium | Medium | Make Today's List so fast and clean that it's faster than opening a physical diary |
| Adjournment data entry feels like extra work | Medium | Medium | One-tap adjournment flow: mark adjourned → new date → done in 10 seconds |
| Court dropdown has too many options | Low | Medium | Group by tier (Supreme / High Courts / District / Special); searchable dropdown |
| Data loss if user clears app cache | Low | High | All data persisted in Prisma database, not browser cache |
| Conflict detection misses cases across devices | Low | Medium | All conflict detection runs server-side, not client-side |

---

## Technical Notes

| Component | Detail |
|-----------|--------|
| Live UI Page | `/chamber` ("Case Management") — Today / All cases / Calendar / Deadlines tabs |
| DB Entities | Prisma `Matter`, `MatterHearing` (+ deadlines, case notes); client & opponent phone + CNIC fields |
| Retired manager | Old separate "cases" manager retired and redirected into `/chamber` |
| Per-user isolation | All queries scoped to `userId` — consistent with PRD Q9 decision |
| Calendar UI | React calendar component (react-big-calendar or similar) |
| Mobile optimization | Today's List must render cleanly on 375px viewport — test on actual phones |
| Notifications | In-app alerts for hearings (1 day before, 1 hour before) — push notifications in v1.5 |
| Links to EPIC-01 | `Document` entity gets optional `matterId` foreign key |
| Links to EPIC-05 | `JudgmentAnalysis` entity gets optional `matterId` foreign key |
| Future (v1.5) | Google Calendar / Outlook sync; firm-level visibility for firm admins |

---

## Definition of Done

| # | Condition |
|---|-----------|
| 1 | All User Stories (US-06-01 to US-06-12) implemented and merged |
| 2 | All Acceptance Criteria (AC-01 to AC-15) verified and checked off |
| 3 | Today's List tested by Abdullah on a real mobile phone |
| 4 | Court dropdown tested — all 20+ courts selectable and saved correctly |
| 5 | Adjournment flow tested with a real case scenario |
| 6 | Conflict detection tested with overlapping hearing dates |
| 7 | Deployed to staging with no critical bugs |
| 8 | Abdullah has reviewed and signed off |

---

## Out of Scope

| Feature | Reason |
|---------|--------|
| Client-facing portal (client can see case status) | Different product — post-v1 |
| Firm-wide case visibility across lawyers | v1.5 — firm admin feature |
| Google Calendar / Outlook sync | v1.5 |
| Billing / invoicing per case | Different product category |
| Automated court date reminders via SMS/WhatsApp | v1.5 — after core feature stable |

---

## Dependencies

| Dependency | Why Needed |
|-----------|-----------|
| Auth System | All matter data scoped per logged-in lawyer |
| EPIC-01 (Drafting Engine) | US-06-11 — link documents to matters |
| EPIC-05 (Judgment Intelligence) | US-06-12 — link judgment analysis to matters |
| Prisma schema update | New entities: Matter, HearingDate, Deadline, CaseNote |
| Abdullah UX validation | Today's List + adjournment flow must match real court practice |

---

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-04-28 | Hamza | Initial Epic created — Chamber Management |
| 1.1 | 2026-06-19 | Hamza | Updated to reflect built & live implementation |
