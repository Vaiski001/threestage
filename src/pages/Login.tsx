
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
  const { refreshProfile, user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const checkServiceStatus = async () => {
      try {
        const isAvailable = await isSupabaseAvailable();
        const status = getServiceStatus();
        setServiceStatus(status.status);
        setLastServiceCheck(Date.now());
      } catch (error) {
        console.error('Error checking service status:', error);
        setServiceStatus('unavailable');
      }
    };
    
    checkServiceStatus();
    
    // Check more frequently if there are issues
    const statusInterval = setInterval(
      checkServiceStatus, 
      serviceStatus === 'available' ? 30000 : 15000
    );
    
    return () => clearInterval(statusInterval);
  }, [serviceStatus]);

  useEffect(() => {
    if (location.state) {
      if (location.state.message) {
        setSuccessMessage(location.state.message);
        window.history.replaceState({}, document.title);
        
        const timer = setTimeout(() => {
          setSuccessMessage(null);
        }, 15000);
        
        return () => clearTimeout(timer);
      }
      
      if (location.state.error) {
        setError(location.state.error);
        window.history.replaceState({}, document.title);
      }
    }
  }, [location]);

  useEffect(() => {
    const isExplicitLoginAttempt = location.pathname === "/login";
    
    if (user && !isExplicitLoginAttempt) {
      console.log("User already logged in, redirecting to dashboard");
      navigate("/dashboard");
    }
  }, [user, navigate, location]);

  const handleLoginSuccess = async () => {
    try {
      console.log("Login successful, refreshing profile before redirect");
      setIsRefreshing(true);
      
      let attempts = 0;
      const maxAttempts = 3;
      
      while (attempts < maxAttempts) {
        attempts++;
        console.log(`Refreshing profile attempt ${attempts}/${maxAttempts}`);
        
        try {
          await refreshProfile();
          console.log("Profile refreshed successfully");
          break;
        } catch (err) {
          console.error(`Profile refresh attempt ${attempts} failed:`, err);
          
          if (attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 800));
          }
        }
      }
      
      console.log("Redirecting to dashboard");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error during post-login process:", error);
      toast({
        title: "Warning",
        description: "Logged in but had trouble loading your profile data. Some features may not work correctly.",
        variant: "default",
      });
      navigate("/dashboard");
    } finally {
      setIsRefreshing(false);
    }
  };

  // Calculate time since last check
  const getTimeSinceLastCheck = () => {
    if (!lastServiceCheck) return "never";
    const seconds = Math.floor((Date.now() - lastServiceCheck) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    return `${Math.floor(seconds / 60)}m ${seconds % 60}s ago`;
  };

  // Get appropriate alert for service status
  const getServiceAlert = () => {
    if (serviceStatus === 'unavailable') {
      return (
        <Alert className="mb-6 border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-700">
            <p className="font-semibold">Supabase authentication services are currently down.</p>
            <p className="mt-1">Login with password is unavailable. Please use Google login or try again later.</p>
            <p className="mt-1 text-xs">Last checked: {getTimeSinceLastCheck()}</p>
          </AlertDescription>
        </Alert>
      );
    }
    
    if (serviceStatus === 'degraded') {
      return (
        <Alert className="mb-6 border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-700">
            <p>Supabase authentication services may be experiencing intermittent issues.</p>
            <p className="mt-1">Password login might be unreliable. Google login is recommended.</p>
            <p className="mt-1 text-xs">Last checked: {getTimeSinceLastCheck()}</p>
          </AlertDescription>
        </Alert>
      );
    }
    
    return null;
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="py-16">
        <Container size="sm">
          <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-center">Log In</h1>
            
            {getServiceAlert()}
            
            {successMessage && (
              <Alert className="mb-6 border-green-200 bg-green-50">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="flex justify-between items-center">
                  <span className="text-green-700">{successMessage}</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 px-2 text-green-700 hover:bg-green-100"
                    onClick={() => setSuccessMessage(null)}
                  >
                    <XCircle size={14} />
                  </Button>
                </AlertDescription>
              </Alert>
            )}
            
            {error && (
              <Alert className="mb-6 border-red-200 bg-red-50">
                <XCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="flex justify-between items-center">
                  <span className="text-red-700">{error}</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 px-2 text-red-700 hover:bg-red-100"
                    onClick={() => setError(null)}
                  >
                    <XCircle size={14} />
                  </Button>
                </AlertDescription>
              </Alert>
            )}
            
            {error && error.includes("CAPTCHA") && (
              <Alert className="mb-6 border-yellow-200 bg-yellow-50">
                <Info className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-700">
                  <p className="font-semibold">CAPTCHA verification is preventing password login.</p>
                  <p className="mt-1">This typically happens when there are too many login attempts from your location.</p>
                  <ol className="list-decimal ml-5 mt-2 space-y-1">
                    <li><strong>Use Google login</strong> - Recommended and most reliable option</li>
                    <li>Wait 15-30 minutes before trying password login again</li>
                    <li>Clear your browser cookies and cache</li>
                    <li>Try using a different network connection</li>
                    <li>If the issue persists, contact support</li>
                  </ol>
                </AlertDescription>
              </Alert>
            )}
            
            <LoginForm 
              onSuccess={handleLoginSuccess}
              onError={(message) => setError(message)}
            />
            
            {isRefreshing && (
              <div className="mt-4 text-center text-sm text-muted-foreground">
                <p>Preparing your dashboard...</p>
              </div>
            )}
          </div>
        </Container>
      </main>
    </div>
  );
}
