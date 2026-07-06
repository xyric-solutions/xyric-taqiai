import { redirect } from "next/navigation";

// The legacy Case Management pages now live in the Lawyer Diary.
export default function CasesRedirect() {
  redirect("/lawyer-diary");
}
