import { Route } from "react-router-dom";
import { Fragment } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import CustomerDashboard from "@/pages/CustomerDashboard";
import CustomerSettings from "@/pages/CustomerSettings";
import CustomerProfile from "@/pages/CustomerProfile";
import Enquiries from "@/pages/Enquiries";
import CustomerEmailMessaging from "@/pages/CustomerEmailMessaging";
import CustomerChatMessaging from "@/pages/CustomerChatMessaging";
import CustomerInboxMessaging from "@/pages/CustomerInboxMessaging";
import CustomerBilling from "@/pages/CustomerBilling";
import CustomerNotifications from "@/pages/CustomerNotifications";
import CustomerSupport from "@/pages/CustomerSupport";
import NotFound from "@/pages/NotFound";

export const CustomerRoutes = () => {
  return (
    <Fragment>
      {/* ===== CUSTOMER CORE ROUTES ===== */}
      {/* Primary dashboard and profile management */}
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
      
      {/* ===== ENQUIRY MANAGEMENT ===== */}
      {/* View and manage enquiries submitted to companies */}
      <Route path="/customer/enquiries" element={
        <ProtectedRoute allowPreview={true}>
          <Enquiries />
        </ProtectedRoute>
      } />
      
      {/* ===== COMMUNICATION ROUTES ===== */}
      {/* Messaging with companies */}
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
      
      {/* ===== ACCOUNT MANAGEMENT ===== */}
      {/* Billing and subscriptions */}
      <Route path="/customer/billing" element={
        <ProtectedRoute allowPreview={true}>
          <CustomerBilling />
        </ProtectedRoute>
      } />
      
      {/* Notifications preferences */}
      <Route path="/customer/notifications" element={
        <ProtectedRoute allowPreview={true}>
          <CustomerNotifications />
        </ProtectedRoute>
      } />
      
      {/* Customer support */}
      <Route path="/customer/support" element={
        <ProtectedRoute allowPreview={true}>
          <CustomerSupport />
        </ProtectedRoute>
      } />
      
      {/* Support sub-routes */}
      <Route path="/customer/support/tickets" element={
        <ProtectedRoute allowPreview={true}>
          <CustomerSupport />
        </ProtectedRoute>
      } />
      
      <Route path="/customer/support/knowledge" element={
        <ProtectedRoute allowPreview={true}>
          <CustomerSupport />
        </ProtectedRoute>
      } />
    </Fragment>
  );
};
