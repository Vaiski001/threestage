import { Routes, Route, Navigate } from "react-router-dom";
import NotFound from "@/pages/NotFound";
import Index from "@/pages/Index";
import DemoDashboard from "@/pages/DemoDashboard";
import Signup from "@/pages/Signup";
import Login from "@/pages/Login";
import Unauthorized from "@/pages/Unauthorized";
import AuthCallback from "@/pages/AuthCallback";
import CompanySearch from "@/pages/CompanySearch";
import CompanyProfile from "@/pages/CompanyProfile";
import Dashboard from "@/pages/Dashboard";
import CustomerDashboard from "@/pages/CustomerDashboard";
import CustomerSettings from "@/pages/CustomerSettings";
import Enquiries from "@/pages/Enquiries";
import CompanyDashboard from "@/pages/CompanyDashboard";
import CompanySettings from "@/pages/CompanySettings";
import FormBuilder from "@/pages/FormBuilder";
import CustomerProfile from "@/pages/CustomerProfile";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { FormEmbedded } from "@/components/forms/FormEmbedded";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import CompanyManagement from "@/pages/admin/CompanyManagement";
import CustomerManagement from "@/pages/admin/CustomerManagement";
import ContentModeration from "@/pages/admin/ContentModeration";
import AnalyticsReports from "@/pages/admin/AnalyticsReports";
import AdminSettings from "@/pages/admin/AdminSettings";
import AdminDevTools from "@/pages/admin/AdminDevTools";

export const AppRouter = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Index />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/demo" element={<DemoDashboard />} />
      
      {/* Company search and discovery - accessible with customer navigation */}
      <Route path="/companies" element={
        <ProtectedRoute allowPreview={true}>
          <CompanySearch />
        </ProtectedRoute>
      } />
      <Route path="/companies/:id" element={<CompanyProfile />} />
      <Route path="/forms/:formId" element={<FormEmbedded />} />
      
      {/* Role router - redirects based on user role */}
      <Route path="/dashboard" element={
        <ProtectedRoute allowPreview={true}>
          <Dashboard />
        </ProtectedRoute>
      } />
      
      {/* Redirect routes */}
      <Route path="/forms" element={<Navigate to="/company/forms" replace />} />
      <Route path="/enquiries" element={<Navigate to="/dashboard" replace />} />
      
      {/* Customer routes */}
      <Route path="/customer/dashboard" element={
        <ProtectedRoute allowPreview={true}>
          <CustomerDashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/customer/settings" element={
        <ProtectedRoute allowPreview={true}>
          <CustomerSettings />
        </ProtectedRoute>
      } />
      
      <Route path="/customer/profile" element={
        <ProtectedRoute allowPreview={true}>
          <CustomerProfile />
        </ProtectedRoute>
      } />
      
      <Route path="/customer/enquiries" element={
        <ProtectedRoute allowPreview={true}>
          <Enquiries />
        </ProtectedRoute>
      } />
      
      {/* Customer messaging routes */}
      <Route path="/customer/messaging/email" element={
        <ProtectedRoute allowPreview={true}>
          <NotFound />
        </ProtectedRoute>
      } />
      
      <Route path="/customer/messaging/chat" element={
        <ProtectedRoute allowPreview={true}>
          <NotFound />
        </ProtectedRoute>
      } />
      
      <Route path="/customer/messaging/inbox" element={
        <ProtectedRoute allowPreview={true}>
          <NotFound />
        </ProtectedRoute>
      } />
      
      <Route path="/customer/billing" element={
        <ProtectedRoute allowPreview={true}>
          <NotFound />
        </ProtectedRoute>
      } />
      
      <Route path="/customer/notifications" element={
        <ProtectedRoute allowPreview={true}>
          <NotFound />
        </ProtectedRoute>
      } />
      
      <Route path="/customer/support" element={
        <ProtectedRoute allowPreview={true}>
          <NotFound />
        </ProtectedRoute>
      } />
      
      <Route path="/customer/support/tickets" element={
        <ProtectedRoute allowPreview={true}>
          <NotFound />
        </ProtectedRoute>
      } />
      
      <Route path="/customer/support/knowledge" element={
        <ProtectedRoute allowPreview={true}>
          <NotFound />
        </ProtectedRoute>
      } />
      
      <Route path="/customer/enquiries/active" element={
        <ProtectedRoute allowPreview={true}>
          <NotFound />
        </ProtectedRoute>
      } />
      
      <Route path="/customer/enquiries/completed" element={
        <ProtectedRoute allowPreview={true}>
          <NotFound />
        </ProtectedRoute>
      } />
      
      {/* Company routes */}
      <Route path="/company/dashboard" element={
        <ProtectedRoute allowPreview={true}>
          <CompanyDashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/company/settings" element={
        <ProtectedRoute allowPreview={true}>
          <CompanySettings />
        </ProtectedRoute>
      } />
      
      <Route path="/company/forms" element={
        <ProtectedRoute allowPreview={true}>
          <FormBuilder />
        </ProtectedRoute>
      } />
      
      <Route path="/company/enquiries" element={
        <ProtectedRoute allowPreview={true}>
          <Enquiries />
        </ProtectedRoute>
      } />
      
      {/* Company messaging routes */}
      <Route path="/company/messaging/email" element={
        <ProtectedRoute allowPreview={true}>
          <NotFound />
        </ProtectedRoute>
      } />
      
      <Route path="/company/messaging/chat" element={
        <ProtectedRoute allowPreview={true}>
          <NotFound />
        </ProtectedRoute>
      } />
      
      <Route path="/company/messaging/sms" element={
        <ProtectedRoute allowPreview={true}>
          <NotFound />
        </ProtectedRoute>
      } />
      
      <Route path="/company/invoices" element={
        <ProtectedRoute allowPreview={true}>
          <NotFound />
        </ProtectedRoute>
      } />
      
      <Route path="/company/payments" element={
        <ProtectedRoute allowPreview={true}>
          <NotFound />
        </ProtectedRoute>
      } />
      
      <Route path="/company/reports" element={
        <ProtectedRoute allowPreview={true}>
          <NotFound />
        </ProtectedRoute>
      } />
      
      <Route path="/company/team" element={
        <ProtectedRoute allowPreview={true}>
          <NotFound />
        </ProtectedRoute>
      } />
      
      <Route path="/company/customers" element={
        <ProtectedRoute allowPreview={true}>
          <NotFound />
        </ProtectedRoute>
      } />
      
      <Route path="/company/support" element={
        <ProtectedRoute allowPreview={true}>
          <NotFound />
        </ProtectedRoute>
      } />
      
      {/* Admin routes - directly included */}
      {/* Admin dashboard - main view */}
      <Route 
        path="/admin/dashboard" 
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />
      
      {/* Company management */}
      <Route 
        path="/admin/companies" 
        element={
          <ProtectedRoute requiredRole="admin">
            <CompanyManagement />
          </ProtectedRoute>
        } 
      />
      
      {/* Customer management */}
      <Route 
        path="/admin/customers" 
        element={
          <ProtectedRoute requiredRole="admin">
            <CustomerManagement />
          </ProtectedRoute>
        } 
      />
      
      {/* Content moderation */}
      <Route 
        path="/admin/moderation" 
        element={
          <ProtectedRoute requiredRole="admin">
            <ContentModeration />
          </ProtectedRoute>
        } 
      />
      
      {/* Analytics and reports */}
      <Route 
        path="/admin/analytics" 
        element={
          <ProtectedRoute requiredRole="admin">
            <AnalyticsReports />
          </ProtectedRoute>
        } 
      />
      
      {/* Admin settings */}
      <Route 
        path="/admin/settings" 
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminSettings />
          </ProtectedRoute>
        } 
      />
      
      {/* Developer tools */}
      <Route 
        path="/admin/dev-tools" 
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminDevTools />
          </ProtectedRoute>
        } 
      />
      
      {/* Catch-all for invalid admin routes */}
      <Route 
        path="/admin/*" 
        element={
          <ProtectedRoute requiredRole="admin">
            <NotFound />
          </ProtectedRoute>
        } 
      />
      
      {/* Set Index as the fallback for empty path */}
      <Route path="" element={<Navigate to="/" />} />
      
      {/* Catch-all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
