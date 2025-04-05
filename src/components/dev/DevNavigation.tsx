import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronUp, Code, X, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function DevNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // Only show in development mode or preview environments
  const isDevelopment = import.meta.env.DEV;
  const isPreview = window.location.hostname.includes('preview') || 
                   window.location.hostname.includes('lovable.app');
  
  // Return null if not in development or preview
  if (!isDevelopment && !isPreview) {
    return null;
  }

  const routes = [
    // Public routes
    { path: "/", label: "Home" },
    { path: "/login", label: "Login" },
    { path: "/signup", label: "Signup" },
    { path: "/demo", label: "Demo Dashboard" },
    { path: "/test", label: "Test Page" },
    { path: "/companies", label: "Company Search" },
    { path: "/companies/:id", label: "Company Profile", disabled: true },
    { path: "/forms/:formId", label: "Form Embedded", disabled: true },
    { path: "/unauthorized", label: "Unauthorized" },
    
    // Demo routes for the sandbox preview experience
    { 
      type: "header", 
      label: "Demo Portal", 
      description: "Sandbox preview for potential customers" 
    },
    { path: "/demo", label: "Full Demo Dashboard" },
    
    // Customer routes (grouped)
    { type: "header", label: "Customer Portal" },
    { path: "/customer/dashboard", label: "Customer Dashboard" },
    { path: "/customer/settings", label: "Customer Settings" },
    { path: "/customer/enquiries", label: "Customer Enquiries" },
    
    // Customer messaging subgroup
    { type: "subheader", label: "Customer Messaging" },
    { path: "/customer/messaging/email", label: "Customer Email" },
    { path: "/customer/messaging/chat", label: "Customer Chat" },
    { path: "/customer/messaging/inbox", label: "Customer Inbox" },
    
    // More customer routes
    { path: "/customer/billing", label: "Customer Billing" },
    { path: "/customer/notifications", label: "Customer Notifications" },
    { path: "/customer/support", label: "Customer Support" },
    
    // Company routes (grouped)
    { type: "header", label: "Company Portal" },
    { path: "/company/dashboard", label: "Company Dashboard" },
    { path: "/company/settings", label: "Company Settings" },
    { path: "/company/details", label: "Company Details" },
    { path: "/company/forms", label: "Form Builder" },
    { path: "/company/enquiries", label: "Company Enquiries" },
    
    // Company messaging subgroup
    { type: "subheader", label: "Company Messaging" },
    { path: "/company/messaging/email", label: "Company Email" },
    { path: "/company/messaging/chat", label: "Company Chat" },
    { path: "/company/messaging/inbox", label: "Company Inbox" },
    
    // More company routes
    { path: "/company/billing", label: "Company Billing" },
    { path: "/company/notifications", label: "Company Notifications" },
    { path: "/company/support", label: "Company Support" },
    { path: "/company/invoices", label: "Company Invoices" },
    { path: "/company/payments", label: "Company Payments" },
    { path: "/company/reports", label: "Company Reports" },
    { path: "/company/team", label: "Team Management" },
    { path: "/company/customers", label: "Company Customers" },
    
    // Additional company menus that might be missing
    { path: "/company/messaging", label: "Company Messaging" },
    { path: "/company/analytics", label: "Company Analytics" },
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
        {routes.map((route, index) => {
          // Render header
          if (route.type === "header") {
            return (
              <div key={`header-${index}`} className="pt-2 pb-1 first:pt-0 flex items-center">
                <p className="text-xs font-bold text-primary px-2">{route.label}</p>
                {route.description && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info size={12} className="text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        <p className="text-xs">{route.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            );
          }
          
          // Render subheader
          if (route.type === "subheader") {
            return (
              <div key={`subheader-${index}`} className="pt-1 pb-1">
                <p className="text-xs text-muted-foreground px-3">{route.label}</p>
              </div>
            );
          }
          
          // Render regular route button
          return (
            <Button
              key={`${route.path}-${index}`}
              size="sm"
              variant="ghost"
              className="w-full justify-start text-left text-xs"
              onClick={() => route.path && !route.disabled && handleNavigate(route.path)}
              disabled={route.disabled}
            >
              {route.label}
              {route.disabled && <span className="ml-auto text-[10px] text-muted-foreground">Param required</span>}
            </Button>
          );
        })}
      </div>
      
      <p className="text-[10px] text-muted-foreground mt-2 border-t pt-1">
        Development mode only. Routes bypass auth protection for preview purposes.
      </p>
    </div>
  );
}
