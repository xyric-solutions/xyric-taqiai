import type { GroundingSource } from "@/lib/judgment-retrieval";

export interface VerifiedAuthorityGrounding {
  sources: GroundingSource[];
  block: string;
  exclusive: boolean;
}

const EMPTY_GROUNDING: VerifiedAuthorityGrounding = {
  sources: [],
  block: "",
  exclusive: false,
};

const SECTION_295_C = /\b295\s*[-/]?\s*C\b/i;

export function verifiedAuthorityGrounding(question: string): VerifiedAuthorityGrounding {
  if (!SECTION_295_C.test(question)) return EMPTY_GROUNDING;

  const sources: GroundingSource[] = [
    {
      id: "scp-asia-bibi-crla-39-l-2015",
      citation: "Crl.A. No. 39-L/2015",
      court: "Supreme Court of Pakistan",
      year: 2018,
      title: "Mst. Asia Bibi v. The State",
      reported: true,
      externalUrl: "https://www.supremecourt.gov.pk/downloads_judgements/Crl.A._39_L_2015.pdf",
    },
    {
      id: "scp-tahir-naqash-crlp-916-l-2021",
      citation: "Crl.P. No. 916-L/2021",
      court: "Supreme Court of Pakistan",
      year: 2022,
      title: "Tahir Naqash and others v. The State and others",
      reported: true,
      externalUrl: "https://www.supremecourt.gov.pk/downloads_judgements/crl.p._916_l_2021.pdf",
    },
    {
      id: "scp-salamat-mansha-crlp-883-l-2022",
      citation: "Crl.P. No. 883-L/2022",
      court: "Supreme Court of Pakistan",
      year: 2022,
      title: "Salamat Mansha Masih v. The State and another",
      reported: true,
      externalUrl: "https://www.supremecourt.gov.pk/downloads_judgements/crl.p._883_l_2022.pdf",
    },
    {
      id: "fsc-shariat-petition-6-l-1987",
      citation: "PLD 1991 FSC 10",
      court: "Federal Shariat Court",
      year: 1991,
      title: "Shariat Petition No. 6/L of 1987",
      reported: true,
      externalUrl: "https://pakistancode.gov.pk/pdffiles/administratord5622ea3f15bfa00b17d2cf7770a8434.pdf",
    },
  ];

  const block = `
VERIFIED OFFICIAL AUTHORITIES FOR SECTION 295-C PPC:
[O1] Mst. Asia Bibi v. The State, Crl.A. No. 39-L/2015, Supreme Court of Pakistan, decided 31 October 2018.
Relevant holding: the prosecution must prove guilt beyond reasonable doubt; presumption of innocence continues through trial; material contradictions, delayed reporting, and doubt in the prosecution story require benefit of doubt. Suspicion, however strong, is not proof.

[O2] Tahir Naqash and others v. The State and others, Crl.P. No. 916-L/2021, Supreme Court of Pakistan, decided 12 January 2022.
Relevant holding: severe penal provisions must be strictly construed. The alleged act must fall within the plain words and required ingredients of section 295-C; the Court identified the need for an overt act that defiles the sacred name in the circumstances before it.

[O3] Salamat Mansha Masih v. The State and another, Crl.P. No. 883-L/2022, Supreme Court of Pakistan, order dated 23 August 2022.
Relevant holding: offences under sections 295-A, 295-B and 295-C have separate ingredients; a charge must state the essential facts for each offence. The Court also enforced section 156-A CrPC safeguards and treated serious evidentiary deficiencies as grounds for further inquiry and bail.

[O4] Shariat Petition No. 6/L of 1987, PLD 1991 FSC 10, Federal Shariat Court.
Relevant effect recorded in the current official Pakistan Penal Code: the words "or imprisonment for life" in section 295-C ceased to have effect; the statutory text records death and liability to fine.

AUTHORITY RULES (mandatory):
- Cite these authorities by case title and citation/case number only for the propositions stated above.
- Do not attribute any additional holding, quotation, fact, or procedural rule to them from memory.
- State the current punishment only as death and fine. Do not state an exact cessation date or cite PLD 1992 SC 153 for the removed life-imprisonment wording because official compilations contain inconsistent footnote details.
- Treat section 156-A CrPC as an investigation safeguard; do not say that a breach automatically nullifies the FIR, trial, or proceedings unless a verified authority expressly establishes that result.
- Explain that every criminal case turns on its own facts and evidence; do not predict guilt or acquittal.
- These official authorities replace local archive judgment retrieval for this query because a local 295-C record has unreliable citation metadata.`;

  return { sources, block, exclusive: true };
}
