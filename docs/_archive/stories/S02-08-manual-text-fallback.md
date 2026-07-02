---
id: S02-08
epic: EPIC-02
title: Manual Text Entry Fallback
status: Done
priority: P0
updated: 2026-06-19
---

# S02-08 — Manual Text Entry Fallback

## User Story

As a lawyer, I want a manual text entry option as a fallback if voice quality is poor so that I am never stuck and can always complete the draft.

## Acceptance Criteria

- [ ] Manual text entry always available — even when voice/image upload is offered
- [ ] Switching from voice/image to manual text does not lose any extracted facts
- [ ] Manual entry fallback accessible immediately if voice fails — no extra steps

## Technical Notes

- Image upload + typing component: `src/components/documents/ImageUploadTyping.tsx` (already handles text typing fallback)
- Voice component: `src/components/documents/VoiceRecorder.tsx`
- Manual text field must always be visible alongside voice/image options

## Definition of Done

- [ ] Manual text entry always available on court case drafting forms
- [ ] Switching from voice/image to text works without data loss
- [ ] Fallback usage rate tracked in feature analytics
- [ ] Abdullah sign-off
