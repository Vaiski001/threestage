
import { useNavigate } from "react-router-dom";
import { Settings, User, Building, LogOut, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserProfile } from "@/lib/supabase/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { signOut } from "@/lib/supabase";

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
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="w-full flex items-center justify-between p-2 hover:bg-sidebar-accent/50 rounded-md">
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9">
                <AvatarImage src={avatarUrl} alt={profile?.name || "User"} />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              <div className="text-left">
                <p className="text-sm font-medium truncate max-w-[140px]">
                  {isCompany
                    ? (profile?.company_name || profile?.name || 'Company User')
                    : (profile?.name || 'Customer')}
                </p>
                <p className="text-xs text-sidebar-foreground/70">{isCompany ? 'Company' : 'Customer'}</p>
              </div>
            </div>
            <ChevronDown className="h-4 w-4 text-sidebar-foreground/70" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => navigate(`/${isCompany ? 'company' : 'customer'}/settings`)}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate(`/${isCompany ? 'company' : 'customer'}/profile`)}>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            {isCompany && (
              <DropdownMenuItem onClick={() => navigate('/company/team')}>
                <Building className="mr-2 h-4 w-4" />
                <span>Company Details</span>
              </DropdownMenuItem>
            )}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
