---
id: S03-03
epic: EPIC-03
title: Province-Aware Tax Calculation
status: Done
priority: P0
updated: 2026-06-19
---

# S03-03 — Province-Aware Tax Calculation

## User Story

As a lawyer, I want the calculator to take province into account so that Stamp Duty and PLRA rates are correct for that region.

## Acceptance Criteria

- [x] Province selector: Punjab, Sindh, KPK, Balochistan, Islamabad
- [x] Stamp Duty calculated using correct provincial rate per selected province
- [x] PLRA charges calculated only when Punjab is selected
- [x] All provinces tested and verified accurate

## Technical Notes

- Province is Step 1 in the calculator flow
- Rate tables per province are hardcoded in the calculator
- FBR rates and provincial Stamp Duty handled in deterministic rule-based logic

## Definition of Done

- [x] Province selector works for all 5 options (Punjab, Sindh, KPK, Balochistan, Islamabad)
- [x] PLRA shown only for Punjab
- [x] Stamp Duty rate changes per province
- [x] All provinces tested by legal team
- [x] Abdullah sign-off
