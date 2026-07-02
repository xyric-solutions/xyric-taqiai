---
id: S03-02
epic: EPIC-03
title: Itemized Tax Breakdown Display
status: Done
priority: P0
updated: 2026-06-19
---

# S03-02 — Itemized Tax Breakdown Display

## User Story

As a lawyer, I want to see an itemized breakdown (Stamp Duty, PLRA, FBR WHT, CGT) so that I can explain every charge to my client clearly.

## Acceptance Criteria

- [x] Output shows all tax lines: Stamp Duty, CVT, Registration Fee, PLRA, FBR WHT (Buyer), FBR WHT (Seller), Capital Gains, Local Commission
- [x] Subtotals shown: Total payable by Buyer, Total payable by Seller, Grand Total
- [x] All tax rates labeled with source (FBR / Provincial) and last-updated date
- [x] Output verified accurate against manual calculation

## Technical Notes

- Live UI route: `/property-transfer/tax-calculator`
- Rule-based/deterministic computation; rate tables hardcoded
- Printable summary available

## Definition of Done

- [x] All tax types displayed individually
- [x] Buyer total, seller total, and grand total shown
- [x] Rate source and last-updated date visible
- [x] Verified accurate by legal team
- [x] Abdullah sign-off
