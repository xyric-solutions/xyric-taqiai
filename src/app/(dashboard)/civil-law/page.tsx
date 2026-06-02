import SmartDraftPage from "@/components/drafting/SmartDraftPage";

export default function CivilLawPage() {
  return (
    <SmartDraftPage
      title="Civil Law"
      titleUrdu="دیوانی قانون"
      description="Describe what you need — AI will ask follow-up questions and draft it for you"
      category="civil-law"
      quickExamples={[
        "Civil suit for money recovery",
        "Specific performance suit",
        "Declaratory suit",
        "Injunction application",
        "Written statement / jawab dawa",
        "Civil appeal",
        "Execution petition",
        "Damages suit",
      ]}
      placeholder={"e.g. Civil suit for recovery of Rs. 5 lakh loan from Ahmed who is refusing to pay back...\n\nOr simply write: \"Declaratory suit\" — AI will ask for the remaining details"}
    />
  );
}
