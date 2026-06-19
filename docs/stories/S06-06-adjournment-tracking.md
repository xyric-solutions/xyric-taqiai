---
id: S06-06
epic: EPIC-06
title: Adjournment Tracking
status: Done
priority: P0
updated: 2026-06-19
---

> **Built & live (2026-06-19):** Adjournments are captured via the `MatterHearing` model (each hearing records its result and `nextDate`), giving per-matter hearing history. Lives under `/chamber` ("Case Management").

# S06-06 — Adjournment Tracking

## User Story

As a lawyer, I want to mark a hearing as adjourned and set the new date so that adjournment history is automatically maintained.

## Acceptance Criteria

- [ ] Adjournment flow: mark hearing as adjourned → enter new date → old date moves to adjournment history
- [ ] Adjournment history visible per matter (all past adjournment dates)
- [ ] One-tap adjournment flow: done in ~10 seconds
- [ ] Matter status updates to "Adjourned" when hearing is adjourned

## Technical Notes

- `MatterHearing` entity holds the hearing history (each row carries result + `nextDate`), giving the adjournment trail per matter
- Adjournment is a critical workflow — Pakistani lawyers adjourn cases frequently
- All conflict detection runs server-side on new adjourned date

## Definition of Done

- [ ] Adjournment flow working end-to-end
- [ ] Adjournment history visible per matter
- [ ] Matter status updates to Adjourned
- [ ] Adjournment flow tested with real case scenario by Abdullah
- [ ] Abdullah sign-off
