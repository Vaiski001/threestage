
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { UserProfile } from "@/lib/supabase/types";

// Import your new components
import { ProfileEditorTabs } from "@/components/company/ProfileEditorTabs";
import { BrandingInfoTab } from "@/components/company/BrandingInfoTab";
import { ContactTab } from "@/components/company/ContactTab";
import { ServicesTab } from "@/components/company/ServicesTab";

const CompanySettings = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("branding");

  // Fetch user profile data
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

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (values: Partial<UserProfile>) => {
      console.log("Updating profile with values:", values);
      const { data, error } = await supabase
        .from("profiles")
        .update(values)
        .eq("id", user?.id);

      if (error) {
        console.error("Error updating profile:", error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast({
        title: "Profile updated",
        description: "Your changes have been saved.",
      });
    },
    onError: (error: any) => {
      console.error("Error in mutation:", error);
      toast({
        title: "Error updating profile",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Handler for profile updates from tabs
  const handleProfileUpdate = (values: Partial<UserProfile>) => {
    // Merge with existing profile data to avoid overwriting unrelated fields
    const updatedProfile = { ...profile, ...values };
    updateProfileMutation.mutate(updatedProfile);
  };

  if (isLoading) {
    return <div className="container py-10">Loading profile data...</div>;
  }

  return (
    <div className="container py-8">
      <ProfileEditorTabs activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === "branding" && (
        <BrandingInfoTab profile={profile} onUpdate={handleProfileUpdate} />
      )}

      {activeTab === "contact" && (
        <ContactTab profile={profile} onUpdate={handleProfileUpdate} />
      )}

      {activeTab === "services" && (
        <ServicesTab profile={profile} onUpdate={handleProfileUpdate} />
      )}
    </div>
  );
};

export default CompanySettings;
