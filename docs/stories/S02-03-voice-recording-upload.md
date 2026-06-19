---
id: S02-03
epic: EPIC-02
title: Voice Recording Upload & Fact Extraction
status: Done
priority: P1
updated: 2026-06-19
---

# S02-03 — Voice Recording Upload & Fact Extraction

> **Built & Live:** Voice intake is now its own dedicated feature — Voice Case (`/voice-case`, **EPIC-11**): record or upload an advocate-client discussion, AI analyses it and drafts the case document. See EPIC-11 for the full, current spec.

## User Story

As a lawyer, I want to upload a client voice recording so that AI extracts case facts automatically and pre-fills the drafting form.

## Acceptance Criteria

- [ ] Voice upload → speech-to-text → fact extraction pipeline works correctly
- [ ] Extracted facts pre-fill the drafting form automatically
- [ ] No time limit on recording — auto-compress large files before upload
- [ ] If voice pipeline fails, manual text entry fallback available immediately (see S02-08)

## Technical Notes

- Voice input component: `src/components/documents/VoiceRecorder.tsx` (already built — reuse)
- AI transcription: `src/lib/gemini.ts` (Gemini API with voice transcription)
- Large file handling: auto-compress before upload to avoid upload failures

## Definition of Done

- [ ] Voice upload → transcription → form pre-fill working end-to-end
- [ ] Tested with real voice samples
- [ ] Fallback to manual entry available if voice fails
- [ ] Abdullah sign-off
