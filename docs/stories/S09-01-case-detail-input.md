---
id: S09-01
epic: EPIC-09
title: Case Detail Input Form
status: Done
priority: P0
---

# S09-01 — Case Detail Input Form

## User Story

As a lawyer, I want to enter all my case details (law sections, case facts, parties, FIR, police station, court, city, document type) in one form so that I provide them only once and the rest of the workflow reuses them.

## Acceptance Criteria

- [x] INPUT stage collects law sections and case facts
- [x] Captures both parties — client and opponent names, CNICs, and addresses
- [x] Captures FIR number, police station, court name, and district/city
- [x] Captures the document type needed
- [x] Captured details persist into later stages (research, asking, generating)

## Technical Notes

- Route: `/case-builder` — INPUT is stage 1 of the multi-stage wizard
- Captured state feeds `POST /api/ai/case-prepare` and is reused by the ASKING stage pre-fill
- Skill spec: `LEGAL-06` (case context) + `LEGAL-02` (drafting intake)

## Definition of Done

- [x] All listed fields captured in the INPUT stage
- [x] Values flow through to research, asking, and generating stages
- [x] No field needs to be re-entered later in the flow
- [x] Abdullah sign-off
