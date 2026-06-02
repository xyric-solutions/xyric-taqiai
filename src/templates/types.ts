export interface FormField {
  name: string;
  label: string;
  labelUrdu: string;
  type: "text" | "textarea" | "number" | "date" | "select" | "cnic" | "phone" | "address";
  required: boolean;
  placeholder?: string;
  placeholderUrdu?: string;
  options?: { value: string; label: string; labelUrdu?: string }[];
  validation?: {
    pattern?: string;
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
  };
  group?: string;
  aiSuggestable?: boolean;
}

export interface TemplateDefinition {
  category: string;
  subType: string;
  name: string;
  nameUrdu: string;
  description: string;
  descriptionUrdu: string;
  icon: string;
  formFields: FormField[];
  promptTemplate: string;
}
