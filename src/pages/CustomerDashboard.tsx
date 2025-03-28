
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { DashboardView } from "@/components/customer/DashboardView";
import { EnquiriesSection } from "@/components/customer/EnquiriesSection";
import { BillingSection } from "@/components/customer/BillingSection";
import { ProfileSection } from "@/components/customer/ProfileSection";
import { NotificationsPreferencesSection } from "@/components/customer/NotificationsPreferencesSection";
import { SupportSection } from "@/components/customer/SupportSection";
import { useToast } from "@/hooks/use-toast";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Bell, Search } from "lucide-react";
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
  subject?: string;
  content?: string;
  attachments?: number;
  submitted?: string;
}

const CustomerDashboard = () => {
  const [activeNavItem, setActiveNavItem] = useState("dashboard");
  const { toast } = useToast();
  
  // Use empty array for demonstration - no default data
  const [customerEnquiries] = useState<CustomerEnquiry[]>([]);
  const isDemo = window.location.pathname.includes("demo");

  // Customer dashboard stats in a more realistic format
  const customerStats = [
    { label: "Total Inquiries", value: "164", change: "+12%", changeType: "positive" as const },
    { label: "Active Inquiries", value: "35", change: "+8%", changeType: "positive" as const },
    { label: "Pending Inquiries", value: "21", change: "-5%", changeType: "negative" as const },
    { label: "Resolved Inquiries", value: "108", change: "+15%", changeType: "positive" as const }
  ];

  const createNewEnquiry = () => {
    toast({
      title: "Feature coming soon",
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
            Create Enquiry
          </Button>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-destructive"></span>
          </Button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-6">
        <DashboardView
          customerStats={customerStats}
          customerEnquiries={customerEnquiries}
          createNewEnquiry={createNewEnquiry}
          isDemo={isDemo}
        />
      </main>
    </AppLayout>
  );
};

export default CustomerDashboard;
