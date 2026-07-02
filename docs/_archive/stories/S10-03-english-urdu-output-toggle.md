---
id: S10-03
epic: EPIC-10
title: English / Urdu Output Toggle
status: Done
priority: P0
created: 2026-06-19
---

# S10-03 — English / Urdu Output Toggle

## User Story

As a lawyer, I want to choose whether the output is in English or Urdu so that the typed document matches the language I need.

## Acceptance Criteria

- [x] Output language toggle is visible on the page
- [x] Toggle switches the generated text between English and Urdu
- [x] Urdu output renders correctly (script and direction)
- [x] Selected language is applied to the extraction output

## Technical Notes

- Output language passed to `POST /api/ai/extract-document`
- Urdu rendering reuses the app's existing Urdu display handling
- Skill spec: LEGAL-10 (Document OCR)

## Definition of Done

- [x] English/Urdu toggle working
- [x] Urdu output renders correctly
- [x] Abdullah sign-off
