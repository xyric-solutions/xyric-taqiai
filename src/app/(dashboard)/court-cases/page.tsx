import SmartDraftPage from "@/components/drafting/SmartDraftPage";

export default function CourtCasesPage() {
  return (
    <SmartDraftPage
      title="Court Cases"
      titleUrdu="عدالتی مقدمات"
      description="Describe what you need — AI will ask follow-up questions and draft it for you"
      category="court-cases"
      quickExamples={[
        "Bail application for accused in theft case",
        "Civil petition for property dispute",
        "Written statement / jawab dawa",
        "Legal notice for recovery of loan",
        "Writ petition under Article 199",
        "Criminal complaint under Section 200 CrPC",
        "Appeal against lower court judgment",
        "FIR draft for police station",
      ]}
      placeholder={"e.g. Bail application for my client Ahmed who was arrested under Section 302 PPC from Lahore...\n\nOr simply write: \"Legal notice for loan recovery\" — AI will ask for the remaining details"}
    />
  );
}
