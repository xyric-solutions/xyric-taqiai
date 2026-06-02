import SmartDraftPage from "@/components/drafting/SmartDraftPage";

export default function ConstitutionalLawPage() {
  return (
    <SmartDraftPage
      title="Constitutional Law"
      titleUrdu="آئینی قانون"
      description="Describe what you need — AI will ask follow-up questions and draft it for you"
      category="constitutional-law"
      quickExamples={[
        "Writ petition under Article 199",
        "Fundamental rights petition",
        "Habeas corpus petition",
        "Mandamus application",
        "Quo warranto petition",
        "Certiorari petition",
        "Constitutional petition against government action",
        "Service matter writ petition",
      ]}
      placeholder={"e.g. Writ petition under Article 199 against illegal termination of government employee Ahmed by department...\n\nOr simply write: \"Habeas corpus petition\" — AI will ask for the remaining details"}
    />
  );
}
