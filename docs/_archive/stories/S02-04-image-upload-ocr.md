---
id: S02-04
epic: EPIC-02
title: Image Upload & OCR Fact Extraction
status: Done
priority: P1
updated: 2026-06-19
---

# S02-04 — Image Upload & OCR Fact Extraction

> **Built & Live:** Image/OCR intake is now its own dedicated feature — Copy from Photo (`/copy-from-photo`, **EPIC-10**): upload a document photo and AI types it out same-to-same (reuses the extract-document API + ImageUploadTyping). See EPIC-10 for the full, current spec.

## User Story

As a lawyer, I want to upload images of handwritten notes or existing documents so that AI reads and uses that information in the draft.

## Acceptance Criteria

- [ ] Image upload → OCR/text extraction → fact pre-fill works correctly
- [ ] Image → fact extraction accuracy > 85%
- [ ] If OCR fails on low-quality image, clear error shown + manual re-entry allowed
- [ ] Supported formats: JPG, PNG, PDF (scanned)

## Technical Notes

- Image upload component: `src/components/documents/ImageUploadTyping.tsx` (already built — reuse)
- Vision API: `src/lib/gemini.ts` with Gemini vision capability (already enabled)
- AI advisor route already handles image Parts: `src/app/api/ai/advisor/route.ts`

## Definition of Done

- [ ] Image upload → OCR → form pre-fill working end-to-end
- [ ] Tested with real scanned documents
- [ ] Error handling for low-quality images confirmed working
- [ ] Abdullah sign-off
