---
id: S05-04
epic: EPIC-05
title: Judgment Q&A (Ask AI About a Judgment)
status: Done
priority: P0
updated: 2026-06-19
---

# S05-04 — Judgment Q&A (Ask AI About a Judgment)

## User Story

As a lawyer, I want to ask AI questions about a specific judgment (e.g., "What was the reasoning on bail?") so that I extract the information I need.

## Acceptance Criteria

- [ ] Lawyer can ask follow-up questions about a specific judgment
- [ ] AI answers are grounded in the judgment text — no hallucination outside the document
- [ ] Q&A answers accurate and specific to the loaded judgment
- [ ] AI-generated warning label on all Q&A responses

## Technical Notes

- API: `POST /api/ai/judgment` (judgment Q&A)
- AI model: Gemini for Q&A
- Grounding: AI response must cite specific paragraphs or passages from the judgment
- Relevant judgment chunks retrieved via the semantic search service (embeddings) over the local SQLite `judgments.db`

## Definition of Done

- [ ] Q&A about any loaded judgment works correctly
- [ ] Answers grounded in judgment text — not invented
- [ ] AI warning label present on all Q&A responses
- [ ] Tested by Abdullah with 5 real judgments
- [ ] Abdullah sign-off
