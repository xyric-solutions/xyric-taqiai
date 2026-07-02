# EPIC-07 — Legal Document Translation Services

---

## Epic Metadata

| Field | Detail |
|-------|--------|
| Epic ID | EPIC-07 |
| Owner | Abdullah |
| Product | TaqiAI |
| Status | Built — Live |
| Priority | P0 |
| Created | 2026-05-04 |
| Last Updated | 2026-06-19 |

---

## Epic Goal

Provide lawyers with professional translation of Pakistani legal documents (Nikah Nama, Sale Deed, CNIC, Birth Certificate, etc.) — using fixed, pre-approved translation templates where only the variable data (names, CNIC, dates, property details) changes while the legal wording and tables stay exactly the same.

> **Built status:** Translation Services is **built and live at `/translate`**. It ships three modes: free-text translation, document image OCR + translate, and structured legal templates. Languages supported are **Urdu, English, and Arabic, bidirectionally**. Around 10 legal templates are live (Nikah Nama traditional/modern, Divorce Certificate, Sale Deed, ID Card, Birth Certificate, Fard, Mortgage Deed, Agriculture Land, Gift Deed). It also provides image OCR, rich-text editing, line-spacing control, find/navigate, AI inline edit commands, print/PDF with legal page sizes, and an attestation reminder. Live APIs: `/api/ai/translate`, `/api/ai/translate-template`, `/api/ai/translate-edit`.

---

## Problem Statement

Pakistani lawyers frequently need certified/professional translations of legal documents — for court proceedings, immigration, and property transactions. Free-form AI translation alone has problems:
- Legal wording comes out inconsistent
- Document formatting (tables) is not maintained
- The AI uses different wording each time, which is unreliable for legal acceptability

---

## Solution Approach

**Template-Based Translation Engine**: Each document type has a pre-approved translation template. The AI's only job is to extract the variable data from the source document and fill the template's blanks — the wording, tables, and structure are never changed. This template mode runs alongside the live free-text and image-OCR translation modes at `/translate`.

---

## Stories in this Epic

| Story ID | Title | Priority |
|----------|-------|----------|
| [S07-01](../stories/S07-01-template-based-legal-translation.md) | Template-Based Legal Document Translation | P0 |

---

## Document Templates (Live — ~10 templates)

| Document | Template Available |
|----------|-------------------|
| Nikah Nama (traditional) | Yes — live |
| Nikah Nama (modern) | Yes — live |
| Divorce Certificate | Yes — live |
| Sale Deed | Yes — live |
| ID Card (CNIC) | Yes — live |
| Birth Certificate | Yes — live |
| Fard | Yes — live |
| Mortgage Deed | Yes — live |
| Agriculture Land | Yes — live |
| Gift Deed | Yes — live |

> Languages: Urdu, English, and Arabic — bidirectional. Beyond templates, free-text and image-OCR translation modes are also live.

---

## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Template-based, not free translation | Legal wording must be consistent and pre-approved |
| Tables preserved as-is | Existing English templates have table formatting that must stay |
| AI only fills variables | Names, CNIC, dates, property details — no wording changes |
| English output font: Times New Roman 13pt | Standard legal document font |
| Urdu source preview font: Noori Nastaliq | Consistent with Urdu performa standards |

---

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-05-04 | Abdullah | Initial Epic created — Legal Document Translation Services |
| 1.1 | 2026-06-19 | Hamza | Updated to reflect built & live implementation |
