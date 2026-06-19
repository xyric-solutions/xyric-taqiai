---
id: S09-07
epic: EPIC-09
title: Judgment-Guided Document Generation (English/Urdu)
status: Done
priority: P0
---

# S09-07 — Judgment-Guided Document Generation (English/Urdu)

## User Story

As a lawyer, I want the AI to draft my document in English or Urdu using the precedents I curated as guidance so that the draft reflects the law I selected and the correct location.

## Acceptance Criteria

- [x] Draft is generated using the curated judgments as guidance only
- [x] Document can be generated in English or Urdu
- [x] Draft uses ONLY the user-provided court and city — never assumes a location
- [x] Generic forced citations ("reliance is placed") avoided unless explicitly requested

## Technical Notes

- API: `POST /api/ai/smart-draft` — judgment-guided drafting
- AI Model: Google Gemini (multi-model fallback chain)
- Drafting prompt constrained to user-provided court/city; judgments are guidance only
- Skill spec: `LEGAL-02` (Legal Drafter)
- Output labeled "AI-generated — verify before use in court"

## Definition of Done

- [x] Drafts generate in both English and Urdu
- [x] Location accuracy verified by Abdullah on 10 drafts (100% match)
- [x] No generic forced citations unless requested
- [x] Abdullah sign-off
