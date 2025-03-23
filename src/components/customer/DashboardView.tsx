
import { CustomerStats } from "./CustomerStats";
import { EmptyState } from "./EmptyState";
import { DashboardSection } from "./DashboardSection";
import { NotificationsSection } from "./NotificationsSection";
import { MessageCircle } from "lucide-react";

interface CustomerEnquiry {
  id: string;
  title: string;
  company: string;
  status: string;
  date: string;
  lastUpdate: string;
  hasNewResponse?: boolean;
}

interface CustomerStat {
  label: string;
  value: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
}

interface DashboardViewProps {
  customerStats: CustomerStat[];
  customerEnquiries: CustomerEnquiry[];
  createNewEnquiry: () => void;
}

export const DashboardView = ({ 
  customerStats, 
  customerEnquiries, 
  createNewEnquiry 
}: DashboardViewProps) => {
  const isEmpty = customerEnquiries.length === 0;

  return (
    <>
      <DashboardSection
        title="Dashboard"
        subtitle="Overview of your enquiries and activities"
        actionButtonText="New Enquiry"
        onActionClick={createNewEnquiry}
      >
        <CustomerStats stats={customerStats} />
      </DashboardSection>

      {isEmpty && (
        <EmptyState
          title="No enquiries yet"
          description="Get started by creating your first enquiry to connect with a company."
          buttonText="Create Your First Enquiry"
          icon={<MessageCircle className="h-8 w-8 text-primary" />}
          onButtonClick={createNewEnquiry}
        />
      )}

      <NotificationsSection isEmpty={isEmpty} />
    </>
  );
};
