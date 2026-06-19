---
id: S01-01
epic: EPIC-01
title: Template Categories Dashboard
status: Done
priority: P0
updated: 2026-06-19
---

# S01-01 — Template Categories Dashboard

## User Story

As a lawyer, I want to see the main template categories (Affidavits, Agreements, Family Law, etc.) directly on my dashboard so that I can start drafting quickly — and request additional templates through an edit option if needed.

> **Built & Live:** The template library is live with 50+ templates across 13 legal categories (Affidavits ~46, Agreements ~30, Applications, Power of Attorney, etc.). Category cards on the dashboard navigate to the correct template lists.

## Acceptance Criteria

- [x] Main template categories displayed on dashboard: Affidavits, Agreements, Family Law, Property Documents, Court Documents
- [x] Remaining templates accessible via "Edit / Custom Request" option
- [x] Each category card navigates to the correct template list
- [x] All template categories fully covered per English-Templates-Catalog.md

## Technical Notes

- Dashboard pages: `src/app/(dashboard)/`
- Template library: `src/templates/`
- Review `English-Templates-Catalog.md` before development — template count and coverage must be confirmed

## Definition of Done

- [ ] Category dashboard renders correctly with all required categories
- [ ] "Edit / Custom Request" option visible and functional
- [ ] Tested by at least 1 lawyer in real drafting scenario
- [ ] Abdullah sign-off
