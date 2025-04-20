import React from "react";
import { Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import CompanyManagement from "@/pages/admin/CompanyManagement";
import CustomerManagement from "@/pages/admin/CustomerManagement";
import ContentModeration from "@/pages/admin/ContentModeration";
import AnalyticsReports from "@/pages/admin/AnalyticsReports";
import AdminSettings from "@/pages/admin/AdminSettings";
import AdminDevTools from "@/pages/admin/AdminDevTools";
import SystemConfiguration from "@/pages/admin/SystemConfiguration";
import NotificationManagement from "@/pages/admin/NotificationManagement";
import AuditLogs from "@/pages/admin/AuditLogs";
import ApiManagement from "@/pages/admin/ApiManagement";
import NotFound from "@/pages/NotFound";

// Export admin routes as an array to use in parent Routes component
const AdminRoutes = () => {
  return (
    <>
      <Routes>
        {/* Admin dashboard - main view */}
        <Route 
          path="/admin" 
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
          path="/admin/content" 
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
        
        {/* System Configuration */}
        <Route 
          path="/admin/system" 
          element={
            <ProtectedRoute requiredRole="admin">
              <SystemConfiguration />
            </ProtectedRoute>
          } 
        />
        
        {/* Notification Management */}
        <Route 
          path="/admin/notifications" 
          element={
            <ProtectedRoute requiredRole="admin">
              <NotificationManagement />
            </ProtectedRoute>
          } 
        />
        
        {/* Audit Logs */}
        <Route 
          path="/admin/audit-logs" 
          element={
            <ProtectedRoute requiredRole="admin">
              <AuditLogs />
            </ProtectedRoute>
          } 
        />
        
        {/* API Management */}
        <Route 
          path="/admin/api-management" 
          element={
            <ProtectedRoute requiredRole="admin">
              <ApiManagement />
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
        <Route path="/admin/*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default AdminRoutes; 