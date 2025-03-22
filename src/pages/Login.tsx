
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Container } from "@/components/ui/Container";
import { LoginForm } from "@/components/auth/LoginForm";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Login() {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <Header />
      <main className="py-16">
        <Container size="sm">
          <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-center">Log in to your account</h1>
            
            {error && (
              <Alert className="mb-6">
                <AlertDescription className="flex items-center justify-between">
                  {error}
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setError(null)}
                  >
                    Try Again
                  </Button>
                </AlertDescription>
              </Alert>
            )}
            
            <LoginForm 
              onSuccess={() => {
                navigate("/dashboard");
              }}
              onError={(errorMessage) => {
                setError(errorMessage);
              }}
            />

            <div className="mt-6 text-center text-sm">
              Don't have an account?{" "}
              <Button 
                variant="link" 
                className="p-0" 
                asChild
              >
                <Link to="/signup">Sign up</Link>
              </Button>
            </div>
          </div>
        </Container>
      </main>
    </div>
  );
}
