# TaqiAI - Constraints

> **Source:** Product Vision v1.0
> **Last Updated:** 2026-06-19

---

## Accuracy Constraints

| Constraint | Target | Context |
|------------|--------|---------|
| Hallucination rate | <10% for citations | Stanford study found 17-33% in current legal AI; we must beat this |
| Argument completeness | >80% | AI should identify at least 80% of arguments a lawyer would make |
| Citation accuracy | >90% | Law sections and case references must be real and applicable |
| Structural compliance | 100% | Output must follow Pakistani court formatting requirements |

---

## Jurisdictional Constraints

| Constraint | Requirement |
|------------|-------------|
| **Legal system** | Pakistani legal system (British common law base + Islamic law elements) |
| **Criminal law** | Pakistan Penal Code (PPC) 1860, CrPC 1898 |
| **Civil procedure** | Code of Civil Procedure (CPC) 1908 |
| **Evidence law** | Qanun-e-Shahadat Order 1984 |
| **Language** | English + Urdu are LIVE (bilingual by default). Arabic is also supported in the Translation feature (Urdu ⇄ English ⇄ Arabic). No longer an open decision. |
| **Court hierarchy** | Supreme Court > High Courts (Lahore, Sindh, Peshawar, Balochistan, Islamabad) > District/Sessions Courts |
| **Precedent authority** | Binding: Supreme Court; Persuasive: High Courts across provinces |

---

## Ethical Constraints

| Constraint | Policy |
|------------|--------|
| **No legal advice** | TaqiAI is a drafting tool, not a lawyer — all output requires lawyer review |
| **No bias** | Equal capability for plaintiff AND defendant; prosecution AND defense |
| **Transparency** | AI-generated content must be clearly labeled as AI-assisted |
| **Confidentiality** | Case data must not be used to train models or shared between users |
| **Professional responsibility** | Output must comply with Pakistan Bar Council professional conduct rules |

---

## Regulatory Constraints

| Constraint | Status |
|------------|--------|
| Pakistan Bar Council regulations | Must comply — no unauthorized practice of law |
| Data protection | Pakistan's Personal Data Protection Bill (pending) — design for compliance |
| Electronic Transactions Ordinance 2002 | Governs electronic legal documents |
| Court e-filing requirements | Output format must support court submission standards |

---

## Technical Constraints (Phase 1 — Internal Skills)

| Constraint | Requirement |
|------------|-------------|
| **No app** | Phase 1 is Claude skills only — no web app, no database |
| **Input format** | PDF or pasted text for case documents |
| **Output format** | Structured markdown with legal formatting |
| **Testing** | Solved cases only — no live case testing until accuracy is proven |
| **Human review** | Every AI output must be reviewed by a qualified Pakistani lawyer |

---

## Known Limitations

| Limitation | Mitigation |
|------------|------------|
| LLM hallucination of citations | Multi-stage verification pipeline; solved case testing |
| Incomplete case law coverage | Start with Supreme Court + Lahore High Court; expand incrementally |
| Urdu language content | RESOLVED — English + Urdu are live (bilingual by default); Arabic supported in Translation |
| Real-time law updates | Manual knowledge updates until automated pipeline built |
| Court-specific local rules | Start with general procedure; add court-specific rules over time |
