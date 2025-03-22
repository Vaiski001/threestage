
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase, handleOAuthSignIn, getUserProfile } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { User } from "@supabase/supabase-js";

export default function AuthCallback() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        setIsProcessing(true);
        
        // Get the current session
        const { data, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        if (data.session) {
          const user = data.session.user;
          
          // For OAuth logins, ensure the profile is created/updated
          if (user.app_metadata.provider && ['google', 'facebook', 'linkedin'].includes(user.app_metadata.provider)) {
            // Determine role - if it's a new user, default to customer unless specified in URL params
            const urlParams = new URLSearchParams(window.location.search);
            const role = urlParams.get('role') === 'company' ? 'company' : 'customer';
            
            await handleOAuthSignIn(user, role as 'customer' | 'company');
          }
          
          // Get user profile to determine where to redirect
          const profile = await getUserProfile(user.id);
          
          toast({
            title: "Authentication successful",
            description: "You have been successfully logged in.",
          });

          // Redirect based on user role
          if (profile?.role === "company") {
            navigate("/dashboard");
          } else {
            navigate("/enquiries");
          }
        } else {
          // No session, redirect to login
          setErrorMessage("Authentication failed. No session was created.");
          toast({
            title: "Authentication failed",
            description: "Please try logging in again.",
            variant: "destructive",
          });
          setTimeout(() => navigate("/login"), 2000);
        }
      } catch (error: any) {
        console.error("Error in auth callback:", error);
        setErrorMessage(error.message || "There was a problem with the authentication process.");
        toast({
          title: "Authentication error",
          description: error.message || "There was a problem with the authentication process.",
          variant: "destructive",
        });
        setTimeout(() => navigate("/login"), 2000);
      } finally {
        setIsProcessing(false);
      }
    };

    handleAuthCallback();
  }, [navigate, toast]);

  return (
    <div className="h-screen flex items-center justify-center bg-background">
      <div className="text-center max-w-md p-8 rounded-lg shadow-sm border bg-card">
        {isProcessing ? (
          <>
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold mb-2">Completing authentication...</h2>
            <p className="text-muted-foreground">Please wait while we log you in.</p>
          </>
        ) : errorMessage ? (
          <>
            <div className="w-16 h-16 mx-auto mb-4 text-red-500">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2 text-destructive">Authentication Failed</h2>
            <p className="text-muted-foreground mb-4">{errorMessage}</p>
            <p className="text-sm text-muted-foreground">Redirecting you to the login page...</p>
          </>
        ) : (
          <>
            <div className="w-16 h-16 mx-auto mb-4 text-green-500">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2 text-primary">Authentication Successful</h2>
            <p className="text-muted-foreground mb-4">You've been successfully authenticated.</p>
            <p className="text-sm text-muted-foreground">Redirecting you to your dashboard...</p>
          </>
        )}
      </div>
    </div>
  );
}
