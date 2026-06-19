---
id: S13-02
epic: EPIC-13
title: Filter Documents by Category
status: Done
priority: P0
---

# S13-02 — Filter Documents by Category

## User Story

As a lawyer, I want to filter my documents by category so that I can narrow down to the type of document I need.

## Acceptance Criteria

- [x] Documents can be filtered by category (copy-from-photo, affidavits, agreements, etc.)
- [x] Filter updates the list to show only documents in the selected category
- [x] Clearing the filter restores the full list

## Technical Notes

- Category metadata stored on the `Document` model
- Filtering applied to the `/documents` list

## Definition of Done

- [x] Category filter working across all categories
- [x] List updates correctly on filter change
- [x] Abdullah sign-off
