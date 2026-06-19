---
id: S11-06
epic: EPIC-11
title: Preview, Inline Edit & Auto-Save
status: Done
priority: P0
created: 2026-06-19
---

# S11-06 — Preview, Inline Edit & Auto-Save

## User Story

As a lawyer, I want to preview and inline-edit the draft with auto-save to My Documents so that I can refine and keep it.

## Acceptance Criteria

- [x] Generated draft is shown in a preview
- [x] Draft can be edited inline
- [x] Edits are reflected immediately in the preview
- [x] Draft auto-saves to "My Documents"
- [x] Saved draft is scoped to the logged-in lawyer

## Technical Notes

- Inline edit on the generated draft (same pattern as document preview editing elsewhere in the app)
- Auto-save target: My Documents library, scoped per `userId`
- Skill spec: LEGAL-02 (Legal Drafter)

## Definition of Done

- [x] Preview and inline edit working
- [x] Auto-save to My Documents confirmed
- [x] Abdullah sign-off
