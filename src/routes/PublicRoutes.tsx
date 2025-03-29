
import { Route, Navigate } from "react-router-dom";
import { Fragment } from "react";
import Index from "@/pages/Index";
import DemoDashboard from "@/pages/DemoDashboard";
import Signup from "@/pages/Signup";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";
import Unauthorized from "@/pages/Unauthorized";
import AuthCallback from "@/pages/AuthCallback";
import CompanySearch from "@/pages/CompanySearch";
import CompanyProfile from "@/pages/CompanyProfile";
import { FormEmbedded } from "@/components/forms/FormEmbedded";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Dashboard from "@/pages/Dashboard";

export const PublicRoutes = () => {
  return (
    <Fragment>
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
      
      {/* Set Index as the fallback for empty path */}
      <Route path="" element={<Navigate to="/" />} />
    </Fragment>
  );
};
