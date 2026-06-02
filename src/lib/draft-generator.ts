// ============================================
// INSTANT DRAFT GENERATOR (No AI needed)
// ============================================

function getOrdinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function getLegalDate(date: Date = new Date()): string {
  const day = date.getDate();
  const month = date.toLocaleDateString("en-PK", { month: "long" });
  const year = date.getFullYear();
  return `${getOrdinal(day)} day of ${month}, ${year}`;
}

const today = getLegalDate();

// Main function - generates draft based on document type
export function generateDraft(
  input: string,
  caseType: string,
  documentType: string
): string {
  switch (documentType) {
    case "petition":
      return generatePetition(input, caseType);
    case "application":
      return generateApplication(input, caseType);
    case "bail-application":
      return generateBailApplication(input);
    case "written-statement":
      return generateWrittenStatement(input);
    case "legal-notice":
      return generateLegalNotice(input);
    case "appeal":
      return generateAppeal(input, caseType);
    case "writ-petition":
      return generateWritPetition(input);
    case "complaint":
      return generateComplaint(input);
    case "rejoinder":
      return generateRejoinder(input);
    case "revision":
      return generateRevision(input, caseType);
    default:
      return generateGenericDraft(input, caseType);
  }
}

// ============================================
// DOCUMENT TYPE TEMPLATES
// ============================================

function generatePetition(input: string, caseType: string): string {
  const court = getCourt(caseType);
  const lawRef = getLawReference(caseType);

  return `IN THE ${court}

${caseType.toUpperCase()} SUIT NO. _______ OF ${new Date().getFullYear()}

IN THE MATTER OF:

_________________ son/daughter of _________________
CNIC No. _________________
Resident of _________________
.......................................................................PETITIONER/PLAINTIFF

VERSUS

_________________ son/daughter of _________________
CNIC No. _________________
Resident of _________________
.......................................................................RESPONDENT/DEFENDANT

PETITION UNDER ${lawRef}

MOST RESPECTFULLY SHEWETH:

1. That the petitioner is a law abiding citizen and resident of the area within the territorial jurisdiction of this Honourable Court.

2. That the respondent is also resident of the area mentioned above and is liable to be sued within the jurisdiction of this Honourable Court.

3. That the brief facts of the case are as under:

${formatInput(input)}

4. That the petitioner has a genuine cause of action against the respondent which arose on _________ at _________.

5. That the petitioner has not filed any other petition/suit on the same cause of action before any other Court of competent jurisdiction.

6. That the suit/petition is within time as per the Limitation Act 1908.

7. That the petitioner is ready and willing to pay the requisite court fee.

PRAYER:

In the light of above stated facts and circumstances, it is most humbly prayed that this Honourable Court may graciously be pleased to:

(a) Accept this petition/suit;
(b) _________ [specific relief sought];
(c) Grant costs of this petition/suit to the petitioner;
(d) Grant any other relief which this Honourable Court may deem fit and proper.

The petitioner shall ever pray.

Dated: ${today}
Place: _________________


___________________________          ___________________________
ADVOCATE FOR PETITIONER              PETITIONER
License No. _____________


VERIFICATION:

I, _________________ the above named petitioner, do hereby solemnly affirm and declare that the contents of paragraphs 1 to 7 of the above petition are true and correct to the best of my knowledge and belief and nothing has been concealed therein.

DEPONENT


Verified on oath at _________ on this _____ day of _________, ${new Date().getFullYear()}.

OATH COMMISSIONER`;
}

function generateApplication(input: string, caseType: string): string {
  const court = getCourt(caseType);

  return `IN THE ${court}

${caseType.toUpperCase()} SUIT/CASE NO. _______ OF ${new Date().getFullYear()}

_________________ ........................................ PETITIONER/APPLICANT
VERSUS
_________________ ........................................ RESPONDENT/OPPOSITE PARTY

APPLICATION UNDER _______________

MOST RESPECTFULLY SHEWETH:

1. That the above titled case is pending adjudication before this Honourable Court.

2. That the applicant most humbly submits as under:

${formatInput(input)}

3. That the present application is being filed in the interest of justice and for the ends of justice.

4. That no prejudice will be caused to the opposite party if the instant application is allowed.

5. That the application is supported by an affidavit.

PRAYER:

It is, therefore, most respectfully prayed that this Honourable Court may graciously be pleased to:

(a) Allow the instant application;
(b) _________ [specific relief];
(c) Any other relief deemed fit and proper.

Dated: ${today}
Place: _________________


___________________________          ___________________________
ADVOCATE FOR APPLICANT                APPLICANT`;
}

function generateBailApplication(input: string): string {
  return `IN THE COURT OF SESSIONS JUDGE / ADDITIONAL SESSIONS JUDGE
_________________

BAIL APPLICATION NO. _______ OF ${new Date().getFullYear()}

IN THE MATTER OF:

FIR No. _________ dated _________
Under Sections _________ PPC
Police Station _________________

STATE
.......................................................................COMPLAINANT

VERSUS

_________________ son of _________________
CNIC No. _________________
Presently confined in _________________
.......................................................................ACCUSED/PETITIONER

APPLICATION FOR GRANT OF POST-ARREST BAIL
UNDER SECTION 497 Cr.P.C.

MOST RESPECTFULLY SHEWETH:

1. That the petitioner/accused has been arrested in the above mentioned FIR and is presently confined in _________________ Jail.

2. That the brief facts are as under:

${formatInput(input)}

3. That the petitioner is innocent and has been falsely implicated in this case due to enmity/malafide intentions of the complainant.

4. That the investigation has been completed and the challan has been submitted, therefore the petitioner is no longer required for investigation.

5. That the petitioner has no previous criminal record and is a respectable citizen.

6. That the petitioner is not a flight risk and shall appear before the Court as and when required.

7. That the offence alleged does not fall within the prohibitory clause of Section 497 Cr.P.C.

8. That the continued detention of the petitioner will cause irreparable loss and hardship to the petitioner and his family.

9. That the petitioner is ready to furnish solvent surety to the satisfaction of this Honourable Court.

PRAYER:

In the light of above stated facts and circumstances, it is most humbly prayed that this Honourable Court may graciously be pleased to:

(a) Accept this bail application;
(b) Grant post-arrest bail to the petitioner in the above mentioned FIR;
(c) Release the petitioner on bail subject to furnishing surety bonds;
(d) Any other relief deemed fit and proper.

Dated: ${today}


___________________________          ___________________________
ADVOCATE FOR ACCUSED                 ACCUSED/PETITIONER
License No. _____________`;
}

function generateLegalNotice(input: string): string {
  return `LEGAL NOTICE
UNDER SECTION 80 CPC / GENERAL LAW

Date: ${today}

FROM:
_________________ (Name)
Son/Daughter of _________________
CNIC No. _________________
Address: _________________
Through Advocate: _________________ (License No. _______)

TO:
_________________ (Name)
Son/Daughter of _________________
Address: _________________

SUBJECT: LEGAL NOTICE FOR _________________

Dear Sir/Madam,

Under instructions and on behalf of my client, the above named, I do hereby serve upon you the following Legal Notice:

1. That my client states as follows:

${formatInput(input)}

2. That my client has been severely aggrieved by your above mentioned acts/omissions.

3. That despite repeated requests, you have failed to _________.

4. That my client hereby demands that you:

   (a) _________ [specific demand 1];
   (b) _________ [specific demand 2];
   (c) _________ [specific demand 3];

5. That you are hereby given a period of FIFTEEN (15) DAYS from the receipt of this notice to comply with the above demands, failing which my client shall be constrained to initiate appropriate legal proceedings against you before the competent Court of law, at your sole risk, cost, and consequences.

6. That my client reserves all his/her legal rights and remedies available under the law.

7. That costs of this notice shall also be borne by you.

Please take this notice seriously and act accordingly.


___________________________
ADVOCATE
(Name: _________________ )
License No. _____________
Contact: _________________

CC:
1. Copy for office record
2. Copy sent via registered post / courier`;
}

function generateWrittenStatement(input: string): string {
  return `IN THE COURT OF _________________

SUIT NO. _______ OF ${new Date().getFullYear()}

_________________ ........................................ PLAINTIFF
VERSUS
_________________ ........................................ DEFENDANT

WRITTEN STATEMENT ON BEHALF OF DEFENDANT

MOST RESPECTFULLY SHEWETH:

PRELIMINARY OBJECTIONS:

(i) That the suit filed by the plaintiff is not maintainable in its present form.
(ii) That this Honourable Court has no jurisdiction to try the instant suit.
(iii) That the suit is barred by limitation.
(iv) That the suit is based on false and fabricated facts.

PARA-WISE REPLY:

1. Para No. 1 of the plaint is DENIED. The defendant states that:

${formatInput(input)}

2. Para No. 2 of the plaint is DENIED for the reasons stated above.

3. Para No. 3 of the plaint is INCORRECT and DENIED.

4. That the plaintiff has no cause of action against the defendant.

5. That the plaintiff has come to this Court with unclean hands.

PRAYER:

It is, therefore, most respectfully prayed that the suit filed by the plaintiff may graciously be dismissed with costs in favour of the defendant.

Dated: ${today}


___________________________          ___________________________
ADVOCATE FOR DEFENDANT                DEFENDANT`;
}

function generateAppeal(input: string, caseType: string): string {
  const court = caseType === "criminal"
    ? "HIGH COURT OF _________________ AT _________________"
    : "COURT OF DISTRICT JUDGE / ADDITIONAL DISTRICT JUDGE _________________";

  return `IN THE ${court}

${caseType.toUpperCase()} APPEAL NO. _______ OF ${new Date().getFullYear()}

(Against the Judgment/Decree/Order dated _________ passed by the ${getCourt(caseType)} in Case No. _______)

_________________ ........................................ APPELLANT
VERSUS
_________________ ........................................ RESPONDENT

MEMORANDUM OF APPEAL

MOST RESPECTFULLY SHEWETH:

1. That the learned trial Court passed the impugned judgment/decree/order dated _________ in Case No. _______ whereby _________.

2. That the appellant is aggrieved by the said judgment/order because:

${formatInput(input)}

3. That the learned trial Court erred in law and fact.

4. That the impugned judgment is against the settled principles of law.

GROUNDS OF APPEAL:

(i) That the learned trial Court failed to appreciate the evidence on record.
(ii) That the findings of the learned trial Court are perverse and against the weight of evidence.
(iii) That the learned trial Court misread and non-read material evidence.
(iv) _________________

PRAYER:

It is most humbly prayed that this Honourable Court may be pleased to:

(a) Accept this appeal;
(b) Set aside the impugned judgment/decree/order;
(c) Grant costs of this appeal;
(d) Any other relief deemed fit.

Dated: ${today}


___________________________
ADVOCATE FOR APPELLANT`;
}

function generateWritPetition(input: string): string {
  return `IN THE HIGH COURT OF _________________ AT _________________

CONSTITUTIONAL PETITION / WRIT PETITION NO. _______ OF ${new Date().getFullYear()}

UNDER ARTICLE 199 OF THE CONSTITUTION OF PAKISTAN, 1973

_________________ ........................................ PETITIONER
VERSUS
_________________ ........................................ RESPONDENT(S)

PETITION UNDER ARTICLE 199 OF THE CONSTITUTION

MOST RESPECTFULLY SHEWETH:

1. That this petition is being filed under Article 199 of the Constitution of Islamic Republic of Pakistan, 1973, for enforcement of fundamental rights guaranteed under Articles 8 to 28 of the Constitution.

2. That the brief facts are:

${formatInput(input)}

3. That the act/omission of the respondent(s) is violative of the fundamental rights of the petitioner guaranteed under Article _____ of the Constitution.

4. That no other adequate remedy is available to the petitioner.

5. That no similar petition has been filed before any other High Court.

PRAYER:

(a) A writ of mandamus/certiorari/prohibition be issued;
(b) The impugned action/order be declared unlawful and unconstitutional;
(c) Any other relief deemed fit.

Dated: ${today}


___________________________
ADVOCATE FOR PETITIONER`;
}

function generateComplaint(input: string): string {
  return `IN THE COURT OF MAGISTRATE / JUDICIAL MAGISTRATE _________________

CRIMINAL COMPLAINT NO. _______ OF ${new Date().getFullYear()}

UNDER SECTION 200 Cr.P.C.

_________________ ........................................ COMPLAINANT
VERSUS
_________________ ........................................ ACCUSED

COMPLAINT UNDER SECTION 200 Cr.P.C.

MOST RESPECTFULLY SHEWETH:

1. That the complainant is a law abiding citizen.

2. That the accused person(s) have committed the following offence(s):

${formatInput(input)}

3. That the above offence(s) are punishable under Section(s) _________ of the Pakistan Penal Code 1860.

4. That the complainant approached the police station _________ but no action was taken.

5. That the complainant is constrained to file this complaint before this Honourable Court.

PRAYER:

(a) Summon the accused and frame charges;
(b) After trial, convict and sentence the accused;
(c) Any other relief deemed fit.

Dated: ${today}


___________________________          ___________________________
ADVOCATE FOR COMPLAINANT              COMPLAINANT`;
}

function generateRejoinder(input: string): string {
  return `IN THE COURT OF _________________

SUIT NO. _______ OF ${new Date().getFullYear()}

_________________ ........................................ PLAINTIFF
VERSUS
_________________ ........................................ DEFENDANT

REJOINDER / REPLICATION ON BEHALF OF PLAINTIFF

MOST RESPECTFULLY SHEWETH:

1. That the written statement filed by the defendant is false, frivolous, and devoid of any merit.

2. That the preliminary objections raised are without any legal basis and are hereby denied.

3. That in reply to the written statement:

${formatInput(input)}

4. That the defendant has failed to disclose any valid defense.

5. That the plaintiff reiterates and reaffirms all the averments made in the plaint.

PRAYER:

The plaintiff reiterates the prayer made in the plaint and prays for decree as prayed for.

Dated: ${today}


___________________________
ADVOCATE FOR PLAINTIFF`;
}

function generateRevision(input: string, caseType: string): string {
  return `IN THE HIGH COURT OF _________________ AT _________________
(${caseType === "criminal" ? "CRIMINAL" : "CIVIL"} REVISIONAL JURISDICTION)

${caseType.toUpperCase()} REVISION NO. _______ OF ${new Date().getFullYear()}

_________________ ........................................ PETITIONER
VERSUS
_________________ ........................................ RESPONDENT

PETITION FOR REVISION UNDER SECTION ${caseType === "criminal" ? "435/439" : "115"} ${caseType === "criminal" ? "Cr.P.C." : "C.P.C."}

MOST RESPECTFULLY SHEWETH:

1. That the learned lower Court passed order dated _________ which is illegal, without jurisdiction, and has resulted in failure of justice.

2. That the facts are:

${formatInput(input)}

3. That this Honourable Court has revisional jurisdiction to correct the illegality.

PRAYER:

(a) Set aside the impugned order;
(b) Grant relief as prayed;
(c) Any other relief deemed fit.

Dated: ${today}


___________________________
ADVOCATE FOR PETITIONER`;
}

function generateGenericDraft(input: string, caseType: string): string {
  return `IN THE ${getCourt(caseType)}

${caseType.toUpperCase()} CASE NO. _______ OF ${new Date().getFullYear()}

_________________ ........................................ APPLICANT
VERSUS
_________________ ........................................ RESPONDENT

APPLICATION

MOST RESPECTFULLY SHEWETH:

1. That the applicant most respectfully submits as under:

${formatInput(input)}

2. That the present application is filed in the interest of justice.

PRAYER:

It is most respectfully prayed that this Honourable Court may kindly:

(a) Allow the instant application;
(b) Grant the necessary relief;
(c) Any other relief deemed fit and proper.

Dated: ${today}


___________________________          ___________________________
ADVOCATE                              APPLICANT`;
}

// ============================================
// HELPERS
// ============================================

function getCourt(caseType: string): string {
  switch (caseType) {
    case "criminal":
      return "COURT OF SESSIONS JUDGE / ADDITIONAL SESSIONS JUDGE _________________";
    case "family":
      return "COURT OF JUDGE FAMILY COURT _________________";
    case "civil":
      return "COURT OF CIVIL JUDGE / SENIOR CIVIL JUDGE _________________";
    case "property":
      return "COURT OF CIVIL JUDGE / SENIOR CIVIL JUDGE _________________";
    default:
      return "COURT OF _________________ AT _________________";
  }
}

function getLawReference(caseType: string): string {
  switch (caseType) {
    case "criminal":
      return "SECTION _______ PPC READ WITH SECTION _______ Cr.P.C.";
    case "family":
      return "SECTION _______ OF THE FAMILY COURTS ACT 1964";
    case "civil":
      return "ORDER _______ RULE _______ CPC READ WITH SECTION _______ OF THE SPECIFIC RELIEF ACT 1877";
    case "property":
      return "SECTION _______ OF THE TRANSFER OF PROPERTY ACT 1882 / SPECIFIC RELIEF ACT 1877";
    default:
      return "SECTION _______ OF _________________";
  }
}

function formatInput(input: string): string {
  const lines = input.split("\n").filter((l) => l.trim());
  if (lines.length <= 1) {
    return `   "${input.trim()}"`;
  }
  return lines.map((line, i) => `   ${String.fromCharCode(97 + i)}) ${line.trim()}`).join("\n");
}
