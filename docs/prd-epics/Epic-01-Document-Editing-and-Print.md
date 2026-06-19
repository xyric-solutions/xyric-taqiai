---
id: E-01
title: Document Editing & Print Options
product: taqiai
status: Done
priority: P1
created: 2026-05-04
updated: 2026-06-19
---

# Epic 01 — Document Editing & Print Options

## Summary

Give advocates the ability to edit AI-generated documents, and provide two kinds of print options: **Standard PDF Print** and **Stamp Paper Print**. Stamp Paper Print uses a special top margin (4.5 inch default) that leaves space for the pre-printed header of the stamp paper. Improve the edit option for court cases. **Status: Built — Live.**

---

## Problem Statement

After generating an AI draft, the advocate can print directly, but:
1. **Drafting pages** (Affidavits, Agreements, Power of Attorney, Family Law, etc.) — Edit and print options exist, but there is no stamp paper print option. A vakalatnama or affidavit is printed on stamp paper, which has a 4.5 inch space at the top reserved for pre-printed text.
2. **Court Cases page** — editing is basic (plain textarea), there is no proper PDF print option, and stamp paper is not needed (court documents are on plain pages).

---

## Scope

### In Scope
- Add a stamp paper print mode in the `DocumentPreview` component
- Top margin setting for stamp paper (default 4.5", adjustable)
- For 2-page documents: Page 1 top = 4.5", Page 2 top = configurable (default 1")
- Improve the edit experience of the Court Cases page
- A proper PDF print button on the Court Cases page

### Out of Scope
- Stamp paper denomination selection (Rs. 50, 100, 500 etc.)
- Digital stamp paper integration
- Stamp paper print in Court Cases (court docs are on plain pages)

---

## User Stories

| ID | Story | Priority |
|----|-------|----------|
| S01-01 | [Document Edit Mode — Drafting Pages](../stories/S01-01-document-edit-mode.md) | P1 |
| S01-02 | [Stamp Paper Print](../stories/S01-02-stamp-paper-print.md) | P1 |
| S01-03 | [Court Cases Edit & PDF Print](../stories/S01-03-court-cases-edit.md) | P2 |

---

## Technical Context

### Affected Files
- `src/components/documents/DocumentPreview.tsx` — stamp paper print logic added here
- `src/app/(dashboard)/court-cases/page.tsx` — edit mode improved here
- A new `mode` parameter in the print-HTML generation function `buildPrintableHtml()`

### Stamp Paper Logic
```
Standard PDF:    margin-top = 25mm (normal)
Stamp Paper:
  Page 1:        margin-top = 4.5 inches (114.3mm) — for the stamp header
  Page 2+:       margin-top = configurable (default = 25mm / 1 inch)
```

### CSS @page Rule for Stamp Paper
```css
@page :first { margin-top: 114.3mm; }   /* 4.5 inches */
@page       { margin-top: 25mm; }        /* subsequent pages */
```

---

## Acceptance Criteria (Epic Level)

- [x] The "Stamp Paper Print" button is clearly visible on drafting pages
- [x] In stamp paper print, the top 4.5" of the first page stays empty
- [x] The advocate can change the top margin (via text input)
- [x] When a 2-page document is printed, page 2's top margin is set separately
- [x] Court Cases edit mode is rich text (better than a plain textarea)
- [x] Court Cases PDF prints with proper formatting
- [x] No regression — existing PDF download/print continues to work

---

## Related Milestone

[M-002 — Document Editing & Print Features](../milestones/M-002-document-editing-print-features.md)
