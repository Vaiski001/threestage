
import { KanbanBoard } from "@/components/kanban/KanbanBoard";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/button";
import { Filter, Plus } from "lucide-react";
import { StatisticsCards } from "@/components/customer/dashboard/StatisticsCards";
import { WorkPartnersSidebar } from "@/components/common/WorkPartnersSidebar";

interface CompanyStatProps {
  label: string;
  value: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
}

interface CompanyDemoViewProps {
  stats: CompanyStatProps[];
  activeNavItem: string;
  companyNavItems: Array<{
    id: string;
    label: string;
    icon: React.ReactNode;
    description: string;
  }>;
}

export const CompanyDemoView = ({ 
  stats, 
  activeNavItem,
  companyNavItems 
}: CompanyDemoViewProps) => {
  // Sample statistics for the company demo dashboard
  const demoStats = {
    total: 15,
    pending: 7,
    completed: 8
  };
  
  return (
    <>
      <div className="pt-8 pb-4 px-4 sm:px-6">
        <Container size="full">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-semibold mb-1">
                Demo Company Dashboard
              </h1>
              <p className="text-muted-foreground">
                Manage your enquiries, customers, and company settings.
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline">Export</Button>
              <Button>Add New</Button>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="mb-8">
            <StatisticsCards stats={demoStats} />
          </div>
        </Container>
      </div>

      {activeNavItem === "dashboard" && (
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
              <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-4 shadow-sm">
                <KanbanBoard isDemo={true} readOnly={false} isCompanyView={true} height="h-[600px]" />
              </div>
            </Container>
          </div>
        </>
      )}
      
      {activeNavItem !== "dashboard" && (
        <div className="px-4 sm:px-6 pb-8">
          <Container size="full">
            <div className="bg-card rounded-lg border shadow-sm p-8 text-center">
              <h2 className="text-2xl font-semibold mb-4">{companyNavItems.find(item => item.id === activeNavItem)?.label}</h2>
              <p className="text-muted-foreground mb-6">{companyNavItems.find(item => item.id === activeNavItem)?.description}</p>
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

      {/* Right side navigation menu */}
      <WorkPartnersSidebar isCompanyView={true} />
    </>
  );
};
