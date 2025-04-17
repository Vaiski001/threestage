import React from "react";
import { Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import CompanyManagement from "@/pages/admin/CompanyManagement";
import CustomerManagement from "@/pages/admin/CustomerManagement";
import ContentModeration from "@/pages/admin/ContentModeration";
import AnalyticsReports from "@/pages/admin/AnalyticsReports";
import AdminSettings from "@/pages/admin/AdminSettings";
import AdminDevTools from "@/pages/admin/AdminDevTools";
import NotFound from "@/pages/NotFound";

// Export individual admin routes to use in parent Routes component
export const AdminRoutes = () => {
  return (
    <React.Fragment>
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
    </React.Fragment>
  );
}; 