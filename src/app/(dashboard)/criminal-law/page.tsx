import SmartDraftPage from "@/components/drafting/SmartDraftPage";

export default function CriminalLawPage() {
  return (
    <SmartDraftPage
      title="Criminal Law"
      titleUrdu="فوجداری قانون"
      description="Describe what you need — AI will ask follow-up questions and draft it for you"
      category="criminal-law"
      quickExamples={[
        "Bail application under Section 497 CrPC",
        "FIR draft for police station",
        "Quashment petition of FIR",
        "Criminal appeal against conviction",
        "Anti-bail application",
        "Surety bond application",
        "Written complaint under Section 200 CrPC",
        "Acquittal application",
      ]}
      placeholder={"e.g. Bail application for my client Ahmed who was arrested under Section 302 PPC from Lahore police station...\n\nOr simply write: \"FIR draft for theft case\" — AI will ask for the remaining details"}
    />
  );
}
