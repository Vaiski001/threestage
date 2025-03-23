
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

interface BrandingInfoTabProps {
  profile: UserProfile | null;
  onUpdate: (values: any) => void;
}

const formSchema = z.object({
  company_name: z.string().min(1, "Company name is required"),
  industry: z.string().optional(),
  profile_description: z.string().max(500, "Description must be 500 characters or less").optional(),
});

export function BrandingInfoTab({ profile, onUpdate }: BrandingInfoTabProps) {
  const [logoUrl, setLogoUrl] = useState<string | undefined>(profile?.profile_logo);
  const [bannerUrl, setBannerUrl] = useState<string | undefined>(profile?.profile_banner);

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
      setLogoUrl(profile.profile_logo);
      setBannerUrl(profile.profile_banner);
    }
  }, [profile, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Combine form values with logo and banner URLs
    const updatedValues = {
      ...values,
      profile_logo: logoUrl,
      profile_banner: bannerUrl,
    };
    onUpdate(updatedValues);
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
        <form onChange={form.handleSubmit(onSubmit)} className="space-y-6">
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
            <FormLabel htmlFor="industry">Industry</FormLabel>
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
        </form>
      </Form>
    </div>
  );
}
