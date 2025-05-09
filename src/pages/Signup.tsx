
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
  const navigate = useNavigate();

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="py-16">
        <Container size="sm">
          <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-center">Create an Account</h1>
            
            {error && (
              <Alert className="mb-6" variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="flex items-center justify-between">
                  {error}
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setError(null);
                    }}
                  >
                    Try Again
                  </Button>
                </AlertDescription>
              </Alert>
            )}
            
            <Tabs
              defaultValue="customer"
              className="mb-6" 
              onValueChange={(value) => {
                setAccountType(value as UserRole);
                setError(null);
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
