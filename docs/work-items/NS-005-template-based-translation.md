---
id: NS-005
title: Implement Template-Based Legal Document Translation
story_ids: [S07-01]
status: completed
priority: P0
created: 2026-05-04
---

# NS-005 — Implement Template-Based Legal Document Translation

## Objective

Change the translation page to use fixed pre-approved English templates for specific document types (Nikah Nama, Sale Deed, CNIC, Birth Certificate — Phase 1). AI only extracts variable data and fills placeholders — it does NOT rewrite wording or modify tables.

**Extensibility:** Architecture must allow adding new document types easily — only 2 steps: (1) create new template file, (2) register in `index.ts`. No other code changes needed when adding templates.

---

## Pre-requisite (BLOCKER)

**Nuoman must provide the physical English translation templates from "english data" folder before implementation can start.**

Phase 1 templates needed (from "english data" folder):
- [ ] Nikah Nama English translation (exact wording + table structure)
- [ ] Sale Deed English translation (exact wording + table structure)
- [ ] CNIC English translation (exact format)
- [ ] Birth Certificate English translation (exact wording + table structure)
- [ ] Any additional templates Nuoman provides (add to same folder)

Once provided, code them exactly as-is into TypeScript template files in `src/templates/translations/`.

**For each new template added later:** same process — provide physical document → code into `[type]-translation.ts` → register in `index.ts`.

---

## Step 1 — Create Translation Template Files

### File: `src/templates/translations/nikah-nama-translation.ts`

```ts
export const nikahNamaTranslationTemplate = {
  id: "nikah-nama-translation",
  title: "Nikah Nama Translation",
  
  // Placeholders that AI will fill
  variables: [
    "HUSBAND_NAME",
    "HUSBAND_FATHER_NAME", 
    "HUSBAND_CNIC",
    "HUSBAND_ADDRESS",
    "WIFE_NAME",
    "WIFE_FATHER_NAME",
    "WIFE_CNIC",
    "WIFE_ADDRESS",
    "MARRIAGE_DATE",
    "HAQ_MEHR",
    "WITNESS_1_NAME",
    "WITNESS_2_NAME",
    "NIKAH_REGISTRAR",
  ],
  
  // AI prompt to extract these from source document
  extractionPrompt: `Extract the following from this Nikah Nama document:
- Husband's Name (Dulha ka Naam)
- Husband's Father's Name
- Husband's CNIC
- Husband's Address
- Wife's Name (Dulhan ka Naam)
- Wife's Father's Name
- Wife's CNIC
- Wife's Address
- Date of Marriage (Taareekh-e-Nikah)
- Haq Mehr Amount
- Witness 1 Name (Gawah 1)
- Witness 2 Name (Gawah 2)
- Nikah Registrar Name

Return as JSON with keys: HUSBAND_NAME, HUSBAND_FATHER_NAME, HUSBAND_CNIC, HUSBAND_ADDRESS, WIFE_NAME, WIFE_FATHER_NAME, WIFE_CNIC, WIFE_ADDRESS, MARRIAGE_DATE, HAQ_MEHR, WITNESS_1_NAME, WITNESS_2_NAME, NIKAH_REGISTRAR`,

  // Fixed English template (to be filled with actual template from Nuoman)
  template: `[PASTE EXACT TEMPLATE HERE — DO NOT MODIFY]`,
};
```

> Create same structure for `sale-deed-translation.ts`, `cnic-translation.ts`, `birth-certificate-translation.ts`.

Also create `src/templates/translations/index.ts` — this is the central registry:

```ts
// index.ts — Add new templates here as they are provided
import { nikahNamaTranslationTemplate } from "./nikah-nama-translation";
import { saleDeedTranslationTemplate } from "./sale-deed-translation";
import { cnicTranslationTemplate } from "./cnic-translation";
import { birthCertificateTranslationTemplate } from "./birth-certificate-translation";
// import { [newTemplate] } from "./[new-document]-translation";  ← add here

export const TEMPLATE_MAP: Record<string, TranslationTemplate> = {
  "nikah-nama-translation":        { ...nikahNamaTranslationTemplate,        label: "Nikah Nama (Marriage Certificate)" },
  "sale-deed-translation":         { ...saleDeedTranslationTemplate,         label: "Sale Deed" },
  "cnic-translation":              { ...cnicTranslationTemplate,              label: "CNIC" },
  "birth-certificate-translation": { ...birthCertificateTranslationTemplate, label: "Birth Certificate" },
  // "[new-type]": { ...[newTemplate], label: "[Display Name]" },  ← add here
};
```

**Adding a new document type in future = only edit this file + add the template file. Nothing else changes.**

---

## Step 2 — Update `translate/route.ts`

Add template-aware logic:

```ts
// At top of POST handler
const docType = formData.get("docType") as string | null;

// If docType is a known template type, use template filling
if (docType && TEMPLATE_MAP[docType]) {
  const template = TEMPLATE_MAP[docType];
  
  // Step A: Extract variables from source text
  const extractionPrompt = `${template.extractionPrompt}\n\nSOURCE:\n${text}`;
  const extractedJson = await geminiGenerate(extractionPrompt);
  const variables = JSON.parse(extractedJson);
  
  // Step B: Fill template with variables
  let filledTemplate = template.template;
  for (const [key, value] of Object.entries(variables)) {
    filledTemplate = filledTemplate.replaceAll(`[${key}]`, value as string || "[NOT PROVIDED]");
  }
  
  return NextResponse.json({ translation: filledTemplate, isTemplate: true });
}

// Otherwise, fall through to existing free-form translation
```

---

## Step 3 — Update `translate/page.tsx`

### Add document type selector

```tsx
const [docType, setDocType] = useState<string>("general");

<select value={docType} onChange={(e) => setDocType(e.target.value)}>
  <option value="nikah-nama-translation">Nikah Nama (Marriage Certificate)</option>
  <option value="sale-deed-translation">Sale Deed</option>
  <option value="cnic-translation">CNIC</option>
  <option value="birth-certificate-translation">Birth Certificate</option>
  <option value="general">General Translation</option>
</select>
```

### Pass docType in form submission

```ts
formData.append("docType", docType);
```

### Render HTML output for template results

```tsx
{isTemplate ? (
  <div 
    className="translation-output"
    dangerouslySetInnerHTML={{ __html: translationResult }}
  />
) : (
  <pre className="whitespace-pre-wrap">{translationResult}</pre>
)}
```

---

## Step 4 — Print CSS

In the print function for translation page, add:

```css
.translation-output {
  font-family: 'Times New Roman', serif;
  font-size: 13pt;
  line-height: 1.8;
  color: #000;
}
.translation-output h1 {
  font-size: 18pt;
  font-weight: bold;
  text-align: center;
  text-decoration: underline;
}
.translation-output table {
  width: 100%;
  border-collapse: collapse;
}
.translation-output td,
.translation-output th {
  border: 1px solid #000;
  padding: 6px 10px;
}
```

---

## Files to Modify/Create

```
src/app/(dashboard)/translate/page.tsx          — Add docType selector, HTML render
src/app/api/ai/translate/route.ts               — Add template-filling logic
src/templates/translations/nikah-nama-translation.ts     — NEW
src/templates/translations/sale-deed-translation.ts      — NEW
src/templates/translations/cnic-translation.ts           — NEW
src/templates/translations/birth-certificate-translation.ts — NEW
```

---

## Testing Checklist

- [ ] Nikah Nama: paste Urdu nikah nama text → verify English output matches template exactly (only names/dates changed)
- [ ] Sale Deed: paste Urdu sale deed → verify tables intact, wording unchanged
- [ ] CNIC: paste CNIC details → verify translation matches template format
- [ ] Birth Certificate: paste birth cert → verify output matches template
- [ ] General Translation: still works as before
- [ ] Print: tables visible, Times New Roman font, proper layout
- [ ] Name/CNIC preserved as-is (not translated/modified)
- [ ] Missing field shows "[NOT PROVIDED]" not blank or error

## Definition of Done

- [ ] All 4 templates coded from Nuoman's physical documents (exact match)
- [ ] Template selection UI working
- [ ] Output renders with tables and proper formatting
- [ ] Print output correct
- [ ] General translation unaffected
- [ ] Abdullah sign-off
