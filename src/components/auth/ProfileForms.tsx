
import React from 'react';
import { useNavigate } from "react-router-dom";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

// Schema definitions
const companyFormSchema = z.object({
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  phone: z.string().optional(),
  industry: z.string().min(1, "Please select an industry"),
  website: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  integrations: z.array(z.string()).optional(),
});

const customerFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().optional(),
});

type CompanyFormValues = z.infer<typeof companyFormSchema>;
type CustomerFormValues = z.infer<typeof customerFormSchema>;

// Constants
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

const integrationOptions = [
  { id: "whatsapp", label: "WhatsApp" },
  { id: "facebook", label: "Facebook Messenger" },
  { id: "instagram", label: "Instagram DM" },
  { id: "email", label: "Email" },
];

interface CompanyProfileFormProps {
  currentUser: User;
  isProcessing: boolean;
  setIsProcessing: (value: boolean) => void;
}

export const CompanyProfileForm = ({ currentUser, isProcessing, setIsProcessing }: CompanyProfileFormProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: {
      companyName: "",
      phone: "",
      industry: "",
      website: "",
      integrations: [],
    },
  });

  const handleSubmit = async (values: CompanyFormValues) => {
    if (!currentUser) return;
    
    setIsProcessing(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          company_name: values.companyName,
          phone: values.phone || undefined,
          industry: values.industry,
          website: values.website || undefined,
          integrations: values.integrations,
          role: 'company',
        })
        .eq('id', currentUser.id);
      
      if (error) throw error;
      
      toast({
        title: "Profile updated",
        description: "Your company account has been set up successfully.",
      });
      
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
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
                <Input placeholder="Enter your company name" {...field} />
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
                <Input placeholder="Enter your phone number" {...field} />
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
                <Input placeholder="https://your-company.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="integrations"
          render={() => (
            <FormItem>
              <div className="mb-2">
                <FormLabel>Messaging Integrations (Optional)</FormLabel>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {integrationOptions.map((option) => (
                  <FormField
                    key={option.id}
                    control={form.control}
                    name="integrations"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={option.id}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(option.id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value || [], option.id])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== option.id
                                      )
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {option.label}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isProcessing}>
          {isProcessing ? "Processing..." : "Complete Sign Up"}
        </Button>
      </form>
    </Form>
  );
};

interface CustomerProfileFormProps {
  currentUser: User;
  isProcessing: boolean;
  setIsProcessing: (value: boolean) => void;
}

export const CustomerProfileForm = ({ currentUser, isProcessing, setIsProcessing }: CustomerProfileFormProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: {
      name: "",
      phone: "",
    },
  });

  // Try to get the existing profile data
  React.useEffect(() => {
    const loadProfileData = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', currentUser.id)
          .single();
          
        if (error) {
          console.error("Error loading profile data:", error);
          return;
        }
        
        if (data) {
          console.log("Loaded profile data:", data);
          form.setValue('name', data.name || '');
          form.setValue('phone', data.phone || '');
        }
      } catch (error) {
        console.error("Failed to load profile data:", error);
      }
    };
    
    loadProfileData();
  }, [currentUser.id, form]);

  const handleSubmit = async (values: CustomerFormValues) => {
    if (!currentUser) return;
    
    setIsProcessing(true);
    try {
      console.log("Updating customer profile with:", values);
      
      const { error } = await supabase
        .from('profiles')
        .update({
          name: values.name,
          phone: values.phone || null,
          role: 'customer',
        })
        .eq('id', currentUser.id);
      
      if (error) throw error;
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
      
      navigate("/profile");
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
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
                <Input placeholder="Enter your full name" {...field} />
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
                <Input placeholder="Enter your phone number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isProcessing}>
          {isProcessing ? "Saving..." : "Save Profile"}
        </Button>
      </form>
    </Form>
  );
};
