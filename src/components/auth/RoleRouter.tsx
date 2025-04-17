import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { validateRole } from "@/lib/supabase/roleUtils";
import { isSupabaseAvailable } from "@/lib/supabase/client";

interface RoleRouterProps {
  children: React.ReactNode;
}

export const RoleRouter = ({ children }: RoleRouterProps) => {
  const { profile, loading, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Development mode and preview bypass
  const isDevelopment = import.meta.env.DEV;
  const isPreview = window.location.hostname.includes('preview') || 
                   window.location.hostname.includes('lovable.app');
  // Also bypass if Supabase credentials are missing
  const supabaseCredentialsMissing = !isSupabaseAvailable();
  const bypassRoleCheck = (isDevelopment && process.env.NODE_ENV !== 'production') || 
                         isPreview || 
                         supabaseCredentialsMissing;

  // Show a warning toast if Supabase credentials are missing
  useEffect(() => {
    if (supabaseCredentialsMissing) {
      toast({
        title: "Demo Mode Active",
        description: "Supabase credentials are missing. App is running in demo mode with limited functionality.",
        variant: "warning",
        duration: 5000,
      });
    }
  }, [supabaseCredentialsMissing, toast]);

  // Refresh profile on mount and path change
  useEffect(() => {
    if (!bypassRoleCheck) {
      refreshProfile();
    }
  }, [refreshProfile, location.pathname, bypassRoleCheck]);

  useEffect(() => {
    // Skip in development/preview bypass mode
    if (bypassRoleCheck) return;
    
    if (loading) return;

    // Define paths that should always be accessible regardless of auth state
    const publicPaths = ['/', '/demo', '/login', '/signup', '/unauthorized', '/companies'];
    const isPublicPath = publicPaths.some(path => 
      location.pathname === path || 
      location.pathname.startsWith('/auth/') || 
      location.pathname.startsWith('/companies/') ||
      location.pathname.startsWith('/forms/')
    );
    
    // Skip redirection for public paths
    if (isPublicPath) {
      return;
    }
    
    const currentPath = location.pathname;
    
    if (profile) {
      console.log("RoleRouter checking path access for role:", profile.role, "Current path:", currentPath);
      
      const isCompanyPath = currentPath.startsWith('/company/');
      const isCustomerPath = currentPath.startsWith('/customer/');
      
      // If user is on the wrong path type for their role, redirect them
      if ((profile.role === 'company' && isCustomerPath) || (profile.role === 'customer' && isCompanyPath)) {
        console.log("User on incorrect path for their role, redirecting");
        
        toast({
          title: "Access Restricted",
          description: "You don't have permission to access this area.",
          variant: "destructive",
        });
        
        if (profile.role === 'company') {
          console.log("Company user detected, redirecting to company dashboard");
          navigate('/company/dashboard', { replace: true });
        } else if (profile.role === 'customer') {
          console.log("Customer user detected, redirecting to customer dashboard");
          navigate('/customer/dashboard', { replace: true });
        }
      } else if (!isCompanyPath && !isCustomerPath) {
        // If not on a role-specific path, redirect to appropriate dashboard
        console.log("User not on role-specific path, redirecting to appropriate dashboard");
        
        if (profile.role === 'company') {
          console.log("Company user detected, redirecting to company dashboard");
          navigate('/company/dashboard', { replace: true });
        } else if (profile.role === 'customer') {
          console.log("Customer user detected, redirecting to customer dashboard");
          navigate('/customer/dashboard', { replace: true });
        } else {
          toast({
            title: "Unknown user role",
            description: "Your account has an invalid role. Please contact support.",
            variant: "destructive",
          });
          // Redirect to login if role is invalid
          navigate('/login', { replace: true });
        }
      }
    } else if (!loading) {
      // Check localStorage for role as fallback if no profile
      const storedRole = localStorage.getItem('supabase.auth.user_role');
      const validRole = validateRole(storedRole);
      
      if (validRole) {
        console.log("Found role in localStorage:", validRole);
        const isCompanyPath = currentPath.startsWith('/company/');
        const isCustomerPath = currentPath.startsWith('/customer/');
        
        // Redirect based on stored role if on wrong path
        if ((validRole === 'company' && isCustomerPath) || (validRole === 'customer' && isCompanyPath)) {
          if (validRole === 'company') {
            navigate('/company/dashboard', { replace: true });
          } else {
            navigate('/customer/dashboard', { replace: true });
          }
          return;
        }
      }
      
      // If no profile and no valid stored role, redirect to login
      console.log("User not authenticated, redirecting to login");
      navigate('/login', { replace: true });
    }
  }, [profile, loading, navigate, toast, location.pathname, bypassRoleCheck]);

  return <>{children}</>;
};
