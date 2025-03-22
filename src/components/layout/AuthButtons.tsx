
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SignUpDropdown } from "./SignUpDropdown";
import { forceSignOut } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

export function AuthButtons() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleForceSignOut = async () => {
    try {
      await forceSignOut();
      toast({
        title: "Authentication reset",
        description: "All auth data has been cleared."
      });
      navigate("/login");
    } catch (error) {
      console.error("Error resetting auth:", error);
    }
  };
  
  const handleNavigateToSignup = () => {
    console.log("Navigating to customer signup");
    navigate("/signup-customer");
  };
  
  return (
    <div className="flex items-center gap-4">
      <div className="hidden sm:block">
        <Button variant="outline" onClick={() => navigate("/login")}>
          Log in
        </Button>
      </div>
      <SignUpDropdown />
      <div className="hidden sm:block">
        <Button variant="secondary" onClick={handleNavigateToSignup}>
          Join as Customer
        </Button>
      </div>
      {/* Adding debug button to clear auth state - remove in production */}
      {import.meta.env.DEV && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleForceSignOut} 
          className="text-xs text-red-500"
        >
          Reset Auth
        </Button>
      )}
    </div>
  );
}
