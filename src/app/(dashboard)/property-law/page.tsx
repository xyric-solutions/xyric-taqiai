import SmartDraftPage from "@/components/drafting/SmartDraftPage";

export default function PropertyLawPage() {
  return (
    <SmartDraftPage
      title="Property Law"
      titleUrdu="جائیداد قانون"
      description="Describe what you need — AI will ask follow-up questions and draft it for you"
      category="property-law"
      quickExamples={[
        "Suit for possession of property",
        "Injunction against illegal construction",
        "Property dispute / trespass case",
        "Inheritance / wirasat suit",
        "Rent recovery from tenant",
        "Declaration suit for ownership",
        "Pre-emption / shuf'a suit",
        "Specific performance of sale deed",
      ]}
      placeholder={"e.g. Suit for possession of plot in Lahore, seller refused to hand over after receiving full payment...\n\nOr simply write: \"Inheritance suit\" — AI will ask for the remaining details"}
    />
  );
}
