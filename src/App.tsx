
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { RoleRouter } from "@/components/auth/RoleRouter";

import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard"; // Now used as legacy/demo
import DemoDashboard from "./pages/DemoDashboard";
import CompanyDashboard from "./pages/CompanyDashboard";
import CustomerDashboard from "./pages/CustomerDashboard";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Unauthorized from "./pages/Unauthorized";
import Enquiries from "./pages/Enquiries";
import CustomerProfileDashboard from "./pages/CustomerProfileDashboard";
import AuthCallback from "./pages/AuthCallback";
import FormBuilder from "./pages/FormBuilder";

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
            
            {/* Role router - redirects based on user role */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <RoleRouter>
                  <Dashboard />
                </RoleRouter>
              </ProtectedRoute>
            } />
            
            {/* Role-specific routes */}
            <Route path="/company/dashboard" element={
              <ProtectedRoute>
                <CompanyDashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/customer/dashboard" element={
              <ProtectedRoute>
                <CustomerDashboard />
              </ProtectedRoute>
            } />
            
            {/* Form Builder */}
            <Route path="/forms" element={
              <ProtectedRoute>
                <FormBuilder />
              </ProtectedRoute>
            } />
            
            {/* Legacy/shared routes */}
            <Route path="/profile" element={<ProtectedRoute><CustomerProfileDashboard /></ProtectedRoute>} />
            <Route path="/enquiries" element={<ProtectedRoute><Enquiries /></ProtectedRoute>} />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
