---
id: S04-02
epic: EPIC-04
title: Verified Citations in AI Responses
status: Done
priority: P0
updated: 2026-06-19
---

# S04-02 — Verified Citations in AI Responses

## User Story

As a lawyer, I want AI responses to include verified citations (PPC section, CrPC section, case law) when the answer relies on them, so that I can use the information professionally.

## Acceptance Criteria

- [x] Citations/judgment sources shown when relevant — when the answer relies on specific Pakistani law or judgments (PPC, CrPC, CPC, Family Courts Act, etc.). The advisor replies conversationally (ChatGPT-style) and does NOT force a citation block on every single answer.
- [x] Zero made-up citations — AI only surfaces grounded sources from the judgment corpus
- [x] Uncertain cases explicitly flagged — AI does not invent citations
- [x] Citation accuracy: grounded sources only, no hallucinations

## Technical Notes

- Legal reference set maintained in `src/skills/LEGAL-04-legal-advisor.md`
- AI cannot cite anything outside the pre-approved set — must flag uncertainty instead
- Reference set reviewed quarterly by Abdullah / Legal Team

## Definition of Done

- [x] Citations/judgment sources surfaced when the answer relies on them (not forced on every turn)
- [x] Citation accuracy verified — only grounded sources surfaced, no hallucinations
- [x] Uncertainty flag shown when AI cannot find a verified source
- [ ] Abdullah sign-off
