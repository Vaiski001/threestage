import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { supabase } from "@/lib/supabase/client";
import { signInWithGoogle } from "@/lib/supabase/auth";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type FormValues = z.infer<typeof formSchema>;

export function CustomerSignupForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [signupError, setSignupError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    // Reset state
    setIsLoading(true);
    setSignupError(null);
    
    try {
      console.log("[CustomerSignup] Starting signup process with email:", values.email);
      
      // Step 1: Create auth user with Supabase Auth - ONLY this step, no auto login
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            name: values.name,
            role: "customer"
          },
          emailRedirectTo: `${window.location.origin}/login`
        }
      });
      
      if (authError) {
        console.error("[CustomerSignup] Auth error during signup:", authError);
        throw authError;
      }
      
      if (!authData.user) {
        console.error("[CustomerSignup] No user returned from auth signup");
        throw new Error("Failed to create user account");
      }
      
      console.log("[CustomerSignup] Auth signup successful for user:", authData.user.id);
      
      // Step 2: Create the profile record in the database
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          email: values.email,
          name: values.name,
          role: "customer",
          created_at: new Date().toISOString()
        });
      
      if (profileError) {
        console.error("[CustomerSignup] Profile creation error:", profileError);
        // Continue anyway since the auth user was created
      } else {
        console.log("[CustomerSignup] Profile created successfully");
      }
      
      // Step 3: Show success message
      toast({
        title: "Account created successfully!",
        description: "Please check your email to confirm your account, then sign in."
      });
      
      // Clear form
      form.reset();
      
      // Force the page state to update before redirecting
      setIsLoading(false);
      
      // Add a delay and then navigate to login page
      console.log("[CustomerSignup] Preparing to redirect to login page...");
      setTimeout(() => {
        console.log("[CustomerSignup] Now redirecting to login page");
        window.location.href = "/login"; // Use direct navigation instead of React Router for complete reset
      }, 1000); // Increased delay to ensure all state updates and UI changes are complete
      
      return; // Exit early to prevent the finally block from running
      
    } catch (error: any) {
      console.error("[CustomerSignup] Signup error:", error);
      
      // Display user-friendly error message
      const errorMessage = getErrorMessage(error);
      setSignupError(errorMessage);
      
      toast({
        title: "Signup Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      // Only set isLoading to false if we didn't redirect (i.e., there was an error)
      setIsLoading(false);
    }
  };

  const getErrorMessage = (error: any): string => {
    // Handle specific Supabase error codes
    if (error.code === "23505") {
      return "This email is already registered. Please log in instead.";
    }
    
    if (error.message?.includes("duplicate key")) {
      return "This email is already registered. Please log in instead.";
    }
    
    // Return user-friendly message or fallback to original error message
    return error.message || "Failed to create account. Please try again.";
  };

  const handleGoogleSignup = async () => {
    try {
      console.log("[CustomerSignup] Starting Google signup process");
      await signInWithGoogle();
      // The redirect to Google OAuth will happen automatically
    } catch (error: any) {
      console.error("[CustomerSignup] Google signup error:", error);
      return error.message || "Failed to sign up with Google. Please try again.";
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Create a Customer Account</CardTitle>
        <CardDescription>
          Sign up to submit enquiries and track responses
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form id="customer-signup-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="you@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {signupError && (
              <Alert variant="destructive">
                <AlertDescription>{signupError}</AlertDescription>
              </Alert>
            )}
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="text-center w-full">
          <span className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Button variant="link" className="p-0" onClick={() => navigate("/login")}>
              Log in
            </Button>
          </span>
        </div>
        <div className="relative w-full">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>
        <Button variant="outline" className="w-full" onClick={handleGoogleSignup} disabled={isLoading}>
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
            <path d="M1 1h22v22H1z" fill="none" />
          </svg>
          Sign up with Google
        </Button>
      </CardFooter>
    </Card>
  );
}
