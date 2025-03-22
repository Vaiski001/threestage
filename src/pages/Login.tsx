
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { LoginForm } from "@/components/auth/LoginForm";
import { Container } from "@/components/ui/Container";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkExistingSession = async () => {
      try {
        // Check if user has an existing session
        const { data } = await supabase.auth.getSession();
        
        if (data.session) {
          // Get user metadata to determine role
          const user = data.session.user;
          const role = user.user_metadata?.role || "customer";
          
          toast({
            title: "Welcome back!",
            description: "You have been automatically logged in.",
          });
          
          // Redirect based on user role
          if (role === "company") {
            navigate("/dashboard");
          } else {
            navigate("/enquiries");
          }
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
      <>
        <Header />
        <main className="py-16">
          <Container size="sm">
            <div className="flex justify-center items-center min-h-[300px]">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          </Container>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="py-16">
        <Container size="sm">
          <LoginForm />
        </Container>
      </main>
    </>
  );
}
