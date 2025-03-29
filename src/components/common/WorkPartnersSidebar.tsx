
import { useState } from "react";
import { Sidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface WorkPartner {
  id: string;
  name: string;
  avatarUrl?: string;
  activity: string;
  timeAgo: string;
  isOnline?: boolean;
}

export const WorkPartnersSidebar = ({ isCompanyView = false }: { isCompanyView?: boolean } = {}) => {
  const [activeTab, setActiveTab] = useState<"activities" | "online">("activities");
  const { toast } = useToast();
  
  // Sample work partners for the company view
  const companyWorkPartners: WorkPartner[] = [
    {
      id: "1",
      name: "Sarah Wilson",
      activity: "Responded to your message",
      timeAgo: "10m ago",
      isOnline: true
    },
    {
      id: "2",
      name: "David Lee",
      activity: "Updated support ticket",
      timeAgo: "1h ago",
      isOnline: true
    },
    {
      id: "3",
      name: "Jennifer Taylor",
      activity: "Paid invoice #INV-2023",
      timeAgo: "3h ago",
      isOnline: false
    },
    {
      id: "4",
      name: "Michael Brown",
      activity: "Submitted new enquiry",
      timeAgo: "5h ago",
      isOnline: false
    },
    {
      id: "5",
      name: "Emma Johnson",
      activity: "Updated account details",
      timeAgo: "1d ago",
      isOnline: true
    }
  ];
  
  // Sample work partners for the customer view - companies the customer is working with
  const customerWorkPartners: WorkPartner[] = [
    {
      id: "1",
      name: "Acme Design Studio",
      activity: "Replied to your enquiry",
      timeAgo: "30m ago",
      isOnline: true
    },
    {
      id: "2",
      name: "TechSolutions Inc",
      activity: "Sent you an invoice",
      timeAgo: "2h ago",
      isOnline: true
    },
    {
      id: "3",
      name: "Global Marketing",
      activity: "Updated project status",
      timeAgo: "6h ago",
      isOnline: false
    }
  ];

  // Use the appropriate partners list based on the view
  const workPartners = isCompanyView ? companyWorkPartners : customerWorkPartners;

  const filteredPartners = workPartners.filter(partner => 
    activeTab === "activities" || (activeTab === "online" && partner.isOnline)
  );

  const handlePartnerClick = (partner: WorkPartner) => {
    toast({
      title: `Chat with ${partner.name}`,
      description: "This feature is coming soon.",
    });
  };

  const handleViewAll = () => {
    toast({
      title: "View All Partners",
      description: "This feature is coming soon.",
    });
  };

  return (
    <Sidebar variant="floating" side="right" className="w-[280px] border-l">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-base flex items-center gap-2">
            {isCompanyView ? (
              <>
                <span className="i-lucide-users-2 h-5 w-5 text-primary"></span>
                Work Partners
              </>
            ) : (
              <>
                <span className="i-lucide-building h-5 w-5 text-primary"></span>
                Companies
              </>
            )}
          </h3>
          <Button variant="link" size="sm" className="text-primary" onClick={handleViewAll}>
            View All
          </Button>
        </div>
        
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "activities" | "online")} className="mb-4">
          <TabsList className="w-full">
            <TabsTrigger value="activities" className="flex-1">Activities</TabsTrigger>
            <TabsTrigger value="online" className="flex-1">Online</TabsTrigger>
          </TabsList>
        </Tabs>
        
        {filteredPartners.length > 0 ? (
          <div className="space-y-3">
            {filteredPartners.map((partner) => (
              <div 
                key={partner.id} 
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/40 cursor-pointer transition-colors"
                onClick={() => handlePartnerClick(partner)}
              >
                <div className="relative">
                  <Avatar>
                    <AvatarImage src={partner.avatarUrl} alt={partner.name} />
                    <AvatarFallback>{partner.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  {partner.isOnline && (
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-background"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{partner.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{partner.activity}</p>
                </div>
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{partner.timeAgo}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            <p className="text-sm">No recent activity</p>
          </div>
        )}
        
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium">
              {isCompanyView ? "Active Inquiries" : "Your Inquiries"}
            </h4>
            <Button variant="link" size="sm" className="text-primary p-0 h-auto text-xs">
              View <ChevronRight className="h-3 w-3" />
            </Button>
          </div>
          <div className="bg-secondary/30 rounded-lg p-3">
            {isCompanyView ? (
              <>
                <p className="text-sm mb-2">You have 7 active inquiries that need attention</p>
                <div className="flex gap-2">
                  <Badge variant="outline" className="bg-secondary/50">Support (3)</Badge>
                  <Badge variant="outline" className="bg-secondary/50">Sales (4)</Badge>
                </div>
              </>
            ) : (
              <>
                <p className="text-sm mb-2">You have 4 active inquiries</p>
                <Button variant="outline" size="sm" className="w-full">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Create New Inquiry
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </Sidebar>
  );
};
