import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";
import { determineUserRole } from "@/lib/supabase/roleUtils";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const { profile, loading, isAuthenticated, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [redirecting, setRedirecting] = useState(false);
  const [redirectAttempts, setRedirectAttempts] = useState(0);
  const { toast } = useToast();
  
  useEffect(() => {
    // Only process redirect after loading is complete
    if (loading) {
      console.log("Auth is still loading, waiting...");
      return;
    }
    
    const handleRedirect = async () => {
      try {
        setRedirecting(true);
        setRedirectAttempts(prev => prev + 1);
        
        console.log("Dashboard redirect attempt:", redirectAttempts + 1);
        console.log("Profile state:", profile ? "Available" : "Not available");
        console.log("Authentication state:", isAuthenticated ? "Authenticated" : "Not authenticated");
        
        // If authenticated but no profile, attempt to fetch profile
        if (isAuthenticated && !profile && redirectAttempts < 2) {
          console.log("Authenticated but profile not loaded yet. Attempting to refresh profile...");
          await refreshProfile();
          // Don't continue - let the next effect cycle handle the redirect
          return;
        }
        
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
            // Get stored role from localStorage as fallback
            const storedRole = localStorage.getItem('supabase.auth.user_role');
            console.log("Checking stored role in localStorage:", storedRole);
            
            if (storedRole === 'company') {
              navigate('/company/dashboard', { replace: true });
            } else if (storedRole === 'customer') {
              navigate('/customer/dashboard', { replace: true });
            } else {
              // If unknown role or no stored role, redirect to customer dashboard as default
              console.log("No valid role found, defaulting to customer dashboard");
              navigate('/customer/dashboard', { replace: true });
            }
          }
        } else if (!isAuthenticated) {
          // If no profile and not authenticated, redirect to login instead of demo
          console.log("Not authenticated, redirecting to login");
          
          // PRODUCTION MODE: Always redirect to login when not authenticated
          // Remove any direct bypasses to ensure proper authentication flow
          navigate('/login', { replace: true });
        } else {
          // If authenticated but no profile, check localStorage for role
          console.log("Authenticated but no profile yet, checking localStorage for role...");
          const storedRole = localStorage.getItem('supabase.auth.user_role');
          console.log("Stored role in localStorage:", storedRole);
          
          if (storedRole === 'company') {
            navigate('/company/dashboard', { replace: true });
          } else if (storedRole === 'customer') {
            navigate('/customer/dashboard', { replace: true });
          } else {
            // Try to get role from user metadata as a last resort
            try {
              const { data } = await supabase.auth.getUser();
              if (data.user?.user_metadata?.role) {
                console.log("Found role in user metadata:", data.user.user_metadata.role);
                
                // Ensure role is saved to localStorage for future use
                localStorage.setItem('supabase.auth.user_role', data.user.user_metadata.role);
                
                if (data.user.user_metadata.role === 'company') {
                  navigate('/company/dashboard', { replace: true });
                  return;
                } else if (data.user.user_metadata.role === 'customer') {
                  navigate('/customer/dashboard', { replace: true });
                  return;
                }
              } else {
                console.log("No role in user metadata, checking session directly");
                const { data: sessionData } = await supabase.auth.getSession();
                
                if (sessionData.session?.user.id) {
                  // If we have a session but no profile, try to create one
                  console.log("Found session but no profile, creating default profile");
                  const { data: profileData, error: profileError } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', sessionData.session.user.id)
                    .single();
                  
                  if (profileError && profileError.code === 'PGRST116') {
                    // Profile doesn't exist, create one with default role
                    const defaultRole = 'customer';
                    console.log("Creating new profile with default role:", defaultRole);
                    
                    const { error: insertError } = await supabase
                      .from('profiles')
                      .insert({
                        id: sessionData.session.user.id,
                        email: sessionData.session.user.email,
                        role: defaultRole,
                        created_at: new Date().toISOString()
                      });
                    
                    if (insertError) {
                      console.error("Error creating profile:", insertError);
                      toast({
                        title: "Profile Creation Failed",
                        description: "Could not set up your user profile. Please try logging in again.",
                        variant: "destructive"
                      });
                    } else {
                      console.log("Profile created successfully with role:", defaultRole);
                      localStorage.setItem('supabase.auth.user_role', defaultRole);
                      
                      // Redirect to the appropriate dashboard
                      navigate(`/${defaultRole}/dashboard`, { replace: true });
                      return;
                    }
                  }
                }
              }
            } catch (error) {
              console.error("Error getting user metadata:", error);
            }
            
            // If still no role information, default to customer dashboard
            console.log("No profile or role info available, defaulting to customer dashboard");
            toast({
              title: "Default Account Type",
              description: "Redirecting you to the customer dashboard as default."
            });
            navigate('/customer/dashboard', { replace: true });
          }
        }
      } catch (error) {
        console.error("Error during dashboard redirect:", error);
        toast({
          title: "Navigation Error",
          description: "Something went wrong while preparing your dashboard. Redirecting to login.",
          variant: "destructive"
        });
        // Fallback to login in case of errors
        navigate('/login', { replace: true });
      }
    };
    
    handleRedirect();
  }, [profile, loading, isAuthenticated, navigate, redirectAttempts, refreshProfile, toast]);

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
        {redirectAttempts > 2 && (
          <div className="mt-4">
            <p className="text-muted-foreground text-sm">
              Taking longer than expected. Please be patient...
            </p>
            <button 
              className="text-primary text-sm mt-2 underline"
              onClick={() => navigate('/login', { replace: true })}
            >
              Return to login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
