---
id: S03-18
epic: EPIC-03
title: District / Tehsil / Town DC Rate Selection
status: Done
priority: P0
updated: 2026-06-19
---

# S03-18 — District / Tehsil / Town DC Rate Selection

## User Story

As a lawyer, I want to select District → Tehsil → Town step by step (like estamp portal) so that the correct DC rate for that exact location loads automatically.

## Acceptance Criteria

- [x] Step-by-step location/DC-rate entry within the calculator flow
- [x] Province awareness (Punjab / Sindh / KPK / Balochistan / Islamabad)
- [x] DC rate applied for the selected location

## Technical Notes

- Live UI route: `/property-transfer/tax-calculator`
- As built, rate tables are hardcoded — DC rate is entered/overridden manually (no estamp DB auto-load or scraper)
- Wizard-style step flow mirrors familiar estamp UX

## Definition of Done

- [x] Province-aware step flow functional
- [x] DC rate applied for selected location
- [x] Manual override of DC rate available
- [x] Abdullah sign-off
