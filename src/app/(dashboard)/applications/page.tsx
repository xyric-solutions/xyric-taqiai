import SmartDraftPage from "@/components/drafting/SmartDraftPage";

export default function ApplicationsPage() {
  return (
    <SmartDraftPage
      title="Applications"
      titleUrdu="درخواستیں"
      description="Describe what you need — AI will ask follow-up questions and draft it for you"
      category="application"
      quickExamples={[
        "FIR application to police station",
        "Application for bail",
        "Complaint against police officer",
        "Application for NOC from police",
        "Application to court for adjournment",
        "Application for character certificate",
        "Application to DC office",
        "Complaint against neighbour",
      ]}
      placeholder={"e.g. Application to police station for FIR against theft at my house in Lahore...\n\nOr simply write: \"Bail application\" — AI will ask for the remaining details"}
    />
  );
}
