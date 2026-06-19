# EPIC-03 — Tax Calculator Module: Stories Index

> **Epic Goal:** Provide lawyers with automatic, accurate Pakistani tax calculations for property transactions.
> **Approach:** Rule-based/deterministic calculator with hardcoded rate tables; lawyer enters details and can override rates — calculator computes all totals.
> **Status:** Built & live at route `/property-transfer/tax-calculator`.
> **Total Stories:** 19 | **Priority Breakdown:** P0: 14 | P1: 5

---

| Story ID | Title | Priority | Status |
|----------|-------|----------|--------|
| [S03-01](./S03-01-property-details-input.md) | Property Details Input (size, type, province, transaction) | P0 | Done |
| [S03-02](./S03-02-itemized-tax-breakdown.md) | Itemized Tax Breakdown Display | P0 | Done |
| [S03-03](./S03-03-province-aware-calculation.md) | Province-Aware Stamp Duty Calculation | P0 | Done |
| [S03-04](./S03-04-buyer-seller-role-selection.md) | Buyer & Seller Role & Filer Status | P0 | Done |
| [S03-05](./S03-05-tax-summary-pdf-export.md) | Tax Summary PDF Export | P1 | Done |
| [S03-06](./S03-06-rate-last-updated-date.md) | Rate Last Updated Date Display | P0 | Done |
| [S03-07](./S03-07-manual-dc-rate-entry.md) | Lawyer Manually Enters DC Rate | P0 | Done |
| [S03-08](./S03-08-tax-summary-disclaimer.md) | Tax Summary Mandatory Disclaimer | P0 | Done |
| [S03-09](./S03-09-fbr-rate-manual-entry.md) | Lawyer Manually Enters FBR Tax Rates (WHT & CGT) | P0 | Done |
| [S03-10](./S03-10-property-type-selector.md) | Property Type Selector (Plot / House / Agriculture) | P0 | Done |
| [S03-11](./S03-11-plot-logic-land-only.md) | Plot Logic — Land Only (No Malba) | P0 | Done |
| [S03-12](./S03-12-house-logic-land-plus-structure.md) | House Logic — Land + Malba/Structure Rate | P0 | Done |
| [S03-13](./S03-13-agriculture-land-logic.md) | Agriculture Land Tax Logic | P0 | Done |
| [S03-14](./S03-14-marla-kanal-size-input.md) | Marla / Kanal Size Input with Auto-Conversion | P0 | Done |
| [S03-15](./S03-15-local-commission-other-fees.md) | Local Commission & Other Fees Manual Entry | P0 | Done |
| [S03-16](./S03-16-property-value-transaction-input.md) | Property Value & Transaction Input | P0 | Done |
| [S03-17](./S03-17-dc-rate-market-value-inputs.md) | DC Rate & Market Value Separate Inputs | P1 | Done |
| [S03-18](./S03-18-district-tehsil-town-dc-wizard.md) | District / Tehsil / Town DC Rate Selection | P0 | Done |
| [S03-19](./S03-19-dc-rate-vs-market-value-display.md) | DC Rate vs Market Value Side-by-Side Display | P1 | Done |

---

## Tax Calculator Flow (Updated)

```
Lawyer Enters:
├── Property Size → Marla / Kanal (auto-convert)
├── Property Type → Plot / House / Agriculture
├── Province → Punjab / Sindh / KPK / Balochistan / ICT
├── Transaction Type → Sale / Gift / Inheritance / Mortgage
├── Market Value → actual transaction price (PKR)
├── DC Rate → manually entered (per Marla)
├── Malba/Structure Rate → manually entered (House only)
├── FBR WHT Rate → 3% / 6% / 10% (Buyer) + (Seller)
├── CGT Rate → manually entered
├── Local Commission Fee → fixed amount (PKR)
└── Other Fees → dynamic list (label + amount)

AI Calculates & Shows:
├── Stamp Duty
├── FBR WHT — Buyer
├── FBR WHT — Seller
├── Capital Gains Tax (CGT)
├── Local Commission
├── Other Fees (itemized)
└── GRAND TOTAL
```

---

**Epic PRD:** [EPIC-03-tax-calculator.md](../epics/EPIC-03-tax-calculator.md)
