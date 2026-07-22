export interface CaseBuilderQuestionLike {
  id: string;
  label: string;
}

export interface CaseBuilderFieldMemory {
  firNo?: string;
  firDate?: string;
  policeStation?: string;
  courtName?: string;
  districtName?: string;
  clientName?: string;
  clientFatherName?: string;
  clientCnic?: string;
  clientAddress?: string;
  opponentName?: string;
  opponentFatherName?: string;
  opponentCnic?: string;
  opponentAddress?: string;
  caseFacts?: string;
  documentNeeded?: string;
}

export interface RememberedQuestionAnswer {
  value: string;
  complete: boolean;
  matchedFields: Array<keyof CaseBuilderFieldMemory>;
  missingFields: Array<keyof CaseBuilderFieldMemory>;
}

const FIELD_LABEL_BOUNDARY = String.raw`(?=\s+(?:FIR|Case\s*(?:No\.?|Number)|Date|Police\s+Station|P\.?S\.?|Thana|Court|District|City|Client|Petitioner|Accused|Applicant|Appellant|Opponent|Respondent|Complainant|Defendant|Father(?:'s)?\s+Name|CNIC|Address|Facts?|Relief|Document)\b|[,;\n]|$)`;

function clean(value?: string): string {
  return (value || "").replace(/\s+/g, " ").trim();
}

function labeledValue(value: string, label: string): string {
  const match = value.match(new RegExp(`(?:${label})\s*[:#-]?\s*(.+?)${FIELD_LABEL_BOUNDARY}`, "i"));
  return clean(match?.[1]);
}

function questionFields(question: CaseBuilderQuestionLike): Array<keyof CaseBuilderFieldMemory> {
  const hint = `${question.id} ${question.label}`.toLowerCase().replace(/_/g, " ");
  const fields: Array<keyof CaseBuilderFieldMemory> = [];
  const add = (field: keyof CaseBuilderFieldMemory, matches: boolean) => {
    if (matches && !fields.includes(field)) fields.push(field);
  };

  add("firNo", /\bfir\b.*\b(?:no|number|details?)\b|\bcase\s*(?:no|number)\b|\bchallan\s*(?:no|number)\b/.test(hint));
  add("firDate", /\b(?:fir|occurrence|registration)\b.*\bdate\b|\bdate\b.*\bfir\b/.test(hint));
  add("policeStation", /\bpolice\s+station\b|\bthana\b|\bps\b/.test(hint));
  add("courtName", /\bcourt\s+name\b|\bname\s+of\s+(?:the\s+)?court\b|\bforum\b/.test(hint));
  add("districtName", /\bdistrict\b|\bcity\b|\bplace\s+of\s+filing\b/.test(hint));

  const clientSide = /\b(client|petitioner|accused|applicant|appellant)\b/.test(hint);
  const opponentSide = /\b(opponent|respondent|complainant|defendant)\b/.test(hint);
  add("clientFatherName", clientSide && /\bfather(?:'s)?\s+name\b|\bfather\b/.test(hint));
  add("clientCnic", clientSide && /\bcnic\b/.test(hint));
  add("clientAddress", clientSide && /\baddress\b|\bresiden/.test(hint));
  add("clientName", clientSide && /\bname\b/.test(hint) && !/\bfather\b/.test(hint));
  add("opponentFatherName", opponentSide && /\bfather(?:'s)?\s+name\b|\bfather\b/.test(hint));
  add("opponentCnic", opponentSide && /\bcnic\b/.test(hint));
  add("opponentAddress", opponentSide && /\baddress\b|\bresiden/.test(hint));
  add("opponentName", opponentSide && /\bname\b/.test(hint) && !/\bfather\b/.test(hint));

  add("caseFacts", /\b(case\s+facts?|background|circumstances?|incident\s+details?|what\s+happened|allegations?)\b/.test(hint));
  add("documentNeeded", /\b(document|relief|prayer)\b.*\b(?:needed|required|sought|want)\b|\bfinal\s+relief\b/.test(hint));
  return fields;
}

function explicitValues(value: string): CaseBuilderFieldMemory {
  return {
    firNo: labeledValue(value, String.raw`FIR\s*(?:No\.?|Number)?|Case\s*(?:No\.?|Number)`),
    firDate: labeledValue(value, String.raw`(?:FIR\s*)?Date`),
    policeStation: labeledValue(value, String.raw`Police\s+Station|P\.?S\.?|Thana`),
    courtName: labeledValue(value, String.raw`Court(?:\s+Name)?`),
    districtName: labeledValue(value, String.raw`District|City`),
  };
}

function directValueForField(
  field: keyof CaseBuilderFieldMemory,
  value: string,
  explicit: CaseBuilderFieldMemory,
): string {
  if (explicit[field]) return clean(explicit[field]);
  if (field === "clientCnic" || field === "opponentCnic") {
    return value.match(/\b\d{5}-?\d{7}-?\d\b/)?.[0] || clean(value);
  }
  return clean(value);
}

export function collectCaseBuilderFieldMemory(
  questions: CaseBuilderQuestionLike[],
  answers: Record<string, string>,
  seed: CaseBuilderFieldMemory = {},
): CaseBuilderFieldMemory {
  const memory: CaseBuilderFieldMemory = { ...seed };
  const remember = (field: keyof CaseBuilderFieldMemory, value?: string) => {
    const normalized = clean(value);
    if (normalized && !clean(memory[field])) memory[field] = normalized;
  };

  for (const question of questions) {
    const value = clean(answers[question.id]);
    if (!value) continue;
    const fields = questionFields(question);
    const explicit = explicitValues(value);

    for (const [field, explicitValue] of Object.entries(explicit) as Array<[keyof CaseBuilderFieldMemory, string | undefined]>) {
      remember(field, explicitValue);
    }
    if (fields.length === 1) {
      remember(fields[0], directValueForField(fields[0], value, explicit));
    } else {
      for (const field of fields) remember(field, explicit[field]);
    }
  }
  return memory;
}

function formattedField(field: keyof CaseBuilderFieldMemory, value: string): string {
  const labels: Record<keyof CaseBuilderFieldMemory, string> = {
    firNo: "FIR / Case No.",
    firDate: "FIR Date",
    policeStation: "Police Station",
    courtName: "Court Name",
    districtName: "District / City",
    clientName: "Client Name",
    clientFatherName: "Client Father's Name",
    clientCnic: "Client CNIC",
    clientAddress: "Client Address",
    opponentName: "Opponent Name",
    opponentFatherName: "Opponent Father's Name",
    opponentCnic: "Opponent CNIC",
    opponentAddress: "Opponent Address",
    caseFacts: "Case Facts",
    documentNeeded: "Relief / Document Needed",
  };
  return `${labels[field]}: ${value}`;
}

export function rememberedAnswerForQuestion(
  question: CaseBuilderQuestionLike,
  memory: CaseBuilderFieldMemory,
): RememberedQuestionAnswer {
  const matchedFields = questionFields(question);
  const filled = matchedFields.filter((field) => clean(memory[field]));
  const missingFields = matchedFields.filter((field) => !clean(memory[field]));
  return {
    value: filled.map((field) => formattedField(field, clean(memory[field]))).join("; "),
    complete: matchedFields.length > 0 && missingFields.length === 0,
    matchedFields,
    missingFields,
  };
}
