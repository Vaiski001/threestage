
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
    const isOnCorrectDashboard = 
      (profile?.role === 'company' && currentPath.includes('/company/')) ||
      (profile?.role === 'customer' && currentPath.includes('/customer/'));
    
    if (profile && !isOnCorrectDashboard) {
      console.log("RoleRouter redirecting user based on role:", profile.role);
      
      if (profile.role === 'company') {
        navigate('/company/dashboard');
      } else if (profile.role === 'customer') {
        navigate('/customer/dashboard');
      } else {
        toast({
          title: "Unknown user role",
          description: "Your account has an invalid role. Please contact support.",
          variant: "destructive",
        });
        // Redirect to login if role is invalid
        navigate('/login');
      }
    }
  }, [profile, loading, navigate, toast, location.pathname, bypassRoleCheck]);

  return <>{children}</>;
};
