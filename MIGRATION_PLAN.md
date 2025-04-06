# Threestage: Migration to Next.js

This document outlines our plan for migrating the Threestage application from React Router to Next.js. We are working to consolidate our codebase and maintain a single, consistent framework for better maintainability.

## Migration Goals

- Consolidate dual codebases (React Router + Next.js) into a single Next.js application
- Maintain all existing functionality without disruption
- Improve performance and code organization
- Enable better SEO capabilities
- Simplify future maintenance

## Migration Phases

### Phase 1: Infrastructure Setup ✅

- [x] Update package.json with Next.js dependencies
- [x] Configure next.config.js properly
- [x] Update root layout files
- [x] Create consistent landing page with proper branding

### Phase 2: Core Components (In Progress)

- [ ] Move shared UI components to a structure compatible with both frameworks
- [ ] Create reusable layout components
- [ ] Migrate footer, header, and navigation components

### Phase 3: Route Migration

- [ ] Convert public routes first (landing, login, signup)
- [ ] Migrate customer portal routes
- [ ] Migrate company portal routes

### Phase 4: State & Authentication

- [ ] Adapt authentication to work with Next.js patterns
- [ ] Update global state management
- [ ] Test user flow across the application

### Phase 5: API & Data Integration

- [ ] Convert API functionality to Next.js API routes
- [ ] Create type-safe endpoints
- [ ] Ensure all data fetching works correctly

### Phase 6: Testing & Cleanup

- [ ] Conduct thorough testing across all features
- [ ] Remove React Router specific code
- [ ] Optimize performance using Next.js features

## Compatibility Strategy

During the migration, we're maintaining compatibility with both frameworks:

1. The current React Router app continues to work uninterrupted
2. New Next.js pages are added in parallel
3. Routes are gradually transitioned from React Router to Next.js
4. Only when a feature is fully stable in Next.js will the old code be removed

## Directory Structure

The new Next.js application uses the following structure:

```
/src
  /app           # Next.js app directory
    /api         # API routes
    /customer    # Customer portal routes
    /company     # Company portal routes
    layout.tsx   # Root layout
    page.tsx     # Home page
  /components    # Shared components
  /lib           # Utilities
  /hooks         # Custom hooks
  /context       # Context providers
```

## Migration Status

| Feature Area              | Status       | Notes                                 |
|---------------------------|--------------|---------------------------------------|
| Project Configuration     | ✅ Complete  | Package.json and Next.js config setup |
| Landing Page              | ✅ Complete  | Home page with proper branding        |
| Authentication            | ⏳ Planned   | Will use Next.js Auth patterns        |
| Customer Portal           | ⏳ Planned   | Will migrate route by route           |
| Company Portal            | ⏳ Planned   | Will migrate route by route           |
| Enquiry Management        | ⏳ Planned   | Complex feature, plan carefully       |
| API Integration           | ⏳ Planned   | Will use Next.js API routes           |

## How to Contribute to the Migration

1. All new features should be built with Next.js
2. Migrating existing features:
   - Create a matching Next.js version of a React Router page
   - Ensure all functionality works identically
   - Update routing configuration
   - Add proper tests
   - Remove the React Router version once stable

## Deployment Strategy

We're using a phased deployment approach:

1. Set up dual build system (Vite + Next.js)
2. Initially serve the React Router app with Next.js landing
3. Gradually transition routes to Next.js
4. Fully switch to Next.js once migration is complete

---

This document will be updated as migration progresses. For questions or suggestions about the migration process, please contact the development team. 