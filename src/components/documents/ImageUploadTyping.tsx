"use client";

import { useState, useRef } from "react";
import Button from "@/components/ui/Button";
import { Upload, X, Camera, FileText } from "lucide-react";

interface ImageUploadTypingProps {
  onResult: (html: string) => void;
  language?: string;
}

export default function ImageUploadTyping({ onResult, language = "en" }: ImageUploadTypingProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Only image files are supported (JPG, PNG)");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("Image must be under 10MB");
      return;
    }

    setImageFile(file);
    setError("");
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleExtract = async () => {
    if (!imageFile) return;
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("image", imageFile);
      formData.append("language", language);

      const res = await fetch("/api/ai/extract-document", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to extract");
      }

      const data = await res.json();
      onResult(data.html);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not extract document from image");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      {imagePreview ? (
        <div className="relative">
          <img
            src={imagePreview}
            alt="Document"
            className="w-full max-h-[300px] object-contain rounded-xl border border-slate-200 bg-slate-50"
          />
          <button
            onClick={removeImage}
            className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-500 text-white hover:bg-red-600 shadow-lg"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="absolute bottom-2 left-2 px-3 py-1 bg-black/60 text-white text-xs rounded-lg flex items-center gap-1.5">
            <FileText className="h-3 w-3" />
            {imageFile?.name}
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-primary-400 hover:bg-primary-50/30 group"
        >
          <div className="p-3 rounded-2xl bg-slate-100 group-hover:bg-primary-100 mb-3">
            <Camera className="h-7 w-7 text-slate-400 group-hover:text-primary-500" />
          </div>
          <p className="text-sm font-semibold text-slate-600">Upload document image</p>
          <p className="text-xs text-slate-400 mt-1">AI will type the same document for you</p>
          <p className="text-xs text-slate-400 mt-2" dir="rtl">دستاویز کی تصویر اپلوڈ کریں - AI ٹائپ کر دے گا</p>
          <div className="flex gap-2 mt-3">
            <span className="px-2 py-0.5 text-[10px] bg-slate-100 text-slate-500 rounded-full">JPG</span>
            <span className="px-2 py-0.5 text-[10px] bg-slate-100 text-slate-500 rounded-full">PNG</span>
            <span className="px-2 py-0.5 text-[10px] bg-slate-100 text-slate-500 rounded-full">Max 10MB</span>
          </div>
        </div>
      )}

      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError("")}><X className="h-4 w-4 text-red-400" /></button>
        </div>
      )}

      {imageFile && (
        <Button onClick={handleExtract} loading={loading} className="w-full" size="lg">
          <Upload className="h-4 w-4" />
          {loading ? "AI document type kar raha hai..." : "AI se Type Karwayein"}
        </Button>
      )}
    </div>
  );
}
