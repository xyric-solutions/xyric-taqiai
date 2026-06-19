---
id: S01-04
epic: EPIC-01
title: Inline Draft Editing
status: Done
priority: P0
updated: 2026-06-19
---

# S01-04 — Inline Draft Editing

## User Story

As a lawyer, I want to edit the AI draft inline so that I can correct any details before finalizing.

## Acceptance Criteria

- [ ] Inline editing of AI draft works without page reload
- [ ] Lawyer can modify any section of the generated draft
- [ ] Edits are preserved before the "Approve & Export" step

## Technical Notes

- Document preview + edit: `src/components/documents/DocumentPreview.tsx`
- Editing should not alter the underlying legal structure — only fact-level content
- Success metric: lawyer edit ratio < 20% of AI output (track edits before approval)

## Definition of Done

- [ ] Inline editing works without page reload
- [ ] Edits preserved correctly through to export
- [ ] Tested by at least 1 lawyer
- [ ] Abdullah sign-off
