---
id: S03-11
epic: EPIC-03
title: Plot Logic — Land Only (No Malba)
status: Done
priority: P0
updated: 2026-06-19
---

# S03-11 — Plot Logic — Land Only (No Malba)

## User Story

As a lawyer dealing with a plot, I want only the land (DC rate) to be used — no structure/malba added — because an empty plot has no construction.

## Acceptance Criteria

- [x] When property type = Plot: valuation = DC rate × area ONLY
- [x] Malba/structure rate is NOT added for plots
- [x] Verified: Plot calculation uses land value only

## Technical Notes

- Property type logic: Plot = DC rate × area | No structure value
- Property type step in the calculator flow
- Rate tables hardcoded in the calculator

## Definition of Done

- [x] Plot calculation uses DC rate × area only
- [x] Malba rate not included in plot calculation
- [x] Verified accurate against manual calculation
- [x] Abdullah sign-off
