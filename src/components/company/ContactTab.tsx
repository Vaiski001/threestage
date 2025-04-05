import { useEffect, useState } from "react";
import { FormLabel } from "@/components/ui/form-label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UserProfile } from "@/lib/supabase/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ContactTabProps {
  profile: UserProfile | null;
  onUpdate: (values: any) => void;
}

const formSchema = z.object({
  phone: z.string().optional(),
  contact_email: z.string().email("Invalid email address").optional(),
  website: z.string().url("Invalid website URL").optional().or(z.literal("")),
  facebook: z.string().url("Invalid URL").optional().or(z.literal("")),
  twitter: z.string().url("Invalid URL").optional().or(z.literal("")),
  linkedin: z.string().url("Invalid URL").optional().or(z.literal("")),
  instagram: z.string().url("Invalid URL").optional().or(z.literal("")),
  contact_address: z.string().optional(),
});

export function ContactTab({ profile, onUpdate }: ContactTabProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phone: profile?.phone || "",
      contact_email: profile?.profile_contact_info?.email || "",
      website: profile?.website || "",
      facebook: profile?.profile_social_links?.facebook || "",
      twitter: profile?.profile_social_links?.twitter || "",
      linkedin: profile?.profile_social_links?.linkedin || "",
      instagram: profile?.profile_social_links?.instagram || "",
      contact_address: profile?.profile_contact_info?.address || "",
    },
  });

  useEffect(() => {
    if (profile) {
      form.reset({
        phone: profile.phone || "",
        contact_email: profile.profile_contact_info?.email || "",
        website: profile.website || "",
        facebook: profile.profile_social_links?.facebook || "",
        twitter: profile.profile_social_links?.twitter || "",
        linkedin: profile.profile_social_links?.linkedin || "",
        instagram: profile.profile_social_links?.instagram || "",
        contact_address: profile.profile_contact_info?.address || "",
      });
    }
  }, [profile, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    const updatedValues = {
      phone: values.phone,
      website: values.website,
      profile_contact_info: {
        email: values.contact_email,
        address: values.contact_address,
        phone: values.phone,
      },
      profile_social_links: {
        facebook: values.facebook,
        twitter: values.twitter,
        linkedin: values.linkedin,
        instagram: values.instagram,
      },
    };
    
    onUpdate(updatedValues);
    setIsSubmitting(false);
  };

  return (
    <div className="p-6 bg-white rounded-lg border">
      <h2 className="text-2xl font-bold mb-6">Contact Information</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <FormLabel htmlFor="phone">Phone Number</FormLabel>
              <Input
                id="phone"
                placeholder="+1 (555) 123-4567"
                {...form.register("phone")}
              />
              {form.formState.errors.phone && (
                <p className="text-sm text-red-500 mt-1">{form.formState.errors.phone.message}</p>
              )}
            </div>

            <div>
              <FormLabel htmlFor="contact_email">Email Address</FormLabel>
              <Input
                id="contact_email"
                placeholder="contact@yourcompany.com"
                {...form.register("contact_email")}
              />
              {form.formState.errors.contact_email && (
                <p className="text-sm text-red-500 mt-1">{form.formState.errors.contact_email.message}</p>
              )}
            </div>
          </div>

          <div>
            <FormLabel htmlFor="website">Website</FormLabel>
            <Input
              id="website"
              placeholder="https://yourcompany.com"
              {...form.register("website")}
            />
            {form.formState.errors.website && (
              <p className="text-sm text-red-500 mt-1">{form.formState.errors.website.message}</p>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Social Media</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <FormLabel htmlFor="facebook" className="flex items-center">
                  <Facebook className="h-4 w-4 mr-2" /> Facebook
                </FormLabel>
                <Input
                  id="facebook"
                  placeholder="https://facebook.com/yourcompany"
                  {...form.register("facebook")}
                />
              </div>
              
              <div>
                <FormLabel htmlFor="twitter" className="flex items-center">
                  <Twitter className="h-4 w-4 mr-2" /> Twitter
                </FormLabel>
                <Input
                  id="twitter"
                  placeholder="https://twitter.com/yourcompany"
                  {...form.register("twitter")}
                />
              </div>
              
              <div>
                <FormLabel htmlFor="linkedin" className="flex items-center">
                  <Linkedin className="h-4 w-4 mr-2" /> LinkedIn
                </FormLabel>
                <Input
                  id="linkedin"
                  placeholder="https://linkedin.com/company/yourcompany"
                  {...form.register("linkedin")}
                />
              </div>
              
              <div>
                <FormLabel htmlFor="instagram" className="flex items-center">
                  <Instagram className="h-4 w-4 mr-2" /> Instagram
                </FormLabel>
                <Input
                  id="instagram"
                  placeholder="https://instagram.com/yourcompany"
                  {...form.register("instagram")}
                />
              </div>
            </div>
          </div>

          <div>
            <FormLabel htmlFor="contact_address">Business Address</FormLabel>
            <Textarea
              id="contact_address"
              placeholder="123 Business St, Suite 101, City, State, ZIP"
              {...form.register("contact_address")}
              className="w-full"
            />
            {form.formState.errors.contact_address && (
              <p className="text-sm text-red-500 mt-1">{form.formState.errors.contact_address.message}</p>
            )}
          </div>
          
          <div className="pt-4">
            <Button 
              type="submit" 
              className="w-full md:w-auto"
              disabled={isSubmitting}
            >
              Save Changes
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
