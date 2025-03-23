import { ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, loading } = useAuth();
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [hasSession, setHasSession] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkSessionDirectly = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        const hasValidSession = !!data.session;
        console.log("Protected route session check:", hasValidSession ? "Found session" : "No session");
        setHasSession(hasValidSession);
      } catch (error) {
        console.error("Error checking session in protected route:", error);
        setHasSession(false);
      } finally {
        setIsCheckingSession(false);
      }
    };

    if (!isAuthenticated && !loading) {
      checkSessionDirectly();
    } else {
      setIsCheckingSession(false);
    }
  }, [isAuthenticated, loading]);

  if (loading || isCheckingSession) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <h1 className="text-2xl font-semibold mb-2">Loading your account...</h1>
        <p className="text-muted-foreground">Please wait while we retrieve your information</p>
      </div>
    );
  }

  if (isAuthenticated || hasSession) {
    return <>{children}</>;
  }

  return <Navigate to="/unauthorized" state={{ from: location.pathname }} replace />;
};
