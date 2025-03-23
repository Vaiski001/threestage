
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Code, X } from "lucide-react";

export function DevNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // Only show in development mode
  if (import.meta.env.PROD) {
    return null;
  }

  const routes = [
    { path: "/", label: "Home" },
    { path: "/login", label: "Login" },
    { path: "/signup", label: "Signup" },
    { path: "/demo", label: "Demo Dashboard" },
    { path: "/dashboard", label: "Main Dashboard" },
    { path: "/company/dashboard", label: "Company Dashboard" },
    { path: "/customer/dashboard", label: "Customer Dashboard" },
    { path: "/company/settings", label: "Company Settings" },
    { path: "/profile", label: "Profile" },
    { path: "/enquiries", label: "Enquiries" },
    { path: "/forms", label: "Form Builder" },
    { path: "/companies", label: "Company Search" },
    { path: "/unauthorized", label: "Unauthorized" }
  ];

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <Button
        size="sm"
        variant="outline"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 flex items-center gap-1 bg-background/80 backdrop-blur-sm shadow-md"
      >
        <Code size={14} />
        <span>Dev Nav</span>
        <ChevronUp size={14} />
      </Button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-background/95 backdrop-blur-sm rounded-lg border shadow-lg p-3 w-64">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium text-sm">Developer Navigation</h3>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setIsOpen(false)}
          className="h-6 w-6 p-0"
        >
          <X size={14} />
        </Button>
      </div>
      
      <div className="space-y-1 max-h-[70vh] overflow-y-auto">
        {routes.map((route) => (
          <Button
            key={route.path}
            size="sm"
            variant="ghost"
            className="w-full justify-start text-left text-xs"
            onClick={() => handleNavigate(route.path)}
          >
            {route.label}
          </Button>
        ))}
      </div>
      
      <p className="text-[10px] text-muted-foreground mt-2 border-t pt-1">
        Development mode only. Routes bypass auth protection for preview purposes.
      </p>
    </div>
  );
}
