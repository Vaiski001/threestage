
import { useState, useEffect } from "react";
import { KanbanBoard } from "@/components/kanban/KanbanBoard";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/button";
import { SidebarProvider, Sidebar, SidebarContent, SidebarTrigger } from "@/components/ui/sidebar";
import { MessageSquare, Users, BarChart, Settings, Bell, Search, Sun, User, FileText, CreditCard, PlusCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

const CompanyDashboard = () => {
  const [activeNavItem, setActiveNavItem] = useState("dashboard");
  const { profile, loading, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [localProfile, setLocalProfile] = useState(profile);

  // Update local profile state when profile changes
  useEffect(() => {
    setLocalProfile(profile);
    console.log("CompanyDashboard received profile update:", profile);
  }, [profile]);

  // Refresh profile data on mount and periodically
  useEffect(() => {
    // Refresh on mount
    refreshProfile();
    
    // Set up periodic refresh every 30 seconds
    const intervalId = setInterval(() => {
      refreshProfile();
    }, 30000);
    
    return () => clearInterval(intervalId);
  }, [refreshProfile]);

  // Stats for all company users (showing zero values initially)
  const stats = [
    { label: "Total Enquiries", value: "0", change: "0%", changeType: "neutral" },
    { label: "Pending", value: "0", change: "0%", changeType: "neutral" },
    { label: "Response Time", value: "0h", change: "0h", changeType: "neutral" },
    { label: "Conversion Rate", value: "0%", change: "0%", changeType: "neutral" }
  ];

  // Show loading state while profile data is loading
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-lg">Loading company dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar>
          <div className="h-16 flex items-center px-4 border-b border-sidebar-border">
            <h1 className="font-semibold">Company Portal</h1>
          </div>
          <SidebarContent>
            <div className="space-y-1 py-4">
              {[
                { id: "dashboard", label: "Dashboard", icon: <BarChart className="h-5 w-5" /> },
                { id: "enquiries", label: "Enquiries", icon: <MessageSquare className="h-5 w-5" /> },
                { id: "customers", label: "Customers", icon: <Users className="h-5 w-5" /> },
                { id: "invoices", label: "Invoices", icon: <FileText className="h-5 w-5" /> },
                { id: "payments", label: "Payments", icon: <CreditCard className="h-5 w-5" /> },
                { id: "settings", label: "Settings", icon: <Settings className="h-5 w-5" /> }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveNavItem(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-all-200 ${
                    activeNavItem === item.id
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
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
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-destructive"></span>
              </Button>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto">
            <div className="pt-8 pb-4 px-4 sm:px-6">
              <Container size="full">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                  <div>
                    <h1 className="text-2xl font-semibold mb-1">Welcome, {localProfile?.company_name || localProfile?.name || 'Company User'}</h1>
                    <p className="text-muted-foreground">Here's what's happening with your enquiries today.</p>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => toast({ title: "Feature coming soon", description: "Export functionality is coming soon." })}>Export</Button>
                    <Button onClick={() => toast({ title: "Feature coming soon", description: "Add new functionality is coming soon." })}>Add New</Button>
                  </div>
                </div>

                {/* Stats cards - always shown with zero values initially */}
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

                {/* Empty state message - always shown until we implement real data fetching */}
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
              </Container>
            </div>

            {/* Always show the Kanban board with empty state */}
            <KanbanBoard isDemo={false} />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default CompanyDashboard;
