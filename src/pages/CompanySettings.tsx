import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { UserProfile } from "@/lib/supabase/types";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw } from "lucide-react"; // Replaced UpdateIcon with RefreshCw from lucide-react

const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  company_name: z.string().optional(),
  phone: z.string().optional(),
  industry: z.string().optional(),
  website: z.string().optional(),
  profile_banner: z.string().optional(),
  profile_description: z.string().optional(),
  profile_color_scheme: z.string().optional(),
  facebook: z.string().optional(),
  twitter: z.string().optional(),
  linkedin: z.string().optional(),
  instagram: z.string().optional(),
  contact_email: z.string().email().optional(),
  contact_phone: z.string().optional(),
  contact_address: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const CompanySettings = () => {
  const { user } = useAuth();
  const [isBannerUploading, setIsBannerUploading] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        throw error;
      }

      return data as UserProfile;
    },
    enabled: !!user?.id,
  });

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: profile?.name || "",
      company_name: profile?.company_name || "",
      phone: profile?.phone || "",
      industry: profile?.industry || "",
      website: profile?.website || "",
      profile_banner: profile?.profile_banner || "",
      profile_description: profile?.profile_description || "",
      profile_color_scheme: profile?.profile_color_scheme || "",
      facebook: profile?.profile_social_links?.facebook || "",
      twitter: profile?.profile_social_links?.twitter || "",
      linkedin: profile?.profile_social_links?.linkedin || "",
      instagram: profile?.profile_social_links?.instagram || "",
      contact_email: profile?.profile_contact_info?.email || "",
      contact_phone: profile?.profile_contact_info?.phone || "",
      contact_address: profile?.profile_contact_info?.address || "",
    },
    mode: "onChange",
  });

  const updateProfileMutation = useMutation(
    async (values: ProfileFormValues) => {
      const social_links = {
        facebook: values.facebook,
        twitter: values.twitter,
        linkedin: values.linkedin,
        instagram: values.instagram,
      };

      const contact_info = {
        email: values.contact_email,
        phone: values.contact_phone,
        address: values.contact_address,
      };

      const { data, error } = await supabase
        .from("profiles")
        .update({
          name: values.name,
          company_name: values.company_name,
          phone: values.phone,
          industry: values.industry,
          website: values.website,
          profile_banner: values.profile_banner,
          profile_description: values.profile_description,
          profile_color_scheme: values.profile_color_scheme,
          profile_social_links: social_links,
          profile_contact_info: contact_info,
        })
        .eq("id", user?.id);

      if (error) {
        console.error("Error updating profile:", error);
        throw error;
      }

      return data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["profile"]);
        toast({
          title: "Profile updated successfully!",
        });
      },
      onError: (error: any) => {
        toast({
          title: "Something went wrong!",
          description: error.message,
          variant: "destructive",
        });
      },
    }
  );

  const onSubmit = async (values: ProfileFormValues) => {
    updateProfileMutation.mutate(values);
  };

  const uploadBanner = async (file: File) => {
    setIsBannerUploading(true);
    try {
      const filePath = `banners/${user?.id}/${file.name}`;
      const { data, error } = await supabase.storage
        .from("company-banners")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        console.error("Error uploading banner:", error);
        throw error;
      }

      const publicURL = supabase.storage
        .from("company-banners")
        .getPublicUrl(filePath).data.publicUrl;

      form.setValue("profile_banner", publicURL);
      toast({
        title: "Banner uploaded successfully!",
      });
    } catch (error: any) {
      console.error("Error during upload:", error);
      toast({
        title: "Failed to upload banner.",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsBannerUploading(false);
    }
  };

  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Company Settings</h1>
        <p className="text-muted-foreground">
          Manage your company profile and settings.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>
            Update your company's public profile information.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="profile" className="space-y-4">
            <TabsList>
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="contact">Contact Info</TabsTrigger>
              <TabsTrigger value="social">Social Links</TabsTrigger>
            </TabsList>
            <TabsContent value="profile" className="space-y-4">
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <FormLabel htmlFor="name">Contact Name</FormLabel>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Your Name"
                      {...form.register("name")}
                    />
                    <FormMessage>{form.formState.errors.name?.message}</FormMessage>
                  </div>
                  <div>
                    <FormLabel htmlFor="company_name">Company Name</FormLabel>
                    <Input
                      id="company_name"
                      type="text"
                      placeholder="Company Name"
                      {...form.register("company_name")}
                    />
                    <FormMessage>
                      {form.formState.errors.company_name?.message}
                    </FormMessage>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <FormLabel htmlFor="phone">Phone Number</FormLabel>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Phone Number"
                      {...form.register("phone")}
                    />
                    <FormMessage>{form.formState.errors.phone?.message}</FormMessage>
                  </div>
                  <div>
                    <FormLabel htmlFor="industry">Industry</FormLabel>
                    <Input
                      id="industry"
                      type="text"
                      placeholder="Industry"
                      {...form.register("industry")}
                    />
                    <FormMessage>
                      {form.formState.errors.industry?.message}
                    </FormMessage>
                  </div>
                </div>

                <div>
                  <FormLabel htmlFor="website">Website URL</FormLabel>
                  <Input
                    id="website"
                    type="url"
                    placeholder="Website URL"
                    {...form.register("website")}
                  />
                  <FormMessage>{form.formState.errors.website?.message}</FormMessage>
                </div>

                <div>
                  <FormLabel htmlFor="profile_banner">Profile Banner URL</FormLabel>
                  <div className="flex items-center space-x-4">
                    <Input
                      id="profile_banner"
                      type="url"
                      placeholder="Profile Banner URL"
                      {...form.register("profile_banner")}
                      className="flex-1"
                    />
                    <input
                      type="file"
                      id="banner-upload"
                      className="hidden"
                      onChange={(e) => {
                        const file = (e.target as HTMLInputElement).files?.[0];
                        if (file) {
                          uploadBanner(file);
                        }
                      }}
                    />
                    <label
                      htmlFor="banner-upload"
                      className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                    >
                      Upload Banner
                    </label>
                    {isBannerUploading && (
                      <RefreshCw className="animate-spin h-5 w-5" />
                    )}
                  </div>
                  <FormMessage>
                    {form.formState.errors.profile_banner?.message}
                  </FormMessage>
                </div>

                <div>
                  <FormLabel htmlFor="profile_description">
                    Profile Description
                  </FormLabel>
                  <Textarea
                    id="profile_description"
                    placeholder="Write a short description about your company"
                    {...form.register("profile_description")}
                  />
                  <FormMessage>
                    {form.formState.errors.profile_description?.message}
                  </FormMessage>
                </div>

                <div>
                  <FormLabel htmlFor="profile_color_scheme">
                    Profile Color Scheme
                  </FormLabel>
                  <Input
                    type="color"
                    id="profile_color_scheme"
                    {...form.register("profile_color_scheme")}
                  />
                  <FormMessage>
                    {form.formState.errors.profile_color_scheme?.message}
                  </FormMessage>
                </div>

                <Button type="submit" disabled={!form.formState.isValid || updateProfileMutation.isLoading}>
                  {updateProfileMutation.isLoading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Profile"
                  )}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="contact" className="space-y-4">
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <FormLabel htmlFor="contact_email">Contact Email</FormLabel>
                  <Input
                    id="contact_email"
                    type="email"
                    placeholder="Contact Email"
                    {...form.register("contact_email")}
                  />
                  <FormMessage>
                    {form.formState.errors.contact_email?.message}
                  </FormMessage>
                </div>

                <div>
                  <FormLabel htmlFor="contact_phone">Contact Phone</FormLabel>
                  <Input
                    id="contact_phone"
                    type="tel"
                    placeholder="Contact Phone"
                    {...form.register("contact_phone")}
                  />
                  <FormMessage>
                    {form.formState.errors.contact_phone?.message}
                  </FormMessage>
                </div>

                <div>
                  <FormLabel htmlFor="contact_address">Contact Address</FormLabel>
                  <Textarea
                    id="contact_address"
                    placeholder="Contact Address"
                    {...form.register("contact_address")}
                  />
                  <FormMessage>
                    {form.formState.errors.contact_address?.message}
                  </FormMessage>
                </div>

                <Button type="submit" disabled={!form.formState.isValid || updateProfileMutation.isLoading}>
                  {updateProfileMutation.isLoading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Contact Info"
                  )}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="social" className="space-y-4">
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <FormLabel htmlFor="facebook">Facebook URL</FormLabel>
                  <Input
                    id="facebook"
                    type="url"
                    placeholder="Facebook URL"
                    {...form.register("facebook")}
                  />
                  <FormMessage>
                    {form.formState.errors.facebook?.message}
                  </FormMessage>
                </div>

                <div>
                  <FormLabel htmlFor="twitter">Twitter URL</FormLabel>
                  <Input
                    id="twitter"
                    type="url"
                    placeholder="Twitter URL"
                    {...form.register("twitter")}
                  />
                  <FormMessage>
                    {form.formState.errors.twitter?.message}
                  </FormMessage>
                </div>

                <div>
                  <FormLabel htmlFor="linkedin">LinkedIn URL</FormLabel>
                  <Input
                    id="linkedin"
                    type="url"
                    placeholder="LinkedIn URL"
                    {...form.register("linkedin")}
                  />
                  <FormMessage>
                    {form.formState.errors.linkedin?.message}
                  </FormMessage>
                </div>

                <div>
                  <FormLabel htmlFor="instagram">Instagram URL</FormLabel>
                  <Input
                    id="instagram"
                    type="url"
                    placeholder="Instagram URL"
                    {...form.register("instagram")}
                  />
                  <FormMessage>
                    {form.formState.errors.instagram?.message}
                  </FormMessage>
                </div>

                <Button type="submit" disabled={!form.formState.isValid || updateProfileMutation.isLoading}>
                  {updateProfileMutation.isLoading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Social Links"
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanySettings;

function FormLabel(props: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label
      htmlFor={props.htmlFor}
      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
    >
      {props.children}
    </label>
  );
}

function FormMessage({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-red-500">{children}</p>;
}
