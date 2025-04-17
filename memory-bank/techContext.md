# Technical Context - Threestage

## Technologies Used

### Frontend Framework
- **React 18**: Core UI library
- **TypeScript**: For type safety and improved developer experience
- **Vite**: Fast, modern build tool and development server

### UI Components
- **shadcn/ui**: Accessible UI components built with Radix UI and Tailwind CSS
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Unstyled, accessible UI primitives
- **Lucide React**: Icon library
- **Embla Carousel**: Carousel/slider library
- **Sonner**: Toast notifications
- **React Day Picker**: Date picker component

### State Management
- **React Context API**: For global state management
- **TanStack Query (React Query)**: For server state management and caching
- **React Hook Form**: Form state management
- **Zod**: Schema validation

### Routing
- **React Router DOM**: Client-side routing

### Backend Services
- **Supabase**: Backend-as-a-Service providing:
  - Authentication & Authorization
  - PostgreSQL Database
  - Real-time subscriptions
  - Storage
  - Edge Functions
  - Row-Level Security

### Visualization Libraries
- **Mapbox GL JS**: For interactive maps and geographic visualization
- **Recharts**: For data visualization and analytics dashboards

### Communication APIs
- **Email API**: Integration for email messaging
- **Instagram Graph API**: For Instagram direct messages integration

### Utilities
- **date-fns**: Date manipulation library
- **clsx/tailwind-merge**: For conditional class name composition
- **class-variance-authority**: Creating variants for UI components
- **next-themes**: Theme switching with system preference detection
- **OpenCage/Google Maps API**: For address geocoding

## Development Setup

### Environment Requirements
- **Node.js**: v16.x or higher
- **npm**: Package manager

### Local Development
- **Development Server**: `npm run dev`
- **Build Process**: `npm run build`
- **Preview Build**: `npm run preview`
- **Linting**: `npm run lint`

### Environment Variables
Required environment variables in `.env`:
- Supabase URL and API Keys
- External API credentials for messaging channels
- Mapbox API Key
- Geocoding API Keys
- Feature flags (if applicable)

### Build Configuration
- **Vite Config**: Configured in `vite.config.ts`
- **TypeScript Config**: Split across multiple files for different contexts:
  - `tsconfig.json`: Base configuration
  - `tsconfig.app.json`: Application-specific settings
  - `tsconfig.node.json`: Node.js specific settings
- **Tailwind Config**: `tailwind.config.ts`
- **ESLint Config**: `eslint.config.js`
- **PostCSS Config**: `postcss.config.js`

## Technical Constraints

### Browser Support
- Modern evergreen browsers (Chrome, Firefox, Safari, Edge)
- No support for IE11 or older browsers

### Performance Targets
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3.5s
- Lighthouse Performance Score: > 85

### Security Requirements
- Authentication for all portal access
- Role-based access control
- Secure API key storage
- HTTPS for all communications
- JWT token management

### Accessibility Requirements
- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader compatibility
- Color contrast requirements

## Dependencies

### Core Dependencies
- React ecosystem (react, react-dom, react-router-dom)
- TypeScript
- Tailwind CSS and its plugins
- shadcn/ui components
- Supabase JS client
- React Query
- React Hook Form with Zod
- Mapbox GL JS
- Recharts

### Development Dependencies
- Vite and related plugins
- ESLint and TypeScript ESLint
- Type definitions (@types/*)

### External Services
- Supabase project
- Email service integration
- Instagram API integration
- Mapbox services
- Geocoding services

### Dependency Management
- Package versioning using npm
- Regular updates for security patches
- Major version migration planning 