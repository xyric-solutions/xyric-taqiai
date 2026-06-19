# EPIC-13 — Document Vault (My Documents)

---

## Epic Metadata

| Field | Detail |
|-------|--------|
| Epic ID | EPIC-13 |
| Owner | Abdullah |
| Author | Hamza |
| Status | Built — Live |
| Priority | 6 — High |
| Estimated Effort | 1–2 Sprints |
| Depends On | EPIC-01 (Drafting Engine) |
| Can Run In Parallel With | EPIC-06 |
| Route | `/documents` |
| Last Updated | 2026-06-19 |

---

## Goal

Give every lawyer a central repository for all AI-generated legal documents — a single place to find, filter, search, preview, edit, and delete every draft the system has produced, so no document is ever lost across the app's many generators.

---

## Background

TaqiAI generates documents across many features — copy-from-photo typing, affidavits, agreements, voice-case drafts, and more. Without a central vault, each document is stranded in the flow that created it. This Epic builds "My Documents": one list of every document the lawyer has generated, with title, category, subtype, language, and creation date/time, plus filtering by category, search by title/subtype, inline preview and edit, and confirmed deletion. It is the lawyer's library — the durable home for everything the AI drafts.

---

## Sub-Modules

| ID | Sub-Module | Description |
|----|-----------|-------------|
| A | Document List | Show every generated document with full metadata |
| B | Filter & Search | Filter by category; search by title / subtype |
| C | Preview & Edit | Open a document, preview it, and inline-edit it |
| D | Delete | Remove a document with a confirmation step |

---

## Document Metadata

Each document in the vault carries:

| Field | Description |
|-------|-------------|
| Title | Document title |
| Category | Source category (copy-from-photo, affidavits, agreements, etc.) |
| Subtype | Specific document subtype within the category |
| Language | Document language |
| Created | Creation date and time |

---

## User Stories

| ID | User Story | Priority | Story File |
|----|-----------|---------|-----------|
| US-13-01 | As a lawyer, I want a list of all my AI-generated documents with title, category, subtype, language, and creation date/time so that I can find any document I made | Must Have | [S13-01](../stories/S13-01-document-list.md) |
| US-13-02 | As a lawyer, I want to filter documents by category so that I narrow down to the type I need | Must Have | [S13-02](../stories/S13-02-category-filter.md) |
| US-13-03 | As a lawyer, I want to search documents by title or subtype so that I find a specific document fast | Must Have | [S13-03](../stories/S13-03-search-by-title-subtype.md) |
| US-13-04 | As a lawyer, I want to preview and inline-edit a document so that I can review and adjust it without leaving the vault | Must Have | [S13-04](../stories/S13-04-preview-and-edit.md) |
| US-13-05 | As a lawyer, I want to delete a document with a confirmation so that I remove drafts I no longer need without accidental loss | Should Have | [S13-05](../stories/S13-05-delete-with-confirmation.md) |

---

## Acceptance Criteria

| # | Criteria | Status |
|---|----------|--------|
| AC-01 | Document list shows every user document with title, category, subtype, language, creation date/time | [x] |
| AC-02 | List can be filtered by category (copy-from-photo, affidavits, agreements, etc.) | [x] |
| AC-03 | List can be searched by title and by subtype | [x] |
| AC-04 | A document can be previewed | [x] |
| AC-05 | A document can be inline-edited | [x] |
| AC-06 | A document can be deleted with a confirmation step | [x] |
| AC-07 | Document detail available at `/documents/{id}` | [x] |
| AC-08 | Data persisted via Prisma `Document` model with local document-store fallback | [x] |
| AC-09 | APIs implemented: `GET`/`POST` `/api/documents`; `GET`/`PUT`/`DELETE` `/api/documents/{id}` | [x] |
| AC-10 | All documents are per-user — lawyer sees only their own documents | [x] |
| AC-11 | Page is usable on mobile screen (375px+) | [x] |

---

## Success Metrics

| Metric | Target | How to Measure |
|--------|--------|---------------|
| Document list load time | < 2 seconds | Performance logs |
| Time to find a specific document | < 30 seconds | UX timing in beta testing |
| Search relevance (title/subtype) | Abdullah confirms accurate | Manual review |
| Accidental deletions | 0 | Confirmation step enforced |
| Daily active use | Track in analytics | Dashboard analytics |

---

## Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Documents from some generators not saved to the vault | Medium | High | Route all generators through `POST /api/documents` |
| Accidental deletion of an important document | Medium | High | Require explicit confirmation before delete |
| Prisma write failure loses a document | Low | High | Local document-store fallback alongside Prisma |
| List grows large and hard to navigate | Medium | Medium | Category filter + title/subtype search |

---

## Technical Notes

| Component | Detail |
|-----------|--------|
| Route / Page | `/documents` (list) and `/documents/{id}` (detail) |
| DB Entity | Prisma `Document` model with local document-store fallback |
| APIs | `GET`/`POST` `/api/documents`; `GET`/`PUT`/`DELETE` `/api/documents/{id}` |
| Metadata | title, category, subtype, language, created date/time |
| Filter / search | Filter by category; search by title / subtype |
| Preview & edit | Inline preview and edit on the detail page |
| Per-user isolation | All queries scoped to `userId` — consistent with PRD Q9 decision |
| Mobile optimization | List and detail must render cleanly on 375px viewport |

---

## Definition of Done

| # | Condition |
|---|-----------|
| 1 | All User Stories (US-13-01 to US-13-05) implemented and merged |
| 2 | All Acceptance Criteria (AC-01 to AC-11) verified and checked off |
| 3 | Document list shows all metadata correctly |
| 4 | Category filter and title/subtype search working |
| 5 | Preview and inline edit working on `/documents/{id}` |
| 6 | Delete requires confirmation and works |
| 7 | Prisma + local fallback persistence verified |
| 8 | Deployed to production (live) with no critical bugs |
| 9 | Abdullah has reviewed and signed off |

---

## Out of Scope

| Feature | Reason |
|---------|--------|
| Folder / nested-tree organization | Category filter + search covers v1 |
| Sharing documents with other users | v1.5 — collaboration feature |
| Version history per document | v1.5 |
| Linking documents to chamber matters | Covered by Chamber Management (EPIC-06) document linking |

---

## Dependencies

| Dependency | Why Needed |
|-----------|-----------|
| EPIC-01 (Drafting Engine) | Source of AI-generated documents stored in the vault |
| Prisma schema | `Document` model |
| Local document-store | Fallback persistence |
| Abdullah UX validation | Vault list + edit flow must match real practice |

---

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-06-19 | Hamza | Initial epic documented from built feature |
