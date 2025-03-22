
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SignUpDropdown } from "./SignUpDropdown";

export function AuthButtons() {
  const navigate = useNavigate();
  
  return (
    <div className="flex items-center gap-4">
      <div className="hidden sm:block">
        <Button variant="outline" onClick={() => navigate("/login")}>
          Log in
        </Button>
      </div>
      <SignUpDropdown />
    </div>
  );
}
