
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { forceSignOut } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { signInWithGoogle } from "@/lib/supabase/auth";

export function AuthButtons() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleGoogleAuth = async () => {
    try {
      await signInWithGoogle();
      toast({
        title: "Google Auth",
        description: "Google authentication initiated."
      });
    } catch (error) {
      console.error("Error with Google auth:", error);
      toast({
        title: "Auth Error",
        description: "Could not initiate Google authentication.",
        variant: "destructive"
      });
    }
  };
  
  const handleForceSignOut = async () => {
    try {
      await forceSignOut();
      toast({
        title: "Authentication reset",
        description: "All auth data has been cleared."
      });
    } catch (error) {
      console.error("Error resetting auth:", error);
    }
  };
  
  return (
    <div className="flex items-center gap-4">
      <Button variant="outline" onClick={() => navigate("/login")}>
        Log in
      </Button>
      <Button onClick={() => navigate("/signup")}>
        Sign up
      </Button>
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
