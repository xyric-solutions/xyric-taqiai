---
id: S11-03
epic: EPIC-11
title: Suggested Document Type Detection
status: Done
priority: P0
created: 2026-06-19
---

# S11-03 — Suggested Document Type Detection

## User Story

As a lawyer, I want the AI to detect and suggest the appropriate document type so that I know what to file.

## Acceptance Criteria

- [x] AI suggests a document type based on the analysis
- [x] Suggested type covers common documents (e.g. Bail Application, Writ Petition, Khula Petition)
- [x] Suggested document type is displayed to the lawyer before drafting
- [x] Suggestion is produced as part of the case analysis output

## Technical Notes

- Suggested document type returned by `POST /api/ai/case-analysis`
- Drives which document `smart-draft` produces
- Skill spec: LEGAL-07 (Voice Intake)

## Definition of Done

- [x] Document-type detection working
- [x] Suggested type shown before drafting
- [x] Abdullah sign-off
