
import { useState } from "react";
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarContent, 
  SidebarNavItem
} from "@/components/ui/sidebar";
import { 
  MessageSquare, 
  Users, 
  Settings, 
  Bell, 
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
import { Button } from "@/components/ui/button";
import { CompanyDemoView } from "@/components/demo/CompanyDemoView";
import { CustomerDemoView } from "@/components/demo/CustomerDemoView";
import { DemoHeader } from "@/components/demo/DemoHeader";

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

  // Stats for demo company dashboard - explicitly type the changeType property
  const companyStats = [
    { label: "Total Enquiries", value: "164", change: "+12%", changeType: "positive" as const },
    { label: "Pending", value: "21", change: "-5%", changeType: "positive" as const },
    { label: "Response Time", value: "1.8h", change: "+0.3h", changeType: "negative" as const },
    { label: "Conversion Rate", value: "26%", change: "+2%", changeType: "positive" as const }
  ];

  // Stats for demo customer dashboard with proper zero values - explicitly type the changeType property
  const customerStats = [
    { label: "Total Inquiries", value: "5", change: "+2", changeType: "positive" as const },
    { label: "Active Inquiries", value: "2", change: "+1", changeType: "positive" as const },
    { label: "Pending Inquiries", value: "2", change: "+0", changeType: "neutral" as const },
    { label: "Resolved Inquiries", value: "3", change: "+2", changeType: "positive" as const }
  ];

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

        <div className="flex-1 flex flex-col overflow-hidden">
          <DemoHeader />

          <main className="flex-1 overflow-y-auto overflow-x-hidden">
            {activePortal === "company" ? (
              <CompanyDemoView 
                stats={companyStats} 
                activeNavItem={activeNavItem}
                companyNavItems={companyNavItems}
              />
            ) : (
              <CustomerDemoView 
                stats={customerStats} 
                activeNavItem={activeNavItem}
                customerNavItems={customerNavItems}
              />
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DemoDashboard;
