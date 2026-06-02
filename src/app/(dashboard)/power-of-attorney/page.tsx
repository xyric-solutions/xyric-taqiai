import SmartDraftPage from "@/components/drafting/SmartDraftPage";

export default function PowerOfAttorneyPage() {
  return (
    <SmartDraftPage
      title="Power of Attorney"
      titleUrdu="پاور آف اٹارنی"
      description="Describe what you need — AI will ask follow-up questions and draft it for you"
      category="power-of-attorney"
      quickExamples={[
        "General power of attorney",
        "Special power of attorney for property",
        "Court appearance power of attorney",
        "Banking / financial power of attorney",
        "Revocation of power of attorney",
        "Power of attorney for overseas Pakistani",
        "Limited power of attorney",
        "Medical power of attorney",
      ]}
      placeholder={"e.g. Special power of attorney for Ahmed to sell my property in Lahore on my behalf while I am abroad...\n\nOr simply write: \"General power of attorney\" — AI will ask for the remaining details"}
    />
  );
}
