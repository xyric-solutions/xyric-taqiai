import SmartDraftPage from "@/components/drafting/SmartDraftPage";

export default function CorporateLawPage() {
  return (
    <SmartDraftPage
      title="Corporate Law"
      titleUrdu="کارپوریٹ قانون"
      description="Describe what you need — AI will ask follow-up questions and draft it for you"
      category="corporate-law"
      quickExamples={[
        "Partnership dispute petition",
        "Employment termination / wrongful dismissal",
        "Business contract dispute",
        "Shareholder dispute petition",
        "Company winding up petition",
        "Director removal application",
        "Intellectual property dispute",
        "Non-compete breach case",
      ]}
      placeholder={"e.g. Partnership dispute — my partner is misappropriating company funds at our business in Karachi...\n\nOr simply write: \"Wrongful dismissal case\" — AI will ask for the remaining details"}
    />
  );
}
