---
id: S09-04
epic: EPIC-09
title: Add/Remove & Manual Judgment Search
status: Done
priority: P0
---

# S09-04 — Add/Remove & Manual Judgment Search

## User Story

As a lawyer, I want to remove judgments I don't want and run my own search query to find more so that I control which precedents guide the draft.

## Acceptance Criteria

- [x] Lawyer can remove any AI-suggested judgment from the curated set
- [x] Lawyer can add judgments to the curated set
- [x] Lawyer can run a manual search query for more judgments
- [x] Curated set is what gets passed to the drafting stage

## Technical Notes

- Manual search backed by `GET /api/judgments/local`
- Curated set is held in RESULTS stage state and passed to `POST /api/ai/smart-draft`
- Skill spec: `LEGAL-06` (Judgment Intelligence)

## Definition of Done

- [x] Add and remove both work on the curated set
- [x] Manual query returns matching judgments from the corpus
- [x] Only curated judgments are used for drafting
- [x] Abdullah sign-off
