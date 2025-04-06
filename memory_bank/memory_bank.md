# Memory Bank for Enquiry Management Application

## Project Overview
This is a dual-portal web application consisting of:
- **Customer Portal**: For customers to create and manage enquiries
- **Company Portal**: For companies to manage customer enquiries and their business profile

## Tech Stack
- **Frontend Framework**: React with TypeScript
- **Styling**: Tailwind CSS with ShadCN components
- **Backend**: Supabase (Authentication, Database, Storage)
- **Build Tool**: Vite
- **Hosting**: Vercel

## Core Workflows

### Authentication Flow
- User roles: 'customer' or 'company'
- Login/Signup pages with role-specific dashboards
- Profile management for both customer and company users

### Enquiry Management Workflow
- Enquiries follow a status progression: New → Pending → Completed
- Priority levels: high, medium, low
- Kanban board interface for visualizing and managing enquiries
- Company users can view all enquiries directed to their company
- Customer users can view their submitted enquiries

### Messaging Channels
- Multiple communication channels integrated:
  - Email messaging
  - Chat messaging
  - Inbox messaging
- Different interfaces for company and customer users

### Form Management
- Companies can create custom enquiry forms
- Form builder with various field types
- Forms can be associated with specific services

## Key Data Structures

### User Profile
```typescript
interface UserProfile {
  id: string;
  email: string;
  role: 'customer' | 'company';
  name: string;
  company_name?: string;
  phone?: string;
  industry?: string;
  website?: string;
  integrations?: string[];
  created_at: string;
  
  // Company profile customization fields
  profile_banner?: string;
  profile_logo?: string;
  profile_description?: string;
  profile_color_scheme?: string;
  profile_social_links?: object;
  profile_contact_info?: object;
  profile_featured_images?: string[];
  profile_services?: Array<object>;
  
  // Inquiry form settings
  inquiry_form_enabled?: boolean;
  inquiry_form_fields?: object[];
  inquiry_form_settings?: object;
}
```

### Enquiry
```typescript
interface Enquiry {
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
```

### Form Template
```typescript
interface FormTemplate {
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
```

## UI Components Organization
- `/components/ui`: Reusable UI components (buttons, forms, etc.)
- `/components/customer`: Customer-specific components
- `/components/company`: Company-specific components
- `/components/common`: Shared components
- `/components/kanban`: Kanban board for enquiry management
- `/components/layout`: Layout components
- `/components/forms`: Form-related components

## Pages Structure
- Customer portal pages:
  - Dashboard
  - Profile
  - Settings
  - Support
  - Messaging (Email, Chat, Inbox)
  - Billing
  - Notifications
  
- Company portal pages:
  - Dashboard
  - Customers management
  - Team management
  - Profile
  - Settings
  - Reports
  - Payments/Invoices
  - Messaging (Email, Chat, Inbox)
  - Support
  - Notifications

## API Integrations
The application includes integrations with external communication APIs for:
- Email messaging
- Chat services
- Social media platforms (Instagram mentioned in custom instructions)

## Active Context Progress
- The enquiry management workflow is implemented with a Kanban board
- Forms can be created and customized via the FormBuilder
- Both Customer and Company portals have separate dashboards and specialized features
- External API integrations for messaging channels are implemented 