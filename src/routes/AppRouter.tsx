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
import CustomerDashboard from "@/pages/customer/CustomerDashboard";
import CustomerSettings from "@/pages/customer/CustomerSettings";
import Enquiries from "@/pages/Enquiries";
import CustomerProfile from "@/pages/customer/CustomerProfile";
import TestPage from "@/pages/TestPage";
import DatabaseTest from "@/pages/DatabaseTest";
import CustomerEmailMessaging from "@/pages/customer/CustomerEmailMessaging";
import CustomerChatMessaging from "@/pages/customer/CustomerChatMessaging";
import CustomerInboxMessaging from "@/pages/customer/CustomerInboxMessaging";
import CustomerBilling from "@/pages/customer/CustomerBilling";
import CustomerNotifications from "@/pages/customer/CustomerNotifications";
import CustomerSupport from "@/pages/customer/CustomerSupport";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { FormEmbedded } from "@/components/forms/FormEmbedded";
import { CompanyRoutes } from "./CompanyRoutes";
import { CustomerRoutes } from "./CustomerRoutes";

export const AppRouter = () => {
  return (
    <Routes>
      {/* ===== PUBLIC ROUTES ===== */}
      <Route path="/" element={<Index />} />
      <Route path="/demo" element={<DemoDashboard />} />
      <Route path="/test" element={<TestPage />} />
      <Route path="/databasetest" element={<DatabaseTest />} />
      
      {/* ===== AUTHENTICATION ROUTES ===== */}
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      
      {/* ===== SHARED FUNCTIONALITY ===== */}
      {/* Role-based router - redirects based on user role */}
      <Route path="/dashboard" element={
        <ProtectedRoute allowPreview={true}>
          <Dashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/role-redirect" element={
        <ProtectedRoute allowPreview={true}>
          <Dashboard />
        </ProtectedRoute>
      } />
      
      {/* Form viewing (for embedding) */}
      <Route path="/forms/:formId" element={<FormEmbedded />} />
      
      {/* ===== CUSTOMER PORTAL ROUTES ===== */}
      {/* Company discovery (Customer Portal feature) */}
      <Route path="/companies" element={
        <ProtectedRoute allowPreview={true}>
          <CompanySearch />
        </ProtectedRoute>
      } />
      
      <Route path="/companies/:id" element={<CompanyProfile />} />
      
      {/* Primary Customer Routes */}
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
          <CustomerEmailMessaging />
        </ProtectedRoute>
      } />
      
      <Route path="/customer/messaging/chat" element={
        <ProtectedRoute allowPreview={true}>
          <CustomerChatMessaging />
        </ProtectedRoute>
      } />
      
      <Route path="/customer/messaging/inbox" element={
        <ProtectedRoute allowPreview={true}>
          <CustomerInboxMessaging />
        </ProtectedRoute>
      } />
      
      {/* Customer account management routes */}
      <Route path="/customer/billing" element={
        <ProtectedRoute allowPreview={true}>
          <CustomerBilling />
        </ProtectedRoute>
      } />
      
      <Route path="/customer/notifications" element={
        <ProtectedRoute allowPreview={true}>
          <CustomerNotifications />
        </ProtectedRoute>
      } />
      
      <Route path="/customer/support" element={
        <ProtectedRoute allowPreview={true}>
          <CustomerSupport />
        </ProtectedRoute>
      } />
      
      {/* Test routes directly in AppRouter */}
      <Route path="/customer/email-test" element={<CustomerEmailMessaging />} />
      
      {/* Include remaining customer routes */}
      <Route path="/customer/*" element={<CustomerRoutes />} />
      
      {/* ===== COMPANY PORTAL ROUTES ===== */}
      {/* All company routes are handled by CompanyRoutes */}
      <Route path="/company/*" element={<CompanyRoutes />} />
      
      {/* ===== REDIRECTS ===== */}
      <Route path="/forms" element={<Navigate to="/company/forms" replace />} />
      <Route path="/enquiries" element={<Navigate to="/dashboard" replace />} />
      <Route path="" element={<Navigate to="/" />} />
      
      {/* ===== CATCH-ALL ROUTE ===== */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
