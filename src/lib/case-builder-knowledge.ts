export interface CaseDetailQuestion {
  id: string;
  label: string;
  placeholder: string;
  required: boolean;
  category?: "mandatory" | "procedural" | "evidence" | "limitation" | "jurisdiction" | "relief" | "optional" | "template";
  source?: "profile" | "template" | "ai";
}

export interface CaseIntakeProfile {
  id: string;
  title: string;
  law: string;
  matterType: string;
  sectionRefs: string[];
  ingredients: string[];
  legalIngredients: string[];
  questions: CaseDetailQuestion[];
  mandatoryQuestions: CaseDetailQuestion[];
  optionalQuestions: CaseDetailQuestion[];
  proceduralQuestions: CaseDetailQuestion[];
  evidenceChecklist: string[];
  limitationQuestions: CaseDetailQuestion[];
  jurisdictionQuestions: CaseDetailQuestion[];
  reliefQuestions: CaseDetailQuestion[];
  riskFlags: string[];
  documentTypeMappings: string[];
  searchTerms: string[];
  clientPosition: "prosecution" | "defence" | "petitioner" | "respondent" | "appellant";
  draftingGuidance: string;
  draftingSourceNote?: string;
}

type ProfileWithPatterns = Omit<CaseIntakeProfile,
  "legalIngredients" |
  "mandatoryQuestions" |
  "optionalQuestions" |
  "proceduralQuestions" |
  "evidenceChecklist" |
  "limitationQuestions" |
  "jurisdictionQuestions" |
  "reliefQuestions" |
  "riskFlags" |
  "documentTypeMappings"
> & Partial<Pick<CaseIntakeProfile,
  "legalIngredients" |
  "mandatoryQuestions" |
  "optionalQuestions" |
  "proceduralQuestions" |
  "evidenceChecklist" |
  "limitationQuestions" |
  "jurisdictionQuestions" |
  "reliefQuestions" |
  "riskFlags" |
  "documentTypeMappings"
>> & { patterns: RegExp[] };

const q = (
  id: string,
  label: string,
  placeholder: string,
  required = true,
  category?: CaseDetailQuestion["category"]
): CaseDetailQuestion => ({
  id,
  label,
  placeholder,
  required,
  category,
  source: "profile",
});

const commonProceduralQuestions: CaseDetailQuestion[] = [
  q("proceeding_stage", "What is the current procedural stage?", "e.g. fresh filing / pending trial / appeal / execution / pre-arrest stage", true, "procedural"),
  q("prior_orders_history", "What prior orders, notices, FIRs, applications, appeals, or departmental steps already exist?", "e.g. FIR registered; bail dismissed on 12 June 2024; appeal pending", false, "procedural"),
];

const commonLimitationQuestions: CaseDetailQuestion[] = [
  q("limitation_key_dates", "What are the key dates for limitation or delay?", "e.g. cause of action date, impugned order date, knowledge date, appeal deadline", true, "limitation"),
  q("delay_explanation", "If any deadline may have passed, what is the explanation for delay?", "e.g. certified copy received late; illness; no notice served", false, "limitation"),
];

const commonJurisdictionQuestions: CaseDetailQuestion[] = [
  q("jurisdiction_basis", "Why does this court or forum have jurisdiction?", "e.g. property is in this district; FIR registered here; authority passed order here", true, "jurisdiction"),
  q("alternate_remedy_status", "Is any alternate remedy, appeal, review, revision, or departmental remedy available or already used?", "e.g. departmental appeal filed and dismissed", false, "jurisdiction"),
];

const commonReliefQuestions: CaseDetailQuestion[] = [
  q("final_relief_sought", "What exact final relief should be requested?", "e.g. grant bail, set aside order, decree recovery, register FIR, restore possession", true, "relief"),
  q("interim_relief_sought", "What urgent interim relief is needed, if any?", "e.g. stay recovery, restrain dispossession, suspend impugned order", false, "relief"),
];

const commonEvidenceChecklist = [
  "FIR, complaint, impugned order, notice, decree, agreement, mutation, or other initiating document.",
  "CNIC and address details of parties where needed for cause title and service.",
  "Receipts, bank records, return memos, screenshots, photographs, medical record, revenue record, or official correspondence.",
  "Names and availability of witnesses or officials who can verify the core facts.",
  "Certified copies and annexures required for filing before the selected forum.",
];

const commonRiskFlags = [
  "Missing limitation dates can make the draft procedurally unsafe.",
  "Missing forum/court details must remain blank; the system must not assume Lahore, High Court, Sessions Court, or any city.",
  "Unsupported legal sections should be confirmed before filing.",
  "No citation may be inserted unless it comes from an authenticated selected judgment.",
];

const mergeQuestionLists = (...groups: CaseDetailQuestion[][]): CaseDetailQuestion[] => {
  const seen = new Set<string>();
  const out: CaseDetailQuestion[] = [];
  for (const group of groups) {
    for (const question of group) {
      const key = question.id.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(question);
    }
  }
  return out;
};

const profiles: ProfileWithPatterns[] = [
  {
    id: "ppc-489f-dishonoured-cheque",
    title: "Dishonoured Cheque",
    law: "Pakistan Penal Code, 1860",
    matterType: "Criminal cheque dishonour",
    sectionRefs: ["Section 489-F PPC"],
    searchTerms: ["489-F PPC", "dishonoured cheque", "cheque dishonour"],
    clientPosition: "defence",
    patterns: [/\b489\s*[-/]?\s*f\b/i, /\bdishonou?red?\s+cheque\b/i, /\bcheque\b.*\b(dishonou?r|bounce|returned)\b/i],
    ingredients: [
      "A cheque was issued by the accused.",
      "The cheque related to repayment of a loan or fulfilment of an obligation.",
      "The cheque was dishonoured on presentation.",
      "Dishonest intent or failure to satisfy the lawful obligation is in issue.",
    ],
    questions: [
      q("cheque_amount", "What was the cheque amount?", "e.g. Rs. 2,500,000"),
      q("cheque_number", "What is the cheque number?", "e.g. 123456"),
      q("cheque_bank", "Which bank and branch issued the cheque?", "e.g. HBL Mall Road Branch, Lahore"),
      q("cheque_date", "What date is written on the cheque?", "e.g. 15 March 2024"),
      q("cheque_purpose", "Why was the cheque issued?", "e.g. repayment of friendly loan / business supply payment"),
      q("presentation_date", "When was the cheque presented?", "e.g. 22 March 2024"),
      q("dishonour_date", "When was it dishonoured?", "e.g. 23 March 2024"),
      q("bank_return_reason", "What return reason did the bank give?", "e.g. insufficient funds / account closed / signature differs"),
      q("legal_notice_served", "Was a legal notice served before or after dishonour?", "e.g. notice dated 01 April 2024 served by registered post", false),
      q("supporting_documents", "Which documents are available?", "e.g. original cheque, return memo, loan agreement, notice receipt", false),
    ],
    draftingGuidance: "Frame facts around issuance, legally enforceable liability, presentation, dishonour, return memo, notice or demand, and dishonest intent. If defending, test whether the cheque was security, whether consideration existed, and whether the dispute is civil in nature.",
  },
  {
    id: "crpc-22a-22b-justice-of-peace",
    title: "Justice of Peace / FIR Registration Direction",
    law: "Code of Criminal Procedure, 1898",
    matterType: "Application under Sections 22-A and 22-B CrPC",
    sectionRefs: ["Sections 22-A and 22-B CrPC", "Section 154 CrPC"],
    searchTerms: ["22-A CrPC", "22-B CrPC", "Justice of Peace", "registration of FIR"],
    clientPosition: "petitioner",
    patterns: [/\b22\s*[-/]?\s*a\b/i, /\b22\s*[-/]?\s*b\b/i, /\bjustice of peace\b/i, /\bfir registration direction\b/i],
    ingredients: [
      "A cognizable offence and the proposed accused's specific role are stated.",
      "The prior complaint to the SHO and, where relevant, higher police officers is identified.",
      "Police refusal, inaction, neglect, excess, or investigation grievance is described precisely.",
      "The prayer matches the Justice of Peace function invoked and does not treat the proceeding as a criminal trial.",
    ],
    questions: [
      q("occurrence_details", "When and where did the alleged occurrence happen?", "e.g. 12 May 2024 at Main Market, Lahore"),
      q("proposed_offences", "Which cognizable offences and legal sections are alleged?", "e.g. cheating and criminal breach of trust under Sections 420/406 PPC"),
      q("accused_roles", "What specific act is attributed to each proposed accused?", "e.g. received payment, issued forged receipt, threatened complainant"),
      q("sho_complaint", "When and how was the complaint submitted to the SHO?", "e.g. written application dated 14 May 2024 with receiving diary No. 321"),
      q("higher_police_complaint", "Was the matter taken to a higher police officer?", "e.g. complaint to SP Operations dated 20 May 2024", false),
      q("police_failure", "What did the police fail or refuse to do?", "e.g. no FIR registered despite receiving the written complaint"),
      q("supporting_material", "Which documents, witnesses, or other material support the complaint?", "e.g. agreement, bank transfer, messages, two eyewitnesses", false),
      q("exact_direction", "What exact direction is requested from the Justice of Peace?", "e.g. direction to the SHO to proceed in accordance with law on the cognizable complaint"),
    ],
    draftingGuidance: "Use a complete Sessions/Justice of Peace cause title; identify the Section 22-A(6) function actually invoked; plead the occurrence, cognizable offence, accused-specific roles, prior police applications, refusal or neglect, supporting material, and a precise lawful prayer. Attach the police applications and receiving proof where available, followed by verification and affidavit. Do not present the Justice of Peace as deciding guilt or conducting the investigation.",
    draftingSourceNote: "Distilled from the strongest unique examples in a private 5,116-file practitioner corpus; use as drafting-pattern guidance only, not as precedent.",
  },
  {
    id: "crpc-bail",
    title: "Bail Matter",
    law: "Code of Criminal Procedure, 1898",
    matterType: "Pre-arrest or post-arrest bail",
    sectionRefs: ["Sections 497 and 498 CrPC"],
    searchTerms: ["497 CrPC", "498 CrPC", "bail"],
    clientPosition: "defence",
    patterns: [/\bbail\b/i, /\bzamanat\b/i, /\b497\s*cr/i, /\b498\s*cr/i],
    ingredients: [
      "Offence sections and FIR details are identified.",
      "Arrest or apprehension status is clear.",
      "Role attributed to the accused is stated.",
      "Grounds for bail are linked to evidence, mala fide, further inquiry, delay, or custody status.",
    ],
    questions: [
      q("offence_sections", "Which offence sections are mentioned in the FIR?", "e.g. 489-F PPC / 302 PPC / 406 PPC"),
      q("fir_number_date", "What is the FIR number and date?", "e.g. FIR No. 123/2024 dated 12 May 2024"),
      q("police_station", "Which police station registered the FIR?", "e.g. Police Station Civil Lines, Faisalabad"),
      q("arrest_status", "Is the accused arrested or seeking pre-arrest bail?", "e.g. arrested on 14 May 2024 / apprehending arrest"),
      q("role_assigned", "What specific role is assigned to the accused?", "e.g. nominated as cheque issuer / alleged firearm injury / abetment only"),
      q("evidence_against_accused", "What evidence is alleged against the accused?", "e.g. complainant statement, recovery, CCTV, witnesses"),
      q("defence_ground", "What is the strongest bail ground?", "e.g. false implication, civil dispute, further inquiry, no recovery, delay in FIR"),
      q("custody_investigation_status", "What is the custody or investigation status?", "e.g. physical remand ended, challan submitted, recovery complete", false),
    ],
    draftingGuidance: "Distinguish pre-arrest from post-arrest bail. State the FIR metadata, exact role, arrest or apprehension status, lower-court history, investigation and recovery status, and supporting documents. For pre-arrest bail, connect mala fide and abuse of process to the facts; for post-arrest bail, address prohibitory clause, further inquiry, delay, custody, recovery, and completion of investigation. End with a tailored prayer, verification, affidavit, and annexure applications where required.",
    draftingSourceNote: "Validated against the strongest pre-arrest and post-arrest pleadings in a private practitioner corpus; the source pleadings are not binding authorities.",
  },
  {
    id: "ppc-302-murder",
    title: "Murder / Qatl-e-Amd",
    law: "Pakistan Penal Code, 1860",
    matterType: "Murder case",
    sectionRefs: ["Section 302 PPC"],
    searchTerms: ["302 PPC", "murder", "qatl-e-amd"],
    clientPosition: "defence",
    patterns: [/\b302\b/i, /\bmurder\b/i, /\bqatl\b/i, /قتل/i],
    ingredients: [
      "Death of the deceased is established.",
      "Specific role and weapon are attributed.",
      "Medical, ocular, motive, and recovery evidence must be tested.",
      "Common intention or common object is assessed if multiple accused are named.",
    ],
    questions: [
      q("date_place_occurrence", "When and where did the occurrence take place?", "e.g. 10 June 2024 at Main Bazaar, Multan"),
      q("deceased_name", "Who is the deceased?", "e.g. Muhammad Aslam"),
      q("role_weapon", "What role and weapon are attributed to the accused?", "e.g. pistol fire on chest / lalkara / no specific role"),
      q("eyewitnesses", "Who are the eyewitnesses and what did they allegedly see?", "e.g. complainant and brother, both related witnesses"),
      q("medical_evidence", "What does the post-mortem or MLR say?", "e.g. firearm injury, time between injury and death"),
      q("motive", "What motive is alleged?", "e.g. previous enmity over land dispute"),
      q("recovery", "Was any weapon or recovery shown?", "e.g. pistol recovered after arrest / no recovery", false),
      q("delay_or_contradictions", "Is there FIR delay or contradiction in the prosecution story?", "e.g. FIR lodged after 12 hours with no explanation", false),
    ],
    draftingGuidance: "Focus on specific role, ocular-medical consistency, motive, delay, recovery, common intention, and whether the accused's role creates further inquiry.",
  },
  {
    id: "ppc-420-406-fraud",
    title: "Fraud / Cheating / Breach of Trust",
    law: "Pakistan Penal Code, 1860",
    matterType: "Fraud or criminal breach of trust",
    sectionRefs: ["Sections 420, 406 PPC"],
    searchTerms: ["420 PPC", "406 PPC", "cheating", "criminal breach of trust"],
    clientPosition: "defence",
    patterns: [/\b420\b/i, /\b406\b/i, /\bfraud\b/i, /\bcheating\b/i, /\bbreach of trust\b/i, /\bdhoka\b/i],
    ingredients: [
      "Deception or entrustment must be shown.",
      "Dishonest intention at inception is material for cheating.",
      "Documents and money trail are central.",
      "Civil dispute versus criminal offence must be assessed.",
    ],
    questions: [
      q("transaction_date", "When did the transaction or entrustment happen?", "e.g. 05 January 2024"),
      q("amount_or_property", "What amount or property is involved?", "e.g. Rs. 1,800,000 / Toyota Corolla 2021"),
      q("promise_or_representation", "What promise or representation was made?", "e.g. supply of goods within 30 days"),
      q("payment_mode", "How was payment or property transferred?", "e.g. bank transfer, cash receipt, written agreement"),
      q("breach_details", "How was the promise breached?", "e.g. goods not supplied and amount not returned"),
      q("documents_available", "Which documents or messages are available?", "e.g. agreement, receipts, WhatsApp chat, bank statement"),
      q("civil_or_prior_litigation", "Is any civil case, settlement, or prior notice pending?", "e.g. recovery suit already filed", false),
    ],
    draftingGuidance: "For complainant, plead deception or entrustment with documents. For defence, stress absence of dishonest intention at inception and civil nature of the dispute.",
  },
  {
    id: "family-khula",
    title: "Khula / Dissolution of Marriage",
    law: "Family Courts Act, 1964",
    matterType: "Khula petition",
    sectionRefs: ["Family Courts Act, 1964", "Dissolution of Muslim Marriages Act, 1939"],
    searchTerms: ["khula", "dissolution of marriage", "Family Courts Act"],
    clientPosition: "petitioner",
    patterns: [/\bkhula\b/i, /\bdissolution of marriage\b/i, /خلع/i],
    ingredients: [
      "Marriage and jurisdiction facts are established.",
      "Wife's unwillingness to live within limits of Allah is stated.",
      "Mehr and dower position is identified.",
      "Connected claims like maintenance, dowry articles, and custody are identified.",
    ],
    questions: [
      q("marriage_date", "When was the marriage solemnized?", "e.g. 12 February 2020"),
      q("rukhsati_status", "Did rukhsati take place?", "e.g. yes, rukhsati took place in March 2020"),
      q("haq_mehr", "What was the Haq Mehr and has it been paid?", "e.g. Rs. 100,000, unpaid"),
      q("children_details", "Are there children from the marriage?", "e.g. one daughter aged 3 years", false),
      q("reason_for_khula", "Why does the wife seek khula?", "e.g. cruelty, non-maintenance, incompatibility, no reconciliation possible"),
      q("separation_date", "Since when are the parties separated?", "e.g. living separately since August 2023"),
      q("connected_claims", "Any connected claims to include?", "e.g. maintenance, dowry articles, custody", false),
    ],
    draftingGuidance: "State marriage, jurisdiction, breakdown, refusal to live with husband, mehr position, reconciliation failure, and connected family claims without scandalous unnecessary detail.",
  },
  {
    id: "family-maintenance",
    title: "Maintenance / Nafaqa",
    law: "Family Courts Act, 1964",
    matterType: "Maintenance claim",
    sectionRefs: ["Family Courts Act, 1964"],
    searchTerms: ["maintenance", "nafaqa", "Family Courts Act"],
    clientPosition: "petitioner",
    patterns: [/\bmaintenance\b/i, /\bnafaqa\b/i, /\bnafqa\b/i, /\bkharcha\b/i, /نفقہ/i],
    ingredients: [
      "Relationship and dependency are established.",
      "Non-payment or neglect is stated.",
      "Respondent's earning capacity is identified.",
      "Reasonable monthly claim is supported by needs and status.",
    ],
    questions: [
      q("relationship_basis", "Who is claiming maintenance and against whom?", "e.g. wife and two minor children against husband/father"),
      q("marriage_or_birth_details", "What are the marriage or child birth details?", "e.g. marriage dated 10 January 2019, children aged 5 and 3"),
      q("non_payment_period", "Since when has maintenance not been paid?", "e.g. since September 2023"),
      q("monthly_amount_claimed", "What monthly amount is claimed?", "e.g. Rs. 50,000 for wife and Rs. 30,000 per child"),
      q("respondent_income", "What is the respondent's income or occupation?", "e.g. runs a medical store earning about Rs. 250,000/month"),
      q("school_medical_expenses", "Any school, medical, or special expenses?", "e.g. school fee Rs. 18,000 per month", false),
    ],
    draftingGuidance: "Tie maintenance to status, needs, respondent's means, neglect, interim maintenance, and execution consequences.",
  },
  {
    id: "family-custody",
    title: "Child Custody / Guardianship",
    law: "Guardian and Wards Act, 1890",
    matterType: "Custody or guardianship petition",
    sectionRefs: ["Guardian and Wards Act, 1890"],
    searchTerms: ["custody", "guardian", "welfare of minor"],
    clientPosition: "petitioner",
    patterns: [/\bcustody\b/i, /\bguardianship\b/i, /\bguardian\b/i, /\bhizanat\b/i],
    ingredients: [
      "Minor's welfare is the paramount consideration.",
      "Age, current custody, education, health, and living environment are central.",
      "Parent's conduct and capacity are relevant.",
      "Visitation or interim custody may be required.",
    ],
    questions: [
      q("minor_names_ages", "What are the names and ages of the minors?", "e.g. Ali age 6, Ayesha age 4"),
      q("current_custody", "Who currently has custody?", "e.g. minors are with father since 01 May 2024"),
      q("education_health", "Where are the children studying and are there health needs?", "e.g. Beaconhouse Grade 1, no medical issue"),
      q("welfare_ground", "Why is your custody better for welfare of the minors?", "e.g. stable home, school continuity, mother available full-time"),
      q("opposing_parent_concern", "Any concern about the other parent?", "e.g. neglect, denial of meeting, unsafe environment", false),
      q("interim_relief", "Do you need interim custody or visitation?", "e.g. interim custody during weekends / supervised meetings", false),
    ],
    draftingGuidance: "Center every ground on welfare of the minor, not parental grievance alone. Add interim visitation or production requests where needed.",
  },
  {
    id: "civil-recovery",
    title: "Civil Recovery / Money Claim",
    law: "Code of Civil Procedure, 1908",
    matterType: "Recovery suit",
    sectionRefs: ["CPC", "Contract Act, 1872", "Limitation Act, 1908"],
    searchTerms: ["recovery suit", "money claim", "Order XXXVII CPC"],
    clientPosition: "petitioner",
    patterns: [/\brecovery\b/i, /\bmoney claim\b/i, /\bamount\b/i, /\bloan\b/i, /\bqarz\b/i, /\bpaisa\b/i],
    ingredients: [
      "Cause of action and amount due are identified.",
      "Written instrument, receipt, cheque, or account statement is available if summary procedure is sought.",
      "Limitation and demand notice are considered.",
      "Court fee and jurisdiction depend on claimed amount.",
    ],
    questions: [
      q("amount_due", "What amount is due?", "e.g. Rs. 3,000,000"),
      q("basis_of_claim", "What is the basis of the claim?", "e.g. friendly loan, unpaid invoice, sale of goods"),
      q("transaction_date", "When did the transaction happen?", "e.g. 20 July 2023"),
      q("repayment_due_date", "When was repayment or performance due?", "e.g. 20 October 2023"),
      q("proof_documents", "What proof is available?", "e.g. written agreement, receipt, bank transfer, cheque"),
      q("demand_notice", "Was a demand notice served?", "e.g. notice dated 05 January 2024", false),
      q("partial_payments", "Were any partial payments made?", "e.g. Rs. 500,000 paid on 01 December 2023", false),
    ],
    draftingGuidance: "Plead amount, cause of action, limitation, documentary proof, demand, jurisdiction, court fee, markup if legally claimable, and prayer for decree.",
  },
  {
    id: "civil-injunction-property",
    title: "Declaration / Injunction / Possession",
    law: "Specific Relief Act, 1877",
    matterType: "Civil property suit",
    sectionRefs: ["Sections 8, 9, 42, 54 Specific Relief Act, 1877", "CPC"],
    searchTerms: ["declaration", "injunction", "possession", "Specific Relief Act"],
    clientPosition: "petitioner",
    patterns: [
      /\binjunction\b/i,
      /\bdeclaration\b/i,
      /\bpossession\b/i,
      /\bqabza\b/i,
      /\bproperty dispute\b/i,
      /\bstay order\b/i,
      /\bspecific relief act\b/i,
      /\btransfer of property act\b/i,
      /\b(?:property|land|house|plot|share)\b.*\b(?:sold|sale|transfer(?:red)?|alienat(?:e|ed|ion))\b.*\b(?:without|no)\b.*\b(?:permission|consent|authority)\b/i,
    ],
    ingredients: [
      "Plaintiff's right, title, or possession is pleaded.",
      "Threat, interference, dispossession, or denial of title is stated.",
      "Property identity must be precise.",
      "Interim injunction requires prima facie case, balance of convenience, and irreparable loss.",
    ],
    questions: [
      q("property_description", "What is the complete property description?", "e.g. House No. 12, Khewat No. ___, Khasra No. ___, Lahore"),
      q("title_basis", "What is your title or right in the property?", "e.g. registered sale deed dated 10 March 2021 / inheritance mutation"),
      q("possession_status", "Who is currently in possession?", "e.g. plaintiff is in possession / defendant illegally occupied on 05 May 2024"),
      q("threat_or_illegal_act", "What threat or illegal act happened?", "e.g. defendant is threatening construction and dispossession"),
      q("documents_available", "Which property documents are available?", "e.g. sale deed, fard, mutation, site plan, utility bills"),
      q("interim_stay_needed", "What interim stay order is needed?", "e.g. restrain defendants from alienating or dispossessing plaintiff", false),
    ],
    draftingGuidance: "Give exact property identity, title chain, possession facts, cause of action date, threat, interim relief grounds, and final declaration/injunction/possession prayer.",
  },
  {
    id: "cpc-civil-revision-115",
    title: "Civil Revision",
    law: "Code of Civil Procedure, 1908",
    matterType: "Civil revision under Section 115 CPC",
    sectionRefs: ["Section 115 CPC"],
    searchTerms: ["Section 115 CPC", "civil revision", "jurisdictional error", "material irregularity"],
    clientPosition: "petitioner",
    patterns: [/\bcivil revision\b/i, /\bsection\s*115\s*cpc\b/i, /\brevisional jurisdiction\b.*\bcpc\b/i],
    ingredients: [
      "The impugned order, court, date, and underlying proceeding are identified.",
      "The jurisdictional error, illegality, or material irregularity is separated from a mere merits disagreement.",
      "Maintainability, limitation, alternate remedy, and prejudice are addressed.",
      "The requested setting-aside, remand, or consequential relief is precise.",
    ],
    questions: [
      q("impugned_order", "Which order is challenged, by which court, and on what date?", "e.g. order dated 01 April 2024 passed by Additional District Judge, Lahore"),
      q("underlying_case", "What is the underlying suit/application and its current stage?", "e.g. declaration suit; application under Order I Rule 10 dismissed"),
      q("jurisdictional_error", "What jurisdictional error or material irregularity occurred?", "e.g. court refused to exercise jurisdiction by ignoring a necessary-party issue"),
      q("prejudice", "How does the impugned order materially prejudice the client?", "e.g. title rights may be decided without hearing the applicant"),
      q("alternate_remedy", "Is an appeal or other adequate remedy available?", "e.g. no appeal lies against the interlocutory order", false),
      q("limitation_dates", "When was the order received and is the revision within limitation?", "e.g. certified copy applied for 03 April and received 10 April 2024"),
      q("interim_relief", "Is suspension or stay of further proceedings needed?", "e.g. stay trial proceedings pending revision", false),
    ],
    draftingGuidance: "Open with the High Court cause title, impugned-order description, and concise procedural history. State numbered facts, then separate revision grounds focused on assumption, failure, or illegal exercise of jurisdiction and material irregularity. Address maintainability, limitation, alternate remedy, prejudice, and interim stay. End with a precise prayer, verification, affidavit, and certified-copy/exemption application if needed.",
    draftingSourceNote: "Distilled from high-scoring civil revision files in a private practitioner corpus; verify every legal proposition against current law and reported authority.",
  },
  {
    id: "cpc-order-vii-rule-11",
    title: "Rejection of Plaint",
    law: "Code of Civil Procedure, 1908",
    matterType: "Application under Order VII Rule 11 CPC",
    sectionRefs: ["Order VII Rule 11 CPC"],
    searchTerms: ["Order VII Rule 11 CPC", "rejection of plaint", "barred by law", "no cause of action"],
    clientPosition: "respondent",
    patterns: [/\border\s*(?:vii|7)\s*rule\s*11\b/i, /\brejection of plaint\b/i],
    ingredients: [
      "The exact clause of Order VII Rule 11 relied upon is identified.",
      "The objection is tested primarily from the plaint averments and legally cognizable material.",
      "Absence of cause of action, undervaluation, insufficient stamp, or statutory bar is pleaded distinctly.",
      "The prayer seeks rejection of the plaint rather than an unsupported decision on disputed evidence.",
    ],
    questions: [
      q("plaint_claim", "What relief and cause of action does the plaint assert?", "e.g. possession through pre-emption based on sale deed dated 10 May 2003"),
      q("rule_11_ground", "Which Order VII Rule 11 ground applies?", "e.g. no cause of action / suit barred by limitation / deficient court fee"),
      q("plaint_admissions", "Which plaint averments or admitted dates establish the objection?", "e.g. plaint admits knowledge of sale more than ten years earlier"),
      q("statutory_bar", "Which statute or provision creates the bar?", "e.g. Section 30 Punjab Pre-emption Act, 1991", false),
      q("prior_proceedings", "Are there prior proceedings, judgments, or documents relevant to maintainability?", "e.g. earlier suit withdrawn without permission", false),
      q("relief_requested", "What precise order and costs are requested?", "e.g. reject the plaint with compensatory costs"),
    ],
    draftingGuidance: "Identify the Rule 11 clause and reproduce only the material plaint admissions, dates, and statutory bar. Keep the objection distinct from a full merits defence, explain why evidence is unnecessary for the identified legal defect, and seek rejection with appropriate costs. A written statement may preserve alternative merits defences without weakening the threshold objection.",
    draftingSourceNote: "Distilled from the strongest written statements and Rule 11 applications in a private practitioner corpus; source pleadings require advocate review.",
  },
  {
    id: "rent-appeal-punjab",
    title: "Rent Appeal / Ejectment Challenge",
    law: "Punjab Rented Premises Act, 2009",
    matterType: "Rent appeal against ejectment or rent order",
    sectionRefs: ["Section 28 Punjab Rented Premises Act, 2009"],
    searchTerms: ["Punjab Rented Premises Act 2009", "rent appeal", "ejectment order", "landlord tenant"],
    clientPosition: "appellant",
    patterns: [/\brent appeal\b/i, /\bejectment order\b/i, /\bsection\s*28\b.*\brent/i],
    ingredients: [
      "The tenancy, premises, rent terms, and parties' asserted relationship are identified.",
      "The impugned Rent Tribunal order and the specific findings challenged are stated.",
      "Default, tender or deposit, ownership, personal need, and notice issues are addressed as applicable.",
      "Limitation and interim stay of ejectment or execution are dealt with.",
    ],
    questions: [
      q("premises_description", "What rented premises are involved?", "e.g. Shop No. 24, Main Bazaar, Lahore"),
      q("tenancy_terms", "What are the tenancy date, monthly rent, security, and payment method?", "e.g. oral tenancy; Rs. 20,000 monthly; Rs. 650,000 security"),
      q("ejectment_ground", "On what ground was ejectment sought?", "e.g. rent default, personal need, expiry, subletting"),
      q("tenant_response", "What was the tenant's defence and payment/deposit history?", "e.g. rent tendered by money order and later deposited in tribunal"),
      q("impugned_findings", "Which findings in the Rent Tribunal order are challenged?", "e.g. tribunal ignored rent receipts and treated security as arrears"),
      q("order_and_limitation", "What is the order date and when was its copy received?", "e.g. order dated 27 November 2024; copy received 03 December"),
      q("stay_needed", "Is a stay of ejectment or execution required?", "e.g. suspend ejectment during appeal", false),
    ],
    draftingGuidance: "Set out the premises and tenancy terms, summarize the ejectment petition and defence, identify the impugned findings, and frame numbered appellate grounds tied to the record and the 2009 Act. Address rent tender/deposit, default, ownership or personal need as applicable, limitation, and a separate stay application supported by affidavit.",
    draftingSourceNote: "Distilled from high-value rent appeal and ejectment files in a private practitioner corpus; current statutory text and reported cases control.",
  },
  {
    id: "constitutional-writ",
    title: "Constitutional Writ",
    law: "Constitution of Pakistan, 1973",
    matterType: "Article 199 writ petition",
    sectionRefs: ["Article 199 Constitution of Pakistan, 1973"],
    searchTerms: ["Article 199", "writ petition", "constitutional jurisdiction"],
    clientPosition: "petitioner",
    patterns: [/\bwrit\b/i, /\barticle\s*199\b/i, /\bconstitutional petition\b/i],
    ingredients: [
      "Public authority or statutory functionary is identified.",
      "Impugned order, omission, or illegal act is specified.",
      "No adequate alternate remedy or exceptional ground is explained.",
      "Fundamental right, lawful authority, or jurisdictional error is pleaded.",
    ],
    questions: [
      q("authority_or_department", "Which authority or department is involved?", "e.g. Deputy Commissioner Lahore / SHO / University"),
      q("impugned_action", "What order, action, or refusal is challenged?", "e.g. order dated 10 May 2024 cancelling allotment"),
      q("legal_right_violated", "Which legal or constitutional right is affected?", "e.g. right to property, due process, lawful authority"),
      q("alternate_remedy", "Is any appeal or alternate remedy available or used?", "e.g. departmental appeal filed and dismissed", false),
      q("relief_sought", "What relief should the High Court grant?", "e.g. set aside order and direct restoration of allotment"),
      q("urgent_interim_relief", "Is urgent interim relief required?", "e.g. suspend operation of impugned order", false),
    ],
    draftingGuidance: "Identify the public authority and exact impugned act/order, give a disciplined procedural chronology, then separate grounds on lawful authority, jurisdiction, due process, fundamental rights, alternate remedy, and exceptional circumstances. State precise mandamus/certiorari/prohibition relief, add a focused interim-relief application where needed, and support the petition with verification, affidavit, and properly identified annexures.",
    draftingSourceNote: "Validated against the strongest Article 199 and quashment pleadings in a private practitioner corpus; source pleadings are drafting references, not reported judgments.",
  },
  {
    id: "crpc-criminal-revision-561a",
    title: "Criminal Revision / Inherent Jurisdiction",
    law: "Code of Criminal Procedure, 1898",
    matterType: "Criminal revision or petition under Section 561-A CrPC",
    sectionRefs: ["Sections 435 and 439 CrPC", "Section 561-A CrPC"],
    searchTerms: ["criminal revision", "561-A CrPC", "quashment", "abuse of process"],
    clientPosition: "petitioner",
    patterns: [/\bcriminal revision\b/i, /\b561\s*[-/]?\s*a\b/i, /\bquash(?:ment|ing)?\b/i, /\binherent jurisdiction\b/i],
    ingredients: [
      "The impugned order or proceeding, forum, date, and underlying FIR/complaint are identified.",
      "The illegality, impropriety, jurisdictional defect, or abuse of process is stated precisely.",
      "The procedural stage, available remedy, limitation, and prejudice are explained.",
      "The prayer distinguishes revision, quashment, remand, discharge, or interim suspension.",
    ],
    questions: [
      q("impugned_proceeding", "Which order or criminal proceeding is challenged?", "e.g. revisional order dated 18 April 2024 restoring accused to trial"),
      q("case_details", "What are the FIR/complaint number, sections, police station, and court?", "e.g. FIR No. 773/2023 under Sections 365/148/149 PPC, PS South Cantt"),
      q("procedural_history", "What happened in the lower courts before this petition?", "e.g. Magistrate discharged accused; Sessions Court accepted complainant's revision"),
      q("legal_defect", "What illegality, impropriety, or abuse of process is alleged?", "e.g. revisional court reversed discharge without addressing mandatory evidence"),
      q("current_stage", "What is the current investigation or trial stage?", "e.g. challan filed; charge not yet framed"),
      q("alternate_remedy", "Is another appeal, revision, or statutory remedy available?", "e.g. no further revision lies", false),
      q("interim_relief", "What proceeding or order should be suspended meanwhile?", "e.g. stay trial proceedings pending decision", false),
      q("final_relief", "What exact final relief is requested?", "e.g. set aside revisional order and restore discharge order"),
    ],
    draftingGuidance: "Use the proper High Court or revisional forum and accurately describe the underlying FIR/complaint, impugned order, and procedural history. Separate facts from grounds of illegality, impropriety, jurisdictional defect, abuse of process, or failure of justice. Explain maintainability and alternate remedy, tailor the prayer to revision or Section 561-A relief, and add interim suspension, verification, affidavit, and annexure applications where required.",
    draftingSourceNote: "Distilled from high-scoring criminal revision and quashment pleadings in a private practitioner corpus; verify current maintainability and precedent before filing.",
  },
  {
    id: "civil-specific-performance",
    title: "Specific Performance of Contract",
    law: "Specific Relief Act, 1877, Contract Act, 1872, and CPC",
    matterType: "Suit for specific performance, alternate refund/damages, or injunction over contract/property",
    sectionRefs: ["Specific Relief Act, 1877", "Contract Act, 1872", "CPC"],
    searchTerms: ["specific performance", "agreement to sell", "readiness and willingness", "alternate refund"],
    clientPosition: "petitioner",
    patterns: [/\bspecific performance\b/i, /\bagreement to sell\b/i, /\bsale agreement dispute\b/i, /\breadiness and willingness\b/i],
    ingredients: [
      "A valid enforceable contract, date, consideration, parties, and subject matter are identified.",
      "Plaintiff's readiness and willingness, payment history, notices, and defendant's breach are pleaded.",
      "Limitation, jurisdiction, court fee, title documents, possession, and alternate relief are addressed.",
      "Interim restraint against alienation or dispossession is framed where needed.",
    ],
    questions: [
      q("contract_details", "What agreement is relied upon and when was it executed?", "e.g. agreement to sell dated 10 January 2024", true, "mandatory"),
      q("property_or_subject", "What property, asset, or contractual subject matter is involved?", "e.g. House No. 12, Khewat No. ___, Mouza ___", true, "mandatory"),
      q("price_payment_terms", "What total price, advance, balance, and payment schedule were agreed?", "e.g. Rs. 15,000,000; Rs. 3,000,000 paid as earnest money", true, "mandatory"),
      q("readiness_willingness", "How can the plaintiff show readiness and willingness?", "e.g. balance amount arranged and notice sent for execution", true, "mandatory"),
      q("breach_or_refusal", "How did the defendant refuse or breach the agreement?", "e.g. refused to execute sale deed on target date", true, "mandatory"),
      q("notice_and_documents", "Which notice, receipts, witnesses, title papers, or bank records are available?", "e.g. agreement, receipt, legal notice, witnesses", false, "evidence"),
      q("interim_relief_sought", "Is interim restraint needed?", "e.g. restrain defendant from alienating or creating third-party interest", false, "relief"),
    ],
    draftingGuidance: "Plead the agreement, consideration, payment, plaintiff's continuous readiness and willingness, breach, limitation, jurisdiction, court fee, property identity, alternate refund/damages, and interim restraint. Avoid conclusory readiness; tie it to notices, bank record, tender, or conduct.",
    documentTypeMappings: ["specific-performance", "civil suit", "injunction-application", "legal notice"],
  },
  {
    id: "criminal-fir-quashment",
    title: "FIR Quashment / Criminal Process Abuse",
    law: "Code of Criminal Procedure, 1898 and applicable penal law",
    matterType: "Petition for quashment of FIR/proceedings or abuse of criminal process",
    sectionRefs: ["Section 561-A CrPC", "Article 199 Constitution where applicable"],
    searchTerms: ["quashment of FIR", "561-A CrPC", "abuse of process", "civil dispute criminal proceedings"],
    clientPosition: "petitioner",
    patterns: [/\bfir quash/i, /\bquashment\b/i, /\bquash fir\b/i, /\bfalse fir\b/i, /\babuse of process\b/i],
    ingredients: [
      "FIR, sections, police station, complainant, accused role, and current investigation/trial stage are identified.",
      "The legal basis for quashment is exceptional and tied to admitted facts, mala fide, no offence made out, compromise, or civil nature.",
      "Alternate remedies, challan status, bail status, and prejudice are explained.",
    ],
    questions: [
      q("fir_complete_details", "What are the FIR number, date, police station, sections, complainant, and accused names?", "e.g. FIR No. 123/2024 under 420/406 PPC, PS City", true, "mandatory"),
      q("allegations_summary", "What does the FIR allege against the client?", "e.g. client received money but no specific entrustment alleged", true, "mandatory"),
      q("quashment_ground", "What is the strongest quashment ground?", "e.g. no offence made out, civil dispute, mala fide, compromise, lack of role", true, "mandatory"),
      q("investigation_stage", "What is the investigation or trial stage?", "e.g. challan not submitted / charge framed / trial pending", true, "procedural"),
      q("parallel_litigation", "Is there civil, family, banking, or departmental litigation on the same facts?", "e.g. recovery suit pending before civil court", false, "evidence"),
      q("prior_orders", "What prior bail, investigation, cancellation, or lower-court orders exist?", "e.g. pre-arrest bail confirmed on 01 June 2024", false, "procedural"),
      q("interim_relief_sought", "What interim protection is needed?", "e.g. stay arrest, stay proceedings, no coercive action", false, "relief"),
    ],
    draftingGuidance: "Use quashment sparingly and plead only exceptional grounds. Attach FIR, any compromise, civil pleadings, investigation orders, and prior bail/court orders. Do not ask the court to conduct a mini-trial on disputed evidence.",
    documentTypeMappings: ["quashment-petition", "writ-petition", "criminal revision"],
  },
  {
    id: "tax-appeal-fbr",
    title: "Tax Appeal / FBR Rectification",
    law: "Income Tax Ordinance, 2001, Sales Tax Act, 1990, and applicable fiscal statutes",
    matterType: "Tax appeal, rectification, exemption, stay of recovery, or FBR complaint",
    sectionRefs: ["Applicable fiscal statute", "Relevant appeal/rectification provisions"],
    searchTerms: ["tax appeal", "FBR rectification", "assessment order", "stay of recovery"],
    clientPosition: "appellant",
    patterns: [/\btax appeal\b/i, /\bfbr complaint\b/i, /\brectification\b.*\bfbr\b/i, /\bassessment order\b/i, /\bstay of recovery\b/i, /\bwithholding certificate\b/i],
    ingredients: [
      "Taxpayer identity, NTN/STRN, tax year/period, impugned notice/order, demand, and forum are identified.",
      "Limitation and preconditions for appeal, rectification, exemption, or stay are addressed.",
      "Grounds separate jurisdiction, hearing, calculation, exemption, evidence, and legal interpretation.",
    ],
    questions: [
      q("taxpayer_registration", "What are the taxpayer name, NTN/STRN, and tax status?", "e.g. ABC Pvt Ltd, NTN ___, filer", true, "mandatory"),
      q("tax_period_order", "Which tax year/period and order/notice are involved?", "e.g. tax year 2023, assessment order dated 15 May 2024", true, "mandatory"),
      q("demand_amount", "What tax, penalty, default surcharge, refund, or withholding amount is in dispute?", "e.g. demand of Rs. 8,500,000", true, "mandatory"),
      q("tax_issue", "What is the main tax issue?", "e.g. input tax disallowed, exemption denied, wrong withholding, no hearing", true, "mandatory"),
      q("service_limitation", "When was the order served and what is the filing deadline?", "e.g. order served on 20 May 2024; appeal due within statutory period", true, "limitation"),
      q("record_available", "Which returns, notices, replies, ledgers, invoices, CPRs, or audit record are available?", "e.g. return, reply, bank CPRs, invoices", false, "evidence"),
      q("recovery_status", "Is recovery action started or feared?", "e.g. bank attachment notice issued", false, "relief"),
    ],
    draftingGuidance: "Confirm the statute and forum before drafting. Plead service, limitation, demand, calculation, record, violation of hearing, statutory interpretation, exemption/refund basis, and stay of recovery separately.",
    documentTypeMappings: ["tax-appeal", "fbr-complaint", "tax-exemption", "withholding-certificate"],
  },
  {
    id: "constitutional-service-writ",
    title: "Service Writ / Public Employment Challenge",
    law: "Constitution of Pakistan, 1973, service rules, and applicable tribunal law",
    matterType: "Constitutional/service petition against public authority, appointment, transfer, termination, seniority, or departmental action",
    sectionRefs: ["Article 199 Constitution of Pakistan, 1973", "Applicable service rules"],
    searchTerms: ["service writ", "departmental appeal", "natural justice service", "public employment"],
    clientPosition: "petitioner",
    patterns: [/\bservice writ\b/i, /\bservice matter\b/i, /\bcivil servant\b/i, /\bdepartmental appeal\b/i, /\bpublic employment\b/i, /\bseniority\b/i, /\btransfer order\b/i],
    ingredients: [
      "Employment status, appointing authority, governing service rules, and maintainable forum are identified.",
      "The impugned order, inquiry, hearing, departmental appeal, and limitation are traced.",
      "Natural justice, jurisdiction, mala fide, discrimination, proportionality, or statutory violation is tied to facts.",
    ],
    questions: [
      q("employee_status_rules", "What is the employee status and which service rules apply?", "e.g. regular civil servant under Punjab Civil Servants Act/service rules", true, "mandatory"),
      q("department_authority", "Which department/authority passed the impugned action?", "e.g. Secretary Health / District Education Authority", true, "jurisdiction"),
      q("impugned_service_order", "What order/action is challenged and on what date?", "e.g. dismissal order dated 15 May 2024", true, "mandatory"),
      q("inquiry_hearing", "Was notice, inquiry, hearing, or charge sheet provided?", "e.g. show-cause notice issued but no inquiry officer heard witnesses", true, "procedural"),
      q("departmental_remedy", "What appeal, representation, or tribunal remedy was used or why unavailable?", "e.g. departmental appeal dismissed on 20 June 2024", true, "jurisdiction"),
      q("service_relief", "What service relief is required?", "e.g. set aside dismissal, reinstatement, back benefits, seniority restoration", true, "relief"),
      q("interim_service_relief", "Is interim relief required?", "e.g. suspend transfer or disciplinary proceedings", false, "relief"),
    ],
    draftingGuidance: "Do not assume High Court maintainability if a service tribunal remedy exists. Plead forum basis, rules, order, service of order, departmental remedy, limitation, natural justice, discrimination, and exact service consequences.",
    documentTypeMappings: ["writ-petition", "fundamental-rights", "constitutional petition"],
  },
  {
    id: "non-muslim-guardianship-family",
    title: "Non-Muslim Guardianship / Minority Family Matter",
    law: "Guardians and Wards Act, 1890 and applicable personal/minority law",
    matterType: "Christian/Hindu/Sikh/Parsi custody, guardianship, maintenance, succession, marriage, or divorce matter",
    sectionRefs: ["Guardians and Wards Act, 1890", "Applicable personal law"],
    searchTerms: ["non Muslim guardianship", "minority custody", "Christian custody", "Hindu guardianship"],
    clientPosition: "petitioner",
    patterns: [/\bnon[-\s]?muslim\b/i, /\bchristian custody\b/i, /\bhindu guardianship\b/i, /\bminority rights\b/i, /\bforced conversion\b/i, /\bparsi\b/i, /\bsikh\b/i],
    ingredients: [
      "Religion/personal law status, marriage/family relationship, minor or estate details, and welfare/legal right are identified.",
      "Forum, guardianship/custody/succession requirements, consent/objection, and documentary proof are addressed.",
      "Sensitive minority-rights or forced-conversion allegations are pleaded with care and evidence.",
    ],
    questions: [
      q("personal_law_status", "Which religion/personal law and family relationship are involved?", "e.g. Christian parents seeking custody / Hindu spouse seeking divorce", true, "mandatory"),
      q("minor_or_family_details", "What are the minors, spouses, deceased person, or family members involved?", "e.g. minor Maryam age 7 currently with father", true, "mandatory"),
      q("welfare_or_right_ground", "What welfare, personal-law, minority-right, or protection ground supports the case?", "e.g. schooling, safety, denial of access, forced conversion concern", true, "mandatory"),
      q("documents_available", "Which marriage, birth, baptism, school, CNIC, succession, or community documents exist?", "e.g. birth certificate, school record, marriage certificate", false, "evidence"),
      q("current_custody_or_status", "What is the current custody, possession, marital, or estate status?", "e.g. minor with respondent since 01 May 2024", true, "procedural"),
      q("relief_sought", "What exact court protection or family relief is required?", "e.g. appoint guardian, custody, visitation, protection order, succession certificate", true, "relief"),
    ],
    draftingGuidance: "Identify the personal-law context, but anchor guardianship and custody relief in welfare of the minor. For minority protection or forced-conversion matters, avoid inflammatory claims unsupported by evidence and seek precise protective directions.",
    documentTypeMappings: ["guardianship", "christian-custody", "hindu-divorce", "minority-rights-petition", "forced-conversion"],
  },
];

const fallbackProfiles: ProfileWithPatterns[] = [
  {
    id: "service-labour-general",
    title: "Service / Employment / Labour Matter",
    law: "Applicable service rules, labour legislation, industrial-relations law, and constitutional law",
    matterType: "Employment, labour, or public-service proceeding",
    sectionRefs: ["Applicable service or labour statute", "Article 199 Constitution where maintainable"],
    searchTerms: ["service matter", "employment termination", "labour court", "industrial relations"],
    clientPosition: "petitioner",
    patterns: [/\bservice matter\b/i, /\bcivil servant\b/i, /\bemployment\b/i, /\btermination\b/i, /\bdismissal from service\b/i, /\blabou?r court\b/i, /\bindustrial relations\b/i],
    ingredients: [
      "Employment status, governing rules, appointing authority, and forum are identified.",
      "The impugned order, inquiry, show-cause process, and departmental remedies are traced.",
      "Limitation, alternate remedy, natural justice, proportionality, and back-benefit claims are addressed.",
    ],
    questions: [
      q("employment_status", "What is the employment or service status?", "e.g. permanent civil servant / workman / contract employee"),
      q("appointment_and_rules", "What appointment letter, service rules, or standing orders apply?", "e.g. appointment dated 10 January 2018 under applicable service rules"),
      q("impugned_action", "Which employment action or order is challenged?", "e.g. dismissal order dated 15 May 2024"),
      q("inquiry_history", "Was a show-cause notice, inquiry, or hearing conducted?", "e.g. charge sheet issued but no cross-examination allowed"),
      q("departmental_remedy", "Was any appeal, representation, or grievance notice filed?", "e.g. departmental appeal dismissed on 20 June 2024", false),
      q("relief_sought", "What final and interim service relief is required?", "e.g. reinstatement, back benefits, seniority, and suspension of dismissal"),
    ],
    draftingGuidance: "First determine whether the matter belongs before a labour court, service tribunal, departmental forum, civil court, or constitutional court. Plead status, governing rules, limitation, inquiry defects, hearing rights, proportionality, alternate remedy, and exact reinstatement or monetary consequences without assuming the forum.",
  },
  {
    id: "consumer-general",
    title: "Consumer Protection Claim",
    law: "Applicable provincial or territorial consumer protection statute",
    matterType: "Consumer claim for defective goods, deficient services, or unfair practices",
    sectionRefs: ["Applicable consumer protection law"],
    searchTerms: ["consumer claim", "defective goods", "deficiency in service", "consumer court"],
    clientPosition: "petitioner",
    patterns: [/\bconsumer\b/i, /\bdefective goods\b/i, /\bdeficien(?:t|cy) service\b/i, /\bunfair trade practice\b/i, /\bwarranty claim\b/i],
    ingredients: [
      "Consumer status, transaction, price, seller or service provider, and defect are identified.",
      "Demand, statutory notice where required, response, loss, and limitation are addressed.",
      "Refund, replacement, repair, compensation, costs, and interim protection are separated.",
    ],
    questions: [
      q("transaction_details", "What goods or services were purchased, when, and for what price?", "e.g. refrigerator purchased on 12 March 2024 for Rs. 180,000"),
      q("seller_provider", "Who supplied the goods or services?", "e.g. retailer, manufacturer, bank, hospital, or contractor"),
      q("defect_or_deficiency", "What defect, deficiency, or unfair practice occurred?", "e.g. product failed within warranty and replacement was refused"),
      q("proof_and_warranty", "Which receipts, warranty, correspondence, or expert material is available?", "e.g. invoice, warranty card, emails, inspection report"),
      q("notice_and_response", "Was a written demand or statutory notice sent and answered?", "e.g. notice dated 01 April 2024; no response", false),
      q("loss_and_relief", "What loss occurred and what relief is requested?", "e.g. refund, replacement, Rs. 100,000 compensation, and costs"),
    ],
    draftingGuidance: "Identify the correct territorial consumer statute and forum. Plead consumer status, transaction, defect or deficiency, notice compliance, limitation, causation, proven loss, and separately numbered compensatory and corrective relief.",
  },
  {
    id: "banking-finance-general",
    title: "Banking / Recovery of Finance Matter",
    law: "Financial Institutions (Recovery of Finances) Ordinance, 2001 and applicable banking law",
    matterType: "Banking-court recovery, leave to defend, or finance dispute",
    sectionRefs: ["Financial Institutions (Recovery of Finances) Ordinance, 2001"],
    searchTerms: ["banking court", "recovery of finances", "leave to defend", "finance facility"],
    clientPosition: "respondent",
    patterns: [/\bbanking court\b/i, /\brecovery of finance\b/i, /\bfinancial institution\b/i, /\bleave to defend\b/i, /\bfinance facility\b/i, /\bmortgage finance\b/i],
    ingredients: [
      "Facility documents, disbursement, repayment account, default, and outstanding amount are reconciled.",
      "Security, markup, notices, account statements, limitation, and statutory procedure are addressed.",
      "Any leave-to-defend question identifies substantial disputed facts and the defendant's calculation.",
    ],
    questions: [
      q("finance_facility", "What finance facility and documents are involved?", "e.g. running finance agreement dated 10 January 2021"),
      q("disbursement_and_default", "What amount was disbursed and when did default allegedly occur?", "e.g. Rs. 20,000,000; default alleged from July 2023"),
      q("account_calculation", "What amount is claimed and what amount is admitted or disputed?", "e.g. bank claims Rs. 24,500,000; markup calculation disputed"),
      q("security_details", "What mortgage, guarantee, pledge, or other security exists?", "e.g. equitable mortgage over commercial property"),
      q("notices_and_proceedings", "Which recall notices or prior banking proceedings exist?", "e.g. recall notice dated 05 May 2024", false),
      q("defence_or_relief", "What is the principal defence or recovery relief?", "e.g. incorrect account, unauthorized markup, adjustment, or decree and sale of security"),
    ],
    draftingGuidance: "Use the special banking procedure, exact account reconciliation, facility documents, security, notices, limitation, and statutory timelines. For leave to defend, state each substantial question and the defendant's own account rather than giving a bare denial.",
  },
  {
    id: "succession-probate-general",
    title: "Succession / Probate / Letters of Administration",
    law: "Succession Act, 1925 and applicable personal law",
    matterType: "Succession certificate, probate, or administration proceeding",
    sectionRefs: ["Succession Act, 1925"],
    searchTerms: ["succession certificate", "probate", "letters of administration", "legal heirs"],
    clientPosition: "petitioner",
    patterns: [/\bsuccession certificate\b/i, /\bprobate\b/i, /\bletters of administration\b/i, /\blegal heirs?\b/i, /\bestate of deceased\b/i, /\binheritance certificate\b/i],
    ingredients: [
      "Death, domicile, legal heirs, personal law, estate, debts or securities, and jurisdiction are identified.",
      "Will status, consent or objections, prior grants, and required notices are addressed.",
      "The prayer distinguishes succession certificate, probate, and letters of administration.",
    ],
    questions: [
      q("deceased_details", "Who died, on what date, and where was the deceased ordinarily resident?", "e.g. Muhammad Akram died on 10 March 2024 at Faisalabad"),
      q("legal_heirs", "Who are all legal heirs and what is each relationship?", "e.g. widow, two sons, and one daughter"),
      q("will_status", "Did the deceased leave a will?", "e.g. no will / registered will dated 01 January 2020", false),
      q("estate_details", "Which debts, securities, bank accounts, or property require administration?", "e.g. bank account and share certificates"),
      q("consent_or_dispute", "Do the other heirs consent or object?", "e.g. all heirs have signed no-objection affidavits", false),
      q("prior_proceedings", "Has any earlier succession, probate, or inheritance proceeding been filed?", "e.g. none", false),
    ],
    draftingGuidance: "Use the correct grant for the asset and will status. List every heir and estate item, establish domicile and jurisdiction, disclose objections and prior grants, request publication and evidence steps, and avoid deciding disputed title within summary succession proceedings.",
  },
  {
    id: "revenue-land-general",
    title: "Land Revenue / Mutation / Partition Matter",
    law: "Applicable provincial land-revenue, tenancy, colonization, and revenue rules",
    matterType: "Revenue appeal, mutation, partition, demarcation, or land-record dispute",
    sectionRefs: ["Applicable provincial land-revenue statute and rules"],
    searchTerms: ["land revenue", "mutation", "partition", "revenue appeal", "demarcation"],
    clientPosition: "petitioner",
    patterns: [/\bland revenue\b/i, /\bmutation\b/i, /\bintiqal\b/i, /\bpartition of land\b/i, /\bdemarcation\b/i, /\brevenue officer\b/i, /\bfard\b/i, /\bkhasra\b/i, /\bkhewat\b/i],
    ingredients: [
      "Land identity, title chain, possession, challenged entry or order, and revenue hierarchy are identified.",
      "Limitation, appeal or revision route, notice, hearing, fraud, and civil-court jurisdiction are assessed.",
      "The requested correction, remand, partition, demarcation, or restraint is precise.",
    ],
    questions: [
      q("land_identity", "What are the complete land-record particulars?", "e.g. Khewat No. 12, Khatooni No. 34, Khasra No. 56, Mouza ___"),
      q("title_and_possession", "What is the claimed title and present possession?", "e.g. inheritance mutation and possession of one-half share"),
      q("challenged_entry_order", "Which mutation, entry, partition step, or revenue order is challenged?", "e.g. Mutation No. 123 sanctioned on 15 May 2024"),
      q("notice_and_hearing", "Was notice served and was an opportunity of hearing given?", "e.g. mutation sanctioned without notice"),
      q("procedural_history", "Which appeal, revision, or civil proceeding has already occurred?", "e.g. Collector dismissed appeal on 10 June 2024", false),
      q("relief_sought", "What exact revenue or protective relief is required?", "e.g. set aside mutation, remand for fresh hearing, and restrain alienation"),
    ],
    draftingGuidance: "Identify the province and exact revenue enactment before selecting the forum. Give complete land particulars, title chain, possession, impugned entry/order, hierarchy, limitation, hearing defects, fraud allegations with particulars, civil-remedy implications, and exact consequential correction or remand relief.",
  },
  {
    id: "tax-customs-general",
    title: "Tax / Customs / Fiscal Matter",
    law: "Income Tax Ordinance, 2001, Sales Tax Act, 1990, Customs Act, 1969, or other applicable fiscal law",
    matterType: "Tax assessment, appeal, reference, recovery, or customs proceeding",
    sectionRefs: ["Applicable federal or provincial fiscal statute"],
    searchTerms: ["tax appeal", "income tax assessment", "sales tax", "customs appeal", "tax reference"],
    clientPosition: "appellant",
    patterns: [/\bincome tax\b/i, /\bsales tax\b/i, /\bcustoms\b/i, /\bfbr\b/i, /\btax appeal\b/i, /\btax reference\b/i, /\bassessment order\b/i, /\bfiscal\b/i],
    ingredients: [
      "Tax period, registration status, return, notice, assessment or adjudication order, and amount are identified.",
      "Statutory forum, limitation, preconditions, record, and stay of recovery are addressed.",
      "Each ground separates jurisdiction, procedure, classification, valuation, exemption, input adjustment, evidence, and calculation issues.",
    ],
    questions: [
      q("tax_type_period", "Which tax or duty and tax period are involved?", "e.g. income tax year 2023 / sales tax period March 2024"),
      q("impugned_order", "Which notice, assessment, adjudication, or appellate order is challenged?", "e.g. assessment order dated 15 May 2024"),
      q("amount_and_calculation", "What tax, duty, penalty, default surcharge, or refund amount is disputed?", "e.g. demand of Rs. 8,500,000 including penalty"),
      q("main_tax_issue", "What is the principal legal or factual tax issue?", "e.g. disallowed input tax / wrong valuation / limitation / lack of hearing"),
      q("procedural_history", "Which objections, appeals, or departmental remedies have been used?", "e.g. appeal before Commissioner dismissed", false),
      q("stay_and_final_relief", "Is recovery stay required and what final relief is sought?", "e.g. suspend recovery and annul or remand assessment"),
    ],
    draftingGuidance: "Confirm the fiscal statute, tax period, forum, limitation, and any mandatory precondition. Reconcile the calculation, identify the record and notices, separate jurisdictional and merits grounds, and support recovery stay with a prima facie case, hardship, balance of convenience, and prompt-hearing request where applicable.",
  },
  {
    id: "corporate-commercial-general",
    title: "Corporate / Commercial Matter",
    law: "Companies Act, 2017, Contract Act, 1872, Partnership Act, 1932, and applicable commercial law",
    matterType: "Company, partnership, shareholder, director, or commercial dispute",
    sectionRefs: ["Companies Act, 2017", "Applicable contract or partnership law"],
    searchTerms: ["company petition", "shareholder dispute", "director dispute", "partnership dissolution"],
    clientPosition: "petitioner",
    patterns: [/\bcompany petition\b/i, /\bcompanies act\b/i, /\bshareholder\b/i, /\bdirector dispute\b/i, /\bpartnership dissolution\b/i, /\bminority oppression\b/i, /\bsecp\b/i],
    ingredients: [
      "Entity status, constitutional documents, ownership or partnership interests, resolutions, and disputed conduct are identified.",
      "Internal remedies, notices, regulator or company-court jurisdiction, limitation, and documentary record are addressed.",
      "Accounts, management, restraint, inspection, buyout, winding-up, dissolution, or damages relief is precisely framed.",
    ],
    questions: [
      q("entity_details", "What entity and legal structure are involved?", "e.g. private limited company / registered partnership"),
      q("ownership_management", "What are the parties' shares, partnership ratios, or management roles?", "e.g. petitioner holds 40% shares and is a director"),
      q("governing_documents", "Which articles, memorandum, partnership deed, agreement, or resolutions apply?", "e.g. articles and shareholders agreement dated 10 January 2020"),
      q("disputed_conduct", "What corporate or commercial conduct is challenged?", "e.g. unauthorized allotment, exclusion from management, diversion of funds"),
      q("internal_regulatory_steps", "What notices, meetings, internal remedies, or SECP steps occurred?", "e.g. requisition notice ignored", false),
      q("relief_sought", "What interim and final commercial relief is required?", "e.g. restrain transfer, inspect records, set aside allotment, order accounts"),
    ],
    draftingGuidance: "Identify the entity, statute, governing documents, standing, forum, internal remedies, resolutions, ownership, fiduciary or contractual duty, accounts and documentary trail. Tailor interim preservation and final corporate relief without converting a personal grievance into an unsupported company claim.",
  },
  {
    id: "cybercrime-general",
    title: "Cybercrime / Electronic Evidence Matter",
    law: "Applicable cybercrime law, Pakistan Penal Code, CrPC, and Qanun-e-Shahadat Order, 1984",
    matterType: "Cybercrime complaint, defence, bail, quashment, or electronic-evidence dispute",
    sectionRefs: ["Applicable cybercrime law", "Qanun-e-Shahadat Order, 1984"],
    searchTerms: ["cybercrime", "electronic evidence", "unauthorized access", "online harassment"],
    clientPosition: "defence",
    patterns: [/\bcybercrime\b/i, /\belectronic evidence\b/i, /\bonline harassment\b/i, /\bunauthori[sz]ed access\b/i, /\bdata theft\b/i, /\bfia cyber\b/i, /\bpeca\b/i],
    ingredients: [
      "Account, device, communication, alleged act, date, platform, complainant, and jurisdiction are identified.",
      "Attribution, authorization, preservation, seizure, forensic integrity, chain of custody, and admissibility are addressed.",
      "The requested complaint, bail, quashment, blocking, preservation, or defence relief matches the procedural stage.",
    ],
    questions: [
      q("digital_incident", "What online or electronic act is alleged, and when did it occur?", "e.g. unauthorized account access and messages sent on 12 May 2024"),
      q("accounts_devices", "Which account, device, number, platform, or data is involved?", "e.g. WhatsApp number, Facebook account, laptop, or email"),
      q("attribution", "What connects the alleged person to the account or device?", "e.g. subscriber data, IP record, recovery, admission, or no direct attribution"),
      q("complaint_investigation", "What complaint, inquiry, FIR, seizure, or forensic step has occurred?", "e.g. FIA inquiry No. ___; phone seized without mirror image"),
      q("electronic_material", "Which screenshots, logs, devices, certificates, or forensic reports exist?", "e.g. screenshots only; no original device", false),
      q("relief_sought", "What procedural or protective relief is required?", "e.g. complaint registration, bail, quashment, data preservation, or return of device"),
    ],
    draftingGuidance: "Verify the currently applicable cybercrime provisions before filing. Plead attribution, authorization, territorial nexus, preservation and acquisition method, chain of custody, forensic integrity, electronic-evidence admissibility, procedural stage, and narrowly tailored protective or criminal-process relief.",
  },
  {
    id: "arbitration-general",
    title: "Arbitration / Award Enforcement Matter",
    law: "Arbitration Act, 1940 and other applicable domestic or international arbitration law",
    matterType: "Arbitration appointment, stay, challenge, or award enforcement",
    sectionRefs: ["Arbitration Act, 1940 or applicable arbitration statute"],
    searchTerms: ["arbitration agreement", "appointment of arbitrator", "arbitral award", "award enforcement"],
    clientPosition: "petitioner",
    patterns: [/\barbitration\b/i, /\barbitral award\b/i, /\barbitrator\b/i, /\baward enforcement\b/i, /\baward challenge\b/i],
    ingredients: [
      "Arbitration agreement, seat or place, governing law, dispute notice, tribunal, and award status are identified.",
      "Jurisdiction, limitation, waiver, court intervention, service, and challenge or enforcement grounds are addressed.",
      "Interim protection and final relief preserve the distinction between merits review and permissible statutory control.",
    ],
    questions: [
      q("arbitration_clause", "What arbitration clause or separate agreement applies?", "e.g. Clause 18 of agreement dated 10 January 2022"),
      q("dispute_and_notice", "What dispute arose and what arbitration notice was served?", "e.g. non-payment dispute; notice dated 15 March 2024"),
      q("tribunal_status", "Has an arbitrator been appointed and what proceedings occurred?", "e.g. sole arbitrator appointed; respondent did not appear", false),
      q("award_details", "Is there an award, and what date and relief does it contain?", "e.g. award dated 01 June 2024 for Rs. 5,000,000", false),
      q("challenge_or_enforcement_ground", "What appointment, stay, challenge, or enforcement ground is relied upon?", "e.g. invalid notice / misconduct / enforcement of unpaid award"),
      q("interim_relief", "What interim protection is needed?", "e.g. preserve machinery or restrain disposal of assets", false),
    ],
    draftingGuidance: "Identify the arbitration regime, agreement, parties, seat or place, notices, tribunal history, limitation, waiver and award status. Use only legally permitted appointment, stay, setting-aside, filing, recognition or enforcement grounds and seek focused interim preservation where supportable.",
  },
  {
    id: "execution-contempt-general",
    title: "Execution / Enforcement / Contempt Matter",
    law: "Code of Civil Procedure, 1908 and the law governing the underlying order",
    matterType: "Execution of decree/order or contempt for disobedience",
    sectionRefs: ["Order XXI CPC", "Applicable contempt jurisdiction"],
    searchTerms: ["execution petition", "Order XXI CPC", "enforcement of decree", "contempt disobedience"],
    clientPosition: "petitioner",
    patterns: [/\bexecution petition\b/i, /\border\s*(?:xxi|21)\b/i, /\bdecree holder\b/i, /\bjudgment debtor\b/i, /\bcontempt petition\b/i, /\bdisobedience of order\b/i],
    ingredients: [
      "The decree or order, date, court, parties, operative relief, finality, and service are identified.",
      "Satisfaction, outstanding obligation, assets, objections, limitation, and selected mode of execution are addressed.",
      "Contempt allegations distinguish deliberate disobedience from ordinary execution and state knowledge and ability to comply.",
    ],
    questions: [
      q("order_decree_details", "Which decree or order is to be enforced?", "e.g. decree dated 10 January 2024 passed in Civil Suit No. ___"),
      q("operative_relief", "What exact obligation or relief was ordered?", "e.g. payment of Rs. 2,000,000 or delivery of possession"),
      q("appeal_and_stay", "Is any appeal, review, stay, or modification pending?", "e.g. appeal dismissed; no stay operating", false),
      q("compliance_status", "What has been paid, performed, or disobeyed?", "e.g. no payment despite service of decree"),
      q("assets_or_mode", "Which asset, salary, account, property, arrest, possession, or other execution mode is sought?", "e.g. attachment and sale of identified property", false),
      q("service_and_knowledge", "How and when did the opposing party learn of the order?", "e.g. certified copy served on 15 February 2024", false),
    ],
    draftingGuidance: "Use execution as the primary enforcement route unless contempt requirements are independently met. Plead the operative order, service, finality, satisfaction balance, limitation, objections, identifiable assets or required act, exact execution mode, and deliberate disobedience only where facts support it.",
  },
  {
    id: "criminal-general",
    title: "Criminal Matter",
    law: "Pakistan Penal Code / CrPC",
    matterType: "General criminal case",
    sectionRefs: ["PPC", "CrPC"],
    searchTerms: ["criminal case", "PPC", "CrPC"],
    clientPosition: "defence",
    patterns: [/\bppc\b/i, /\bcrpc\b/i, /\bfir\b/i, /\bcriminal\b/i, /\boffence\b/i, /\bpolice\b/i],
    ingredients: [
      "Offence sections, FIR details, role, evidence, and defence position are needed.",
      "Arrest, recovery, witnesses, and investigation status shape the draft.",
    ],
    questions: [
      q("offence_sections", "Which offence sections are involved?", "e.g. 379 PPC / 506 PPC / 337-F PPC"),
      q("fir_details", "What are the FIR number, date, and police station?", "e.g. FIR No. 123/2024, PS City"),
      q("incident_facts", "What happened in the incident?", "e.g. brief chronology with date, place, and allegation"),
      q("role_of_client", "What role is assigned to your client?", "e.g. nominated accused / complainant / witness"),
      q("evidence_status", "What evidence or documents exist?", "e.g. MLR, CCTV, witnesses, recovery memo", false),
    ],
    draftingGuidance: "Collect offence, FIR, role, evidence, arrest, investigation, and strongest procedural or factual ground.",
  },
  {
    id: "family-general",
    title: "Family Matter",
    law: "Family Courts Act, 1964",
    matterType: "General family case",
    sectionRefs: ["Family Courts Act, 1964"],
    searchTerms: ["family case", "Family Courts Act"],
    clientPosition: "petitioner",
    patterns: [/\bfamily\b/i, /\bmarriage\b/i, /\bdivorce\b/i, /\btalaq\b/i, /\bnikah\b/i, /\bmehr\b/i],
    ingredients: [
      "Relationship, marriage details, children, claim type, and relief are needed.",
      "Connected claims should be identified early.",
    ],
    questions: [
      q("relationship_details", "What is the relationship and claim type?", "e.g. wife seeking maintenance / father seeking custody"),
      q("marriage_details", "What are the marriage or nikah details?", "e.g. Nikah dated 10 January 2020 at Lahore"),
      q("children_details", "Are children involved?", "e.g. two minors aged 5 and 3", false),
      q("main_grievance", "What is the main grievance?", "e.g. non-maintenance, cruelty, denial of visitation"),
      q("relief_sought", "What relief do you want?", "e.g. decree for maintenance, custody, dissolution, recovery of mehr"),
    ],
    draftingGuidance: "Collect marriage, jurisdiction, children, claim, facts, interim relief, and connected claims.",
  },
  {
    id: "civil-general",
    title: "Civil Matter",
    law: "CPC / Contract Act / Specific Relief Act",
    matterType: "General civil case",
    sectionRefs: ["CPC", "Contract Act, 1872", "Specific Relief Act, 1877"],
    searchTerms: ["civil suit", "CPC", "Specific Relief Act"],
    clientPosition: "petitioner",
    patterns: [/\bcivil\b/i, /\bsuit\b/i, /\bcontract\b/i, /\bagreement\b/i, /\bnotice\b/i, /\bdecree\b/i],
    ingredients: [
      "Cause of action, limitation, jurisdiction, documents, and relief are required.",
      "Interim relief should be identified before drafting.",
    ],
    questions: [
      q("cause_of_action", "What is the cause of action?", "e.g. breach of agreement dated 12 March 2024"),
      q("key_dates", "What are the key dates?", "e.g. agreement date, breach date, notice date"),
      q("documents_available", "Which documents support the claim?", "e.g. agreement, receipt, messages, bank statement"),
      q("amount_or_property", "What amount, property, or right is involved?", "e.g. Rs. 1,500,000 / House No. 12"),
      q("relief_sought", "What relief do you want from court?", "e.g. recovery, declaration, injunction, damages"),
      q("interim_relief", "Is any interim relief needed?", "e.g. temporary injunction / attachment before judgment", false),
    ],
    draftingGuidance: "Plead cause of action, limitation, jurisdiction, documents, interim relief, and exact final relief.",
  },
];

function profileMatches(profile: { patterns: RegExp[] }, text: string): boolean {
  return profile.patterns.some((pattern) => pattern.test(text));
}

function profileMatchScore(profile: ProfileWithPatterns, text: string): number {
  const priority: Record<string, number> = {
    "crpc-22a-22b-justice-of-peace": 100,
    "cpc-civil-revision-115": 95,
    "cpc-order-vii-rule-11": 95,
    "rent-appeal-punjab": 95,
    "crpc-criminal-revision-561a": 95,
    "criminal-fir-quashment": 98,
    "civil-specific-performance": 96,
    "tax-appeal-fbr": 95,
    "constitutional-service-writ": 96,
    "non-muslim-guardianship-family": 94,
  };
  const patternHits = profile.patterns.filter((pattern) => pattern.test(text)).length;
  return (priority[profile.id] || 0) + patternHits;
}

export function findCaseIntakeProfile(input: {
  sections?: string;
  purpose?: string;
  documentNeeded?: string;
  facts?: string;
}): CaseIntakeProfile | null {
  const text = [input.sections, input.purpose, input.documentNeeded, input.facts].filter(Boolean).join(" ");
  const specific = profiles
    .filter((profile) => profileMatches(profile, text))
    .sort((first, second) => profileMatchScore(second, text) - profileMatchScore(first, text))[0];
  if (specific) return withoutPatterns(specific);

  const fallback = fallbackProfiles.find((profile) => profileMatches(profile, text));
  return fallback ? withoutPatterns(fallback) : null;
}

function normalizeProfile(profile: ProfileWithPatterns): CaseIntakeProfile {
  const mandatoryQuestions = profile.mandatoryQuestions?.length
    ? profile.mandatoryQuestions
    : profile.questions.filter((question) => question.required);
  const optionalQuestions = profile.optionalQuestions?.length
    ? profile.optionalQuestions
    : profile.questions.filter((question) => !question.required);
  const proceduralQuestions = profile.proceduralQuestions?.length
    ? profile.proceduralQuestions
    : commonProceduralQuestions;
  const limitationQuestions = profile.limitationQuestions?.length
    ? profile.limitationQuestions
    : commonLimitationQuestions;
  const jurisdictionQuestions = profile.jurisdictionQuestions?.length
    ? profile.jurisdictionQuestions
    : commonJurisdictionQuestions;
  const reliefQuestions = profile.reliefQuestions?.length
    ? profile.reliefQuestions
    : commonReliefQuestions;

  const normalizedQuestions = mergeQuestionLists(
    mandatoryQuestions.map((question) => ({ ...question, category: question.category || "mandatory" })),
    proceduralQuestions.map((question) => ({ ...question, category: question.category || "procedural" })),
    limitationQuestions.map((question) => ({ ...question, category: question.category || "limitation" })),
    jurisdictionQuestions.map((question) => ({ ...question, category: question.category || "jurisdiction" })),
    reliefQuestions.map((question) => ({ ...question, category: question.category || "relief" })),
    optionalQuestions.map((question) => ({ ...question, category: question.category || "optional" }))
  );

  return {
    id: profile.id,
    title: profile.title,
    law: profile.law,
    matterType: profile.matterType,
    sectionRefs: profile.sectionRefs,
    ingredients: profile.ingredients,
    legalIngredients: profile.legalIngredients?.length ? profile.legalIngredients : profile.ingredients,
    questions: normalizedQuestions,
    mandatoryQuestions,
    optionalQuestions,
    proceduralQuestions,
    evidenceChecklist: profile.evidenceChecklist?.length ? profile.evidenceChecklist : commonEvidenceChecklist,
    limitationQuestions,
    jurisdictionQuestions,
    reliefQuestions,
    riskFlags: profile.riskFlags?.length ? profile.riskFlags : commonRiskFlags,
    documentTypeMappings: profile.documentTypeMappings?.length
      ? profile.documentTypeMappings
      : [
          profile.title,
          profile.matterType,
          ...profile.searchTerms,
          ...profile.sectionRefs,
        ].map((item) => item.toLowerCase()),
    searchTerms: profile.searchTerms,
    clientPosition: profile.clientPosition,
    draftingGuidance: profile.draftingGuidance,
    draftingSourceNote: profile.draftingSourceNote,
  };
}

function withoutPatterns(profile: ProfileWithPatterns): CaseIntakeProfile {
  const normalized = normalizeProfile(profile);
  return {
    ...normalized,
  };
}

export function getCaseIntakeProfiles(): CaseIntakeProfile[] {
  return [...profiles, ...fallbackProfiles].map(normalizeProfile);
}

export function buildKnowledgeInterpretation(profile: CaseIntakeProfile): string {
  return `${profile.sectionRefs.join(", ")}: ${profile.title} under ${profile.law}.`;
}

export function buildNoJudgmentLegalStrategy(profile: CaseIntakeProfile | null, issue: string): string {
  if (!profile) {
    return `No direct judgments were found in the local database for "${issue}". Continue with statute-based legal reasoning: identify the applicable law, plead the required ingredients, apply the provided facts, and keep any uncited legal reasoning clearly separate from actual reported authorities.`;
  }

  return [
    `No direct judgments were found in the local database for ${profile.title}.`,
    `Proceed on ${profile.sectionRefs.join(", ")} using the essential ingredients: ${profile.ingredients.join(" ")}`,
    `Drafting guidance: ${profile.draftingGuidance}`,
    profile.draftingSourceNote ? `Source note: ${profile.draftingSourceNote}` : "",
    "Any legal reasoning used at this stage is AI-generated statutory analysis, not an actual cited judgment. Future matching judgments in the database should be used automatically when available.",
  ].join(" ");
}

export function knowledgeBlock(profile: CaseIntakeProfile | null): string {
  if (!profile) return "";
  return `CASE BUILDER KNOWLEDGE PROFILE
Matter: ${profile.title}
Applicable law: ${profile.law}
Relevant provision(s): ${profile.sectionRefs.join(", ")}
Essential ingredients:
${profile.legalIngredients.map((item) => `- ${item}`).join("\n")}
Evidence checklist:
${profile.evidenceChecklist.map((item) => `- ${item}`).join("\n")}
Risk flags:
${profile.riskFlags.map((item) => `- ${item}`).join("\n")}
Drafting guidance:
${profile.draftingGuidance}
${profile.draftingSourceNote ? `Source note: ${profile.draftingSourceNote}` : ""}`;
}
