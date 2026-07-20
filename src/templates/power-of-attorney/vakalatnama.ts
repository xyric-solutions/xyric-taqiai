import type { TemplateDefinition } from "../types";

type VakalatnamaValues = Record<string, string | undefined>;

const BLANK = "______________________________";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function readValue(values: VakalatnamaValues, ...keys: string[]): string {
  for (const key of keys) {
    const value = values[key]?.trim();
    if (value && !/^(?:n\/?a|null|undefined)$/i.test(value)) return escapeHtml(value);
  }
  return BLANK;
}

function splitCaseTitle(caseTitle: string): [string, string] {
  if (caseTitle === BLANK) return [BLANK, BLANK];
  const parts = caseTitle.split(/\s+(?:v(?:s\.?|ersus)?\.?|versus)\s+/i);
  if (parts.length < 2) return [caseTitle, BLANK];
  return [parts[0]?.trim() || BLANK, parts.slice(1).join(" versus ").trim() || BLANK];
}

function parseAdditionalAdvocates(value: string): Array<{ name: string; designation: string }> {
  if (!value || value === BLANK) return [];
  return value
    .split(/\r?\n|;/)
    .map((entry) => entry.trim())
    .filter(Boolean)
    .slice(0, 4)
    .map((entry) => {
      const [name, ...designationParts] = entry.split(/\s*(?:\||—|–)\s*/);
      return {
        name: escapeHtml(name?.trim() || BLANK),
        designation: escapeHtml(designationParts.join(" ").trim() || BLANK),
      };
    });
}

function advocateBlock(name: string, designation: string): string {
  return `<p><strong><em>${name}</em></strong><br/><em>${designation}</em></p>`;
}

export function buildVakalatnamaHtml(values: VakalatnamaValues): string {
  const courtName = readValue(values, "courtName", "court_name");
  const caseNumber = readValue(values, "caseNumber", "case_number", "case_title_number");
  const caseTitle = readValue(values, "caseTitle", "case_title");
  const oppositeParty = readValue(values, "oppositeParty", "opposite_party");
  const [caseTitleFirstParty, caseTitleSecondParty] = splitCaseTitle(caseTitle);
  const clientName = readValue(values, "clientName", "client_name");
  const clientFatherName = readValue(values, "clientFatherName", "client_father_name");
  const clientCnic = readValue(values, "clientCnic", "client_cnic");
  const clientAddress = readValue(values, "clientAddress", "client_address");
  const partyRole = readValue(values, "partyRole", "party_role");
  const firstPartyName = readValue(values, "firstPartyName", "first_party_name");
  const secondPartyName = readValue(values, "secondPartyName", "second_party_name");
  const advocateName = readValue(values, "advocateName", "advocate_name");
  const advocateDesignation = readValue(values, "advocateDesignation", "advocate_designation");
  const advocateBarId = readValue(values, "advocateBarId", "advocate_bar_id");
  const executionDate = readValue(values, "executionDate", "execution_date");
  const authorityScope = readValue(values, "authorityScope", "authority_scope");
  const providedFirstParty = firstPartyName !== BLANK
    ? firstPartyName
    : caseTitleFirstParty !== BLANK
      ? caseTitleFirstParty
      : /plaintiff|appellant|petitioner|complainant/i.test(partyRole)
        ? clientName
        : BLANK;
  const providedSecondParty = secondPartyName !== BLANK
    ? secondPartyName
    : oppositeParty !== BLANK
      ? oppositeParty
      : caseTitleSecondParty !== BLANK
        ? caseTitleSecondParty
        : /defendant|respondent|accused/i.test(partyRole)
          ? clientName
          : BLANK;
  const additionalAdvocates = parseAdditionalAdvocates(
    values.additionalAdvocates || values.additional_advocates || ""
  );
  const advocateBlocks = [
    { name: advocateName, designation: advocateDesignation },
    ...additionalAdvocates,
  ];
  while (advocateBlocks.length < 5) {
    advocateBlocks.push({ name: BLANK, designation: BLANK });
  }

  const optionalClientDetails = [
    clientName !== BLANK ? `<strong>${clientName}</strong>` : "",
    clientFatherName !== BLANK ? `S/o, D/o or W/o <strong>${clientFatherName}</strong>` : "",
    clientCnic !== BLANK ? `CNIC No. <strong>${clientCnic}</strong>` : "",
    clientAddress !== BLANK ? `resident of <strong>${clientAddress}</strong>` : "",
  ].filter(Boolean).join(", ");
  const appointingParty = optionalClientDetails || "I/We, the undersigned";
  const representedParty = partyRole === BLANK ? BLANK : partyRole;
  const specialAuthority = authorityScope === BLANK
    ? ""
    : `<p><strong>Special instructions or limitation:</strong> ${authorityScope}</p>`;
  const executionLine = executionDate === BLANK
    ? "this __________ day of __________, 20____"
    : `on <strong>${executionDate}</strong>`;
  const barLine = advocateBarId === BLANK ? "" : `<br/>Enrollment / License No. ${advocateBarId}`;

  return `<div data-document-format="vakalatnama">
<h2><strong><em>POWER OF ATTORNEY</em></strong></h2>
<p><br/></p>
<p><br/></p>
<table border="0">
  <tr>
    <td><p><strong><em>IN THE COURT OF ${courtName}</em></strong></p><p>${caseNumber}</p><hr/><p>${providedFirstParty}</p><hr/></td>
    <td><p><strong><em>PLAINTIFF<br/>APPELLANT<br/>PETITIONER<br/>COMPLAINANT</em></strong></p></td>
  </tr>
  <tr>
    <td><h2><strong><em>V E R S U S</em></strong></h2><p>${providedSecondParty}</p><hr/></td>
    <td><p><strong><em>DEFENDANT<br/>RESPONDENT<br/>ACCUSED</em></strong></p></td>
  </tr>
</table>
<p><em>KNOW ALL to whom these presents shall come that ${appointingParty} appoint:</em></p>
<h2><u><strong><em>${advocateName}</em></strong></u></h2>
<p><em>${advocateDesignation}</em>${barLine}</p>
<p>To be the Advocate for the <strong>${representedParty}</strong> in the above-mentioned case and to do all or any of the following lawful acts, deeds and things:</p>
<ol>
  <li>To act, appear and plead in the above-mentioned case in this Court or any other Court in which the same may be tried or heard in the first instance, appeal, review, revision, execution, or any connected proceeding until its final decision.</li>
  <li>To present pleadings, appeals, cross-objections, petitions for execution, review or revision, applications for withdrawal or compromise, affidavits, and other documents considered necessary or advisable for conduct of the case at all stages.</li>
  <li>To withdraw or compromise the case, or submit to arbitration any difference or dispute relating to the case, only where lawfully authorized by the client.</li>
  <li>To receive money, documents, certified copies, orders and other process; to grant receipts; and to do all lawful acts necessary for progress and conduct of the case.</li>
</ol>
<p>To employ and authorize another legal practitioner to exercise the powers conferred on the Advocate whenever the Advocate considers it necessary for proper conduct of the case.</p>
<p>AND I/We agree to ratify and confirm all lawful acts done by the Advocate or any lawful substitute in the premises.</p>
<p>AND I/We agree not to hold the Advocate or lawful substitute responsible for the result of the case due solely to absence from Court when the case is called for hearing.</p>
<p>AND I/We agree that, if any agreed professional fee remains unpaid, the Advocate shall be entitled to withdraw from representation after giving lawful notice and subject to permission of the Court where required.</p>
${specialAuthority}
<p>IN WITNESS WHEREOF I/We have signed these presents after understanding their contents on ${executionLine}.</p>
<table border="0">
  <tr><td></td><td><hr/><p><strong><em>Signature or thumb impression</em></strong></p>${clientName === BLANK ? "" : `<p>${clientName}</p>`}</td></tr>
</table>
<p><br/></p>
<table border="0">
  <tr><td>${advocateBlock(advocateBlocks[1].name, advocateBlocks[1].designation)}</td><td>${advocateBlock(advocateBlocks[0].name, advocateBlocks[0].designation)}</td></tr>
  <tr><td>${advocateBlock(advocateBlocks[2].name, advocateBlocks[2].designation)}</td><td>${advocateBlock(advocateBlocks[3].name, advocateBlocks[3].designation)}</td></tr>
  <tr><td colspan="2">${advocateBlock(advocateBlocks[4].name, advocateBlocks[4].designation)}</td></tr>
</table>
</div>`;
}

export const VAKALATNAMA_SAMPLE_REQUIREMENTS = `
- Render the document in the supplied sample's one-page POWER OF ATTORNEY / court Vakalatnama structure.
- Keep the court name, case number, both case-party lines, client role, advocate name, advocate designation, enrollment number, execution date, client signature, and additional advocate blocks blank unless the user supplies them.
- Never copy names, court details, case details, dates, or advocate details from the reference image.
- Use the fixed Plaintiff/Appellant/Petitioner/Complainant and Defendant/Respondent/Accused role lists beside the cause-title lines.
- Include the centered V E R S U S line, advocate appointment, four numbered powers, ratification and fee paragraphs, signature or thumb-impression line, and five advocate acceptance positions shown in the sample.
- Do not convert this court Vakalatnama into a General Power of Attorney.`;

export const vakalatnama: TemplateDefinition = {
  category: "power-of-attorney",
  subType: "vakalatnama",
  name: "Vakalatnama",
  nameUrdu: "Vakalatnama",
  description: "Sample-format court Vakalatnama appointing an advocate for Pakistani court proceedings",
  descriptionUrdu: "Sample-format court Vakalatnama",
  icon: "FileSignature",
  formFields: [
    {
      name: "courtName",
      label: "Court Name",
      labelUrdu: "Court Name",
      type: "text",
      required: false,
      aiSuggestable: true,
      placeholder: "e.g. Court of Civil Judge, Lahore",
      group: "Case",
    },
    {
      name: "caseNumber",
      label: "Case Number",
      labelUrdu: "Case Number",
      type: "text",
      required: false,
      aiSuggestable: true,
      placeholder: "e.g. Suit No. 123/2026",
      group: "Case",
    },
    {
      name: "caseTitle",
      label: "Case Title / Both Party Names",
      labelUrdu: "Case Title / Both Party Names",
      type: "text",
      required: false,
      aiSuggestable: true,
      placeholder: "e.g. Ali Khan versus Ahmed Raza",
      group: "Case",
    },
    {
      name: "oppositeParty",
      label: "Opposite Party Name (if not included in Case Title)",
      labelUrdu: "Opposite Party Name",
      type: "text",
      required: false,
      aiSuggestable: true,
      placeholder: "e.g. Ahmed Raza / The State",
      group: "Case",
    },
    {
      name: "clientName",
      label: "Client / Executant Name",
      labelUrdu: "Client / Executant Name",
      type: "text",
      required: false,
      aiSuggestable: true,
      placeholder: "e.g. Ali Khan",
      group: "Client",
    },
    {
      name: "partyRole",
      label: "Client Role in Case",
      labelUrdu: "Client Role in Case",
      type: "select",
      required: false,
      aiSuggestable: true,
      group: "Case",
      options: [
        { value: "Plaintiff", label: "Plaintiff" },
        { value: "Appellant", label: "Appellant" },
        { value: "Petitioner", label: "Petitioner" },
        { value: "Complainant", label: "Complainant" },
        { value: "Defendant", label: "Defendant" },
        { value: "Respondent", label: "Respondent" },
        { value: "Accused", label: "Accused" },
      ],
    },
    {
      name: "advocateName",
      label: "Lead Advocate Name",
      labelUrdu: "Lead Advocate Name",
      type: "text",
      required: false,
      aiSuggestable: true,
      placeholder: "e.g. Advocate Fatima Ali",
      group: "Advocate",
    },
    {
      name: "advocateDesignation",
      label: "Lead Advocate Designation",
      labelUrdu: "Lead Advocate Designation",
      type: "text",
      required: false,
      aiSuggestable: true,
      placeholder: "e.g. Advocate High Court",
      group: "Advocate",
    },
    {
      name: "advocateBarId",
      label: "Advocate Bar License / Enrollment No.",
      labelUrdu: "Advocate Bar License / Enrollment No.",
      type: "text",
      required: false,
      aiSuggestable: true,
      placeholder: "e.g. PBC-LHR-12345",
      group: "Advocate",
    },
    {
      name: "executionDate",
      label: "Execution / Signing Date",
      labelUrdu: "Execution / Signing Date",
      type: "date",
      required: false,
      aiSuggestable: true,
      group: "Execution",
    },
    {
      name: "additionalAdvocates",
      label: "Additional Advocates and Designations",
      labelUrdu: "Additional Advocates and Designations",
      type: "textarea",
      required: false,
      aiSuggestable: true,
      placeholder: "One per line, e.g. Ahmed Raza | Advocate High Court",
      group: "Advocate",
    },
    {
      name: "authorityScope",
      label: "Special Authority or Limitation (if any)",
      labelUrdu: "Special Authority or Limitation",
      type: "textarea",
      required: false,
      aiSuggestable: true,
      placeholder: "e.g. No compromise or withdrawal without written client consent",
      group: "Authority",
    },
  ],
  promptTemplate: `Generate the court Vakalatnama by using the deterministic sample renderer.

${VAKALATNAMA_SAMPLE_REQUIREMENTS}

Never invent or copy personal details. Missing values must remain blank lines. Output clean HTML only.`,
};
