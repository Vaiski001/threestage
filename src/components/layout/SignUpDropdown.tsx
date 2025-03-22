
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

export function SignUpDropdown() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleNavigation = (path: string) => {
    navigate(path);
    toast({
      title: "Navigating to signup",
      description: `Taking you to ${path === "/signup-customer" ? "customer" : "company"} signup page.`
    });
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>
          Sign up
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => handleNavigation("/signup-customer")}>
          As Customer
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleNavigation("/signup-company")}>
          As Company
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
