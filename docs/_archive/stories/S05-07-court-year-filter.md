---
id: S05-07
epic: EPIC-05
title: Court & Year Range Filter
status: Done
priority: P0
updated: 2026-06-19
---

# S05-07 — Court & Year Range Filter

## User Story

As a lawyer, I want to filter judgments by court and year so that I find jurisdiction-specific and recent precedents.

## Acceptance Criteria

- [ ] Court filter works for all 7 High Courts + Supreme Court + Federal Shariat Court
- [ ] Year range filter works (e.g., 2015–2023)
- [ ] Filters can be combined with citation or keyword search
- [ ] Filtered results show court and date prominently

## Technical Notes

- Court coverage: SC, FSC, LHC, SHC, PHC, BHC, IHC (all 7)
- Corpus build priority: Supreme Court → Lahore HC → Sindh HC → Peshawar HC → Balochistan HC → Islamabad HC
- Filter applied on `Judgment` DB entity fields (court, date)

## Definition of Done

- [ ] Court filter works for all covered courts
- [ ] Year range filter working
- [ ] Filters combinable with other search types
- [ ] Abdullah sign-off
