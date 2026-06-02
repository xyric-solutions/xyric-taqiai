import SmartDraftPage from "@/components/drafting/SmartDraftPage";

export default function AgreementsPage() {
  return (
    <SmartDraftPage
      title="Agreements"
      titleUrdu="معاہدے"
      description="Describe what you need — AI will ask follow-up questions and draft it for you"
      category="agreement"
      quickExamples={[
        "Rent agreement",
        "Property sale agreement",
        "Business partnership deed",
        "Loan agreement",
        "Employment contract",
        "Service agreement",
        "MOU (Memorandum of Understanding)",
        "Construction contract",
      ]}
      placeholder={"Write the type of agreement you need"}
    />
  );
}
