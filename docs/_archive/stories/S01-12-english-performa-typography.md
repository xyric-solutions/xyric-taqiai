---
id: S01-12
epic: EPIC-01
title: English Performa — Standard Legal Typography
status: Done
priority: P0
created: 2026-05-04
updated: 2026-06-19
---

# S01-12 — English Performa Standard Legal Typography

## User Story

As a lawyer, I want English legal documents to follow standard Pakistani court-accepted legal formatting — so that printed documents look professional and are acceptable in courts, embassies, and government offices.

---

## Formatting Spec — Standard Pakistani Legal English Format

### Body Text

| Property | Value |
|----------|-------|
| Font | Times New Roman |
| Size | 13pt |
| Line height | 2.0 (double spacing — legal standard) |
| Color | #000 (black) |

### Heading (h1 — Document Title)

| Property | Value |
|----------|-------|
| Font | Times New Roman |
| Size | 16pt |
| Style | Bold, centered, underlined |
| Case | Title Case or ALL CAPS |

### Page Margins

| Side | Value |
|------|-------|
| Top | 25mm |
| Bottom | 25mm |
| Left | 30mm (extra for binding/stapling) |
| Right | 20mm |

### Border

None — standard English legal documents do not have decorative borders.

### Bold Fields

Same rule as Urdu performa — these fields must always appear in **bold**:

| Field | Example |
|-------|---------|
| Name | **Muhammad Ali** |
| Father's Name | **Muhammad Akbar** |
| CNIC No. | **35201-1234567-9** |
| Address | **House No. 12, Street 3, Lahore** |

---

## CSS Changes — `buildPrintableHtml()` in `DocumentPreview.tsx`

Update the English CSS block (`isUrdu === false`):

```css
body {
  font-family: 'Times New Roman', serif;
  font-size: 13pt;
  line-height: 2.0;        /* was 1.8 — double spacing is legal standard */
  color: #000;
  margin: 25mm 20mm 25mm 30mm;  /* top right bottom left — extra left for binding */
}

h1 {
  font-family: 'Times New Roman', serif;
  font-size: 16pt;         /* was 18pt — standard legal heading */
  font-weight: bold;
  text-align: center;
  text-decoration: underline;
}
```

---

## Bold Fields Rule — All English Templates

In the `promptTemplate` string of every English template, add:

```
BOLD FIELDS RULE (ENGLISH):
- Wrap deponent/party Name in <strong> tags: <strong>[Name]</strong>
- Wrap Father's Name in <strong> tags: <strong>[Father Name]</strong>
- Wrap CNIC Number in <strong> tags: <strong>[CNIC]</strong>
- Wrap Address in <strong> tags: <strong>[Address]</strong>
Example: I, <strong>Muhammad Ali</strong> S/o <strong>Muhammad Akbar</strong> CNIC <strong>35201-1234567-9</strong>
```

---

## Acceptance Criteria

- [ ] English documents print with Times New Roman 13pt, double spacing
- [ ] Heading is 16pt bold centered underlined
- [ ] Left margin is 30mm (binding side), right is 20mm
- [ ] Name appears in bold in English document outputs
- [ ] Father's Name appears in bold
- [ ] CNIC No. appears in bold
- [ ] Address appears in bold
- [ ] No border on English documents
- [ ] Urdu documents unaffected

---

## Definition of Done

- [ ] CSS updated in DocumentPreview.tsx (English block only)
- [ ] Bold rule added to at least 5 English templates
- [ ] All remaining English templates updated
- [ ] Print output verified
- [ ] Abdullah sign-off
