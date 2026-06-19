---
id: S10-05
epic: EPIC-10
title: Post-Extraction Edit & Preview
status: Done
priority: P1
created: 2026-06-19
---

# S10-05 — Post-Extraction Edit & Preview

## User Story

As a lawyer, I want to edit and preview the extracted text after generation so that I can correct any OCR errors before using it.

## Acceptance Criteria

- [x] Extracted text can be edited inline after generation
- [x] A preview of the document is shown
- [x] Edits are reflected immediately in the preview
- [x] Edited document persists to My Documents

## Technical Notes

- Inline edit on the generated output (same pattern as document preview editing elsewhere in the app)
- Manual edits require no extra API call
- Skill spec: LEGAL-10 (Document OCR)

## Definition of Done

- [x] Post-extraction inline edit working
- [x] Preview reflects edits immediately
- [x] Edited document saved to My Documents
- [x] Abdullah sign-off
