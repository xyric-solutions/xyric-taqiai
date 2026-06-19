---
id: S05-08
epic: EPIC-05
title: Binding vs Persuasive Indicator
status: Done
priority: P1
updated: 2026-06-19
---

# S05-08 — Binding vs Persuasive Indicator

## User Story

As a lawyer, I want to see whether a judgment is binding or persuasive for my current case's court so that I know how to argue it.

## Acceptance Criteria

- [ ] Binding vs persuasive indicator shown based on lawyer's selected matter court
- [ ] Logic: SC judgments = binding for all; HC judgments = binding within same province, persuasive outside
- [ ] Indicator clearly visible in search results and judgment detail view
- [ ] Lawyer can set their matter's court to get relevant indicator

## Technical Notes

- Binding/persuasive logic table in `src/skills/LEGAL-06-judgment-intelligence.md`
- Requires lawyer to specify their current matter's court (from Matter in EPIC-06 or manual selection)
- Logic: SC → all courts (Binding); HC X → lower courts same province (Binding); HC X → other province (Persuasive)

## Definition of Done

- [ ] Binding/persuasive indicator shown per judgment
- [ ] Logic verified correct for SC, FSC, all 5 HCs
- [ ] Tested by Abdullah
- [ ] Abdullah sign-off
