# TaqiAI - Terminology

> **Source:** Product Vision v1.0, Pakistan Legal System Reference
> **Last Updated:** 2026-06-19

---

## Core Product Terms

| Term | Definition | Usage Notes |
|------|------------|-------------|
| **Forward Mode** | Facts → Draft: Generate legal documents from case facts | Primary drafting workflow |
| **Reverse Mode** | Judgment → Analysis: Decompose solved cases into structured components | Primary analysis workflow |
| **Validation Mode** | Compare AI output against known-good documents | Quality assurance workflow |
| **Bidirectional Testing** | Testing both Forward and Reverse modes against solved cases | Core testing methodology |
| **Solved Case** | A case with known judgment/outcome used for AI accuracy testing | Input corpus for validation |

---

## Built Product Features (Live)

| Term | Definition | Usage Notes |
|------|------------|-------------|
| **Case Builder** | Judgment-backed drafting: build a case document grounded in retrieved judgments | Drafting workflow that pulls precedent into the draft |
| **Voice Case** | Record/upload an advocate–client discussion → AI analysis → drafted case document | `/voice-case`; discussion → draft pipeline |
| **Copy from Photo** | Upload a photo/scan of a document; AI transcribes it same-to-same (OCR) | `/copy-from-photo`; reuses document-extract OCR |
| **Statute Search** | Look up a Pakistani statute section (PPC, CrPC, CPC, QSO, etc.) with citation-safe explanation | `/statute-search` |
| **Judgment Intelligence** | Search, retrieve, summarize, and analyze Pakistani court judgments across courts | `/case-law`; backed by judgments.db |
| **Chamber / Case Management** | The single matter/case manager — track matters, hearings, linked documents, client phone | `/chamber`; one manager (LegalCase/cases retired) |
| **Lawyer Diary / Roznamcha** | Hearing/cause-list diary of upcoming dates and tasks | Roznamcha = the traditional cause-list/diary term |
| **Document Vault** | "My Documents" — the lawyer's stored/saved drafts and uploads | Storage, no LLM reasoning |
| **AI Advisor** | Conversational, judgment-grounded legal guidance (ChatGPT-style) | Replies conversationally; cites judgments when relevant |
| **Translation** | Legal translation across Urdu ⇄ English ⇄ Arabic, free and template-based | Live trilingual support |

---

## Pakistani Legal System Terms

### Criminal Law

| Term | Definition | Statute |
|------|------------|---------|
| **PPC** | Pakistan Penal Code 1860 — defines criminal offenses | Primary criminal law |
| **CrPC** | Code of Criminal Procedure 1898 — criminal court procedure | Criminal procedure |
| **FIR** | First Information Report — initial police report of a crime | CrPC Section 154 |
| **Challan** | Police report/charge sheet submitted to court after investigation | CrPC Section 173 |
| **Section 302** | Murder charge under PPC | PPC Section 302 |
| **Section 34** | Common intention — joint criminal liability | PPC Section 34 |
| **Bail** | Release from custody pending trial | CrPC Sections 496-498 |
| **Pre-arrest Bail** | Bail granted before arrest (anticipatory bail) | CrPC Section 498 |
| **Post-arrest Bail** | Bail granted after arrest | CrPC Section 497 |
| **Qisas** | Retribution — equal punishment for harm caused | Qisas & Diyat Ordinance |
| **Diyat** | Blood money — compensation to victim's family | Qisas & Diyat Ordinance |
| **Hudood** | Islamic criminal law offenses with fixed punishments | Hudood Ordinances 1979 |

### Civil Law

| Term | Definition | Statute |
|------|------------|---------|
| **CPC** | Code of Civil Procedure 1908 — civil court procedure | Civil procedure |
| **Plaint** | Statement of claim filed by plaintiff to initiate a civil suit | CPC Order VII |
| **Written Statement** | Defendant's response to the plaint | CPC Order VIII |
| **Suit** | Civil case filed in court | CPC general |
| **Decree** | Final order of the court in a civil case | CPC Section 2(2) |
| **Order** | Intermediate court direction during proceedings | CPC general |
| **Injunction** | Court order preventing a party from doing something | CPC Order XXXIX |
| **Specific Relief** | Court orders for specific performance of contracts | Specific Relief Act 1877 |

### Evidence Law

| Term | Definition | Statute |
|------|------------|---------|
| **Qanun-e-Shahadat** | Law of Evidence Order 1984 — rules of evidence in Pakistan | Replaces Indian Evidence Act |
| **Tazkiyah-al-Shuhood** | Impeachment/testing credibility of witnesses | QSO Article 151 |
| **Shahadah** | Oral testimony given under oath | QSO Article 3 |

### Court System

| Term | Definition |
|------|------------|
| **Supreme Court** | Highest court of Pakistan — binding precedent nationwide |
| **High Court** | Provincial appellate courts (Lahore, Sindh, Peshawar, Balochistan, Islamabad) |
| **District Court** | Trial courts at district level |
| **Sessions Court** | Criminal trial courts at district level |
| **Civil Judge** | Presides over civil cases at district level |
| **Magistrate** | Handles minor criminal cases and remand |

### Case Law Reporters

| Abbreviation | Full Name | Coverage |
|-------------|-----------|----------|
| **PLD** | Pakistan Legal Decisions | Supreme Court + High Courts |
| **SCMR** | Supreme Court Monthly Review | Supreme Court only |
| **CLC** | Civil Law Cases | Civil cases |
| **PLC** | Pakistan Labour Cases | Labour law |
| **YLR** | Yearly Law Reporter | Mixed |
| **NLR** | National Law Reporter | Mixed |
| **MLD** | Monthly Law Digest | Mixed |
| **PCrLJ** | Pakistan Criminal Law Journal | Criminal cases |

---

## Document Types

| Document | Civil/Criminal | Filed By | Purpose |
|----------|---------------|----------|---------|
| **Plaint** | Civil | Plaintiff | Initiate civil suit |
| **Written Statement** | Civil | Defendant | Respond to plaint |
| **Bail Application** | Criminal | Defendant | Seek release from custody |
| **Criminal Appeal** | Criminal | Either | Challenge conviction/acquittal |
| **Writ Petition** | Constitutional | Either | Challenge government action |
| **Civil Appeal** | Civil | Either | Challenge decree |
| **Review Petition** | Either | Either | Request court reconsider its own order |
| **Application u/s 22-A** | Criminal | Complainant | Direct magistrate to register FIR |
