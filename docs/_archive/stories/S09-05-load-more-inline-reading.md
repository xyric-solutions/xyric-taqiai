---
id: S09-05
epic: EPIC-09
title: Load-More Pagination & Inline Judgment Reading
status: Done
priority: P1
---

# S09-05 — Load-More Pagination & Inline Judgment Reading

## User Story

As a lawyer, I want to load more results and read the full text of any judgment inline so that I can verify a precedent before keeping it.

## Acceptance Criteria

- [x] "Load more" pagination fetches additional results without losing curated selections
- [x] Full judgment text can be opened and read inline within the RESULTS stage
- [x] Reading a judgment inline does not navigate away from the workflow

## Technical Notes

- Pagination + full-text retrieval via `GET /api/judgments/local`
- Judgment text sourced from local SQLite `judgments.db`
- Skill spec: `LEGAL-06` (Judgment Intelligence)

## Definition of Done

- [x] Load-more appends results and preserves the curated set
- [x] Full judgment text readable inline
- [x] Workflow state retained while reading
- [x] Abdullah sign-off
