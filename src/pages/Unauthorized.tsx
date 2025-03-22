
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { AlertCircle, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { supabase } from "@/lib/supabase";

export default function Unauthorized() {
  const navigate = useNavigate();
  const location = useLocation();
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isSuggestionVisible, setIsSuggestionVisible] = useState(false);

  // Extract error message from location state if available
  useEffect(() => {
    if (location.state && location.state.errorMessage) {
      setErrorDetails(location.state.errorMessage);
      
      // Check if this is an RLS error and show suggestions
      if (location.state.errorMessage.includes("row-level security") || 
          location.state.errorMessage.includes("RLS")) {
        setIsSuggestionVisible(true);
      }
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
      
      navigate('/');
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setIsSigningOut(false);
    }
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
            
            {isSuggestionVisible && (
              <Alert className="max-w-md mx-auto">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Database Permission Issue</AlertTitle>
                <AlertDescription className="text-left">
                  <p className="mb-2">This is a Supabase Row-Level Security (RLS) error. Your account creation was successful, but the profile could not be created due to security settings.</p>
                  <p>Please try signing out, then sign in with the account you just created.</p>
                </AlertDescription>
              </Alert>
            )}
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button onClick={() => navigate(-1)}>Go Back</Button>
              <Button variant="outline" onClick={() => navigate("/")}>
                Return to Home
              </Button>
              <Button variant="ghost" onClick={handleSignOut} disabled={isSigningOut}>
                {isSigningOut ? "Signing Out..." : "Sign Out & Start Fresh"}
              </Button>
            </div>
          </div>
        </Container>
      </main>
    </>
  );
}
