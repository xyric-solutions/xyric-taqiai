import SmartDraftPage from "@/components/drafting/SmartDraftPage";

import { AGREEMENT_CATALOG } from "@/lib/agreement-catalog";

export default function AgreementsPage() {
  return (
    <SmartDraftPage
      title="Agreements"
      titleUrdu="معاہدے"
      description="Choose an agreement or describe what you need. AI will collect the relevant details and draft it for you."
      category="agreement"
      quickExamples={[
        "Vehicle Sale Agreement",
        "Rent Agreement",
        "Property Purchase Agreement (Byana)",
        "Partnership Deed",
        "Loan Agreement",
        "Employment Contract",
      ]}
      placeholder="e.g. car sale agreement, house rent agreement, partnership deed"
      documentGroups={AGREEMENT_CATALOG}
      restoreDraft={false}
    />
  );
}
