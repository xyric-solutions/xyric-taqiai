---
id: S02-07
epic: EPIC-02
title: Missing Critical Information Flag
status: Done
priority: P1
updated: 2026-06-19
---

# S02-07 — Missing Critical Information Flag

## User Story

As a lawyer, I want AI to flag any missing critical information before I finalize so that I don't file an incomplete document.

## Acceptance Criteria

- [ ] AI flags missing critical fields before lawyer approves export
- [ ] Missing fields clearly highlighted in the UI — not subtle
- [ ] Lawyer cannot proceed to "Approve & Export" while critical fields are flagged
- [ ] Non-critical missing fields shown as warnings (not blockers)

## Technical Notes

- Intent detection: `src/lib/intent-detection.ts` (can classify completeness)
- Validation runs before approval step, not only on form submit
- AI generation: `src/lib/gemini.ts`

## Definition of Done

- [ ] Critical missing info flags shown before approval
- [ ] Approval blocked until critical fields resolved
- [ ] Tested with intentionally incomplete case facts
- [ ] Abdullah sign-off
