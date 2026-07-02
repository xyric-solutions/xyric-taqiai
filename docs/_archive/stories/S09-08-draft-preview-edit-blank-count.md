---
id: S09-08
epic: EPIC-09
title: Draft Preview, Inline Edit & Blank-Field Count
status: Done
priority: P1
---

# S09-08 — Draft Preview, Inline Edit & Blank-Field Count

## User Story

As a lawyer, I want to preview and inline-edit the draft and see how many blanks are still unfilled before I file it so that I don't submit an incomplete document.

## Acceptance Criteria

- [x] DONE stage previews the generated document
- [x] Lawyer can inline-edit the document directly in the preview
- [x] A count of unfilled blanks is shown before filing
- [x] Blank count updates as the lawyer fills in fields

## Technical Notes

- DONE is the final stage of the `/case-builder` wizard
- Edits applied inline to the draft produced by `POST /api/ai/smart-draft`
- Skill spec: `LEGAL-02` (Legal Drafter)
- Output labeled "AI-generated — verify before use in court"

## Definition of Done

- [x] Preview renders the generated draft
- [x] Inline editing works
- [x] Unfilled-blank count shown and accurate before filing
- [x] Abdullah sign-off
