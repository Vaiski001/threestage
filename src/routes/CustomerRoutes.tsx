
import { Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import CustomerDashboard from "@/pages/CustomerDashboard";
import CustomerSettings from "@/pages/CustomerSettings";
import Enquiries from "@/pages/Enquiries";
import NotFound from "@/pages/NotFound";

export const CustomerRoutes = () => {
  return (
    <>
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
    </>
  );
};
