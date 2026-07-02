---
id: S03-06
epic: EPIC-03
title: Rate Last Updated Date Display
status: Done
priority: P0
updated: 2026-06-19
---

# S03-06 — Rate Last Updated Date Display

## User Story

As a lawyer, I want the calculator to show the date rates were last updated so that I know if I need to verify against latest FBR notifications.

## Acceptance Criteria

- [x] "DC Rates: [date]" shown prominently in calculator UI
- [x] "FBR Rates: [last updated date]" shown prominently in calculator UI
- [x] System flags when DC rates are > 1 year old
- [x] Dates visible before lawyer runs the calculation — not buried in results

## Technical Notes

- DC rates refresh every July 1 (new financial year)
- FBR rates reviewed and updated quarterly or after budget announcements
- Each rate update logged with date and notification reference
- Rate Update Strategy defined in EPIC-03

## Definition of Done

- [x] Both rate update dates visible prominently in UI
- [x] "Rates outdated" warning shown if > 1 year old
- [x] Dates shown in printable summary as well
- [x] Abdullah sign-off
