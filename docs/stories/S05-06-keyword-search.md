---
id: S05-06
epic: EPIC-05
title: Keyword / Full-Text Judgment Search
status: Done
priority: P0
updated: 2026-06-19
---

# S05-06 — Keyword / Full-Text Judgment Search

## User Story

As a lawyer, I want to search judgments by keyword or legal issue so that I find relevant precedents for my case.

## Acceptance Criteria

- [ ] Keyword / full-text search works across all ingested judgments
- [ ] Results ranked by relevance
- [ ] Search response time < 5 seconds
- [ ] Results show: citation, court, parties, one-line summary

## Technical Notes

- Corpus: local read-only SQLite `judgments.db` + semantic search service (embeddings)
- Search modes on `/case-law`: smart AI search (semantic), keyword, citation; sort by relevance/newest/oldest
- APIs: `GET /api/judgments/local` (keyword), `GET /api/judgments/semantic` (smart AI search)
- Keyword search as secondary to citation search (citation always preferred)

## Definition of Done

- [ ] Keyword search returns relevant results
- [ ] Results ranked correctly
- [ ] < 5 second response time
- [ ] Abdullah sign-off
