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
      {/* ===== PUBLIC MARKETING ROUTES ===== */}
      {/* Main landing page */}
      <Route path="/" element={<Index />} />
      
      {/* Demo dashboard for showcasing */}
      <Route path="/demo" element={<DemoDashboard />} />
      
      {/* ===== AUTHENTICATION ROUTES ===== */}
      {/* Sign up and login */}
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      
      {/* ===== COMPANY DISCOVERY ROUTES ===== */}
      {/* Browse and find companies */}
      <Route path="/companies" element={
        <ProtectedRoute allowPreview={true}>
          <CompanySearch />
        </ProtectedRoute>
      } />
      
      {/* View company profile */}
      <Route path="/companies/:id" element={<CompanyProfile />} />
      
      {/* View embedded forms */}
      <Route path="/forms/:formId" element={<FormEmbedded />} />
      
      {/* ===== ROLE-BASED ROUTING ===== */}
      {/* Dashboard redirect based on role */}
      <Route path="/dashboard" element={
        <ProtectedRoute allowPreview={true}>
          <Dashboard />
        </ProtectedRoute>
      } />
      
      {/* ===== REDIRECTS ===== */}
      {/* Legacy URL support */}
      <Route path="/forms" element={<Navigate to="/company/forms" replace />} />
      <Route path="/enquiries" element={<Navigate to="/dashboard" replace />} />
      
      {/* Fallback redirect */}
      <Route path="" element={<Navigate to="/" />} />
    </Fragment>
  );
};
