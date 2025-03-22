
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
      // Set a reasonable timeout for the Supabase request
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Signup request timed out. Please try again.")), 8000)
      );
      
      const signupPromise = supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            name: values.name,
            role: "customer",
          }
        }
      });
      
      // Race the signup request against the timeout
      const { data, error } = await Promise.race([
        signupPromise,
        timeoutPromise as Promise<any>
      ]);
      
      if (error) throw error;
      
      if (!data.user) {
        throw new Error("No user returned from signup. Please try again.");
      }
      
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
        
      if (profileError) throw profileError;
      
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
      } else if (error.message?.includes("timed out")) {
        errorMessage = "The request timed out. Please check your internet connection and try again.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
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
