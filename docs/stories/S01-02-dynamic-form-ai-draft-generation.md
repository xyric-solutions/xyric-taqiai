---
id: S01-02
epic: EPIC-01
title: Dynamic Form & AI Draft Generation
status: Done
priority: P0
updated: 2026-06-19
---

# S01-02 — Dynamic Form & AI Draft Generation

## User Story

As a lawyer, I want to fill a simple form with my client's facts so that AI generates a complete legal draft automatically.

## Acceptance Criteria

- [ ] DynamicForm correctly collects all required case facts per template type
- [ ] AI generates a full draft within 60 seconds of form submission
- [ ] Documents saved to Prisma `Document` model after generation
- [ ] Lawyer must explicitly click "Approve & Export" before final PDF is generated
- [ ] Every exported document logs: lawyer name + timestamp + template used

## Technical Notes

- Form rendering: `src/components/forms/DynamicForm.tsx` (schema-driven — extend, do not rebuild)
- Drafting logic: `src/lib/draft-generator.ts` (extend this, do not rebuild)
- AI generation: `src/lib/gemini.ts` (fallback chain already in place)
- Database: Prisma `Document` model
- AI helper: `src/lib/gemini-helper.ts`

## Definition of Done

- [ ] DynamicForm renders correct fields per template type
- [ ] AI draft generated within 60 seconds
- [ ] Document saved to database after generation
- [ ] "Approve & Export" is the only export path — no bypass
- [ ] Audit log entry created on each export
- [ ] Tested by at least 2 lawyers in real drafting scenario
- [ ] Abdullah sign-off
