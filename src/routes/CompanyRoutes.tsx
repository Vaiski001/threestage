import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import CompanyDashboard from "@/pages/CompanyDashboard";
import CompanySettings from "@/pages/CompanySettings";
import FormBuilder from "@/pages/FormBuilder";
import Enquiries from "@/pages/Enquiries";
import CompanyEmailMessaging from "@/pages/CompanyEmailMessaging";
import CompanyChatMessaging from "@/pages/CompanyChatMessaging";
import CompanyInboxMessaging from "@/pages/CompanyInboxMessaging";
import CompanyBilling from "@/pages/CompanyBilling";
import CompanyNotifications from "@/pages/CompanyNotifications";
import CompanySupport from "@/pages/CompanySupport";
import CompanyTeam, { TeamManagementFallback } from "@/pages/CompanyTeam";
import CompanyCustomers from "@/pages/CompanyCustomers";
import CompanyInvoices from "@/pages/CompanyInvoices";
import CompanyPayments from "@/pages/CompanyPayments";
import CompanyReports from "@/pages/CompanyReports";
import CompanyDetails from "@/pages/CompanyDetails";
import NotFound from "@/pages/NotFound";

// Helper to determine if we should use fallback components in preview mode
const shouldUseFallbacks = import.meta.env.DEV && window.location.search.includes('use_fallbacks=true');

export const CompanyRoutes = () => {
  return (
    <Routes>
      {/* ===== COMPANY CORE ROUTES ===== */}
      {/* Main dashboard and company settings */}
      <Route path="/dashboard" element={
        <ProtectedRoute allowPreview={true}>
          <CompanyDashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/settings/*" element={
        <ProtectedRoute allowPreview={true}>
          <CompanySettings />
        </ProtectedRoute>
      } />
      
      {/* Company details page */}
      <Route path="/details" element={
        <ProtectedRoute allowPreview={true}>
          <CompanyDetails />
        </ProtectedRoute>
      } />
      
      {/* ===== FORM & ENQUIRY MANAGEMENT ===== */}
      {/* Form creation and management */}
      <Route path="/forms" element={
        <ProtectedRoute allowPreview={true}>
          <FormBuilder />
        </ProtectedRoute>
      } />
      
      <Route path="/forms/builder/:formId" element={
        <ProtectedRoute allowPreview={true}>
          <FormBuilder />
        </ProtectedRoute>
      } />
      
      <Route path="/forms/create" element={
        <ProtectedRoute allowPreview={true}>
          <FormBuilder />
        </ProtectedRoute>
      } />
      
      {/* Enquiry management from customers */}
      <Route path="/enquiries" element={
        <ProtectedRoute allowPreview={true}>
          <Enquiries />
        </ProtectedRoute>
      } />
      
      {/* ===== COMMUNICATION CHANNELS ===== */}
      {/* Unified messaging inbox */}
      <Route path="/messaging" element={
        <ProtectedRoute allowPreview={true}>
          <CompanyInboxMessaging />
        </ProtectedRoute>
      } />
      
      {/* Email messaging with customers */}
      <Route path="/messaging/email" element={
        <ProtectedRoute allowPreview={true}>
          <CompanyEmailMessaging />
        </ProtectedRoute>
      } />
      
      {/* Chat with customers */}
      <Route path="/messaging/chat" element={
        <ProtectedRoute allowPreview={true}>
          <CompanyChatMessaging />
        </ProtectedRoute>
      } />
      
      {/* Unified messaging inbox */}
      <Route path="/messaging/inbox" element={
        <ProtectedRoute allowPreview={true}>
          <CompanyInboxMessaging />
        </ProtectedRoute>
      } />
      
      {/* ===== BILLING & FINANCE ===== */}
      {/* Company billing and subscription management */}
      <Route path="/billing" element={
        <ProtectedRoute allowPreview={true}>
          <CompanyBilling />
        </ProtectedRoute>
      } />
      
      {/* Invoice management */}
      <Route path="/invoices" element={
        <ProtectedRoute allowPreview={true}>
          <CompanyInvoices />
        </ProtectedRoute>
      } />
      
      {/* Payment processing */}
      <Route path="/payments" element={
        <ProtectedRoute allowPreview={true}>
          <CompanyPayments />
        </ProtectedRoute>
      } />
      
      {/* ===== REPORTING & ANALYTICS ===== */}
      {/* Business reports and analytics */}
      <Route path="/reports" element={
        <ProtectedRoute allowPreview={true}>
          <CompanyReports />
        </ProtectedRoute>
      } />
      
      <Route path="/analytics" element={
        <ProtectedRoute allowPreview={true}>
          <CompanyReports />
        </ProtectedRoute>
      } />
      
      {/* ===== TEAM & CUSTOMER MANAGEMENT ===== */}
      {/* Team member management */}
      <Route path="/team" element={
        <ProtectedRoute allowPreview={true}>
          {shouldUseFallbacks ? <TeamManagementFallback /> : <CompanyTeam />}
        </ProtectedRoute>
      } />
      
      {/* Customer management */}
      <Route path="/customers" element={
        <ProtectedRoute allowPreview={true}>
          {shouldUseFallbacks ? <div>Fallback Customer Content</div> : <CompanyCustomers />}
        </ProtectedRoute>
      } />
      
      {/* ===== NOTIFICATIONS & SUPPORT ===== */}
      {/* Company notifications */}
      <Route path="/notifications" element={
        <ProtectedRoute allowPreview={true}>
          <CompanyNotifications />
        </ProtectedRoute>
      } />
      
      {/* Company support */}
      <Route path="/support" element={
        <ProtectedRoute allowPreview={true}>
          <CompanySupport />
        </ProtectedRoute>
      } />
      
      {/* Catch all for unmatched company routes */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
