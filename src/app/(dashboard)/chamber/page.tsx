import { redirect } from "next/navigation";

// Case Management (Chamber) was merged into the Lawyer Diary (/lawyer-diary).
// Old links/bookmarks redirect there.
export default function ChamberRedirect() {
  redirect("/lawyer-diary");
}
