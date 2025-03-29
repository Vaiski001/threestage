
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

const Dashboard = () => {
  const { profile, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [redirecting, setRedirecting] = useState(false);
  
  useEffect(() => {
    // Only process redirect after loading is complete
    if (loading) return;
    
    const handleRedirect = async () => {
      try {
        setRedirecting(true);
        
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
        } else if (!isAuthenticated) {
          // If no profile and not authenticated, redirect to demo
          console.log("Not authenticated, redirecting to demo");
          navigate('/demo', { replace: true });
        } else {
          // If authenticated but no profile, wait a moment and try again
          console.log("Authenticated but no profile yet, waiting briefly...");
          setTimeout(() => {
            if (!profile) {
              console.log("Still no profile after waiting, redirecting to demo");
              navigate('/demo', { replace: true });
            }
          }, 1500);
        }
      } catch (error) {
        console.error("Error during dashboard redirect:", error);
        // Fallback to demo in case of errors
        navigate('/demo', { replace: true });
      }
    };
    
    handleRedirect();
  }, [profile, loading, isAuthenticated, navigate]);

  // Show enhanced loading state while redirecting
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <h2 className="text-xl font-medium">Loading your dashboard...</h2>
        <p className="text-muted-foreground">
          {redirecting 
            ? "Redirecting you to the right place." 
            : "Checking your account information..."}
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
