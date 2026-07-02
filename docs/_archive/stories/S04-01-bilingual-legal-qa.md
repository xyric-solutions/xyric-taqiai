---
id: S04-01
epic: EPIC-04
title: Bilingual Legal Q&A (Urdu & English)
status: Done
priority: P0
updated: 2026-06-19
---

# S04-01 — Bilingual Legal Q&A (Urdu & English)

## User Story

As a lawyer, I want to ask legal questions in plain Urdu or English so that I get quick, relevant guidance on Pakistani law without a language barrier.

## Acceptance Criteria

- [ ] Bilingual input accepted: English, Urdu, and Roman Urdu
- [ ] AI response time < 10 seconds of submitting a question
- [ ] Response relevant to Pakistani law — not generic legal advice
- [ ] Language of response matches language of question (or Roman Urdu default)

## Technical Notes

- Advisor skill: `src/skills/LEGAL-04-legal-advisor.md` (primary reference)
- Intent detection: `src/lib/intent-detection.ts` (classifies query before routing)
- AI generation: `src/lib/gemini.ts` with `getLegalAdvice()` function
- Intent handlers: `src/lib/intent-handlers.ts` — LAWYER_PERSONALITY enforces Roman Urdu output

## Definition of Done

- [ ] English, Urdu, Roman Urdu inputs all accepted
- [ ] Response time < 10 seconds verified
- [ ] Response relevant to Pakistani law
- [ ] Abdullah sign-off
