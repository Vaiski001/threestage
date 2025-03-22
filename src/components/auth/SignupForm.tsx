import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Eye, EyeOff } from "lucide-react";

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
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  
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
      
      // Attempt to create the user
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            name: values.name,
            role: "customer",
          }
        }
      });
      
      console.log("Signup response received:", { 
        success: !!data.user, 
        hasError: !!error 
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
      
      // Wait a moment to ensure the auth state is updated
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Create profile in the profiles table
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
        
        // If we failed to create the profile but the user was created,
        // we should still consider it a success and let them continue
        if (data.user) {
          toast({
            title: "Account created",
            description: "Your account has been created but some profile information may be incomplete. You can update it later.",
          });
          
          setTimeout(() => {
            setIsLoading(false);
            onSuccess();
          }, 500);
          return;
        }
        
        throw profileError;
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

  return (
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
          ) : (
            "Create Account"
          )}
        </Button>
      </form>
    </Form>
  );
}
