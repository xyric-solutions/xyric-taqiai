"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getTemplate } from "@/templates";
import { saveDocument, updateDocumentContent } from "@/lib/document-store";
import DynamicForm from "@/components/forms/DynamicForm";
import DocumentPreview from "@/components/documents/DocumentPreview";
import ImageUploadTyping from "@/components/documents/ImageUploadTyping";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Link from "next/link";
import { ArrowLeft, PenLine, Camera } from "lucide-react";

export default function NonMuslimLawsTypePage() {
  const params = useParams();
  const router = useRouter();
  const subType = params.subType as string;
  const template = getTemplate("non-muslim-laws", subType);
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [savedDocId, setSavedDocId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState("en");
  const [mode, setMode] = useState<"form" | "image">("form");

  if (!template) {
    return <div className="text-center py-12"><h2 className="text-xl font-bold text-slate-800">Template not found</h2><Button variant="outline" className="mt-4" onClick={() => router.push("/non-muslim-laws")}>Back</Button></div>;
  }

  const handleSubmit = async (formData: Record<string, string>) => {
    setLoading(true); setError(null);
    try {
      const res = await fetch("/api/ai/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ category: "non-muslim-laws", subType, formData, language }) });
      if (!res.ok) throw new Error((await res.json()).error || "Failed");
      const data = await res.json();
      setGeneratedContent(data.html);
      const saved = await saveDocument({ title: template.name, category: "non-muslim-laws", subType, language, content: data.html });
      if (saved) setSavedDocId(saved.id);
    } catch (err) { setError(err instanceof Error ? err.message : "Error"); } finally { setLoading(false); }
  };

  if (generatedContent) return <div className="space-y-4"><Button variant="outline" onClick={() => setGeneratedContent(null)}><ArrowLeft className="h-4 w-4" /> Back</Button><DocumentPreview content={generatedContent} title={template.name} language={language} onContentChange={(c) => { if (savedDocId) void updateDocumentContent(savedDocId, c); }} /></div>;

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/non-muslim-laws" className="text-slate-400 hover:text-slate-600"><ArrowLeft className="h-5 w-5" /></Link>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800">{template.name}</h1>
          <p className="text-slate-500 text-sm">{template.description}</p>
          <p className="text-xs text-slate-400 mt-0.5" dir="rtl">{template.nameUrdu}</p>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="flex bg-slate-100 rounded-xl p-1 w-full sm:w-auto">
          <button onClick={() => setMode("form")} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium flex-1 sm:flex-auto justify-center ${mode === "form" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500"}`}><PenLine className="h-4 w-4" /> Fill Form</button>
          <button onClick={() => setMode("image")} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium flex-1 sm:flex-auto justify-center ${mode === "image" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500"}`}><Camera className="h-4 w-4" /> Upload Image</button>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setLanguage("en")} className={`px-4 py-2 rounded-xl text-sm font-medium ${language === "en" ? "bg-primary-600 text-white" : "bg-slate-100 text-slate-600"}`}>English</button>
          <button onClick={() => setLanguage("ur")} className={`px-4 py-2 rounded-xl text-sm font-medium ${language === "ur" ? "bg-primary-600 text-white" : "bg-slate-100 text-slate-600"}`}>اردو</button>
        </div>
      </div>
      {error && <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">{error}</div>}
      {loading ? (
        <Card className="p-12"><div className="text-center space-y-4"><LoadingSpinner size="lg" /><p className="text-slate-600">Generating document...</p></div></Card>
      ) : mode === "form" ? (
        <Card className="p-4 sm:p-6"><DynamicForm fields={template.formFields} onSubmit={handleSubmit} loading={loading} language={language} documentType={template.name} /></Card>
      ) : (
        <Card className="p-4 sm:p-6">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-slate-700">Upload Document Image / دستاویز کی تصویر اپلوڈ کریں</h3>
            <p className="text-xs text-slate-500 mt-1">Upload a photo - AI will type the same content</p>
          </div>
          <ImageUploadTyping onResult={async (html) => { setGeneratedContent(html); const saved = await saveDocument({ title: template.name, category: "non-muslim-laws", subType, language, content: html }); if (saved) setSavedDocId(saved.id); }} language={language} />
        </Card>
      )}
    </div>
  );
}
