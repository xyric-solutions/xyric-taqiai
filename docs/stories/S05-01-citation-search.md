---
id: S05-01
epic: EPIC-05
title: Judgment Citation Search
status: Done
priority: P0
updated: 2026-06-19
---

# S05-01 — Judgment Citation Search

## User Story

As a lawyer, I want to search for a judgment by its citation (e.g., "2023 SCMR 1450") so that it appears on my screen immediately.

## Acceptance Criteria

- [ ] Citation search supports all formats: SCMR, PLD, PCrLJ, MLD, CLC, YLR, PLJ, NLR, SBLR
- [ ] Correct judgment returned for given citation — 100% accuracy
- [ ] Search response time < 5 seconds
- [ ] If citation not in library: clear "not found" message + upload option shown

## Technical Notes

- Citation parser: regex patterns for all supported reporter formats
- Corpus: local read-only SQLite `judgments.db` (~200K+ rows across Supreme Court, Federal Shariat Court, and all High Courts; smaller unique count)
- Search: exact citation match (primary) + semantic search service / embeddings (secondary)
- APIs: `GET /api/judgments/local` (keyword/citation), `GET /api/judgments/semantic` (smart AI search)
- Route: `/case-law`

## Definition of Done

- [ ] Citation search returns correct judgment for all 9 reporter formats
- [ ] Search tested on 20 real citations by Abdullah
- [ ] < 5 second response time
- [ ] "Not found" flow tested
- [ ] Abdullah sign-off
