
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface RoleRouterProps {
  children: React.ReactNode;
}

export const RoleRouter = ({ children }: RoleRouterProps) => {
  const { profile, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (loading) return;

    if (profile) {
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
  }, [profile, loading, navigate, toast]);

  return <>{children}</>;
};
