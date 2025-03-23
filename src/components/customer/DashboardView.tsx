
import { CustomerStats } from "./CustomerStats";
import { EmptyState } from "./EmptyState";
import { DashboardSection } from "./DashboardSection";
import { NotificationsSection } from "./NotificationsSection";
import { MessageCircle, Building, FileText, Heart, Filter, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Container } from "@/components/ui/Container";
import { KanbanBoard } from "@/components/kanban/KanbanBoard";
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate } from "react-router-dom";

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

interface ActionCard {
  title: string;
  description: string;
  icon: React.ReactNode;
  buttonText: string;
  onClick: () => void;
}

interface DashboardViewProps {
  customerStats: CustomerStat[];
  customerEnquiries: CustomerEnquiry[];
  createNewEnquiry: () => void;
  customerName?: string;
  isDemo?: boolean;
}

export const DashboardView = ({ 
  customerStats, 
  customerEnquiries, 
  createNewEnquiry,
  customerName = "John Doe",
  isDemo = false
}: DashboardViewProps) => {
  const isEmpty = customerEnquiries.length === 0;
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleViewInquiries = () => {
    navigate("/enquiries");
  };

  const handleBrowseCompanies = () => {
    navigate("/companies");
  };

  const handleViewSaved = () => {
    toast({
      title: "Feature coming soon",
      description: "View saved companies feature will be available soon.",
    });
  };

  const actionCards: ActionCard[] = [
    {
      title: "Find a Company",
      description: "Search and browse businesses",
      icon: <Building className="h-6 w-6 text-primary" />,
      buttonText: "Browse Companies",
      onClick: handleBrowseCompanies
    },
    {
      title: "View My Inquiries",
      description: "Track your submitted inquiries",
      icon: <FileText className="h-6 w-6 text-primary" />,
      buttonText: "View Inquiries",
      onClick: handleViewInquiries
    },
    {
      title: "Saved Companies",
      description: "Access your favorite businesses",
      icon: <Heart className="h-6 w-6 text-primary" />,
      buttonText: "View Saved",
      onClick: handleViewSaved
    }
  ];

  // Default stats with zero values
  const defaultStats = [
    { label: "Total Inquiries", value: "0", change: "0%", changeType: "neutral" as const },
    { label: "Active Inquiries", value: "0", change: "0%", changeType: "neutral" as const },
    { label: "Pending Inquiries", value: "0", change: "0%", changeType: "neutral" as const },
    { label: "Resolved Inquiries", value: "0", change: "0%", changeType: "neutral" as const }
  ];

  // Use demo stats or default zeros
  const displayStats = isDemo ? customerStats : defaultStats;

  return (
    <>
      <Container size="full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-1">Hello, {customerName}!</h1>
          <p className="text-muted-foreground">Welcome back to your customer portal</p>
        </div>

        <CustomerStats stats={displayStats} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
          {actionCards.map((card, index) => (
            <Card key={index} className="border shadow-sm">
              <CardContent className="pt-6">
                <div className="mb-4">
                  <h3 className="text-xl font-medium mb-1">{card.title}</h3>
                  <p className="text-muted-foreground text-sm">{card.description}</p>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full justify-center" 
                  onClick={card.onClick}
                >
                  {card.buttonText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>

      {/* Enquiry Board Section */}
      <div className="my-8">
        <Container size="full">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-medium">Enquiry Board</h2>
            <div className="flex gap-3">
              <Button variant="outline" size="sm" onClick={() => toast({ title: "Feature coming soon", description: "Filter functionality is coming soon." })}>
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button size="sm" onClick={createNewEnquiry}>
                <Plus className="h-4 w-4 mr-2" />
                New Enquiry
              </Button>
            </div>
          </div>
        </Container>
        
        {isEmpty ? (
          <EmptyState
            title="No enquiries yet"
            description="Get started by creating your first enquiry to connect with a company."
            buttonText="Create Your First Enquiry"
            icon={<MessageCircle className="h-8 w-8 text-primary" />}
            onButtonClick={createNewEnquiry}
            secondaryButtonText="Get Integration Code"
            onSecondaryButtonClick={() => toast({ 
              title: "Feature coming soon", 
              description: "Integration code functionality is coming soon." 
            })}
          />
        ) : (
          <KanbanBoard isDemo={isDemo} readOnly={true} />
        )}
      </div>

      <NotificationsSection />
    </>
  );
};
