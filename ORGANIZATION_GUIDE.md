# Enquiry Management App Organization Guide 📂

This guide outlines the file and code structure for our dual-portal application.

## Folder Structure Overview

```
📦 enquiry-management-app/
├── 📁 src/                           # Main application code
│   ├── 📁 app/                       # App-level configuration
│   ├── 📄 App.tsx                    # Main application component
│   ├── 📄 main.tsx                   # Application entry point
│   ├── 📁 components/                # Shared components
│   │   ├── 📁 ui/                    # UI components (buttons, inputs, etc)
│   │   ├── 📁 customer-portal/       # Customer portal specific components
│   │   └── 📁 company-portal/        # Company portal specific components
│   ├── 📁 context/                   # React context providers
│   ├── 📁 hooks/                     # Custom React hooks
│   ├── 📁 lib/                       # Utility functions and libraries
│   │   ├── 📁 api/                   # API integration functions
│   │   ├── 📁 supabase/              # Supabase client and helpers
│   │   └── 📁 utils/                 # General utility functions
│   ├── 📁 pages/                     # Page components
│   │   ├── 📁 customer/              # Customer portal pages
│   │   └── 📁 company/               # Company portal pages
│   ├── 📁 routes/                    # Routing configuration
│   └── 📁 types/                     # TypeScript type definitions
├── 📁 public/                        # Static assets
├── 📁 database/                      # Database scripts and migrations
│   ├── 📄 schema.sql                 # Complete database schema
│   ├── 📁 migrations/                # Individual migration files
│   └── 📁 functions/                 # Database functions
├── 📁 config/                        # Configuration files
├── 📄 package.json                   # Project dependencies
├── 📄 tsconfig.json                  # TypeScript configuration
└── 📄 vite.config.ts                 # Vite configuration
```

## Portal Separation

This application has two distinct portals:

- 🔵 **Customer Portal**: User-facing interface for customer inquiries and communications
- 🟢 **Company Portal**: Admin interface for handling inquiries and managing business operations

Components and pages must be organized by their respective portal to maintain clear separation.

## File Naming Conventions

- `.tsx` files: React components with JSX
- `.ts` files: TypeScript utilities, types, hooks, etc.
- `.css`, `.scss`: Styling files
- `.sql`: Database scripts, migrations, etc.
- `.md`: Documentation files

## Component Organization

### UI Components

Common UI components used by both portals should be in `src/components/ui/`. These include:

- Buttons
- Forms
- Inputs
- Modals
- Cards
- Tables

### Portal-Specific Components

Components exclusive to a specific portal should be in their respective folders:

- Customer-specific: `src/components/customer-portal/`
- Company-specific: `src/components/company-portal/`

## API and Data Integration

API integration should be organized in `src/lib/api/` with appropriate separation for:

- External API clients (Instagram, email, etc.)
- API utilities and helpers
- Webhook handlers

## Database Scripts

All database scripts have been organized into:

- `database/schema.sql`: Complete database schema
- `database/migrations/`: Individual migration files
- `database/functions/`: Database functions

Do not add new SQL files to the root directory.

## Configuration Files

All configuration files should be placed in the `config/` directory or at the root level if they are standard tool configs (like `tsconfig.json`).

## Deprecated Files

The following files have been deprecated and consolidated:

- All SQL files in the root directory (consolidated into `database/schema.sql`)
- Multiple storage-related SQL scripts (now in `database/migrations/`)

## Best Practices

1. Always place new components in the appropriate portal folder
2. Keep SQL scripts in the database directory
3. Maintain separation between customer and company portal logic
4. Update this guide when making structural changes 