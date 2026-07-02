---
id: S04-06
epic: EPIC-04
title: Follow-up Questions in Same Thread
status: Done
priority: P1
updated: 2026-06-19
---

# S04-06 — Follow-up Questions in Same Thread

## User Story

As a lawyer, I want to ask follow-up questions in the same thread so that I can go deeper on a legal issue without losing context.

## Acceptance Criteria

- [ ] Follow-up questions maintain full conversation context within the same session
- [ ] AI response references prior messages in the thread
- [ ] Thread context passed to Gemini API with each follow-up
- [ ] No context loss between messages in a session

## Technical Notes

- Chat sessions: Prisma `ChatSession` model
- Gemini API: full conversation context passed with each request (sufficient context window)
- AI generation: `src/lib/gemini.ts` with conversation history parameter

## Definition of Done

- [ ] Follow-up questions retain full prior context
- [ ] AI responses reference earlier messages correctly
- [ ] Tested with multi-turn legal Q&A scenario
- [ ] Abdullah sign-off
