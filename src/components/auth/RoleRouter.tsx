
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface RoleRouterProps {
  children: React.ReactNode;
}

export const RoleRouter = ({ children }: RoleRouterProps) => {
  const { profile, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    if (loading) return;

    // Skip redirection if we're already on the correct dashboard or designated paths
    const currentPath = location.pathname;
    const isOnCorrectDashboard = 
      (profile?.role === 'company' && currentPath.includes('/company/')) ||
      (profile?.role === 'customer' && currentPath.includes('/customer/')) ||
      currentPath === '/' || 
      currentPath.includes('/profile') ||
      currentPath.includes('/auth/callback');

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
