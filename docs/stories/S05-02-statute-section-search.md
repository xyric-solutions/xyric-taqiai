---
id: S05-02
epic: EPIC-05
title: Statute Section Judgment Search
status: Done
priority: P0
updated: 2026-06-19
---

# S05-02 — Statute Section Judgment Search

## User Story

As a lawyer, I want to search judgments by statute section (e.g., "PPC 302") so that I find all cases that cited that section.

## Acceptance Criteria

- [ ] Statute section search returns all judgments in corpus that cited that section
- [ ] Supports: PPC, CrPC, CPC, Family Courts Act, Contract Act, and all major Pakistani statutes
- [ ] Results show: citation, court, parties, one-line summary, binding status
- [ ] Search response time < 5 seconds

## Technical Notes

- Corpus: local read-only SQLite `judgments.db` + semantic search service (embeddings)
- Semantic search over section-tagged chunks via embeddings; keyword fallback over `judgments.db`
- APIs: `GET /api/judgments/local`, `GET /api/judgments/semantic`
- Citation parser extracts statute references from judgment text

## Definition of Done

- [ ] PPC, CrPC, CPC section searches working
- [ ] Results include binding/persuasive indicator
- [ ] < 5 second response time
- [ ] Abdullah sign-off
