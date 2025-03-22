
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Container } from "@/components/ui/Container";
import { SignupForm } from "@/components/auth/SignupForm";
import { CompanySignupForm } from "@/components/auth/CompanySignupForm";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserRole } from "@/lib/supabase";

export default function Signup() {
  const [error, setError] = useState<string | null>(null);
  const [accountType, setAccountType] = useState<UserRole>("customer");
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <Header />
      <main className="py-16">
        <Container size="sm">
          <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-center">Create an Account</h1>
            
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
            
            <Tabs
              defaultValue="customer"
              className="mb-6" 
              onValueChange={(value) => setAccountType(value as UserRole)}
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
                  onError={(errorMessage) => {
                    setError(errorMessage);
                  }}
                />
              </TabsContent>
              
              <TabsContent value="company">
                <CompanySignupForm 
                  onSuccess={() => {
                    navigate("/dashboard");
                  }}
                  onError={(errorMessage) => {
                    setError(errorMessage);
                  }}
                />
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center text-sm">
              Already have an account?{" "}
              <Button 
                variant="link" 
                className="p-0" 
                onClick={() => navigate("/")}
              >
                Back to Home
              </Button>
            </div>
          </div>
        </Container>
      </main>
    </div>
  );
}
