
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
    let isMounted = true; // Track if component is still mounted
    
    const checkExistingSession = async () => {
      try {
        console.log("CustomerSignup: Checking for existing session");
        
        // Check if user already has a session
        const { data } = await supabase.auth.getSession();
        
        // Guard against state updates after unmount
        if (!isMounted) return;
        
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
          // Explicitly handle the case where there's no session
          console.log("CustomerSignup: No existing session found, showing signup form");
          setIsCheckingAuth(false);
        }
      } catch (error) {
        // Guard against state updates after unmount
        if (!isMounted) return;
        
        console.error("Error checking session:", error);
        setIsCheckingAuth(false);
      }
    };
    
    console.log("CustomerSignup: Component mounted");
    
    // Check session immediately
    checkExistingSession();
    
    // Add a shorter safety timeout to ensure the loader doesn't get stuck
    const timeoutId = setTimeout(() => {
      if (isMounted) {
        console.log("CustomerSignup: Safety timeout triggered after 1.5s, forcing isCheckingAuth to false");
        setIsCheckingAuth(false);
      }
    }, 1500);
    
    // Cleanup function
    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      console.log("CustomerSignup: Component unmounted");
    };
  }, [navigate, toast]);
  
  if (isCheckingAuth) {
    console.log("CustomerSignup: Showing loading state");
    return (
      <div className="min-h-screen">
        <Header />
        <main className="py-16">
          <Container size="sm">
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm text-muted-foreground">Checking authentication status...</p>
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
