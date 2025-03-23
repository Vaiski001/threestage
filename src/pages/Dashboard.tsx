
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const Dashboard = () => {
  const { profile, loading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (loading) return;
    
    // Redirect based on user role
    if (profile) {
      console.log("Dashboard redirecting based on profile role:", profile.role);
      
      // Use string comparison to ensure proper type checking
      if (profile.role === 'company') {
        console.log("Redirecting to company dashboard");
        navigate('/company/dashboard', { replace: true });
      } else if (profile.role === 'customer') {
        console.log("Redirecting to customer dashboard");
        navigate('/customer/dashboard', { replace: true });
      } else {
        console.warn("Unknown role detected:", profile.role);
        // If unknown role, redirect to demo for now
        navigate('/demo', { replace: true });
      }
    } else {
      // If no profile, redirect to demo for now
      console.log("No profile found, redirecting to demo");
      navigate('/demo', { replace: true });
    }
  }, [profile, loading, navigate]);

  // Show minimal loading state while redirecting
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-medium">Loading your dashboard...</h2>
        <p className="text-muted-foreground">You will be redirected momentarily.</p>
      </div>
    </div>
  );
};

export default Dashboard;
