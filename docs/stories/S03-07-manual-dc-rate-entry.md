---
id: S03-07
epic: EPIC-03
title: Lawyer Manually Enters DC Rate
status: Done
priority: P0
updated: 2026-06-19
---

# S03-07 — Lawyer Manually Enters DC Rate

## User Story

As a lawyer, I want to manually enter the DC rate for the property so that AI can calculate the correct tax based on the actual government valuation rate I have.

## Acceptance Criteria

- [x] Lawyer enters DC rate manually (per Marla or per Sqft)
- [x] For House: lawyer also enters Structure/Malba rate separately
- [x] Calculator uses entered DC rate to calculate: Stamp Duty, FBR WHT (on DC value)
- [x] If House: land value (DC rate × area) + structure value (malba rate × area) for total valuation
- [x] Field clearly labelled: "DC Rate (per Marla / per Sqft)" with example

## Technical Notes

- No auto-loading from database — lawyer enters what they know from estamp or FBR; rate tables hardcoded
- DC Rate field: number input (per Marla or per Sqft)
- Malba/Structure Rate field: appears only when property type = House

## Definition of Done

- [x] DC rate manual entry working (per Marla / per Sqft)
- [x] Malba rate field appears for House property type only
- [x] Calculation uses entered values correctly
- [x] Verified accurate by legal team
- [x] Abdullah sign-off
