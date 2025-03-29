
import { Route } from "react-router-dom";
import { Fragment } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import CompanyDashboard from "@/pages/CompanyDashboard";
import CompanySettings from "@/pages/CompanySettings";
import FormBuilder from "@/pages/FormBuilder";
import Enquiries from "@/pages/Enquiries";
import NotFound from "@/pages/NotFound";

export const CompanyRoutes = () => {
  return (
    <Fragment>
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
    </Fragment>
  );
};
