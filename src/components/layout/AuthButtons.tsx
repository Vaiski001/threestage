
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { forceSignOut } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { signInWithGoogle } from "@/lib/supabase/auth";
import { useState, useEffect } from "react";
import { isSupabaseAvailable } from "@/lib/supabase/client";
import { AlertCircle } from "lucide-react";

export function AuthButtons() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [serviceAvailable, setServiceAvailable] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Check Supabase availability on component mount
  useEffect(() => {
    const checkSupabaseStatus = async () => {
      try {
        const available = await isSupabaseAvailable();
        setServiceAvailable(available);
        if (!available) {
          console.log("Supabase services appear to be unavailable");
        }
      } catch (error) {
        console.error("Error checking Supabase status:", error);
        setServiceAvailable(false);
      }
    };
    
    checkSupabaseStatus();
    // Re-check every 30 seconds
    const intervalId = setInterval(checkSupabaseStatus, 30000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  const handleGoogleAuth = async () => {
    setIsLoading(true);
    try {
      // Check availability again before attempting auth
      const available = await isSupabaseAvailable();
      if (!available) {
        toast({
          title: "Service Unavailable",
          description: "Authentication services are currently unavailable. Please try again later.",
          variant: "destructive"
        });
        return;
      }
      
      await signInWithGoogle();
      toast({
        title: "Google Auth",
        description: "Google authentication initiated."
      });
    } catch (error) {
      console.error("Error with Google auth:", error);
      toast({
        title: "Auth Error",
        description: "Could not initiate Google authentication.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleNav = (path: string) => {
    // Check if Supabase is unavailable before navigation
    if (serviceAvailable === false) {
      toast({
        title: "Service Notice",
        description: "Authentication services are currently unavailable. Some features may not work properly.",
        variant: "destructive"
      });
    }
    navigate(path);
  };
  
  const handleForceSignOut = async () => {
    try {
      await forceSignOut();
      toast({
        title: "Authentication reset",
        description: "All auth data has been cleared."
      });
    } catch (error) {
      console.error("Error resetting auth:", error);
    }
  };
  
  return (
    <div className="flex items-center gap-2 md:gap-4">
      {serviceAvailable === false && (
        <div className="text-xs text-red-500 flex items-center mr-2">
          <AlertCircle className="h-3 w-3 mr-1" />
          <span className="hidden sm:inline">Service issues</span>
        </div>
      )}
      
      <Button 
        variant="outline" 
        onClick={() => handleNav("/login")}
        disabled={isLoading}
      >
        Log in
      </Button>
      
      <Button 
        onClick={() => handleNav("/signup")}
        disabled={isLoading}
      >
        Sign up
      </Button>
      
      {import.meta.env.DEV && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleForceSignOut} 
          className="text-xs text-red-500"
        >
          Reset Auth
        </Button>
      )}
    </div>
  );
}
