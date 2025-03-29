
import { useState } from "react";
import { Sidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, ChevronRight, Bell } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const CustomerWorkPartnersSidebar = () => {
  const { toast } = useToast();
  
  // Empty responses for new accounts
  const newResponses = [];

  const handleResponseClick = (response: any) => {
    toast({
      title: `View response`,
      description: "This feature is coming soon.",
    });
  };

  const handleViewAll = () => {
    toast({
      title: "View All Responses",
      description: "This feature is coming soon.",
    });
  };

  return (
    <Sidebar variant="floating" side="right" className="w-[280px] border-l">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-base flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            New Responses
          </h3>
          <Button variant="link" size="sm" className="text-primary" onClick={handleViewAll}>
            View All
          </Button>
        </div>
        
        {newResponses.length > 0 ? (
          <div className="space-y-3">
            {newResponses.slice(0, 5).map((response: any) => (
              <div 
                key={response.id} 
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/40 cursor-pointer transition-colors"
                onClick={() => handleResponseClick(response)}
              >
                <div className="relative">
                  <Avatar>
                    <AvatarImage src={response.avatarUrl} alt={response.companyName} />
                    <AvatarFallback>{response.companyName.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  {response.isNew && (
                    <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-primary rounded-full border-2 border-background"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{response.companyName}</p>
                  <p className="text-xs text-muted-foreground truncate">{response.message}</p>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">{response.timeAgo}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            <p className="text-sm">No new responses</p>
          </div>
        )}
        
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium">Your Inquiries</h4>
            <Button variant="link" size="sm" className="text-primary p-0 h-auto text-xs">
              View <ChevronRight className="h-3 w-3" />
            </Button>
          </div>
          <div className="bg-secondary/30 rounded-lg p-3">
            <p className="text-sm mb-2">You have 0 active inquiries</p>
            <Button variant="outline" size="sm" className="w-full">
              <MessageSquare className="h-4 w-4 mr-2" />
              Create New Inquiry
            </Button>
          </div>
        </div>
      </div>
    </Sidebar>
  );
};
