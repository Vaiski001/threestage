
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LoginForm } from "@/components/auth/LoginForm";
import { Header } from "@/components/layout/Header";
import { Container } from "@/components/ui/Container";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export default function Login() {
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { refreshProfile } = useAuth();

  useEffect(() => {
    // Check for success message passed via location state (from signup or unauthorized page)
    if (location.state && location.state.message) {
      setSuccessMessage(location.state.message);
      
      // Clear the state so it doesn't persist on page refresh
      window.history.replaceState({}, document.title);
      
      // Auto-clear success message after 15 seconds
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 15000);
      
      return () => clearTimeout(timer);
    }
  }, [location]);

  const handleLoginSuccess = async () => {
    // Ensure we have the latest profile data before redirecting
    try {
      await refreshProfile();
      navigate("/dashboard");
    } catch (error) {
      console.error("Error refreshing profile after login:", error);
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="py-16">
        <Container size="sm">
          <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-center">Log In</h1>
            
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
            
            <LoginForm 
              onSuccess={handleLoginSuccess}
              onError={(message) => setError(message)}
            />
          </div>
        </Container>
      </main>
    </div>
  );
}
