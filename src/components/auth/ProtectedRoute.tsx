
import { ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: ReactNode;
  allowPreview?: boolean;
}

export const ProtectedRoute = ({ children, allowPreview = false }: ProtectedRouteProps) => {
  const { isAuthenticated, loading, refreshProfile } = useAuth();
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [hasSession, setHasSession] = useState(false);
  const location = useLocation();
  
  // Development mode and preview bypass
  const isDevelopment = import.meta.env.DEV;
  const isPreview = window.location.hostname.includes('preview') || 
                   window.location.hostname.includes('lovable.app');
  const bypassAuth = (isDevelopment && process.env.NODE_ENV !== 'production') || 
                    (allowPreview && isPreview);

  useEffect(() => {
    const checkSessionDirectly = async () => {
      // Skip session check if in development mode or preview with bypass enabled
      if (bypassAuth) {
        console.log("Protected route: Auth bypassed in development/preview mode");
        setHasSession(true);
        setIsCheckingSession(false);
        return;
      }
      
      try {
        // First check if we already have authentication state from context
        if (isAuthenticated) {
          console.log("Protected route: Already authenticated via context");
          setHasSession(true);
          setIsCheckingSession(false);
          return;
        }

        // If context doesn't have auth state but still loading, wait
        if (loading) {
          console.log("Protected route: Auth context still loading, waiting...");
          return;
        }

        // If context finished loading but no auth state, check directly with Supabase
        console.log("Protected route: Checking session directly with Supabase");
        const { data } = await supabase.auth.getSession();
        const hasValidSession = !!data.session;
        
        console.log("Protected route session check:", hasValidSession ? "Found session" : "No session");
        
        // If we found a session, trigger a profile refresh to update the auth context
        if (hasValidSession && refreshProfile) {
          console.log("Protected route: Refreshing profile after finding valid session");
          refreshProfile();
        }
        
        setHasSession(hasValidSession);
      } catch (error) {
        console.error("Error checking session in protected route:", error);
        setHasSession(false);
      } finally {
        setIsCheckingSession(false);
      }
    };

    checkSessionDirectly();
  }, [isAuthenticated, loading, refreshProfile, bypassAuth]);

  // Set up auth state change listener
  useEffect(() => {
    // Skip in development/preview bypass mode
    if (bypassAuth) return;
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state change in protected route:", event, !!session);
        setHasSession(!!session);
        
        // If session is established and we have refresh function, update the profile
        if (session && refreshProfile) {
          refreshProfile();
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [refreshProfile, bypassAuth]);

  if (loading || isCheckingSession) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <h1 className="text-2xl font-semibold mb-2">Loading your account...</h1>
        <p className="text-muted-foreground">Please wait while we retrieve your information</p>
      </div>
    );
  }

  // Allow access in development mode, preview mode, or with valid authentication
  if (bypassAuth || isAuthenticated || hasSession) {
    return <>{children}</>;
  }

  return <Navigate to="/unauthorized" state={{ from: location.pathname }} replace />;
};
