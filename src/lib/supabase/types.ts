
// Define types for auth
export type UserRole = 'customer' | 'company';

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  company_name?: string;
  phone?: string;
  industry?: string;
  website?: string;
  integrations?: string[];
  created_at: string;
  // Company profile customization
  profile_banner?: string;
  profile_description?: string;
  profile_color_scheme?: string;
  profile_social_links?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
  profile_contact_info?: {
    email?: string;
    phone?: string;
    address?: string;
  };
  profile_featured_images?: string[];
  profile_services?: Array<{
    title: string;
    description: string;
    image?: string;
  }>;
  [key: string]: unknown; // Allow for additional properties from Supabase
}

// Form template types
export interface FormBranding {
  primaryColor?: string;
  fontFamily?: string;
  logo?: string;
  backgroundColor?: string;
  textColor?: string;
  buttonStyle?: string;
}

export type FormFieldType = 'text' | 'textarea' | 'checkbox' | 'radio' | 'email' | 'file' | 'phone' | 'dropdown';

export interface FormField {
  id: string;
  type: FormFieldType;
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: string[]; // For dropdown, checkbox, radio
  defaultValue?: string;
  validations?: Record<string, unknown>;
}

export interface FormTemplate {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
  fields: FormField[];
  branding: FormBranding;
  is_public?: boolean;
  company_id?: string;
}
