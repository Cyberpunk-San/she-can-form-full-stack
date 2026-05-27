export interface FormField {
  _id: string;
  fieldName: string;
  label: string;
  type: string;
  required: boolean;
  placeholder?: string;
  options?: string[];
  order: number;
  isActive: boolean;
}

export interface Submission {
  _id: string;
  formData: Record<string, any>;
  submittedAt: string;
  status: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  isAdmin: boolean;
}

export interface FormData {
  [key: string]: any;
}