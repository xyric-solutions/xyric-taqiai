---
id: S05-03
epic: EPIC-05
title: Judgment PDF Upload & AI Summary
status: Done
priority: P0
updated: 2026-06-19
---

# S05-03 — Judgment PDF Upload & AI Summary

## User Story

As a lawyer, I want to upload a judgment PDF and have AI give me a plain-language summary so that I understand it quickly.

## Acceptance Criteria

- [ ] Lawyer-uploaded judgment is OCR-processed and made searchable
- [ ] AI summary produced within 30 seconds of judgment upload/selection
- [ ] AI summary covers: parties, court, date, issues, arguments, ratio decidendi, ruling
- [ ] All AI output clearly labeled "AI-generated — verify before use in court"
- [ ] Lawyer upload success rate > 95%

## Technical Notes

- OCR pipeline: Scanned PDF → Google Vision API or Tesseract → plain text → chunking → embeddings
- AI model: Gemini (long context) for full judgment analysis
- API: `POST /api/ai/judgment` (PDF upload analysis + judgment Q&A)
- Route: `/case-law`

## Definition of Done

- [ ] PDF upload working with OCR processing
- [ ] AI summary generated within 30 seconds
- [ ] Summary covers all 7 required sections (parties, court, date, issues, arguments, ratio, ruling)
- [ ] AI warning label present
- [ ] OCR tested on 10 scanned PDF judgments
- [ ] Abdullah sign-off
