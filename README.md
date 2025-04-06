# Enquiry Management Application

A comprehensive portal-based application for managing enquiries between customers and companies. The application features both a Customer Portal and a Company Portal with synchronized data for enquiry management.

## Project Structure

The application is organized into the following main directories:

### `/src/components`

Contains all reusable UI components organized by category:

- `/analytics` - Charts and data visualization components
- `/auth` - Authentication-related components
- `/common` - Shared components used across both portals
- `/company` - Company Portal specific components
- `/customer` - Customer Portal specific components
- `/forms` - Form builder and management components
- `/kanban` - Kanban board for enquiry management
- `/layout` - Layout components like AppLayout
- `/navigation` - Navigation-related components
- `/ui` - Basic UI components from ShadCN

### `/src/pages`

Contains all main page components, prefixed by portal type:

- `Company*.tsx` - Company portal pages
- `Customer*.tsx` - Customer portal pages
- `Demo*.tsx` - Demo pages for showcasing features

### `/src/context`

Contains React contexts for state management:

- `AuthContext.tsx` - Authentication state management

### `/src/lib`

Contains utility libraries and services:

- `/supabase` - Supabase client and utility functions

## Development Guidelines

### Component Organization

- Keep UI modular and reusable within each portal
- Use consistent naming conventions for components
- Group related components in appropriately named directories
- Follow a consistent structure in component files:
  1. Imports
  2. Types/Interfaces
  3. Component definition
  4. Hooks and state
  5. Helper functions
  6. Return JSX

### Portal Separation

- Always specify which portal a component is designed for
- Keep portals visually and functionally separate
- Don't reuse navigation, layouts, or features across portals unless explicitly required
- The Enquiry Board is the only component that syncs between both portals

### UI Components

- Use ShadCN for UI components
- Follow ShadCN styles and structure for all UI elements
- Use the Container component for consistent page layout
- Use the AppLayout component for consistent portal layout

### Backend Integration

- Use Supabase for all backend operations
- Implement real-time updates where appropriate
- Add proper error handling for all API calls

## Maintenance

### Menu Structure

- The main menu is rendered via the `AppLayout` component
- Each portal has its own navigation items defined in:
  - `src/components/company/CompanyNavigationItems.tsx`
  - `src/components/customer/CustomerNavigationItems.tsx`
- To add new menu items, update the appropriate navigation items file

### Adding New Pages

1. Create a new page component in `/src/pages` with the appropriate prefix
2. Add the page to the router configuration
3. Add a navigation item if needed
4. Ensure the page uses the `AppLayout` component
5. Follow the established structure for page components

### Form Builder

The form builder functionality is provided via the FormBuilder component and related utilities. It allows:

- Creation of custom forms
- Managing form fields via drag-and-drop
- Integration of forms into websites
- Submission tracking and management

## Performance Considerations

- Use lazy loading for components when appropriate
- Implement pagination for large data sets
- Optimize Supabase queries
- Cache frequently accessed data

## Styling Guidelines

- Use Tailwind CSS for styling
- Follow the established color scheme
- Use the ShadCN component library for consistent UI
- Ensure responsive design for all components
- Dark mode support is built in via Tailwind's dark variants

## Project info

**URL**: https://lovable.dev/projects/6e0441b1-8713-43fc-a521-667fa8123e69

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/6e0441b1-8713-43fc-a521-667fa8123e69) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with .

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

This project is hosted on Vercel. You can access it through the custom domain set up in Vercel.

You can also deploy manually by:
1. Opening [Lovable](https://lovable.dev/projects/6e0441b1-8713-43fc-a521-667fa8123e69) and clicking on Share -> Publish.
2. Or deploying directly to Vercel through GitHub integration.

## I want to use a custom domain - is that possible?

The application is currently hosted on a custom domain via Vercel. 

If you want to deploy your project under a different domain, we recommend using Netlify. Visit our docs for more details: [Custom domains](https://docs.lovable.dev/tips-tricks/custom-domain/)

## Development Preview Mode

### Demo Portal - Sandbox for Potential Customers

The Demo Portal (/demo) is a sandbox environment designed for potential customers to explore the application's features before purchasing a license. It provides a comprehensive preview of both the Company Portal and Customer Portal interfaces with sample data.

Features:
- Complete UI demonstration with realistic sample data
- No authentication required
- Switch between Company and Customer portal views
- Navigate through all major features
- Safe for prospects to explore without affecting real data

To access the Demo Portal, visit:
- http://localhost:3000/demo

### Static Mode for Development

If you encounter React Router errors during development, you can use the `static=true` URL parameter to view static content without relying on React Router:

- http://localhost:3000/company/team?static=true 
- http://localhost:3000/company/customers?static=true

Most pages implement a static fallback that will render even if there are routing issues.

## File Structure Organization 📂

The app uses the following structure with icons for better navigation:

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

### Key Folder Icons

- 📁 `src/` - Application source code
- 📁 `components/` - Reusable UI components
- 📁 `pages/` - Page components
- 📁 `lib/` - Utility functions and libraries
- 📁 `database/` - Database scripts
- 📄 `.tsx` files - React components
- 📄 `.ts` files - TypeScript files
- 📄 `.sql` files - Database queries

### Portal-Specific Directories

- 🔵 `customer-portal/` - Customer portal components/pages
- 🟢 `company-portal/` - Company portal components/pages
