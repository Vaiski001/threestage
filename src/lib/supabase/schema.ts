/**
 * Supabase Database Schema for Threestage
 * 
 * This file defines the database schema for the dual-portal application.
 * It provides TypeScript types, table definitions, and initialization functions.
 */

import { supabase } from './client';

/**
 * Database schema definitions and types
 */

// Table names for type safety
export const TABLES = {
  profiles: 'profiles',
  companies: 'companies',
  customers: 'customers',
  projects: 'projects',
  project_milestones: 'project_milestones',
  inquiries: 'inquiries',
  messages: 'messages',
  notifications: 'notifications',
  attachments: 'attachments',
  forms: 'forms',
  form_submissions: 'form_submissions',
  invoice_templates: 'invoice_templates',
  invoices: 'invoices',
  payments: 'payments',
} as const;

export type TableNames = typeof TABLES[keyof typeof TABLES];

// User roles
export const USER_ROLES = {
  SUPER_ADMIN: 'super_admin',
  COMPANY_ADMIN: 'company_admin',
  COMPANY_STAFF: 'company_staff',
  CUSTOMER: 'customer',
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

// Inquiry status types
export const INQUIRY_STATUS = {
  NEW: 'new',
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export type InquiryStatus = typeof INQUIRY_STATUS[keyof typeof INQUIRY_STATUS];

// Project status types
export const PROJECT_STATUS = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  ON_HOLD: 'on_hold',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export type ProjectStatus = typeof PROJECT_STATUS[keyof typeof PROJECT_STATUS];

// Payment status types
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  OVERDUE: 'overdue',
  REFUNDED: 'refunded',
  CANCELLED: 'cancelled',
} as const;

export type PaymentStatus = typeof PAYMENT_STATUS[keyof typeof PAYMENT_STATUS];

// Message channel types
export const MESSAGE_CHANNEL = {
  APP: 'app',
  EMAIL: 'email',
  SMS: 'sms',
  INSTAGRAM: 'instagram',
  WHATSAPP: 'whatsapp',
} as const;

export type MessageChannel = typeof MESSAGE_CHANNEL[keyof typeof MESSAGE_CHANNEL];

// Notification types
export const NOTIFICATION_TYPE = {
  INQUIRY_CREATED: 'inquiry_created',
  INQUIRY_UPDATED: 'inquiry_updated',
  MESSAGE_RECEIVED: 'message_received',
  PROJECT_UPDATED: 'project_updated',
  MILESTONE_COMPLETED: 'milestone_completed',
  INVOICE_CREATED: 'invoice_created',
  PAYMENT_RECEIVED: 'payment_received',
} as const;

export type NotificationType = typeof NOTIFICATION_TYPE[keyof typeof NOTIFICATION_TYPE];

// Database types
export interface Profile {
  id: string;
  created_at: string;
  updated_at: string;
  email: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  role: UserRole;
  phone?: string;
  company_id?: string;
  customer_id?: string;
  last_seen_at?: string;
  is_active: boolean;
}

export interface Company {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  logo_url?: string;
  website?: string;
  address?: string;
  phone?: string;
  email?: string;
  tax_id?: string;
  payment_details?: string;
  settings?: Record<string, any>;
}

export interface Customer {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  company_name?: string;
  tax_id?: string;
  notes?: string;
  company_id: string;
}

export interface Project {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  description?: string;
  status: ProjectStatus;
  customer_id: string;
  company_id: string;
  assigned_to?: string;
  start_date?: string;
  end_date?: string;
  budget?: number;
  currency?: string;
  metadata?: Record<string, any>;
}

export interface ProjectMilestone {
  id: string;
  created_at: string;
  updated_at: string;
  project_id: string;
  title: string;
  description?: string;
  due_date?: string;
  completed_at?: string;
  is_completed: boolean;
  amount?: number;
  order: number;
}

export interface Inquiry {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  description?: string;
  status: InquiryStatus;
  customer_id: string;
  company_id: string;
  assigned_to?: string;
  last_message_at?: string;
  metadata?: Record<string, any>;
}

export interface Message {
  id: string;
  created_at: string;
  updated_at: string;
  inquiry_id: string;
  sender_id: string;
  content: string;
  channel: MessageChannel;
  is_read: boolean;
  metadata?: Record<string, any>;
  attachments?: string[];
}

export interface Notification {
  id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  is_read: boolean;
  reference_id?: string;
  reference_type?: string;
}

export interface Attachment {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  size: number;
  mime_type: string;
  storage_path: string;
  uploaded_by: string;
  reference_id?: string;
  reference_type?: string;
}

export interface Form {
  id: string;
  created_at: string;
  updated_at: string;
  company_id: string;
  title: string;
  fields: Record<string, any>[];
  is_active: boolean;
  metadata?: Record<string, any>;
}

export interface FormSubmission {
  id: string;
  created_at: string;
  updated_at: string;
  form_id: string;
  customer_id?: string;
  data: Record<string, any>;
  metadata?: Record<string, any>;
}

export interface InvoiceTemplate {
  id: string;
  created_at: string;
  updated_at: string;
  company_id: string;
  name: string;
  template: string;
  is_default: boolean;
}

export interface Invoice {
  id: string;
  created_at: string;
  updated_at: string;
  number: string;
  company_id: string;
  customer_id: string;
  project_id?: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  issue_date: string;
  due_date: string;
  paid_date?: string;
  items: Record<string, any>[];
  notes?: string;
  template_id?: string;
}

export interface Payment {
  id: string;
  created_at: string;
  updated_at: string;
  invoice_id: string;
  amount: number;
  currency: string;
  method: string;
  status: PaymentStatus;
  transaction_id?: string;
  payment_date: string;
  metadata?: Record<string, any>;
}

// Type mapping for database tables
export interface DatabaseSchema {
  [TABLES.profiles]: Profile;
  [TABLES.companies]: Company;
  [TABLES.customers]: Customer;
  [TABLES.projects]: Project;
  [TABLES.project_milestones]: ProjectMilestone;
  [TABLES.inquiries]: Inquiry;
  [TABLES.messages]: Message;
  [TABLES.notifications]: Notification;
  [TABLES.attachments]: Attachment;
  [TABLES.forms]: Form;
  [TABLES.form_submissions]: FormSubmission;
  [TABLES.invoice_templates]: InvoiceTemplate;
  [TABLES.invoices]: Invoice;
  [TABLES.payments]: Payment;
}

/**
 * Database Tables
 * 
 * These tables form the core of the application's data model:
 * 
 * 1. profiles - User profiles for both customer and company users
 * 2. inquiries - Customer inquiries submitted to companies
 * 3. messages - Messages exchanged between customers and companies
 * 4. projects - Projects created from inquiries
 * 5. form_templates - Custom inquiry form templates
 * 6. form_submissions - Submissions from custom inquiry forms
 * 7. project_documents - Documents associated with projects
 * 8. project_milestones - Milestones for project progress tracking
 * 9. geo_data - Geographic data for the map visualization
 */

// Define the SQL statements for each table
const tableDefinitions = {
  // User profiles table with role-based access
  profiles: `
    CREATE TABLE IF NOT EXISTS profiles (
      id UUID REFERENCES auth.users ON DELETE CASCADE,
      email TEXT UNIQUE NOT NULL,
      role TEXT NOT NULL CHECK (role IN ('customer', 'company')),
      name TEXT NOT NULL,
      company_name TEXT,
      phone TEXT,
      industry TEXT,
      website TEXT,
      integrations JSONB,
      profile_banner TEXT,
      profile_logo TEXT,
      profile_description TEXT,
      profile_color_scheme TEXT,
      profile_social_links JSONB,
      profile_contact_info JSONB,
      profile_featured_images JSONB,
      profile_services_json TEXT,
      profile_services JSONB,
      inquiry_form_enabled BOOLEAN DEFAULT false,
      inquiry_form_fields JSONB,
      inquiry_form_settings JSONB,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id)
    );
    
    -- Set up Row Level Security (RLS) for profiles
    ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
    
    -- Policy: Users can view their own profile
    CREATE POLICY "Users can view their own profile"
      ON profiles FOR SELECT
      USING (auth.uid() = id);
    
    -- Policy: Users can update their own profile
    CREATE POLICY "Users can update their own profile"
      ON profiles FOR UPDATE
      USING (auth.uid() = id);
    
    -- Policy: Companies can view customer profiles if they have inquiries from them
    CREATE POLICY "Companies can view customer profiles with inquiries"
      ON profiles FOR SELECT
      USING (
        auth.uid() IN (
          SELECT company_id FROM inquiries WHERE customer_id = profiles.id
        )
      );
  `,
  
  // Inquiries table for customer submissions
  inquiries: `
    CREATE TABLE IF NOT EXISTS inquiries (
      id UUID DEFAULT uuid_generate_v4(),
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      customer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
      company_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
      form_id UUID REFERENCES form_templates(id) ON DELETE SET NULL,
      form_name TEXT,
      submission_id UUID REFERENCES form_submissions(id) ON DELETE SET NULL,
      status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'pending', 'completed')),
      priority TEXT DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
      assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
      geo_location JSONB,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id)
    );
    
    -- Set up RLS for inquiries
    ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
    
    -- Policy: Companies can view inquiries addressed to them
    CREATE POLICY "Companies can view their inquiries"
      ON inquiries FOR SELECT
      USING (auth.uid() = company_id);
    
    -- Policy: Companies can update inquiries addressed to them
    CREATE POLICY "Companies can update their inquiries"
      ON inquiries FOR UPDATE
      USING (auth.uid() = company_id);
    
    -- Policy: Customers can view their own inquiries
    CREATE POLICY "Customers can view their own inquiries"
      ON inquiries FOR SELECT
      USING (auth.uid() = customer_id);
    
    -- Policy: Customers can create inquiries
    CREATE POLICY "Customers can create inquiries"
      ON inquiries FOR INSERT
      WITH CHECK (auth.uid() = customer_id);
  `,
  
  // Messages table for communication
  messages: `
    CREATE TABLE IF NOT EXISTS messages (
      id UUID DEFAULT uuid_generate_v4(),
      inquiry_id UUID REFERENCES inquiries(id) ON DELETE CASCADE,
      sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
      receiver_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
      content TEXT NOT NULL,
      has_attachments BOOLEAN DEFAULT false,
      channel TEXT NOT NULL DEFAULT 'app' CHECK (channel IN ('app', 'email', 'instagram')),
      external_id TEXT,
      status TEXT NOT NULL DEFAULT 'sent' CHECK (status IN ('draft', 'sent', 'delivered', 'read')),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id)
    );
    
    -- Set up RLS for messages
    ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
    
    -- Policy: Users can view messages they've sent or received
    CREATE POLICY "Users can view their messages"
      ON messages FOR SELECT
      USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
    
    -- Policy: Users can create messages they're sending
    CREATE POLICY "Users can create messages"
      ON messages FOR INSERT
      WITH CHECK (auth.uid() = sender_id);
    
    -- Policy: Users can update messages they've sent
    CREATE POLICY "Users can update their sent messages"
      ON messages FOR UPDATE
      USING (auth.uid() = sender_id);
  `,
  
  // Message attachments table
  message_attachments: `
    CREATE TABLE IF NOT EXISTS message_attachments (
      id UUID DEFAULT uuid_generate_v4(),
      message_id UUID REFERENCES messages(id) ON DELETE CASCADE,
      file_name TEXT NOT NULL,
      file_size INTEGER NOT NULL,
      file_type TEXT NOT NULL,
      storage_path TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id)
    );
    
    -- Set up RLS for message attachments
    ALTER TABLE message_attachments ENABLE ROW LEVEL SECURITY;
    
    -- Policy: Users can view attachments for messages they can see
    CREATE POLICY "Users can view attachments for their messages"
      ON message_attachments FOR SELECT
      USING (
        message_id IN (
          SELECT id FROM messages 
          WHERE sender_id = auth.uid() OR receiver_id = auth.uid()
        )
      );
  `,
  
  // Projects table for project management
  projects: `
    CREATE TABLE IF NOT EXISTS projects (
      id UUID DEFAULT uuid_generate_v4(),
      title TEXT NOT NULL,
      description TEXT,
      inquiry_id UUID REFERENCES inquiries(id) ON DELETE SET NULL,
      company_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
      customer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
      manager_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
      team_members JSONB,
      status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('planning', 'active', 'on-hold', 'completed', 'cancelled')),
      start_date TIMESTAMP WITH TIME ZONE,
      target_completion_date TIMESTAMP WITH TIME ZONE,
      actual_completion_date TIMESTAMP WITH TIME ZONE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id)
    );
    
    -- Set up RLS for projects
    ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
    
    -- Policy: Companies can view their projects
    CREATE POLICY "Companies can view their projects"
      ON projects FOR SELECT
      USING (auth.uid() = company_id);
    
    -- Policy: Companies can create projects
    CREATE POLICY "Companies can create projects"
      ON projects FOR INSERT
      WITH CHECK (auth.uid() = company_id);
    
    -- Policy: Companies can update their projects
    CREATE POLICY "Companies can update their projects"
      ON projects FOR UPDATE
      USING (auth.uid() = company_id);
    
    -- Policy: Customers can view projects they're part of
    CREATE POLICY "Customers can view their projects"
      ON projects FOR SELECT
      USING (auth.uid() = customer_id);
  `,
  
  // Project documents table
  project_documents: `
    CREATE TABLE IF NOT EXISTS project_documents (
      id UUID DEFAULT uuid_generate_v4(),
      project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
      uploader_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
      title TEXT NOT NULL,
      description TEXT,
      storage_path TEXT NOT NULL,
      file_name TEXT NOT NULL,
      file_size INTEGER NOT NULL,
      file_type TEXT NOT NULL,
      visibility TEXT NOT NULL DEFAULT 'company' CHECK (visibility IN ('company', 'customer', 'both')),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id)
    );
    
    -- Set up RLS for project documents
    ALTER TABLE project_documents ENABLE ROW LEVEL SECURITY;
    
    -- Policy: Companies can view all project documents for their projects
    CREATE POLICY "Companies can view all project documents"
      ON project_documents FOR SELECT
      USING (
        project_id IN (
          SELECT id FROM projects WHERE company_id = auth.uid()
        )
      );
    
    -- Policy: Customers can view documents shared with them
    CREATE POLICY "Customers can view documents shared with them"
      ON project_documents FOR SELECT
      USING (
        (visibility = 'customer' OR visibility = 'both') AND
        project_id IN (
          SELECT id FROM projects WHERE customer_id = auth.uid()
        )
      );
    
    -- Policy: Companies can create documents for their projects
    CREATE POLICY "Companies can create project documents"
      ON project_documents FOR INSERT
      WITH CHECK (
        project_id IN (
          SELECT id FROM projects WHERE company_id = auth.uid()
        )
      );
  `,
  
  // Project milestones table
  project_milestones: `
    CREATE TABLE IF NOT EXISTS project_milestones (
      id UUID DEFAULT uuid_generate_v4(),
      project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      description TEXT,
      status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in-progress', 'completed', 'delayed')),
      target_date TIMESTAMP WITH TIME ZONE,
      completion_date TIMESTAMP WITH TIME ZONE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id)
    );
    
    -- Set up RLS for project milestones
    ALTER TABLE project_milestones ENABLE ROW LEVEL SECURITY;
    
    -- Policy: Companies can view all project milestones
    CREATE POLICY "Companies can view project milestones"
      ON project_milestones FOR SELECT
      USING (
        project_id IN (
          SELECT id FROM projects WHERE company_id = auth.uid()
        )
      );
    
    -- Policy: Companies can create and update project milestones
    CREATE POLICY "Companies can manage project milestones"
      ON project_milestones FOR ALL
      USING (
        project_id IN (
          SELECT id FROM projects WHERE company_id = auth.uid()
        )
      );
    
    -- Policy: Customers can view project milestones
    CREATE POLICY "Customers can view project milestones"
      ON project_milestones FOR SELECT
      USING (
        project_id IN (
          SELECT id FROM projects WHERE customer_id = auth.uid()
        )
      );
  `,
  
  // Form templates table
  form_templates: `
    CREATE TABLE IF NOT EXISTS form_templates (
      id UUID DEFAULT uuid_generate_v4(),
      name TEXT NOT NULL,
      description TEXT,
      company_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
      fields JSONB NOT NULL,
      branding JSONB,
      is_public BOOLEAN DEFAULT false,
      active BOOLEAN DEFAULT true,
      service_id TEXT,
      service_name TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id)
    );
    
    -- Set up RLS for form templates
    ALTER TABLE form_templates ENABLE ROW LEVEL SECURITY;
    
    -- Policy: Companies can view, create, and update their form templates
    CREATE POLICY "Companies can manage their form templates"
      ON form_templates FOR ALL
      USING (auth.uid() = company_id);
    
    -- Policy: Public forms are visible to all authenticated users
    CREATE POLICY "Public forms are visible to all authenticated users"
      ON form_templates FOR SELECT
      USING (is_public = true);
  `,
  
  // Form submissions table
  form_submissions: `
    CREATE TABLE IF NOT EXISTS form_submissions (
      id UUID DEFAULT uuid_generate_v4(),
      form_id UUID REFERENCES form_templates(id) ON DELETE SET NULL,
      company_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
      customer_id UUID REFERENCES profiles(id),
      customer_email TEXT NOT NULL,
      customer_name TEXT,
      submission_data JSONB NOT NULL,
      status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'viewed', 'processed')),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id)
    );
    
    -- Set up RLS for form submissions
    ALTER TABLE form_submissions ENABLE ROW LEVEL SECURITY;
    
    -- Policy: Companies can view submissions for their forms
    CREATE POLICY "Companies can view their form submissions"
      ON form_submissions FOR SELECT
      USING (auth.uid() = company_id);
    
    -- Policy: Customers can view their own submissions
    CREATE POLICY "Customers can view their own submissions"
      ON form_submissions FOR SELECT
      USING (
        auth.uid() = customer_id OR 
        customer_email = (SELECT email FROM profiles WHERE id = auth.uid())
      );
    
    -- Policy: Anyone can create form submissions
    CREATE POLICY "Anyone can create form submissions"
      ON form_submissions FOR INSERT
      WITH CHECK (true);
  `,
  
  // Geographic data table
  geo_data: `
    CREATE TABLE IF NOT EXISTS geo_data (
      id UUID DEFAULT uuid_generate_v4(),
      reference_id UUID NOT NULL,
      reference_type TEXT NOT NULL CHECK (reference_type IN ('inquiry', 'project', 'company', 'customer')),
      address TEXT,
      city TEXT,
      state TEXT,
      country TEXT,
      postal_code TEXT,
      latitude DOUBLE PRECISION,
      longitude DOUBLE PRECISION,
      geocoded_at TIMESTAMP WITH TIME ZONE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id)
    );
    
    -- Set up RLS for geo_data
    ALTER TABLE geo_data ENABLE ROW LEVEL SECURITY;
    
    -- Policy: Companies can view geo data related to their inquiries
    CREATE POLICY "Companies can view related geo data"
      ON geo_data FOR SELECT
      USING (
        (reference_type = 'inquiry' AND reference_id IN (SELECT id FROM inquiries WHERE company_id = auth.uid())) OR
        (reference_type = 'project' AND reference_id IN (SELECT id FROM projects WHERE company_id = auth.uid())) OR
        (reference_type = 'company' AND reference_id = auth.uid())
      );
    
    -- Policy: Customers can view their own geo data
    CREATE POLICY "Customers can view their own geo data"
      ON geo_data FOR SELECT
      USING (
        (reference_type = 'customer' AND reference_id = auth.uid()) OR
        (reference_type = 'inquiry' AND reference_id IN (SELECT id FROM inquiries WHERE customer_id = auth.uid())) OR
        (reference_type = 'project' AND reference_id IN (SELECT id FROM projects WHERE customer_id = auth.uid()))
      );
  `,
  
  // Notifications table
  notifications: `
    CREATE TABLE IF NOT EXISTS notifications (
      id UUID DEFAULT uuid_generate_v4(),
      recipient_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      type TEXT NOT NULL CHECK (type IN ('inquiry', 'message', 'project', 'system')),
      reference_id UUID,
      is_read BOOLEAN DEFAULT false,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id)
    );
    
    -- Set up RLS for notifications
    ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
    
    -- Policy: Users can view their own notifications
    CREATE POLICY "Users can view their own notifications"
      ON notifications FOR SELECT
      USING (auth.uid() = recipient_id);
    
    -- Policy: Users can update their own notifications (marking as read)
    CREATE POLICY "Users can update their own notifications"
      ON notifications FOR UPDATE
      USING (auth.uid() = recipient_id);
  `
};

/**
 * Function to create a single table in Supabase
 */
export const createTable = async (tableName: string): Promise<boolean> => {
  try {
    if (!tableName || !tableDefinitions[tableName as keyof typeof tableDefinitions]) {
      console.error(`Table definition not found for: ${tableName}`);
      return false;
    }

    console.log(`Creating/verifying table: ${tableName}`);
    
    // Since we can't execute raw SQL directly from the client side,
    // we'll create a Supabase Function or use a serverless function
    // For now, we'll use the Supabase client to check if the table exists
    
    const { error } = await supabase
      .from(tableName)
      .select('*')
      .limit(1);
    
    if (error && error.code === '42P01') {
      // Table doesn't exist - would need server-side implementation to create it
      console.error(`Table ${tableName} doesn't exist and can't be created from client side`);
      console.info(`SQL for ${tableName}:`, tableDefinitions[tableName as keyof typeof tableDefinitions]);
      return false;
    } else if (error) {
      console.error(`Error checking table ${tableName}:`, error);
      return false;
    }
    
    console.log(`Table ${tableName} exists`);
    return true;
  } catch (error) {
    console.error(`Error creating table ${tableName}:`, error);
    return false;
  }
};

/**
 * Function to ensure all tables exist in the database
 */
export const ensureTablesExist = async (): Promise<boolean> => {
  try {
    console.log("Ensuring all database tables exist");
    
    // Array of all table names to create
    const allTables = Object.values(TABLES);
    
    // Check each table
    const results = await Promise.all(
      allTables.map(async (tableName) => {
        return await createTable(tableName);
      })
    );
    
    // All tables were successfully verified/created if all results are true
    const allTablesExist = results.every(result => result === true);
    
    if (allTablesExist) {
      console.log("All database tables exist");
    } else {
      console.warn("Some tables could not be verified or created");
    }
    
    return allTablesExist;
  } catch (error) {
    console.error("Error ensuring tables exist:", error);
    return false;
  }
};

/**
 * Function to get the SQL for a specific table 
 * (for admin or server-side setup)
 */
export const getTableSQL = (tableName: string): string => {
  return tableDefinitions[tableName as keyof typeof tableDefinitions] || '';
};

/**
 * Export SQL scripts for all tables
 * (for admin or server-side setup)
 */
export const getAllTableSQL = (): Record<string, string> => {
  return tableDefinitions;
};

// Export SQL setup as a single string
export const getFullDatabaseSQL = (): string => {
  const allTablesArray = Object.values(tableDefinitions);
  return allTablesArray.join('\n\n');
}; 