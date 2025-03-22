
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LoginForm } from "@/components/auth/LoginForm";
import { Header } from "@/components/layout/Header";
import { Container } from "@/components/ui/Container";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2 } from "lucide-react";

export default function Login() {
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check for success message passed via location state (from signup)
    if (location.state && location.state.message) {
      setSuccessMessage(location.state.message);
      
      // Clear the state so it doesn't persist on page refresh
      window.history.replaceState({}, document.title);
    }
  }, [location]);

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
                <AlertDescription className="text-green-700">
                  {successMessage}
                </AlertDescription>
              </Alert>
            )}
            
            {error && (
              <Alert className="mb-6">
                <AlertDescription>
                  {error}
                </AlertDescription>
              </Alert>
            )}
            
            <LoginForm 
              onSuccess={() => navigate("/dashboard")}
              onError={(message) => setError(message)}
            />
          </div>
        </Container>
      </main>
    </div>
  );
}
