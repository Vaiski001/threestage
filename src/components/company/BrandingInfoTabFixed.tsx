import { useEffect, useState } from "react";
import { FormLabel } from "@/components/ui/form-label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UploadIcon } from "lucide-react";
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

interface BrandingInfoTabProps {
  profile: UserProfile | null;
  onUpdate: (values: any) => void;
}

const formSchema = z.object({
  company_name: z.string().min(1, "Company name is required"),
  industry: z.string().optional(),
  profile_description: z.string().max(500, "Description must be 500 characters or less").optional(),
});

export function BrandingInfoTabFixed({ profile, onUpdate }: BrandingInfoTabProps) {
  const [logoUrl, setLogoUrl] = useState<string | undefined>(undefined);
  const [bannerUrl, setBannerUrl] = useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string>("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

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
      
      // Get table structure
      const { data: columns, error: columnsError } = await supabase
        .rpc('get_table_columns', { table_name: 'profiles' });
      
      if (columnsError) {
        setDebugInfo(`Error fetching columns: ${columnsError.message}`);
        return;
      }
      
      setDebugInfo(
        `Profile data: ${JSON.stringify(data, null, 2)}\n\n` +
        `Table columns: ${JSON.stringify(columns, null, 2)}`
      );
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
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    // Step 1: Create branding data without using direct fields
    const brandingData = {
      logo: logoUrl,
      banner: bannerUrl
    };
    
    // Convert to JSON string
    const brandingJson = JSON.stringify(brandingData);
    
    if (profile?.id) {
      try {
        // Use the new update_company_branding function that handles all fields safely
        const { data, error } = await supabase.rpc('update_company_branding', {
          user_id: profile.id,
          company_name: values.company_name,
          industry: values.industry,
          description: values.profile_description,
          branding_json: brandingJson
        });
        
        if (error) {
          console.error("Function call error:", error);
          setDebugInfo(`RPC error: ${JSON.stringify(error, null, 2)}`);
          
          toast({
            title: "Error updating profile",
            description: error.message,
            variant: "destructive",
          });
        } else {
          console.log("Update successful via function!", data);
          setDebugInfo(`Update successful! Result: ${JSON.stringify(data, null, 2)}`);
          
          // Show success toast
          toast({
            title: "Profile updated",
            description: "Your changes have been saved.",
          });
          
          // Just tell the parent we're done - it will refresh the data
          onUpdate({});
        }
      } catch (err: any) {
        console.error("Exception during function call:", err);
        setDebugInfo(`Exception: ${err.message}`);
        
        toast({
          title: "Error updating profile",
          description: err.message,
          variant: "destructive",
        });
      }
    }
    
    setIsSubmitting(false);
  };

  // Handle file uploads
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real implementation, you'd upload to storage and get URL
      const tempUrl = URL.createObjectURL(file);
      setLogoUrl(tempUrl);
    }
  };

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real implementation, you'd upload to storage and get URL
      const tempUrl = URL.createObjectURL(file);
      setBannerUrl(tempUrl);
    }
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

  return (
    <div className="p-6 bg-white rounded-lg border">
      <h2 className="text-2xl font-bold mb-6">Branding & Basic Information</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <FormLabel htmlFor="logo-upload">Company Logo</FormLabel>
              <div 
                className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center text-center h-48 bg-gray-50 cursor-pointer"
                onClick={() => document.getElementById("logo-upload")?.click()}
              >
                {logoUrl ? (
                  <img 
                    src={logoUrl} 
                    alt="Company logo" 
                    className="max-h-32 max-w-full object-contain"
                  />
                ) : (
                  <>
                    <UploadIcon className="h-10 w-10 text-gray-400 mb-2" />
                    <p className="font-medium">Upload company logo</p>
                    <p className="text-sm text-muted-foreground">Drag and drop or click to browse</p>
                  </>
                )}
                <input 
                  type="file" 
                  id="logo-upload" 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleLogoUpload}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">Recommended size: 400x400px. Max file size: 2MB.</p>
            </div>

            <div>
              <FormLabel htmlFor="banner-upload">Banner Image</FormLabel>
              <div 
                className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center text-center h-48 bg-gray-50 cursor-pointer"
                onClick={() => document.getElementById("banner-upload")?.click()}
              >
                {bannerUrl ? (
                  <img 
                    src={bannerUrl} 
                    alt="Banner image" 
                    className="max-h-32 max-w-full object-contain"
                  />
                ) : (
                  <>
                    <UploadIcon className="h-10 w-10 text-gray-400 mb-2" />
                    <p className="font-medium">Upload banner image</p>
                    <p className="text-sm text-muted-foreground">Drag and drop or click to browse</p>
                  </>
                )}
                <input 
                  type="file" 
                  id="banner-upload" 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleBannerUpload}
                />
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
              Save Changes
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