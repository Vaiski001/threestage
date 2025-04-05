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
  
  return (
    <div className="flex justify-center items-center p-4 mt-auto border-t border-gray-700">
      <Avatar className="h-10 w-10 border border-indigo-300 cursor-pointer" onClick={() => navigate(`/${isCompany ? 'company' : 'customer'}/profile`)}>
        <AvatarFallback className="bg-indigo-100 text-indigo-700">{getInitials()}</AvatarFallback>
      </Avatar>
    </div>
  );
};
