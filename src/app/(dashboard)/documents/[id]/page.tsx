"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import DocumentPreview from "@/components/documents/DocumentPreview";
import { getDocument, updateDocumentContent, SavedDocument } from "@/lib/document-store";
import { ArrowLeft } from "lucide-react";

export default function DocumentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [doc, setDoc] = useState<SavedDocument | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const d = await getDocument(id);
      setDoc(d);
      setLoaded(true);
    })();
  }, [id]);

  if (!loaded) return null;

  if (!doc) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold text-slate-800">Document not found</h2>
        <Button variant="outline" className="mt-4" onClick={() => router.push("/documents")}>
          Back to Documents
        </Button>
      </div>
    );
  }

  const handleContentChange = (newContent: string) => {
    void updateDocumentContent(doc.id, newContent);
    setDoc({ ...doc, content: newContent, updatedAt: Date.now() });
  };

  return (
    <div className="space-y-4">
      <Link href="/documents" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700">
        <ArrowLeft className="h-4 w-4" /> Back to Documents
      </Link>
      <DocumentPreview
        content={doc.content}
        title={doc.title}
        language={doc.language}
        onContentChange={handleContentChange}
      />
    </div>
  );
}
