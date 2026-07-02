# EPIC-01 — Document Templates & AI Drafting Engine

---

## Epic Metadata

| Field | Detail |
|-------|--------|
| Epic ID | EPIC-01 |
| Owner | Abdullah |
| Author | Abdullah |
| Status | Built — Live |
| Priority | 1 — Critical (Build First) |
| Estimated Effort | 3–4 Sprints |
| Depends On | Auth System (lawyer login must work) |
| Can Run In Parallel With | EPIC-03 |
| Last Updated | 2026-06-19 |

---

## Goal

Enable lawyers to draft accurate, court-ready Pakistani legal documents in under 5 minutes using AI — available in both Urdu and English.

---

## Background

This is the core feature of the system and it is **built and live**. A comprehensive template library is shipped — **50+ document templates across 13 legal categories** (Affidavits ~46 types, Agreements ~30 types, Applications, Family Law, Civil Law, Criminal Law, Corporate Law, Constitutional Law, Property Law, Tax Law, Immigration Law, Non-Muslim Laws, Power of Attorney). Each master template can generate multiple sub-variants dynamically — for example, a single affidavit template produces property, identity, or surety affidavits depending on the facts provided. AI only fills in the facts; the legal structure is fixed and never altered by AI. Drafting runs through `POST /api/ai/smart-draft` (Gemini, analyze → generate). Bilingual English/Urdu drafting is live, and mandatory lawyer review before export still applies.

---

## Document Categories Covered (Built — 13 categories, 50+ templates live)

| Category | Includes |
|----------|---------|
| Affidavits & Declarations | ~46 affidavit types, NOC, NEC, Indemnity Bonds, declarations |
| Agreements | ~30 agreement types including sale, rent, partnership |
| Applications | Court and general applications |
| Family Law | Divorce, marriage, adoption, maintenance, custody documents |
| Civil Law | Civil suits, applications, and related filings |
| Criminal Law | Criminal complaints, bail, and related filings |
| Corporate Law | Company and corporate documents |
| Constitutional Law | Writ/constitutional petitions |
| Property Law | Property transfer and registry-related documents |
| Tax Law | Tax-related legal documents |
| Immigration Law | Immigration-related documents |
| Non-Muslim Laws | Documents specific to non-Muslim personal law |
| Power of Attorney | General and special power of attorney documents |

> **Note:** The template library is built and live with 50+ templates across the 13 categories above. The exact template list is maintained in `English-Templates-Catalog.md`.

---

## User Stories

| ID | User Story | Priority |
|----|-----------|---------|
| US-01-01 | As a lawyer, I want to see the main template categories (Affidavits, Agreements, Family Law, etc.) directly on my dashboard so that I can start drafting quickly — and request additional templates through an edit option if needed | Must Have |
| US-01-02 | As a lawyer, I want to fill a simple form with my client's facts so that AI generates a complete legal draft automatically | Must Have |
| US-01-03 | As a lawyer, I want to choose between 2-3 AI-generated draft variants so that I can pick the best fit for my client | Should Have |
| US-01-04 | As a lawyer, I want to edit the AI draft inline so that I can correct any details before finalizing | Must Have |
| US-01-05 | As a lawyer, I want to export the final document as a PDF so that I can submit it to court or share with the client | Must Have |
| US-01-06 | As a lawyer, I want templates available in both Urdu and English so that I can serve diverse clients | Must Have |
| US-01-07 | As a lawyer, I want my drafts saved automatically so that I can access them later from my dashboard | Must Have |
| US-01-08 | As a lawyer, I want to see which facts are required vs optional before filling the form so that I don't waste time | Should Have |
| US-01-09 | As a lawyer, I want to see an error message if AI fails to generate so that I know what to do next | Must Have |

---

## Acceptance Criteria

| # | Criteria | Status |
|---|----------|--------|
| AC-01 | Main template categories (Affidavits, Agreements, Family Law, Property Documents, Court Documents) are displayed on the dashboard — remaining templates are accessible via an "Edit / Custom Request" option | [ ] |
| AC-02 | DynamicForm correctly collects all required case facts per template type | [ ] |
| AC-03 | AI generates a full draft within **60 seconds** of form submission | [ ] |
| AC-04 | 2-3 draft variants are offered where applicable (clarify-then-draft mode) | [ ] |
| AC-05 | Inline editing of AI draft works without page reload | [ ] |
| AC-06 | PDF export works correctly with **Urdu Nastaliq font preserved** | [ ] |
| AC-07 | Documents are saved to Prisma `Document` model after generation | [ ] |
| AC-08 | Lawyer must explicitly click "Approve & Export" before final PDF is generated | [ ] |
| AC-09 | Every exported document logs: lawyer name + timestamp + template used | [ ] |
| AC-10 | Templates available in both Urdu and English (language selector on form) | [ ] |
| AC-11 | All template categories fully covered (confirmed via English-Templates-Catalog.md review) | [ ] |
| AC-12 | Required vs optional fields clearly marked in the form | [ ] |
| AC-13 | Clear error message shown if AI generation fails, with retry option | [ ] |

---

## Success Metrics

| Metric | Target | How to Measure |
|--------|--------|---------------|
| Draft generation time | < 60 seconds | Automated timing logs |
| Total templates available | 50+ templates live across 13 categories | Catalog count |
| Lawyer edit ratio (% of AI output modified) | < 20% | Track edits before approval |
| PDF export success rate | > 99% | Export error logs |
| Documents generated per lawyer per month | Track & grow | Dashboard analytics |
| AI generation failure rate | < 1% | Error logs |

---

## Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| AI generates legally incorrect draft | Medium | High | Legal structure fixed in templates — AI only fills facts, never changes structure |
| Urdu Nastaliq font broken in PDF export | Medium | High | Test across all major browsers before launch; use html2pdf with font embedding |
| Gemini API slow or unavailable | Medium | High | Fallback chain in `gemini.ts`; show loading state with timeout message |
| Lawyer skips approval and exports wrong document | Low | High | "Approve & Export" is the only export path — no bypass possible in UI |
| Template catalog has gaps | Medium | Medium | Full review of `English-Templates-Catalog.md` required before development |

---

## Drafting Modes

| Mode | How It Works | When to Use |
|------|-------------|------------|
| Auto-draft → Inline Edit | AI generates full draft, lawyer edits inline | Standard documents |
| Clarify-then-Draft | AI asks clarifying questions first, then drafts | Complex or ambiguous cases |
| Variant Selection | AI produces 2-3 variants, lawyer picks one | When multiple legal approaches exist |
| Hybrid | Combination of above modes | Complex documents with multiple sections |

---

## Technical Notes

> Reuse existing code — do not rebuild from scratch.

| Component | File Path | Purpose |
|-----------|-----------|---------|
| Smart Draft API | `POST /api/ai/smart-draft` | Live drafting endpoint (Gemini, analyze → generate) |
| Drafting Logic | `src/lib/draft-generator.ts` | Core AI drafting engine |
| Template Library | `src/templates/` | Existing Pakistani legal templates |
| Form Rendering | `src/components/forms/DynamicForm.tsx` | Schema-driven form — handles all template inputs |
| Document Preview | `src/components/documents/DocumentPreview.tsx` | Inline edit + preview of AI draft |
| Dashboard Pages | `src/app/(dashboard)/` | Existing page routes for document types |
| AI Generation | `src/lib/gemini.ts` | Gemini API wrapper with fallback chain |
| AI Helper | `src/lib/gemini-helper.ts` | Helper functions for prompting |
| Database | Prisma `Document` model | Save and retrieve drafts |
| i18n | `src/i18n/` | Urdu/English translation layer |
| PDF Export | `html2pdf.js` (in package.json) | PDF generation from HTML |

---

## Definition of Done

This Epic is complete when **all** of the following are true:

| # | Condition |
|---|-----------|
| 1 | All User Stories (US-01-01 to US-01-09) are implemented and merged |
| 2 | All Acceptance Criteria (AC-01 to AC-13) are verified and checked off |
| 3 | Tested by at least 2 real lawyers in a real-world drafting scenario |
| 4 | PDF export verified across Chrome, Firefox, and Edge |
| 5 | Urdu Nastaliq rendering confirmed working |
| 6 | Deployed to staging environment with no critical bugs |
| 7 | Product Owner (Abdullah) has reviewed and signed off |

---

## Out of Scope

| Feature | Reason |
|---------|--------|
| Case tracking or court date management | Separate product scope |
| Client CRM or client-facing portal | Out of v1 focus |
| Billing or invoicing | Post-launch module |
| Template creation/editing by lawyers | Admin-only in v1 |

---

## Dependencies

| Dependency | Why Needed |
|-----------|-----------|
| Auth System working | Lawyer must be logged in to save drafts |
| Prisma `Document` model with correct schema | Required for saving and retrieving drafts |
| Gemini API key configured in `.env` | Required for AI draft generation |
| `English-Templates-Catalog.md` reviewed | Template count and coverage must be confirmed |

---

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-04-27 | Abdullah | Initial Epic created |
| 1.1 | 2026-04-27 | Abdullah | Removed 120+ count, fixed inconsistency, added Metadata, Risks, DoD, Version History, converted AC and Out of Scope to tables |
| 1.2 | 2026-06-19 | Hamza | Updated to reflect built & live implementation |
