
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

export default function AuthCallback() {
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        if (data.session) {
          toast({
            title: "Authentication successful",
            description: "You have been successfully logged in.",
          });

          // Get user details to determine redirect
          const { data: userData } = await supabase.auth.getUser();
          
          if (userData?.user?.user_metadata?.role === "company") {
            navigate("/dashboard");
          } else {
            navigate("/enquiries");
          }
        } else {
          // No session, redirect to login
          toast({
            title: "Authentication failed",
            description: "Please try logging in again.",
            variant: "destructive",
          });
          navigate("/login");
        }
      } catch (error) {
        console.error("Error in auth callback:", error);
        toast({
          title: "Authentication error",
          description: "There was a problem with the authentication process.",
          variant: "destructive",
        });
        navigate("/login");
      }
    };

    handleAuthCallback();
  }, [navigate, toast]);

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold mb-2">Completing authentication...</h2>
        <p className="text-muted-foreground">Please wait while we log you in.</p>
      </div>
    </div>
  );
}
