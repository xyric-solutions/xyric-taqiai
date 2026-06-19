---
id: S11-05
epic: EPIC-11
title: English / Urdu Output
status: Done
priority: P0
created: 2026-06-19
---

# S11-05 — English / Urdu Output

## User Story

As a lawyer, I want the drafted document in English or Urdu so that it matches the language I need.

## Acceptance Criteria

- [x] Output language can be set to English or Urdu
- [x] Draft is generated in the selected language
- [x] Urdu output renders correctly (script and direction)

## Technical Notes

- Output language passed to the drafting flow (`smart-draft`)
- Urdu rendering reuses the app's existing Urdu display handling
- Skill spec: LEGAL-02 (Legal Drafter)

## Definition of Done

- [x] English/Urdu output working
- [x] Urdu draft renders correctly
- [x] Abdullah sign-off
