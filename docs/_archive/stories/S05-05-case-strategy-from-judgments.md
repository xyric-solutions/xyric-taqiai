---
id: S05-05
epic: EPIC-05
title: AI Case Strategy from Multiple Judgments
status: Done
priority: P1
updated: 2026-06-19
---

# S05-05 — AI Case Strategy from Multiple Judgments

## User Story

As a lawyer, I want to upload multiple judgments and get an AI-prepared case strategy with recommended arguments and citations.

## Acceptance Criteria

- [ ] Lawyer can upload 2+ judgments for combined analysis
- [ ] AI generates: strongest arguments for lawyer's side, expected counter-arguments, key citations to use, weaknesses to address
- [ ] Counter-arguments for opposing side always included — not suppressed
- [ ] AI-generated warning label on strategy output

## Technical Notes

- Skill spec: `src/skills/LEGAL-06-judgment-intelligence.md` (Mode C — Case Strategy)
- AI model: Gemini Pro (long context — handles multiple judgment inputs)
- Input: lawyer specifies their side (Plaintiff / Defendant / Prosecution / Defense)
- Output format defined in Mode C of skill spec

## Definition of Done

- [ ] Multi-judgment upload working
- [ ] Case strategy generated with all 4 required sections
- [ ] Counter-arguments always present in output
- [ ] AI warning label present
- [ ] Abdullah sign-off
