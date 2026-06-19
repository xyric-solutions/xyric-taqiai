---
id: S03-09
epic: EPIC-03
title: Lawyer Manually Enters FBR Tax Rates (WHT & CGT)
status: Done
priority: P0
updated: 2026-06-19
---

# S03-09 — Lawyer Manually Enters FBR Tax Rates (WHT & CGT)

## User Story

As a lawyer, I want to manually enter the FBR Withholding Tax rate and Capital Gains Tax rate so that AI calculates the correct FBR taxes for my client's specific transaction.

## Acceptance Criteria

- [x] FBR WHT rate applied for Buyer based on filer status (built-in rate table, override available)
- [x] FBR WHT rate applied for Seller based on filer status (built-in rate table, override available)
- [x] Capital Gains computed
- [x] Calculator computes: WHT (Buyer) and WHT (Seller) on property value
- [x] Calculator computes: Capital Gains on property value
- [x] Results shown separately for Buyer and Seller

## Technical Notes

- FBR WHT rates handled by deterministic rule-based logic (filer / non-filer); rate tables hardcoded
- Lawyer can override the applicable rate where needed
- API logic is stateless — no DB dependency for FBR rates

## Definition of Done

- [x] WHT applied for both buyer and seller
- [x] Capital Gains computed
- [x] Calculator computes correct amounts from rates
- [x] Buyer and seller tax shown separately in output
- [x] Verified accurate by legal team
- [x] Abdullah sign-off
