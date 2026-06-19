---
type: catalog
title: "TaqiAI - English Template Catalog (extracted from USB)"
status: Draft (initial 7 canonical templates from 674-file sample)
owner: Abdullah
last_updated: 2026-04-22
product: taqiai
kb_summary: "Canonical English-language template patterns extracted from Abdullah's USB performa library. Each entry has structure, fields, source file, and ready-to-use template body."
---

# TaqiAI — English Template Catalog

**Source:** `C:/Users/Nuoman/Desktop/New folder/English Files/` (Abdullah's USB performa library)
**Extracted from:** ~674 of 2,276 `.docx` files (initial alphabetical batch — A–G); remaining will follow
**Method:** unzip + XML text extraction → manual pattern identification → canonical template + field schema
**Authority:** Abdullah (practicing Pakistani lawyer + legal drafter)
**Purpose:** Seed the TaqiAI template library (Brainstorm Q6 Track 1) with verified, real-practice English templates

---

## Sub-Category Counts (Initial 674-File Sample)

| Sub-category keyword | Files |
|----------------------|-------|
| AFFIDAVIT (all sub-types) | 512 |
| BLACK_LIST (no-blacklisting affidavit) | 15 |
| FOR_FINANCIAL_SUPPORT (visa sponsorship) | 12 |
| DEATH-related | 10 |
| VISA-related | 7 |
| INCOME affidavit | 5 |
| FBR-related | 5 |
| UNDERTAKING | 5 |
| BIRTH-related | 4 |
| WIDOW (re-marriage status) | 3 |
| OWNERSHIP affidavit | 3 |
| MISPLACE / LOST (lost-document) | 5 |
| MARRIAGE-related | 3 |
| DECLARATION | 30 |
| AGREEMENT | 14 |
| RESIDENCE | 2 |
| ARMS LICENSE | 1 |
| DESIGNATION change | 1 |
| EMPLOYMENT | 1 |
| FATHER NAME spelling | 1 |
| LOAN-related | 1 |

> **Note:** Remaining 1,602 files (H–Z) still being processed. POA, Sale Deed, NDA, Partnership, Karaya Nama, Iqrar Nama and many other top categories will appear once extraction reaches their alphabetical position. Catalog will be updated.

---

## Canonical Templates (with content extracted from real files)

### Template 1 — House Officer Service Affidavit

**Source:** `AFFIDAVIT.docx` (generic Mayo Hospital house-officer template)
**Sub-type:** `affidavit/house-officer-service`
**Stamp paper:** Rs. 50 (standard affidavit stamp)
**Use case:** Doctor commencing house job — declares no union activity, abides hospital rules

**Structure (verified):**
```
AFFIDAVIT

I Dr. {{deponent_name}}, S/o D/o W/o {{parent_name}}, House Officer, {{hospital_name}}, Lahore
do hereby solemnly declare and affirm as under:-

1. I will not take part in any association/union.
2. I will not take part in any subversive activities (strikes, demonstrations, slogans, etc.)
3. I will be bound to abide by the rules, regulations and orders issued by the hospital authorities.
4. I have read the rules and regulations carefully.
5. If found indulged in any such activities, my house job will be liable to be terminated without notice.
6. Being kemcolian, once I utilize my merit for honorary job, I will not claim a paid house job.
7. Being non-kemcolian, I will not claim any paid job.

Signature: ___________________________________
Name: Dr. ___________________________________
S/o, D/o, W/o ________________________________
Phone No. (Res) ______________________________
Mobile No. __________________________________
Address: _____________________________________
```

**Fields:** deponent_name, parent_name (S/o D/o W/o), hospital_name, residence_phone, mobile, address

---

### Template 2 — Widow Remarriage Status Affidavit

**Source:** `AFFIDAVIT_BLANK_WITNESS.docx`
**Sub-type:** `affidavit/widow-not-remarried`
**Stamp paper:** Rs. 50
**Use case:** Pension / Bank / Property claim — widow declares she has not remarried since husband's death

**Structure (verified):**
```
AFFIDAVIT

I, {{widow_name}} widow of {{deceased_husband_name}},
resident of {{address}},
Holder of Computerized National Identity Card No. {{cnic}},
age {{age}} years,
solemnly declare this date the {{date}} that:

1. I am widow of {{deceased_husband_name}} who has expired on {{date_of_death}}.
2. It is further declared that I, {{widow_name}}, have not remarried till date.
3. It is further declared that the above contents are correct to the best of my knowledge.

DEPONENT
({{widow_name}})

ATTESTED (Class-1 Officer)
```

**Fields:** widow_name, deceased_husband_name, address, cnic, age, date, date_of_death

---

### Template 3 — Financial Support Affidavit (Embassy / Visa)

**Source:** `AFFIDAVIT_FOR_FINACIAL_SUPPORT_Gulraiz_Butt.docx`
**Sub-type:** `affidavit/financial-support-visa`
**Stamp paper:** Rs. 50–100 (depending on consulate requirement)
**Use case:** Sponsor declares to embassy that they will finance applicant's education / stay abroad

**Structure (verified):**
```
AFFIDAVIT FOR FINANCIAL SUPPORT

I, {{sponsor_name}} S/o {{sponsor_parent}}, Resident of {{sponsor_address}},
Citizen of Pakistan, having CNIC No. {{sponsor_cnic}},
deponent of this affidavit solemnly declare as under:

1. That {{applicant_name}} S/o {{applicant_parent}} having Passport No. {{applicant_passport}},
   CNIC No. {{applicant_cnic}} is my real {{relationship}} (e.g., Brother / Son / Daughter),
   who intends to leave for {{destination_country}} in order to pursue
   {{purpose}} (e.g., his education) over there.

2. That the deponent shall finance {{applicant_name}} for his {{purpose}} and other
   miscellaneous expenses (accommodation, travelling, living expenses) during his stay in
   {{destination_country}}.

3. That currently I am working as {{designation}} at {{employer_name}} for the past
   {{tenure}}, in {{country_of_employment}}, and earning a sum of {{monthly_salary}}
   per month, with average monthly income around {{average_income}}.

4. That currently I am {{family_status}} (e.g., single / married with children) and have
   {{family_liabilities}}.

5. (Optional) That my {{relationship}} {{applicant_name}} is also working as
   {{applicant_designation}} at {{applicant_employer}} earning {{applicant_income}}.

6. That I hereby assure the concerned embassy that during his studies / stay period in
   {{destination_country}} my above-named {{relationship}} will abide by all the rules
   and regulations of the host country.

7. That my above-named {{relationship}} will return to his native country after completion
   of the {{purpose}} period and during his stay in {{destination_country}} he will not
   involve himself in any kind of criminal or illegal activities.

VERIFICATION:
Whatever stated above is true and correct to the best of my knowledge and belief
and nothing has been concealed or withheld therein.

DEPONENT
({{sponsor_name}})
CNIC No. {{sponsor_cnic}}
```

**Fields:** sponsor_name, sponsor_parent, sponsor_address, sponsor_cnic, applicant_name, applicant_parent, applicant_passport, applicant_cnic, relationship, destination_country, purpose, designation, employer_name, tenure, country_of_employment, monthly_salary, average_income, family_status, family_liabilities, applicant_designation, applicant_employer, applicant_income

---

### Template 4 — No-Blacklisting Affidavit (Procurement)

**Source:** `AFFIDAVIT_AMJAD_ALI_KHAN__COMPANY_NOT_BLACK_LIST.docx`
**Sub-type:** `affidavit/no-blacklisting-procurement`
**Stamp paper:** **Rs. 100 minimum** (per template note "[To be Printed on Stamp Paper Worth Minimum Rs. 100]")
**Use case:** Bidding on government / public procurement — declares not blacklisted

**Structure (verified):**
```
Annex-C

AFFIDAVIT OF NO BLACKLISTING
[To be Printed on Stamp Paper Worth Minimum Rs. 100]

Affidavit of: Mr. or M/s {{deponent_name}} ({{firm_or_individual_name}}),
having valid CNIC # {{cnic}},
as Individual or Firm/Company having {{residence_or_business_address}}.

Do hereby solemnly state on oath that the deponent or Firm/Company has not been
suspended/blacklisted/debarred by any federal or provincial/regional government
department, agency, organization, or autonomous body and/or Public Procurement
Regulatory Authority at any time.

DEPONENT

Verification:
Verified on oath at {{place}} on this {{date}} day of the month of {{month}} of {{year}}
that the contents of the foregoing Affidavit are true and correct to the best of my
knowledge and belief and that nothing thereof has been concealed.

DEPONENT
```

**Fields:** deponent_name, firm_or_individual_name, cnic, residence_or_business_address, place, date, month, year

---

### Template 5 — FBR User ID Recovery / Particulars Change Affidavit

**Source:** `AFFIDAVI3_Kousar_Khalid_FBR_misplace.docx`
**Sub-type:** `affidavit/fbr-userid-particulars-change`
**Stamp paper:** Rs. 50
**Use case:** Tax-payer has lost FBR portal credentials OR wants to change registered particulars

**Structure (verified):**
```
AFFIDAVIT

I {{taxpayer_name}} S/o D/o W/o {{parent_name}}.
Address: {{address}}.
CNIC # {{cnic}}
do hereby solemnly declare and affirm as under:

1. That I have been issued user ID and password as business individual.
2. That I have lost user ID and password.
3. Please change my following particulars:
   - New e-mail address: {{new_email}}
   - New Cell No.: {{new_phone}}
   - Change of Name: {{new_name_or_blank}}
   - Restoration of Date of Birth: {{new_dob_or_blank}}
   - Change in accounting period: {{new_accounting_period_or_blank}}

4. {{authorized_representative_name}} (Adv) having CNIC No. {{ar_cnic}} is hereby
   authorized on my behalf to get the particulars changed as mentioned above.

Signature of taxpayer:
Thumb impression of the Tax-payer:
Name of AR of the tax-payer: {{authorized_representative_name}}
CNIC No: {{ar_cnic}}
Address: {{ar_address}}

Verification:
Verified on oath at {{place}} on this {{date}} that the contents of the above affidavit
are correct and true to the best of my knowledge and belief.
```

**Fields:** taxpayer_name, parent_name, address, cnic, new_email, new_phone, new_name_or_blank, new_dob_or_blank, new_accounting_period_or_blank, authorized_representative_name, ar_cnic, ar_address, place, date

---

### Template 6 — Multi-Beneficiary Undertaking (Bank Benevolent Fund / Widow)

**Source:** `2_-UNDERTAKING-multiple_beneficiaries__1__HBL_Bank_widow.docx`
**Sub-type:** `undertaking/bank-benevolent-fund-multiple-beneficiaries`
**Stamp paper:** Rs. 50–100
**Use case:** Children of deceased bank employee waive their share so widow receives full benevolent grant

**Structure (verified):**
```
UNDERTAKING

We, natural children of Mr. {{deceased_father_name}} (Late), Muslim, Adult,
Resident of {{family_address}},
do hereby state on oath as under:

1. That we are deponents of this undertaking, hence well conversant with the facts.
2. That our father namely {{deceased_father_name}} was an employee of {{bank_name}} (the Bank)
   who expired on {{date_of_death}}.
3. We hereby authorize the Trustees of the {{benevolent_fund_name}} (the Fund) that our legal
   share of Benevolent Fund Grant on our behalf shall be paid to our mother
   Mst. {{mother_name}}, holder of CNIC # {{mother_cnic}}.
4. We also assure that we shall not claim this benefit in future from the Bank and/or from
   the Fund.

Whatever stated above is true and correct to the best of our knowledge and belief.

Deponent-1: {{child1_name}}    CNIC # {{child1_cnic}}
Deponent-2: {{child2_name}}    CNIC # {{child2_cnic}}
[ ... more deponents as needed ... ]

Witness-1                       Witness-2
Name:                           Name:
S/o / D/o:                      S/o / D/o:
CNIC #:                         CNIC #:
```

**Fields:** deceased_father_name, family_address, bank_name, date_of_death, benevolent_fund_name, mother_name, mother_cnic, children_array (with name + cnic each), witnesses_array

**Note (this skill rule):** This is an UNDERTAKING with witnesses (unlike a regular Affidavit which has none). Multi-deponent — skill must support array-of-deponents schema.

---

### Template 7 — Adoption Deed / Acknowledgment Agreement

**Source:** `AGREEMENT_ACKNOWLEDGEMENT_adoption_deed_Azra_Bibi_to_Tariq_Masih.docx`
**Sub-type:** `agreement/adoption-deed-acknowledgment`
**Stamp paper:** Rs. 100 (typical for deeds)
**Use case:** Biological parent transfers custody of child to adoptive parent

**Structure (verified):**
```
AGREEMENT ACKNOWLEDGEMENT/ADOPTION DEED

Mst. {{first_party_name}} Wife of {{first_party_husband}} CNIC No. {{first_party_cnic}},
Resident of {{first_party_address}}. (First Party)

Mr. {{second_party_name}} Son of {{second_party_father}} CNIC No. {{second_party_cnic}}
Resident of {{second_party_address}}. (Second Party)

Agreement of Acknowledgment/Adoption Deed between parties mutually agreed under the
following terms and conditions:

1. That the parties are residents of above-mentioned addresses.

2. That {{number_of_children}} {{children_gender_collective}} having names {{child_names}}
   were born from the wedlock of First Party Mst. {{first_party_name}}.

3. That the first party of their own free will hand over custody of their {{children_gender_collective}}
   {{child_names}} to the Second Party Mr. {{second_party_name}} forever with special love and affection,
   and the second party have adopted {{children_gender_collective}} {{child_names}} of their own free will.

4. That the second party will be bound and responsible for all kinds of supports, expenses,
   upbringing, etc.

5. That the first party or their relatives will not be entitled to make any claim in any
   court, police station, court about {{children_gender_collective}} {{child_names}} at any time.

Therefore, for the adoption deed, both parties face to face have acknowledged the
following to be true and have affixed their signatures and thumb prints to this effects;
in time of need this will be useful.

Signature: ___________      Signature: ____________
{{first_party_name}}         {{second_party_name}}
(1st Party)                  (2nd Party)

Witness No.1: ___________   Witness No.2: ___________
Name: __________________   Name: __________________
NIC No.: _______________   NIC No.: _______________
```

**Fields:** first_party_name, first_party_husband, first_party_cnic, first_party_address, second_party_name, second_party_father, second_party_cnic, second_party_address, number_of_children, children_gender_collective, child_names, witness_1_details, witness_2_details

---

## Patterns Identified (Cross-Cutting)

After analyzing 7 distinct sub-types, these patterns recur:

### 1. Affidavit vs Undertaking vs Deed — different witness/attestation rules
| Type | Witnesses | Attestation | Stamp paper |
|------|-----------|-------------|-------------|
| Affidavit | None | Notary / Class-1 officer | Rs. 50 |
| Undertaking | Yes (often 2) | Notary | Rs. 50–100 |
| Deed (Sale, Adoption, Gift, etc.) | Yes (always 2) | Stamp + sometimes registration | Rs. 100+ (per Stamp Act) |
| Affidavit for Procurement | None | Notary | **Rs. 100 minimum** (per Annex-C convention) |

### 2. CNIC handling
- ALWAYS captured (deponent + every named party)
- Format: `35202-1234567-1` (Punjab) — varies by province
- Skill must validate CNIC checksum

### 3. Verification clause (mandatory for affidavits)
```
Verified on oath at {{place}} on this {{date}} day of the month of {{month}} of {{year}}
that the contents of the above affidavit are true and correct to the best of my knowledge
and belief and that nothing thereof has been concealed.
```
This is structurally invariant — skill copies verbatim.

### 4. "S/o, D/o, W/o" convention
Pakistani affidavits ALWAYS specify deponent's relationship to a named relative:
- S/o = Son of (male)
- D/o = Daughter of (female, unmarried)
- W/o = Wife of (female, married — uses husband's name)
- Mst. = Mistress/Mrs. honorific for women in legal documents
- Skill must select correct prefix based on gender + marital status

### 5. Bilingual requirement
All extracted templates are English. **Urdu equivalents to be matched** when `.inp` files are converted in Phase 2.

### 6. Designations / honorifics
- "Adv" (Advocate) — for lawyers
- "Dr." — for doctors
- "Mst." — for women
- "M/s" — for firms / companies

---

## Remaining Categories to Extract (when text extraction completes)

These categories were NOT in the first 674-file alphabetical batch — likely waiting for H–Z processing:

| Category | Expected count |
|----------|---------------|
| Power of Attorney (POA) | ~19 (English folder) |
| Sale Deed | Several |
| Iqrar Nama (English-language ones, if any) | TBD |
| Partnership Deed | Several |
| Lease Agreement | Several |
| NDA / Confidentiality | ~10+ |
| Loan / Promissory Note | Several |
| Marriage / Khula / Custody | Several |
| Will / Wasiyat | A few |
| General/Special Power of Attorney | ~19 |

Catalog will be updated as remaining files are processed.

---

## Engineering Handoff — Next Steps

For each canonical template above, engineering should:

1. **Convert structure block into JSON template schema** matching the format defined in [LEGAL-02 skill](./skills/LEGAL-02-legal-drafter.md)
2. **Encode field validation:**
   - CNIC format validator
   - Phone format validator
   - Date pickers
   - Address structured input
3. **Wire stamp-paper amount** as a top-banner display per template
4. **Add bilingual placeholder** — Urdu version pending Phase 2 (.inp digitization)
5. **Mark as `Draft` until Abdullah reviews** — Abdullah → `Verified` status
6. **Implement deponent gender-detection** for correct S/o D/o W/o + Mst. honorifics

---

## Cross-references

- [USB-Performa-Inventory.md](./USB-Performa-Inventory.md) — overall folder analysis
- [PRD Section 25.0.6](./Product-Requirements-Document.md#2506-first-concrete-action--right-now) — Day Zero first action
- [Brainstorm Q6 — Two-Track Strategy](./Brainstorm-Vision-QA.md#q6--template-source--verification-strategy)
- [LEGAL-02 — Track 1 USB Performas](./skills/LEGAL-02-legal-drafter.md#track-1-documents-usb-performa-library--intake-is-template-driven)

---

## Status

- **First batch (A–G alphabetical):** ✅ 674 files text-extracted; 7 distinct canonical templates documented
- **Remaining batch (H–Z):** ⏳ Background extraction continuing; will update catalog as completed
- **Urdu .inp content:** ⏳ Awaiting Abdullah's manual InPage Save-As-DOCX for top 50 files (Phase 2)
- **Abdullah's review of templates:** ⏳ Pending
