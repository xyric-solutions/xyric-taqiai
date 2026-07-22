export interface ProvisionAlternative {
  label: string;
  sections: string;
  interpretation: string;
}

export interface CaseNameProvisionResolution {
  title: string;
  sections: string;
  interpretation: string;
  matterSummary: string;
  alternatives: ProvisionAlternative[];
  source: "rule" | "profile";
}

interface CaseNameRule {
  pattern: RegExp;
  resolution: Omit<CaseNameProvisionResolution, "source">;
}

const CASE_NAME_RULES: CaseNameRule[] = [
  {
    pattern: /^(?=[\s\S]*\b(?:sister|daughter|woman|female|widow)\b)(?=[\s\S]*\b(?:brother|sibling|father|uncle|relative|co[-\s]?owner)\b)(?=[\s\S]*\b(?:property|land|house|plot|share|inherit(?:ance|ed)?)\b)(?=[\s\S]*\b(?:sell|sold|sale|transfer(?:red)?|alienat(?:e|ed|ion)|depriv(?:e|ed|ation)|den(?:y|ied)|without\s+(?:her\s+)?(?:permission|consent|authority))\b)[\s\S]*$/i,
    resolution: {
      title: "Unauthorized transfer of a woman's property share",
      sections: "Sections 7 and 44 of the Transfer of Property Act, 1882; Sections 39, 42 and 54 of the Specific Relief Act, 1877",
      interpretation: "If the sister owns or inherited a share, the brother cannot transfer more than his own lawful interest; Sections 7 and 44 of the Transfer of Property Act, 1882 and Sections 39, 42 and 54 of the Specific Relief Act, 1877 may support cancellation, declaration, and injunction relief. Is this the case you want to proceed with?",
      matterSummary: "Unauthorized sale or transfer of a sister's owned or inherited property share.",
      alternatives: [
        {
          label: "Deprivation of a woman's inheritance",
          sections: "Section 498-A PPC",
          interpretation: "Section 498-A PPC may additionally apply if deceitful or illegal means deprived the sister of property when succession opened.",
        },
        {
          label: "Fraudulent or forged transfer documents",
          sections: "Sections 420, 467, 468 and 471 PPC",
          interpretation: "These criminal provisions require facts showing cheating or the making or use of forged transfer documents; an unauthorized sale alone does not automatically establish them.",
        },
      ],
    },
  },
  {
    pattern: /\b(?:property|land|house|plot|share)\b.*\b(?:sell|sold|sale|transfer(?:red)?|alienat(?:e|ed|ion))\b.*\b(?:without|no)\b.*\b(?:permission|consent|authority)|\b(?:sell|sold|sale|transfer(?:red)?|alienat(?:e|ed|ion))\b.*\b(?:property|land|house|plot|share)\b.*\b(?:without|no)\b.*\b(?:permission|consent|authority)/i,
    resolution: {
      title: "Unauthorized property transfer",
      sections: "Sections 7 and 44 of the Transfer of Property Act, 1882; Sections 39, 42 and 54 of the Specific Relief Act, 1877",
      interpretation: "An unauthorized transfer of owned or co-owned property is ordinarily assessed under Sections 7 and 44 of the Transfer of Property Act, 1882, with cancellation, declaration, and injunction relief under Sections 39, 42 and 54 of the Specific Relief Act, 1877. Is this the case you want to proceed with?",
      matterSummary: "Unauthorized transfer of owned or co-owned immovable property.",
      alternatives: [
        {
          label: "Fraudulent or forged transfer documents",
          sections: "Sections 420, 467, 468 and 471 PPC",
          interpretation: "Select this only where the facts show deception, forgery, or use of a forged document rather than a purely civil title dispute.",
        },
      ],
    },
  },
  {
    pattern: /\b(?:child|minor|underage)\b.*\brape\b|\brape\b.*\b(?:child|minor|underage)\b/i,
    resolution: {
      title: "Rape of a minor",
      sections: "Section 376(3) PPC",
      interpretation: "A child rape allegation is ordinarily examined under Section 376(3) PPC, which specifically addresses rape of a minor. Is this the case you want to proceed with?",
      matterSummary: "Rape of a minor under Section 376(3) PPC.",
      alternatives: [],
    },
  },
  {
    pattern: /\b(?:attempt(?:ed)?\s+murder|attempt\s+to\s+commit\s+qatl|qatl\s+attempt)\b/i,
    resolution: {
      title: "Attempt to commit qatl-i-amd",
      sections: "Section 324 PPC",
      interpretation: "An attempted murder allegation is ordinarily examined under Section 324 PPC. Is this the case you want to proceed with?",
      matterSummary: "Attempt to commit qatl-i-amd under Section 324 PPC.",
      alternatives: [],
    },
  },
  {
    pattern: /\b(?:murder|qatl(?:-i-amd)?|intentional killing)\b/i,
    resolution: {
      title: "Qatl-i-amd / murder",
      sections: "Section 302 PPC",
      interpretation: "A murder or qatl-i-amd case is ordinarily prosecuted under Section 302 PPC, read with the applicable definitions and facts. Is this the case you want to proceed with?",
      matterSummary: "Qatl-i-amd / murder under Section 302 PPC.",
      alternatives: [],
    },
  },
  {
    pattern: /\b(?:online|digital|social\s+media|whatsapp|facebook|instagram|cyber)\b.*\b(?:harass|stalk|blackmail)/i,
    resolution: {
      title: "Cyber harassment / stalking",
      sections: "Section 24 PECA, 2016",
      interpretation: "Online harassment or repeated digital stalking is ordinarily examined under Section 24 of the Prevention of Electronic Crimes Act, 2016. Is this the case you want to proceed with?",
      matterSummary: "Cyber harassment / stalking under Section 24 PECA, 2016.",
      alternatives: [],
    },
  },
  {
    pattern: /\b(?:workplace|office|employer|employee)\b.*\bharass|\bharass.*\b(?:workplace|office|employer|employee)\b/i,
    resolution: {
      title: "Workplace harassment",
      sections: "Sections 2, 3, 4 and 8, Protection Against Harassment of Women at the Workplace Act, 2010",
      interpretation: "Workplace harassment is ordinarily handled under the Protection Against Harassment of Women at the Workplace Act, 2010, including its definition, inquiry, and complaint provisions. Is this the case you want to proceed with?",
      matterSummary: "Workplace harassment under the Protection Against Harassment of Women at the Workplace Act, 2010.",
      alternatives: [
        {
          label: "Criminal sexual harassment",
          sections: "Section 509 PPC",
          interpretation: "Sexual harassment or insulting a woman's modesty may constitute an offence under Section 509 PPC.",
        },
      ],
    },
  },
  {
    pattern: /\b(?:woman|women|female|sexual)\b.*\bharass|\bharass.*\b(?:woman|women|female|sexual)\b/i,
    resolution: {
      title: "Sexual harassment / insulting modesty",
      sections: "Section 509 PPC",
      interpretation: "Sexual harassment or conduct intended to insult a woman's modesty is ordinarily examined under Section 509 PPC. Select a more specific option if it occurred at work or online. Is this the case you want to proceed with?",
      matterSummary: "Sexual harassment / insulting modesty under Section 509 PPC.",
      alternatives: [
        {
          label: "Workplace harassment",
          sections: "Sections 2, 3, 4 and 8, Protection Against Harassment of Women at the Workplace Act, 2010",
          interpretation: "Harassment connected with employment or the workplace should be assessed under the workplace harassment statute and its complaint procedure.",
        },
        {
          label: "Online harassment",
          sections: "Section 24 PECA, 2016",
          interpretation: "Online harassment, repeated unwanted contact, monitoring, or non-consensual image distribution may fall under Section 24 PECA, 2016.",
        },
      ],
    },
  },
  {
    pattern: /\b(?:rape|zina-bil-jabr)\b/i,
    resolution: {
      title: "Rape allegation",
      sections: "Section 376 PPC",
      interpretation: "A rape allegation is ordinarily examined under Section 376 PPC. The applicable subsection depends on the victim and accused circumstances. Is this the case you want to proceed with?",
      matterSummary: "Rape allegation under Section 376 PPC.",
      alternatives: [
        {
          label: "Victim is a minor or disabled person",
          sections: "Section 376(3) PPC",
          interpretation: "Section 376(3) PPC specifically addresses rape of a minor or a person with mental or physical disability.",
        },
        {
          label: "Accused is a public servant",
          sections: "Section 376(4) PPC",
          interpretation: "Section 376(4) PPC addresses rape committed by a public servant taking advantage of official position.",
        },
      ],
    },
  },
  {
    pattern: /\b(?:car|vehicle|motorcycle|bike)\b.*\b(?:theft|stolen)|\b(?:theft|stolen)\b.*\b(?:car|vehicle|motorcycle|bike)\b/i,
    resolution: {
      title: "Vehicle theft",
      sections: "Section 379 PPC",
      interpretation: "A vehicle theft allegation is ordinarily examined under Section 379 PPC, subject to the precise facts and any connected offences. Is this the case you want to proceed with?",
      matterSummary: "Vehicle theft under Section 379 PPC.",
      alternatives: [],
    },
  },
];

function normalizeCommonCaseNameTypos(input: string): string {
  return input
    .replace(/\b(?:muder|mudder|murdr|murdar|mourder|mouder)\b/gi, "murder")
    .replace(/\b(?:harrasment|harasment|harrassment|harresment)\b/gi, "harassment")
    .replace(/\b(?:theaft|teft)\b/gi, "theft")
    .replace(/\s+/g, " ")
    .trim();
}

export function isPlainLanguageCaseName(input: string): boolean {
  const text = input.trim();
  if (!text) return false;
  if (/\b(?:section|sections|article|articles|order|rule|ppc|crpc|cpc|qso|peca)\b/i.test(text)) return false;
  if (/\b\d{1,4}(?:\s*[-/]\s*[A-Za-z]{1,3})?(?:\s*\([0-9A-Za-z]+\))*/.test(text)) return false;
  return true;
}

export function resolveKnownCaseName(input: string): CaseNameProvisionResolution | null {
  if (!isPlainLanguageCaseName(input)) return null;
  const normalizedInput = normalizeCommonCaseNameTypos(input);
  const match = CASE_NAME_RULES.find((rule) => rule.pattern.test(normalizedInput));
  return match ? { ...match.resolution, source: "rule" } : null;
}

export function resolveProfileCaseName(
  input: string,
  profile: { id: string; title: string; matterType: string; sectionRefs: string[] } | null
): CaseNameProvisionResolution | null {
  if (!profile || !isPlainLanguageCaseName(input) || profile.id.endsWith("-general")) return null;
  const concreteReferences = profile.sectionRefs.filter((reference) =>
    /\b(?:section|sections|article|order|rule)\b/i.test(reference) &&
    !/\b(?:applicable|where applicable|relevant)\b/i.test(reference)
  );
  if (!concreteReferences.length) return null;
  const sections = concreteReferences.join("; ");
  const matterSummary = `${profile.title} under ${sections}.`;
  return {
    title: profile.title,
    sections,
    interpretation: `${matterSummary} Is this the case you want to proceed with?`,
    matterSummary,
    alternatives: [],
    source: "profile",
  };
}
