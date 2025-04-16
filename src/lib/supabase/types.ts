import { Database } from '@supabase/supabase-js';

// Main Database interface
export interface SupabaseDatabase {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: ProfileInsert;
        Update: Partial<ProfileInsert>;
      };
      inquiries: {
        Row: Inquiry;
        Insert: InquiryInsert;
        Update: Partial<InquiryInsert>;
      };
      messages: {
        Row: Message;
        Insert: MessageInsert;
        Update: Partial<MessageInsert>;
      };
      message_attachments: {
        Row: MessageAttachment;
        Insert: MessageAttachmentInsert;
        Update: Partial<MessageAttachmentInsert>;
      };
      projects: {
        Row: Project;
        Insert: ProjectInsert;
        Update: Partial<ProjectInsert>;
      };
      project_documents: {
        Row: ProjectDocument;
        Insert: ProjectDocumentInsert;
        Update: Partial<ProjectDocumentInsert>;
      };
      project_milestones: {
        Row: ProjectMilestone;
        Insert: ProjectMilestoneInsert;
        Update: Partial<ProjectMilestoneInsert>;
      };
      form_templates: {
        Row: FormTemplate;
        Insert: FormTemplateInsert;
        Update: Partial<FormTemplateInsert>;
      };
      form_submissions: {
        Row: FormSubmission;
        Insert: FormSubmissionInsert;
        Update: Partial<FormSubmissionInsert>;
      };
      geo_data: {
        Row: GeoData;
        Insert: GeoDataInsert;
        Update: Partial<GeoDataInsert>;
      };
      notifications: {
        Row: Notification;
        Insert: NotificationInsert;
        Update: Partial<NotificationInsert>;
      };
    };
    Views: {
      [key: string]: {
        Row: Record<string, unknown>;
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
      };
    };
    Functions: {
      [key: string]: {
        Args: Record<string, unknown>;
        Returns: unknown;
      };
    };
    Enums: {
      UserRole: 'customer' | 'company';
      InquiryStatus: 'new' | 'pending' | 'completed';
      Priority: 'high' | 'medium' | 'low';
      MessageChannel: 'app' | 'email' | 'instagram';
      MessageStatus: 'draft' | 'sent' | 'delivered' | 'read';
      ProjectStatus: 'planning' | 'active' | 'on-hold' | 'completed' | 'cancelled';
      MilestoneStatus: 'pending' | 'in-progress' | 'completed' | 'delayed';
      DocumentVisibility: 'company' | 'customer' | 'both';
      FormSubmissionStatus: 'new' | 'viewed' | 'processed';
      GeoDataReferenceType: 'inquiry' | 'project' | 'company' | 'customer';
      NotificationType: 'inquiry' | 'message' | 'project' | 'system';
    };
  };
}

// Custom type declaration for Supabase client
declare global {
  type SupabaseClientType = Database<SupabaseDatabase>;
}

// Profiles
export interface Profile {
  id: string;
  email: string;
  role: 'customer' | 'company';
  name: string;
  company_name: string | null;
  phone: string | null;
  industry: string | null;
  website: string | null;
  integrations: {
    [key: string]: any;
  } | null;
  profile_banner: string | null;
  profile_logo: string | null;
  profile_description: string | null;
  profile_color_scheme: string | null;
  profile_social_links: {
    [key: string]: string;
  } | null;
  profile_contact_info: {
    [key: string]: string;
  } | null;
  profile_featured_images: string[] | null;
  profile_services_json: string | null;
  profile_services: {
    id: string;
    name: string;
    description: string;
    price?: string;
    featured?: boolean;
  }[] | null;
  inquiry_form_enabled: boolean;
  inquiry_form_fields: {
    id: string;
    type: string;
    label: string;
    required: boolean;
    options?: string[];
  }[] | null;
  inquiry_form_settings: {
    [key: string]: any;
  } | null;
  created_at: string;
  updated_at: string;
}

export type ProfileInsert = Omit<Profile, 'created_at' | 'updated_at'>;

// Inquiries
export interface Inquiry {
  id: string;
  title: string;
  content: string;
  customer_id: string;
  company_id: string;
  form_id: string | null;
  form_name: string | null;
  submission_id: string | null;
  status: 'new' | 'pending' | 'completed';
  priority: 'high' | 'medium' | 'low';
  assigned_to: string | null;
  geo_location: {
    address?: string;
    latitude?: number;
    longitude?: number;
  } | null;
  created_at: string;
  updated_at: string;
}

export type InquiryInsert = Omit<Inquiry, 'id' | 'created_at' | 'updated_at'>;

// Messages
export interface Message {
  id: string;
  inquiry_id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  has_attachments: boolean;
  channel: 'app' | 'email' | 'instagram';
  external_id: string | null;
  status: 'draft' | 'sent' | 'delivered' | 'read';
  created_at: string;
  updated_at: string;
}

export type MessageInsert = Omit<Message, 'id' | 'created_at' | 'updated_at'>;

// Message Attachments
export interface MessageAttachment {
  id: string;
  message_id: string;
  file_name: string;
  file_size: number;
  file_type: string;
  storage_path: string;
  created_at: string;
}

export type MessageAttachmentInsert = Omit<MessageAttachment, 'id' | 'created_at'>;

// Projects
export interface Project {
  id: string;
  title: string;
  description: string | null;
  inquiry_id: string | null;
  company_id: string;
  customer_id: string;
  manager_id: string | null;
  team_members: {
    id: string;
    name: string;
    role: string;
  }[] | null;
  status: 'planning' | 'active' | 'on-hold' | 'completed' | 'cancelled';
  start_date: string | null;
  target_completion_date: string | null;
  actual_completion_date: string | null;
  created_at: string;
  updated_at: string;
}

export type ProjectInsert = Omit<Project, 'id' | 'created_at' | 'updated_at'>;

// Project Documents
export interface ProjectDocument {
  id: string;
  project_id: string;
  uploader_id: string | null;
  title: string;
  description: string | null;
  storage_path: string;
  file_name: string;
  file_size: number;
  file_type: string;
  visibility: 'company' | 'customer' | 'both';
  created_at: string;
  updated_at: string;
}

export type ProjectDocumentInsert = Omit<ProjectDocument, 'id' | 'created_at' | 'updated_at'>;

// Project Milestones
export interface ProjectMilestone {
  id: string;
  project_id: string;
  title: string;
  description: string | null;
  status: 'pending' | 'in-progress' | 'completed' | 'delayed';
  target_date: string | null;
  completion_date: string | null;
  created_at: string;
  updated_at: string;
}

export type ProjectMilestoneInsert = Omit<ProjectMilestone, 'id' | 'created_at' | 'updated_at'>;

// Form Templates
export interface FormTemplate {
  id: string;
  name: string;
  description: string | null;
  company_id: string;
  fields: {
    id: string;
    type: string;
    label: string;
    required: boolean;
    placeholder?: string;
    options?: string[];
    validation?: any;
  }[];
  branding: {
    logo?: string;
    colors?: {
      primary?: string;
      secondary?: string;
      background?: string;
    };
  } | null;
  is_public: boolean;
  active: boolean;
  service_id: string | null;
  service_name: string | null;
  created_at: string;
  updated_at: string;
}

export type FormTemplateInsert = Omit<FormTemplate, 'id' | 'created_at' | 'updated_at'>;

// Form Submissions
export interface FormSubmission {
  id: string;
  form_id: string | null;
  company_id: string;
  customer_id: string | null;
  customer_email: string;
  customer_name: string | null;
  submission_data: {
    [key: string]: any;
  };
  status: 'new' | 'viewed' | 'processed';
  created_at: string;
}

export type FormSubmissionInsert = Omit<FormSubmission, 'id' | 'created_at'>;

// Geographic Data
export interface GeoData {
  id: string;
  reference_id: string;
  reference_type: 'inquiry' | 'project' | 'company' | 'customer';
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  postal_code: string | null;
  latitude: number | null;
  longitude: number | null;
  geocoded_at: string | null;
  created_at: string;
}

export type GeoDataInsert = Omit<GeoData, 'id' | 'created_at'>;

// Notifications
export interface Notification {
  id: string;
  recipient_id: string;
  title: string;
  content: string;
  type: 'inquiry' | 'message' | 'project' | 'system';
  reference_id: string | null;
  is_read: boolean;
  created_at: string;
}

export type NotificationInsert = Omit<Notification, 'id' | 'created_at'>;

// Utility type for checking database errors
export interface DatabaseError {
  code: string;
  details: string;
  hint: string;
  message: string;
}

// Auth related types
export interface AuthSession {
  provider_token?: string;
  provider_refresh_token?: string;
  access_token: string;
  refresh_token: string;
  expires_in: number;
  expires_at?: number;
  token_type: string;
  user: AuthUser;
}

export interface AuthUser {
  id: string;
  app_metadata: {
    provider?: string;
    [key: string]: any;
  };
  user_metadata: {
    [key: string]: any;
  };
  aud: string;
  confirmation_sent_at?: string;
  recovery_sent_at?: string;
  email_confirmed_at?: string;
  phone_confirmed_at?: string;
  last_sign_in_at?: string;
  role?: string;
  created_at: string;
  updated_at?: string;
  email?: string;
  phone?: string;
  confirmed_at?: string;
}

// Extended profile with joined data
export interface ExtendedProfile extends Profile {
  inquiries_count?: number;
  projects_count?: number;
  unread_messages_count?: number;
}

// Join types for queries
export interface InquiryWithCustomer extends Inquiry {
  customer: Profile;
}

export interface InquiryWithCompany extends Inquiry {
  company: Profile;
}

export interface MessageWithSender extends Message {
  sender: Profile;
}

export interface ProjectWithCustomer extends Project {
  customer: Profile;
}

export interface ProjectWithDocuments extends Project {
  documents: ProjectDocument[];
}

export interface ProjectWithMilestones extends Project {
  milestones: ProjectMilestone[];
}
