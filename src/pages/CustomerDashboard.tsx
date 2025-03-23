
import { useState } from "react";
import { 
  SidebarProvider
} from "@/components/ui/sidebar";
import { 
  LayoutDashboard, 
  FileText, 
  CreditCard, 
  User, 
  Settings, 
  Bell, 
  HelpCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CustomerSidebar } from "@/components/customer/CustomerSidebar";
import { CustomerHeader } from "@/components/customer/CustomerHeader";
import { DashboardView } from "@/components/customer/DashboardView";
import { EnquiriesSection } from "@/components/customer/EnquiriesSection";
import { BillingSection } from "@/components/customer/BillingSection";
import { ProfileSection } from "@/components/customer/ProfileSection";
import { NotificationsPreferencesSection } from "@/components/customer/NotificationsPreferencesSection";
import { SupportSection } from "@/components/customer/SupportSection";

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

const CustomerDashboard = () => {
  const [activeNavItem, setActiveNavItem] = useState("dashboard");
  const { toast } = useToast();
  
  // Use sample data for demonstration
  const [customerEnquiries] = useState<CustomerEnquiry[]>([]);
  const isDemo = window.location.pathname.includes("demo");

  // Customer navigation items
  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" />, description: "Overview of your enquiries and activities" },
    { id: "enquiries", label: "My Enquiries", icon: <FileText className="h-5 w-5" />, description: "Track and manage your conversations with companies" },
    { id: "billing", label: "Billing & Payments", icon: <CreditCard className="h-5 w-5" />, description: "View invoices and make payments" },
    { id: "profile", label: "Profile Settings", icon: <User className="h-5 w-5" />, description: "Update account details" },
    { id: "notifications", label: "Notifications", icon: <Bell className="h-5 w-5" />, description: "View alerts and messages" },
    { id: "support", label: "Support", icon: <HelpCircle className="h-5 w-5" />, description: "Contact customer service or FAQs" }
  ];

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
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <CustomerSidebar
          navigationItems={navigationItems}
          activeNavItem={activeNavItem}
          setActiveNavItem={setActiveNavItem}
        />

        <div className="flex-1 flex flex-col">
          <CustomerHeader onNewEnquiry={createNewEnquiry} />

          <main className="flex-1 overflow-y-auto p-6">
            {activeNavItem === "dashboard" && (
              <DashboardView
                customerStats={customerStats}
                customerEnquiries={customerEnquiries}
                createNewEnquiry={createNewEnquiry}
                isDemo={isDemo}
              />
            )}
            
            {activeNavItem === "enquiries" && (
              <EnquiriesSection
                customerEnquiries={customerEnquiries}
                createNewEnquiry={createNewEnquiry}
              />
            )}
            
            {activeNavItem === "billing" && <BillingSection />}
            
            {activeNavItem === "profile" && <ProfileSection />}
            
            {activeNavItem === "notifications" && <NotificationsPreferencesSection />}
            
            {activeNavItem === "support" && <SupportSection />}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default CustomerDashboard;
