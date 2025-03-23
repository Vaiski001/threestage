
import { useState } from "react";
import { KanbanBoard } from "@/components/kanban/KanbanBoard";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/button";
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarContent, 
  SidebarTrigger,
  SidebarNavItem
} from "@/components/ui/sidebar";
import { 
  MessageSquare, 
  Users, 
  Settings, 
  Bell, 
  Search, 
  Sun, 
  User,
  CreditCard,
  FileText,
  HelpCircle,
  Building,
  LayoutDashboard,
  Receipt,
  DollarSign,
  PieChart,
  UserPlus,
  Filter,
  Plus
} from "lucide-react";
import { 
  Tabs, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";

const DemoDashboard = () => {
  const [activeNavItem, setActiveNavItem] = useState("dashboard");
  const [activePortal, setActivePortal] = useState("company");

  // Company portal navigation items
  const companyNavItems = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" />, description: "Overview of key stats and activities" },
    { id: "enquiries", label: "Enquiries", icon: <MessageSquare className="h-5 w-5" />, description: "View and manage customer enquiries" },
    { id: "customers", label: "Customers", icon: <Users className="h-5 w-5" />, description: "List of customers with their details" },
    { id: "invoices", label: "Invoices", icon: <Receipt className="h-5 w-5" />, description: "Manage invoices and billing" },
    { id: "payments", label: "Payments", icon: <DollarSign className="h-5 w-5" />, description: "Track payments and transactions" },
    { id: "reports", label: "Reports & Analytics", icon: <PieChart className="h-5 w-5" />, description: "Insights and trends" },
    { id: "team", label: "Team Management", icon: <UserPlus className="h-5 w-5" />, description: "Manage company users and roles" },
    { id: "settings", label: "Settings", icon: <Settings className="h-5 w-5" />, description: "Configure company details and preferences" }
  ];

  // Customer portal navigation items
  const customerNavItems = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" />, description: "Overview of past enquiries and responses" },
    { id: "my-enquiries", label: "My Enquiries", icon: <FileText className="h-5 w-5" />, description: "List of submitted enquiries and status updates" },
    { id: "billing", label: "Billing & Payments", icon: <CreditCard className="h-5 w-5" />, description: "View invoices and make payments" },
    { id: "profile", label: "Profile Settings", icon: <User className="h-5 w-5" />, description: "Update account details" },
    { id: "notifications", label: "Notifications", icon: <Bell className="h-5 w-5" />, description: "View alerts and messages" },
    { id: "support", label: "Support", icon: <HelpCircle className="h-5 w-5" />, description: "Contact customer service or FAQs" }
  ];

  // Get the current active navigation items based on portal selection
  const activeNavItems = activePortal === "company" ? companyNavItems : customerNavItems;

  // Stats for demo company dashboard
  const companyStats = [
    { label: "Total Enquiries", value: "164", change: "+12%", changeType: "positive" },
    { label: "Pending", value: "21", change: "-5%", changeType: "positive" },
    { label: "Response Time", value: "1.8h", change: "+0.3h", changeType: "negative" },
    { label: "Conversion Rate", value: "26%", change: "+2%", changeType: "positive" }
  ];

  // Stats for demo customer dashboard with proper zero values
  const customerStats = [
    { label: "Total Inquiries", value: "0", change: "0%", changeType: "neutral" },
    { label: "Active Inquiries", value: "0", change: "0%", changeType: "neutral" },
    { label: "Pending Inquiries", value: "0", change: "0%", changeType: "neutral" },
    { label: "Resolved Inquiries", value: "0", change: "0%", changeType: "neutral" }
  ];

  // Get the current active stats based on portal selection
  const activeStats = activePortal === "company" ? companyStats : customerStats;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar>
          <div className="h-16 flex items-center px-4 border-b border-sidebar-border">
            <h1 className="font-semibold">Enquiry Demo</h1>
          </div>
          <div className="p-4 border-b border-sidebar-border">
            <div className="space-y-2">
              <label className="text-xs text-sidebar-foreground/70">Demo Portal View</label>
              <Tabs 
                value={activePortal} 
                onValueChange={setActivePortal}
                className="w-full"
              >
                <TabsList className="w-full">
                  <TabsTrigger value="company" className="flex-1">
                    <Building className="mr-1 h-4 w-4" />
                    Company
                  </TabsTrigger>
                  <TabsTrigger value="customer" className="flex-1">
                    <User className="mr-1 h-4 w-4" />
                    Customer
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              <p className="text-xs text-sidebar-foreground/70 mt-2">
                Switch between portal views to preview both interfaces.
              </p>
            </div>
          </div>
          <SidebarContent>
            <div className="space-y-1 py-4">
              {activeNavItems.map((item) => (
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
                  <p className="text-sm font-medium">Demo User</p>
                  <p className="text-xs text-sidebar-foreground/70">
                    {activePortal === "company" ? "Company" : "Customer"}
                  </p>
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
                  placeholder="Search..."
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
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-destructive"></span>
              </Button>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto">
            <div className="pt-8 pb-4 px-4 sm:px-6">
              <Container size="full">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                  <div>
                    <h1 className="text-2xl font-semibold mb-1">
                      Demo {activePortal === "company" ? "Company" : "Customer"} Dashboard
                    </h1>
                    <p className="text-muted-foreground">
                      {activePortal === "company" 
                        ? "Manage your enquiries, customers, and company settings." 
                        : "View your enquiries, payments, and account information."}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline">
                      {activePortal === "company" ? "Export" : "View History"}
                    </Button>
                    <Button>
                      {activePortal === "company" ? "Add New" : "New Enquiry"}
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {activeStats.map((card, i) => (
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
            </div>

            {activePortal === "company" && activeNavItem === "dashboard" && (
              <>
                <div className="px-4 sm:px-6 pb-6">
                  <Container size="full">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-medium">Enquiry Board</h2>
                      <div className="flex gap-3">
                        <Button variant="outline" size="sm">
                          <Filter className="h-4 w-4 mr-2" />
                          Filter
                        </Button>
                        <Button size="sm">
                          <Plus className="h-4 w-4 mr-2" />
                          New Enquiry
                        </Button>
                      </div>
                    </div>
                  </Container>
                </div>
                <KanbanBoard isDemo={true} />
              </>
            )}
            
            {activePortal === "company" && activeNavItem !== "dashboard" && (
              <div className="px-4 sm:px-6 pb-8">
                <Container size="full">
                  <div className="bg-card rounded-lg border shadow-sm p-8 text-center">
                    <h2 className="text-2xl font-semibold mb-4">{activeNavItems.find(item => item.id === activeNavItem)?.label}</h2>
                    <p className="text-muted-foreground mb-6">{activeNavItems.find(item => item.id === activeNavItem)?.description}</p>
                    <Button>
                      {activeNavItem === 'enquiries' ? 'Add Enquiry' : 
                      activeNavItem === 'customers' ? 'Add Customer' :
                      activeNavItem === 'invoices' ? 'New Invoice' :
                      activeNavItem === 'payments' ? 'Record Payment' :
                      activeNavItem === 'reports' ? 'Generate Report' :
                      activeNavItem === 'team' ? 'Add Team Member' :
                      'Save Changes'}
                    </Button>
                  </div>
                </Container>
              </div>
            )}
            
            {activePortal === "customer" && (
              <div className="px-4 sm:px-6 pb-8">
                <Container size="full">
                  <div className="glass-card rounded-lg p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">Recent Enquiries</h2>
                    <div className="space-y-4">
                      {[
                        { id: "ENQ-001", title: "Website Redesign", status: "In Progress", date: "Jun 12, 2023", tags: ["Design", "Web"] },
                        { id: "ENQ-002", title: "SEO Consultation", status: "Completed", date: "May 28, 2023", tags: ["Marketing"] },
                        { id: "ENQ-003", title: "Mobile App Development", status: "Pending Payment", date: "Jun 5, 2023", tags: ["Development", "Mobile"] }
                      ].map((enquiry) => (
                        <div key={enquiry.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-md border bg-card">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{enquiry.title}</span>
                              <span className="text-xs text-muted-foreground">{enquiry.id}</span>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-muted-foreground">{enquiry.date}</span>
                              <div className="flex gap-1">
                                {enquiry.tags.map(tag => (
                                  <span key={tag} className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-950/30 px-2 py-0.5 text-xs font-medium text-blue-700 dark:text-blue-400">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="mt-2 sm:mt-0 self-start">
                            <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                              enquiry.status === "Completed" 
                                ? "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400" 
                                : enquiry.status === "In Progress"
                                  ? "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400"
                                  : "bg-yellow-50 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-400"
                            }`}>
                              {enquiry.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4">
                      <Button variant="outline" className="w-full">View All Enquiries</Button>
                    </div>
                  </div>
                  
                  <div className="glass-card rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">Recent Notifications</h2>
                    <div className="space-y-4">
                      {[
                        { id: 1, title: "Invoice #INV-002 Due", description: "Your invoice for SEO Consultation is due in 3 days", time: "2 hours ago", read: false },
                        { id: 2, title: "Enquiry Status Updated", description: "Your Website Redesign enquiry has been moved to In Progress", time: "yesterday", read: true },
                        { id: 3, title: "New Message", description: "You have a new message from the support team regarding your Mobile App Development enquiry", time: "2 days ago", read: true }
                      ].map((notification) => (
                        <div key={notification.id} className={`p-4 rounded-md border ${notification.read ? 'bg-card' : 'bg-primary/5 border-primary/20'}`}>
                          <div className="flex justify-between">
                            <h3 className="font-medium">{notification.title}</h3>
                            <span className="text-xs text-muted-foreground">{notification.time}</span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{notification.description}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4">
                      <Button variant="outline" className="w-full">View All Notifications</Button>
                    </div>
                  </div>
                </Container>
              </div>
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DemoDashboard;
