
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/layout/Header";
import { Container } from "@/components/ui/Container";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomerProfileForm } from "@/components/auth/ProfileForms";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

export default function CustomerProfileDashboard() {
  const { user, profile, loading, refreshProfile } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
    
    // Log profile information for debugging
    if (profile) {
      console.log("Customer profile loaded:", profile);
    }
  }, [user, profile, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <Container size="sm" className="py-16">
          <div className="flex justify-center items-center min-h-[50vh]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading profile...</span>
          </div>
        </Container>
      </div>
    );
  }

  if (!user || !profile) {
    return (
      <div className="min-h-screen">
        <Header />
        <Container size="sm" className="py-16">
          <Alert>
            <AlertDescription>
              You need to be logged in to view this page.
              <Button
                variant="link"
                className="p-0 ml-2"
                onClick={() => navigate("/login")}
              >
                Log in
              </Button>
            </AlertDescription>
          </Alert>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="py-16">
        <Container size="sm">
          <Card className="w-full max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Edit Your Profile</CardTitle>
              <CardDescription>
                Update your personal information
              </CardDescription>
            </CardHeader>
            <CardContent>
              {user && (
                <CustomerProfileForm
                  currentUser={user}
                  isProcessing={isProcessing}
                  setIsProcessing={setIsProcessing}
                />
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => navigate("/enquiries")}>
                Go to Enquiries
              </Button>
              <Button 
                variant="default" 
                onClick={() => refreshProfile()}
                disabled={isProcessing}
              >
                Refresh Profile
              </Button>
            </CardFooter>
          </Card>
        </Container>
      </main>
    </div>
  );
}
