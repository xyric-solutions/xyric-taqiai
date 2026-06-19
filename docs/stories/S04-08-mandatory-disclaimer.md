---
id: S04-08
epic: EPIC-04
title: Mandatory AI Advice Disclaimer
status: Done
priority: P0
updated: 2026-06-19
---

# S04-08 — Mandatory AI Advice Disclaimer

## User Story

As a lawyer, I want every AI-generated advice to include a disclaimer recommending confirmation with a senior lawyer so that professional standards are always maintained.

## Acceptance Criteria

- [x] A standing/footer disclaimer is always displayed in the advisor — "This advice is AI-generated. Please confirm with a senior lawyer before taking any action." (a standing disclaimer, not a per-turn citation requirement)
- [x] Disclaimer shown before lawyer sees the approval workflow
- [x] Disclaimer present in saved notes and any exported advice
- [x] Disclaimer not removable by lawyer — always displayed

## Technical Notes

- Disclaimer is hardcoded in `src/lib/intent-handlers.ts` LAWYER_PERSONALITY constant
- Must appear in both Urdu and English versions of responses
- i18n: `src/i18n/` for Urdu translation of disclaimer

## Definition of Done

- [ ] Disclaimer on every AI response — confirmed in UI
- [ ] Disclaimer in saved notes
- [ ] Cannot be hidden or disabled
- [ ] Both Urdu and English versions verified
- [ ] Abdullah sign-off
