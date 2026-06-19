---
id: S03-10
epic: EPIC-03
title: Property Type Selector (Plot / House / Agriculture)
status: Done
priority: P0
updated: 2026-06-19
---

# S03-10 — Property Type Selector (Plot / House / Agriculture)

## User Story

As a lawyer, I want to select the property type (Plot / House / Agriculture Land) so that the calculator applies the correct rate logic for each type.

## Acceptance Criteria

- [x] Property type selector with 3 options: Plot / House (Constructed) / Agriculture Land
- [x] Selecting each type triggers different rate logic in the calculation
- [x] UI adapts based on property type — shows/hides relevant input fields

## Technical Notes

- Property type step in the calculator flow
- Plot → land only, NO malba (see S03-11)
- House → land + malba/structure rate (see S03-12)
- Agriculture → agri DC rate, revenue rules (see S03-13)

## Definition of Done

- [x] All 3 property types selectable
- [x] Each type triggers correct rate logic
- [x] UI shows/hides appropriate fields per type
- [x] Tested for all 3 property types
- [x] Abdullah sign-off
