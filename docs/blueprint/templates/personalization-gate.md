<!-- TEMPLATE — How to use:
  The per-stage personalization-gate record (BLUEPRINT.md Part A move 2 + Part C2). One section per
  stage. A decision belongs here ONLY if both: (1) more than one answer is defensible under best
  practice, AND (2) the right answer depends on preference/strategy/taste/brand/risk — not correctness.
  Anything best practice settles is applied silently and listed under "Applied silently", not asked.
  Every gated decision ships with the AI's recommended default + reason, so "accept defaults" is always
  a valid one-word answer. Fill a COPY. Delete this comment when done. -->

# <PRODUCT_NAME> — Personalization Gate Log

- Last updated: <YYYY-MM-DD>
- Gate status legend: `pending` (drafted, not asked) · `answered` (user chose) · `accepted-default` (user accepted AI defaults) · `locked` (folded in, stage advanced)

## Vision — status: <pending | answered | accepted-default | locked>
| # | Decision | AI default + reason | Alternatives | User answer |
|---|----------|---------------------|--------------|-------------|
| 1 | <decision> | <default + why> | <alt A, alt B> | <answer / "default"> |

**Applied silently (best practice — not asked):** <list>.

## PRD — status: <…>
| # | Decision | AI default + reason | Alternatives | User answer |
|---|----------|---------------------|--------------|-------------|
| 1 | <MoSCoW cut for v1 …> | <default + why> | <…> | <…> |

**Applied silently (best practice — not asked):** <validation, error handling, accessibility, security defaults…>.

## Architecture — status: <…>
| # | Decision | AI default + reason | Alternatives | User answer |
|---|----------|---------------------|--------------|-------------|
| 1 | <build vs buy / stack / residency …> | <default + why> | <…> | <…> |

**Applied silently (best practice — not asked):** <observability, retries, secure defaults…>.

## Phases — status: <…>
| # | Decision | AI default + reason | Alternatives | User answer |
|---|----------|---------------------|--------------|-------------|
| 1 | <v1 ambition / sequencing …> | <default + why> | <…> | <…> |

## Segments — status: <…>
| # | Decision | AI default + reason | Alternatives | User answer |
|---|----------|---------------------|--------------|-------------|
| 1 | <ordering / first-build / split …> | <default + why> | <…> | <…> |

## Gate hygiene check (run at every stage)
- [ ] No question here could be answered by best practice (if so, move it to "Applied silently").
- [ ] Every decision has a stated default + reason.
- [ ] Question count is small — the few that genuinely shape *this* product.
