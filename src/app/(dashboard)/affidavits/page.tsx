import SmartDraftPage from "@/components/drafting/SmartDraftPage";

export default function AffidavitsPage() {
  return (
    <SmartDraftPage
      title="Affidavits"
      titleUrdu="حلف نامے"
      description="Describe what you need — AI will ask follow-up questions and draft it for you"
      category="affidavit"
      quickExamples={[
        "Property sale affidavit",
        "NOC for vehicle transfer",
        "Income affidavit",
        "Identity affidavit",
        "Undertaking letter",
        "Residence affidavit",
        "Heirship affidavit",
        "Character affidavit",
      ]}
      placeholder={"Write the type of affidavit you need"}
    />
  );
}
