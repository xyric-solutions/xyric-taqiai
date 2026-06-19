---
id: S09-06
epic: EPIC-09
title: AI Follow-Up Questions with Auto Pre-Fill
status: Done
priority: P0
---

# S09-06 — AI Follow-Up Questions with Auto Pre-Fill

## User Story

As a lawyer, I want the AI to ask me only for the details still missing for this document, with fields pre-filled from what I already entered, so that I never re-type information.

## Acceptance Criteria

- [x] ASKING stage requests only document-specific details that are still missing
- [x] Fields are auto pre-filled from values captured in the INPUT stage
- [x] No previously entered field needs to be re-typed
- [x] Completed answers flow into the GENERATING stage

## Technical Notes

- ASKING stage reads INPUT stage state to pre-fill known values
- Missing-field set determined per document type
- Skill spec: `LEGAL-02` (Legal Drafter) — intake completion

## Definition of Done

- [x] Only missing fields are requested
- [x] Pre-fill verified — 0 fields re-typed in a full flow test
- [x] Answers passed to drafting
- [x] Abdullah sign-off
