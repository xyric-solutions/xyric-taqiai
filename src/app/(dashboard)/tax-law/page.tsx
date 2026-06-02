import SmartDraftPage from "@/components/drafting/SmartDraftPage";

export default function TaxLawPage() {
  return (
    <SmartDraftPage
      title="Tax Law"
      titleUrdu="ٹیکس قانون"
      description="Describe what you need — AI will ask follow-up questions and draft it for you"
      category="tax-law"
      quickExamples={[
        "Income tax appeal before ATIR",
        "Sales tax dispute petition",
        "Tax exemption application",
        "FBR notice reply",
        "Customs duty appeal",
        "Tax refund application",
        "Penalty waiver application",
        "Transfer pricing dispute",
      ]}
      placeholder={"e.g. Income tax appeal against FBR demand notice for tax year 2024, excess tax of Rs. 2 lakh charged...\n\nOr simply write: \"Sales tax appeal\" — AI will ask for the remaining details"}
    />
  );
}
