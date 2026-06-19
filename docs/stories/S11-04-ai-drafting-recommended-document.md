---
id: S11-04
epic: EPIC-11
title: AI Drafting of Recommended Document
status: Done
priority: P0
created: 2026-06-19
---

# S11-04 — AI Drafting of Recommended Document

## User Story

As a lawyer, I want the AI to draft the recommended document based on the analysis so that I get a usable first draft.

## Acceptance Criteria

- [x] AI drafts the recommended document type from the analysis
- [x] Draft uses the extracted parties, facts, and legal issues
- [x] Drafting runs via `POST /api/ai/smart-draft`
- [x] Draft is returned for preview and editing

## Technical Notes

- Drafting API: `POST /api/ai/smart-draft`
- Input: structured case analysis + suggested document type
- Skill spec: LEGAL-02 (Legal Drafter)

## Definition of Done

- [x] Drafting produces the recommended document
- [x] Draft reflects the case analysis
- [x] Abdullah sign-off
