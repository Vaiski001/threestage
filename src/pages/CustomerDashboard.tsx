import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { AppLayout } from "@/components/layout/AppLayout";
import { CustomerDashboardHeader } from "@/components/customer/dashboard/CustomerDashboardHeader";
import { StatisticsCards } from "@/components/customer/dashboard/StatisticsCards";
import { EnquiryBoard } from "@/components/customer/dashboard/EnquiryBoard";
import { CompanyDirectory } from "@/components/customer/dashboard/CompanyDirectory";
import { ActivityNotifications } from "@/components/customer/dashboard/ActivityNotifications";
import { PaymentsSection } from "@/components/customer/dashboard/PaymentsSection";
import { SupportQuickAccess } from "@/components/customer/dashboard/SupportQuickAccess";
import { Container } from "@/components/ui/Container";

const CustomerDashboard = () => {
  const { profile } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  
  // Empty data states for a new account
  const stats = {
    total: 0,
    pending: 0,
    completed: 0
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // In a real application, this would trigger API calls to search across enquiries
    console.log("Searching for:", query);
  };

  return (
    <AppLayout 
      pageTitle="Dashboard" 
      searchPlaceholder="Search enquiries, forms..." 
      onSearch={handleSearch}
    >
      <div className="flex-1 overflow-y-auto pb-12">
        <Container size="full" className="py-6 space-y-6">
          {/* Welcome Banner */}
          <CustomerDashboardHeader 
            userName={profile?.name || "Customer"}
          />

          {/* Summary Statistics */}
          <StatisticsCards stats={stats} />

          {/* Main Content - 2 column layout on larger screens */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column (2/3 width) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Enquiry Board - Empty for new accounts */}
              <EnquiryBoard emptyState={true} searchQuery={searchQuery} />

              {/* Activity & Notifications */}
              <ActivityNotifications emptyState={true} />
            </div>

            {/* Right column (1/3 width) */}
            <div className="space-y-6">
              {/* Company Directory */}
              <CompanyDirectory />
              
              {/* Payments Section */}
              <PaymentsSection emptyState={true} />
              
              {/* Support Quick Access */}
              <SupportQuickAccess />
            </div>
          </div>
        </Container>
      </div>
    </AppLayout>
  );
};

export default CustomerDashboard;
