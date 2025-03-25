
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { RoleRouter } from "@/components/auth/RoleRouter";
import { DevNavigation } from "@/components/dev/DevNavigation";

// Public pages
import Index from "./pages/Index";
import DemoDashboard from "./pages/DemoDashboard";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Unauthorized from "./pages/Unauthorized";
import AuthCallback from "./pages/AuthCallback";

// Company pages
import CompanyDashboard from "./pages/CompanyDashboard";
import CompanySettings from "./pages/CompanySettings";
import FormBuilder from "./pages/FormBuilder";
import Enquiries from "./pages/Enquiries";

// Customer pages
import CustomerDashboard from "./pages/CustomerDashboard";
import CustomerSettings from "./pages/CustomerSettings";

// Shared/discovery pages
import CompanySearch from "./pages/CompanySearch";
import CompanyProfile from "./pages/CompanyProfile";
import { FormEmbedded } from "./components/forms/FormEmbedded";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/demo" element={<DemoDashboard />} />
            
            {/* Company search and discovery - publicly accessible */}
            <Route path="/companies" element={<CompanySearch />} />
            <Route path="/companies/:id" element={<CompanyProfile />} />
            <Route path="/forms/:formId" element={<FormEmbedded />} />
            
            {/* Role router - redirects based on user role */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <RoleRouter>
                  <CustomerDashboard />
                </RoleRouter>
              </ProtectedRoute>
            } />
            
            {/* Company routes */}
            <Route path="/company/dashboard" element={
              <ProtectedRoute>
                <CompanyDashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/company/settings" element={
              <ProtectedRoute>
                <CompanySettings />
              </ProtectedRoute>
            } />
            
            <Route path="/company/forms" element={
              <ProtectedRoute>
                <FormBuilder />
              </ProtectedRoute>
            } />
            
            <Route path="/company/enquiries" element={
              <ProtectedRoute>
                <Enquiries />
              </ProtectedRoute>
            } />
            
            {/* Customer routes */}
            <Route path="/customer/dashboard" element={
              <ProtectedRoute>
                <CustomerDashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/customer/settings" element={
              <ProtectedRoute>
                <CustomerSettings />
              </ProtectedRoute>
            } />
            
            <Route path="/customer/enquiries" element={
              <ProtectedRoute>
                <Enquiries />
              </ProtectedRoute>
            } />
            
            {/* Set Index as the fallback for empty path */}
            <Route path="" element={<Navigate to="/" />} />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          
          {/* Developer Navigation - only visible in development */}
          <DevNavigation />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
