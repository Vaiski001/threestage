# Customer Portal Components 🔵

This directory contains components specific to the Customer Portal of the Enquiry Management App.

## Purpose

Components in this directory should only be used within the Customer Portal. These components represent user-facing features for customers to manage their inquiries, messages, and account settings.

## Guidelines

1. Only place customer-specific components here
2. Components should follow the naming convention: `ComponentName.tsx`
3. Each component should have its own directory if it contains multiple files
4. Use ShadCN UI components and Tailwind CSS for styling
5. Reuse common UI components from `src/components/ui/`

## Integration with Customer Pages

Components in this directory are typically used by pages in `src/pages/customer/`.

## Examples of Customer Portal Components

- Customer profile forms
- Customer inquiry submission forms
- Customer messaging interfaces
- Customer notification components
- Customer dashboard widgets

## API Integration

When integrating with APIs:
- Use the functions in `src/lib/api/` 
- Handle customer-specific permissions and authentication
- Keep all API integration code separate from the company portal

## Important Note

Do not mix customer and company portal components. If a component is used in both portals, it should be placed in a shared directory like `src/components/ui/`. 