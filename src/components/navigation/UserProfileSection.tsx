import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { signOut } from "@/lib/supabase";
import { UserProfile } from "@/lib/supabase/types";

interface UserProfileSectionProps {
  profile: UserProfile | null;
  isCompany: boolean;
}

export const UserProfileSection = ({ profile, isCompany }: UserProfileSectionProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/login");
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account",
      });
    } catch (error) {
      toast({
        title: "Error signing out",
        description: "There was an error signing out. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const getInitials = () => {
    if (isCompany) {
      return profile?.company_name?.substring(0, 2).toUpperCase() || "CO";
    }
    
    const name = profile?.name || "User";
    const parts = name.split(" ");
    if (parts.length > 1) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };
  
  // Get avatar URL as string or empty string as fallback
  const avatarUrl = (profile?.avatar_url as string) || "";
  
  return (
    <div className="border-t border-sidebar-border px-3 py-4 mt-auto">
      <div className="flex items-center gap-3">
        <Avatar className="h-9 w-9">
          <AvatarImage src={avatarUrl} alt={profile?.name || "User"} />
          <AvatarFallback className="bg-primary/10 text-primary">
            {getInitials()}
          </AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
};
