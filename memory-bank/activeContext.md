# Active Context - Threestage

## Current Work Focus

### Dual Portal Development
Both the Customer Portal and Company Portal are being actively developed with a focus on clear separation of concerns. The application routes are structured to separate these concerns clearly, as seen in the router configuration. The current focus is on ensuring these portals operate independently while sharing necessary data and components.

### Authentication Implementation
Role-based authentication is implemented using Supabase Auth with 'customer' and 'company' roles, and the custom `AuthProvider` context. The `RoleRouter` component ensures users are directed to the appropriate portal based on their assigned role. Both email/password authentication and social authentication options (Google, GitHub) are being implemented alongside email verification and password reset functionality.

### Message Channel Integration
API integrations for communication channels (email, Instagram) are being developed as part of the unified messaging system. These integrations need to ensure proper authentication, message routing, and consistent user experience across channels. A centralized inbox showing all messages regardless of source is a key development priority.

### Project Management System
The development of the Projects Management feature is underway, allowing structured organization of work related to inquiries. This includes project creation, stage tracking, team assignment, and document management with appropriate visibility controls between portals.

### Geographic Visualization
Implementation of map visualization and geocoding features is in progress, using Mapbox for interactive mapping and geocoding services for address processing. Custom markers, clustering, and filtering capabilities are being developed to provide geographic insights into inquiries.

## Recent Changes

### Package Updates
Recent work included updating npm packages to resolve security vulnerabilities. The project now uses the latest versions of:
- esbuild
- vite
- @vitejs/plugin-react-swc
- React 18
- React Query
- React Hook Form with Zod
- Supabase SDK
- Mapbox GL JS
- Recharts

### Database Schema Enhancement
The database schema has been expanded to include new tables for:
- Projects management
- Custom forms
- Geographic data
- Analytics tracking

## Next Steps

### Short-term Tasks
1. Complete customer inquiry submission workflow with custom form support
2. Implement real-time notifications for new messages across channels
3. Finalize company-side unified inbox for message management
4. Complete the interactive map component for the company portal
5. Develop the custom form builder interface

### Medium-term Goals
1. Develop comprehensive analytics dashboard with Recharts
2. Implement attachment handling for messages and projects
3. Complete the Kanban board for project and inquiry management
4. Create customer satisfaction feedback mechanism
5. Implement address geocoding with background processing

### Long-term Vision
1. Expand supported communication channels
2. Implement AI-assisted inquiry categorization
3. Develop advanced reporting and business intelligence features
4. Create mobile application versions of both portals
5. Implement advanced offline support with data synchronization

## Active Decisions and Considerations

### Technical Decisions
- **State Management**: Currently using a combination of React Context, React Query, and Supabase Realtime. Evaluating if additional state management is needed for complex workflows.
- **API Structure**: Determining the optimal structure for external API integrations to ensure consistency and maintainability.
- **Performance Optimization**: Identifying areas for performance improvements, particularly in map rendering and message loading.

### UX Considerations
- **Portal Distinction**: Ensuring clear visual and functional separation between customer and company portals.
- **Messaging Interface**: Creating intuitive interfaces that handle different message formats consistently.
- **Map Interface**: Developing a user-friendly map interface that effectively visualizes geographic data.
- **Form Builder UX**: Creating an intuitive drag-and-drop interface for custom form creation.

### Development Process
- **Component Reuse**: Identifying opportunities for component sharing between portals without creating dependencies.
- **Testing Strategy**: Implementing comprehensive testing for critical flows.
- **Documentation**: Maintaining up-to-date documentation for API integrations and component usage. 