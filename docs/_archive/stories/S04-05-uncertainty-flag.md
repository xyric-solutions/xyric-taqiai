---
id: S04-05
epic: EPIC-04
title: AI Uncertainty Flag
status: Done
priority: P0
updated: 2026-06-19
---

# S04-05 — AI Uncertainty Flag

## User Story

As a lawyer, I want AI to clearly flag when it is uncertain so that I know when not to rely on the AI output.

## Acceptance Criteria

- [ ] Uncertainty flag clearly visible in UI — not hidden or subtle
- [ ] AI uncertainty flag rate tracked — should decrease over time as reference set improves
- [ ] Flagged responses still shown to lawyer — not suppressed
- [ ] Lawyer prompted to seek additional verification when uncertainty flag shown

## Technical Notes

- Uncertainty detection in `src/skills/LEGAL-04-legal-advisor.md` skill spec
- AI flags uncertainty when query falls outside pre-approved reference set
- Do NOT suppress uncertain answers — show them with clear flag

## Definition of Done

- [ ] Uncertainty flag visually prominent in UI
- [ ] Flag shown on uncertain responses — not hidden
- [ ] Flag occurrence rate tracked in logs
- [ ] Abdullah sign-off
