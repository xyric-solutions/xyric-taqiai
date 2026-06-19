---
id: S02-06
epic: EPIC-02
title: Formatted Court Document Preview
status: Done
priority: P0
updated: 2026-06-19
---

# S02-06 — Formatted Court Document Preview

## User Story

As a lawyer, I want a formatted court document preview that matches Pakistani court standards so that I know exactly what will be filed.

## Acceptance Criteria

- [ ] Court document preview renders with Pakistani court conventions (headers, court name, case number fields)
- [ ] Preview is accurate to final PDF output — WYSIWYG
- [ ] Lawyer can edit inline within the preview before approving
- [ ] PDF export from preview matches exactly what is shown

## Technical Notes

- Document preview: `src/components/documents/DocumentPreview.tsx` (already built — reuse and extend)
- Court-specific formatting templates per court type (civil, criminal, family, HC, SC)

## Definition of Done

- [ ] Preview matches Pakistani court formatting conventions
- [ ] Preview matches PDF output exactly
- [ ] Inline editing within preview works without page reload
- [ ] Reviewed by a practicing lawyer
- [ ] Abdullah sign-off
