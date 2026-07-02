---
id: S01-10
epic: EPIC-01
title: Stamp Paper Print (Adjustable Top Margin)
status: Done
priority: P0
created: 2026-05-04
updated: 2026-06-19
---

# S01-10 — Stamp Paper Print

## User Story

As a lawyer, I want to print documents on stamp paper with a manually adjustable top margin (default 4.5 inches), so that the document content starts below the pre-printed stamp paper header — without adjusting printer settings every time.

---

## Background

In Pakistani courts, affidavits, agreements, power of attorney, and similar documents are printed on **stamp paper**. Stamp paper has pre-printed text and a revenue stamp at the top. To accommodate this, the document content must start **4.5 inches** from the top of the page by default.

Currently, only standard PDF print is available (25mm top margin). The advocate has to manually adjust printer margins every time, which is error-prone and inconsistent.

**The advocate must also be able to manually change the top margin value** — for example, change 4.5" to 3.2" if their stamp paper requires less space. Both Page 1 and Page 2 margins must be independently editable.

---

## Print Margin Specifications

| Page | Default Top Margin | Manually Editable? | Notes |
|------|-------------------|-------------------|-------|
| **Page 1** | **4.5 inches** | ✅ Yes — type any value (e.g. 3.2, 5.0) | Space for pre-printed stamp paper header |
| **Page 2+** | **1.0 inch** | ✅ Yes — type any value (e.g. 0.5, 1.5) | Normal document continuation margin |
| Left / Right | 20mm | ❌ Fixed | Standard court document margin |
| Bottom | 20mm | ❌ Fixed | Standard court document margin |

> **Why separate Page 1 and Page 2 margins?**
> Stamp paper header only appears on the first page. Page 2 (if the document runs long) is a plain continuation sheet with a normal margin. If the advocate changes their stamp paper brand or size, both values must be adjustable independently.

---

## Stamp Paper Print Settings Panel (UI)

When the advocate clicks **"Stamp Paper Print"**, a settings panel opens:

```
┌──────────────────────────────────────────────────────┐
│  🖨️  Stamp Paper Print Settings                       │
├──────────────────────────────────────────────────────┤
│                                                      │
│  Page 1 — Top Margin (inches)                        │
│  ┌─────────┐                                         │
│  │   4.5   │  ← editable, type any value e.g. 3.2   │
│  └─────────┘                                         │
│  Space left for pre-printed stamp paper header       │
│                                                      │
│  Page 2+ — Top Margin (inches)                       │
│  ┌─────────┐                                         │
│  │   1.0   │  ← editable, type any value e.g. 0.5   │
│  └─────────┘                                         │
│  Margin for continuation pages (plain sheet)         │
│                                                      │
│  ┌─────────────────────┐  ┌──────────┐              │
│  │  🖨️  Print Now       │  │  Cancel  │              │
│  └─────────────────────┘  └──────────┘              │
└──────────────────────────────────────────────────────┘
```

---

## User Flow

```
1. Advocate generates document (form → AI draft)
2. Optionally edits the document (Manual Edit or AI Edit)
3. Clicks "Stamp Paper Print" button
4. Settings panel opens with defaults: Page 1 = 4.5", Page 2 = 1.0"
5. Advocate reviews — if their stamp paper needs different margin:
   → Changes Page 1 to e.g. "3.2" or "5.0"
   → Changes Page 2 to e.g. "0.5" or "1.5"
6. Clicks "Print Now"
7. Browser print dialog opens
8. Advocate loads stamp paper in printer tray
9. Prints — content starts below the stamp header on Page 1
10. If document is 2 pages: Page 2 prints with the configured Page 2 margin
```

---

## Applicable Document Types

| Category | Stamp Paper Print? |
|----------|--------------------|
| Affidavits | ✅ Yes |
| Agreements | ✅ Yes |
| Power of Attorney | ✅ Yes |
| Family Law Documents | ✅ Yes |
| Applications | ✅ Yes |
| Court Cases (petitions, bail etc.) | ❌ No — plain A4 only |

---

## Acceptance Criteria

- [ ] `DocumentPreview` component has a "Stamp Paper Print" button (next to existing Print button)
- [ ] Clicking the button opens a settings panel
- [ ] Settings panel shows two editable number inputs:
  - Page 1 top margin: default `4.5` (user can type any decimal, e.g. `3.2`, `5.0`)
  - Page 2+ top margin: default `1.0` (user can type any decimal, e.g. `0.5`, `1.5`)
- [ ] Labels clearly explain what each margin is for
- [ ] "Print Now" opens browser print dialog
- [ ] Printed output: Page 1 content starts at the configured top margin
- [ ] Printed output: Page 2 (if present) uses its own configured top margin
- [ ] If advocate types `3.2`, Page 1 top is 3.2 inches (not 4.5)
- [ ] Both English and Urdu (RTL) documents print correctly in stamp paper mode
- [ ] "Cancel" closes the panel without printing or changing anything
- [ ] Existing "Print" and "Download PDF" buttons are unaffected (no regression)
- [ ] Input validation: non-numeric or zero/negative values show an error or are ignored

---

## Technical Notes

```
File to modify: src/components/documents/DocumentPreview.tsx

State to add:
  stampPrintOpen: boolean
  stampPage1Top: string  (default "4.5")
  stampPage2Top: string  (default "1.0")

Conversion: inches → mm = value × 25.4
  4.5" = 114.3mm
  1.0" = 25.4mm
  3.2" = 81.28mm  (example of manual override)

CSS for stamp print HTML:
  @page :first { margin-top: {page1mm}mm; margin: {page1mm}mm 20mm 20mm 20mm; }
  @page        { margin-top: {page2mm}mm; margin: {page2mm}mm 20mm 20mm 20mm; }

Print method: window.open() → write HTML → window.print() on load → window.close() on afterprint
```

---

## Definition of Done

- [ ] "Stamp Paper Print" button visible in DocumentPreview on all drafting pages
- [ ] Settings panel shows with correct defaults (4.5" and 1.0")
- [ ] Manually entering 3.2 changes Page 1 margin to 3.2 inches on print
- [ ] Page 2 margin change verified with a 2-page document
- [ ] Urdu document stamp print tested
- [ ] No regression on existing Print / Download PDF
- [ ] Abdullah sign-off
