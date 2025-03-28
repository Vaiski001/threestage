
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { DashboardView } from "@/components/customer/DashboardView";
import { useToast } from "@/hooks/use-toast";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Bell, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// Define change type
type ChangeType = "positive" | "negative" | "neutral";

// Define the enquiry type with response status
interface CustomerEnquiry {
  id: string;
  title: string;
  company: string;
  status: string;
  date: string;
  lastUpdate: string;
  hasNewResponse?: boolean;
  subject?: string;
  content?: string;
  attachments?: number;
  submitted?: string;
}

// Define customer stat interface with proper types
interface CustomerStat {
  label: string;
  value: string;
  change: string;
  changeType: ChangeType;
}

const CustomerDashboard = () => {
  const [activeNavItem, setActiveNavItem] = useState("dashboard");
  const { toast } = useToast();
  
  // Use empty array for demonstration - no default data
  const [customerEnquiries] = useState<CustomerEnquiry[]>([]);
  const isDemo = window.location.pathname.includes("demo");

  // Customer dashboard stats with proper type for changeType
  const customerStats: CustomerStat[] = [
    { label: "Total Inquiries", value: "0", change: "0%", changeType: "neutral" },
    { label: "Active Inquiries", value: "0", change: "0%", changeType: "neutral" },
    { label: "Pending Inquiries", value: "0", change: "0%", changeType: "neutral" },
    { label: "Resolved Inquiries", value: "0", change: "0%", changeType: "neutral" }
  ];

  const createNewEnquiry = () => {
    toast({
      title: "Create New Enquiry",
      description: "Creating a new enquiry will be available soon.",
    });
  };

  return (
    <AppLayout>
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
          <Button 
            variant="outline" 
            size="sm" 
            onClick={createNewEnquiry}
            className="hidden sm:flex"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Enquiry
          </Button>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-destructive"></span>
          </Button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold mb-2">Customer Dashboard</h1>
          <p className="text-muted-foreground">Overview of your enquiries</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {customerStats.map((stat, i) => (
            <Card key={i} className="shadow-sm">
              <CardContent className="p-6">
                <div className="text-muted-foreground text-sm mb-2">{stat.label}</div>
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-semibold">{stat.value}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    stat.changeType === "positive" 
                      ? "text-green-700 bg-green-100 dark:text-green-400 dark:bg-green-950/30" 
                      : stat.changeType === "negative"
                        ? "text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-950/30"
                        : "text-gray-700 bg-gray-100 dark:text-gray-400 dark:bg-gray-800/30"
                  }`}>
                    {stat.change}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="bg-card rounded-lg border shadow-sm p-8 text-center mb-8">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Plus className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-xl font-medium mb-2">No enquiries yet</h3>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            You haven't created any enquiries yet. Submit your first enquiry to get started.
          </p>
          <Button onClick={createNewEnquiry}>
            Create Your First Enquiry
          </Button>
        </div>

        <div className="bg-card rounded-lg border shadow-sm p-6">
          <h2 className="text-xl font-medium mb-4">Your Recent Activity</h2>
          <div className="text-center py-8 text-muted-foreground">
            <p>No recent activity to display</p>
          </div>
        </div>
      </main>
    </AppLayout>
  );
};

export default CustomerDashboard;
