
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { AlertCircle, AlertTriangle, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { supabase } from "@/lib/supabase";

export default function Unauthorized() {
  const navigate = useNavigate();
  const location = useLocation();
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isSuggestionVisible, setIsSuggestionVisible] = useState(false);
  const [isRLSError, setIsRLSError] = useState(false);

  // Extract error message from location state if available
  useEffect(() => {
    if (location.state && location.state.errorMessage) {
      setErrorDetails(location.state.errorMessage);
      
      // Check if this is an RLS error and show suggestions
      const isRLS = 
        location.state.errorMessage.includes("row-level security") || 
        location.state.errorMessage.includes("RLS") ||
        location.state.errorMessage.includes("policy prevented profile creation");
        
      setIsRLSError(isRLS);
      setIsSuggestionVisible(true);
    }
  }, [location]);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await supabase.auth.signOut({ scope: 'global' });
      // Clear any potential auth-related localStorage items
      localStorage.removeItem('oauth_role');
      localStorage.removeItem('oauth_provider');
      localStorage.removeItem('oauth_timestamp');
      
      navigate('/login', { 
        state: { 
          message: "You've been signed out. If you just created an account, please sign in with your new credentials." 
        } 
      });
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setIsSigningOut(false);
    }
  };

  const handleTryLogin = () => {
    navigate('/login', { 
      state: { 
        message: "Your account was created successfully. Please log in with your credentials." 
      } 
    });
  };

  return (
    <>
      <Header />
      <main className="py-24">
        <Container size="md">
          <div className="text-center space-y-6">
            <div className="mx-auto w-16 h-16 flex items-center justify-center bg-red-100 rounded-full">
              <AlertCircle className="h-10 w-10 text-red-600" />
            </div>
            
            <h1 className="text-4xl font-bold">Access Denied</h1>
            <p className="text-xl text-muted-foreground max-w-md mx-auto">
              You don't have permission to access this page.
            </p>
            
            {errorDetails && (
              <Alert variant="destructive" className="max-w-md mx-auto">
                <AlertTitle>Error Details</AlertTitle>
                <AlertDescription>{errorDetails}</AlertDescription>
              </Alert>
            )}
            
            {isRLSError && (
              <Alert className="max-w-md mx-auto bg-amber-50 border-amber-200">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <AlertTitle className="text-amber-800">Database Security Policy Issue</AlertTitle>
                <AlertDescription className="text-left text-amber-700">
                  <p className="mb-2">This is a Supabase Row-Level Security (RLS) error. Your account has been created, but you need to log in first before accessing your profile.</p>
                  <p className="font-medium">Please click the "Sign Out & Log In Again" button below, then sign in with the credentials you just created.</p>
                </AlertDescription>
              </Alert>
            )}
            
            {isSuggestionVisible && !isRLSError && (
              <Alert className="max-w-md mx-auto">
                <Info className="h-4 w-4" />
                <AlertTitle>What happened?</AlertTitle>
                <AlertDescription className="text-left">
                  <p className="mb-2">There was an issue with your account access. This could be due to:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Your session expired</li>
                    <li>You don't have the right permissions</li>
                    <li>There was a database error</li>
                  </ul>
                  <p className="mt-2">Try signing out and logging in again, or contact support if the issue persists.</p>
                </AlertDescription>
              </Alert>
            )}
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              {isRLSError ? (
                <>
                  <Button variant="default" onClick={handleSignOut} disabled={isSigningOut}>
                    {isSigningOut ? "Signing Out..." : "Sign Out & Log In Again"}
                  </Button>
                  <Button variant="outline" onClick={() => navigate("/")}>
                    Return to Home
                  </Button>
                </>
              ) : (
                <>
                  <Button onClick={() => navigate(-1)}>Go Back</Button>
                  <Button variant="outline" onClick={() => navigate("/")}>
                    Return to Home
                  </Button>
                  <Button variant="ghost" onClick={handleSignOut} disabled={isSigningOut}>
                    {isSigningOut ? "Signing Out..." : "Sign Out & Start Fresh"}
                  </Button>
                  <Button variant="default" onClick={handleTryLogin}>
                    Try Logging In
                  </Button>
                </>
              )}
            </div>
          </div>
        </Container>
      </main>
    </>
  );
}
