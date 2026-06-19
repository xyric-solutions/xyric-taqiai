---
id: S03-04
epic: EPIC-03
title: Buyer & Seller Role & Filer Status
status: Done
priority: P0
updated: 2026-06-19
---

# S03-04 — Buyer & Seller Role & Filer Status

## User Story

As a lawyer, I want to specify whether the client is buyer or seller so that the correct tax liability is shown for each party.

## Acceptance Criteria

- [x] Buyer filer status input: Filer / Non-filer
- [x] Seller filer status input: Filer / Non-filer
- [x] FBR WHT calculated separately for buyer and seller based on filer status
- [x] Output clearly labels which taxes apply to buyer vs seller

## Technical Notes

- Inputs: Buyer filer status + Seller filer status
- Filer / non-filer step in the calculator flow
- FBR WHT rates differ for filer vs non-filer — rate tables hardcoded in the calculator

## Definition of Done

- [x] Buyer/seller filer status inputs working
- [x] WHT calculated correctly for both filer and non-filer scenarios
- [x] Output clearly separates buyer-side and seller-side taxes
- [x] Verified accurate by legal team
- [x] Abdullah sign-off
