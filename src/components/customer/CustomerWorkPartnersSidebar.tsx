import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, ChevronRight, Bell, Search, Plus, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export const CustomerWorkPartnersSidebar = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  
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

  const handleCreateInquiry = () => {
    toast({
      title: "Create New Inquiry",
      description: "New inquiry creation is coming soon.",
    });
  };

  return (
    <div className="w-[280px] border-l bg-white dark:bg-gray-950 h-full">
      <div className="p-4 space-y-5">
        <div className="flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-base flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              New Responses
            </h3>
            <Button variant="link" size="sm" className="text-primary" onClick={handleViewAll}>
              View All
            </Button>
          </div>
          
          <div className="flex items-center px-1 gap-2">
            <Search className="h-3.5 w-3.5 text-muted-foreground" />
            <Input 
              placeholder="Search responses..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 bg-transparent border-none text-sm focus-visible:ring-0 focus-visible:ring-offset-0 pl-0"
            />
          </div>
          
          {newResponses.length > 0 ? (
            <div className="space-y-2.5">
              {newResponses.slice(0, 5).map((response: any) => (
                <div 
                  key={response.id} 
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/40 cursor-pointer transition-colors"
                  onClick={() => handleResponseClick(response)}
                >
                  <div className="relative">
                    <Avatar className="h-8 w-8">
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
            <div className="text-center py-5 text-muted-foreground">
              <p className="text-sm">No new responses</p>
            </div>
          )}
        </div>
        
        <Separator />
        
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              Your Inquiries
            </h4>
            <Button variant="link" size="sm" className="text-primary p-0 h-auto text-xs">
              View <ChevronRight className="h-3 w-3" />
            </Button>
          </div>
          <div className="bg-secondary/30 rounded-lg p-3">
            <p className="text-sm mb-2">You have 0 active inquiries</p>
            <Button variant="outline" size="sm" className="w-full" onClick={handleCreateInquiry}>
              <Plus className="h-4 w-4 mr-2" />
              Create New Inquiry
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
