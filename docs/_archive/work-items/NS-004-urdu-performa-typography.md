---
id: NS-004
title: Implement Urdu Performa Typography & Bold Fields
story_ids: [S01-11]
status: completed
priority: P0
created: 2026-05-04
---

# NS-004 — Implement Urdu Performa Typography & Bold Fields

## Objective

Update `DocumentPreview.tsx` Urdu print CSS and all Urdu template prompt instructions to apply:
1. Side border (double line)
2. Heading: Bombay Black 30pt
3. Body: Noori Nastaliq 19pt
4. Bold: Name, Father Name, CNIC, Address

---

## Part A — CSS Update (`DocumentPreview.tsx`)

### File: `src/components/documents/DocumentPreview.tsx`
### Function: `buildPrintableHtml()`

Find the Urdu CSS block (`isUrdu ? "..." : "..."`) and update:

```css
/* Urdu body — update font + size */
font-family: 'Noori Nastaliq', 'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif
font-size: 19pt          /* was 16pt */

/* Urdu h1 — update font + size */
font-family: 'Bombay Black', 'Noto Nastaliq Urdu', serif
font-size: 30pt          /* was 22pt */

/* NEW — Side border */
border-left: 4px double #000
border-right: 4px double #000
padding-left: 15mm
padding-right: 15mm
```

Also add Google Fonts + @font-face fallback in the `<head>`:
```html
<link href="https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu:wght@400;700&display=swap" rel="stylesheet">
<!-- Noori Nastaliq & Bombay Black are system/self-hosted fonts — add @font-face if files available -->
```

---

## Part B — Bold Fields in All Urdu Templates

### Files: All template `.ts` files in `src/templates/`

In the `promptTemplate` string of EVERY Urdu template, add this rule in the INSTRUCTIONS section:

```
BOLD FIELDS RULE (URDU ONLY):
- Wrap deponent/party Name in <strong> tags: <strong>[Name]</strong>
- Wrap Father's Name in <strong> tags: <strong>[Father Name]</strong>
- Wrap CNIC Number in <strong> tags: <strong>[CNIC]</strong>
- Wrap Address in <strong> tags: <strong>[Address]</strong>
```

### Templates to update (all Urdu-capable templates):
- `affidavits/domicile.ts`
- `affidavits/noc.ts`
- `affidavits/support-affidavit.ts`
- `affidavits/declaration.ts`
- `affidavits/indemnity-bond.ts`
- `affidavits/surety-bond.ts`
- `affidavits/heirship.ts`
- `affidavits/name-correction.ts`
- `affidavits/lost-document.ts`
- `affidavits/undertaking-affidavit.ts`
- `agreements/rent-agreement.ts`
- `agreements/sale-deed.ts`
- `agreements/gift-deed.ts`
- `agreements/partnership-deed.ts`
- `power-of-attorney/general.ts`
- `power-of-attorney/special-court.ts`
- `family-law/divorce-deed.ts`
- `family-law/marriage-deed.ts`
- `family-law/khula.ts`
- `family-law/maintenance.ts`
- `family-law/child-custody.ts`
- `applications/general-application.ts`
- `applications/police-station.ts`
- *(all remaining templates with name/father/cnic/address fields)*

---

## Pre-requisites / Confirmations Needed

Before implementing font changes, confirm:

- [ ] **Bombay Black font file available?** — If yes, path: `public/fonts/BombayBlack.ttf`
- [ ] **Noori Nastaliq font file available?** — If yes, path: `public/fonts/NooriNastaliq.ttf`
- [ ] If fonts NOT available: use fallback `'Noto Nastaliq Urdu'` (already loaded from Google Fonts)

---

## Testing Checklist

- [ ] Generate a Domicile Affidavit in Urdu → check heading font is Bombay Black 30pt
- [ ] Check body text is Noori Nastaliq 19pt
- [ ] Check Name is bold in output
- [ ] Check Father Name is bold in output
- [ ] Check CNIC is bold in output
- [ ] Check Address is bold in output
- [ ] Print the document → side border visible on left and right
- [ ] Print in stamp paper mode → border still visible, 4.5" top margin still works
- [ ] Generate same document in English → no border, no Bombay Black, no bold fields change

## Definition of Done

- [ ] CSS updated in DocumentPreview.tsx
- [ ] At least 5 template prompt instructions updated with bold rule
- [ ] All remaining templates updated
- [ ] Print output verified with all 4 bold fields
- [ ] Side border visible in print
- [ ] English documents unaffected
- [ ] Abdullah sign-off
