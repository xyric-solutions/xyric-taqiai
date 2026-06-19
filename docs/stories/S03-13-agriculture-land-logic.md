---
id: S03-13
epic: EPIC-03
title: Agriculture Land Tax Logic
status: Done
priority: P0
updated: 2026-06-19
---

# S03-13 — Agriculture Land Tax Logic

## User Story

As a lawyer handling agriculture land, I want the calculator to use the agricultural DC rate and apply the correct provincial revenue rules so that the calculation is accurate for farmland.

## Acceptance Criteria

- [x] When property type = Agriculture Land: agricultural DC rate used (separate from residential — usually much lower)
- [x] FBR 236C/236K flagged as "typically not applicable" on agriculture land — shown as note
- [x] CGT flagged as "generally exempt for agriculture land" — confirm per province
- [x] Stamp Duty (provincial) + Mutation fee calculated
- [x] PLRA Fard and mutation charges calculated for Punjab agriculture transactions
- [x] Verified: Agriculture land uses agri DC rate; provincial revenue rules applied

## Technical Notes

- Size units for agri: acres / kanals / marlas (with conversion)
- Rate tables hardcoded in the calculator

## Definition of Done

- [x] Agriculture land calculation uses agri DC rate
- [x] FBR 236C/K flagged with explanatory note
- [x] CGT exemption noted
- [x] Verified accurate against manual calculation by legal team
- [x] Abdullah sign-off
