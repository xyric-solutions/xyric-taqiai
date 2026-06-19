---
id: S10-02
epic: EPIC-10
title: AI OCR Same-to-Same Extraction
status: Done
priority: P0
created: 2026-06-19
---

# S10-02 — AI OCR Same-to-Same Extraction

## User Story

As a lawyer, I want the AI to type out the document text exactly as shown — same-to-same, not summarized — so that the digital copy faithfully matches the original.

## Acceptance Criteria

- [x] AI performs OCR on the uploaded image
- [x] Output reproduces the document text exactly as shown
- [x] Formatting and content are preserved (not paraphrased or summarized)
- [x] Extraction runs via `POST /api/ai/extract-document` (Gemini vision/OCR)
- [x] Generated text is displayed for the lawyer to review

## Technical Notes

- API: `POST /api/ai/extract-document` — Gemini vision/OCR
- Prompt enforces literal same-to-same retyping; no summarizing or rewriting
- Skill spec: LEGAL-10 (Document OCR)

## Definition of Done

- [x] OCR extraction returns same-to-same document text
- [x] Tested on real document photos for fidelity
- [x] No summarization or paraphrasing in output
- [x] Abdullah sign-off
