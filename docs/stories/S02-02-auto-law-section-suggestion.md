---
id: S02-02
epic: EPIC-02
title: Auto Law Section Suggestion
status: Done
priority: P0
updated: 2026-06-19
---

# S02-02 — Auto Law Section Suggestion

## User Story

As a lawyer, I want the system to automatically suggest relevant law sections (CrPC, CPC, PPC) based on case type so that my filings are legally accurate.

## Acceptance Criteria

- [ ] AI automatically suggests relevant Pakistani law sections per case type
- [ ] Law section suggestion accuracy > 90% (lawyer-verified testing)
- [ ] Lawyer can accept, modify, or reject suggested sections
- [ ] Suggestions cover: CrPC, CPC, PPC, Family Courts Act, and other relevant statutes

## Technical Notes

- Intent detection: `src/lib/intent-detection.ts` (480+ line classifier — determines case type)
- Intent handlers: `src/lib/intent-handlers.ts` (routing after intent detected)
- AI generation: `src/lib/gemini.ts`
- Drafting skill: `src/skills/LEGAL-02-legal-drafter.md`

## Definition of Done

- [ ] Law sections auto-suggested for all major case types
- [ ] Suggestion accuracy verified > 90% by legal team
- [ ] Lawyer can override any suggestion
- [ ] Tested across civil, criminal, and family case types
- [ ] Abdullah sign-off
