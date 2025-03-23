
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/lib/supabase";
import { signInWithGoogle } from "@/lib/supabase/auth";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Industry options
const industries = [
  "Technology",
  "Healthcare",
  "Finance",
  "Education",
  "Retail",
  "Manufacturing",
  "Hospitality",
  "Construction",
  "Real Estate",
  "Other",
];

// Validation schema
const companySignupSchema = z.object({
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  contactName: z.string().min(2, "Contact name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
  industry: z.string().min(1, "Please select your industry"),
  website: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  phone: z.string().optional(),
});

type CompanySignupFormValues = z.infer<typeof companySignupSchema>;

interface CompanySignupFormProps {
  onSuccess: () => void;
  onError: (message: string) => void;
}

export function CompanySignupForm({ onSuccess, onError }: CompanySignupFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [captchaError, setCaptchaError] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Initialize form
  const form = useForm<CompanySignupFormValues>({
    resolver: zodResolver(companySignupSchema),
    defaultValues: {
      companyName: "",
      contactName: "",
      email: "",
      password: "",
      industry: "",
      website: "",
      phone: "",
    },
  });

  const handleSubmit = async (values: CompanySignupFormValues) => {
    if (isLoading) return;
    
    setIsLoading(true);
    setCaptchaError(false);
    
    try {
      console.log("Starting company signup process with values:", { 
        email: values.email,
        companyName: values.companyName,
        contactName: values.contactName,
        industry: values.industry,
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
            name: values.contactName,
            company_name: values.companyName,
            role: "company",
            industry: values.industry,
            website: values.website || null,
            phone: values.phone || null,
          },
          emailRedirectTo: window.location.origin + "/dashboard"
        }
      });
      
      console.log("Company signup response received:", { 
        success: !!data.user, 
        hasError: !!error,
        user: data.user,
        session: data.session
      });
      
      if (error) {
        if (error.message?.includes("captcha")) {
          console.warn("CAPTCHA verification failed:", error.message);
          setCaptchaError(true);
          throw new Error("CAPTCHA verification failed. Please try using Google signup instead, or try again later.");
        }
        
        if (error.message?.includes("rate limit")) {
          throw new Error("Too many signup attempts. Please wait a minute and try again.");
        }
        throw error;
      }
      
      if (!data.user) {
        throw new Error("No user returned from signup. Please try again.");
      }
      
      // Create profile in the profiles table regardless of email confirmation
      try {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            name: values.contactName,
            email: values.email,
            role: 'company',
            company_name: values.companyName,
            industry: values.industry,
            website: values.website || null,
            phone: values.phone || null,
            created_at: new Date().toISOString(),
          });
          
        if (profileError) {
          console.error("Error creating company profile:", profileError);
          
          // Check for specific error types
          if (profileError.code === '23505') {
            throw new Error("This email is already registered. Please use a different email or try logging in.");
          } else if (profileError.code === '42P01') {
            throw new Error("Database setup issue. Please contact support with error code: 42P01");
          } else if (profileError.message?.includes("foreign key constraint")) {
            throw new Error("Authentication issue. Please try again or contact support.");
          } else if (profileError.message?.includes("violates row-level security")) {
            // The auth user was created, but we couldn't create a profile due to RLS
            // This is actually somewhat expected since RLS policies restrict anonymous inserts
            console.log("RLS policy prevented profile creation. This is expected. User should log in first.");
            
            await supabase.auth.signOut();
            
            // Show a helpful message and redirect to login
            toast({
              title: "Account created successfully",
              description: "Please log in with your new account credentials.",
              duration: 5000,
            });
            
            // Navigate to login page with a helpful message
            navigate('/login', { 
              state: { 
                message: "Your account was created successfully. Please log in with your new credentials." 
              } 
            });
            
            setIsLoading(false);
            return;
          }
          
          // General fallback error
          throw new Error(`Profile creation failed: ${profileError.message}`);
        } else {
          console.log("Company profile created successfully for user:", data.user.id);
        }
      } catch (profileError: any) {
        console.error("Detailed profile creation error:", profileError);
        
        if (profileError.message?.includes("violates row-level security")) {
          // Handle RLS error specifically - the user was created but we couldn't create a profile
          await supabase.auth.signOut();
          
          toast({
            title: "Account created",
            description: "Your account was created. Please sign in with your new credentials.",
            duration: 5000,
          });
          
          navigate('/login', { 
            state: { 
              message: "Your account was created successfully. Please log in with your new credentials." 
            } 
          });
          
          setIsLoading(false);
          return;
        }
        
        // Try to sign out the user if the profile creation failed for other reasons
        await supabase.auth.signOut();
        
        // Navigate to unauthorized page with error details
        navigate('/unauthorized', { 
          state: { 
            errorMessage: profileError.message || "Failed to create company profile. Please contact support." 
          } 
        });
        
        throw profileError;
      }
      
      // Success! Show a toast notification
      toast({
        title: "Company account created",
        description: "Your company account has been successfully created.",
      });
      
      // Safety: Using setTimeout to ensure state updates properly complete
      setTimeout(() => {
        setIsLoading(false);
        onSuccess();
      }, 500);
      
    } catch (error: any) {
      console.error("Company signup error:", error);
      
      // Handle common error cases
      let errorMessage = "Failed to create company account. Please try again.";
      
      if (error.message?.includes("captcha")) {
        errorMessage = "CAPTCHA verification failed. Please try using Google signup instead, or try again later.";
        setCaptchaError(true);
      } else if (error.message?.includes("email address is already registered")) {
        errorMessage = "This email is already registered. Please use a different email or try logging in.";
      } else if (error.message?.includes("rate limit") || error.message?.includes("security purposes")) {
        errorMessage = "Too many signup attempts. Please wait a minute and try again.";
      } else if (error.message?.includes("timed out")) {
        errorMessage = "The request timed out. Please check your internet connection and try again.";
      } else if (error.message?.includes("network") || error.status === 404 || error.status === 429) {
        errorMessage = "Network error. Please check your internet connection and try again.";
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
    setCaptchaError(false);
    try {
      // Store role in localStorage for post-OAuth processing
      localStorage.setItem('oauth_role', 'company');
      
      await signInWithGoogle('company');
      // Note: The page will redirect to Google's OAuth flow
    } catch (error: any) {
      console.error("Google company signup error:", error);
      
      let errorMessage = "Failed to initiate Google signup. Please try again.";
      if (error.message) {
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
      {captchaError && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4 mr-2" />
          <AlertDescription>
            CAPTCHA verification failed. Please try using Google signup instead, or try again later.
          </AlertDescription>
        </Alert>
      )}
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="companyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Name</FormLabel>
                <FormControl>
                  <Input placeholder="Acme Inc." {...field} disabled={isLoading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="contactName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Name</FormLabel>
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
                <FormLabel>Business Email</FormLabel>
                <FormControl>
                  <Input 
                    type="email" 
                    placeholder="contact@acme.com" 
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
          
          <FormField
            control={form.control}
            name="industry"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Industry</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your industry" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {industries.map((industry) => (
                      <SelectItem key={industry} value={industry}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Website (Optional)</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="https://acme.com" 
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
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number (Optional)</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="+1 (123) 456-7890" 
                    {...field} 
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Company Account...
              </>
            ) : (
              "Create Company Account"
            )}
          </Button>
        </form>
      </Form>

      {captchaError && (
        <Alert variant="default" className="bg-muted/50">
          <AlertDescription className="text-center text-sm">
            We recommend using Google Sign Up instead to avoid CAPTCHA issues.
          </AlertDescription>
        </Alert>
      )}

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
