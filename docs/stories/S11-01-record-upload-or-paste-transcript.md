---
id: S11-01
epic: EPIC-11
title: Record / Upload Audio or Paste Transcript
status: Done
priority: P0
created: 2026-06-19
---

# S11-01 — Record / Upload Audio or Paste Transcript

## User Story

As a lawyer, I want to record audio, upload an audio file, or paste a transcript of an advocate-client discussion so that I can start a case from a conversation.

## Acceptance Criteria

- [x] Built-in voice recorder records the discussion
- [x] Lawyer can upload an existing audio file
- [x] Lawyer can paste a transcript instead of audio
- [x] Recorded/uploaded audio is transcribed via `POST /api/ai/voice-transcribe`
- [x] Captured text is passed forward to analysis

## Technical Notes

- Route: `/voice-case`
- Intake component: `VoiceRecorder` (record + upload + paste transcript)
- Transcription API: `POST /api/ai/voice-transcribe`
- Skill spec: LEGAL-07 (Voice Intake)

## Definition of Done

- [x] Record, upload, and paste-transcript all working
- [x] Transcription returns text for analysis
- [x] Abdullah sign-off
