# Project Brief - Threestage

## Project Overview
Threestage is a dual-portal web application comprising a Customer Portal and a Company Portal. The application facilitates communication between customers and company representatives through different messaging channels, including email and social media platforms like Instagram.

## Core Requirements

### Dual Portal System
- **Customer Portal**: Interface for customers to submit inquiries, track status, and communicate with company representatives.
- **Company Portal**: Interface for company staff to manage customer inquiries, communications, and internal processes.

### Communication System
- Support for multiple communication channels (email, Instagram)
- Unified message management across channels
- Real-time notifications and updates
- Message status tracking (sent, delivered, read)
- File attachment support across channels

### Inquiry Management
- Tracking of inquiry stages (New → Pending → Completed)
- Detailed history of all communications
- Assignment of inquiries to staff members
- Custom form builder for tailored inquiry forms
- Kanban-style workflow management

### Project Management
- Project creation linked to inquiries
- Configurable project stages with status tracking
- Team member assignment functionality
- Document management with visibility controls
- Timeline visualization for project stages

### User Authentication
- Role-based access control ('customer' and 'company' roles)
- Email/password authentication
- Social authentication options (Google, GitHub)
- Email verification
- Password reset functionality
- Session persistence

### Geographic Visualization
- Interactive map visualization using Mapbox
- Custom markers for different inquiry statuses
- Clustering for areas with multiple inquiries
- Radius-based and attribute filtering
- Address geocoding with caching

### Analytics Dashboard
- Overview metrics (inquiry volume, response time, conversion rates)
- Time-series charts for trend analysis using Recharts
- Geographic distribution visualization
- Team performance metrics and comparisons
- Custom report builder with export functionality

## Technical Goals
- Modern, responsive UI using React, TypeScript, and Tailwind CSS
- Enhanced UX with ShadCN components
- Vite for fast development and building
- Supabase for backend data storage, authentication, and real-time updates
- React Query for server state management
- React Hook Form with Zod for form validation
- Implement secure API integrations for messaging channels
- Mapbox for geographic visualization
- Recharts for analytics visualization

## Success Criteria
- Seamless communication between customers and company
- Intuitive, user-friendly interfaces for both portals
- Reliable message delivery and history tracking
- Efficient inquiry management workflow
- Secure handling of user data and communications
- Comprehensive project management capabilities
- Insightful analytics for company decision-making
- Useful geographic insights into inquiry distribution 