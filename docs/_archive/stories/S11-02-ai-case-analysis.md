---
id: S11-02
epic: EPIC-11
title: AI Case Analysis (Parties / Facts / Issues / Applicable Law / Missing Info)
status: Done
priority: P0
created: 2026-06-19
---

# S11-02 — AI Case Analysis (Parties / Facts / Issues / Applicable Law / Missing Info)

## User Story

As a lawyer, I want the AI to analyze the discussion and extract parties, facts, legal issues, applicable law, and missing information so that I see a structured case breakdown.

## Acceptance Criteria

- [x] Analysis returns a case summary
- [x] Analysis extracts the parties
- [x] Analysis extracts the facts
- [x] Analysis identifies the legal issues
- [x] Analysis lists applicable law sections
- [x] Analysis flags missing information
- [x] Analysis runs via `POST /api/ai/case-analysis`

## Technical Notes

- Analysis API: `POST /api/ai/case-analysis` — discussion → structured breakdown
- Skill spec: LEGAL-07 (Voice Intake)

## Definition of Done

- [x] Structured breakdown returned with all sections
- [x] Missing information clearly surfaced
- [x] Abdullah sign-off
