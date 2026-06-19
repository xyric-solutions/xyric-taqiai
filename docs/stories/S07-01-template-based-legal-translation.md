---
id: S07-01
epic: EPIC-07
title: Template-Based Legal Document Translation
status: Done
priority: P0
created: 2026-05-04
updated: 2026-06-19
---

# S07-01 — Template-Based Legal Document Translation

## User Story

As a lawyer, I want to translate Urdu legal documents (Nikah Nama, Sale Deed, CNIC, Birth Certificate) into professional English using pre-approved fixed templates — so that the translation is legally consistent every time, with only names/dates/CNIC numbers changing and the rest of the wording and tables staying exactly the same.

> **Translation Direction: Urdu → English ONLY**
> These translations are required for **embassy submissions** and official government processes where Pakistani Urdu documents must be presented in English. Reverse translation (English → Urdu) is NOT in scope for this feature.

---

## Background: Why Template-Based?

Nuoman has **physical English translation templates** (in the "english data" folder) that lawyers already use:

- **Nikah Nama English Translation** — fixed wording + tables for marriage certificate details
- **Sale Deed English Translation** — fixed wording + property detail tables
- **CNIC English Translation** — fixed format card translation
- **Birth Certificate English Translation** — fixed wording + birth detail fields

In these templates:
- The legal wording **never changes** — it is pre-approved and legally standard
- **Tables are already formatted** — nothing is added or removed
- **Only the variable fields change**: Name, Father's Name, CNIC, Date, Property Address, Property Value, Witness Names, etc.

> **Status note (2026-06-19):** This feature is BUILT and LIVE at route `/translate`. The implementation expanded beyond the original 4 templates to roughly 10 legal templates (Nikah Nama traditional/modern, Divorce Certificate, Sale Deed, ID Card, Birth Certificate, Fard, Mortgage Deed, Agriculture Land, Gift Deed) and supports three modes (free text, document image OCR + translate, structured legal template) across Urdu / English / Arabic.

---

## Original State (Before This Story — Now Superseded)

The original `/translate` page (at `src/app/(dashboard)/translate/page.tsx`) used **free-form AI translation only**:
- Advocate pasted any text OR uploaded a document image
- Gemini AI translated the full text freely
- Output displayed as plain `whitespace-pre-wrap` text
- Print CSS: `Times New Roman 13pt`

**Problem with that approach**: the AI generated different wording each time — no consistency, no guaranteed legal accuracy.

**Resolution (built):** The page now keeps free-text and document-image modes AND adds a structured legal-template mode, so advocates get consistent, pre-approved wording for known document types while retaining free-form for everything else.

---

## Required Change: Template-Aware Translation

### How it Should Work

1. Advocate selects document type from dropdown (all available templates shown — starts with 4, more added over time)
2. Advocate either:
   a. Types/pastes the Urdu source document text, OR
   b. Uploads an image of the document
3. AI extracts ONLY the variable fields from the source:
   - Name (Naam)
   - Father's Name / Husband's Name (Walid / Shauhar ka Naam)
   - CNIC Number
   - Date of Birth / Date of Marriage / Date of Transaction
   - Address / Property Address
   - Property Value / Consideration Amount
   - Witness Names
   - Any other variable data specific to document type
4. AI fills these extracted values into the **fixed English template**
5. Output displayed with exact same formatting as the template — tables, headings, wording all as-is

### What AI Must NOT Do

- Must NOT rewrite the fixed legal wording
- Must NOT change or remove tables
- Must NOT add extra sentences or clauses
- Must NOT translate the wording — wording is already in English in template
- Must ONLY fill in the variable placeholder fields

---

## Template Structure (per document type)

Each English translation template has:
- **Fixed legal header** (e.g. "TRANSLATION OF NIKAH NAMA")
- **Fixed wording paragraphs** — identical every time
- **Tables** — with fixed column headers, rows pre-defined
- **Variable placeholder fields** — e.g. `[NAME]`, `[FATHER NAME]`, `[CNIC]`, `[DATE]`
- **Fixed legal footer / attestation clause**

Templates will be stored as TypeScript template files in:
```
src/templates/translations/
  nikah-nama-translation.ts        ← Phase 1
  sale-deed-translation.ts         ← Phase 1
  cnic-translation.ts              ← Phase 1
  birth-certificate-translation.ts ← Phase 1
  [more-document-type].ts          ← Add as needed
  index.ts                         ← TEMPLATE_MAP exports all templates
```

**Extensibility Rule:** Adding a new translation template must require ONLY two steps:
1. Create new `[document-type]-translation.ts` file with the template
2. Register it in `index.ts` TEMPLATE_MAP with its display label

No other files should need changes when adding a new template.

> **Action Required (Pre-implementation):** Nuoman to provide the actual English template documents from "english data" folder so they can be coded into TypeScript template files. These templates must be copied exactly — no paraphrasing.
>
> **Phase 2+:** More templates will be added as Nuoman provides them. The system is designed to accommodate any number of document types.

---

## AI Prompt Approach (Per Template)

The prompt structure for template filling:

```
You are a legal translation assistant.

TASK: Extract variable data from the source Urdu document and fill the placeholders in the English translation template below.

RULES:
1. DO NOT change any fixed wording in the template
2. DO NOT modify table structure
3. ONLY replace the [PLACEHOLDER] fields with extracted data
4. Keep names, CNICs, dates exactly as they appear in source (do not translate names)
5. If a field is not found in source, leave it as [NOT PROVIDED]

TEMPLATE:
[fixed English template with placeholders]

SOURCE DOCUMENT:
[Urdu source text or extracted image text]

OUTPUT: Return only the filled template. No explanations. No extra text.
```

---

## UI Changes Required

### 1. Document Type Selector

Before translation starts, add a **document type dropdown**:

```
Select Document Type:
[ Nikah Nama (Marriage Certificate)  ▼ ]
[ Sale Deed                            ]
[ CNIC                                 ]
[ Birth Certificate                    ]
[ General Translation (free-form)     ]
```

"General Translation" option keeps the existing free-form behavior for documents without templates.

### 2. Output Display

Template-based output must render:
- **HTML tables** (not plain text) — same tables as in the template
- **Proper heading** (Times New Roman 18pt bold, centered)
- **Body text** (Times New Roman 13pt, 1.8 line height)
- No RTL needed (English output)

### 3. Manual Edit Mode

After translation output is generated, advocate must be able to **manually edit** the content — to fix any AI errors, adjust wording, or correct extracted data.

**How:**
- Output div becomes `contentEditable` when Edit button is clicked
- Same pattern as `DocumentPreview.tsx` manual edit
- "Edit" button toggles edit mode on/off
- While in edit mode: border highlight shows editable area
- Changes save in-place (no API call needed for manual edits)

```
[ Translate ] → output shown → [ ✏️ Edit ] [ 🖨️ Print ] [ 📄 Stamp Paper Print ]
                                     ↓
                              contentEditable div
                              (advocate edits directly)
```

### 4. Stamp Paper Print

Some translated documents (Sale Deed, Nikah Nama) are also printed on stamp paper. Advocate must be able to adjust page margins before printing.

**Button:** "Stamp Paper Print" — same panel as S01-10 (DocumentPreview stamp paper feature)

**Settings panel:**
- Page 1 top margin: default **4.5 inches** — manually editable (type any value e.g. 3.2, 5.0)
- Page 2+ top margin: default **1.0 inch** — manually editable
- Both values independently adjustable

**How it works:** Same `@page :first` / `@page` CSS logic as S01-10 — inches converted to mm (`value × 25.4`), applied in print window.

> **Reference:** Stamp paper print logic is already documented in [S01-10](./S01-10-stamp-paper-print.md) and [NS-002](../work-items/NS-002-implement-stamp-paper-print.md). Translation page must reuse the same approach.

### 5. Standard Print Output

Print CSS for English translation output:
```css
body {
  font-family: 'Times New Roman', serif;
  font-size: 13pt;
  line-height: 1.8;
  margin: 25mm;
  color: #000;
}
h1 {
  font-size: 18pt;
  font-weight: bold;
  text-align: center;
  text-decoration: underline;
}
table {
  width: 100%;
  border-collapse: collapse;
}
td, th {
  border: 1px solid #000;
  padding: 6px 10px;
}
```

---

## Affected Files

| File | Change |
|------|--------|
| `src/app/(dashboard)/translate/page.tsx` | Add document type selector, update output rendering |
| `src/app/api/ai/translate/route.ts` | Free-text / image translation endpoint |
| `src/app/api/ai/translate-template/route.ts` | Structured legal-template translation endpoint |
| `src/app/api/ai/translate-edit/route.ts` | AI inline edit of translation output |
| `src/templates/translations/*.ts` | English templates (~10 delivered, registered via `index.ts` TEMPLATE_MAP) |

---

## Acceptance Criteria

- [x] Document type dropdown visible on translate page
- [x] Nikah Nama template translation works: variable fields filled, tables intact, wording unchanged
- [x] Sale Deed template translation works
- [x] CNIC / ID Card template translation works
- [x] Birth Certificate template translation works
- [x] Additional templates delivered: Nikah Nama (modern), Divorce Certificate, Fard, Mortgage Deed, Agriculture Land, Gift Deed
- [x] General Translation option still works (fallback to existing free-form)
- [x] Edit button visible after translation output is shown
- [x] Clicking Edit makes output contentEditable — advocate can type and fix anything
- [x] Manual edits reflect immediately in the output
- [x] AI inline edit available on translation output (`/api/ai/translate-edit`)
- [x] Stamp Paper Print button visible after output is shown
- [x] Stamp paper settings panel opens with Page 1 (default 4.5") and Page 2+ (default 1.0") inputs
- [x] Advocate can type any value (e.g. 3.2, 5.0) and it applies correctly
- [x] Standard Print output shows proper tables and Times New Roman formatting
- [x] Names and CNICs preserved exactly as in source (not translated)
- [x] If a field not found, placeholder shows "[NOT PROVIDED]" not blank
- [x] Line-spacing control and print/PDF output working
- [x] Attestation reminder shown

---

## Open Questions

| # | Question | Status |
|---|----------|--------|
| 1 | Physical template documents — when will Nuoman provide them for coding? | ✅ Resolved — templates provided and coded |
| 2 | Are there more document types beyond the 4 listed? | ✅ Resolved — expanded to ~10 templates |
| 3 | Image upload mode — should it also use template filling or keep free-form? | ✅ Resolved — document image OCR + translate mode delivered |
| 4 | Should translated output be saveable to drafts/history? | ❓ Deferred |

---

## Definition of Done

- [x] All translation templates coded and working (~10 delivered, exceeding the original 4)
- [x] Template wording matches Nuoman's physical documents exactly
- [x] Manual edit mode working (contentEditable)
- [x] AI inline edit working (`/api/ai/translate-edit`)
- [x] Stamp paper print / line-spacing and print-PDF output working
- [x] Standard print output formatted with Times New Roman, tables preserved
- [x] No regression on existing general translation
- [ ] Abdullah sign-off
