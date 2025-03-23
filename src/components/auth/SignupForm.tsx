import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase, isSupabaseAvailable } from "@/lib/supabase";
import { signInWithGoogle } from "@/lib/supabase/auth";
import { useToast } from "@/hooks/use-toast";
import { Loader2, AlertCircle } from "lucide-react";

import {
  Form,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InputField } from "./InputField";
import { FormPasswordField } from "./FormPasswordField";
import { GoogleButton } from "./GoogleButton";
import { EmailVerificationMessage } from "./EmailVerificationMessage";

// Validation schema
const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
});

type SignupFormValues = z.infer<typeof signupSchema>;

interface SignupFormProps {
  onSuccess: () => void;
  onError: (message: string) => void;
}

export function SignupForm({ onSuccess, onError }: SignupFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [supabaseError, setSupabaseError] = useState<string | null>(null);
  const [isCheckingConnection, setIsCheckingConnection] = useState(false);
  const [signupComplete, setSignupComplete] = useState(false);
  const [userEmail, setUserEmail] = useState<string>("");
  const { toast } = useToast();
  
  useEffect(() => {
    let isMounted = true;
    
    const checkSupabaseAvailability = async () => {
      if (!isMounted) return;
      
      setIsCheckingConnection(true);
      
      const timeoutId = setTimeout(() => {
        if (isMounted) {
          console.log("Availability check timed out, allowing form interaction");
          setIsCheckingConnection(false);
        }
      }, 3000);
      
      try {
        const isAvailable = await isSupabaseAvailable();
        if (isMounted) {
          if (!isAvailable) {
            setSupabaseError("Supabase services may be experiencing issues. Some features might not work correctly.");
            toast({
              title: "Connection Issue",
              description: "Having trouble connecting to our services. You can still try to sign up.",
              variant: "default"
            });
          } else {
            setSupabaseError(null);
          }
        }
      } catch (error) {
        if (isMounted) {
          console.error("Error checking Supabase availability:", error);
          setSupabaseError("Unable to verify connection to authentication services.");
        }
      } finally {
        clearTimeout(timeoutId);
        if (isMounted) {
          setIsCheckingConnection(false);
        }
      }
    };
    
    checkSupabaseAvailability();
    
    return () => {
      isMounted = false;
    };
  }, [toast]);
  
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const handleSubmit = async (values: SignupFormValues) => {
    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      console.log("Starting signup process with values:", { 
        email: values.email,
        name: values.name,
        passwordLength: values.password.length 
      });
      
      const { data: existingUser, error: checkError } = await supabase
        .from('profiles')
        .select('email')
        .eq('email', values.email)
        .maybeSingle();
        
      if (checkError && checkError.code !== 'PGRST116') {
        console.error("Error checking existing user:", checkError);
      }
      
      if (existingUser) {
        throw new Error("This email is already registered. Please use a different email or try logging in.");
      }
      
      const redirectUrl = `${window.location.origin}/auth/callback?role=customer&account_type=customer`;
      console.log("Setting redirect URL for email verification:", redirectUrl);
      
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            name: values.name,
            role: "customer",
          },
          emailRedirectTo: redirectUrl
        }
      });
      
      console.log("Signup response received:", { 
        success: !!data.user, 
        hasError: !!error,
        user: data.user,
        session: data.session,
        emailConfirmation: data.user?.email_confirmed_at ? "confirmed" : "pending"
      });
      
      if (error) {
        if (error.message?.includes("rate limit")) {
          throw new Error("Too many signup attempts. Please wait a minute and try again.");
        }
        throw error;
      }
      
      if (!data.user) {
        throw new Error("No user returned from signup. Please try again.");
      }

      console.log("📧 Email confirmation status:", {
        isEmailConfirmed: data.user.email_confirmed_at,
        identities: data.user.identities,
        providerToken: data.session?.provider_token || "none"
      });
      
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          name: values.name,
          email: values.email,
          role: 'customer',
          created_at: new Date().toISOString(),
        });
        
      if (profileError) {
        console.error("Error creating profile:", profileError);
      } else {
        console.log("Profile created successfully for user:", data.user.id);
      }
      
      setUserEmail(values.email);
      
      toast({
        title: "Account created",
        description: "Please check your email for verification instructions to complete your account setup.",
      });
      
      setSignupComplete(true);
      setIsLoading(false);
      
    } catch (error: any) {
      console.error("Signup error:", error);
      
      let errorMessage = "Failed to create account. Please try again.";
      
      if (error.message?.includes("email address is already registered")) {
        errorMessage = "This email is already registered. Please use a different email or try logging in.";
      } else if (error.message?.includes("rate limit") || error.message?.includes("security purposes")) {
        errorMessage = "Too many signup attempts. Please wait a minute and try again.";
      } else if (error.message?.includes("timed out")) {
        errorMessage = "The request timed out. Please check your internet connection and try again.";
      } else if (error.message?.includes("network") || error.status === 404 || error.status === 429) {
        errorMessage = "Network error. Please check your internet connection and try again.";
      } else if (error.message?.includes("unavailable") || error.message?.includes("maintenance")) {
        errorMessage = "Supabase services are currently unavailable. Please try again later.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Signup failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      setIsLoading(false);
      onError(errorMessage);
    }
  };

  const handleGoogleSignup = async (role: 'customer' | 'company' = 'customer') => {
    try {
      localStorage.setItem('oauth_role', role);
      
      await signInWithGoogle(role);
    } catch (error: any) {
      console.error("Google signup error:", error);
      
      let errorMessage = "Failed to initiate Google signup. Please try again.";
      if (error.message?.includes("unavailable") || error.message?.includes("maintenance")) {
        errorMessage = "Supabase services are currently unavailable. Please try again later.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Google signup failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      onError(errorMessage);
    }
  };

  if (signupComplete) {
    return <EmailVerificationMessage role="customer" email={userEmail} />;
  }

  return (
    <div className="space-y-6">
      {supabaseError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{supabaseError}</AlertDescription>
        </Alert>
      )}
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4" aria-label="Customer signup form">
          <InputField
            form={form}
            name="name"
            label="Full Name"
            placeholder="John Doe"
            disabled={isLoading}
          />
          
          <InputField
            form={form}
            name="email"
            label="Email"
            placeholder="you@example.com"
            type="email"
            disabled={isLoading}
          />
          
          <FormPasswordField
            form={form}
            name="password"
            label="Password"
            disabled={isLoading}
          />
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Account...
              </>
            ) : isCheckingConnection ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Checking Services...
              </>
            ) : (
              "Create Account"
            )}
          </Button>
        </form>
      </Form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <GoogleButton role="customer" onGoogleSignup={handleGoogleSignup} />
    </div>
  );
}
