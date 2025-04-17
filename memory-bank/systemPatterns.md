# System Patterns - Threestage

## System Architecture

### Frontend Architecture
The Threestage application follows a component-based architecture using React with TypeScript. The application is structured using the following patterns:

- **Atomic Design Methodology**: Components are organized as atoms, molecules, organisms, templates, and pages
- **Container/Presentation Pattern**: Logic is separated from presentation components
- **Context API**: Used for state management across components
- **Custom Hooks**: Encapsulate reusable logic
- **Route-Based Code Splitting**: Components are loaded on demand

### Backend Integration
The application integrates with Supabase for backend services:

- **Authentication**: User management and role-based access control
- **Database**: Structured data storage for inquiries, messages, projects, and user data
- **Real-time Subscriptions**: For immediate updates on changes
- **Storage**: For attachments and media files
- **Row-Level Security**: For data protection and access control

### API Structure
External service integrations follow a consistent pattern:

- **Adapter Pattern**: Uniform interface for different communication channels
- **Repository Pattern**: Data access abstraction
- **Service Layer**: Business logic implementation
- **Message Channel Integration**: Unified messaging across platforms

## Component Relationships

### Portal Separation
The dual-portal system is strictly separated to prevent mixing of concerns:

- **Customer Portal**: Self-contained components and routes
- **Company Portal**: Independent components and routes
- **Shared Components**: Utility components and UI elements used by both portals

### Workflow Integration
The inquiry workflow integrates with both portals:

- **Status Tracking**: Shared status definitions but separate views
- **Messaging**: Unified message storage with portal-specific interfaces
- **Notifications**: Common notification system with portal-specific delivery
- **Project Management**: Linked to inquiries with appropriate visibility controls

### Geocoding Architecture
The geographic visualization components follow a specific pattern:

- **Map Context Provider**: Provides map state and functions to child components
- **Marker Management**: Custom markers with clustering capabilities
- **Geocoding Service**: Address to coordinate conversion with caching
- **Filter System**: Location-based and attribute-based filtering

## Design Patterns

### State Management
- **Context Providers**: Auth, Theme, Notifications, Map
- **Query Management**: React Query for data fetching and caching
- **Form State**: React Hook Form for form handling with Zod validation
- **Real-time Synchronization**: Supabase Realtime subscriptions

### UI Patterns
- **Component Composition**: Building complex interfaces from simpler components
- **Render Props**: For flexible component rendering
- **Controlled Components**: For form elements
- **Portals**: For modals and overlays
- **Drag-and-Drop**: For form builder and Kanban boards

### Code Organization
- **Feature-Based Structure**: Code organized by feature rather than type
- **Barrel Files**: Index files for cleaner imports
- **Consistent Naming**: Predictable naming conventions
- **Type-First Development**: TypeScript interfaces defined before implementation

## Technical Decisions

### Routing Strategy
- **React Router**: For client-side routing
- **Protected Routes**: For authentication-required routes
- **Role-Based Routing**: Different routes based on user roles

### State Strategy
- **Local State**: For component-specific state
- **Context API**: For shared state across components
- **React Query**: For server state with optimistic updates
- **Local Storage**: For persistent user preferences
- **Supabase Realtime**: For real-time data synchronization

### Error Handling
- **Boundary Components**: Error boundaries for component-level errors
- **Toast Notifications**: For user-facing error messages
- **Structured Error Responses**: For API errors
- **Fallback UI**: For degraded functionality when components fail

### Performance Optimizations
- **Memoization**: React.memo, useMemo, useCallback
- **Virtualization**: For long lists
- **Lazy Loading**: For route-based code splitting
- **Image Optimization**: For media assets
- **Efficient API Calls**: Batching and caching
- **Background Processing**: For resource-intensive operations

### CI/CD Architecture
- **Vercel Integration**: For automated deployments
- **Environment Separation**: Development, staging, and production
- **Preview Deployments**: For pull request review
- **Automated Testing**: In the CI pipeline 