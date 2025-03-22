
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
      if (profile.role === 'company') {
        navigate('/company/dashboard', { replace: true });
      } else if (profile.role === 'customer') {
        navigate('/customer/dashboard', { replace: true });
      }
    } else {
      // If no profile, redirect to demo for now
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
