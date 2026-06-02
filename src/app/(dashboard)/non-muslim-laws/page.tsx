import SmartDraftPage from "@/components/drafting/SmartDraftPage";

export default function NonMuslimLawsPage() {
  return (
    <SmartDraftPage
      title="Non-Muslim Laws"
      titleUrdu="غیر مسلم قوانین"
      description="Describe what you need — AI will ask follow-up questions and draft it for you"
      category="non-muslim-laws"
      quickExamples={[
        "Christian divorce petition",
        "Hindu marriage registration",
        "Non-Muslim succession / inheritance case",
        "Minority community rights petition",
        "Inter-faith marriage documents",
        "Christian marriage registration",
        "Sikh community legal matter",
        "Ahmadiyya community legal matter",
      ]}
      placeholder={"e.g. Christian divorce petition for Sarah and John in Family Court under Divorce Act 1869...\n\nOr simply write: \"Hindu marriage registration\" — AI will ask for the remaining details"}
    />
  );
}
