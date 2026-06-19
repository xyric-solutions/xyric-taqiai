import { redirect } from "next/navigation";

// Case Management was consolidated into Chamber (/chamber). Old links redirect.
export default function CaseDetailRedirect() {
  redirect("/chamber");
}
