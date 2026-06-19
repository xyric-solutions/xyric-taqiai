---
id: S03-12
epic: EPIC-03
title: House Logic — Land + Malba/Structure Rate
status: Done
priority: P0
updated: 2026-06-19
---

# S03-12 — House Logic — Land + Malba/Structure Rate

## User Story

As a lawyer dealing with a house, I want both DC rate (land) AND malba/structure rate to be included automatically so that the total valuation is correct.

## Acceptance Criteria

- [x] When property type = House: valuation = (DC rate × area) + (malba/structure rate × area)
- [x] Lawyer enters the malba/structure rate
- [x] Verified: House calculation includes both land and structure values

## Technical Notes

- Property type logic: House → DC rate (land) + Malba rate × area
- When House selected, a Structure/Malba Rate input appears
- As built, rates are hardcoded/manually entered — no estamp DB auto-load
- Rate tables hardcoded in the calculator

## Definition of Done

- [x] House calculation includes both DC rate and malba rate
- [x] Malba/structure rate input works
- [x] Verified accurate by legal team
- [x] Abdullah sign-off
