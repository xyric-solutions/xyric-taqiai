---
id: S09-03
epic: EPIC-09
title: Judgment Results with Stance Badges
status: Done
priority: P0
---

# S09-03 — Judgment Results with Stance Badges

## User Story

As a lawyer, I want each suggested judgment to show why it is relevant and whether it helps or hurts my case so that I can judge its value at a glance.

## Acceptance Criteria

- [x] Each result shows citation, court, year, and title
- [x] Each result shows the reason for relevance and the key legal principle
- [x] Each result shows a stance badge: favorable / adverse / neutral
- [x] Badges are visually distinct so stance is clear at a glance

## Technical Notes

- Stance + relevance reasoning produced by `POST /api/ai/case-prepare`
- Skill spec: `LEGAL-06` (Judgment Intelligence) — stance scoring
- Output labeled "AI-generated — verify before use in court"

## Definition of Done

- [x] All listed fields rendered per result
- [x] Stance badge accuracy spot-checked by Abdullah on 30 results
- [x] Favorable / adverse / neutral states visually distinct
- [x] Abdullah sign-off
