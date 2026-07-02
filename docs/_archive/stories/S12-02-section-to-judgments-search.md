---
id: S12-02
epic: EPIC-12
title: Section-to-Judgments Search
status: Done
priority: P0
---

# S12-02 — Section-to-Judgments Search

## User Story

As a lawyer, I want to click a section and see all judgments that cite it so that I find relevant case law instantly.

## Acceptance Criteria

- [x] Clicking a section searches all judgments citing that section
- [x] Search uses `POST /api/ai/judgment` with section-specific queries
- [x] Judgment data is sourced from the local `judgments.db` corpus
- [x] Results list the citing judgments for the selected section
- [x] Graceful state shown when few/no judgments are found

## Technical Notes

- API: `POST /api/ai/judgment` with section-specific query
- Judgment data source: local `judgments.db`
- Related to EPIC-05 (shares judgment corpus and AI judgment API)

## Definition of Done

- [x] Section click returns citing judgments from `judgments.db`
- [x] Results relevant to the selected section (Abdullah confirms)
- [x] Empty / sparse-result state handled
- [x] Abdullah sign-off
