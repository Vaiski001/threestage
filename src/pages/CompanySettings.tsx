
import { useState, useEffect, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { UpdateIcon, Save, Upload } from "lucide-react";
import { UserProfile } from "@/lib/supabase/types";

const CompanySettings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  
  // Fetch company profile
  const { data: profile, isLoading } = useQuery({
    queryKey: ['companyProfile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/login');
        return null;
      }
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) {
        console.error("Error fetching company profile:", error);
        toast({
          title: "Error",
          description: "Failed to load company profile",
          variant: "destructive"
        });
        throw error;
      }
      
      return data as UserProfile;
    }
  });
  
  // Form state
  const [formState, setFormState] = useState<Partial<UserProfile>>({
    company_name: '',
    industry: '',
    website: '',
    profile_description: '',
    profile_color_scheme: '#0070f3',
    profile_social_links: {
      facebook: '',
      twitter: '',
      linkedin: '',
      instagram: ''
    },
    profile_contact_info: {
      email: '',
      phone: '',
      address: ''
    },
    profile_services: []
  });
  
  // Update form state when profile data is loaded
  useEffect(() => {
    if (profile) {
      setFormState({
        company_name: profile.company_name || '',
        industry: profile.industry || '',
        website: profile.website || '',
        profile_description: profile.profile_description || '',
        profile_color_scheme: profile.profile_color_scheme || '#0070f3',
        profile_social_links: profile.profile_social_links || {
          facebook: '',
          twitter: '',
          linkedin: '',
          instagram: ''
        },
        profile_contact_info: profile.profile_contact_info || {
          email: profile.email || '',
          phone: profile.phone || '',
          address: ''
        },
        profile_banner: profile.profile_banner,
        profile_featured_images: profile.profile_featured_images || [],
        profile_services: profile.profile_services || []
      });
      
      if (profile.profile_banner) {
        setBannerPreview(profile.profile_banner);
      }
    }
  }, [profile]);
  
  // Handle input changes
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [section, field] = name.split('.');
      setFormState(prev => ({
        ...prev,
        [section]: {
          ...prev[section as keyof UserProfile] as Record<string, unknown>,
          [field]: value
        }
      }));
    } else {
      setFormState(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  // Handle banner image upload
  const handleBannerChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setBannerFile(file);
      
      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Add a new service
  const handleAddService = () => {
    setFormState(prev => ({
      ...prev,
      profile_services: [
        ...(prev.profile_services || []),
        { title: '', description: '' }
      ]
    }));
  };
  
  // Update a service
  const handleServiceChange = (index: number, field: string, value: string) => {
    setFormState(prev => {
      const services = [...(prev.profile_services || [])];
      services[index] = {
        ...services[index],
        [field]: value
      };
      return {
        ...prev,
        profile_services: services
      };
    });
  };
  
  // Remove a service
  const handleRemoveService = (index: number) => {
    setFormState(prev => {
      const services = [...(prev.profile_services || [])];
      services.splice(index, 1);
      return {
        ...prev,
        profile_services: services
      };
    });
  };
  
  // Upload banner image to Supabase Storage
  const uploadBanner = async (): Promise<string | null> => {
    if (!bannerFile) return formState.profile_banner || null;
    
    try {
      setIsUploading(true);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");
      
      // Upload to storage
      const filePath = `company-profiles/${user.id}/banner-${Date.now()}`;
      const { data, error } = await supabase.storage
        .from('profiles')
        .upload(filePath, bannerFile, {
          upsert: true,
          contentType: bannerFile.type
        });
        
      if (error) throw error;
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('profiles')
        .getPublicUrl(data.path);
        
      return publicUrl;
    } catch (error) {
      console.error("Error uploading banner:", error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload banner image",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  };
  
  // Save company profile settings mutation
  const saveProfileMutation = useMutation({
    mutationFn: async (data: Partial<UserProfile>) => {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");
      
      // Upload banner if changed
      let bannerUrl = formState.profile_banner;
      if (bannerFile) {
        bannerUrl = await uploadBanner();
      }
      
      // Update profile in Supabase
      const { data: profile, error } = await supabase
        .from('profiles')
        .update({
          ...data,
          profile_banner: bannerUrl
        })
        .eq('id', user.id)
        .select()
        .single();
        
      if (error) throw error;
      
      return profile as UserProfile;
    },
    onSuccess: () => {
      toast({
        title: "Profile Updated",
        description: "Your company profile has been updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['companyProfile'] });
    },
    onError: (error) => {
      console.error("Error saving profile:", error);
      toast({
        title: "Error",
        description: "Failed to update company profile",
        variant: "destructive"
      });
    }
  });
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    saveProfileMutation.mutate(formState);
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto py-10 px-4 space-y-8">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-40 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton className="h-80 w-full" />
          <Skeleton className="h-80 w-full" />
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Company Profile Settings</h1>
          <p className="text-muted-foreground mt-2">
            Customize how your company appears to customers and manage your public profile.
          </p>
        </div>
        
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="profile">Profile Info</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="contact">Contact Details</TabsTrigger>
          </TabsList>
          
          <form onSubmit={handleSubmit}>
            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>
                    This information will be displayed on your public company profile.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="company_name">Company Name</Label>
                    <Input
                      id="company_name"
                      name="company_name"
                      value={formState.company_name || ''}
                      onChange={handleInputChange}
                      placeholder="Your company name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry</Label>
                    <Input
                      id="industry"
                      name="industry"
                      value={formState.industry || ''}
                      onChange={handleInputChange}
                      placeholder="e.g., Technology, Healthcare, etc."
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      name="website"
                      value={formState.website || ''}
                      onChange={handleInputChange}
                      placeholder="https://yourcompany.com"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="profile_description">Company Description</Label>
                    <Textarea
                      id="profile_description"
                      name="profile_description"
                      value={formState.profile_description || ''}
                      onChange={handleInputChange}
                      placeholder="Tell customers about your company..."
                      className="min-h-32"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="appearance" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Appearance</CardTitle>
                  <CardDescription>
                    Customize the look and feel of your company profile page.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Profile Banner</Label>
                    {bannerPreview && (
                      <div className="mt-2 mb-4 relative rounded-md overflow-hidden">
                        <img 
                          src={bannerPreview} 
                          alt="Profile Banner" 
                          className="w-full h-40 object-cover"
                        />
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Label 
                        htmlFor="banner-upload" 
                        className="cursor-pointer flex items-center gap-2 border rounded-md px-4 py-2 bg-muted hover:bg-muted/80"
                      >
                        <Upload className="h-4 w-4" />
                        <span>Upload Banner</span>
                      </Label>
                      <Input 
                        id="banner-upload" 
                        type="file" 
                        accept="image/*" 
                        onChange={handleBannerChange}
                        className="hidden"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Recommended size: 1200 x 300 pixels
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="profile_color_scheme">Primary Color</Label>
                    <div className="flex items-center gap-2">
                      <Input 
                        id="profile_color_scheme"
                        name="profile_color_scheme"
                        type="color"
                        value={formState.profile_color_scheme || '#0070f3'}
                        onChange={handleInputChange}
                        className="w-20 h-10 p-1"
                      />
                      <Input
                        value={formState.profile_color_scheme || '#0070f3'}
                        onChange={handleInputChange}
                        name="profile_color_scheme"
                        className="w-32 flex-none"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="services" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Services</CardTitle>
                  <CardDescription>
                    List the services that your company offers to customers.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {formState.profile_services && formState.profile_services.map((service, index) => (
                    <div key={index} className="space-y-4 p-4 border rounded-md relative">
                      <button
                        type="button"
                        onClick={() => handleRemoveService(index)}
                        className="absolute top-2 right-2 text-muted-foreground hover:text-destructive"
                      >
                        ✕
                      </button>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`service-title-${index}`}>Service Name</Label>
                        <Input
                          id={`service-title-${index}`}
                          value={service.title}
                          onChange={(e) => handleServiceChange(index, 'title', e.target.value)}
                          placeholder="e.g., Web Development"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`service-desc-${index}`}>Description</Label>
                        <Textarea
                          id={`service-desc-${index}`}
                          value={service.description}
                          onChange={(e) => handleServiceChange(index, 'description', e.target.value)}
                          placeholder="Describe this service..."
                          rows={3}
                        />
                      </div>
                    </div>
                  ))}
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddService}
                  >
                    Add Service
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="contact" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                  <CardDescription>
                    Update contact details displayed on your public profile.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="profile_contact_info.email">Contact Email</Label>
                    <Input
                      id="profile_contact_info.email"
                      name="profile_contact_info.email"
                      value={formState.profile_contact_info?.email || ''}
                      onChange={handleInputChange}
                      placeholder="contact@yourcompany.com"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="profile_contact_info.phone">Contact Phone</Label>
                    <Input
                      id="profile_contact_info.phone"
                      name="profile_contact_info.phone"
                      value={formState.profile_contact_info?.phone || ''}
                      onChange={handleInputChange}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="profile_contact_info.address">Business Address</Label>
                    <Textarea
                      id="profile_contact_info.address"
                      name="profile_contact_info.address"
                      value={formState.profile_contact_info?.address || ''}
                      onChange={handleInputChange}
                      placeholder="Your business address"
                      rows={3}
                    />
                  </div>
                  
                  <Separator className="my-6" />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Social Media Links</h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="profile_social_links.facebook">Facebook</Label>
                      <Input
                        id="profile_social_links.facebook"
                        name="profile_social_links.facebook"
                        value={formState.profile_social_links?.facebook || ''}
                        onChange={handleInputChange}
                        placeholder="https://facebook.com/yourcompany"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="profile_social_links.twitter">Twitter</Label>
                      <Input
                        id="profile_social_links.twitter"
                        name="profile_social_links.twitter"
                        value={formState.profile_social_links?.twitter || ''}
                        onChange={handleInputChange}
                        placeholder="https://twitter.com/yourcompany"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="profile_social_links.linkedin">LinkedIn</Label>
                      <Input
                        id="profile_social_links.linkedin"
                        name="profile_social_links.linkedin"
                        value={formState.profile_social_links?.linkedin || ''}
                        onChange={handleInputChange}
                        placeholder="https://linkedin.com/company/yourcompany"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="profile_social_links.instagram">Instagram</Label>
                      <Input
                        id="profile_social_links.instagram"
                        name="profile_social_links.instagram"
                        value={formState.profile_social_links?.instagram || ''}
                        onChange={handleInputChange}
                        placeholder="https://instagram.com/yourcompany"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <div className="mt-6 flex justify-end">
              <Button 
                type="submit" 
                disabled={saveProfileMutation.isPending || isUploading}
                className="gap-2"
              >
                {(saveProfileMutation.isPending || isUploading) && <UpdateIcon className="h-4 w-4 animate-spin" />}
                {(saveProfileMutation.isPending || isUploading) ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Tabs>
      </div>
    </div>
  );
};

export default CompanySettings;
