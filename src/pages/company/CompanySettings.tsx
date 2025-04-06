import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { UserProfile } from "@/lib/supabase/types";

// Import your new components
import { ProfileEditorTabs } from "@/components/company/ProfileEditorTabs";
import { DirectBrandingTab } from "@/components/company/DirectBrandingTab";
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
      console.log("Updating profile with values:", JSON.stringify(values, null, 2));
      
      // Remove any non-existent columns to prevent errors
      const safeValues = { ...values };
      if ('profile_banner' in safeValues) {
        console.log("Removing profile_banner as it doesn't exist in the database");
        delete safeValues.profile_banner;
      }
      
      console.log("Sending to database:", JSON.stringify(safeValues, null, 2));
      
      const { data, error } = await supabase
        .from("profiles")
        .update(safeValues)
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

  const refreshData = () => {
    queryClient.invalidateQueries({ queryKey: ["profile"] });
  };

  return (
    <div className="container py-8">
      <ProfileEditorTabs activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === "branding" && (
        <DirectBrandingTab 
          profile={profile} 
          onComplete={refreshData} 
        />
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
