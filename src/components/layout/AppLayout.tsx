
import { ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { CustomerSidebar } from "@/components/customer/CustomerSidebar";
import { CustomerWorkPartnersSidebar } from "@/components/customer/CustomerWorkPartnersSidebar";
import { WorkPartnersSidebar } from "@/components/common/WorkPartnersSidebar";
import { useAuth } from "@/context/AuthContext";
import { Sidebar } from "@/components/ui/sidebar";
import { SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { ChevronDown, User, Settings, LayoutDashboard, MessageSquare, CreditCard, Bell, HelpCircle, Building, FormInput, Receipt, DollarSign, PieChart, UserPlus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

interface AppLayoutProps {
  children: ReactNode;
}

// Define the navigation item interface with optional children property
interface NavigationItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  description: string;
  path?: string;
  children?: NavigationItem[];
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const [activeNavItem, setActiveNavItem] = useState("");
  
  // Determine user role from profile or from the current path as fallback
  const userRole = profile?.role || (location.pathname.startsWith('/company/') ? "company" : "customer");
  const isCompany = userRole === "company";

  const toggleGroup = (id: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Customer-specific navigation items with descriptions
  const customerNavigationItems: NavigationItem[] = [
    { 
      id: "dashboard", 
      label: "Dashboard", 
      icon: <LayoutDashboard className="h-5 w-5" />, 
      description: "Overview of your enquiries and activities",
      path: "/customer/dashboard"
    },
    { 
      id: "enquiries", 
      label: "My Enquiries", 
      icon: <MessageSquare className="h-5 w-5" />, 
      description: "Track and manage your conversations with companies", 
      path: "/customer/enquiries" 
    },
    { 
      id: "billing", 
      label: "Billing & Payments", 
      icon: <CreditCard className="h-5 w-5" />, 
      description: "View invoices and make payments",
      path: "/customer/billing"
    },
    { 
      id: "profile", 
      label: "Profile Settings", 
      icon: <User className="h-5 w-5" />, 
      description: "Update account details",
      path: "/customer/settings"
    },
    { 
      id: "notifications", 
      label: "Notifications", 
      icon: <Bell className="h-5 w-5" />, 
      description: "View alerts and messages",
      path: "/customer/notifications"
    },
    { 
      id: "support", 
      label: "Support", 
      icon: <HelpCircle className="h-5 w-5" />, 
      description: "Contact customer service or FAQs",
      path: "/customer/support"
    }
  ];

  // Company-specific navigation items with descriptions
  const companyNavigationItems: NavigationItem[] = [
    { 
      id: "dashboard", 
      label: "Dashboard", 
      icon: <LayoutDashboard className="h-5 w-5" />, 
      description: "Overview of key stats and activities",
      path: "/company/dashboard"
    },
    { 
      id: "enquiries", 
      label: "Enquiries", 
      icon: <MessageSquare className="h-5 w-5" />, 
      description: "View and manage customer enquiries",
      path: "/company/enquiries"
    },
    { 
      id: "forms", 
      label: "Form Builder", 
      icon: <FormInput className="h-5 w-5" />, 
      description: "Create and manage forms",
      path: "/company/forms"
    },
    { 
      id: "invoices", 
      label: "Invoices", 
      icon: <Receipt className="h-5 w-5" />, 
      description: "Manage invoices and billing",
      path: "/company/invoices"
    },
    { 
      id: "payments", 
      label: "Payments", 
      icon: <DollarSign className="h-5 w-5" />, 
      description: "Track payments and transactions",
      path: "/company/payments"
    },
    { 
      id: "reports", 
      label: "Reports & Analytics", 
      icon: <PieChart className="h-5 w-5" />, 
      description: "Insights and trends",
      path: "/company/reports"
    },
    { 
      id: "team", 
      label: "Team Management", 
      icon: <UserPlus className="h-5 w-5" />, 
      description: "Manage company users and roles",
      path: "/company/team"
    },
    { 
      id: "customers", 
      label: "Customers", 
      icon: <Users className="h-5 w-5" />, 
      description: "List of customers with their details",
      path: "/company/customers"
    },
    { 
      id: "settings", 
      label: "Settings", 
      icon: <Settings className="h-5 w-5" />, 
      description: "Configure company details and preferences",
      path: "/company/settings"
    },
    { 
      id: "support", 
      label: "Support", 
      icon: <HelpCircle className="h-5 w-5" />, 
      description: "Get help and support",
      path: "/company/support"
    }
  ];

  const navigationItems = isCompany ? companyNavigationItems : customerNavigationItems;

  const handleNavigation = (item: NavigationItem) => {
    if (item.children && item.children.length > 0) {
      toggleGroup(item.id);
      return;
    }
    
    if (item.path) {
      navigate(item.path);
    } else {
      setActiveNavItem(item.id);
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar>
          <div className="h-16 flex items-center px-4 border-b border-sidebar-border">
            {isCompany ? (
              <div className="flex items-center">
                <Building className="h-5 w-5 mr-2 text-primary" />
                <h1 className="font-semibold">Company Portal</h1>
              </div>
            ) : (
              <div className="flex items-center">
                <User className="h-5 w-5 mr-2 text-primary" />
                <h1 className="font-semibold">Customer Portal</h1>
              </div>
            )}
          </div>
          <SidebarContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    isActive={location.pathname === item.path || location.pathname.includes(`/${userRole}/${item.id}`)}
                    onClick={() => handleNavigation(item)}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                    {item.children && item.children.length > 0 && (
                      <ChevronDown 
                        className={`ml-auto h-4 w-4 transition-transform ${
                          expandedGroups[item.id] ? 'rotate-180' : ''
                        }`}
                      />
                    )}
                  </SidebarMenuButton>
                  {item.children && item.children.length > 0 && expandedGroups[item.id] && (
                    <div className="pl-8 mt-1 space-y-1">
                      {item.children.map((child) => (
                        <SidebarMenuButton
                          key={child.id}
                          isActive={location.pathname === child.path}
                          onClick={() => {
                            if (child.path) {
                              navigate(child.path);
                            } else {
                              setActiveNavItem(child.id);
                            }
                          }}
                          size="sm"
                        >
                          {child.icon}
                          <span>{child.label}</span>
                        </SidebarMenuButton>
                      ))}
                    </div>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
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
                onClick={() => navigate(`/${userRole}/settings`)}
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Sidebar>

        <div className="flex-1 flex flex-col">
          {children}
        </div>
        
        {isCompany ? (
          <WorkPartnersSidebar />
        ) : (
          <CustomerWorkPartnersSidebar />
        )}
      </div>
    </SidebarProvider>
  );
};
