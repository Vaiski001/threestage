
import { useNavigate } from "react-router-dom";
import { Settings, User, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserProfile } from "@/lib/supabase/types";

interface UserProfileSectionProps {
  profile: UserProfile | null;
  isCompany: boolean;
}

export const UserProfileSection = ({ profile, isCompany }: UserProfileSectionProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="border-t border-sidebar-border px-3 py-4 mt-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center">
            {isCompany ? <Building className="h-5 w-5" /> : <User className="h-5 w-5" />}
          </div>
          <div>
            <p className="text-sm font-medium">
              {isCompany
                ? (profile?.company_name || profile?.name || 'Company User')
                : (profile?.name || 'Customer')}
            </p>
            <p className="text-xs text-sidebar-foreground/70">{isCompany ? 'Company' : 'Customer'}</p>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-sidebar-foreground" 
          onClick={() => navigate(`/${isCompany ? 'company' : 'customer'}/settings`)}
        >
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
