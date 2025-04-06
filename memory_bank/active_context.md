# Active Context - Enquiry Management App

## Current Focus Areas
- **Enquiry Management Flow**: Implementation of the Kanban board for visualizing and managing enquiries
- **Form Builder**: Development of the form builder for companies to create custom enquiry forms
- **Messaging Integration**: Integration of multiple communication channels (email, chat, inbox)

## Recently Updated Components
- `src/components/kanban/KanbanBoard.tsx`: Main component for the Kanban board interface
- `src/pages/CompanyDashboard.tsx`: Dashboard for company users
- `src/pages/CustomerDashboard.tsx`: Dashboard for customer users
- `src/pages/Enquiries.tsx`: Page for managing enquiries for both user types

## Current Development Status
- Basic authentication flow is implemented
- Core UI components are in place
- Kanban board for enquiry management is functional
- Form builder is implemented
- Messaging channels are set up for both portals
- Profile management and settings pages are developed

## Pending Features
- Real-time notifications for new enquiries and status changes
- Advanced filtering and search for enquiries
- File attachments for enquiries
- Analytics dashboard improvements
- Mobile responsiveness enhancements

## Integration Status
- Supabase authentication: Implemented
- Supabase database: Implemented
- External messaging APIs: In progress
- Storage for file uploads: SQL fixes being applied (based on SQL files in root)

## Known Issues
- Storage permissions need fixes (based on SQL files in root directory)
- Profile patch functionality needs improvement (based on SQL files)

## Development Environment
- Frontend: React with TypeScript
- Backend: Supabase
- Styling: Tailwind CSS with ShadCN components
- Build Tool: Vite 
- Hosting: Vercel