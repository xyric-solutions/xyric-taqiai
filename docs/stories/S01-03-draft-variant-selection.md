---
id: S01-03
epic: EPIC-01
title: Draft Variant Selection
status: Done
priority: P1
updated: 2026-06-19
---

# S01-03 — Draft Variant Selection

## User Story

As a lawyer, I want to choose between 2-3 AI-generated draft variants so that I can pick the best fit for my client.

## Acceptance Criteria

- [ ] 2–3 draft variants offered where applicable (clarify-then-draft mode)
- [ ] Variants clearly labelled and distinguished from one another
- [ ] Lawyer can select one variant and proceed to inline editing

## Technical Notes

- Drafting modes: Variant Selection mode in `src/lib/draft-generator.ts`
- Uses Clarify-then-Draft mode for complex or ambiguous cases
- Document preview: `src/components/documents/DocumentPreview.tsx`

## Definition of Done

- [ ] 2–3 variants generated and displayed when applicable
- [ ] Variant selection leads to inline editor without page reload
- [ ] Tested by at least 1 lawyer
- [ ] Abdullah sign-off
