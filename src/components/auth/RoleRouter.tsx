
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface RoleRouterProps {
  children: React.ReactNode;
}

export const RoleRouter = ({ children }: RoleRouterProps) => {
  const { profile, loading, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Development mode bypass
  const isDevelopment = import.meta.env.DEV;
  const bypassRoleCheck = isDevelopment && process.env.NODE_ENV !== 'production';

  // Refresh profile on mount and path change
  useEffect(() => {
    if (!bypassRoleCheck) {
      refreshProfile();
    }
  }, [refreshProfile, location.pathname, bypassRoleCheck]);

  useEffect(() => {
    // Skip in development bypass mode
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
    
    // Skip redirection for public paths or if already on correct dashboard
    if (isPublicPath) {
      return;
    }
    
    const currentPath = location.pathname;
    
    if (profile) {
      console.log("RoleRouter checking path access for role:", profile.role, "Current path:", currentPath);
      
      const isCompanyPath = currentPath.startsWith('/company/');
      const isCustomerPath = currentPath.startsWith('/customer/');
      
      // If user is on the wrong path type for their role
      if ((profile.role === 'company' && isCustomerPath) || (profile.role === 'customer' && isCompanyPath)) {
        console.log("User on incorrect path for their role, redirecting");
        
        if (profile.role === 'company') {
          navigate('/company/dashboard', { replace: true });
        } else if (profile.role === 'customer') {
          navigate('/customer/dashboard', { replace: true });
        }
      } else if (!isCompanyPath && !isCustomerPath) {
        // If not on a role-specific path, redirect to appropriate dashboard
        console.log("User not on role-specific path, redirecting to appropriate dashboard");
        
        if (profile.role === 'company') {
          navigate('/company/dashboard', { replace: true });
        } else if (profile.role === 'customer') {
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
    }
  }, [profile, loading, navigate, toast, location.pathname, bypassRoleCheck]);

  return <>{children}</>;
};
