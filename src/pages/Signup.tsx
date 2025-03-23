
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Container } from "@/components/ui/Container";
import { SignupForm } from "@/components/auth/SignupForm";
import { CompanySignupForm } from "@/components/auth/CompanySignupForm";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserRole } from "@/lib/supabase";
import { AlertCircle } from "lucide-react";

export default function Signup() {
  const [error, setError] = useState<string | null>(null);
  const [accountType, setAccountType] = useState<UserRole>("customer");
  const [captchaError, setCaptchaError] = useState(false);
  const navigate = useNavigate();

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    
    // Check if the error is related to CAPTCHA
    if (errorMessage.toLowerCase().includes('captcha')) {
      setCaptchaError(true);
    } else {
      setCaptchaError(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="py-16">
        <Container size="sm">
          <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-center">Create an Account</h1>
            
            {error && (
              <Alert className={`mb-6 ${captchaError ? 'border-orange-300 bg-orange-50 text-orange-800' : ''}`}>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="flex items-center justify-between">
                  {error}
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setError(null);
                      setCaptchaError(false);
                    }}
                  >
                    Try Again
                  </Button>
                </AlertDescription>
              </Alert>
            )}
            
            {captchaError && (
              <Alert variant="default" className="mb-6 bg-blue-50 border-blue-200">
                <AlertTitle>Recommendation</AlertTitle>
                <AlertDescription>
                  We recommend using Google Sign-Up to avoid CAPTCHA verification issues. Alternatively, you can try again in a few minutes.
                </AlertDescription>
              </Alert>
            )}
            
            <Tabs
              defaultValue="customer"
              className="mb-6" 
              onValueChange={(value) => {
                setAccountType(value as UserRole);
                setError(null);
                setCaptchaError(false);
              }}
            >
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="customer">Customer Account</TabsTrigger>
                <TabsTrigger value="company">Company Account</TabsTrigger>
              </TabsList>
              
              <TabsContent value="customer">
                <SignupForm 
                  onSuccess={() => {
                    navigate("/dashboard");
                  }}
                  onError={handleError}
                />
              </TabsContent>
              
              <TabsContent value="company">
                <CompanySignupForm 
                  onSuccess={() => {
                    navigate("/dashboard");
                  }}
                  onError={handleError}
                />
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center text-sm">
              Already have an account?{" "}
              <Button 
                variant="link" 
                className="p-0" 
                onClick={() => navigate("/login")}
              >
                Log in
              </Button>
            </div>
          </div>
        </Container>
      </main>
    </div>
  );
}
