
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function SignUpDropdown() {
  const navigate = useNavigate();
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>
          Sign up
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => navigate("/signup-customer")}>
          As Customer
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate("/signup-company")}>
          As Company
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
