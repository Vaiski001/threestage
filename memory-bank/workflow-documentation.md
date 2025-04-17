# ThreeStage Project Workflow Documentation

This document outlines the standard workflows for updating, implementing features, and managing deployments in the ThreeStage project.

## Table of Contents

1. [Development Environment](#development-environment)
2. [Git Workflow](#git-workflow)
3. [Framework & Dependencies](#framework--dependencies)
4. [Feature Implementation Process](#feature-implementation-process)
5. [Testing & Deployment](#testing--deployment)
6. [Troubleshooting Common Issues](#troubleshooting-common-issues)

## Development Environment

### Tech Stack

- **Frontend**: React with TypeScript
- **Build Tool**: Vite
- **CSS Framework**: Tailwind CSS with ShadCN components
- **Backend**: Supabase (Authentication, Database, Storage)
- **Deployment**: Vercel

### Environment Variables

The project uses Vite-specific environment variables:

```
# Supabase Vite Environment Variables
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

> **Important**: Environment variables for client-side code must begin with `VITE_` prefix to be accessible in the browser.

## Git Workflow

### Branch Strategy

- `main`: Production-ready code
- `develop`: Integration branch for features
- `feature/feature-name`: Individual feature branches

### Standard Workflow

1. **Create a feature branch**:
   ```bash
   git checkout -b feature/feature-name
   ```

2. **Make changes and commit**:
   ```bash
   git add .
   git commit -m "Descriptive commit message"
   ```

3. **Push changes to remote**:
   ```bash
   git push origin feature/feature-name
   ```

4. **Testing on feature branch**:
   Verify that Vercel deployment for the feature branch is successful and functioning as expected.

5. **Merge to main**:
   ```bash
   git checkout main
   git pull origin main
   git merge feature/feature-name
   git push origin main
   ```

## Framework & Dependencies

### Vite Configuration

The project uses Vite as the build tool. The main configuration file is `vite.config.ts` at the project root.

Key aspects:
- Path aliases (@/ points to src/)
- Server settings (port 8080)
- Plugin configuration (React SWC)

### Adding Dependencies

```bash
npm install package-name
```

For development dependencies:

```bash
npm install -D package-name
```

## Feature Implementation Process

### 1. Component Creation

1. Create components in appropriate directory:
   - UI components: `src/components/ui/`
   - Feature components: `src/components/[feature-name]/`
   - Page components: `src/pages/`

2. Use TypeScript interfaces for component props

3. Follow established naming conventions:
   - Component files: PascalCase (e.g., `ButtonGroup.tsx`)
   - Helper/utility files: camelCase (e.g., `formatDate.ts`)

### 2. File Upload Implementation

The project includes a reusable `FileUpload` component that integrates with Supabase storage:

```tsx
<FileUpload
  bucket="your-bucket-name"
  path="path/to/store/{uuid}"
  onSuccess={(url, file) => handleSuccess(url, file)}
  onError={handleError}
  acceptedFileTypes="image/*"
  maxSizeMB={2}
/>
```

Key features:
- Progress tracking
- Preview capabilities
- Drag-and-drop support
- File validation

### 3. Authentication Implementation

Authentication is handled through Supabase. Key functions are available in the client utilities:

- `getCurrentUser()`: Gets the currently authenticated user
- `getCurrentProfile()`: Gets the user profile with role information
- `isAuthenticated()`: Checks if a user is authenticated
- `getUserRole()`: Returns the user's role (customer or company)
- `signOut()`: Signs out the current user

## Testing & Deployment

### Local Testing

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Access the application at `http://localhost:8080`

### Vercel Deployment

The project is configured for automatic deployments on Vercel:

1. **Branch Deployments**:
   - Every push to a branch creates a preview deployment
   - URL format: `https://threestage-[branch-name]-[username].vercel.app`

2. **Production Deployment**:
   - Pushes to `main` branch trigger production deployments
   - URL: `https://threestage.vercel.app`

### Environment Configuration on Vercel

1. Navigate to the Vercel project settings
2. Go to the "Environment Variables" section
3. Add all required environment variables with appropriate values
4. Ensure variables are added to the correct environments (Production, Preview, Development)

## Troubleshooting Common Issues

### Build Errors

#### Missing Exports

If you encounter errors about missing exports like:
```
"X" is not exported by "src/lib/supabase/client.ts"
```

Solution: Add the required export to the appropriate file.

#### CSS Import Order Issues

CSS `@import` statements must come before other CSS rules. When using Tailwind, ensure imports are before `@tailwind` directives.

Incorrect:
```css
@tailwind base;
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300&display=swap');
```

Correct:
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300&display=swap');
@tailwind base;
```

### Supabase Connection Issues

If the application fails to connect to Supabase:

1. Verify environment variables are correctly set
2. Check that the Supabase project is active
3. Ensure the correct API keys are being used
4. Verify that Row Level Security (RLS) policies are properly configured

### Vercel Deployment Issues

1. Check build logs for specific errors
2. Ensure all environment variables are properly set
3. Verify that the correct framework preset is selected (Vite)
4. Check that the Node.js version is compatible

---

This documentation will be updated as workflows evolve and new processes are established.

Last updated: October 2023 