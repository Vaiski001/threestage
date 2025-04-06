import { useEffect, useState } from "react";
import { FormLabel } from "@/components/ui/form-label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UserProfile } from "@/lib/supabase/types";
import { SelectField } from "@/components/auth/SelectField";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { ImageUploader } from "./ImageUploader";
import { ImageUploaderEnhanced } from "./ImageUploaderEnhanced";
import { checkStorageBucket } from "@/lib/supabase/setupStorage";
import { StorageBucketErrorAlert } from "./StorageBucketErrorAlert";
import { AlertCircle, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface DirectBrandingTabProps {
  profile: UserProfile | null;
  onComplete: () => void;
}

const formSchema = z.object({
  company_name: z.string().min(1, "Company name is required"),
  industry: z.string().optional(),
  profile_description: z.string().max(500, "Description must be 500 characters or less").optional(),
});

export function DirectBrandingTab({ profile, onComplete }: DirectBrandingTabProps) {
  const [logoUrl, setLogoUrl] = useState<string | undefined>(undefined);
  const [bannerUrl, setBannerUrl] = useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string>("");
  const [bucketAvailable, setBucketAvailable] = useState<boolean | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check storage bucket on component mount
  useEffect(() => {
    const checkBucket = async () => {
      const available = await checkStorageBucket();
      setBucketAvailable(available);
    };
    
    checkBucket();
  }, []);

  // Debug function to check profile structure
  const debugProfile = async () => {
    if (!profile?.id) return;
    
    try {
      // Get raw data from database
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', profile.id)
        .single();
      
      if (error) {
        setDebugInfo(`Error fetching profile: ${error.message}`);
        return;
      }
      
      setDebugInfo(`Profile data: ${JSON.stringify(data, null, 2)}`);
    } catch (err: any) {
      setDebugInfo(`Exception: ${err.message}`);
    }
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      company_name: profile?.company_name || "",
      industry: profile?.industry || "",
      profile_description: profile?.profile_description || "",
    },
  });

  useEffect(() => {
    if (profile) {
      form.reset({
        company_name: profile.company_name || "",
        industry: profile.industry || "",
        profile_description: profile.profile_description || "",
      });
      
      // Try to get logo and banner from profile_branding JSON
      try {
        if (profile.profile_branding) {
          const branding = typeof profile.profile_branding === 'string' 
            ? JSON.parse(profile.profile_branding) 
            : profile.profile_branding;
            
          if (branding?.logo) {
            setLogoUrl(branding.logo);
          }
          
          if (branding?.banner) {
            setBannerUrl(branding.banner);
          }
        }
      } catch (error) {
        console.error("Error parsing profile branding:", error);
      }
    }
  }, [profile, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log("Form submitted with values:", values);
    
    if (isSubmitting) {
      console.log("Already submitting, skipping");
      return;
    }
    
    setIsSubmitting(true);
    console.log("Setting isSubmitting to true");
    
    // Skip image handling and use existing values if available
    // or null if not available
    let existingBranding: { logo?: string | null, banner?: string | null } = { logo: null, banner: null };
    
    // Safely extract existing branding data
    if (profile?.profile_branding) {
      try {
        if (typeof profile.profile_branding === 'string') {
          existingBranding = JSON.parse(profile.profile_branding);
        } else {
          existingBranding = profile.profile_branding as { logo?: string | null, banner?: string | null };
        }
        console.log("Extracted existing branding:", existingBranding);
      } catch (err) {
        console.error("Error parsing profile branding:", err);
      }
    }
    
    // Create branding data object using safely extracted values
    const brandingData = {
      logo: existingBranding.logo || null,
      banner: existingBranding.banner || null
    };
    
    // Convert to JSON string
    const brandingJson = JSON.stringify(brandingData);
    console.log("Branding JSON:", brandingJson);
    
    if (profile?.id) {
      console.log("Attempting to update profile for ID:", profile.id);
      try {
        // Try direct update instead of RPC first as a fallback
        console.log("Performing direct update as fallback");
        const directUpdate = await supabase
          .from('profiles')
          .update({
            company_name: values.company_name,
            industry: values.industry,
            profile_description: values.profile_description,
            profile_branding: brandingJson
          })
          .eq('id', profile.id);
          
        if (directUpdate.error) {
          console.error("Direct update failed, trying RPC:", directUpdate.error);
        } else {
          console.log("Direct update succeeded:", directUpdate.data);
          
          // Show success toast
          toast({
            title: "Profile updated",
            description: "Your changes have been saved.",
          });
          
          // Refresh data
          queryClient.invalidateQueries({ queryKey: ["profile"] });
          onComplete();
          setIsSubmitting(false);
          return;
        }

        // Fallback to RPC if direct update failed
        console.log("Attempting RPC call");
        const { data, error } = await supabase.rpc('update_company_branding', {
          user_id: profile.id,
          company_name: values.company_name,
          industry: values.industry,
          description: values.profile_description,
          branding_json: brandingJson
        });
        
        if (error) {
          console.error("RPC function call error:", error);
          setDebugInfo(`RPC error: ${JSON.stringify(error, null, 2)}`);
          
          toast({
            title: "Error updating profile",
            description: error.message,
            variant: "destructive",
          });
        } else {
          console.log("Update successful via RPC function!", data);
          setDebugInfo(`Update successful! Result: ${JSON.stringify(data, null, 2)}`);
          
          // Show success toast
          toast({
            title: "Profile updated",
            description: "Your changes have been saved.",
          });
          
          // Refresh data
          queryClient.invalidateQueries({ queryKey: ["profile"] });
          onComplete();
        }
      } catch (err: any) {
        console.error("Exception during update:", err);
        setDebugInfo(`Exception: ${err.message}`);
        
        toast({
          title: "Error updating profile",
          description: err.message,
          variant: "destructive",
        });
      }
    } else {
      console.error("No profile ID available");
      toast({
        title: "Error updating profile",
        description: "No profile ID available",
        variant: "destructive",
      });
    }
    
    setIsSubmitting(false);
    console.log("Form submission complete");
  };

  const industries = [
    "Technology",
    "Healthcare",
    "Finance",
    "Education",
    "Retail",
    "Manufacturing",
    "Hospitality",
    "Construction",
    "Entertainment",
    "Other",
  ];

  // Debug form submission handling
  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    console.log("Form handleSubmit triggered with:", values);
    onSubmit(values);
  };

  const handleFormError = (errors: any) => {
    console.error("Form validation errors:", errors);
    toast({
      title: "Form validation failed",
      description: "Please check the form for errors",
      variant: "destructive",
    });
  };

  return (
    <div className="p-6 bg-white rounded-lg border">
      <h2 className="text-2xl font-bold mb-6">Branding & Basic Information</h2>

      <Alert className="mb-6">
        <Info className="h-4 w-4" />
        <AlertTitle>Image upload temporarily disabled</AlertTitle>
        <AlertDescription>
          Image upload functionality is temporarily disabled due to technical issues. 
          You can still save all other company information. Your previously uploaded images (if any) will be preserved.
        </AlertDescription>
      </Alert>

      {bucketAvailable === false && (
        <StorageBucketErrorAlert onDismiss={() => setBucketAvailable(null)} />
      )}

      <Form {...form}>
        <form 
          onSubmit={form.handleSubmit(handleSubmit, handleFormError)}
          className="space-y-6"
          onClick={(e) => console.log("Form clicked:", e.target)}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <FormLabel>Company Logo</FormLabel>
              <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center text-center h-48 bg-gray-50">
                {logoUrl ? (
                  <img 
                    src={logoUrl} 
                    alt="Company logo" 
                    className="max-h-32 max-w-full object-contain"
                  />
                ) : (
                  <div className="text-muted-foreground">
                    <AlertCircle className="h-10 w-10 mx-auto mb-2 text-gray-400" />
                    <p className="font-medium">Image upload temporarily unavailable</p>
                    <p className="text-sm">Previous uploads will be preserved</p>
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-2">Recommended size: 400x400px. Max file size: 2MB.</p>
            </div>

            <div>
              <FormLabel>Banner Image</FormLabel>
              <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center text-center h-48 bg-gray-50">
                {bannerUrl ? (
                  <img 
                    src={bannerUrl} 
                    alt="Banner image" 
                    className="max-h-32 max-w-full object-contain"
                  />
                ) : (
                  <div className="text-muted-foreground">
                    <AlertCircle className="h-10 w-10 mx-auto mb-2 text-gray-400" />
                    <p className="font-medium">Image upload temporarily unavailable</p>
                    <p className="text-sm">Previous uploads will be preserved</p>
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-2">Recommended size: 1200x300px. Max file size: 5MB.</p>
            </div>
          </div>

          <div>
            <FormLabel htmlFor="company_name">Company Name</FormLabel>
            <Input
              id="company_name"
              placeholder="Enter your company name"
              {...form.register("company_name")}
              className="w-full"
            />
            {form.formState.errors.company_name && (
              <p className="text-sm text-red-500 mt-1">{form.formState.errors.company_name.message}</p>
            )}
          </div>

          <div>
            <FormLabel htmlFor="field-industry">Industry</FormLabel>
            <SelectField
              form={form}
              name="industry"
              label=""
              placeholder="Select an industry"
              options={industries}
            />
          </div>

          <div>
            <FormLabel htmlFor="profile_description">Company Description</FormLabel>
            <Textarea
              id="profile_description"
              placeholder="Briefly describe your company and what you do"
              {...form.register("profile_description")}
              className="w-full min-h-32"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Max 500 characters. This will appear in search results and at the top of your profile.
            </p>
            {form.formState.errors.profile_description && (
              <p className="text-sm text-red-500 mt-1">{form.formState.errors.profile_description.message}</p>
            )}
          </div>

          <div className="pt-4 flex gap-4">
            <Button 
              type="submit" 
              className="w-full md:w-auto"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
            
            <Button
              type="button" 
              variant="secondary"
              disabled={isSubmitting}
              onClick={() => {
                const values = form.getValues();
                console.log("Manual form submission with values:", values);
                onSubmit(values);
              }}
            >
              Manual Save
            </Button>
            
            <Button 
              type="button"
              variant="outline"
              onClick={debugProfile}
            >
              Debug Profile
            </Button>
          </div>
          
          {debugInfo && (
            <div className="mt-4 p-4 bg-gray-100 rounded-md overflow-auto max-h-60">
              <pre className="text-xs">{debugInfo}</pre>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
} 