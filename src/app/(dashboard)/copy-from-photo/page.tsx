"use client";

import { useState } from "react";
import { saveDocument, updateDocumentContent } from "@/lib/document-store";
import DocumentPreview from "@/components/documents/DocumentPreview";
import ImageUploadTyping from "@/components/documents/ImageUploadTyping";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { ArrowLeft, Camera, ScanLine } from "lucide-react";

export default function CopyFromPhotoPage() {
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [savedDocId, setSavedDocId] = useState<string | null>(null);
  const [language, setLanguage] = useState("en");

  const handleResult = async (html: string) => {
    setGeneratedContent(html);
    const saved = await saveDocument({
      title: "Copied Document",
      category: "copy-from-photo",
      subType: "photo",
      language,
      content: html,
    });
    if (saved) setSavedDocId(saved.id);
  };

  if (generatedContent) {
    return (
      <div className="space-y-4">
        <Button variant="outline" onClick={() => { setGeneratedContent(null); setSavedDocId(null); }}>
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <DocumentPreview
          content={generatedContent}
          title="Copied Document"
          language={language}
          onContentChange={(c) => { if (savedDocId) void updateDocumentContent(savedDocId, c); }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-5 sm:space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-primary-500/15 text-primary-400 flex-shrink-0">
          <ScanLine className="h-5 w-5" strokeWidth={1.5} />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">
            Copy from Photo / تصویر سے نقل
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-0.5">
            Upload a photo of any document — AI will type it out exactly, same to same.
          </p>
          <p className="text-xs text-[var(--text-tertiary)] mt-0.5" dir="rtl">
            کسی بھی دستاویز کی تصویر اپلوڈ کریں — AI اسے ہوبہو ٹائپ کر دے گا
          </p>
        </div>
      </div>

      {/* Language toggle */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-[var(--text-tertiary)]">Output language:</span>
        <div className="flex gap-2">
          <button
            onClick={() => setLanguage("en")}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              language === "en"
                ? "bg-primary-600 text-white"
                : "bg-[var(--bg-surface-2)] text-[var(--text-secondary)] border border-[var(--border-default)]"
            }`}
          >
            English
          </button>
          <button
            onClick={() => setLanguage("ur")}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              language === "ur"
                ? "bg-primary-600 text-white"
                : "bg-[var(--bg-surface-2)] text-[var(--text-secondary)] border border-[var(--border-default)]"
            }`}
          >
            اردو
          </button>
        </div>
      </div>

      {/* Upload + type */}
      <Card className="p-4 sm:p-6">
        <div className="mb-4 flex items-center gap-2">
          <Camera className="h-4 w-4 text-primary-400" strokeWidth={1.5} />
          <h3 className="text-sm font-semibold text-[var(--text-secondary)]">
            Upload Document Image / دستاویز کی تصویر اپلوڈ کریں
          </h3>
        </div>
        <ImageUploadTyping onResult={handleResult} language={language} />
        <p className="mt-3 text-xs text-[var(--text-tertiary)]">
          Tip: a clear, straight photo with good lighting gives the most accurate result. AI only types what is visible — it never invents text.
        </p>
      </Card>
    </div>
  );
}
