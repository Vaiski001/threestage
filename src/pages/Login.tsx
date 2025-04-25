import * as React from "react";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LoginForm } from "@/components/auth/LoginForm";
import { Header } from "@/components/layout/Header";
import { Container } from "@/components/ui/Container";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, XCircle, AlertTriangle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { isSupabaseAvailable, getServiceStatus } from "@/lib/supabase/client";

export default function Login() {
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [serviceStatus, setServiceStatus] = useState<'available' | 'degraded' | 'unavailable'>('available');
  const [lastServiceCheck, setLastServiceCheck] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const { refreshProfile, user, profile } = useAuth();
  const { toast } = useToast();

  // Handle manual refresh of the auth state
  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    setError(null);
    
    try {
      // Clear any cached auth data
      localStorage.removeItem('supabase.auth.user_role');
      localStorage.removeItem('userRole');
      sessionStorage.removeItem('userRole');
      
      // Refresh the auth profile
      await refreshProfile();
      
      // If user is now authenticated, show success message
      if (user) {
        setSuccessMessage("Authentication refreshed successfully");
        toast({
          title: "Authentication refreshed",
          description: "Your session has been updated. Redirecting to dashboard...",
        });
        
        // Wait a moment then redirect
        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      } else {
        setError("No authenticated session found. Please log in.");
      }
    } catch (error) {
      console.error("Error refreshing authentication:", error);
      setError("Failed to refresh authentication. Please try logging in again.");
    } finally {
      setIsRefreshing(false);
    }
  };

  // Handle login success
  const handleLoginSuccess = () => {
    setSuccessMessage("Login successful! Redirecting to dashboard...");
    
    // We don't need to navigate here - the LoginForm will handle redirection
  };

  // Handle login error
  const handleLoginError = (message: string) => {
    setError(message);
    
    // Check service status if login fails
    checkServiceStatus();
  };

  // Check authentication service status
  const checkServiceStatus = async () => {
    try {
      const statusResult = await getServiceStatus();
      setServiceStatus(statusResult.status);
      setLastServiceCheck(Date.now());
      
      if (statusResult.status !== 'available') {
        toast({
          title: "Service Status",
          description: `Authentication service status: ${statusResult.status}. This may affect your login experience.`,
          duration: 8000,
        });
      }
    } catch (error) {
      console.error('Error checking service status:', error);
      setServiceStatus('unavailable');
    }
  };

  useEffect(() => {
    // Check service status on mount
    checkServiceStatus();
    
    // Set up interval to check status periodically
    const statusInterval = setInterval(
      checkServiceStatus, 
      serviceStatus === 'available' ? 30000 : 15000
    );
    
    return () => clearInterval(statusInterval);
  }, [serviceStatus]);

  // Redirect if user is already authenticated
  useEffect(() => {
    if (user && profile) {
      navigate('/dashboard');
    }
  }, [user, profile, navigate]);

  return (
    <React.Fragment>
      <Header />
      <main className="py-8">
        <div className="max-w-md mx-auto mt-20 p-6 bg-card rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-6 text-center">Log In</h1>
          
          {successMessage && (
            <Alert className="mb-4 bg-success/20 text-success border-success">
              <CheckCircle2 className="h-4 w-4 mr-2" />
              <AlertDescription>{successMessage}</AlertDescription>
            </Alert>
          )}
          
          {error && (
            <Alert className="mb-4 bg-destructive/20 text-destructive border-destructive">
              <XCircle className="h-4 w-4 mr-2" />
              <AlertDescription>{error}</AlertDescription>
              
              {serviceStatus !== 'available' && (
                <div className="mt-2 text-sm">
                  Service status: {serviceStatus}. This may affect your ability to log in.
                </div>
              )}
              
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2 w-full"
                onClick={handleManualRefresh}
                disabled={isRefreshing}
              >
                {isRefreshing ? "Refreshing..." : "Refresh Authentication"}
              </Button>
            </Alert>
          )}
          
          {serviceStatus === 'degraded' && !error && (
            <Alert className="mb-4 bg-warning/20 text-warning border-warning">
              <AlertTriangle className="h-4 w-4 mr-2" />
              <AlertDescription>
                Authentication services are experiencing some issues. Login may be slower than usual.
              </AlertDescription>
            </Alert>
          )}
          
          <LoginForm 
            onSuccess={handleLoginSuccess} 
            onError={handleLoginError} 
          />
        </div>
      </main>
    </React.Fragment>
  );
}
