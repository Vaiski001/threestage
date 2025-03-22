
import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/button";
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarContent, 
  SidebarTrigger,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuBadge
} from "@/components/ui/sidebar";
import { 
  LayoutDashboard, 
  MessageSquare, 
  CreditCard, 
  User, 
  Settings, 
  Bell, 
  Search, 
  Sun, 
  Plus, 
  Filter, 
  Clock, 
  PlusCircle, 
  MessageCircle, 
  AlertCircle,
  HelpCircle
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

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
  
  // Use empty list for new users
  const [customerEnquiries, setCustomerEnquiries] = useState<CustomerEnquiry[]>(emptyEnquiries);
  const isEmpty = customerEnquiries.length === 0;

  // Stats counters based on actual data
  const countByStatus = {
    total: customerEnquiries.length,
    pending: customerEnquiries.filter(e => e.status === "Pending").length,
    answered: customerEnquiries.filter(e => e.status === "Answered").length,
    closed: customerEnquiries.filter(e => e.status === "Closed").length,
    withNewResponses: customerEnquiries.filter(e => e.hasNewResponse).length
  };

  // Function to mark an enquiry as read (would connect to backend in production)
  const markAsRead = (id: string) => {
    setCustomerEnquiries(prev => 
      prev.map(enquiry => 
        enquiry.id === id 
          ? { ...enquiry, hasNewResponse: false } 
          : enquiry
      )
    );
    
    toast({
      title: "Marked as read",
      description: "The message has been marked as read",
    });
  };

  // Customer navigation items
  const navigationItems = [
    { 
      id: "dashboard", 
      label: "Dashboard", 
      icon: <LayoutDashboard className="h-5 w-5" />,
      badge: null
    },
    { 
      id: "enquiries", 
      label: "My Enquiries", 
      icon: <MessageSquare className="h-5 w-5" />,
      badge: countByStatus.withNewResponses > 0 ? countByStatus.withNewResponses : null
    },
    { 
      id: "billing", 
      label: "Billing & Payments", 
      icon: <CreditCard className="h-5 w-5" />,
      badge: null
    },
    { 
      id: "profile", 
      label: "Profile Settings", 
      icon: <User className="h-5 w-5" />,
      badge: null
    },
    { 
      id: "notifications", 
      label: "Notifications", 
      icon: <Bell className="h-5 w-5" />,
      badge: countByStatus.withNewResponses > 0 ? countByStatus.withNewResponses : null
    },
    { 
      id: "support", 
      label: "Support", 
      icon: <HelpCircle className="h-5 w-5" />,
      badge: null
    }
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar>
          <div className="h-16 flex items-center px-4 border-b border-sidebar-border">
            <h1 className="font-semibold">Customer Portal</h1>
          </div>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
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
                      {item.badge && (
                        <SidebarMenuBadge>
                          {item.badge}
                        </SidebarMenuBadge>
                      )}
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
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
              <Button variant="ghost" size="icon">
                <Sun className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {countByStatus.withNewResponses > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-destructive"></span>
                )}
              </Button>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto">
            <div className="p-6">
              <Container size="full">
                {/* Dashboard content based on active navigation item */}
                {activeNavItem === "dashboard" && (
                  <>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                      <div>
                        <h1 className="text-2xl font-semibold mb-1">Dashboard</h1>
                        <p className="text-muted-foreground">Overview of your enquiries and activities</p>
                      </div>
                      <Button size="sm" className="animate-pulse">
                        <Plus className="h-4 w-4 mr-2" />
                        New Enquiry
                      </Button>
                    </div>

                    {isEmpty ? (
                      <div className="bg-card rounded-lg border shadow-sm p-8 text-center my-12">
                        <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                          <MessageCircle className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="text-xl font-medium mb-2">No enquiries yet</h3>
                        <p className="text-muted-foreground max-w-md mx-auto mb-6">
                          Get started by creating your first enquiry to connect with a company.
                        </p>
                        <Button className="animate-pulse">
                          <Plus className="h-4 w-4 mr-2" />
                          Create Your First Enquiry
                        </Button>
                      </div>
                    ) : (
                      <>
                        <div className="bg-card rounded-lg border shadow-sm mb-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
                            <div className="bg-primary/10 rounded-lg p-4 flex items-center gap-4">
                              <div className="bg-primary/20 p-3 rounded-lg">
                                <MessageSquare className="h-6 w-6 text-primary" />
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Total Enquiries</p>
                                <p className="text-2xl font-semibold">{countByStatus.total}</p>
                              </div>
                            </div>
                            
                            <div className="bg-yellow-500/10 rounded-lg p-4 flex items-center gap-4">
                              <div className="bg-yellow-500/20 p-3 rounded-lg">
                                <Clock className="h-6 w-6 text-yellow-500" />
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Pending</p>
                                <p className="text-2xl font-semibold">{countByStatus.pending}</p>
                              </div>
                            </div>
                            
                            <div className="bg-green-500/10 rounded-lg p-4 flex items-center gap-4">
                              <div className="bg-green-500/20 p-3 rounded-lg">
                                <MessageSquare className="h-6 w-6 text-green-500" />
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Answered</p>
                                <p className="text-2xl font-semibold">{countByStatus.answered}</p>
                              </div>
                            </div>
                            
                            <div className="bg-blue-500/10 rounded-lg p-4 flex items-center gap-4">
                              <div className="bg-blue-500/20 p-3 rounded-lg">
                                <MessageSquare className="h-6 w-6 text-blue-500" />
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Closed</p>
                                <p className="text-2xl font-semibold">{countByStatus.closed}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
                          <div className="px-6 py-4 bg-muted/50 flex items-center justify-between">
                            <h3 className="font-medium">Recent Enquiries</h3>
                            <Button variant="ghost" size="sm">View All</Button>
                          </div>
                          <div className="grid divide-y">
                            {customerEnquiries.slice(0, 3).map((enquiry) => (
                              <div 
                                key={enquiry.id} 
                                className={`px-6 py-4 grid grid-cols-12 gap-4 items-center hover:bg-muted/30 transition-colors ${
                                  enquiry.hasNewResponse ? 'bg-primary/5 border-l-4 border-primary' : ''
                                }`}
                              >
                                <div className="col-span-6 lg:col-span-5">
                                  <div className="flex items-center">
                                    {enquiry.hasNewResponse && (
                                      <span className="mr-2 text-primary">
                                        <AlertCircle className="h-4 w-4" />
                                      </span>
                                    )}
                                    <div>
                                      <p className="font-medium">{enquiry.title}</p>
                                      <p className="text-xs text-muted-foreground md:hidden">
                                        {enquiry.company}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-span-3 lg:col-span-3 hidden md:block text-sm">
                                  {enquiry.company}
                                </div>
                                <div className="col-span-2 lg:col-span-2 text-center">
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    enquiry.status === "Pending" 
                                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500"
                                      : enquiry.status === "Answered"
                                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500"
                                        : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500"
                                  }`}>
                                    {enquiry.status}
                                  </span>
                                </div>
                                <div className="col-span-4 lg:col-span-2 text-right">
                                  <div className="flex flex-col items-end">
                                    <span className="text-sm text-muted-foreground">
                                      {enquiry.lastUpdate}
                                    </span>
                                    {enquiry.hasNewResponse && (
                                      <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="mt-1 text-xs h-7"
                                        onClick={() => markAsRead(enquiry.id)}
                                      >
                                        View Response
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </>
                )}
                
                {activeNavItem === "enquiries" && (
                  <div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                      <div>
                        <h1 className="text-2xl font-semibold mb-1">My Enquiries</h1>
                        <p className="text-muted-foreground">Track and manage your conversations with companies</p>
                      </div>
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        New Enquiry
                      </Button>
                    </div>
                    
                    {/* Enquiries table content would go here */}
                    {isEmpty ? (
                      <div className="bg-card rounded-lg border shadow-sm p-8 text-center my-12">
                        <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                          <MessageCircle className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="text-xl font-medium mb-2">No enquiries yet</h3>
                        <p className="text-muted-foreground max-w-md mx-auto mb-6">
                          Get started by creating your first enquiry to connect with a company.
                        </p>
                        <Button>
                          <Plus className="h-4 w-4 mr-2" />
                          Create Your First Enquiry
                        </Button>
                      </div>
                    ) : (
                      <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
                        <div className="grid divide-y">
                          <div className="px-6 py-4 bg-muted/50 grid grid-cols-12 gap-4 text-sm font-medium">
                            <div className="col-span-6 lg:col-span-5">Enquiry</div>
                            <div className="col-span-3 lg:col-span-3 hidden md:block">Company</div>
                            <div className="col-span-2 lg:col-span-2 text-center">Status</div>
                            <div className="col-span-4 lg:col-span-2 text-right">Last Update</div>
                          </div>
                          
                          {customerEnquiries.map((enquiry) => (
                            <div 
                              key={enquiry.id} 
                              className={`px-6 py-4 grid grid-cols-12 gap-4 items-center hover:bg-muted/30 transition-colors ${
                                enquiry.hasNewResponse ? 'bg-primary/5 border-l-4 border-primary animate-pulse' : ''
                              }`}
                            >
                              <div className="col-span-6 lg:col-span-5">
                                <div className="flex items-center">
                                  {enquiry.hasNewResponse && (
                                    <span className="mr-2 text-primary">
                                      <AlertCircle className="h-4 w-4" />
                                    </span>
                                  )}
                                  <div>
                                    <p className="font-medium">{enquiry.title}</p>
                                    <p className="text-xs text-muted-foreground md:hidden">
                                      {enquiry.company}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="col-span-3 lg:col-span-3 hidden md:block text-sm">
                                {enquiry.company}
                              </div>
                              <div className="col-span-2 lg:col-span-2 text-center">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  enquiry.status === "Pending" 
                                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500"
                                    : enquiry.status === "Answered"
                                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500"
                                      : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500"
                                }`}>
                                  {enquiry.status}
                                </span>
                              </div>
                              <div className="col-span-4 lg:col-span-2 text-right">
                                <div className="flex flex-col items-end">
                                  <span className="text-sm text-muted-foreground">
                                    {enquiry.lastUpdate}
                                  </span>
                                  {enquiry.hasNewResponse && (
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      className="mt-1 text-xs h-7"
                                      onClick={() => markAsRead(enquiry.id)}
                                    >
                                      View Response
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                {activeNavItem === "billing" && (
                  <div>
                    <h1 className="text-2xl font-semibold mb-1">Billing & Payments</h1>
                    <p className="text-muted-foreground mb-8">Manage your invoices and payment methods</p>
                    
                    <div className="bg-card rounded-lg border shadow-sm p-8 text-center">
                      <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                        <CreditCard className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-xl font-medium mb-2">No billing history</h3>
                      <p className="text-muted-foreground max-w-md mx-auto mb-6">
                        You don't have any invoices or payment history yet.
                      </p>
                    </div>
                  </div>
                )}
                
                {activeNavItem === "profile" && (
                  <div>
                    <h1 className="text-2xl font-semibold mb-1">Profile Settings</h1>
                    <p className="text-muted-foreground mb-8">Update your account information and preferences</p>
                    
                    <div className="grid gap-6">
                      <div className="bg-card rounded-lg border shadow-sm p-6">
                        <h3 className="text-lg font-medium mb-4">Personal Information</h3>
                        <div className="grid gap-4">
                          <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium mb-1 block">Full Name</label>
                              <input 
                                type="text" 
                                className="w-full rounded-md border border-input bg-background px-3 py-2"
                                defaultValue={profile?.name || ''} 
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium mb-1 block">Email Address</label>
                              <input 
                                type="email" 
                                className="w-full rounded-md border border-input bg-background px-3 py-2"
                                defaultValue={profile?.email || ''} 
                                disabled
                              />
                            </div>
                          </div>
                          <div>
                            <Button className="mt-2">Save Changes</Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeNavItem === "notifications" && (
                  <div>
                    <h1 className="text-2xl font-semibold mb-1">Notifications</h1>
                    <p className="text-muted-foreground mb-8">Manage your alerts and notification preferences</p>
                    
                    {countByStatus.withNewResponses > 0 ? (
                      <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
                        <div className="px-6 py-4 bg-muted/50">
                          <h3 className="font-medium">Recent Notifications</h3>
                        </div>
                        <div className="divide-y">
                          {customerEnquiries.filter(e => e.hasNewResponse).map((enquiry) => (
                            <div key={enquiry.id} className="p-4 hover:bg-muted/30">
                              <div className="flex items-start gap-3">
                                <div className="bg-primary/10 rounded-full p-2">
                                  <AlertCircle className="h-4 w-4 text-primary" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex justify-between">
                                    <p className="font-medium">{enquiry.company} responded to your enquiry</p>
                                    <span className="text-xs text-muted-foreground">{enquiry.lastUpdate}</span>
                                  </div>
                                  <p className="text-sm text-muted-foreground">{enquiry.title}</p>
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="mt-2 text-xs h-7"
                                    onClick={() => markAsRead(enquiry.id)}
                                  >
                                    View Response
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="bg-card rounded-lg border shadow-sm p-8 text-center">
                        <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                          <Bell className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="text-xl font-medium mb-2">All caught up!</h3>
                        <p className="text-muted-foreground max-w-md mx-auto">
                          You don't have any new notifications at this time.
                        </p>
                      </div>
                    )}
                  </div>
                )}
                
                {activeNavItem === "support" && (
                  <div>
                    <h1 className="text-2xl font-semibold mb-1">Support</h1>
                    <p className="text-muted-foreground mb-8">Get help and contact customer service</p>
                    
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="bg-card rounded-lg border shadow-sm p-6">
                        <div className="mb-4">
                          <HelpCircle className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="text-lg font-medium mb-2">Help Center</h3>
                        <p className="text-muted-foreground mb-4">
                          Browse through our knowledge base and find answers to common questions.
                        </p>
                        <Button variant="outline">Visit Help Center</Button>
                      </div>
                      
                      <div className="bg-card rounded-lg border shadow-sm p-6">
                        <div className="mb-4">
                          <MessageCircle className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="text-lg font-medium mb-2">Contact Support</h3>
                        <p className="text-muted-foreground mb-4">
                          Can't find what you need? Reach out to our support team directly.
                        </p>
                        <Button>Contact Us</Button>
                      </div>
                    </div>
                  </div>
                )}
              </Container>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default CustomerDashboard;
