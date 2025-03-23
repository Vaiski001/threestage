
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarContent, 
  SidebarTrigger,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenu
} from "@/components/ui/sidebar";
import { 
  LayoutDashboard, 
  MessageSquare, 
  CreditCard, 
  User, 
  Settings, 
  Bell, 
  Search, 
  PlusCircle, 
  MessageCircle, 
  Plus
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

// Define the enquiry type with response status
interface CustomerEnquiry {
  id: string;
  title: string;
  company: string;
  status: string;
  date: string;
  lastUpdate: string;
  hasNewResponse?: boolean;
}

// Empty enquiries list for new users
const emptyEnquiries: CustomerEnquiry[] = [];

const CustomerDashboard = () => {
  const [activeNavItem, setActiveNavItem] = useState("dashboard");
  const { profile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Use empty list for new users
  const [customerEnquiries] = useState<CustomerEnquiry[]>(emptyEnquiries);
  const isEmpty = customerEnquiries.length === 0;

  // Customer navigation items
  const navigationItems = [
    { 
      id: "dashboard", 
      label: "Dashboard", 
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    { 
      id: "enquiries", 
      label: "My Enquiries", 
      icon: <MessageSquare className="h-5 w-5" />,
    },
    { 
      id: "billing", 
      label: "Billing & Payments", 
      icon: <CreditCard className="h-5 w-5" />,
    },
    { 
      id: "profile", 
      label: "Profile Settings", 
      icon: <User className="h-5 w-5" />,
    },
    { 
      id: "notifications", 
      label: "Notifications", 
      icon: <Bell className="h-5 w-5" />,
    },
    { 
      id: "support", 
      label: "Support", 
      icon: <Settings className="h-5 w-5" />,
    }
  ];

  const createNewEnquiry = () => {
    toast({
      title: "Feature coming soon",
      description: "Creating a new enquiry will be available soon.",
    });
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar variant="sidebar">
          <div className="h-16 flex items-center px-4 border-b border-sidebar-border">
            <h1 className="font-semibold text-lg">Customer Portal</h1>
          </div>
          <SidebarContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton 
                    isActive={activeNavItem === item.id}
                    onClick={() => setActiveNavItem(item.id)}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </SidebarMenuButton>
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
                  <p className="text-sm font-medium">{profile?.name || 'Customer'}</p>
                  <p className="text-xs text-sidebar-foreground/70">Customer</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="text-sidebar-foreground">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Sidebar>

        <div className="flex-1 flex flex-col">
          <header className="h-16 border-b border-border flex items-center justify-between px-4 sm:px-6">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <div className="relative hidden sm:block">
                <Search className="h-4 w-4 absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="search"
                  placeholder="Search enquiries..."
                  className="w-64 pl-10 pr-4 py-2 text-sm rounded-md bg-secondary/50 focus:bg-secondary border-0 focus:ring-1 focus:ring-primary/30 focus:outline-none"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="default" size="sm" onClick={createNewEnquiry}>
                New Enquiry
              </Button>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-6">
            {activeNavItem === "dashboard" && (
              <>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
                  <div>
                    <h1 className="text-2xl font-semibold mb-1">Dashboard</h1>
                    <p className="text-muted-foreground">Overview of your enquiries and activities</p>
                  </div>
                </div>

                {isEmpty && (
                  <div className="bg-card rounded-lg border shadow-sm p-8 text-center my-12">
                    <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <MessageCircle className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-medium mb-2">No enquiries yet</h3>
                    <p className="text-muted-foreground max-w-md mx-auto mb-6">
                      Get started by creating your first enquiry to connect with a company.
                    </p>
                    <Button 
                      onClick={createNewEnquiry}
                      className="flex items-center gap-2"
                    >
                      <PlusCircle className="h-4 w-4" />
                      Create Your First Enquiry
                    </Button>
                  </div>
                )}
              </>
            )}
            
            {activeNavItem === "enquiries" && (
              <div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
                  <div>
                    <h1 className="text-2xl font-semibold mb-1">My Enquiries</h1>
                    <p className="text-muted-foreground">Track and manage your conversations with companies</p>
                  </div>
                  <Button size="sm" onClick={createNewEnquiry}>
                    <Plus className="h-4 w-4 mr-2" />
                    New Enquiry
                  </Button>
                </div>
                
                {isEmpty && (
                  <div className="bg-card rounded-lg border shadow-sm p-8 text-center my-12">
                    <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <MessageCircle className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-medium mb-2">No enquiries yet</h3>
                    <p className="text-muted-foreground max-w-md mx-auto mb-6">
                      Get started by creating your first enquiry to connect with a company.
                    </p>
                    <Button onClick={createNewEnquiry}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Enquiry
                    </Button>
                  </div>
                )}
              </div>
            )}
            
            {activeNavItem === "billing" && (
              <div>
                <h1 className="text-2xl font-semibold mb-1">Billing & Payments</h1>
                <p className="text-muted-foreground mb-8">Manage your invoices and payment methods</p>
              </div>
            )}
            
            {activeNavItem === "profile" && (
              <div>
                <h1 className="text-2xl font-semibold mb-1">Profile Settings</h1>
                <p className="text-muted-foreground mb-8">Update your account information and preferences</p>
              </div>
            )}
            
            {activeNavItem === "notifications" && (
              <div>
                <h1 className="text-2xl font-semibold mb-1">Notifications</h1>
                <p className="text-muted-foreground mb-8">Manage your alerts and notification preferences</p>
              </div>
            )}
            
            {activeNavItem === "support" && (
              <div>
                <h1 className="text-2xl font-semibold mb-1">Support</h1>
                <p className="text-muted-foreground mb-8">Get help and contact customer service</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default CustomerDashboard;
