
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  
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
        // Continue anyway as the auth user was created
      } else {
        console.log("Company profile created successfully for user:", data.user.id);
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
  );
}
