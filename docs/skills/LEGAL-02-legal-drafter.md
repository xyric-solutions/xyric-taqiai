---
id: LEGAL-02
name: Legal Drafter
category: legal-ai
version: 1.1
status: Active
module: Drafting Engine
lawyer_facing: true
owner: Abdullah
last_updated: 2026-04-21
---

# LEGAL-02 — Legal Drafter

> **Forward Mode:** Take user-provided case facts + a verified master template, and produce a court-ready legal draft in English or Urdu. The template defines structure; AI fills content. Lawyer review before export is mandatory.

---

## When to Activate

User provides:
- Case facts + document type + party role (plaintiff / defendant / deponent / applicant)
- Template selection (e.g., "bail application", "property affidavit", "sale deed")

Typical user prompts:
- "Draft a bail application for Ali Ahmed, FIR 55/2023, PPC §302"
- "I need to draft a sale deed for this property"
- "Draft a plaint for a recovery suit"
- "Affidavit for property ownership"

Do NOT activate when user wants legal advice without drafting — that's LEGAL-04.

---

## Inputs

| Input | Required | Notes |
|-------|----------|-------|
| Master template ID (from template library) | Yes | Never draft without a verified template |
| Sub-variant selection | Yes | One master → multiple sub-types (affidavit → property/identity/surety) |
| Form data (case facts) | Yes | Structured schema per template |
| Output language | Yes | `en` / `ur` — must match user choice |
| Party role | Yes | Plaintiff / Defendant / Applicant / Respondent / Deponent |
| Interaction mode | Yes | (a) auto-draft (b) clarify-first (c) variant-selection (d) hybrid |

---

## Process / Method

1. **Load verified master template** for the requested document type
2. **Select sub-variant** (see Sub-Variant Decision Tree below) — e.g., affidavit master → property/identity/surety variant
3. **Validate required fields** — if missing, request from user via chosen interaction mode (see below). Never guess.
4. **Determine party role & court level** — affects jurisdictional phrasing, preamble, address clause
5. **Render structural sections** exactly as the template specifies — headings, order, clauses, notice clauses, prayer. NO reordering.
6. **Fill variable placeholders** with user-provided facts only — dates, names, CNICs, amounts, property descriptions
7. **Generate freeform content** ONLY in sections the template explicitly marks as freeform (e.g., "Grounds" in a bail application, "Statement of Facts" in a plaint). Everywhere else, stick to template verbatim.
8. **Insert citations** — ONLY from the verified knowledge base; uncertain citations → `[CITATION_REQUIRED]` placeholder
9. **Compose prayer/relief clause** per document type conventions (see Prayer Patterns below)
10. **Add verification/attestation block** per document type (different for plaint vs affidavit vs sale deed)
11. **Compute & display stamp paper / court fee requirement** (see Stamp & Fee section)
12. **Apply language rules** — English: Times New Roman serif 13pt, 1.8 line-height; Urdu: Jameel Noori Nastaliq 16pt RTL, 2.8 line-height
13. **Apply formal drafting register** (see Language Register section) — no casual phrasing
14. **Insert mandatory legal disclaimers** per template spec
15. **Mark "REQUIRES LAWYER REVIEW"** banner at top of every output

---

## Interaction Modes (4 — lawyer chooses per document)

### Mode (a) — Auto-draft → Inline Edit
- AI generates full draft in one shot from submitted form data
- Lawyer reviews and edits inline (manual or AI Edit)
- **When to use:** straightforward documents with complete facts (routine affidavits, standard agreements)
- **Skill behavior:** fill all fields, don't ask questions

### Mode (b) — Clarify-then-Draft
- AI first asks 3-7 structured clarifying questions BEFORE drafting
- Questions are template-specific and only about missing/ambiguous facts
- **When to use:** complex matters, incomplete facts, high-stakes documents (bail application, written statement, plaint)
- **Skill behavior:** emit question list first; only draft after user answers

### Mode (c) — Variant Selection
- AI produces 2-3 alternative drafts using different argument angles or clause structures
- Lawyer picks preferred variant, then edits
- **When to use:** where strategic choice matters (grounds for bail, line of argument in plaint, severability of contract clauses)
- **Skill behavior:** output must be 3 genuinely different drafts, not paraphrases

### Mode (d) — Hybrid
- Lawyer chooses per-section: some auto-drafted, some clarify-first, some variant-selected
- **When to use:** complex documents where only part is routine (e.g., property description auto, but chain of title needs clarification)
- **Skill behavior:** partitions the template by section mode

---

## Universal Client Intake Checklist (ALWAYS ask before drafting)

Before any document is drafted, the skill MUST ensure these 8 facts are captured. If any are missing, the skill prompts the user (via the chosen interaction mode).

| # | Category | Fields to capture |
|---|----------|------------------|
| 1 | **Party info (client)** | Full name, parentage, CNIC, address, phone |
| 2 | **Opposing party** | Name, address (CNIC/contact if known) |
| 3 | **Matter type** | Civil / Criminal / Family / Property (sub-classification: sale dispute / bail / khula / plaint for recovery, etc.) |
| 4 | **Forum** | Which court? (Supreme Court / High Court / Sessions / District / Family / Banking / Rent Controller) |
| 5 | **Timeline** | Date of cause of action, limitation status, any urgency |
| 6 | **Documents available** | What papers does the client have? (CNIC copy, FIR, notice, property deed, nikahnama, agreement, etc.) |
| 7 | **Relief sought** | What does the client want as the final outcome? |
| 8 | **Previous proceedings** | Any prior order / FIR / notice / application already filed? |

> **Budget / fees:** Handled separately by the lawyer directly — NOT part of drafting intake.

If ANY of these 8 fields is missing from the provided form data, skill response in Mode (a) auto-draft is REJECTED and the skill must switch to Mode (b) clarify-first for the missing fields.

**Plus document-type-specific intake** (beyond the 8 universal — see sub-variant intake notes with each document type).

---

## Sub-Variant Decision Tree

Master templates produce many sub-types. The skill must pick the right sub-variant automatically OR prompt.

```
Affidavit master
  ├── Property ownership affidavit
  ├── Identity affidavit (name / DOB / CNIC correction)
  ├── Surety affidavit (bail / loan)
  ├── Declaration affidavit (general)
  ├── NOC affidavit (no-objection)
  ├── Unmarried / marital status affidavit
  ├── Residence affidavit (domicile)
  ├── Income affidavit
  ├── Character affidavit
  ├── Heirship affidavit
  ├── Lost-document affidavit
  ├── School-leaving / gap affidavit
  └── Custom affidavit
Agreement master
  ├── Muhaida Bae (محاہدہ بیع) — Agreement to Sell — PRIMARY FOCUS (daily practice)
  │     └── Rs. 3,000 fixed stamp paper (not market-value based)
  │     └── Captures: Khewat No, Khatooni No, Khasra No (or PT1 Property No),
  │                   Dastaweez No (Registry Doc No), Bahi No (Volume No),
  │                   Jild No (Book No), Dated, Total sale amount, Bayana paid
  ├── Sale Deed — formal registered deed (market-value stamp, usually via e-registration now; deprioritized)
  ├── Lease / rent agreement
  ├── Partnership deed
  ├── Employment contract
  ├── Service agreement
  ├── Loan agreement / promissory note
  ├── NDA / confidentiality
  ├── MOU
  ├── Gift deed (hiba)
  ├── Will (wasiyat)
  ├── Exchange deed
  ├── Cancellation / rectification deed
  └── Franchise / agency / distribution
Power of Attorney master
  ├── General POA (all-purpose)
  ├── Special POA (limited scope)
  ├── Irrevocable POA (with consideration)
  └── Court POA (vakalatnama for litigation)
Court document master
  ├── Legal Notice (pre-litigation — §80 CPC notice, recovery notice, contract termination, eviction notice) — sample from Abdullah
  ├── Vakalatnama (lawyer's authority to represent — attached to every court filing) — sample from Abdullah
  ├── Plaint (civil suit)
  ├── Written statement (defense)
  ├── Replication (plaintiff's reply to WS)
  ├── Bail application (pre-arrest §498 / post-arrest §497 / cancellation)
  ├── Bail reply / opposition
  ├── Appeal (criminal / civil / against interim order)
  ├── Revision petition
  ├── Miscellaneous application (adjournment, amendment, etc.)
  ├── Execution petition
  ├── Injunction application (§39 CPC / §39 SRA)
  └── Contempt petition
Family law master
  ├── Nikahnama (drafting)
  ├── Talaqnama (divorce deed)
  ├── Khula petition
  ├── Custody petition
  ├── Maintenance petition
  ├── Dower (mehr) recovery
  ├── Restitution of conjugal rights
  ├── Succession certificate petition
  └── Visitation rights petition
```

Decision rule: if user's intent + form data matches exactly one sub-variant's schema, auto-select. Otherwise, ask.

---

## Outputs

HTML or DOCX/PDF-ready document with:

- Court-compliant structural sections (no reordering)
- User facts injected into verified template
- Citation placeholders properly formatted (e.g., `PPC §302`, `CrPC §497`)
- Bilingual support — English or Urdu per user choice
- A top banner: **"AI-ASSISTED DRAFT — LAWYER REVIEW REQUIRED BEFORE FILING"**
- Student tier variant: additional watermark **"FOR EDUCATIONAL USE ONLY — NOT FOR COURT FILING"**

---

## Quality Criteria

| Criterion | Threshold |
|-----------|-----------|
| Structural compliance with template | 100% — never skip or reorder sections |
| Citation accuracy | > 90% — no invented sections or case names |
| Argument completeness (relevant grounds covered) | > 80% |
| Hallucinated facts | 0% — must only use what user provided |
| Lawyer edit ratio | < 20% — if higher, template or prompt needs iteration |
| Language correctness (grammar, formal register) | > 95% |
| Nastaliq rendering (Urdu) | 100% — no font fallback to generic Arabic |

---

## Pakistani Legal Context

### Document-type structural specifics

| Type | Mandatory sections | Common omissions to avoid |
|------|-------------------|---------------------------|
| **Affidavit** | Title, Deponent identification (name/parentage/CNIC/address), Factual paragraphs numbered, Verification clause ("Verified at [place] on [date]..."), Deponent signature block | No witness signatures, no notary attestation inline (notary adds at execution) |
| **Plaint** | Cause title, Description of parties (para 1), Jurisdiction clause, Cause of action paragraphs, Valuation for court fee & jurisdiction, Relief/Prayer clause, Verification under Order VI Rule 15 CPC, List of documents (Order VII Rule 14) | No defense arguments, no evidence, no schedule of witnesses before relief |
| **Written Statement** | Cause title matching plaint, Reply paragraph-by-paragraph to plaint (admit/deny), Preliminary objections (if any), Additional pleas, Prayer for dismissal, Verification under Order VIII Rule 1 | No new cause of action (counter-claim is separate), no legal arguments (those go in written arguments) |
| **Bail Application (pre-arrest §498)** | Cause title, Petitioner particulars, Nature of apprehension, FIR details, Grounds of apprehension, Grounds for bail (8–12 typical), Previous bail history, Prayer, Accompanying surety undertaking | No admission of offense, no plea on merits beyond what §498 requires |
| **Bail Application (post-arrest §497)** | Cause title, Accused particulars, FIR details (FIR#, PS, sections, date), Custody status, Grounds (weak prosecution, further inquiry §497(2), long detention, co-accused bail, health, etc.), Prayer, Surety | No written statement-style defense of merits |
| **Muhaida Bae (محاہدہ بیع)** — PRIMARY daily-use | Deed title, Execution date, Seller (Bayeh) particulars, Buyer (Mushtari) particulars, **Full property identification** (see below), **Total sale amount**, **Bayana (earnest money) paid**, Balance payable + timeline, Possession delivery clause, Seller's title-free declaration, Witness signatures with CNIC, **Rs. 3,000 fixed stamp paper** | Market-value stamp duty (that's for registered Sale Deed, not Muhaida Bae) |
| **Sale Deed (formal registered)** — deprioritized | Market-value stamp duty (provincial %), registrar endorsement, full property description with boundaries. Usually done via provincial e-registration now — skill should note availability but not be primary focus | Same as above; usually not handwritten now |

### Track-1 Documents (USB Performa Library) — Intake is Template-Driven

Affidavits, Agreements, Power of Attorney, and Sale Deed / Muhaida Bae are all sourced from Abdullah's **USB performa library** (per Brainstorm Q6, Track 1). These are field-tested legal forms — format, clauses, phrasing, and required fields are ALL pre-specified in the performas.

**Intake rule for Track 1 documents:**
- Skill reads the template's declared field schema (from the digitized USB performa)
- Skill asks the user ONLY for those fields — no additional interrogation
- Format, clause order, phrasing, verification/attestation block are copied verbatim from the performa — AI never rewrites structural text
- Deponent/party particulars (name, parentage, CNIC, address) filled from user-provided form data
- Declared facts collected in one free-text field per template schema (lawyer reviews/edits)
- Notary block / attestation block left empty with `[notary stamp here]` placeholder
- Stamp paper amount is a template attribute — not per-affidavit asked (e.g., "Standard Affidavit = Rs. 50", "Muhaida Bae = Rs. 3,000")

**This means:** for Track 1, there is NO extra intake checklist beyond the 8 universal fields + whatever the USB performa's schema specifies. Skill does not ask subjective questions like "what is the purpose of this affidavit" — the sub-variant selection already encodes the purpose.

**Digitization workflow (for template library team):**
1. Scan / extract USB performa into markdown
2. Identify variable fields (names, dates, CNICs, amounts, facts)
3. Author JSON schema per template with field types, validation, and bilingual labels
4. Flag stamp-paper amount as a template attribute
5. Abdullah approves digitized version → status `Verified`
6. Template enters drafting library

---

### Urdu Output — InPage Compatibility (CRITICAL)

**Domain reality:** Pakistani courts (particularly Sessions, District, Family, and Rent Controller courts) accept Urdu filings prepared in **InPage** — the dominant Urdu word processor in Pakistani legal practice. Lawyers prepare final court-submission copies in InPage before filing.

**The problem:** AI-generated Unicode Urdu text does NOT paste cleanly into InPage — it either renders in wrong font, garbled ligatures, or requires manual re-typing. This defeats the entire drafting workflow.

**Engineering requirement (must be solved in product):**

1. **Primary output:** Unicode Urdu rendered in Jameel Noori Nastaliq (browser/web preview) — for reading, reviewing, and editing in TaqiAI itself.
2. **Export options that preserve InPage-compatibility:**
   - **Option A — "Copy to InPage" button:** converts Unicode → InPage-compatible encoding on the fly (using an established Unicode ↔ InPage converter such as UrduWeb / similar open converters) so lawyer can paste directly into InPage
   - **Option B — Export as `.inp` file:** native InPage format download (higher complexity but zero friction for lawyer)
   - **Option C — Export as DOCX with embedded Jameel Noori Nastaliq font:** acceptable for some courts that receive Word docs
   - **Option D — Export as PDF:** final print-ready, but cannot be further edited in InPage
3. **Minimum viable support:** Option A at v1 (one-click convert + copy). Option B as a stretch goal if user demand is strong.

**Skill rule:**
- Every Urdu draft must have a prominently-labelled "Copy for InPage" export action, separate from regular "Copy to clipboard"
- If InPage-compatible output is not yet implemented in the UI, skill must warn the user: *"Urdu drafting for InPage not yet available — output will be Unicode. Manual paste into InPage may require font/encoding fixes."*
- Abdullah validates the InPage roundtrip for every new Urdu template before it is marked `Verified`

**Candidate libraries / tools to evaluate (engineering):**
- UrduWeb Unicode ↔ InPage converters (open)
- Custom transliteration maps (if none works reliably)
- Native `.inp` file generation (reverse-engineered format; higher effort)

---

### Urdu Drafting Style — USB-Derived

**Source of truth for Pakistani legal Urdu phraseology:** the USB performa library contains Urdu versions of standard documents. The skill's Urdu output conventions (opening phrases, connectors, verification clauses, prayer idioms, honorifics) are learned directly from these files — NOT synthesized from general knowledge or literal English-to-Urdu translation.

**Skill rule:**
- When drafting in Urdu, skill reuses the exact phrasing from the matched USB performa for that document type
- AI does not paraphrase standard Urdu legal idioms — they are preserved verbatim
- For Track 2 documents (court cases) awaiting samples, skill holds off on Urdu output until an Urdu sample is provided; fallback to English + `[URDU SAMPLE NEEDED]` marker
- Abdullah is the authority for any Urdu phraseology correction — his edits flow back into the performa/template library

**This means:** no hardcoded Urdu phrase list in this skill. The Urdu style emerges from the digitized performa corpus. Skill is only responsible for using it faithfully.

---

### Family Law Documents — Track Classification

| Document | Track | Source |
|----------|-------|--------|
| Talaqnama (talaq deed) | Track 1 | USB performa library |
| Succession Certificate — NADRA route | Track 1 | USB (Abdullah has the sample) |
| Succession Certificate — Court route | Track 2 | Sample to be provided by Abdullah |
| Khula petition | Track 2 | Sample to be provided |
| Custody petition | Track 2 | Sample to be provided |
| Maintenance petition | Track 2 | Sample to be provided |
| Dower (mehr) recovery | Track 2 | Sample to be provided |
| Restitution of conjugal rights | Track 2 | Sample to be provided |
| Visitation rights | Track 2 | Sample to be provided |
| Nikahnama drafting | Track 1 | Standard form, usually printed — skill confirms whether to support drafting vs confirm-only |

**Succession Certificate sub-variant decision rule:**
- If beneficiaries seek it via NADRA (Letter of Administration for movable assets simple case) → Track 1 (USB sample)
- If via Court (e.g., disputed estate, immovable property, non-Muslim estate, contested heirs) → Track 2 (court sample)

---

### Track-2 Documents (Court Cases) — Sample-Driven, Iterative

Court documents (Plaint, Written Statement, Replication, Criminal / Civil Appeal, Revision, Miscellaneous Application, Execution Petition, Injunction Application, Contempt Petition, **Legal Notice**) are NOT in the USB performa library. They come from real court practice and have variation between cases.

**Legal Notice:** Added to Track 2 per Abdullah. Typical scenarios: §80 CPC notice against government, recovery suit pre-cursor, contract termination, eviction notice, pre-litigation warning. Sample format will be provided by Abdullah.

**Vakalatnama:** Added to Track 2 per Abdullah. Required attachment for every court filing (plaint, WS, bail app, appeal, etc.). Sample format will be provided by Abdullah. Future enhancement: auto-generate Vakalatnama alongside the main court document (one-click companion), so the lawyer doesn't have to create it separately.

**Approach for Track 2:**
- Abdullah will provide **real sample drafts** of each court document type over time
- Skill ingests these samples, extracts the structural pattern + common clauses
- Initial skill output is based on the pattern from samples provided
- **Iterate on corrections:** when Abdullah marks up or corrects a generated draft, the feedback flows into template improvements (either the pattern library or per-sub-variant variants)
- Skill does NOT invent court-document structure from general knowledge — it waits for Abdullah-provided samples before enabling that document type

**No pre-flight intake questionnaire for Track 2 documents at this stage.** The sample drafts will encode the required inputs implicitly; extraction is then mapped into a template schema once the skill has seen enough samples to be confident.

**Exception:** Plaint valuation still uses the procedure documented below (DC rate + malba for houses + FBR rate from LEGAL-05) regardless of pattern availability — because valuation is quantitative, not stylistic.

---

### Plaint (Civil Suit) — Intake & Valuation Procedure

**Cause of action date:** Either client states it OR lawyer extracts from documents. Either source is acceptable — verify consistency.

**Valuation for court fee + jurisdiction — standard lawyer procedure:**

1. **Client provides the property registry.** Lawyer verifies authenticity.
2. **Determine property type:**
   - **Plot** — no structure value (no malba / structure rate added)
   - **House** — structure value (malba) added on top of land rate
3. **Calculate value using multiple rate sources:**
   - **DC Rate** — obtained via the Government e-Stamp portal (e.g., e-stamp.punjab.gov.pk) which calculates the DC rate for the property's exact location
   - **Malba / Structure Rate** — for houses only; the e-Stamp portal also provides this alongside DC rate
   - **FBR Rate** — separate from DC rate; differs by:
     - Residential vs Commercial (commercial higher)
     - Jurisdiction / area classification
   - **Government taxes** — additional charges per applicable law
4. **Valuation for plaint:** use the higher applicable value (DC rate + malba if house) for court fee and jurisdiction.

**Data strategy for TaqiAI:**
- Scrape + locally cache the Government e-Stamp portal's DC-rate + structure-rate tables → embed into LEGAL-05 Tax Calculator so advocates can look up instantly without visiting the portal each time
- FBR rate list is a separate lookup table (Abdullah to provide master list; to be added to LEGAL-05's rate database)
- Commercial vs residential classification should be an explicit field (not inferred)

**Skill rule for plaint valuation:** If valuation is not provided, skill calls LEGAL-05 (Tax Calculator) with the property identifiers and type; receives computed valuation; displays the calculated number back to the user for confirmation before drafting the plaint.

---

### Bail Application (§497 CrPC) — Intake (document-driven, not Q&A-driven)

Do NOT interrogate the client for details already present in the FIR. The lawyer practice-norm is:

**Required inputs from client-side:**
1. **FIR copy** (attached) — all of the following are read FROM the FIR, not asked from client:
   - FIR number, date, police station
   - Sections charged (PPC / special law)
   - Complainant details
   - Date of occurrence, date of registration
   - Accused particulars as named in FIR
   - Arrest details (if reflected)
   - Brief statement of alleged facts
2. **Medical certificate** (if any) — typically already attached to FIR in custody cases
3. **Accused's verified particulars** — full name, parentage, CNIC, age, address, occupation (confirm vs. FIR for any discrepancy)
4. **Specific defenses the accused wishes to raise** (alibi, mala fide complaint, personal enmity, property dispute masked as criminal case, etc.)
5. **Prior bail history for this FIR** — pre-arrest attempts, post-arrest attempts, cancellation petitions (if any)
6. **Co-accused status** (on bail / in custody / absconded) — often known from same FIR case files

**Skill rule:** If the user provides an FIR copy (uploaded PDF / image / pasted text), the skill MUST extract the FIR details automatically rather than re-asking the user. Only ask for items 3–6 above.

---

### Muhaida Bae — Property Identification (MANDATORY fields, Urdu land-record terminology)

A Muhaida Bae without precise property identification is practically useless. Skill must capture ALL of the following:

| Field | Urdu term | Notes |
|-------|-----------|-------|
| Khewat No | خیوت نمبر | Land record ownership unit number |
| Khatooni No | خطونی نمبر | Sub-unit under khewat |
| Khasra No | خصرہ نمبر | Individual parcel number — OR — |
| Property No (PT1) | پی ٹی ون پراپرٹی نمبر | Used when urban/residential property has PT1 registration (use this INSTEAD of Khasra for PT1 properties) |
| Dastaweez No | دستاویز نمبر | Registry Document Number |
| Bahi No | بہی نمبر | Volume Number (registry book set) |
| Jild No | جلد نمبر | Book Number (the specific bound volume) |
| Dated | تاریخ | Date of original registry entry |
| Total sale amount | کل رقم بیع | Full agreed purchase price |
| Bayana paid | بیعانہ | Earnest money already handed over |
| Balance + timeline | بقایا رقم و مدت | Remaining amount + by when payable |

**Skill rule:** Any Muhaida Bae draft without ALL of Khewat/Khatooni/(Khasra OR PT1 Property No)/Dastaweez/Bahi/Jild/Dated is REJECTED — go to clarify-first mode for missing fields.
| **General Power of Attorney** | Deed title, Principal (donor) particulars, Attorney (donee) particulars, Enumerated powers (specific, not open-ended), Duration (if limited), Revocation clause, Registration intent, Attestation block for two witnesses + magistrate/consul (if abroad) | No sub-delegation authority unless explicitly granted, no powers beyond principal's own legal capacity |
| **Special Power of Attorney** | Same as GPA + Specific transaction/purpose described precisely + Automatic expiry upon purpose completion | No open-ended powers (defeats "special" nature) |
| **Nikahnama** (drafting to confirm, not registration) | Groom & bride particulars, Mehr (deferred & prompt portions), Witnesses, Special conditions (if any), Delegation of talaq (if consented), Wali/wakil acknowledgment | No coercion clauses; bride's consent explicit |
| **Rent Agreement** | Landlord & tenant particulars, Property description, Term (start/end dates), Monthly rent, Security deposit & refund terms, Permitted use, Maintenance responsibilities, Termination notice, Rent escalation (if any), Stamp paper specification, Two witnesses | No criminal liability clauses beyond applicable tenancy law |
| **Criminal Appeal** | Cause title (against conviction order/date/court), Appellant particulars, Concise statement of case, Grounds of appeal (numbered), Prayer (acquittal/modification), Limitation explanation (if filed late + §5 Limitation Act application), Vakalatnama | No new evidence without §428 CrPC application |
| **Miscellaneous Application** | Cause title, Nature of application, Grounds, Prayer, Supporting affidavit | Limited to the narrow relief sought |

### Court-specific conventions

| Forum | Preferred Language | Stamp paper (typical) | Register/tone |
|-------|-------------------|----------------------|---------------|
| Supreme Court | English | N/A (court fee per schedule) | Formal, technical |
| High Court (civil) | English | N/A | Formal, technical |
| High Court (criminal, bail) | English or Urdu | N/A | Formal |
| Sessions / District Court | Urdu predominant, English OK | Rs. 10-50 application stamps | Formal |
| Family Court | Urdu | Rs. 20-100 | Formal but accessible |
| Banking Court | English | Per schedule | Technical |
| Rent Controller | Urdu | Rs. 10-20 | Formal |
| Consumer Court | Urdu/English | Per schedule | Formal |

### Stamp Paper / Court Fee Guidance (indicative — calculator skill LEGAL-05 computes exact amounts)

| Document | Typical stamp/fee |
|----------|------------------|
| Affidavit | Rs. 50 stamp paper + notary fee |
| General POA | Rs. 100 stamp paper + registration if over Rs. 100 consideration |
| Special POA | Rs. 50-100 stamp paper |
| **Muhaida Bae** (primary daily-use) | **Rs. 3,000 fixed stamp paper** — not market-value based |
| Sale Deed (registered, formal) | Provincial stamp duty (Punjab 3%, Sindh 1%, KP/Balochistan 2%) + registration 1% + PLRA 1% (Punjab) — usually done via e-registration now |
| Rent Agreement | Rs. 100 stamp (registration optional <12 months, mandatory >12 months) |
| Partnership Deed | Rs. 500-1000 stamp |
| Gift Deed | Provincial stamp duty — reduced for blood relatives |
| Plaint | Ad valorem court fee per suit value (consult Court Fees Act, Seventh Schedule) |
| Bail Application | Rs. 10-50 court fee stamp |

Skill must display the applicable stamp/fee requirement at top of every drafted document.

### Prayer / Relief Clause Patterns

Standard closing patterns by document type. Use exact phrasing.

| Document | Opening phrase for prayer |
|----------|---------------------------|
| Plaint | *"It is, therefore, most respectfully prayed that a decree may be passed in favor of the plaintiff and against the defendant(s) for..."* |
| Written Statement | *"It is, therefore, prayed that the suit of the plaintiff may be dismissed with costs."* |
| Bail Application (pre-arrest) | *"It is, therefore, most respectfully prayed that interim pre-arrest bail granted vide order dated [date] may be confirmed and the petitioner be admitted to pre-arrest bail..."* |
| Bail Application (post-arrest) | *"It is, therefore, most respectfully prayed that the accused petitioner may be admitted to post-arrest bail subject to his furnishing surety in the sum of Rs. [amount] with [number] sureties in the like amount to the satisfaction of this Honourable Court."* |
| Miscellaneous Application | *"It is, therefore, most respectfully prayed that this Honourable Court may be pleased to..."* |
| Appeal | *"It is, therefore, most humbly prayed that the impugned order/judgment dated [date] passed by [court] may kindly be set aside and the appellant be acquitted..."* |
| Affidavit | Ends with verification, not prayer: *"Verified at [place] on this [date] that the contents of the above affidavit are true and correct to the best of my knowledge and belief, and nothing has been concealed or misrepresented therefrom."* |

### Formal Drafting Register

Legal Pakistani drafting uses specific idioms. Skill must use these — not paraphrases.

**Opening phrases (by document type):**
- Plaint: *"The above-named plaintiff most respectfully submits as under:"*
- Application: *"The humble application on behalf of the applicant above-named most respectfully sheweth:"*
- Petition (writ): *"The petitioner above-named most respectfully submits this petition under Article 199 of the Constitution..."*
- Affidavit: *"I, [name], son/daughter of [parent], Muslim/Christian/Hindu, aged about [N] years, resident of [address], CNIC [number], do hereby solemnly affirm and state on oath as under:"*

**Standard connector phrases:**
- Introducing facts: *"That..." (each para starts with "That")*
- Introducing counter-argument: *"That, without prejudice to the foregoing,..."*
- Prayer lead-in: *"In view of the foregoing submissions,..."*
- Invocation of court's discretion: *"this Honourable Court may be pleased to..."*

**Formality rules:**
- "Respondent" / "Petitioner" — capitalize role words
- "Honourable Court" (British spelling) — standard in Pakistani courts
- "Prayer" as section heading, not "Request" or "Ask"
- "Vide" for "by way of" (as in "vide order dated...")
- Numbered paragraphs throughout — no bullets in court documents
- Date format: "this 21st day of April, 2026" in formal pleadings; "21-04-2026" in body text

### Verification & Attestation per document type

| Document | Verification/attestation format |
|----------|--------------------------------|
| Affidavit | Verification clause at end ("Verified at Lahore on...") + Deponent signature + Notary/Oath Commissioner stamp (added at execution, not by skill) |
| Plaint | Verification under Order VI Rule 15 CPC: *"Verified at [place] on the [date] that the contents of the foregoing plaint are true to my personal knowledge / based on information received and believed to be true..."* + Plaintiff signature |
| Written Statement | Verification under Order VIII Rule 1 CPC — similar phrasing |
| Sale Deed | Two witnesses + executant signatures + thumb impressions + registrar endorsement (added at registration) |
| POA | Two witnesses + executant signature + magistrate/consul attestation (if abroad) — skill leaves space, doesn't simulate stamp |
| Bail Application | Supporting affidavit from petitioner + verification |
| Criminal Appeal | Vakalatnama by lawyer + verification by appellant |

### Citation conventions
- Statutes: `Section 302, Pakistan Penal Code, 1860` (formal) or `§302 PPC` (short) — both acceptable; match document's existing style
- Case law: `Muhammad Tanveer v State (2017 SCMR 1332)` — always Party v Party (Year Citation-Abbrev Page)
- Common citation-abbreviations: SCMR (Supreme Court Monthly Review), PLD (Pakistan Legal Decisions), PCrLJ (Pakistan Criminal Law Journal), MLD (Monthly Law Digest), CLC (Civil Law Cases), YLR (Yearly Law Reporter), SCC (Supreme Court Cases)
- When citing sections from multiple acts, list in natural law order: CPC → PPC → CrPC → QSO → special law

---

## Examples (3 worked)

### Example 1 — Property Ownership Affidavit (Urdu)

**User input:**
- Template: `affidavits/property-ownership`
- Language: Urdu
- Mode: (a) Auto-draft
- Facts: Deponent Ali Ahmed s/o Rashid Ahmed, CNIC 35202-1234567-1, Lahore, age 42, declares ownership of House #42, DHA Phase 5

**LEGAL-02 output (snippet, Urdu Nastaliq):**
```
[TOP BANNER]
AI-ASSISTED DRAFT — REQUIRES LAWYER REVIEW BEFORE NOTARIZATION
Stamp Paper: Rs. 50 (Punjab) | Notary Fee Applicable

═══════════════════════════════════════════════════
حلف نامہ
(ملکیت جائیداد)
═══════════════════════════════════════════════════

میں، علی احمد، ولد راشد احمد، مسلمان، عمر 42 سال،
سکنہ: مکان نمبر 42، ڈی ایچ اے فیز 5، لاہور
شناختی کارڈ نمبر: 35202-1234567-1
حلفاً بیان کرتا ہوں کہ:

1. یہ کہ مذکورہ جائیداد میری ذاتی اور خالص ملکیت ہے ...
2. یہ کہ مذکورہ جائیداد پر کسی قسم کا کوئی قرض، رہن یا بوجھ نہیں ہے ...
3. یہ کہ ...

تصدیق:
تصدیق کی جاتی ہے کہ مندرجہ بالا بیان بمطابق میرے علم و یقین
درست اور سچا ہے اور اس میں کچھ بھی چھپایا یا غلط بیان نہیں کیا گیا۔

حلف لینے والا (دستخط):  ___________________
بمقام: لاہور       بتاریخ: ___________
```

### Example 2 — Bail Application Post-Arrest (English, Clarify-then-Draft)

**User starts:**
- Template: `court-documents/bail-application`
- Language: English
- Mode: (b) Clarify-then-draft
- Partial facts: "I need a bail application for my client in FIR 55/2023, PS Model Town, Lahore"

**LEGAL-02 response — clarifying questions:**
```
Before drafting, please confirm these key facts:

1. Accused particulars:
   - Full name, parentage, CNIC, age, occupation, address?

2. FIR details:
   - Date of FIR registration?
   - Complainant name?
   - Sections charged (PPC / special law)?

3. Custody status:
   - Date of arrest?
   - Current place of detention?
   - Any medical issues?

4. Bail history:
   - Previous bail attempts (pre-arrest, post-arrest, cancellation)?

5. Facts supporting bail:
   - Any alibi?
   - Witness gaps / prosecution weakness you want to emphasize?
   - Co-accused already on bail?

6. Filing forum:
   - Magistrate / Sessions / High Court?
```

Once user responds, skill drafts. Output (snippet):
```
IN THE COURT OF SESSIONS JUDGE, LAHORE

Criminal Miscellaneous No. _____ of 2026
(Bail Application under Section 497 CrPC)

Ali Ahmed son of Rashid Ahmed,
age 28 years, CNIC 35202-1234567-1,
resident of House No. 12, Street 5, Model Town, Lahore
                                                           ...Accused-Petitioner

                            Versus

The State                                                   ...Respondent

FIR No. 55/2023 dated [date]
Police Station Model Town, Lahore
Offenses: Section 302/34 PPC

---

The humble petition of the accused-petitioner above-named most respectfully submits as under:

1. That the petitioner has been falsely implicated in the above-mentioned FIR on account of personal enmity...

2. That the FIR lodged on [date] names the petitioner as co-accused but contains no independent witness...

[GROUNDS — 8–10 numbered paragraphs, drawn from clarify answers and citation-safe precedents]

PRAYER:
It is, therefore, most respectfully prayed that the accused-petitioner may be admitted to post-arrest bail subject to furnishing surety in the sum of Rs. 500,000/- with two sureties in the like amount to the satisfaction of this Honourable Court.

Lahore
Dated: 21-04-2026
                                              Through Counsel:
                                              [Advocate Name, Bar Council No.]
```

With top banner:
```
AI-ASSISTED DRAFT — REQUIRES LAWYER REVIEW BEFORE FILING
Court Fee Stamp: Rs. 20 | Supporting Affidavit Required
```

### Example 3 — Sale Deed (English, Variant Selection)

**User input:**
- Template: `agreements/sale-deed-residential`
- Mode: (c) Variant selection
- Facts: Seller A, Buyer B, 10 Marla house DHA Phase 5 Lahore, PKR 2.5 crore, payment partly by pay order + partly by transfer

**LEGAL-02 response:**
```
Three variants produced with different payment-clause structures:

[Variant 1] — Lump sum payment (simplest, assumes single tranche)
[Variant 2] — Split payment (pay order + bank transfer at different dates)
[Variant 3] — Staged payment (escrow-like, with performance milestones)

Preview of each variant's distinctive clause:

Variant 1: "Total sale consideration of PKR 2,50,00,000 has been received in full by the Vendor from the Vendee vide Pay Order No. [X] dated [date], drawn on [Bank]."

Variant 2: "Total sale consideration of PKR 2,50,00,000 has been paid as follows: (a) PKR 1,00,00,000 vide Pay Order No. [X] dated [date]; and (b) PKR 1,50,00,000 through direct bank transfer dated [date] to the Vendor's account..."

Variant 3: "Total sale consideration of PKR 2,50,00,000 is payable in three tranches linked to: (i) execution of this Deed (40%), (ii) handover of vacant physical possession (40%), and (iii) registration at Sub-Registrar (20%)..."

Select a variant to expand full draft.
```

After user picks Variant 2, full sale deed is produced with all mandatory sections: title, parties, property description with khasra/boundaries, consideration clause (Variant 2), free-title declaration, delivery of possession, indemnification, witness signature blocks, stamp duty endorsement area.

Top banner:
```
AI-ASSISTED DRAFT — REQUIRES LAWYER REVIEW
Stamp Duty: Punjab 3% = PKR 7,50,000 | PLRA 1% = PKR 2,50,000
Registration: Mandatory at Sub-Registrar Office, DHA, Lahore
Witnesses: 2 required with CNIC and signatures
```

---

## Common Drafting Mistakes (from lawyer experience — skill MUST avoid)

| # | Mistake | Why it matters | What skill does instead |
|---|---------|---------------|-------------------------|
| 1 | Missing "That" at start of each numbered paragraph in pleadings | Court rejects informally-structured pleadings | Always prefix each para with "That " |
| 2 | Using "I/We" instead of "petitioner/plaintiff" in body | Breaks third-person pleading convention | Refer to party in third person throughout |
| 3 | Mixing prayer with grounds | Renders prayer unenforceable | Separate "Grounds" and "Prayer" sections clearly |
| 4 | Forgetting to add Section/Order citation at start of application | Court may return for correction | Header block includes: *"Application under [Section/Order] of [Act]"* |
| 5 | Citing non-existent "Section 144 CPC" (confusion with §144 CrPC) | Fabricated citation = malpractice | Verify every cited section against knowledge base |
| 6 | Missing verification paragraph in plaint | Order VI Rule 15 violation — plaint returned | Always add verification |
| 7 | Using Indian-case names in Pakistani courts | Non-binding, signals foreign research | Pakistani precedents only, unless Indian SC pre-1947 and used by reference |
| 8 | Affidavit with witness signatures | Affidavit is unilateral, witnesses make it a different document | Never add witness blocks to affidavit |
| 9 | POA with open-ended "all acts" clause without enumerating | Bank/court may reject as vague | Always enumerate specific powers |
| 10 | Sale deed without boundary description | Registration likely refused | Include boundaries (North/South/East/West), khasra/khatooni, survey number, area |
| 11 | Rent agreement registered/notarized but NOT for period >12 months | Runs afoul of Registration Act §17 | Flag: >12 month lease → mandatory registration |
| 12 | Stamp paper amount too low for document type | Renders document inadmissible in evidence | Display required stamp paper in top banner |
| 13 | Prayer clause in plaint that doesn't match valuation | Court fee mismatch | Compute valuation for court-fee + state it in plaint |
| 14 | Bail application arguing merits of guilt/innocence | §497 is not about conviction — only about bail | Focus grounds on 497(2) further-inquiry standard |
| 15 | Written statement introducing new cause of action | Not permitted under Order VIII — requires counter-claim | Flag + suggest separate counter-claim |
| 16 | Drafting in both languages mixed without clear purpose | Court prefers one primary language per document | Output one primary language; bilingual only for parties' names/addresses where CNICs require |
| 17 | Using "Mr./Mrs." honorifics in formal pleadings | Not convention in Pakistani formal drafting | Full name without honorific: "Ali Ahmed son of Rashid Ahmed" |
| 18 | Numeric dates in formal date line | Convention is written form | "this 21st day of April, 2026" in formal lines |
| 19 | Missing Vakalatnama reference when drafted by lawyer | Authority to represent not shown | Include "Through Counsel: [Name], BC# [Number]" at foot |
| 20 | Attempting registration-level attestation in draft | Notary/Registrar/Magistrate actions are post-drafting | Leave attestation block empty with placeholder |

---

## Hard Red Lines (ZERO-TOLERANCE — Malpractice-Level Mistakes)

These are career-ending / client-harming mistakes confirmed by Abdullah (practicing Pakistani lawyer). Every AI output MUST be pre-validated against these before it is shown to the user. Any draft failing ANY check is REJECTED and regenerated — never shown to the user as-is.

| # | Red Line | Why malpractice | Validation rule |
|---|----------|-----------------|-----------------|
| 1 | **Wrong statute/section cited** (e.g., §144 CPC vs §144 CrPC — entirely different laws) | Fabricated or misplaced citation = malpractice. Courts reject; client's position destroyed. | Every cited section checked against the verified knowledge base for exact act + section match. No fuzzy matching. |
| 2 | **Wrong jurisdiction applied** (Sindh matter with Punjab-specific law, or vice versa) | Provincial laws and procedures differ. Wrong jurisdiction = case dismissed. | Cross-check the property/forum province against the law source jurisdiction. Block if mismatched. |
| 3 | **Limitation period missed** (time-barred case) | Plaint / appeal filed after limitation = rejected at threshold; no remedy. | Compute limitation window from cause-of-action date; compare to filing date; warn prominently if close/exceeded. |
| 4 | **Prayer clause unenforceable / vague** | Court cannot grant relief that is unenforceable or not clearly stated. | Match prayer against valid relief categories (declaration / injunction / decree for recovery / possession / etc.); reject vague prayers. |
| 5 | **Gender/pronoun error in Urdu** (مدعی vs مدعیہ; deponent gender mismatch) | Document becomes internally inconsistent; may be returned; at minimum unprofessional. | Derive gender from deponent/plaintiff data; enforce consistent pronouns + inflections throughout. |
| 6 | **Amount / date typo** (e.g., PKR 2.5 crore written as PKR 25 lakh; date 21-04-2026 vs 21-04-2036) | Changes the substance of the deed; enforcement impossible; client losses. | All amounts: numeric + words form (required). All dates: ISO form + written form. Cross-check for consistency before output. |
| 7 | **Heir omission in succession certificate** (any legitimate heir not listed) | Certificate becomes incomplete; disputes arise; re-filing required. | Pre-draft checklist: require confirmation that ALL heirs per succession rules are listed (spouse, children, parents, etc. per applicable personal law). |
| 8 | **Counter-claim mixed into Written Statement** (not filed separately) | Not permitted under Order VIII — claim lost. | Flag any "counter-claim" wording in a WS draft; force separate counter-claim filing. |
| 9 | **Witness count wrong** (wrong number of witnesses or missing witness block for documents that require them) | Deed becomes invalid for registration / evidentiary purposes. | Per document type: enforce the correct witness count (affidavit: 0, sale deed: 2, POA: 2, will: 2 + attestation, etc.). |
| 10 | **Notice period skipped** (e.g., §80 CPC 2-month notice omitted before suing government) | Suit against government without §80 CPC notice = dismissed at threshold. | Pre-flight check: if respondent is government / public officer, ensure §80 CPC notice is served + documented OR suit is exempted under §80(2). |

### Mandatory Lawyer Approval Gate (MANDATORY — no exceptions)

Per Abdullah's direction, the workflow is **ALWAYS**:

```
AI draft produced
      ↓
[REVIEW & APPROVE STEP]  ← lawyer must explicitly "OK" the draft
      ↓
Download / Print / Export / Copy-to-InPage
```

**Implementation rules:**

- Download PDF / Print / Copy-for-InPage / Export DOCX buttons are **DISABLED** until the lawyer clicks an explicit "Approve" action on the drafted document
- The "Approve" button reveals the 10 Red Lines checklist for the lawyer to visually confirm (not automated — lawyer's own eyes)
- Clicking "Approve" logs: user ID, timestamp, document ID, template version, red-line-checklist acknowledgment — for audit trail
- If any of the 10 red lines is internally flagged by the skill, the "Approve" button is further gated behind an explicit confirmation of that specific flag
- Student tier: same gate applies, with extra educational tooltip on each red line

This gate is NON-NEGOTIABLE. It exists because:
1. The entire Pakistani legal system's trust in AI-assisted drafting depends on this structure
2. Any slip on the 10 red lines = lawyer liability, not TaqiAI's — but it would destroy the product's reputation in the lawyer community
3. The gate makes the lawyer-in-the-loop principle enforceable in the product, not just a slogan

---

## Anti-patterns (what this skill must NEVER do)

- ❌ Draft without a verified template (free-form AI generation is BANNED)
- ❌ Add witness signature blocks to affidavits (affidavit is unilateral)
- ❌ Guess missing facts (ask user instead via chosen interaction mode)
- ❌ Invent a citation (use `[CITATION_REQUIRED]` placeholder)
- ❌ Use Indian / UK / US case law unless referenced in a Pakistani judgment (Contract Act 1872 is fine — it's Pakistani law descended from Indian Act)
- ❌ Skip the "requires lawyer review" banner
- ❌ Skip the stamp paper / court fee notice in the banner
- ❌ Render Urdu in generic Arabic font — must be Nastaliq (Jameel Noori or Noto Nastaliq)
- ❌ Merge plaintiff and defendant perspectives in same document
- ❌ Simulate notary / registrar / magistrate stamps — leave blank with placeholder
- ❌ Use informal language ("Dear Sir/Madam", "thanks", bullet lists) in court documents
- ❌ Omit the "That" prefix on pleading paragraphs
- ❌ Auto-select language — always honor user's explicit language choice
- ❌ Auto-draft grounds in bail application based on guilt assumption — §497 standard only
- ❌ Use Gregorian dates without Pakistani formatting convention when formal ("this 21st day of April, 2026")
- ❌ Cross-combine sub-variants (e.g., property affidavit template with identity affidavit fields)
- ❌ Produce output exceeding ~30 pages without segmentation — flag to lawyer for modular structure
- ❌ Include advocate-client privilege content in any output
- ❌ Include real CNICs / PINs / account numbers in example/sample drafts (demo data only)

---

## Validation

Every generated draft is scored by LEGAL-03 (Legal Comparator) against a matched real case file from the solved-case corpus. Accuracy thresholds enforced before template is promoted from `Draft` to `Verified` status.
