import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, MessageCircle, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export interface Enquiry {
  id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  channel: "Website" | "Instagram" | "WhatsApp" | "Facebook";
  date: string;
  customerName: string;
}

interface EnquiryBoardProps {
  emptyState?: boolean;
}

export function EnquiryBoard({ emptyState = false }: EnquiryBoardProps) {
  const { toast } = useToast();
  
  const handleCreateEnquiry = () => {
    toast({
      title: "Coming soon",
      description: "This feature will be available soon."
    });
  };

  return (
    <Card className="border shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-xl font-bold">Enquiry Board</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link to="/customer/enquiries" className="flex items-center">
            View All
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {emptyState ? (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <MessageCircle className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-2">No enquiries yet</h3>
            <p className="text-muted-foreground max-w-sm mb-6">
              Get started by creating your first enquiry to connect with a company.
            </p>
            <Button onClick={handleCreateEnquiry}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Enquiry
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-background rounded-lg border p-4">
              <h3 className="font-medium mb-3 flex justify-between items-center">
                <span>New</span>
                <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 text-xs px-2 py-1 rounded-full">2</span>
              </h3>
              <div className="space-y-3">
                {[
                  { id: 1, title: "Website Redesign", company: "TechSolutions Inc", date: "2 days ago" },
                  { id: 2, title: "Logo Design", company: "Acme Design", date: "5 days ago" }
                ].map(item => (
                  <Card key={item.id} className="p-3 cursor-pointer hover:bg-accent/10">
                    <h4 className="font-medium text-sm">{item.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{item.company}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-muted-foreground">{item.date}</span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
            
            <div className="bg-background rounded-lg border p-4">
              <h3 className="font-medium mb-3 flex justify-between items-center">
                <span>Pending</span>
                <span className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300 text-xs px-2 py-1 rounded-full">2</span>
              </h3>
              <div className="space-y-3">
                {[
                  { id: 3, title: "Marketing Campaign", company: "Global Marketing", date: "1 week ago" },
                  { id: 4, title: "Mobile App Dev", company: "TechSolutions Inc", date: "2 weeks ago" }
                ].map(item => (
                  <Card key={item.id} className="p-3 cursor-pointer hover:bg-accent/10">
                    <h4 className="font-medium text-sm">{item.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{item.company}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-muted-foreground">{item.date}</span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
            
            <div className="bg-background rounded-lg border p-4">
              <h3 className="font-medium mb-3 flex justify-between items-center">
                <span>Completed</span>
                <span className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 text-xs px-2 py-1 rounded-full">1</span>
              </h3>
              <div className="space-y-3">
                {[
                  { id: 5, title: "SEO Optimization", company: "Global Marketing", date: "3 weeks ago" }
                ].map(item => (
                  <Card key={item.id} className="p-3 cursor-pointer hover:bg-accent/10">
                    <h4 className="font-medium text-sm">{item.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{item.company}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-muted-foreground">{item.date}</span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
