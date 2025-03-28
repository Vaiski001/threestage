
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

export const WorkPartnersSidebar = () => {
  const [activeTab, setActiveTab] = useState<"activities" | "online">("activities");
  const { toast } = useToast();
  
  // Sample partners data - in a real app this would come from the backend
  const workPartners: WorkPartner[] = [
    {
      id: "1",
      name: "Sarah Johnson",
      avatarUrl: "https://i.pravatar.cc/150?img=1",
      activity: "Inquiry Response",
      timeAgo: "5 min ago",
      isOnline: true
    },
    {
      id: "2",
      name: "Mike Lee",
      avatarUrl: "https://i.pravatar.cc/150?img=2",
      activity: "Form Creation",
      timeAgo: "15 min ago",
      isOnline: true
    },
    {
      id: "3",
      name: "Alex Rodriguez",
      avatarUrl: "https://i.pravatar.cc/150?img=3",
      activity: "Customer Followup",
      timeAgo: "32 min ago",
      isOnline: false
    },
    {
      id: "4",
      name: "Kate Thompson",
      avatarUrl: "https://i.pravatar.cc/150?img=4",
      activity: "Inquiry Closed",
      timeAgo: "1 hour ago",
      isOnline: false
    },
    {
      id: "5",
      name: "David Park",
      avatarUrl: "https://i.pravatar.cc/150?img=5",
      activity: "New Customer",
      timeAgo: "2 hours ago",
      isOnline: false
    }
  ];

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
            <span className="i-lucide-users-2 h-5 w-5 text-primary"></span>
            Work Partners
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
        
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium">Active Inquiries</h4>
            <Button variant="link" size="sm" className="text-primary p-0 h-auto text-xs">
              View <ChevronRight className="h-3 w-3" />
            </Button>
          </div>
          <div className="bg-secondary/30 rounded-lg p-3">
            <p className="text-sm mb-2">You have 5 active inquiries that need attention</p>
            <div className="flex gap-2">
              <Badge variant="outline" className="bg-secondary/50">Support</Badge>
              <Badge variant="outline" className="bg-secondary/50">Sales</Badge>
              <Badge variant="outline" className="bg-secondary/50">+3</Badge>
            </div>
          </div>
        </div>
      </div>
    </Sidebar>
  );
};
