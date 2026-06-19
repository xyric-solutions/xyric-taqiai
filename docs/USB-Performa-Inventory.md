---
type: inventory
title: "TaqiAI - USB Performa Library Inventory"
status: Draft (initial filename-based analysis)
owner: Abdullah
last_updated: 2026-04-22
product: taqiai
kb_summary: "First-pass inventory of Abdullah's USB performa library — ~17,600 non-backup files across 3 Desktop folders. Used to seed the TaqiAI template library per Brainstorm Q6 Track 1 strategy."
---

# TaqiAI — USB Performa Library Inventory

**Source location:** `C:/Users/Nuoman/Desktop/New folder/`
**Analysis date:** 2026-04-22
**Author:** Abdullah + automated filename analysis
**Purpose:** Fulfills PRD Section 25.0.6 ("First Concrete Action — RIGHT NOW: Abdullah inventories USB performa drive")
**Follow-up:** Brainstorm Q6 Track 1 (USB Performa Library digitization)

---

## 1. Top-Level Folders

| Folder | Total Files | Notes |
|--------|------------|-------|
| **Abdullah Data Store** | 12,611 | Primarily `.inp` (InPage) + `.B01` (auto-backups) |
| **Adnan** | 13,096 | Mix of `.inp`, `.B01`, `.docx`, and scanned PDFs/images |
| **English Files** | 2,658 | Mostly `.docx` (English drafts) + some PDFs and InPage |
| **TOTAL** | **28,365** | Across all formats |

---

## 2. File-Type Breakdown

### By technical format

| Extension | Total Count | What it is | Readable as-is? |
|-----------|------------|-----------|-----------------|
| **`.inp`** | ~14,654 | **InPage native document** (Urdu word processor — dominant format in Pakistani legal practice) | ❌ No — proprietary binary format, needs InPage or converter |
| **`.B01`** | ~10,622 | **InPage auto-backup files** (previous-version snapshot, NOT corrupted) | ❌ Same as `.inp` — duplicate content |
| **`.docx`** | ~2,556 | Microsoft Word documents (English drafts) | ✅ Yes — text extractable |
| **`.doc`** | ~361 | Older Word format | ✅ Yes — text extractable |
| **`.pdf`** | ~32 | PDF documents/scans | ✅ Text or OCR |
| **`.INa*` / `.INb*` / `.INc*` etc.** | ~80 | InPage crash/swap files — recoverable session data | 🗑️ Deletable — no value |
| **`.jpeg/jpg/png`** | ~16 | Scanned document images | ✅ OCR needed |
| **`.xlsx`** | 5 | Excel spreadsheets | ✅ |
| **`.xps/.rtf/.cdr/.tmp`** | ~10 | Miscellaneous | Low priority |

### Net unique content estimate

| Category | Count |
|----------|-------|
| **Unique `.inp` (Urdu content)** | ~14,654 documents |
| **Unique `.docx` (English content)** | ~2,556 documents |
| **`.B01` backups** | Duplicate of originals (skip) |
| **Temp/crash files** | Deletable (skip) |
| **NET real documents to analyze** | **~17,000–18,000** |

---

## 3. Category Analysis (by Filename Keyword)

Filename-keyword matching across all non-backup files (17,627 total):

| Legal Document Category | Files | Notes |
|-------------------------|-------|-------|
| **Affidavit** (all types) | 5,053 | Largest category — English + Urdu combined |
| **Iqrar Nama** (اقرار نامہ — declaration deed) | 3,101 | Classic Urdu declaration deed; sub-types follow |
| **Application** | 1,351 | Court/general applications |
| **Karaya Nama** (کرایا نامہ — rent deed) | 1,202 | Rental agreements (house/shop/godown etc.) |
| **Girvi** (گروی — mortgage/pledge) | 1,084 | Mortgage deeds |
| **Shop-related** | 749 | Shop rent / sale / transfer |
| **Warasat** (وراثت — succession) | 646 | Inheritance documents |
| **Domicile** | 397 | Domicile affidavits/certificates |
| **Bike / Vehicle** | 379 | Vehicle transfers / lost docs |
| **Odhar** (ادھار — loan/credit) | 373 | Loan/credit deeds |
| **Deed** (general) | 358 | Generic deed documents |
| **Gumshudgi** (گمشدگی — lost item) | 300 | Lost document affidavits |
| **Halfi** (حلفی — oath) | 295 | Oath affidavits |
| **Witness** | 265 | Witness affidavits |
| **Sale Deed** | 168 | Sale documents |
| **NOC** (No Objection Certificate) | 163 | NOC affidavits |
| **Agreement** (generic) | 135 | Various agreements |
| **NDA** (Non-Disclosure) | 125 | Confidentiality agreements |
| **Rent** (general) | 120 | Rental contracts |
| **Gift Deed / Hiba** | 114 | Gift deeds (including Hiba) |
| **Fard** (فرد — land record abstract) | 91 | Land record copies |
| **Undertaking** | 78 | Undertakings/guarantees |
| **Plot** | 77 | Plot-related docs |
| **Declaration** | 61 | General declarations |
| **Muhaida** (agreement) | 47 | Agreement documents (includes Muhaida Bae) |
| **Succession certificate** | 31 | NADRA/court succession |
| **Cancellation** | 19 | Cancellation deeds |
| **Power of Attorney** | 19 | GPA + SPA (English folder) |
| **Halfi Nama** | 21 | Sworn declarations |
| **Gift (Wasiyat/Will)** | 8 | Will documents |
| **Partnership** | 11 | Partnership deeds |
| **Lease** | 13 | Lease agreements |
| **Iqrar Nama Bee** (sale agreement) | 13 | Specific sub-type |

**Notes on counts:**
- Keyword search on filenames only — actual content may reveal more sub-types
- Some documents likely fall into multiple categories (e.g., "Affidavit for Domicile" counted in both)
- POA count is low in filename matching because many are saved with person's name only; actual POA files will be more
- "Vakalatnama" and "Legal Notice" not found in filenames — these are Track 2 (court documents), to come separately from Abdullah

---

## 4. Sample Content — Verified

Three sample `.docx` files read end-to-end to confirm content is extractable:

### Sample 1 — "AFFIDAVIT COURT OF LAW.docx"

> *"I ____________________ S/o ____________________ having my office located at ____________________ being the Director/Authorized Representative of ____________________, have applied for issuance of circular for preventing trademark infringement, and do hereby solemnly swear that the ownership rights of the trademark is not subjudice before any Court of law in Pakistan. The issuer of the circular shall be free from any responsibility..."*
>
> *SIGN & SEAL*

**Pattern identified:** Trademark-ownership affidavit. Fields: deponent name, parent, office address, company name, trademark specifics.

### Sample 2 — "Agreement of non disclosure of Abdul Ahad.docx"

> *Agreement of Non-Disclosure (of Confidentiality)*
> *Preamble: This Confidentiality ("Agreement") is formed to regulate the relationship of Abdul Ahad Mazhar ("Employee") and Adil Rafiq ("Employee") of Global Communication, Lahore.*
> *Clause 1: For the purpose of this agreement, Terms of "Employer"...*

**Pattern identified:** NDA template. Fields: party names, company, confidentiality terms. Clausal structure.

### Sample 3 — "POWER OF ATTORNEY HASHER NOOR.docx"

> *POWER OF ATTORNEY*
> *I, HASHER NOOR having Passport No. JB9999132 hereby authorize Mr. HAFIZ MUHAMMAD NAVEED passport No. BB9671084 to submit my passport and visa application on my behalf at the Embassy of the GEORGIA, and collect my passport after the completion of visa...*

**Pattern identified:** Special POA for visa/passport submission. Fields: principal name + passport, attorney name + passport, embassy, purpose.

---

## 5. Urdu Content (InPage `.inp` files) — CANNOT BE READ DIRECTLY

**Limitation:** `.inp` files are proprietary to InPage software. No standard text-extraction tool (cat, grep, unzip) can read them. This applies to ~14,654 of the ~17,627 non-backup files.

**Options to unlock Urdu content:**

| Option | Effort | Output Quality | Recommendation |
|--------|--------|---------------|----------------|
| **A — Batch "Save As" via InPage** — open each .inp in InPage, save as Unicode/DOCX | High (manual per file) | Excellent | Use for ~100 key templates only |
| **B — InPage Batch Converter (third-party tool)** — some tools exist but quality varies | Medium | Variable | Evaluate on 5 samples first |
| **C — Scripted macro in InPage** — if InPage exposes a scripting interface for batch save | Medium | Excellent once working | Best for scale |
| **D — Print to PDF + OCR** — render .inp → PDF → OCR with Urdu language model | Medium | Good but OCR errors need review | Scalable backup |
| **E — Ask InPage vendor for export API** | Unknown | Unknown | Worth exploring |

**Recommended path for TaqiAI:**
1. **Phase 1 (now):** Read the 2,556 English `.docx` files — extract patterns, seed initial English template library (~20–30 canonical templates should emerge)
2. **Phase 2:** Abdullah manually saves 50 highest-frequency Urdu `.inp` files as `.docx` via InPage (~1 hour effort) — analyze those to seed Urdu template library
3. **Phase 3:** Evaluate batch-conversion approaches (B/C/D) for scaling to remaining ~14,000 files

---

## 6. Proposed Digitization Workflow

For each template identified, the output should be a JSON schema + bilingual content block:

```json
{
  "id": "affidavit-court-of-law",
  "category": "affidavit",
  "subType": "trademark-ownership-declaration",
  "name": "Trademark Ownership Affidavit (Court of Law)",
  "nameUrdu": "حلف نامہ ملکیت ٹریڈ مارک",
  "stampPaper": "Rs. 50 (standard affidavit stamp)",
  "sourceFile": "AFFIDAVIT COURT OF LAW.docx",
  "status": "Draft",
  "reviewer": "Abdullah",
  "formFields": [
    { "name": "deponentName", "label": "Deponent Name", "type": "text", "required": true },
    { "name": "deponentParent", "label": "S/o, D/o, W/o", "type": "text", "required": true },
    { "name": "officeAddress", "label": "Office Address", "type": "address", "required": true },
    { "name": "companyName", "label": "Company / Firm Name", "type": "text", "required": true },
    { "name": "trademarkName", "label": "Trademark Name", "type": "text", "required": true }
  ],
  "englishTemplate": "I {{deponentName}} S/o {{deponentParent}} having my office located at {{officeAddress}} being the Director/Authorized Representative of {{companyName}}, have applied for issuance of circular for preventing trademark infringement of {{trademarkName}}, and do hereby solemnly swear...",
  "urduTemplate": "[TO BE ADDED — after Urdu source analyzed]",
  "inpageCompatible": true
}
```

---

## 7. Immediate Next Actions (Abdullah-owned)

Per PRD Section 25.0.6 and Brainstorm Q6 Track 1:

| # | Action | Owner | Deadline | Status |
|---|--------|-------|---------|--------|
| 1 | Inventory USB performa drive (filename + type breakdown) | Abdullah (this document) | Week 1 | **✅ Done (2026-04-22)** |
| 2 | Tag top 30 highest-frequency English `.docx` templates for first digitization batch | Abdullah | Week 1 | Pending |
| 3 | Extract text + fields from those 30 files using automated docx parsing | Engineering | Week 1 | Pending |
| 4 | Open 20 highest-frequency Urdu `.inp` files in InPage → Save As DOCX | Abdullah | Week 2 | Pending |
| 5 | Extract Urdu text from saved DOCX → seed Urdu template library | Engineering | Week 2 | Pending |
| 6 | Abdullah reviews each digitized template, approves to `Verified` status | Abdullah | Week 2–3 | Pending |
| 7 | Evaluate batch-conversion tool for remaining ~14,000 `.inp` files | Engineering | Week 3 | Pending |

---

## 8. Known Limitations

1. **InPage `.inp` reading** requires either InPage software or a converter — not directly parseable in code
2. **File duplication:** Abdullah Data Store + Adnan folders contain overlapping files (same pattern-description names appear in both) — deduplication needed
3. **Filename inconsistency:** no strict naming convention — same document type saved under varied names (affidavit / AFFIDAVIt / AFFIDAVI2, etc.)
4. **Language classification** — some "English Files" contain Urdu sections; some Urdu folders contain docx files mixed
5. **No metadata** — files lack creation date, purpose tags, or template-vs-client-copy markers

---

## 9. Value Assessment

**This USB library is extremely valuable because:**
- Documents are field-tested in Pakistani legal practice over multiple years
- They encode correct structure, clauses, and Urdu phraseology
- Used by a practicing lawyer (Abdullah) → inherent quality signal
- Covers the ~20 most common document categories that make up 80%+ of lawyer daily work
- Pre-TaqiAI, this library IS Abdullah's drafting tool — it already works

**By digitizing ~100–150 canonical patterns from this corpus, TaqiAI achieves Brainstorm Q5's commitment to full-library launch with proven-quality templates as the foundation.**

---

## 10. Cross-references

- [PRD Section 25.0 — Startup / Day Zero Plan](./Product-Requirements-Document.md#250-startup--day-zero-plan)
- [Brainstorm Q6 — Template Source & Verification Strategy](./Brainstorm-Vision-QA.md#q6--template-source--verification-strategy)
- [LEGAL-02 Skill — Track 1 USB Performa documents](./skills/LEGAL-02-legal-drafter.md#track-1-documents-usb-performa-library--intake-is-template-driven)
- [LEGAL-02 Muhaida Bae + Urdu land records](./skills/LEGAL-02-legal-drafter.md#muhaida-bae--property-identification-mandatory-fields-urdu-land-record-terminology)
