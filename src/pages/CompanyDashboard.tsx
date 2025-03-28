import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  User,
  Building,
  LayoutDashboard,
  Receipt,
  DollarSign,
  PieChart,
  UserPlus,
  Filter,
  Plus,
  PlusCircle,
  FormInput
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

const CompanyDashboard = () => {
  const navigate = useNavigate();
  const [activeNavItem, setActiveNavItem] = useState("dashboard");
  const { profile, loading, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [localProfile, setLocalProfile] = useState(profile);

  useEffect(() => {
    setLocalProfile(profile);
  }, [profile]);

  useEffect(() => {
    refreshProfile();
    
    const intervalId = setInterval(() => {
      refreshProfile();
    }, 30000);
    
    return () => clearInterval(intervalId);
  }, [refreshProfile]);

  const stats = [
    { label: "Total Enquiries", value: "0", change: "0%", changeType: "neutral" },
    { label: "Pending", value: "0", change: "0%", changeType: "neutral" },
    { label: "Response Time", value: "0h", change: "0h", changeType: "neutral" },
    { label: "Conversion Rate", value: "0%", change: "0%", changeType: "neutral" }
  ];

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" />, description: "Overview of key stats and activities" },
    { id: "enquiries", label: "Enquiries", icon: <MessageSquare className="h-5 w-5" />, description: "View and manage customer enquiries" },
    { id: "customers", label: "Customers", icon: <Users className="h-5 w-5" />, description: "List of customers with their details" },
    { id: "forms", label: "Form Builder", icon: <FormInput className="h-5 w-5" />, description: "Create and manage forms" },
    { id: "invoices", label: "Invoices", icon: <Receipt className="h-5 w-5" />, description: "Manage invoices and billing" },
    { id: "payments", label: "Payments", icon: <DollarSign className="h-5 w-5" />, description: "Track payments and transactions" },
    { id: "reports", label: "Reports & Analytics", icon: <PieChart className="h-5 w-5" />, description: "Insights and trends" },
    { id: "team", label: "Team Management", icon: <UserPlus className="h-5 w-5" />, description: "Manage company users and roles" },
    { id: "settings", label: "Settings", icon: <Settings className="h-5 w-5" />, description: "Configure company details and preferences" }
  ];

  const handleNavigation = (id: string) => {
    if (id === "forms") {
      navigate("/company/forms");
    } else if (id === "enquiries") {
      navigate("/company/enquiries");
    } else if (id === "settings") {
      navigate("/company/settings");
    } else {
      setActiveNavItem(id);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-lg">Loading company dashboard...</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeNavItem) {
      case 'dashboard':
        return (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((card, i) => (
                <div key={i} className="glass-card rounded-lg p-6">
                  <div className="text-muted-foreground mb-2">{card.label}</div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-3xl font-semibold">{card.value}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      card.changeType === "positive" 
                        ? "text-green-700 bg-green-100 dark:text-green-400 dark:bg-green-950/30" 
                        : card.changeType === "negative"
                          ? "text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-950/30"
                          : "text-gray-700 bg-gray-100 dark:text-gray-400 dark:bg-gray-800/30"
                    }`}>
                      {card.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-card rounded-lg border shadow-sm p-8 text-center mb-8">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <PlusCircle className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">No enquiries yet</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                Start managing your customer enquiries by adding your first enquiry or integrating our form to your website.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={() => toast({ title: "Feature coming soon", description: "This feature is not yet implemented." })}>
                  Add First Enquiry
                </Button>
                <Button variant="outline" onClick={() => toast({ title: "Feature coming soon", description: "Integration code functionality is coming soon." })}>
                  Get Integration Code
                </Button>
              </div>
            </div>

            <div className="pb-8">
              <Container size="full">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-medium">Enquiry Board</h2>
                  <div className="flex gap-3">
                    <Button variant="outline" size="sm" onClick={() => toast({ title: "Feature coming soon", description: "Filter functionality is coming soon." })}>
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                    <Button size="sm" onClick={() => toast({ title: "Feature coming soon", description: "New enquiry creation is coming soon." })}>
                      <Plus className="h-4 w-4 mr-2" />
                      New Enquiry
                    </Button>
                  </div>
                </div>
              </Container>
              <KanbanBoard isDemo={false} />
            </div>
          </>
        );
      case 'enquiries':
        return (
          <div className="bg-card rounded-lg border shadow-sm p-8 text-center">
            <h2 className="text-2xl font-semibold mb-4">Enquiries Management</h2>
            <p className="text-muted-foreground mb-6">View and manage all your customer enquiries in one place.</p>
            <KanbanBoard isDemo={false} />
          </div>
        );
      case 'customers':
        return (
          <div className="bg-card rounded-lg border shadow-sm p-8 text-center">
            <h2 className="text-2xl font-semibold mb-4">Customer Management</h2>
            <p className="text-muted-foreground">Here you can view and manage all your customers.</p>
            <Button className="mt-6" onClick={() => toast({ title: "Feature coming soon", description: "This feature is not yet implemented." })}>
              Add New Customer
            </Button>
          </div>
        );
      case 'invoices':
        return (
          <div className="bg-card rounded-lg border shadow-sm p-8 text-center">
            <h2 className="text-2xl font-semibold mb-4">Invoice Management</h2>
            <p className="text-muted-foreground">Create, view, and manage all your invoices.</p>
            <Button className="mt-6" onClick={() => toast({ title: "Feature coming soon", description: "This feature is not yet implemented." })}>
              Create New Invoice
            </Button>
          </div>
        );
      case 'payments':
        return (
          <div className="bg-card rounded-lg border shadow-sm p-8 text-center">
            <h2 className="text-2xl font-semibold mb-4">Payment Management</h2>
            <p className="text-muted-foreground">Track all your payments and transactions.</p>
            <Button className="mt-6" onClick={() => toast({ title: "Feature coming soon", description: "This feature is not yet implemented." })}>
              Add Payment Method
            </Button>
          </div>
        );
      case 'reports':
        return (
          <div className="bg-card rounded-lg border shadow-sm p-8 text-center">
            <h2 className="text-2xl font-semibold mb-4">Reports & Analytics</h2>
            <p className="text-muted-foreground">View insights and trends about your business.</p>
            <Button className="mt-6" onClick={() => toast({ title: "Feature coming soon", description: "This feature is not yet implemented." })}>
              Generate Report
            </Button>
          </div>
        );
      case 'team':
        return (
          <div className="bg-card rounded-lg border shadow-sm p-8 text-center">
            <h2 className="text-2xl font-semibold mb-4">Team Management</h2>
            <p className="text-muted-foreground">Manage your company users and their roles.</p>
            <Button className="mt-6" onClick={() => toast({ title: "Feature coming soon", description: "This feature is not yet implemented." })}>
              Add Team Member
            </Button>
          </div>
        );
      case 'settings':
        return (
          <div className="bg-card rounded-lg border shadow-sm p-8 text-center">
            <h2 className="text-2xl font-semibold mb-4">Company Settings</h2>
            <p className="text-muted-foreground">Configure your company details and preferences.</p>
            <Button className="mt-6" onClick={() => toast({ title: "Feature coming soon", description: "This feature is not yet implemented." })}>
              Save Settings
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar>
          <div className="h-16 flex items-center px-4 border-b border-sidebar-border">
            <Building className="h-5 w-5 mr-2" />
            <h1 className="font-semibold">Company Portal</h1>
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
                  onClick={handleNavigation}
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
                  <p className="text-sm font-medium">{localProfile?.company_name || localProfile?.name || 'Company User'}</p>
                  <p className="text-xs text-sidebar-foreground/70">Company</p>
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
                    <h1 className="text-2xl font-semibold mb-1">{navigationItems.find(item => item.id === activeNavItem)?.label}</h1>
                    <p className="text-muted-foreground">{navigationItems.find(item => item.id === activeNavItem)?.description}</p>
                  </div>
                  <div className="flex gap-3">
                    {activeNavItem !== 'dashboard' && (
                      <Button onClick={() => toast({ title: "Feature coming soon", description: "This functionality is coming soon." })}>
                        {activeNavItem === 'enquiries' ? 'Add Enquiry' : 
                         activeNavItem === 'customers' ? 'Add Customer' :
                         activeNavItem === 'invoices' ? 'New Invoice' :
                         activeNavItem === 'payments' ? 'Record Payment' :
                         activeNavItem === 'reports' ? 'Export Report' :
                         activeNavItem === 'team' ? 'Add Member' :
                         'Save Changes'}
                      </Button>
                    )}
                  </div>
                </div>
                
                {renderContent()}
              </Container>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default CompanyDashboard;
