---
id: S05-10
epic: EPIC-05
title: Lawyer Upload of Missing Judgment
status: Done
priority: P0
updated: 2026-06-19
---

# S05-10 — Lawyer Upload of Missing Judgment

## User Story

As a lawyer, if a judgment is not in the library, I want to upload it myself so that it becomes searchable for me.

## Acceptance Criteria

- [ ] "Not found" message shown when citation not in corpus — with upload option
- [ ] Lawyer can upload a judgment PDF
- [ ] Uploaded judgment is OCR-processed and made searchable
- [ ] Lawyer upload success rate > 95%
- [ ] Uploaded judgment available for search and Q&A after processing

## Technical Notes

- OCR pipeline: PDF → Google Vision API or Tesseract → plain text → chunking → embeddings
- OCR quality check: if OCR quality is low, show warning — "Analysis may be incomplete — verify against original"
- Judgment becomes searchable after ingestion pipeline completes

## Definition of Done

- [ ] Upload flow working end-to-end (upload → OCR → indexed)
- [ ] Judgment searchable after upload
- [ ] "Not found + upload" flow tested
- [ ] Upload success rate > 95%
- [ ] Abdullah sign-off
