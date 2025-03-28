
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
  profile_logo?: string;
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
  profile_services_json?: string;
  profile_services?: Array<{
    id: string;
    title: string;
    description: string;
    price?: string;
    image?: string;
    category?: string;
    linkedForms?: string[];
  }>;
  
  // Inquiry form settings
  inquiry_form_enabled?: boolean;
  inquiry_form_fields?: object[];
  inquiry_form_settings?: {
    redirect_url?: string;
    success_message?: string;
    email_notifications?: boolean;
  };
  
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
  active?: boolean;
  service_id?: string;
  service_name?: string;
}

// Enquiry type
export interface Enquiry {
  id: string;
  title: string;
  customer_name: string;
  customer_email: string;
  company_id: string;
  form_id?: string;
  form_name?: string;
  submission_id?: string;
  content: string;
  status: 'new' | 'pending' | 'completed';
  priority?: 'high' | 'medium' | 'low';
  created_at: string;
  updated_at?: string;
}
