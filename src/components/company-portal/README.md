# Company Portal Components 🟢

This directory contains components specific to the Company Portal of the Enquiry Management App.

## Purpose

Components in this directory should only be used within the Company Portal. These components represent admin-facing features for company users to manage inquiries, customer communications, team settings, and business operations.

## Guidelines

1. Only place company-specific components here
2. Components should follow the naming convention: `ComponentName.tsx`
3. Each component should have its own directory if it contains multiple files
4. Use ShadCN UI components and Tailwind CSS for styling
5. Reuse common UI components from `src/components/ui/`

## Integration with Company Pages

Components in this directory are typically used by pages in `src/pages/company/`.

## Examples of Company Portal Components

- Company profile management forms
- Inquiry management interfaces
- Customer management tables
- Team management components
- Analytics and reporting widgets
- Messaging interface components

## API Integration

When integrating with APIs:
- Use the functions in `src/lib/api/` 
- Handle company-specific permissions and authentication
- Keep all API integration code separate from the customer portal

## Important Note

Do not mix company and customer portal components. If a component is used in both portals, it should be placed in a shared directory like `src/components/ui/`. 