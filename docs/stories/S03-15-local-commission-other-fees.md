---
id: S03-15
epic: EPIC-03
title: Local Commission & Other Fees Manual Entry
status: Done
priority: P0
updated: 2026-06-19
---

# S03-15 — Local Commission & Other Fees Manual Entry

## User Story

As a lawyer, I want to enter local commission fee and any other applicable fees so that the total tax calculation includes every cost my client will pay.

## Acceptance Criteria

- [x] Local Commission included in the calculation
- [x] All applicable fees included in the final Total
- [x] Itemized breakdown shows: Stamp Duty + CVT + Registration Fee + PLRA + WHT Buyer + WHT Seller + Capital Gains + Local Commission = Grand Total
- [x] Printable summary includes all fees with labels

## Technical Notes

- Local Commission computed/included in the grand total
- Grand Total = all tax lines + local commission
- Live UI route: `/property-transfer/tax-calculator`

## Definition of Done

- [x] Local commission included
- [x] Grand total includes all fees
- [x] Printable summary shows complete breakdown
- [x] Abdullah sign-off
