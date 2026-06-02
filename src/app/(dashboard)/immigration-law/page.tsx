import SmartDraftPage from "@/components/drafting/SmartDraftPage";

export default function ImmigrationLawPage() {
  return (
    <SmartDraftPage
      title="Immigration Law"
      titleUrdu="امیگریشن قانون"
      description="Describe what you need — AI will ask follow-up questions and draft it for you"
      category="immigration-law"
      quickExamples={[
        "Visa appeal petition",
        "Citizenship application",
        "Deportation stay application",
        "Work permit appeal",
        "Asylum / refugee status application",
        "Travel document application",
        "Dual nationality application",
        "Overstay regularization petition",
      ]}
      placeholder={"e.g. Visa appeal petition after rejection of UK visa application for Ahmed, business purpose...\n\nOr simply write: \"Deportation stay application\" — AI will ask for the remaining details"}
    />
  );
}
