import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User, LogOut, ChevronDown, Sun, Moon } from "lucide-react";
import { signOut, forceSignOut } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserProfile } from "@/lib/supabase";

interface AccountDropdownProps {
  profile: UserProfile | null;
}

export function AccountDropdown({ profile }: AccountDropdownProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { resetAuth } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleSignOut = async () => {
    try {
      // First try normal sign out
      await signOut();
      // Then force clear all auth data to be sure
      await forceSignOut();
      
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
      navigate("/");
    } catch (error) {
      console.error("Sign out error:", error);
      // If regular sign out fails, use the reset auth function
      await resetAuth();
      
      toast({
        title: "Signed out",
        description: "You have been signed out with force reset.",
      });
      navigate("/");
    }
  };

  const handleDashboardClick = () => {
    if (profile?.role === "company") {
      navigate("/company/dashboard");
    } else {
      navigate("/customer/dashboard");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <User className="h-4 w-4" />
          <span className="hidden sm:inline">
            {profile?.company_name || profile?.name || "Account"}
          </span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-3 py-2">
          <p className="text-sm font-medium">{profile?.name || profile?.company_name}</p>
          <p className="text-xs text-muted-foreground">{profile?.email}</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleDashboardClick}>Dashboard</DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate("/profile")}>Profile</DropdownMenuItem>
        
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={toggleTheme}>
          {theme === 'dark' ? (
            <>
              <Sun className="h-4 w-4 mr-2" />
              Light Theme
            </>
          ) : (
            <>
              <Moon className="h-4 w-4 mr-2" />
              Dark Theme
            </>
          )}
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
          <LogOut className="h-4 w-4 mr-2" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
