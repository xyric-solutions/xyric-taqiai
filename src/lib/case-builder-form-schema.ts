export type CaseFormCoreField =
  | "firNo"
  | "policeStation"
  | "courtName"
  | "districtName"
  | "clientName"
  | "clientFatherName"
  | "clientCnic"
  | "clientAddress"
  | "opponentName"
  | "opponentFatherName"
  | "opponentCnic"
  | "opponentAddress";

export interface CaseFormField {
  id: string;
  label: string;
  placeholder: string;
  required?: boolean;
  input?: "text" | "textarea";
  coreField?: CaseFormCoreField;
  sourceIds?: string[];
  aliases?: string[];
  width?: "half" | "full";
}

export interface CaseFormGroup {
  id: string;
  title: string;
  description: string;
  fields: CaseFormField[];
}

export interface CaseFormSchema {
  kind: string;
  title: string;
  description: string;
  clientRole: string;
  opponentRole: string;
  groups: CaseFormGroup[];
}

export interface CaseFormSchemaInput {
  profileId?: string;
  profileTitle?: string;
  matterType?: string;
  sections?: string;
  purpose?: string;
  documentNeeded?: string;
}

type Side = "client" | "opponent";

const field = (
  id: string,
  label: string,
  placeholder: string,
  options: Omit<CaseFormField, "id" | "label" | "placeholder"> = {},
): CaseFormField => ({ id, label, placeholder, ...options });

const partyFields = (side: Side, role: string): CaseFormField[] => {
  const client = side === "client";
  return [
    field(`${side}_name`, `${role} Name`, client ? "Example: Ali Khan" : "Example: Ahmed Raza", {
      coreField: client ? "clientName" : "opponentName",
      sourceIds: client
        ? ["petitioner_name", "applicant_name", "accused_name", "plaintiff_name", "client_name"]
        : ["respondent_name", "defendant_name", "complainant_name", "opponent_name"],
      aliases: [`${role.toLowerCase()} name`],
    }),
    field(`${side}_father_name`, `${role} Father's Name`, "Example: Muhammad Aslam", {
      coreField: client ? "clientFatherName" : "opponentFatherName",
      sourceIds: client
        ? ["petitioner_father_name", "applicant_father_name", "accused_father_name", "plaintiff_father_name"]
        : ["respondent_father_name", "defendant_father_name", "complainant_father_name"],
      aliases: [`${role.toLowerCase()} father`],
    }),
    field(`${side}_cnic`, `${role} CNIC`, "Example: 35202-1234567-1", {
      coreField: client ? "clientCnic" : "opponentCnic",
      sourceIds: client
        ? ["petitioner_cnic", "applicant_cnic", "accused_cnic", "plaintiff_cnic"]
        : ["respondent_cnic", "defendant_cnic", "complainant_cnic"],
      aliases: [`${role.toLowerCase()} cnic`],
    }),
    field(`${side}_address`, `${role} Address`, "Example: House 12, Civil Lines, Lahore", {
      coreField: client ? "clientAddress" : "opponentAddress",
      sourceIds: client
        ? ["petitioner_address", "applicant_address", "accused_address", "plaintiff_address"]
        : ["respondent_address", "defendant_address", "complainant_address"],
      aliases: [`${role.toLowerCase()} address`],
      width: "full",
    }),
  ];
};

const courtFields = (caseLabel = "Case / Petition Number"): CaseFormField[] => {
  const label = caseLabel.toLowerCase();
  const casePlaceholder = label.includes("family")
    ? "Example: Family Suit No. 123/2026"
    : label.includes("bail")
      ? "Example: Crl. Misc. No. 456/2026"
      : label.includes("criminal")
        ? "Example: Sessions Case No. 78/2026"
        : label.includes("civil")
          ? "Example: Civil Suit No. 321/2026"
          : label.includes("writ")
            ? "Example: W.P. No. 1234/2026"
            : label.includes("agreement")
              ? "Example: Agreement dated 21 July 2026"
              : "Example: Case No. 123/2026";
  const courtPlaceholder = label.includes("family")
    ? "Example: Judge Family Court, Lahore"
    : label.includes("bail") || label.includes("criminal")
      ? "Example: Court of Additional Sessions Judge, Lahore"
      : label.includes("writ")
        ? "Example: Lahore High Court, Lahore"
        : label.includes("civil")
          ? "Example: Court of Civil Judge, Lahore"
          : "Example: Relevant Court or Tribunal, Lahore";
  return [
  field("case_number", caseLabel, casePlaceholder, {
    sourceIds: ["case_number", "case_no", "underlying_case", "case_details"],
    aliases: ["case number", "petition number", "appeal number"],
  }),
  field("court_name", "Court / Forum", courtPlaceholder, {
    coreField: "courtName",
    sourceIds: ["court_name", "forum_name"],
    aliases: ["court name", "forum"],
  }),
  field("district_name", "District / Place of Filing", "Example: Lahore", {
    coreField: "districtName",
    sourceIds: ["district_name", "filing_district", "jurisdiction_place"],
    aliases: ["district", "place of filing"],
  }),
  ];
};

const firFields = (): CaseFormField[] => [
  field("fir_number", "FIR Number", "Example: FIR No. 123/2026", {
    coreField: "firNo",
    sourceIds: ["fir_number", "fir_number_date", "fir_details", "fir_complete_details"],
    aliases: ["fir number", "fir details"],
  }),
  field("police_station", "Police Station", "Example: Police Station Lower Mall, Lahore", {
    coreField: "policeStation",
    sourceIds: ["police_station", "fir_number_date", "fir_details", "fir_complete_details"],
    aliases: ["police station", "thana"],
  }),
];

const group = (id: string, title: string, description: string, fields: CaseFormField[]): CaseFormGroup => ({
  id,
  title,
  description,
  fields,
});

function filingGroup(caseLabel?: string): CaseFormGroup {
  return group(
    "filing",
    "Court and Filing",
    "Heading and territorial details for the court document.",
    courtFields(caseLabel),
  );
}

function criminalSchema(): CaseFormSchema {
  return {
    kind: "criminal",
    title: "Criminal Case Filing Details",
    description: "Accused, complainant, police, and court information only.",
    clientRole: "Accused / Applicant",
    opponentRole: "Complainant",
    groups: [
      group("accused", "Accused / Applicant", "Identity used in the cause title and supporting affidavit.", partyFields("client", "Accused")),
      group("complainant", "Complainant", "Person who lodged the complaint or FIR.", partyFields("opponent", "Complainant")),
      group("investigation", "FIR and Investigation", "Police record and investigating officer details.", [
        ...firFields(),
        field("investigating_officer", "Investigating Officer", "Example: Sub-Inspector Muhammad Imran", {
          sourceIds: ["investigating_officer", "investigation_officer", "io_name"],
          aliases: ["investigating officer", "investigation officer"],
        }),
      ]),
      filingGroup("Criminal Case Number"),
    ],
  };
}

function bailSchema(): CaseFormSchema {
  return {
    kind: "bail",
    title: "Bail Case Filing Details",
    description: "Accused identity, FIR, custody, and bail forum details.",
    clientRole: "Accused / Petitioner",
    opponentRole: "State / Complainant",
    groups: [
      group("accused", "Accused / Petitioner", "Identity of the person seeking bail.", partyFields("client", "Accused")),
      group("fir_custody", "FIR and Custody", "Only the criminal record needed for the bail application.", [
        ...firFields(),
        field("offence_sections", "Offence Sections", "Example: Sections 295-C and 34 PPC", {
          sourceIds: ["offence_sections", "proposed_offences"],
          aliases: ["offence sections", "sections involved"],
        }),
        field("arrest_status", "Arrest / Custody Details", "Example: Arrested on 19 July 2026; judicial custody", {
          sourceIds: ["arrest_status", "custody_investigation_status", "date_of_arrest", "custody_status"],
          aliases: ["arrest status", "custody status", "date of arrest"],
          width: "full",
        }),
      ]),
      filingGroup("Bail Application Number"),
    ],
  };
}

function civilSchema(propertyMatter: boolean): CaseFormSchema {
  return {
    kind: propertyMatter ? "civil-property" : "civil",
    title: propertyMatter ? "Civil Property Case Filing Details" : "Civil Case Filing Details",
    description: propertyMatter
      ? "Plaintiff, defendant, property identity, and civil court details."
      : "Plaintiff, defendant, cause of action, and civil court details.",
    clientRole: "Plaintiff / Applicant",
    opponentRole: "Defendant / Respondent",
    groups: [
      group("plaintiff", "Plaintiff / Applicant", "Party bringing the civil claim.", partyFields("client", "Plaintiff")),
      group("defendant", "Defendant / Respondent", "Party against whom relief is claimed.", partyFields("opponent", "Defendant")),
      group("claim", propertyMatter ? "Property and Cause of Action" : "Cause of Action", "Core subject matter required for the plaint.", propertyMatter ? [
        field("property_description", "Property Details", "Example: House No. 24, Block B, Model Town, Lahore", {
          sourceIds: ["property_description", "property_or_subject", "land_identity", "premises_description"],
          aliases: ["property details", "property description", "land identity"],
          width: "full",
        }),
        field("cause_of_action", "Cause of Action", "Example: Illegal dispossession threatened on 15 July 2026", {
          sourceIds: ["cause_of_action", "threat_or_illegal_act", "basis_of_claim"],
          aliases: ["cause of action", "illegal act"],
          input: "textarea",
          width: "full",
        }),
      ] : [
        field("cause_of_action", "Cause of Action", "Example: Payment became due on 1 June 2026 and remains unpaid", {
          sourceIds: ["cause_of_action", "basis_of_claim", "transaction_details"],
          aliases: ["cause of action", "basis of claim"],
          input: "textarea",
          width: "full",
        }),
      ]),
      filingGroup("Civil Suit / Application Number"),
    ],
  };
}

function familySchema(profileId: string): CaseFormSchema {
  const custody = /custody|guardianship/.test(profileId);
  const maintenance = /maintenance/.test(profileId);
  return {
    kind: custody ? "family-custody" : maintenance ? "family-maintenance" : "family",
    title: custody ? "Custody and Guardianship Filing Details" : maintenance ? "Family Maintenance Filing Details" : "Family Case Filing Details",
    description: custody
      ? "Parents, minor children, current custody, and Guardian Court details."
      : maintenance
        ? "Parties, relationship, dependants, maintenance, and Family Court details."
        : "Petitioner, respondent, marriage, children, and Family Court details.",
    clientRole: "Petitioner",
    opponentRole: "Respondent",
    groups: [
      group("petitioner", "Petitioner", "Party filing the family proceeding.", partyFields("client", "Petitioner")),
      group("respondent", "Respondent", "Other spouse, parent, or guardian.", partyFields("opponent", "Respondent")),
      group("family_details", custody ? "Children and Custody" : maintenance ? "Relationship and Maintenance" : "Marriage and Family", "Matter-specific family details only.", custody ? [
        field("minor_names_ages", "Children / Minors", "Example: Ayesha, age 8; Hamza, age 5", {
          sourceIds: ["minor_names_ages", "children_details", "minor_or_family_details"],
          aliases: ["minor names", "children details"],
          width: "full",
        }),
        field("current_custody", "Current Custody", "Example: Both minors currently reside with the respondent", {
          sourceIds: ["current_custody", "current_custody_or_status"],
          aliases: ["current custody"],
          width: "full",
        }),
      ] : maintenance ? [
        field("marriage_or_birth_details", "Marriage / Relationship Details", "Example: Nikah solemnized on 12 March 2018 at Lahore", {
          sourceIds: ["marriage_or_birth_details", "relationship_basis", "marriage_details"],
          aliases: ["marriage details", "relationship details"],
          width: "full",
        }),
        field("monthly_amount_claimed", "Monthly Maintenance Claimed", "Example: Rs. 75,000/- (Rupees Seventy Five Thousand Only) per month", {
          sourceIds: ["monthly_amount_claimed", "school_medical_expenses"],
          aliases: ["maintenance claimed", "monthly amount"],
        }),
      ] : [
        field("marriage_date", "Marriage Date and Place", "Example: 12 March 2018, Lahore", {
          sourceIds: ["marriage_date", "marriage_details", "relationship_details"],
          aliases: ["marriage date", "marriage details"],
        }),
        field("children_details", "Children", "Example: Two children, ages 8 and 5", {
          sourceIds: ["children_details", "minor_names_ages"],
          aliases: ["children details", "minor names"],
        }),
      ]),
      filingGroup("Family Case Number"),
    ],
  };
}

function constitutionalSchema(serviceMatter: boolean): CaseFormSchema {
  return {
    kind: serviceMatter ? "constitutional-service" : "constitutional",
    title: serviceMatter ? "Service Writ Filing Details" : "Constitutional Petition Filing Details",
    description: "Petitioner, public authority, impugned action, and constitutional relief details.",
    clientRole: "Petitioner",
    opponentRole: "Government Authority / Respondent",
    groups: [
      group("petitioner", "Petitioner", "Person whose constitutional or service right is affected.", partyFields("client", "Petitioner")),
      group("authority", "Government Authority / Respondent", "Department or public office whose action is challenged.", [
        field("respondent_authority", "Authority / Department", "Example: Secretary, School Education Department, Punjab", {
          coreField: "opponentName",
          sourceIds: ["authority_or_department", "department_authority", "department_authority", "respondent_authority"],
          aliases: ["authority or department", "government authority", "department"],
          width: "full",
        }),
        field("opponent_address", "Official Address", "Example: Civil Secretariat, Lahore", {
          coreField: "opponentAddress",
          sourceIds: ["respondent_address", "authority_address", "department_address"],
          aliases: ["official address", "authority address"],
          width: "full",
        }),
      ]),
      group("challenge", "Impugned Action and Relief", "The exact public action and constitutional remedy sought.", [
        field("impugned_action", "Impugned Order / Action", "Example: Termination order dated 10 July 2026", {
          sourceIds: ["impugned_action", "impugned_service_order", "impugned_order"],
          aliases: ["impugned action", "impugned order"],
          width: "full",
        }),
        field("relief_sought", "Relief Sought", "Example: Set aside the order and restore the petitioner to service", {
          sourceIds: ["relief_sought", "service_relief", "final_relief_sought"],
          aliases: ["relief sought", "final relief"],
          input: "textarea",
          width: "full",
        }),
      ]),
      filingGroup("Writ Petition Number"),
    ],
  };
}

function vehicleSchema(text: string): CaseFormSchema {
  const theft = /theft|stolen|snatch/.test(text);
  const accident = /accident|collision|motor vehicle claim/.test(text);
  const sale = /sale|sell|purchase|purchaser|buyer|agreement/.test(text);
  const clientRole = sale ? "Owner / Seller" : accident ? "Owner / Driver / Claimant" : "Owner / Complainant";
  const opponentRole = sale ? "Purchaser" : accident ? "Opposing Driver / Owner" : "Accused / Suspect";
  return {
    kind: theft ? "vehicle-theft" : accident ? "vehicle-accident" : sale ? "vehicle-sale" : "vehicle",
    title: theft ? "Vehicle Theft Case Filing Details" : accident ? "Vehicle Accident Case Filing Details" : sale ? "Vehicle Sale Case Details" : "Vehicle Case Filing Details",
    description: "Parties, registration identity, vehicle identifiers, and the relevant legal record.",
    clientRole,
    opponentRole,
    groups: [
      group("owner", clientRole, "Registered owner, seller, driver, or claimant details.", partyFields("client", clientRole)),
      group("other_party", opponentRole, "Only the legally relevant opposite party.", partyFields("opponent", opponentRole)),
      group("vehicle", "Vehicle Identification", "Exact Excise and registration particulars.", [
        field("vehicle_make_model", "Make, Model and Year", "Example: Toyota Corolla GLi, 2020", {
          sourceIds: ["vehicle_make_model", "make_model", "vehicle_details"],
          aliases: ["make and model", "vehicle details"],
        }),
        field("vehicle_registration_number", "Registration Number", "Example: LEA-1234", {
          sourceIds: ["vehicle_registration_number", "registration_number", "registration_no"],
          aliases: ["registration number"],
        }),
        field("engine_number", "Engine Number", "Example: 2NZ-4567890", {
          sourceIds: ["engine_number", "engine_no"],
          aliases: ["engine number"],
        }),
        field("chassis_number", "Chassis Number", "Example: NKE165-7012345", {
          sourceIds: ["chassis_number", "chassis_no"],
          aliases: ["chassis number"],
        }),
      ]),
      ...(theft || accident ? [group("police", "Police Record", "FIR and police station, if registered.", firFields())] : []),
      filingGroup(sale ? "Agreement / Transfer Reference" : "Case Number"),
    ],
  };
}

function specialistSchema(kind: string, title: string, clientRole: string, opponentRole: string, subjectFields: CaseFormField[]): CaseFormSchema {
  return {
    kind,
    title,
    description: `${clientRole}, ${opponentRole.toLowerCase()}, subject matter, and forum details.`,
    clientRole,
    opponentRole,
    groups: [
      group("client", clientRole, "Applicant or claimant identity for the cause title.", partyFields("client", clientRole)),
      group("opponent", opponentRole, "Responding party, office, institution, or department.", partyFields("opponent", opponentRole)),
      group("subject", "Matter-Specific Record", "Identifiers required for this exact proceeding.", subjectFields),
      filingGroup(),
    ],
  };
}

export function resolveCaseFormSchema(input: CaseFormSchemaInput): CaseFormSchema {
  const profileId = (input.profileId || "").toLowerCase();
  const text = [profileId, input.profileTitle, input.matterType, input.sections, input.purpose, input.documentNeeded]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  if (/vehicle|motorcycle|motor car|car theft|registration number|chassis|engine number/.test(text)) return vehicleSchema(text);
  if (/crpc-bail|\bbail\b|zamanat/.test(text)) return bailSchema();
  if (/family|khula|maintenance|custody|guardianship|marriage|divorce/.test(text)) return familySchema(profileId);
  if (/constitutional|article 199|\bwrit\b/.test(text)) return constitutionalSchema(/service|employment|civil servant/.test(text));
  if (/criminal|\bppc\b|\bcrpc\b|\bfir\b|murder|fraud|cybercrime/.test(text)) return criminalSchema();
  if (/civil|injunction|recovery|specific performance|property|rent|land|revenue/.test(text)) {
    return civilSchema(/property|injunction|possession|land|revenue|rent/.test(text));
  }
  if (/tax|customs|fbr/.test(text)) return specialistSchema("tax", "Tax and Fiscal Case Filing Details", "Taxpayer / Appellant", "Tax Authority / Respondent", [
    field("taxpayer_registration", "NTN / STRN / Registration", "Example: NTN 1234567-8", { sourceIds: ["taxpayer_registration", "tax_type_period"] }),
    field("impugned_order", "Assessment / Impugned Order", "Example: Order No. 45 dated 10 July 2026", { sourceIds: ["tax_period_order", "impugned_order"], width: "full" }),
  ]);
  if (/service|employment|labou?r/.test(text)) return specialistSchema("service", "Service and Employment Case Filing Details", "Employee / Petitioner", "Employer / Department", [
    field("employment_status", "Designation and Employment Status", "Example: Senior Clerk, BS-14, permanent employee", { sourceIds: ["employment_status", "employee_status_rules"] }),
    field("impugned_action", "Impugned Employment Action", "Example: Dismissal order dated 10 July 2026", { sourceIds: ["impugned_action", "impugned_service_order"], width: "full" }),
  ]);
  if (/succession|probate|estate|legal heir/.test(text)) return specialistSchema("succession", "Succession and Probate Filing Details", "Applicant / Legal Heir", "Other Legal Heirs / Respondents", [
    field("deceased_details", "Deceased and Death Details", "Example: Muhammad Aslam, died on 5 May 2026 at Lahore", { sourceIds: ["deceased_details"], width: "full" }),
    field("estate_details", "Estate / Assets", "Example: Bank account, vehicle, and house at Lahore", { sourceIds: ["estate_details"], width: "full" }),
  ]);
  if (/consumer/.test(text)) return specialistSchema("consumer", "Consumer Claim Filing Details", "Consumer / Complainant", "Seller / Service Provider", [
    field("transaction_details", "Purchase / Service Details", "Example: Invoice No. 451 dated 2 June 2026", { sourceIds: ["transaction_details"] }),
    field("defect_or_deficiency", "Defect / Deficiency", "Example: Product stopped working within seven days", { sourceIds: ["defect_or_deficiency"], width: "full" }),
  ]);
  if (/banking|finance facility|financial institution/.test(text)) return specialistSchema("banking", "Banking Case Filing Details", "Customer / Defendant", "Bank / Financial Institution", [
    field("finance_facility", "Finance Facility", "Example: Running finance facility sanctioned on 1 January 2024", { sourceIds: ["finance_facility"], width: "full" }),
    field("account_calculation", "Claimed Amount / Account", "Example: Account No. 001234; disputed balance Rs. 25,00,000/- (Rupees Twenty Five Lac Only)", { sourceIds: ["account_calculation", "disbursement_and_default"], width: "full" }),
  ]);
  if (/corporate|company|shareholder|partnership|secp/.test(text)) return specialistSchema("corporate", "Corporate and Commercial Case Filing Details", "Petitioner / Company", "Company / Director / Respondent", [
    field("entity_details", "Entity and Registration Details", "Example: ABC (Pvt.) Ltd., CUIN 0123456", { sourceIds: ["entity_details"] }),
    field("ownership_management", "Shareholding / Management", "Example: Petitioner holds 40% shares", { sourceIds: ["ownership_management"], width: "full" }),
  ]);
  if (/arbitration|arbitral/.test(text)) return specialistSchema("arbitration", "Arbitration Case Filing Details", "Applicant / Claimant", "Respondent", [
    field("arbitration_clause", "Arbitration Agreement / Clause", "Example: Clause 18 of agreement dated 1 January 2025", { sourceIds: ["arbitration_clause"], width: "full" }),
    field("award_details", "Award / Tribunal Details", "Example: Award dated 10 July 2026 by Sole Arbitrator", { sourceIds: ["award_details", "tribunal_status"], width: "full" }),
  ]);
  if (/execution|contempt|decree holder|judgment debtor/.test(text)) return specialistSchema("execution", "Execution and Enforcement Filing Details", "Decree Holder / Applicant", "Judgment Debtor / Respondent", [
    field("order_decree_details", "Decree / Order Details", "Example: Decree dated 5 June 2026 in Civil Suit No. 45/2025", { sourceIds: ["order_decree_details"], width: "full" }),
    field("compliance_status", "Non-Compliance", "Example: Judgment debtor has not paid the decretal amount", { sourceIds: ["compliance_status"], width: "full" }),
  ]);

  return civilSchema(false);
}

function normalize(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

export function findPriorCaseFormAnswer(
  fieldDefinition: CaseFormField,
  questions: Array<{ id: string; label: string }>,
  answers: Record<string, string>,
): string {
  const ids = new Set([fieldDefinition.id, ...(fieldDefinition.sourceIds || [])].map(normalize));
  for (const question of questions) {
    const answer = answers[question.id]?.trim();
    if (!answer) continue;
    const questionId = normalize(question.id);
    if (ids.has(questionId)) return answer;
  }

  const aliases = (fieldDefinition.aliases || []).map(normalize).filter(Boolean);
  if (!aliases.length) return "";
  for (const question of questions) {
    const answer = answers[question.id]?.trim();
    if (!answer) continue;
    const hint = normalize(`${question.id} ${question.label}`);
    if (aliases.some((alias) => hint.includes(alias))) return answer;
  }
  return "";
}
