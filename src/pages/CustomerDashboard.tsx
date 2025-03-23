
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarContent, 
  SidebarTrigger,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenu,
  SidebarNavItem
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
  Plus,
  FileText,
  HelpCircle
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/Container";

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
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" />, description: "Overview of your enquiries and activities" },
    { id: "enquiries", label: "My Enquiries", icon: <FileText className="h-5 w-5" />, description: "Track and manage your conversations with companies" },
    { id: "billing", label: "Billing & Payments", icon: <CreditCard className="h-5 w-5" />, description: "View invoices and make payments" },
    { id: "profile", label: "Profile Settings", icon: <User className="h-5 w-5" />, description: "Update account details" },
    { id: "notifications", label: "Notifications", icon: <Bell className="h-5 w-5" />, description: "View alerts and messages" },
    { id: "support", label: "Support", icon: <HelpCircle className="h-5 w-5" />, description: "Contact customer service or FAQs" }
  ];

  // Customer dashboard stats
  const customerStats = [
    { label: "Active Enquiries", value: "0", change: "0", changeType: "neutral" },
    { label: "Completed", value: "0", change: "0", changeType: "neutral" },
    { label: "Pending Invoices", value: "0", change: "0", changeType: "neutral" },
    { label: "Total Spent", value: "$0", change: "$0", changeType: "neutral" }
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
            <div className="space-y-1 py-4">
              {navigationItems.map((item) => (
                <SidebarNavItem
                  key={item.id}
                  id={item.id}
                  label={item.label}
                  icon={item.icon}
                  description={item.description}
                  isActive={activeNavItem === item.id}
                  onClick={setActiveNavItem}
                />
              ))}
            </div>
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
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-destructive"></span>
              </Button>
              <Button variant="default" size="sm" onClick={createNewEnquiry}>
                New Enquiry
              </Button>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-6">
            {activeNavItem === "dashboard" && (
              <>
                <Container size="full">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
                    <div>
                      <h1 className="text-2xl font-semibold mb-1">Dashboard</h1>
                      <p className="text-muted-foreground">Overview of your enquiries and activities</p>
                    </div>
                    <Button onClick={createNewEnquiry}>
                      <Plus className="h-4 w-4 mr-2" />
                      New Enquiry
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {customerStats.map((card, i) => (
                      <div key={i} className="glass-card rounded-lg p-6">
                        <div className="text-muted-foreground mb-2">{card.label}</div>
                        <div className="flex items-baseline justify-between">
                          <span className="text-3xl font-semibold">{card.value}</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            card.changeType === "positive" 
                              ? "text-green-700 bg-green-100 dark:text-green-400 dark:bg-green-950/30" 
                              : card.changeType === "negative"
                                ? "text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-950/30"
                                : "text-blue-700 bg-blue-100 dark:text-blue-400 dark:bg-blue-950/30"
                          }`}>
                            {card.change}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Container>

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

                <Container size="full" className="mt-8">
                  <div className="glass-card rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">Recent Notifications</h2>
                    {isEmpty ? (
                      <div className="text-center py-6">
                        <p className="text-muted-foreground">You don't have any notifications yet.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {/* Notification items would go here */}
                      </div>
                    )}
                  </div>
                </Container>
              </>
            )}
            
            {activeNavItem === "enquiries" && (
              <div>
                <Container size="full">
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
                </Container>
                
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
              <Container size="full">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
                  <div>
                    <h1 className="text-2xl font-semibold mb-1">Billing & Payments</h1>
                    <p className="text-muted-foreground">Manage your invoices and payment methods</p>
                  </div>
                </div>
                
                <div className="bg-card rounded-lg border shadow-sm p-8 text-center">
                  <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <CreditCard className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">No billing information</h3>
                  <p className="text-muted-foreground max-w-md mx-auto mb-6">
                    You don't have any invoices or payment methods set up yet.
                  </p>
                </div>
              </Container>
            )}
            
            {activeNavItem === "profile" && (
              <Container size="full">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
                  <div>
                    <h1 className="text-2xl font-semibold mb-1">Profile Settings</h1>
                    <p className="text-muted-foreground">Update your account information and preferences</p>
                  </div>
                  <Button variant="outline">Save Changes</Button>
                </div>
                
                <div className="bg-card rounded-lg border shadow-sm p-8">
                  <h3 className="text-xl font-medium mb-4">Your Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Name</label>
                      <input 
                        type="text" 
                        className="w-full p-2 rounded-md border border-input" 
                        value={profile?.name || ''}
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Email</label>
                      <input 
                        type="email" 
                        className="w-full p-2 rounded-md border border-input" 
                        value={profile?.email || ''}
                        readOnly
                      />
                    </div>
                  </div>
                </div>
              </Container>
            )}
            
            {activeNavItem === "notifications" && (
              <Container size="full">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
                  <div>
                    <h1 className="text-2xl font-semibold mb-1">Notifications</h1>
                    <p className="text-muted-foreground">Manage your alerts and notification preferences</p>
                  </div>
                </div>
                
                <div className="bg-card rounded-lg border shadow-sm p-8">
                  <h3 className="text-xl font-medium mb-4">Notification Preferences</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Email notifications</span>
                      <Button variant="outline" size="sm">Enable</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Push notifications</span>
                      <Button variant="outline" size="sm">Enable</Button>
                    </div>
                  </div>
                </div>
              </Container>
            )}
            
            {activeNavItem === "support" && (
              <Container size="full">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
                  <div>
                    <h1 className="text-2xl font-semibold mb-1">Support</h1>
                    <p className="text-muted-foreground">Get help and contact customer service</p>
                  </div>
                </div>
                
                <div className="bg-card rounded-lg border shadow-sm p-8 text-center">
                  <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <HelpCircle className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">Need help?</h3>
                  <p className="text-muted-foreground max-w-md mx-auto mb-6">
                    Our support team is here to help you with any questions or issues.
                  </p>
                  <Button>Contact Support</Button>
                </div>
              </Container>
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default CustomerDashboard;
