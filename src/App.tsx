
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import CustomerSignup from "./pages/CustomerSignup";
import CompanySignup from "./pages/CompanySignup";
import PasswordReset from "./pages/PasswordReset";
import AuthCallback from "./pages/AuthCallback";
import ManualLogin from "./pages/ManualLogin";
import Unauthorized from "./pages/Unauthorized";
import Enquiries from "./pages/Enquiries";

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
            <Route path="/login" element={<Login />} />
            <Route path="/signup-customer" element={<CustomerSignup />} />
            <Route path="/signup-company" element={<CompanySignup />} />
            <Route path="/reset-password" element={<PasswordReset />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/auth/manual-login" element={<ManualLogin />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            
            {/* Protected routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute allowedRoles={["company"]}>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/enquiries" 
              element={<Enquiries />} 
            />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
