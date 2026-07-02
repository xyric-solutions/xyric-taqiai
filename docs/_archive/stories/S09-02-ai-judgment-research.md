---
id: S09-02
epic: EPIC-09
title: AI Judgment Research from Case Facts
status: Done
priority: P0
---

# S09-02 — AI Judgment Research from Case Facts

## User Story

As a lawyer, I want the AI to read my case facts and automatically search the judgment database for relevant precedents so that I don't have to think up search terms myself.

## Acceptance Criteria

- [x] RESEARCH stage runs automatically after INPUT is submitted
- [x] AI generates search terms from the case facts and sections
- [x] Search runs across the full Pakistani judgment corpus (Supreme Court, Federal Shariat Court, all High Courts)
- [x] Candidate judgments plus a case strategy are returned for the RESULTS stage

## Technical Notes

- API: `POST /api/ai/case-prepare` — research + candidate judgments + strategy (Gemini + judgment DB)
- Search backed by local SQLite `judgments.db` via `GET /api/judgments/local`
- AI Model: Google Gemini (multi-model fallback chain)
- Skill spec: `LEGAL-06` (Judgment Intelligence)

## Definition of Done

- [x] Research auto-runs from case facts with no manual query needed
- [x] Results drawn from SC + FSC + all High Courts in the corpus
- [x] Candidate judgments and strategy returned to RESULTS stage
- [x] Abdullah sign-off
