
import { KanbanBoard } from "@/components/kanban/KanbanBoard";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/button";
import { Filter, Plus } from "lucide-react";

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
                        : "text-blue-700 bg-blue-100 dark:text-blue-400 dark:bg-blue-950/30"
                  }`}>
                    {card.change}
                  </span>
                </div>
              </div>
            ))}
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
            </Container>
          </div>
          <KanbanBoard isDemo={true} />
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
    </>
  );
};
