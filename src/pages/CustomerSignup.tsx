
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { CustomerSignupForm } from "@/components/auth/CustomerSignupForm";
import { Container } from "@/components/ui/Container";
import { supabase } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function CustomerSignup() {
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkExistingSession = async () => {
      try {
        console.log("CustomerSignup: Checking for existing session");
        // Check if user already has a session
        const { data } = await supabase.auth.getSession();
        
        if (data.session) {
          // User is already logged in, redirect based on role
          const role = data.session.user.user_metadata?.role || "customer";
          
          toast({
            title: "Already logged in",
            description: "You are already logged in.",
          });
          
          if (role === "company") {
            navigate("/dashboard");
          } else {
            navigate("/profile");
          }
        } else {
          console.log("CustomerSignup: No existing session found, showing signup form");
        }
      } catch (error) {
        console.error("Error checking session:", error);
      } finally {
        setIsCheckingAuth(false);
      }
    };
    
    checkExistingSession();
  }, [navigate, toast]);
  
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="py-16">
          <Container size="sm">
            <div className="flex justify-center items-center">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          </Container>
        </main>
      </div>
    );
  }

  console.log("CustomerSignup: Rendering signup form");
  return (
    <div className="min-h-screen">
      <Header />
      <main className="py-16">
        <Container size="sm">
          <CustomerSignupForm />
        </Container>
      </main>
    </div>
  );
}
