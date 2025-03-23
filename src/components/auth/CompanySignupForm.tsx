import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/lib/supabase";
import { signInWithGoogle } from "@/lib/supabase/auth";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  Form,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { InputField } from "./InputField";
import { FormPasswordField } from "./FormPasswordField";
import { SelectField } from "./SelectField";
import { GoogleButton } from "./GoogleButton";
import { EmailVerificationMessage } from "./EmailVerificationMessage";

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
  const [signupComplete, setSignupComplete] = useState(false);
  const [userEmail, setUserEmail] = useState<string>("");
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
    
    try {
      console.log("Starting company signup process with values:", { 
        email: values.email,
        companyName: values.companyName,
        contactName: values.contactName,
        industry: values.industry,
        passwordLength: values.password.length,
        role: "company" // Explicitly log role
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
      
      // FIXED: Explicitly set redirectTo with company role parameter
      const redirectUrl = `${window.location.origin}/auth/callback?role=company&account_type=company`;
      console.log("Setting redirect URL for company email verification:", redirectUrl);
      
      // IMPORTANT: Explicitly setting role to 'company' in user metadata
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            name: values.contactName,
            company_name: values.companyName,
            role: "company", // Explicitly set the role
            industry: values.industry,
            website: values.website || null,
            phone: values.phone || null,
          },
          // Use specific company redirect path
          emailRedirectTo: redirectUrl
        }
      });
      
      console.log("Company signup response received:", { 
        success: !!data.user, 
        hasError: !!error,
        user: data.user,
        session: data.session,
        role: data.user?.user_metadata?.role,
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
      
      // Check if confirmation email was sent
      console.log("📧 Email confirmation status for company:", {
        isEmailConfirmed: data.user.email_confirmed_at,
        identities: data.user.identities,
        providerToken: data.session?.provider_token || "none"
      });
      
      // Create profile in the profiles table regardless of email confirmation
      try {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            name: values.contactName,
            email: values.email,
            role: 'company', // Ensure role is always 'company'
            company_name: values.companyName,
            industry: values.industry,
            website: values.website || null,
            phone: values.phone || null,
            created_at: new Date().toISOString(),
          });
          
        if (profileError) {
          console.error("Error creating company profile:", profileError);
          
          // Handle specific error types as before
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
              description: "Please check your email for a verification link to activate your company account.",
              duration: 5000,
            });
            
            // Navigate to login page with a helpful message
            navigate('/login', { 
              state: { 
                message: "Your company account was created successfully. Please check your email for verification instructions." 
              } 
            });
            
            setIsLoading(false);
            return;
          }
          
          // General fallback error
          throw new Error(`Profile creation failed: ${profileError.message}`);
        } else {
          console.log("Company profile created successfully for user:", data.user.id);
          
          // Store email for verification message
          setUserEmail(values.email);
          
          // Show success message and verification screen
          toast({
            title: "Company account created",
            description: "Please check your email for verification instructions to complete your account setup.",
          });
          
          // Set signup complete to show verification message
          setSignupComplete(true);
          setIsLoading(false);
        }
      } catch (profileError: any) {
        console.error("Detailed profile creation error:", profileError);
        
        if (profileError.message?.includes("violates row-level security")) {
          // Handle RLS error specifically - the user was created but we couldn't create a profile
          await supabase.auth.signOut();
          
          toast({
            title: "Company account created",
            description: "Please check your email for a verification link to complete your company account setup.",
            duration: 5000,
          });
          
          navigate('/login', { 
            state: { 
              message: "Your company account was created successfully. Please check your email for verification instructions." 
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
      
    } catch (error: any) {
      console.error("Company signup error:", error);
      
      // Handle common error cases
      let errorMessage = "Failed to create company account. Please try again.";
      
      if (error.message?.includes("email address is already registered")) {
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

  const handleGoogleSignup = async (role: 'customer' | 'company' = 'company') => {
    try {
      // Store role in localStorage for post-OAuth processing
      localStorage.setItem('oauth_role', role);
      
      // Confirm it's set to 'company'
      console.log("Setting Google OAuth role:", role);
      
      await signInWithGoogle(role);
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
      
      onError(errorMessage);
    }
  };

  // Show verification message if signup is complete
  if (signupComplete) {
    return <EmailVerificationMessage role="company" email={userEmail} />;
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4" aria-label="Company signup form">
          <InputField
            form={form}
            name="companyName"
            label="Company Name"
            placeholder="Acme Inc."
            disabled={isLoading}
          />
          
          <InputField
            form={form}
            name="contactName"
            label="Contact Name"
            placeholder="John Doe"
            disabled={isLoading}
          />
          
          <InputField
            form={form}
            name="email"
            label="Business Email"
            placeholder="contact@acme.com"
            type="email"
            disabled={isLoading}
          />
          
          <FormPasswordField
            form={form}
            name="password"
            label="Password"
            disabled={isLoading}
          />
          
          <SelectField
            form={form}
            name="industry"
            label="Industry"
            placeholder="Select your industry"
            options={industries}
            disabled={isLoading}
          />
          
          <InputField
            form={form}
            name="website"
            label="Company Website"
            placeholder="https://acme.com"
            optional={true}
            disabled={isLoading}
          />
          
          <InputField
            form={form}
            name="phone"
            label="Phone Number"
            placeholder="+1 (123) 456-7890"
            optional={true}
            disabled={isLoading}
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

      <GoogleButton role="company" onGoogleSignup={handleGoogleSignup} />
    </div>
  );
}
