"use client";

import { useState } from "react";
import { FormField } from "@/templates/types";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Sparkles } from "lucide-react";
import { formatPKR, toPKWords, isAmountField } from "@/lib/pk-format";

interface DynamicFormProps {
  fields: FormField[];
  onSubmit: (data: Record<string, string>) => void;
  loading?: boolean;
  language?: string;
}

export default function DynamicForm({ fields, onSubmit, loading, language = "en" }: DynamicFormProps) {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const isUrdu = language === "ur";

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    for (const field of fields) {
      if (field.required && !formData[field.name]?.trim()) {
        newErrors[field.name] = `${isUrdu ? field.labelUrdu : field.label} is required`;
      }
      if (field.validation?.pattern && formData[field.name]) {
        const regex = new RegExp(field.validation.pattern);
        if (!regex.test(formData[field.name])) {
          newErrors[field.name] = `Invalid format for ${isUrdu ? field.labelUrdu : field.label}`;
        }
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  const groups = fields.reduce<Record<string, FormField[]>>((acc, field) => {
    const group = field.group || "General";
    if (!acc[group]) acc[group] = [];
    acc[group].push(field);
    return acc;
  }, {});

  const renderField = (field: FormField) => {
    const label = isUrdu ? field.labelUrdu : field.label;
    const placeholder = isUrdu ? field.placeholderUrdu : field.placeholder;

    switch (field.type) {
      case "textarea":
        return (
          <div key={field.name} className="w-full">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              {label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <textarea
              className={`w-full px-4 py-3 border rounded-xl text-slate-900 placeholder-slate-400 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 ${
                errors[field.name] ? "border-red-400" : "border-slate-200 hover:border-slate-300"
              }`}
              rows={4}
              placeholder={placeholder}
              value={formData[field.name] || ""}
              onChange={(e) => handleChange(field.name, e.target.value)}
            />
            {field.aiSuggestable && (
              <p className="mt-1.5 text-xs text-primary-500 flex items-center gap-1.5 font-medium">
                <Sparkles className="h-3 w-3" /> AI can help suggest content for this field
              </p>
            )}
            {errors[field.name] && <p className="mt-1.5 text-sm text-red-500">{errors[field.name]}</p>}
          </div>
        );

      case "select":
        return (
          <div key={field.name} className="w-full">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              {label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <select
              className={`w-full px-4 py-2.5 border rounded-xl text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 ${
                errors[field.name] ? "border-red-400" : "border-slate-200 hover:border-slate-300"
              }`}
              value={formData[field.name] || ""}
              onChange={(e) => handleChange(field.name, e.target.value)}
            >
              <option value="">-- Select --</option>
              {field.options?.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {isUrdu ? (opt.labelUrdu ?? opt.label) : opt.label}
                </option>
              ))}
            </select>
            {errors[field.name] && <p className="mt-1.5 text-sm text-red-500">{errors[field.name]}</p>}
          </div>
        );

      case "date":
        return <Input key={field.name} type="date" label={label} required={field.required} value={formData[field.name] || ""} onChange={(e) => handleChange(field.name, e.target.value)} error={errors[field.name]} />;

      case "number": {
        const isAmt = isAmountField(field.label, field.labelUrdu);
        const rawVal = formData[field.name] || "";
        const numVal = parseFloat(rawVal);
        const showPreview = isAmt && !isNaN(numVal) && numVal > 0;
        return (
          <div key={field.name}>
            <Input type="number" label={label} required={field.required} placeholder={placeholder} value={rawVal} onChange={(e) => handleChange(field.name, e.target.value)} error={errors[field.name]} />
            {showPreview && (
              <div className="mt-2 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-lg text-xs space-y-0.5">
                <p className="font-semibold text-emerald-800">{formatPKR(numVal)} &mdash; {toPKWords(numVal)}</p>
                {numVal >= 100000 && (
                  <p className="text-emerald-600">Half: {formatPKR(numVal / 2)} &mdash; {toPKWords(numVal / 2)}</p>
                )}
              </div>
            )}
          </div>
        );
      }

      case "cnic":
        return (
          <Input
            key={field.name}
            type="text"
            label={label}
            required={field.required}
            placeholder="XXXXX-XXXXXXX-X"
            value={formData[field.name] || ""}
            onChange={(e) => {
              let val = e.target.value.replace(/[^0-9-]/g, "");
              const digits = val.replace(/-/g, "");
              if (digits.length <= 5) val = digits;
              else if (digits.length <= 12) val = `${digits.slice(0, 5)}-${digits.slice(5)}`;
              else val = `${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(12, 13)}`;
              handleChange(field.name, val);
            }}
            maxLength={15}
            error={errors[field.name]}
          />
        );

      case "phone":
        return <Input key={field.name} type="tel" label={label} required={field.required} placeholder="03XX-XXXXXXX" value={formData[field.name] || ""} onChange={(e) => handleChange(field.name, e.target.value)} error={errors[field.name]} />;

      default:
        return <Input key={field.name} type="text" label={label} required={field.required} placeholder={placeholder} value={formData[field.name] || ""} onChange={(e) => handleChange(field.name, e.target.value)} error={errors[field.name]} />;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {Object.entries(groups).map(([groupName, groupFields]) => (
        <div key={groupName} className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-gradient-to-r from-slate-200 to-transparent" />
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">
              {groupName}
            </h3>
            <div className="h-px flex-1 bg-gradient-to-l from-slate-200 to-transparent" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {groupFields.map((field) => (
              <div key={field.name} className={field.type === "textarea" || field.type === "address" ? "md:col-span-2" : ""}>
                {renderField(field)}
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-slate-100">
        <Button type="submit" loading={loading} size="lg" className="w-full sm:w-auto">
          {isUrdu ? "دستاویز بنائیں" : "Generate Document"}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="w-full sm:w-auto"
          onClick={() => { setFormData({}); setErrors({}); }}
        >
          {isUrdu ? "فارم صاف کریں" : "Clear Form"}
        </Button>
      </div>
    </form>
  );
}
