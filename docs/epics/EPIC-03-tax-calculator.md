# EPIC-03 — Tax Calculator Module

---

## Epic Metadata

| Field | Detail |
|-------|--------|
| Epic ID | EPIC-03 |
| Owner | Abdullah |
| Author | Abdullah |
| Status | Built — Live |
| Priority | 3 — High |
| Estimated Effort | 1–2 Sprints |
| Depends On | None — fully standalone module |
| Can Run In Parallel With | EPIC-01, EPIC-02, EPIC-04 |
| Last Updated | 2026-06-19 |

---

## Goal

Provide lawyers with automatic, 100% accurate Pakistani tax calculations for property transactions — covering everything from Stamp Duty to FBR Withholding Tax — so clients receive a clear and transparent cost breakdown.

---

## Background

Property transactions in Pakistan involve multiple tax layers: provincial Stamp Duty, PLRA registration charges, FBR Withholding Tax, Capital Gains Tax, and occasional local levies ETC. Calculating these manually is time-consuming and error-prone. An incorrect calculation can result in financial loss for the client or create legal complications. TaqiAI's Tax Calculator handles all of this instantly in one place — using pure rule-based, deterministic logic with no external API dependency.

> **Built status:** The Tax Calculator is **built and live at `/property-transfer/tax-calculator`**. It computes stamp duty, CVT, registration fee, PLRA, WHT (buyer/seller), capital gains, local commission, and grand total. It is province-aware (Punjab, Sindh, KPK, Balochistan, Islamabad), supports property types Plot/House/Agriculture, filer/non-filer status, size in acres/kanals/marlas/sqft, DC rate per-marla or per-sqft, market value override, and a printable summary. Rate tables are hardcoded in versioned config — there is no external rate API; calculations are fully rule-based and deterministic.

> **Important Disclaimer:** This calculator is a professional assistance tool only. All tax calculations must be verified by a qualified tax practitioner or lawyer before submission to any government authority. TaqiAI does not assume legal or financial liability for any calculation errors.

---

## Tax Types Covered

| Tax Type | Authority | Applies To |
|----------|-----------|-----------|
| Stamp Duty | Provincial Government | All property transfers |
| PLRA Charges | Punjab Land Records Authority | Punjab transactions only |
| FBR Withholding Tax (WHT) | Federal Board of Revenue | Buyer and seller both |
| Capital Gains Tax (CGT) | Federal Board of Revenue | Seller — based on holding period |
| Local / Other Levies | Local Government | Varies by transaction type |

---

## User Stories

| ID | User Story | Priority |
|----|-----------|---------|
| US-03-01 | As a lawyer handling property transactions, I want to enter the property value and transaction type so that I instantly get all applicable taxes calculated | Must Have |
| US-03-02 | As a lawyer, I want to see an itemized breakdown (Stamp Duty, PLRA, FBR WHT, CGT) so that I can explain every charge to my client clearly | Must Have |
| US-03-03 | As a lawyer, I want the calculator to take province into account so that Stamp Duty and PLRA rates are correct for that region | Must Have |
| US-03-04 | As a lawyer, I want to specify whether the client is buyer or seller so that the correct tax liability is shown for each party | Must Have |
| US-03-05 | As a lawyer, I want to export a tax summary as PDF so that I can share a formal document with my client | Should Have |
| US-03-06 | As a lawyer, I want the calculator to show the date rates were last updated so that I know if I need to verify against latest FBR notifications | Must Have |
| US-03-07 | As a lawyer, I want to enter both DC rate and market value separately so that calculations follow correct FBR valuation methodology | Should Have |
| US-03-08 | As a lawyer, I want the tax summary PDF to include a disclaimer so that my client understands this is an estimate and must be verified | Must Have |
| US-03-09 | As a lawyer, I want to select District → Tehsil → Town step by step (like estamp portal) so that the correct DC rate for that exact location loads automatically | Must Have |
| US-03-10 | As a lawyer, I want to select the property type (Plot / House / Agriculture Land) so that the calculator applies the correct rate logic for each type | Must Have |
| US-03-11 | As a lawyer dealing with a plot, I want only the land (DC rate) to be used — no structure/malba added — because an empty plot has no construction | Must Have |
| US-03-12 | As a lawyer dealing with a house, I want both DC rate (land) AND malba/structure rate to be included automatically so that the total valuation is correct | Must Have |
| US-03-13 | As a lawyer handling agriculture land, I want the calculator to use the agricultural DC rate and apply the correct provincial revenue rules so that the calculation is accurate for farmland | Must Have |
| US-03-14 | As a lawyer, I want to enter property size in Marla or Kanal so that the calculator auto-converts and computes the correct area-based valuation | Must Have |
| US-03-15 | As a lawyer, I want to see both DC rate value and market value side by side so that I understand which value is being used for which tax | Should Have |

---

## Acceptance Criteria

| # | Criteria | Status |
|---|----------|--------|
| AC-01 | Stamp Duty correctly calculated per provincial rates (Punjab, Sindh, KPK, Balochistan) | [ ] |
| AC-02 | PLRA charges correctly calculated for Punjab transactions | [ ] |
| AC-03 | FBR Withholding Tax (buyer + seller) correctly calculated | [ ] |
| AC-04 | Capital Gains Tax correctly calculated based on holding period | [ ] |
| AC-05 | Inputs accepted: DC rate, market rate, property type, province, transaction type, buyer/seller role, holding period | [ ] |
| AC-06 | Output: fully itemized tax breakdown with subtotals and grand total | [ ] |
| AC-07 | PDF export of full tax summary is available | [ ] |
| AC-08 | Calculation is stateless — results appear instantly, no login required | [ ] |
| AC-09 | All tax rates clearly labeled with source (FBR / Provincial) and last-updated date | [ ] |
| AC-10 | Tax summary PDF includes legal disclaimer: *"This is an AI-assisted estimate. Verify with a qualified tax practitioner before submission."* | [ ] |
| AC-11 | Calculator verified 100% accurate against manual calculation by legal team | [ ] |
| AC-12 | District → Tehsil → Town step-by-step dropdown works; selecting Town auto-loads the DC rate for that location | [ ] |
| AC-13 | Property type selector: Plot / House (Constructed) / Agriculture Land — each triggers different rate logic | [ ] |
| AC-14 | **Plot:** only DC rate × area used — no malba/structure rate added | [ ] |
| AC-15 | **House:** DC rate (land) + malba/structure rate both applied — total valuation = land + structure | [ ] |
| AC-16 | **Agriculture Land:** agricultural DC rate used; provincial revenue rules applied; FBR 236C/K flagged as typically not applicable | [ ] |
| AC-17 | Size input accepts Marla and Kanal; system auto-converts (1 Kanal = 20 Marla) | [ ] |
| AC-18 | DC rate corpus imported from estamp.punjab.gov.pk (Punjab); equivalent sources for other provinces | [ ] |

---

## Success Metrics

| Metric | Target | How to Measure |
|--------|--------|---------------|
| Calculation accuracy | 100% match with manual | Legal team verification session |
| Time to get full tax breakdown | < 30 seconds | User timing tests |
| Tax types covered | 5 minimum | Count of implemented tax types |
| PDF export success rate | > 99% | Export error logs |
| Calculator sessions per month | Track & grow | Feature analytics |

---

## Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| FBR tax rates change mid-year | High | High | Rate tables versioned with update date; legal team reviews and updates quarterly |
| Provincial Stamp Duty rates vary and are updated frequently | High | High | Separate rate config per province; easy to update without code change |
| Lawyer uses outdated rates unknowingly | Medium | High | Always show "Rates last updated on [date]" prominently in UI |
| Edge case: property in AJK, GB, or disputed areas | Medium | Medium | Flag unsupported regions with clear message — do not calculate |
| User misunderstands calculation as final/official | Medium | High | Mandatory disclaimer on result page and in PDF export |

---

## Rate Update Strategy

| Item | Detail |
|------|--------|
| DC Rate Source | estamp.punjab.gov.pk (Punjab); equivalent portals for other provinces — scraped and imported into local database |
| DC Rate Refresh | Rates update every July 1 (new financial year); system flags when rates are >1 year old |
| FBR Rates Storage | Hardcoded in versioned config file — not fetched from external API |
| FBR Update Frequency | Reviewed and updated every quarter (or immediately after FBR budget announcements) |
| Responsibility | Abdullah / Legal Team to verify and update rates |
| Version Tracking | Each rate update logged with date and notification reference |
| User Notification | "DC Rates: [estamp date]" and "FBR Rates: [last updated date]" shown prominently on calculator UI |
| Editable Override | Lawyer can manually correct auto-loaded DC/malba rate if estamp corpus is outdated for their area |

---

## Key Calculation Inputs & Outputs

### Step-by-Step Input Flow (DC Rate Wizard)

The Tax Calculator collects inputs as a step-by-step wizard — mirroring the estamp.punjab.gov.pk flow:

```
Step 1: Province
        Punjab / Sindh / KPK / Balochistan / ICT
           ↓
Step 2: District
        (dropdown — all districts of selected province)
           ↓
Step 3: Tehsil
        (dropdown — tehsils within selected district)
           ↓
Step 4: Town / Mouza
        (dropdown — towns within selected tehsil)
           ↓
        [DC Rate auto-loads for this location]
           ↓
Step 5: Property Type
        ○ Plot           → land only, NO malba
        ○ House          → land + malba/structure rate
        ○ Agriculture    → agri DC rate, revenue rules
           ↓
Step 6: Size
        [ ] Marla   [ ] Kanal   (auto-converts: 1 Kanal = 20 Marla)
           ↓
Step 7: If House → Structure/Malba Rate
        (auto-loaded from estamp corpus OR lawyer enters manually)
           ↓
Step 8: Market Value
        (lawyer enters actual transaction price)
           ↓
Step 9: Buyer / Seller filer status
        Buyer: ○ Filer  ○ Non-filer
        Seller: ○ Filer  ○ Non-filer
           ↓
Step 10: Transaction Type
        Sale / Gift / Inheritance / Mortgage / Exchange
           ↓
        [CALCULATE] → Full tax breakdown shown
```

### Property Type Logic

| Property Type | Land Value | Structure Value | Notes |
|--------------|------------|----------------|-------|
| **Plot** | DC rate × area | ❌ Not added | Empty land — no construction |
| **House** | DC rate × area | ✅ Malba rate × area | Both land + structure |
| **Agriculture Land** | Agri DC rate × area | ❌ Not added | Provincial revenue rules apply |

### Agriculture Land — Special Rules

| Item | Detail |
|------|--------|
| Rate source | Agriculture DC rate (separate from residential — usually much lower) |
| Size unit | Kanal / Acre / Murabba (1 Murabba = 25 Acres = 200 Kanal) |
| Applicable taxes | Stamp duty (provincial) + Mutation fee |
| FBR 236C/236K | Typically NOT applicable on agriculture land (outside FBR valuation table areas) — flag with note |
| CGT | Generally exempt for agriculture land — confirm per province |
| PLRA | Punjab — Fard and mutation charges apply |

### Inputs Summary

| Input | Required | Source |
|-------|----------|--------|
| Province | Yes | User selects |
| District | Yes | User selects from dropdown |
| Tehsil | Yes | User selects from dropdown |
| Town/Mouza | Yes | User selects → DC rate auto-loads |
| Property type | Yes | Plot / House / Agriculture |
| Size (Marla or Kanal) | Yes | User enters |
| DC rate | Auto-loaded | From estamp corpus; editable if wrong |
| Malba/structure rate | Auto-loaded (if House) | From estamp corpus; editable |
| Market value | Yes | User enters actual transaction price |
| Buyer filer status | Yes | Filer / Non-filer |
| Seller filer status | Yes | Filer / Non-filer |
| Transaction type | Yes | Sale / Gift / Inheritance / Mortgage |
| Holding period | Yes (for CGT) | Date of acquisition → today |

### Outputs

| Output | Description |
|--------|-------------|
| Stamp Duty | Amount payable |
| PLRA Registration Charges | Amount payable (Punjab only) |
| FBR WHT — Buyer | Withholding tax for buyer |
| FBR WHT — Seller | Withholding tax for seller |
| Capital Gains Tax | Based on holding period |
| Total payable by Buyer | Sum of buyer-side charges |
| Total payable by Seller | Sum of seller-side charges |
| Grand Total | All charges combined |

---

## Technical Notes

> Reuse existing code — do not rebuild from scratch.

| Component | File Path | Purpose |
|-----------|-----------|---------|
| Tax Skill Spec | `src/skills/LEGAL-05-tax-calculator.md` | Full tax logic and rate tables — PRIMARY reference |
| Live UI Page | `/property-transfer/tax-calculator` | Live calculator UI + printable results |
| New API Route | `src/app/api/tax-calculator/route.ts` | Stateless calculation endpoint |
| DC Rate API | `src/app/api/tax-calculator/dc-rates/route.ts` | Endpoint: Province → District → Tehsil → Town → Rate |
| DC Rate DB | `prisma/schema.prisma` — `DcRate` model | Stores scraped estamp rates (District, Tehsil, Town, LandRate, MalbaRate, PropertyType) |
| estamp Scraper | `scripts/scrape-estamp.ts` | One-time + periodic scraper for estamp.punjab.gov.pk DC rates |
| UI Components | `src/components/ui/` | Reuse Button, Card, Input, LoadingSpinner |
| PDF Export | `html2pdf.js` (in package.json) | Tax summary PDF generation |
| i18n | `src/i18n/` | Urdu/English labels for tax terms |

> **DC rate lookup needs a database** (`DcRate` table) — district/tehsil/town dropdowns depend on it. FBR rates remain stateless config. Two separate concerns.

---

## Definition of Done

This Epic is complete when **all** of the following are true:

| # | Condition |
|---|-----------|
| 1 | All User Stories (US-03-01 to US-03-08) are implemented and merged |
| 2 | All Acceptance Criteria (AC-01 to AC-11) are verified and checked off |
| 3 | Calculations verified 100% accurate by legal team against manual calculation |
| 4 | All 4 provinces (Punjab, Sindh, KPK, Balochistan) tested |
| 5 | PDF export includes disclaimer and correct breakdown |
| 6 | Rate update date shown correctly in UI |
| 7 | Deployed to staging with no critical bugs |
| 8 | Product Owner (Abdullah) has reviewed and signed off |

---

## Out of Scope

| Feature | Reason |
|---------|--------|
| Income tax calculations | Beyond property transaction scope |
| Currency conversion | Not needed for Pakistan-only scope |
| FBR portal integration or real-time rate fetching | Rates hardcoded with version date for reliability |
| Saving calculation history | Stateless — no login required |

---

## Dependencies

| Dependency | Why Needed |
|-----------|-----------|
| `src/skills/LEGAL-05-tax-calculator.md` reviewed | All rate tables must be verified as current before development |
| Legal team rate verification | Rates must be confirmed accurate before launch |
| No dependency on EPIC-01 or EPIC-02 | This module is fully standalone |

---

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-04-27 | Abdullah | Initial Epic created |
| 1.1 | 2026-04-27 | Abdullah | Added Rate Update Strategy, Tax Disclaimer, Metadata, Risks, DoD, Version History, converted all sections to tables |
| 1.2 | 2026-04-28 | Hamza | Added District→Tehsil→Town DC rate wizard flow (estamp-based); property type logic (Plot/House/Agriculture); malba rate; agriculture land special rules; 7 new user stories; 7 new acceptance criteria; DC rate DB design |
| 1.3 | 2026-06-19 | Hamza | Updated to reflect built & live implementation |
