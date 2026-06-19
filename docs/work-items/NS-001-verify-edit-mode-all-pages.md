---
id: NS-001
title: Verify & Audit Document Edit on All Drafting Pages
story_ids: [S01-04]
status: completed
priority: P1
created: 2026-05-04
completed: 2026-06-19
---

# NS-001 — Verify & Audit Document Edit on All Drafting Pages

## Objective

Ensure that the `DocumentPreview` component renders correctly on all drafting pages and that the edit options (Manual Edit + AI Edit) are visible and functional.

## Tasks

- [x] Visit each drafting page and confirm that DocumentPreview renders
  - `/affidavits/[type]`
  - `/agreements/[type]`
  - `/power-of-attorney/[type]`
  - `/family-law/[type]`
  - `/applications/[type]`
  - `/civil-law/[subType]`
  - `/criminal-law/[subType]`
  - `/corporate-law/[subType]`
  - `/property-law/[subType]`
  - `/tax-law/[subType]`
  - `/immigration-law/[subType]`
  - `/constitutional-law/[subType]`
  - `/non-muslim-laws/[subType]`
- [x] Test the "Manual Edit" button on each page
- [x] Test the "AI Edit" button on each page
- [x] Test in Urdu language mode as well
- [x] Confirm the `onContentChange` prop is properly wired on each page (document saves correctly)
- [x] Fix and note any bugs found

## Files to Check

```
src/app/(dashboard)/[category]/[type]/page.tsx  — all pages
src/components/documents/DocumentPreview.tsx    — edit logic
src/app/api/ai/edit-document/route.ts          — AI edit API
```

## Definition of Done

- Edit buttons work on all listed pages
- No console errors
- Urdu documents are edited in RTL direction
