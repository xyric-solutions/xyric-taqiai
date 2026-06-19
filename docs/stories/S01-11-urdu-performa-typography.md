---
id: S01-11
epic: EPIC-01
title: Urdu Performa — Typography, Border & Bold Fields
status: Done
priority: P0
created: 2026-05-04
updated: 2026-06-19
---

# S01-11 — Urdu Performa Typography, Border & Bold Fields

## User Story

As a lawyer, I want Urdu legal documents to have proper professional typography — Bombay Black heading font, Noori Nastaliq body font, side border decoration, and key fields (Name, Father Name, CNIC, Address) in bold — so that the printed document looks formal and court-ready.

> **Scope:** Urdu performa only. English performa formatting will be specified separately.

---

## Current State (Existing Format to Keep)

The current `buildPrintableHtml()` in `DocumentPreview.tsx` uses:

| Element | Current Value |
|---------|--------------|
| Body font | `Noto Nastaliq Urdu` (Google Fonts) |
| Body size | `16pt` |
| Line height | `2.8` |
| Heading (h1) size | `22pt` |
| Heading style | Bold + underline + centered |
| Page margin | `25mm top/bottom, 20mm left/right` |
| Border | None |

> **Rule:** Do NOT change the existing body text size (16pt) or heading format unless specifically stated below. Keep all existing format intact — only ADD the new specs below.

---

## New Formatting Requirements (Urdu Performa)

### 1. Side Border

Add a decorative vertical border on both sides of the document — gives a formal, professional court document look.

**Spec:**
```css
body {
  border-left: 3px solid #000;
  border-right: 3px solid #000;
  padding-left: 15mm;
  padding-right: 15mm;
}
```

OR a double-line border for more traditional look:
```css
body {
  border-left: 4px double #000;
  border-right: 4px double #000;
}
```

> **Decision needed:** Single line (3px solid) or double line border? Default to double line unless specified.

---

### 2. Heading Typography (New Drafts)

When a new document is drafted (AI generates output), the **main heading** must use:

| Property | Value |
|----------|-------|
| Font | **Bombay Black** |
| Size | **30pt** |
| Style | Bold, centered |
| Applies to | Document title / main heading (h1) |

> **Font Availability Note:** "Bombay Black" is a commercial Urdu/display font — it is NOT available on Google Fonts. Implementation options:
> 1. Self-host the font file (user must provide .ttf / .woff2 file)
> 2. Use `@font-face` in the print CSS to load it locally
> 3. Fallback chain: `'Bombay Black', 'Noto Nastaliq Urdu', serif`
>
> **Action Required:** Confirm if the font file will be provided, or if a closest-match alternative should be used (e.g. a bold heavy Nastaliq variant).

---

### 3. Body Text Typography (New Drafts)

The document body (paragraphs, clauses, numbered lists) must use:

| Property | Value |
|----------|-------|
| Font | **Noori Nastaliq** |
| Size | **19pt** |
| Line height | 2.8 (keep existing) |
| Direction | RTL (keep existing) |
| Applies to | All body paragraphs, clauses, lists |

> **Font Availability Note:** "Noori Nastaliq" (also called "Jameel Noori Nastaleeq") is a widely used Pakistani Urdu font. It is NOT on Google Fonts but is commonly installed on Windows. Implementation options:
> 1. Add to font fallback chain: `'Noori Nastaliq', 'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif`
> 2. Self-host the font file for consistent cross-device rendering
> 3. For web preview: use Noto Nastaliq Urdu; for print: use Noori Nastaliq via @font-face

---

### 4. Bold Fields — All Urdu Performas

The following fields must always appear in **bold** in the generated document output:

| Field | Example in Document |
|-------|-------------------|
| **Name** (Naam) | **محمد علی** |
| **Father's Name** (Walid ka Naam) | **محمد اکبر** |
| **CNIC No.** (Shanakhti Card No.) | **35201-1234567-9** |
| **Address** (Pata) | **مکان نمبر 12، گلی نمبر 3، لاہور** |

**How to implement:**

In the AI prompt template (`promptTemplate`) for all Urdu affidavits and performas, add this instruction:

```
BOLD FIELDS RULE:
- Wrap deponent/party Name in <strong> tags
- Wrap Father's Name in <strong> tags
- Wrap CNIC Number in <strong> tags
- Wrap Address in <strong> tags
Example: I, <strong>محمد علی</strong> S/o <strong>محمد اکبر</strong> CNIC <strong>35201-1234567-9</strong>
```

This applies to **all Urdu performas** — affidavits, agreements, power of attorney, applications, family law documents.

---

## Affected Templates (All Urdu Performas)

Based on review of existing templates — all of these have Name, Father Name, CNIC, Address fields and must follow the bold rule:

| Template File | Has Name | Has Father Name | Has CNIC | Has Address |
|---------------|----------|----------------|----------|-------------|
| `affidavits/domicile.ts` | ✅ deponentName | ✅ fatherName | ✅ cnic | ✅ address |
| `affidavits/noc.ts` | ✅ issuerName | ✅ issuerFatherName | ✅ issuerCnic | ✅ issuerAddress |
| `affidavits/support-affidavit.ts` | ✅ sponsorName | ✅ sponsorFatherName | ✅ sponsorCnic | ✅ (implicit) |
| `affidavits/declaration.ts` | ✅ | ✅ | ✅ | ✅ |
| `affidavits/indemnity-bond.ts` | ✅ | ✅ | ✅ | ✅ |
| `affidavits/surety-bond.ts` | ✅ | ✅ | ✅ | ✅ |
| `affidavits/heirship.ts` | ✅ | ✅ | ✅ | ✅ |
| `agreements/rent-agreement.ts` | ✅ | ✅ | ✅ | ✅ |
| `agreements/sale-deed.ts` | ✅ | ✅ | ✅ | ✅ |
| `power-of-attorney/general.ts` | ✅ | ✅ | ✅ | ✅ |
| `family-law/divorce-deed.ts` | ✅ | ✅ | ✅ | ✅ |
| *(all other affidavits/agreements)* | ✅ | ✅ | ✅ | ✅ |

> All templates with Urdu output must apply the bold rule to Name, Father Name, CNIC, Address.

---

## Print CSS Changes — `buildPrintableHtml()` in `DocumentPreview.tsx`

The Urdu print CSS block (`isUrdu === true`) must be updated:

```css
/* CURRENT (keep these values) */
body {
  font-family: 'Noori Nastaliq', 'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif;
  font-size: 19pt;           /* CHANGED from 16pt to 19pt */
  line-height: 2.8;
  direction: rtl;
}

h1 {
  font-family: 'Bombay Black', 'Noto Nastaliq Urdu', serif;
  font-size: 30pt;           /* CHANGED from 22pt to 30pt */
  font-weight: bold;
  text-align: center;
  text-decoration: underline;
}

/* NEW — Side Border */
body {
  border-left: 4px double #000;
  border-right: 4px double #000;
  padding-left: 15mm;
  padding-right: 15mm;
}
```

---

## Acceptance Criteria

- [ ] All new Urdu documents have a double-line border on both sides when printed
- [ ] Main heading (h1) in Urdu documents uses Bombay Black font at 30pt
- [ ] Body text in Urdu documents uses Noori Nastaliq at 19pt
- [ ] Name appears in **bold** in all Urdu document outputs
- [ ] Father's Name appears in **bold** in all Urdu document outputs
- [ ] CNIC No. appears in **bold** in all Urdu document outputs
- [ ] Address appears in **bold** in all Urdu document outputs
- [ ] Font fallback works if Bombay Black / Noori Nastaliq not available on device
- [ ] Existing document structure (margins, RTL direction, numbering) is unchanged
- [ ] English documents are NOT affected by these changes

---

## Open Questions

| # | Question | Status |
|---|----------|--------|
| 1 | Will Bombay Black font file (.ttf) be provided for self-hosting? | ❓ Pending |
| 2 | Single line or double line side border? | ❓ Pending (default: double) |
| 3 | Should side border appear in screen preview too, or only in print? | ❓ Pending |
| 4 | Noori Nastaliq — self-host or rely on Windows system font? | ❓ Pending |

---

## Definition of Done

- [ ] Side border visible on printed Urdu documents
- [ ] Bombay Black 30pt heading confirmed (or approved fallback font confirmed)
- [ ] Noori Nastaliq 19pt body confirmed (or approved fallback confirmed)
- [ ] Bold fields (Name, Father Name, CNIC, Address) verified in 3+ templates
- [ ] English documents unchanged
- [ ] Abdullah sign-off
