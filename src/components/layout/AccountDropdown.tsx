
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User, LogOut, ChevronDown } from "lucide-react";
import { signOut } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
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

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
      navigate("/");
    } catch (error) {
      console.error("Sign out error:", error);
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
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
        {profile?.role === "company" ? (
          <DropdownMenuItem onClick={() => navigate("/dashboard")}>Dashboard</DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={() => navigate("/enquiries")}>My Enquiries</DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
          <LogOut className="h-4 w-4 mr-2" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
