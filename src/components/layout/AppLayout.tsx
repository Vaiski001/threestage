import { ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { CustomerSidebar } from "@/components/customer/CustomerSidebar";
import { CustomerWorkPartnersSidebar } from "@/components/customer/CustomerWorkPartnersSidebar";
import { WorkPartnersSidebar } from "@/components/common/WorkPartnersSidebar";
import { useAuth } from "@/context/AuthContext";
import { Sidebar } from "@/components/ui/sidebar";
import { SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { ChevronDown, User, Settings, LayoutDashboard, MessageSquare, CreditCard, Bell, HelpCircle, Building, FormInput, Receipt, DollarSign, PieChart, UserPlus, Users, MessageCircle, Mail, Phone, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface AppLayoutProps {
  children: ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const [activeNavItem, setActiveNavItem] = useState("");
  
  const userRole = profile?.role || "customer";

  const toggleGroup = (id: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const customerNavigationItems = [
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
      id: "communication", 
      label: "Communication", 
      icon: <MessageCircle className="h-5 w-5" />, 
      description: "Your messages and communications", 
      children: [
        { 
          id: "messages", 
          label: "Messages", 
          icon: <MessageCircle className="h-4 w-4" />, 
          description: "Direct messages with companies" 
        },
        { 
          id: "emails", 
          label: "Emails", 
          icon: <Mail className="h-4 w-4" />, 
          description: "Email communications" 
        },
      ]
    },
    { 
      id: "billing", 
      label: "Billing & Payments", 
      icon: <CreditCard className="h-5 w-5" />, 
      description: "View invoices and make payments" 
    },
    { 
      id: "profile", 
      label: "Profile Settings", 
      icon: <User className="h-5 w-5" />, 
      description: "Update account details" 
    },
    { 
      id: "notifications", 
      label: "Notifications", 
      icon: <Bell className="h-5 w-5" />, 
      description: "View alerts and messages" 
    },
    { 
      id: "support", 
      label: "Support", 
      icon: <HelpCircle className="h-5 w-5" />, 
      description: "Contact customer service or FAQs" 
    }
  ];

  const companyNavigationItems = [
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
      id: "customers", 
      label: "Customers", 
      icon: <Users className="h-5 w-5" />, 
      description: "List of customers with their details" 
    },
    { 
      id: "communication", 
      label: "Communication", 
      icon: <MessageCircle className="h-5 w-5" />, 
      description: "Manage all communications", 
      children: [
        { id: "messages", label: "Messages", icon: <MessageSquare className="h-4 w-4" />, description: "Instant messages" },
        { id: "email", label: "Email", icon: <Mail className="h-4 w-4" />, description: "Email communications" },
        { id: "phone", label: "Phone", icon: <Phone className="h-4 w-4" />, description: "Phone calls" },
        { id: "website", label: "Website", icon: <Globe className="h-4 w-4" />, description: "Website inquiries" },
      ]
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
      description: "Manage invoices and billing" 
    },
    { 
      id: "payments", 
      label: "Payments", 
      icon: <DollarSign className="h-5 w-5" />, 
      description: "Track payments and transactions" 
    },
    { 
      id: "reports", 
      label: "Reports & Analytics", 
      icon: <PieChart className="h-5 w-5" />, 
      description: "Insights and trends" 
    },
    { 
      id: "team", 
      label: "Team Management", 
      icon: <UserPlus className="h-5 w-5" />, 
      description: "Manage company users and roles" 
    },
    { 
      id: "settings", 
      label: "Settings", 
      icon: <Settings className="h-5 w-5" />, 
      description: "Configure company details and preferences",
      path: "/company/settings"
    }
  ];

  const navigationItems = userRole === "company" ? companyNavigationItems : customerNavigationItems;

  const handleNavigation = (item: any) => {
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
            {userRole === "company" ? (
              <>
                <Building className="h-5 w-5 mr-2 text-primary" />
                <h1 className="font-semibold">Company Portal</h1>
              </>
            ) : (
              <h1 className="font-semibold text-lg">Customer Portal</h1>
            )}
          </div>
          <SidebarContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    isActive={window.location.pathname.includes(item.id) || 
                             (item.path && window.location.pathname === item.path)}
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
                      {item.children.map((child: any) => (
                        <SidebarMenuButton
                          key={child.id}
                          isActive={window.location.pathname.includes(child.id)}
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
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium">
                    {userRole === "company" 
                      ? (profile?.company_name || profile?.name || 'Company User')
                      : (profile?.name || 'Customer')}
                  </p>
                  <p className="text-xs text-sidebar-foreground/70">{userRole === "company" ? 'Company' : 'Customer'}</p>
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
        
        {userRole === "company" ? (
          <WorkPartnersSidebar />
        ) : (
          <CustomerWorkPartnersSidebar />
        )}
      </div>
    </SidebarProvider>
  );
};
