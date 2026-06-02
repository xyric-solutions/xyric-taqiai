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
import { ArrowLeft, PenLine, Camera, Layers, RotateCcw } from "lucide-react";

export default function AffidavitTypePage() {
  const params = useParams();
  const router = useRouter();
  const type = params.type as string;
  const template = getTemplate("affidavit", type);

  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [savedDocId, setSavedDocId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState("en");
  const [mode, setMode] = useState<"form" | "image">("form");
  // S01-03: Draft Variant Selection
  const [variants, setVariants] = useState<string[]>([]);
  const [showVariants, setShowVariants] = useState(false);
  const [lastFormData, setLastFormData] = useState<Record<string, string> | null>(null);

  if (!template) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold text-slate-800">Template not found</h2>
        <p className="text-slate-500 mt-2">The requested affidavit type does not exist.</p>
        <Button variant="outline" className="mt-4" onClick={() => router.push("/affidavits")}>Back to Affidavits</Button>
      </div>
    );
  }

  const handleSubmit = async (formData: Record<string, string>) => {
    setLoading(true);
    setError(null);
    setLastFormData(formData); // S01-09: preserve data for retry
    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category: "affidavit", subType: type, formData, language }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to generate document");
      }
      const data = await res.json();
      setGeneratedContent(data.html);
      const saved = await saveDocument({
        title: template.name,
        category: "affidavit",
        subType: type,
        language,
        content: data.html,
      });
      if (saved) setSavedDocId(saved.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // S01-03: Generate 2 additional variants
  const handleGenerateVariants = async () => {
    if (!lastFormData) return;
    setLoading(true);
    setError(null);
    try {
      const results = await Promise.all([
        fetch("/api/ai/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ category: "affidavit", subType: type, formData: lastFormData, language, variantNote: "Variant 2 — more formal tone" }),
        }),
        fetch("/api/ai/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ category: "affidavit", subType: type, formData: lastFormData, language, variantNote: "Variant 3 — concise version" }),
        }),
      ]);
      const htmls = await Promise.all(results.map((r) => r.json().then((d) => d.html || "")));
      setVariants([generatedContent || "", ...htmls]);
      setShowVariants(true);
    } catch {
      setError("Could not generate variants. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageResult = async (html: string) => {
    setGeneratedContent(html);
    const saved = await saveDocument({
      title: template.name,
      category: "affidavit",
      subType: type,
      language,
      content: html,
    });
    if (saved) setSavedDocId(saved.id);
  };

  if (generatedContent) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 flex-wrap">
          <Button variant="outline" onClick={() => { setGeneratedContent(null); setShowVariants(false); setVariants([]); }}>
            <ArrowLeft className="h-4 w-4" /> Back to Form
          </Button>
          {/* S01-03: Generate Variants button */}
          {!showVariants && lastFormData && (
            <Button variant="outline" size="sm" onClick={handleGenerateVariants} loading={loading} disabled={loading}>
              <Layers className="h-4 w-4" /> Generate 2 More Variants
            </Button>
          )}
        </div>

        {/* S01-03: Variant Selection */}
        {showVariants && variants.length > 1 && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 space-y-3">
            <h3 className="text-sm font-bold text-blue-800 flex items-center gap-2">
              <Layers className="h-4 w-4" /> Select a Draft Variant
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {variants.map((v, i) => (
                <button
                  key={i}
                  onClick={() => { setGeneratedContent(v); setShowVariants(false); }}
                  className={`text-left p-3 rounded-xl border-2 text-xs transition-all hover:border-blue-400 hover:bg-blue-100 ${
                    generatedContent === v ? "border-blue-500 bg-blue-100" : "border-slate-200 bg-white"
                  }`}
                >
                  <p className="font-bold text-slate-700 mb-1">Variant {i + 1}</p>
                  <p className="text-slate-500 line-clamp-3">{v.replace(/<[^>]+>/g, " ").slice(0, 100)}...</p>
                  <p className="mt-2 text-blue-600 font-semibold text-[11px]">Click to select →</p>
                </button>
              ))}
            </div>
          </div>
        )}

        <DocumentPreview
          content={generatedContent}
          title={template.name}
          language={language}
          onContentChange={(c) => { if (savedDocId) void updateDocumentContent(savedDocId, c); }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/affidavits" className="text-slate-400 hover:text-slate-600">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800">{template.name}</h1>
          <p className="text-slate-500 text-sm">{template.description}</p>
          <p className="text-xs text-slate-400 mt-0.5" dir="rtl">{template.nameUrdu}</p>
        </div>
      </div>

      {/* Mode Toggle + Language */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        {/* Mode Toggle */}
        <div className="flex bg-slate-100 rounded-xl p-1 w-full sm:w-auto">
          <button
            onClick={() => setMode("form")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium flex-1 sm:flex-auto justify-center ${
              mode === "form" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <PenLine className="h-4 w-4" />
            Fill Form
          </button>
          <button
            onClick={() => setMode("image")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium flex-1 sm:flex-auto justify-center ${
              mode === "image" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <Camera className="h-4 w-4" />
            Upload Image
          </button>
        </div>

        {/* Language */}
        <div className="flex gap-2">
          <button onClick={() => setLanguage("en")} className={`px-4 py-2 rounded-xl text-sm font-medium ${language === "en" ? "bg-primary-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>English</button>
          <button onClick={() => setLanguage("ur")} className={`px-4 py-2 rounded-xl text-sm font-medium ${language === "ur" ? "bg-primary-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>اردو</button>
        </div>
      </div>

      {/* S01-09: Error with retry — form data preserved */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 space-y-2">
          <p className="text-red-700 text-sm font-medium">{error}</p>
          {lastFormData && (
            <button
              onClick={() => handleSubmit(lastFormData)}
              className="flex items-center gap-1.5 text-xs font-semibold text-red-700 hover:text-red-800 underline"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Retry — your form data is preserved
            </button>
          )}
        </div>
      )}

      {loading ? (
        <Card className="p-12">
          <div className="text-center space-y-4">
            <LoadingSpinner size="lg" />
            <p className="text-slate-600">Generating your document with AI...</p>
            <p className="text-sm text-slate-400" dir="rtl">اے آئی آپ کی دستاویز بنا رہا ہے...</p>
          </div>
        </Card>
      ) : mode === "form" ? (
        <Card className="p-4 sm:p-6">
          <DynamicForm fields={template.formFields} onSubmit={handleSubmit} loading={loading} language={language} />
        </Card>
      ) : (
        <Card className="p-4 sm:p-6">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-slate-700">Upload Document Image / دستاویز کی تصویر اپلوڈ کریں</h3>
            <p className="text-xs text-slate-500 mt-1">
              Upload a photo of your handwritten or printed document - AI will type the same content for you
            </p>
            <p className="text-xs text-slate-400 mt-0.5" dir="rtl">
              اپنی ہاتھ سے لکھی یا پرنٹ شدہ دستاویز کی تصویر اپلوڈ کریں - AI اسی مواد کو ٹائپ کر دے گا
            </p>
          </div>
          <ImageUploadTyping onResult={handleImageResult} language={language} />
        </Card>
      )}
    </div>
  );
}
