import SmartDraftPage from "@/components/drafting/SmartDraftPage";

export default function FamilyLawPage() {
  return (
    <SmartDraftPage
      title="Family Law"
      titleUrdu="خاندانی قانون"
      description="Describe what you need — AI will ask follow-up questions and draft it for you"
      category="family-law"
      quickExamples={[
        "Khula / divorce petition",
        "Maintenance (nafqa) application",
        "Child custody petition",
        "Haq Mehr recovery suit",
        "Guardianship petition",
        "Restitution of conjugal rights",
        "Dissolution of marriage suit",
        "Dowry recovery application",
      ]}
      placeholder={"e.g. Khula petition for wife who wants divorce from husband Ahmed in Family Court Lahore...\n\nOr simply write: \"Child custody petition\" — AI will ask for the remaining details"}
    />
  );
}
