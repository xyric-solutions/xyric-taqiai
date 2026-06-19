---
id: LEGAL-05
name: Tax Calculator
category: legal-ai
version: 1.0
status: Active
module: Tax Calculator
lawyer_facing: true
owner: Abdullah
last_updated: 2026-04-21
---

# LEGAL-05 — Tax Calculator

> **Deterministic calculator (rules-based, not generative).** Computes Stamp Duty, PLRA charges, FBR taxes, Withholding Tax, and Capital Gains Tax for Pakistani property and legal transactions — per province. Output is court-ready and auditable.

---

## When to Activate

User submits a property or transactional calculation request. Common triggers:

- "Calculate stamp duty on this sale deed"
- "Property value 80 lakh, Lahore — kitni stamp duty banegi?"
- "FBR 236K on commercial plot in Karachi"
- "Capital gains tax on property sale — CGT applies regardless of holding period"
- "Calculate total charges for this property transaction"

Activated from Tax Calculator module UI or LEGAL-04 when user's question is primarily numerical/tax.

---

## Inputs — Step-by-Step Wizard (estamp-mirrored flow)

Inputs are collected in a fixed sequence. Do NOT ask for DC rate manually — it is auto-loaded from the rate corpus based on location selection.

```
Step 1 → Province        Punjab / Sindh / KPK / Balochistan / ICT
Step 2 → District        All districts of selected province
Step 3 → Tehsil          Tehsils within selected district
Step 4 → Town/Mouza      Towns within selected tehsil
                         ↓ DC rate + malba rate auto-load here
Step 5 → Property Type   Plot / House / Agriculture Land
Step 6 → Size            Marla or Kanal (1 Kanal = 20 Marla; 1 Acre = 8 Kanal)
Step 7 → Market Value    Actual transaction price (lawyer enters)
Step 8 → Filer Status    Buyer: Filer/Non-filer | Seller: Filer/Non-filer
Step 9 → Transaction     Sale / Gift / Inheritance / Mortgage / Exchange / Partition
Step 10 → Holding Period Date of acquisition (for CGT)
```

| Input | Required | Source |
|-------|----------|--------|
| Province | Yes | User selection |
| District | Yes | User selection from dropdown |
| Tehsil | Yes | User selection from dropdown |
| Town / Mouza | Yes | User selection → DC rate auto-loads |
| Property type | Yes | Plot / House / Agriculture Land |
| Size | Yes | Marla or Kanal — auto-converted |
| DC rate | Auto-loaded | From estamp corpus for selected location; lawyer can override |
| Malba/structure rate | Auto-loaded (House only) | From estamp corpus; lawyer can override |
| Market value | Yes | Lawyer enters actual transaction price |
| Buyer filer status | Yes | Filer / Non-filer |
| Seller filer status | Yes | Filer / Non-filer |
| Transaction type | Yes | Sale / Gift / Mortgage / Lease / Exchange / Inheritance / Partition |
| Holding period | Yes | Acquisition date → disposal date (CGT — applies regardless of period) |
| Urban / Rural | Auto-detected | From location; affects some provincial rates |

---

## Rate Data Source Strategy

This skill does NOT guess rates. All rates come from verified sources, cached locally for fast lookup:

| Rate type | Source | Cache strategy |
|-----------|--------|----------------|
| **DC Rate (land valuation)** | Government e-Stamp portal (e.g., e-stamp.punjab.gov.pk) | Scrape periodically per province; cache in local rate database keyed by location |
| **Malba / Structure Rate** | Same e-Stamp portal — published alongside DC rate | Cached per location |
| **FBR Rate (residential)** | FBR official rate notification (to be provided by Abdullah) | Master table maintained in LEGAL-05 rate DB |
| **FBR Rate (commercial)** | FBR official rate notification — separate from residential | Master table |
| **Stamp Duty (provincial)** | Provincial Stamp Acts + amendments | Versioned per Finance Act |
| **PLRA Charges (Punjab)** | PLRA Act 2017 + current notifications | Cached |
| **CVT, §236C, §236K, CGT** | Income Tax Ordinance 2001 + current Finance Act | Versioned yearly |

**Property-type distinction (critical):**

| Property Type | Land Rate Used | Structure (Malba) Rate | Tax Rules |
|--------------|---------------|----------------------|-----------|
| **Plot** (empty land) | DC rate × area | ❌ None — no construction | Standard stamp duty + FBR |
| **House** (constructed) | DC rate × area | ✅ Malba rate × area added | Stamp duty on land+structure total |
| **Commercial Plot** | Commercial DC rate | Only if structure exists | + FED applicable |
| **Agriculture Land** | Agri DC rate × area | ❌ None | Provincial revenue rules; FBR 236C/K typically not applicable; CGT generally exempt |

> **Rule:** Never add malba to a Plot. Never skip malba for a House. Agriculture land is a completely separate calculation stream.

**Area unit conversions:**
- 1 Kanal = 20 Marla
- 1 Acre = 8 Kanal = 160 Marla
- 1 Murabba = 25 Acres = 200 Kanal

**Agriculture Land special process:**
- Applicable taxes: Stamp duty + Mutation fee + Provincial agricultural cess
- FBR §236C/§236K: typically NOT applicable (agricultural land outside FBR valuation tables in most areas — flag with note, do not silently omit)
- CGT: generally exempt on agricultural land — confirm per province
- PLRA (Punjab): Fard charges + mutation fee apply instead of standard PLRA
- Size unit: Kanal / Acre / Murabba (auto-convert all to Marla for calculation)

**Residential vs Commercial:**
- FBR rates differ significantly between residential and commercial properties
- Skill must always have this classification explicit — never infer from address alone
- Commercial properties attract FED (Federal Excise Duty) additionally

---

## Process / Method (deterministic — no LLM guessing)

1. **Validate inputs** — missing data → prompt user, do NOT assume
2. **Classify property** — plot / house / commercial / agricultural (required — no inference)
3. **Look up current rate tables** from the verified rate database (per province, per type)
3. **Compute each tax component separately:**
   - Stamp Duty (provincial)
   - PLRA / Revenue charges (Punjab-specific)
   - FBR §236C (seller advance tax on sale)
   - FBR §236K (buyer advance tax on purchase)
   - Capital Value Tax (CVT) — where applicable
   - Withholding Tax — per transaction type
   - Capital Gains Tax (CGT) — based on holding period + filer status
   - Federal Excise Duty (FED) — for commercial property
4. **Sum total payable** — split by buyer vs seller liability
5. **Show rate table used** — for transparency/audit (which province, which year)
6. **Attach legal references** — exact Acts / Section numbers
7. **Flag anomalies** — if DC rate is significantly different from market value, note it

---

## Outputs

Structured breakdown:

```
╔══════════════════════════════════════════════════════╗
║ TAX CALCULATION — SALE OF RESIDENTIAL PROPERTY       ║
║ Province: Punjab | Lahore | Urban                    ║
║ Date: 2026-04-21                                     ║
╠══════════════════════════════════════════════════════╣
║ Property Details                                     ║
║   Size: 10 Marla                                     ║
║   DC Rate Value: PKR 1,20,00,000                     ║
║   Market Value: PKR 2,50,00,000                      ║
║   Holding Period: 3 years (CGT applies — new rule)   ║
║   Buyer: Filer | Seller: Filer                       ║
╠══════════════════════════════════════════════════════╣
║ BUYER LIABILITY                                       ║
║   Stamp Duty (3%):          PKR 3,60,000             ║
║   PLRA Fee (1%):            PKR 1,20,000             ║
║   CVT (2%):                 PKR 2,40,000             ║
║   FBR §236K (1% Filer):     PKR 1,20,000             ║
║   Registration Fee (1%):    PKR 1,20,000             ║
║   ─────────────────────────────────────              ║
║   BUYER TOTAL:              PKR 9,60,000             ║
╠══════════════════════════════════════════════════════╣
║ SELLER LIABILITY                                      ║
║   FBR §236C (1% Filer):     PKR 1,20,000             ║
║   CGT (10% on gain):        PKR (computed)           ║
║   ─────────────────────────────────────              ║
║   SELLER TOTAL:             PKR X,XX,XXX             ║
╠══════════════════════════════════════════════════════╣
║ Legal References:                                    ║
║   - Stamp Act 1899 (Punjab amendments)               ║
║   - PLRA Act 2017                                    ║
║   - Income Tax Ordinance 2001 §236C / §236K          ║
║   - Income Tax Ordinance 2001 §37 (CGT)              ║
║                                                      ║
║ Rate Table Version: Punjab-2026-01                   ║
╚══════════════════════════════════════════════════════╝
```

Plus:
- Warning if non-filer → significantly higher rates
- Option to save calculation to a case folder
- Export as PDF / share link

---

## Quality Criteria

| Criterion | Threshold |
|-----------|-----------|
| Calculation correctness (vs known expected values) | 100% |
| Rate table freshness (updated within last 90 days of legislation change) | 100% |
| All applicable taxes included (none forgotten) | 100% |
| Province-specific rules applied | 100% |
| Audit trail (rate version shown) | 100% |
| Response time | < 2 seconds |

This skill MUST be 100% accurate — taxes are numerical, verifiable facts. Any bug = user files wrong amount = legal liability.

---

## Pakistani Legal Context

### Provincial rate differences (partial, indicative — verify against live rate table)

| Province | Stamp Duty typical | Notes |
|----------|-------------------|-------|
| Punjab | 3% of DC value | PLRA 1%, CVT 2% |
| Sindh | 1% + SRB charges | Different slab for Karachi |
| KP | 2% | Provincial registration fee |
| Balochistan | 2% | Similar to KP |
| ICT (Islamabad) | 4% | Federal + CDA charges |

### FBR Withholding rates (Income Tax Ordinance 2001)

| Section | Filer | Non-Filer | Trigger |
|---------|-------|-----------|---------|
| §236C | 1% of sale value | 2% of sale value | Seller, on transfer |
| §236K | 1% of purchase value | 2% of purchase value | Buyer, on transfer |

### CGT (Capital Gains Tax) — New Rule (2026)

> ⚠️ **IMPORTANT — NEW FBR RULE:** CGT and Withholding Tax now apply on **every property sale regardless of holding period.** Whether property was held for 1 year or 10 years, both CGT (§37 ITO 2001) and WHT (§236C/§236K) are applicable. The previous holding-period exemption/slab system has been abolished.

- CGT rate: per current Finance Act (verify against rate table)
- Filer vs Non-filer rate difference still applies
- No exemption based on holding period

*Rates change per Finance Act each year — skill MUST reference rate table version used.*

### Transaction-type specifics
- **Gift (between blood relatives):** typically exempt from most taxes but stamp duty may apply
- **Inheritance (transmission):** different rules; no §236C/K
- **Commercial property:** FED applies (1%); higher stamp duty in some provinces
- **Agricultural land:** provincial revenue laws; usually not subject to CGT

---

## Example

**User:** "Selling a 10 marla house in Lahore, price 2.5 crore, both buyer and seller are filers, held for 3 years"

**LEGAL-05 output:**
- Buyer total: PKR 9,60,000 (SD + PLRA + CVT + §236K + Reg fee)
- Seller total: PKR [computed CGT + §236C]
- Total transaction-related taxes: PKR X,XX,XXX
- Rate table: Punjab-2026-01
- References cited for each line item

---

## Anti-patterns (what this skill must NEVER do)

- ❌ Use an LLM to compute numbers (always deterministic lookup + arithmetic)
- ❌ Apply outdated rate tables (hard-fail if table is > 180 days old)
- ❌ Forget non-filer surcharge (biggest source of complaint)
- ❌ Omit one of the applicable taxes (e.g., silent on CVT)
- ❌ Apply Indian / UK property tax rules
- ❌ Round aggressively without showing breakdown
- ❌ Quote rates as "current" without showing rate-table version

---

## Validation

- Every rate change (Finance Act / provincial amendment) → rate table updated + regression test run
- Golden set of 50 manually-verified calculations must all pass at 100% before deployment
- Live sample audits by Abdullah periodically
