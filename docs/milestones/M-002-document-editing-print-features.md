---
type: milestone
id: M-002
title: Document Editing & Print Features
product: taqiai
status: completed
planned: 2026-05-04
achieved: 2026-06-19
milestone_type: feature
---

# [M-002] Document Editing & Print Features

## Summary

Improve the document editing and print experience for advocates. Add the stamp paper print feature (4.5" top margin), add an AI edit option in court cases, and verify edit features across all drafting pages. **Status: completed and live.**

## Scope

| Story | Feature | Priority |
|-------|---------|----------|
| [S01-04](../stories/S01-04-inline-draft-editing.md) | Inline Draft Editing — All Drafting Pages | P0 |
| [S01-10](../stories/S01-10-stamp-paper-print.md) | Stamp Paper Print (4.5" top margin, adjustable) | P0 |
| [S01-11](../stories/S01-11-urdu-performa-typography.md) | Urdu Performa — Typography, Border & Bold Fields | P0 |
| [S02-09](../stories/S02-09-ai-edit-court-cases.md) | Court Cases AI Edit & Improved PDF | P0 |
| [S01-12](../stories/S01-12-english-performa-typography.md) | English Performa — Standard Legal Typography | P0 |

## Work Items

| Task | Story | Status |
|------|-------|--------|
| [NS-001](../work-items/NS-001-verify-edit-mode-all-pages.md) | S01-04 | completed |
| [NS-002](../work-items/NS-002-implement-stamp-paper-print.md) | S01-10 | completed |
| [NS-003](../work-items/NS-003-court-cases-edit-pdf.md) | S02-09 | completed |
| [NS-004](../work-items/NS-004-urdu-performa-typography.md) | S01-11 | completed |
| [NS-006](../work-items/NS-006-english-performa-typography.md) | S01-12 | completed |

## Key Decisions Made

| Decision | Rationale |
|----------|-----------|
| Stamp paper default = 4.5 inch top | Pakistani legal practice standard for pre-printed stamp paper header |
| Page 2+ default = 1.0 inch | Normal page margin — the stamp header only appears on the first page |
| No stamp paper for court cases | Court documents are filed on plain A4 |
| Add AI Edit in court cases | Text editing via a plain textarea is limited; AI instructions give a better UX |

## Acceptance Criteria

- [x] Editing (manual + AI) works across all drafting pages
- [x] DocumentPreview has a "Stamp Paper Print" button
- [x] Stamp paper settings panel: Page 1 top = 4.5", Page 2+ = 1.0" (both adjustable)
- [x] When printed, Page 1 content starts below the 4.5" margin
- [x] Court Cases has an AI Edit button and panel
- [x] Court Cases PDF prints with proper formatting

## Context

**Why:** Stamp paper documents are common in Pakistani courts. Advocates previously changed printer settings manually, which is error-prone. A direct stamp paper print option saves time and reduces errors.

**How it was applied:** Changes were made in `DocumentPreview.tsx` and AI edit was added in `court-cases/page.tsx`. Both files extend existing code rather than replacing it.

## Session Reference

| Field | Value |
|-------|-------|
| **Session Date** | 2026-05-04 |
| **Related Milestone** | M-001 (Product Discovery — completed) |
| **Epic** | [E-01 — Document Editing & Print Options](../prd-epics/Epic-01-Document-Editing-and-Print.md) |
