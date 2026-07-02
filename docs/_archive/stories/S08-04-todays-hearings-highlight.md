---
id: S08-04
epic: EPIC-08
title: Today's Hearings Highlight
status: Done
priority: P0
updated: 2026-06-19
---

> **Built & live (2026-06-19):** Ships in the diary table at `/lawyer-diary` — rows where Next Date is today are highlighted and floated to the top.

# S08-04 — Today's Hearings Highlight

## User Story

As a lawyer, I want cases with a hearing today to be highlighted in my diary so that I instantly know which cases need my attention when I open the app in the morning.

## Acceptance Criteria

- [ ] Any diary row where Next Date = today is visually highlighted (distinct background color or bold row)
- [ ] Highlighted rows appear at the top of the table, above all other cases
- [ ] If no cases are scheduled today, no highlight shown — table shows normal sort order
- [ ] Highlight is based on device local date (Pakistan time — PKT UTC+5)
- [ ] Highlight updates automatically at midnight — yesterday's "today" row returns to normal position

## Technical Notes

- Highlight logic is frontend-only — compare `next_date` to `new Date()` in PKT timezone
- No backend change needed — just conditional CSS class on table row
- PKT offset: UTC+5 — use `Intl.DateTimeFormat` with `Asia/Karachi` timezone for comparison

## Definition of Done

- [ ] Today's hearing rows highlighted and sorted to top
- [ ] No highlight when no cases scheduled today
- [ ] Timezone correctly set to PKT (Asia/Karachi)
- [ ] Abdullah sign-off — tested on a day with scheduled hearings
