
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase, isSupabaseAvailable } from "@/lib/supabase";
import { signInWithGoogle } from "@/lib/supabase/auth";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Eye, EyeOff, AlertCircle } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [supabaseError, setSupabaseError] = useState<string | null>(null);
  const [isCheckingConnection, setIsCheckingConnection] = useState(false);
  const { toast } = useToast();
  
  // Check Supabase availability on component mount - with a timeout to prevent UI getting stuck
  useEffect(() => {
    let isMounted = true;
    
    const checkSupabaseAvailability = async () => {
      if (!isMounted) return;
      
      setIsCheckingConnection(true);
      
      // Add a timeout to make sure we don't block the UI indefinitely
      const timeoutId = setTimeout(() => {
        if (isMounted) {
          console.log("Availability check timed out, allowing form interaction");
          setIsCheckingConnection(false);
        }
      }, 3000); // 3 second timeout
      
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
  
  // Initialize form
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
      
      // First, check if the user already exists to avoid rate limit issues
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
      
      // Attempt to create the user with auto-confirmation
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            name: values.name,
            role: "customer",
          },
          emailRedirectTo: window.location.origin + "/dashboard"
        }
      });
      
      console.log("Signup response received:", { 
        success: !!data.user, 
        hasError: !!error,
        user: data.user,
        session: data.session
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
      
      // Create profile in the profiles table regardless of email confirmation
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
        // Continue anyway as the auth user was created
      } else {
        console.log("Profile created successfully for user:", data.user.id);
      }
      
      // Success! Show a toast notification
      toast({
        title: "Account created",
        description: "Your account has been successfully created.",
      });
      
      // Safety: Using setTimeout to ensure state updates properly complete
      setTimeout(() => {
        setIsLoading(false);
        onSuccess();
      }, 500);
      
    } catch (error: any) {
      console.error("Signup error:", error);
      
      // Handle common error cases
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
      
      // Always reset loading state when there's an error
      setIsLoading(false);
      onError(errorMessage);
    }
  };

  const handleGoogleSignup = async () => {
    setIsGoogleLoading(true);
    try {
      // Store role in localStorage for post-OAuth processing
      localStorage.setItem('oauth_role', 'customer');
      
      await signInWithGoogle('customer');
      // Note: The page will redirect to Google's OAuth flow
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
      
      setIsGoogleLoading(false);
      onError(errorMessage);
    }
  };

  return (
    <div className="space-y-6">
      {supabaseError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{supabaseError}</AlertDescription>
        </Alert>
      )}
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} disabled={isLoading} />
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
                  <Input 
                    type="email" 
                    placeholder="you@example.com" 
                    {...field} 
                    disabled={isLoading}
                  />
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
                      placeholder="••••••••"
                      {...field}
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
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

      <Button
        variant="outline"
        type="button"
        disabled={isGoogleLoading}
        className="w-full"
        onClick={handleGoogleSignup}
      >
        {isGoogleLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
            <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
            <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
            <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
          </svg>
        )}
        Sign up with Google
      </Button>
    </div>
  );
}
