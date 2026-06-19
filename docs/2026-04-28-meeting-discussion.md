# TaqiAI Strategy & Product Direction Meeting

## Meeting Overview

| Field | Details |
|-------|---------|
| **Date** | 2026-04-28 |
| **Attendees** | Hamza, Abdullah (Lawyer), Taqi (Lawyer) |
| **Duration** | ~73 minutes |
| **Purpose** | Align on TaqiAI product direction, review existing work, and define next steps |
| **Recording** | `PLAYGROUND/Lahore 20.m4a` |
| **Location** | Lahore |

---

## Executive Summary

The team reviewed the TaqiAI product vision and existing prototype work. After extensive discussion about AI capabilities and limitations in the Pakistani legal context, they aligned on a focused strategy: **Drafting Engine + Case Analyzer** as the two core features, with **AI Legal Advisor removed** from the initial launch. Affidavit templates are the immediate priority (straightforward, buildable now), followed by court judgment analysis (higher value, more complex). The meeting surfaced critical technical challenges around Urdu handwriting recognition and data sourcing for judgments.

---

## Discussion Threads

### Thread 1: Existing Legal Platforms & Competition

**Context**: Opening discussion reviewing the competitive landscape

**Key Points**:
The team discussed DG Lawyer, an existing Pakistani legal document platform. They also referenced "Hey Lawyer," an Indian platform that hasn't entered Pakistan. Abdullah demonstrated his existing website prototype with document templates. The team agreed they need to differentiate from what's already available on DG Lawyer and create something new.

> *"Hey Lawyer India mein hai, Hey Lawyer idhar nahi aaye abhi tak"* [Hey Lawyer is in India, hasn't come here yet]
> — Taqi

> *"DG Lawyer par padi hai, humein kuch naya karein"* [It's all on DG Lawyer, we need to do something new]
> — Abdullah

**Where This Landed**: Agreement that the existing DG Lawyer platform is the baseline — TaqiAI needs to offer something meaningfully different.

---

### Thread 2: Legal Document Templates & Affidavits

**Context**: Abdullah showcased the prototype's document structure

**Key Points**:
Abdullah's prototype categorizes documents into: Affidavits, Agreements, Power of Attorney, Family Law, Criminal Law. The numbers are significant — **5,000+ affidavit files, 3,000 applications, 1,300 "karar nama" (agreements), 1,200+ other templates**. These are sourced from **14,000 samples** Abdullah has collected. Documents span both Urdu and English, with Union Council documents exclusively in Urdu. The dashboard format was shown for preview purposes — actual patterns/templates still need to be properly built out for each category (divorce, criminal, etc.).

> *"Affidavits 5,000 files hain, ek karar nama 3,000, applications 1,300"*
> — Abdullah

**Where This Landed**: Affidavits are straightforward to build — clear templates exist, data is available. This is the natural starting point.

---

### Thread 3: AI Legal Advisor — Remove from Initial Launch

**Context**: Critical debate about whether to include an AI chatbot that gives legal advice

**Key Points**:
Taqi raised strong concerns about AI hallucination in legal contexts. He gave a concrete example: asking AI about a house's value — AI said 5 crore when the real value was 2 crore, because AI pulls from online data which doesn't reflect ground reality. Three specific risks identified:
1. Online data is often inaccurate for Pakistani context
2. AI doesn't know "insider" information that affects legal cases
3. AI accuracy degrades in long conversations

The team agreed to add a disclaimer line: **"Senior lawyer se ek dafa confirm karein"** [Confirm once with a senior lawyer]. Hamza drew a parallel to the DR AI healthcare product — you can't just release a chatbot claiming to be a doctor without proper model training and approvals. The same principle applies to legal advice.

> *"AI galtiyan kar sakti hain... accuracy kam hoti hai"* [AI can make mistakes... accuracy drops]
> — Taqi

> *"Hum yeh qanuni tahqiq nahi keh sakte"* [We cannot call this legal research]
> — Taqi

> *"I don't think we should have AI legal advisor. At this stage we should not have it."*
> — Hamza

**Where This Landed**: **AI Legal Advisor is removed from the initial product.** No chatbot giving legal advice. Instead, the AI works within a structured framework (templates + case analysis), not open-ended conversation.

---

### Thread 4: Core Product Focus — Drafting Engine + Case Analyzer

**Context**: Hamza presented the Vision Document to align everyone

**Key Points**:
Hamza walked through the TaqiAI Vision Document, seeking alignment. The vision describes an **"AI-powered legal platform designed for lawyer-in-the-loop workflow."** After discussion, three features were identified as the focused scope:

1. **Drafting Engine** — Master templates for Pakistani court documents. AI fills in case-specific facts and arguments. Templates are specific (bail application, divorce petition, etc.) with structured outputs, not open-ended generation.

2. **Case Analyzer** — Decompose court judgments into structured breakdowns: facts, issues, arguments, citations, reasoning. This is the **backbone** — it feeds the Drafting Engine with precedent data.

3. **Tax Calculator** — Simple, kept basic. FBR is evolving rapidly. Possibly separate product later. For now, just basic property tax calculations.

The key insight: Case Analyzer processes historic judgments — produces structured data — Drafting Engine uses that data to generate documents. They are complementary.

> *"These three things I feel like should be the focus: drafting engine, case analyzer... If we can do these two things, this is enough."*
> — Hamza

> *"Case analyzer takes all the previous historic judgments, breaks them down, structure dekhte hain... gives it to the drafting engine. Drafting engine aake woh template bana de."*
> — Hamza

**Where This Landed**: Two core features confirmed: **Case Analyzer + Drafting Engine.** Tax calculator stays simple. AI Legal Advisor removed.

---

### Thread 5: Urdu Handwriting Recognition Challenge

**Context**: Abdullah tested the AI's ability to read Urdu legal documents

**Key Points**:
A significant portion of the meeting was spent testing whether AI can read handwritten Urdu legal documents. This is critical because:
- Police stations write FIRs by hand in Urdu
- Registry translations are handwritten
- "Roznamcha" (daily registers) are handwritten
- Lawyers' handwriting is notoriously poor

Abdullah demonstrated the AI reading his own handwriting — it worked partially but made errors (e.g., writing "Sindhar" instead of "Saandha," missing "Lahore"). The team noted that computer-typed registry documents are more readable, but old/original documents attached to Supreme Court cases would be much harder. Taqi showed that with iterative prompting and more context, the AI's accuracy improves significantly.

> *"Yeh writing ke upar aana hai dekhna tha"* [We need to test the handwriting recognition]
> — Abdullah

> *"That's not the biggest concern... with time it'll improve."*
> — Hamza

**Where This Landed**: Handwriting recognition is a real challenge but solvable with iterative prompting and context. Not a blocker — the system will primarily work with typed documents initially.

---

### Thread 6: Data Sourcing for Judgments

**Context**: Where to get the court judgments that feed the Case Analyzer

**Key Points**:
Several data sources were discussed:
- **Supreme Court judicial system website** — paid subscription, has judgments
- **Lahore High Court** — access costs money, some judgments only exist physically in law libraries (~3,600 judgments still only in physical law libraries)
- **DG Lawyer** — has some judgment data
- **WhatsApp groups** — Taqi showed a WhatsApp group where lawyers share good judgments with case citations (e.g., "2026 LSC 75 563")
- **Web scraping** — Government websites have some data but may have access restrictions

The team discussed that decided (adjudicated) cases are **public property** — anyone can read them. The challenge is accessing them digitally, especially for lower courts.

> *"Aisi judgments hain jo Google par nahi hain... aur 3,600 aisi judgments hain jo abhi bhi law library mein milti hain"*
> [There are judgments not on Google... and 3,600 judgments still only available in physical law libraries]
> — Taqi

**Where This Landed**: Multiple data sources available. High Court website is the first target. Need to explore subscription access and systematic data collection.

---

### Thread 7: Revenue Model & Market Reality

**Context**: Discussion about how TaqiAI will make money

**Key Points**:
The team had a pragmatic discussion about the Pakistani legal market:
- **Affidavits**: Low revenue per unit — a "munshi" (street typist) charges just **100 rupees per affidavit**. Hard to compete on price alone.
- **Judgments/Case Analysis**: Higher value — lawyers pay real money for judgment access and analysis. Subscription model makes sense here.
- **Target audience**: New generation who want to DIY legal work, plus lawyers who need efficiency tools.
- **App vs Website**: Agreed on **website first**, not mobile app.

> *"Abhi tak sab munshi ke paas jata hai... yeh ek sou rupee mein milta hai"* [Everyone still goes to the typist... this costs 100 rupees]
> — Taqi

**Where This Landed**: Affidavits are the entry point (easy to build, gets users) but judgment analysis is where the real revenue lies (subscription model).

---

### Thread 8: InPage File Conversion

**Context**: The 14,000 legal templates exist in InPage format (Urdu desktop publishing software)

**Key Points**:
Abdullah has 14,000+ templates in InPage format that need to be converted to PDF. This is a significant data processing task. The conversion process was demonstrated (Ctrl+P — save as PDF from InPage), but doing it manually for 14,000 files is impractical. Salman bhai was mentioned as someone who was supposed to help but hasn't had time. Need an automated or batch solution.

**Where This Landed**: InPage — PDF conversion is a prerequisite task. Need to find an efficient batch conversion method.

---

## Key Decisions

| # | Decision | Rationale | Owner |
|---|----------|-----------|-------|
| D1 | **Remove AI Legal Advisor** from initial launch | AI hallucination risk in legal context; liability concern; no structured framework for open-ended legal advice | Hamza |
| D2 | **Focus on Drafting Engine + Case Analyzer** as core features | These two are complementary (analyzer feeds drafter) and have clear technical paths | Hamza |
| D3 | **Website first**, not mobile app | Simpler to build and iterate; court documents need larger screens | Hamza |
| D4 | **Tax Calculator stays simple** — possibly separate product later | FBR is evolving fast; tax is a separate domain; don't dilute focus | Hamza / Taqi |
| D5 | **Add disclaimer on all outputs**: "Confirm with senior lawyer" | Legal liability protection; AI outputs should not be treated as final legal advice | Taqi |
| D6 | **Affidavits first** — then Court Judgments | Affidavits are straightforward (templates exist); judgments need data sourcing and more complex AI | All |
| D7 | **Don't position as legal advice** — position as document drafting tool | Regulatory and accuracy concerns with "legal advice" framing | Taqi |

---

## Action Items

| # | Action | Owner | Priority | Due | Notes |
|---|--------|-------|----------|-----|-------|
| A1 | Complete affidavit templates and make test version live | Abdullah / Taqi | High | ASAP | Even on trial/test basis — get it deployed |
| A2 | Get access to High Court judgments database | Taqi | High | TBD | Explore DG Lawyer, direct High Court access, subscription |
| A3 | Convert InPage files (14,000) to PDF format | Abdullah / Salman | Medium | TBD | Need batch conversion method |
| A4 | Build judgment structured breakdown templates | Hamza | Medium | TBD | Facts, issues, arguments, citations, reasoning |
| A5 | Update TaqiAI Vision Document with meeting decisions | Hamza | Medium | Next session | Remove AI Legal Advisor, focus on 2 core features |
| A6 | Complete Bilal's work and put on market | Abdullah | High | ASAP | Get market response/feedback |
| A7 | Review once affidavits are complete | All | Medium | After A1 | Then decide on court cases scope |

---

## Open Questions / Parking Lot

| # | Question | Context | Revisit When |
|---|----------|---------|--------------|
| Q1 | Can AI reliably read handwritten Urdu legal documents? | Tested partially — works for typed, struggles with messy handwriting | After initial launch, as AI improves |
| Q2 | Should Tax Calculator be a separate product? | FBR is evolving; tax is a different domain entirely | After core features launched |
| Q3 | Real-time court listening feature (mic on senior lawyer) | Interesting idea but off-track for now | Post-launch, as a future feature |
| Q4 | How to access lower court judgments that are only physical? | 3,600+ judgments exist only in law libraries | When building comprehensive judgment database |
| Q5 | Revenue model: subscription vs per-document vs freemium? | Affidavits are low value (100 Rs), judgments are high value | Before launch — needs pricing strategy |
| Q6 | InPage batch conversion — automated solution? | 14,000 files manual conversion is impractical | Before A3 starts |

---

## Alignment with TaqiAI Product

This meeting directly informs the TaqiAI Vision Document at `PRODUCTS/TaqiAI/`. Key updates needed:

1. **Remove AI Legal Advisor** from initial feature set (move to future roadmap)
2. **Elevate Drafting Engine + Case Analyzer** as the two MVP features
3. **Tax Calculator** demoted to simple/basic feature
4. **Add "Lawyer-in-the-loop" principle** as a core design principle
5. **Data sourcing strategy** needs to be documented (High Court → Supreme Court → Lower Courts)
6. **Urdu document processing** is a key technical challenge to track

---

## Raw Transcript Reference

**Full Transcript**: `PLAYGROUND/recordings-processor/transcripts/Lahore 20.txt`
**Timestamped**: `PLAYGROUND/recordings-processor/transcripts/Lahore 20.srt`
**JSON (segments)**: `PLAYGROUND/recordings-processor/transcripts/Lahore 20.json`
**Language**: Urdu (primary, ~80%) with English code-switching (~20%)

---

*Document generated from meeting recording on 2026-04-28*
