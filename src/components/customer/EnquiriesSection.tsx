
import { EmptyState } from "./EmptyState";
import { DashboardSection } from "./DashboardSection";

interface CustomerEnquiry {
  id: string;
  title: string;
  company: string;
  status: string;
  date: string;
  lastUpdate: string;
  hasNewResponse?: boolean;
}

interface EnquiriesSectionProps {
  customerEnquiries: CustomerEnquiry[];
  createNewEnquiry: () => void;
}

export const EnquiriesSection = ({ customerEnquiries, createNewEnquiry }: EnquiriesSectionProps) => {
  const isEmpty = customerEnquiries.length === 0;

  return (
    <div>
      <DashboardSection
        title="My Enquiries"
        subtitle="Track and manage your conversations with companies"
        actionButtonText="New Enquiry"
        onActionClick={createNewEnquiry}
      >
        {isEmpty && (
          <EmptyState
            title="No enquiries yet"
            description="Get started by creating your first enquiry to connect with a company."
            buttonText="Create Your First Enquiry"
            onButtonClick={createNewEnquiry}
          />
        )}
      </DashboardSection>
    </div>
  );
};
