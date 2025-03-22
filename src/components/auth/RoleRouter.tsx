
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

  // Refresh profile on mount and path change
  useEffect(() => {
    refreshProfile();
  }, [refreshProfile, location.pathname]);

  useEffect(() => {
    if (loading) return;

    // Define paths that should always be accessible regardless of auth state
    const publicPaths = ['/', '/demo', '/login', '/signup', '/unauthorized'];
    const isPublicPath = publicPaths.some(path => location.pathname === path || location.pathname.startsWith('/auth/'));
    
    // Skip redirection for public paths or if already on correct dashboard
    if (isPublicPath) {
      return;
    }
    
    const currentPath = location.pathname;
    const isOnCorrectDashboard = 
      (profile?.role === 'company' && currentPath.includes('/company/')) ||
      (profile?.role === 'customer' && currentPath.includes('/customer/')) ||
      currentPath.includes('/profile');
    
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
  }, [profile, loading, navigate, toast, location.pathname]);

  return <>{children}</>;
};
