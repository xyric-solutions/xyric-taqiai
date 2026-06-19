---
id: NS-006
title: Implement English Performa Standard Legal Typography
story_ids: [S01-12]
status: completed
priority: P0
created: 2026-05-04
---

# NS-006 — Implement English Performa Standard Legal Typography

## Objective

Apply standard Pakistani legal English formatting to all English document output:
- Times New Roman 13pt, double spacing (2.0)
- Heading 16pt bold centered underlined
- Left margin 30mm (binding), right 20mm
- Bold: Name, Father Name, CNIC, Address in all English templates
- No border

---

## Part A — CSS Update (`DocumentPreview.tsx`)

### File: `src/components/documents/DocumentPreview.tsx`
### Function: `buildPrintableHtml()`

Find the English CSS block (`isUrdu ? "..." : "..."`) and update the `false` (English) side:

```css
/* English body */
font-family: 'Times New Roman', serif
font-size: 13pt
line-height: 2.0          /* was 1.8 */

/* English h1 */
font-family: 'Times New Roman', serif
font-size: 16pt           /* was 18pt */
font-weight: bold
text-align: center
text-decoration: underline

/* Page margins */
margin: 25mm 20mm 25mm 30mm   /* extra left for binding */
```

---

## Part B — Bold Fields in All English Templates

### Files: All template `.ts` files in `src/templates/`

In the `promptTemplate` string of every English template, add to the INSTRUCTIONS section:

```
BOLD FIELDS RULE (ENGLISH ONLY):
- Wrap deponent/party Name in <strong> tags: <strong>[Name]</strong>
- Wrap Father's Name in <strong> tags: <strong>[Father Name]</strong>
- Wrap CNIC Number in <strong> tags: <strong>[CNIC]</strong>
- Wrap Address in <strong> tags: <strong>[Address]</strong>
```

### Templates to update (all English-capable templates):
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
- *(all remaining templates)*

---

## Testing Checklist

- [ ] Generate a Domicile Affidavit in English → check double spacing
- [ ] Check heading is 16pt bold centered underlined
- [ ] Check left margin is wider than right (binding space visible)
- [ ] Check Name is bold in output
- [ ] Check Father Name is bold in output
- [ ] Check CNIC is bold in output
- [ ] Check Address is bold in output
- [ ] Generate same document in Urdu → unaffected (no double spacing, no Times New Roman)
- [ ] Print the document → formatting matches legal standard

## Definition of Done

- [ ] CSS updated in DocumentPreview.tsx (English block only)
- [ ] At least 5 template prompt instructions updated with bold rule
- [ ] All remaining templates updated
- [ ] Print output verified
- [ ] Urdu documents unaffected
- [ ] Abdullah sign-off
