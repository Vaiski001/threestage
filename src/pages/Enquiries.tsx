import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Filter, Plus } from "lucide-react";
import { KanbanBoard } from "@/components/kanban/KanbanBoard";

const Enquiries = () => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const userRole = profile?.role || "customer";
  const isDemo = window.location.pathname.includes("demo");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // In a real app, this would filter kanban items
    console.log("Searching for:", query);
  };

  return (
    <AppLayout
      pageTitle={userRole === "company" ? "Enquiries Management" : "My Enquiries"}
      searchPlaceholder="Search enquiries..."
      onSearch={handleSearch}
    >
      <div className="flex-1 overflow-y-auto">
        <main className="flex-1 overflow-y-auto">
          <div className="pt-8 pb-4 px-4 sm:px-6">
            <Container className="w-full max-w-none">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <div>
                  <h2 className="text-2xl font-semibold mb-1">
                    {userRole === "company" ? "Enquiries Management" : "My Enquiries"}
                  </h2>
                  <p className="text-muted-foreground">
                    {userRole === "company" 
                      ? "View and manage customer enquiries" 
                      : "Track and manage your conversations with companies"}
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" size="sm" onClick={() => toast({ title: "Feature coming soon", description: "Filter functionality is coming soon." })}>
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                  <Button size="sm" onClick={() => toast({ title: "Feature coming soon", description: "New enquiry creation is coming soon." })}>
                    <Plus className="h-4 w-4 mr-2" />
                    {userRole === "company" ? "New Enquiry" : "Create Enquiry"}
                  </Button>
                </div>
              </div>
              
              <div className="pb-8">
                <KanbanBoard 
                  isDemo={isDemo} 
                  isCompanyView={userRole === "company"}
                  height="h-[750px]"
                  searchQuery={searchQuery}
                />
              </div>
            </Container>
          </div>
        </main>
      </div>
    </AppLayout>
  );
};

export default Enquiries;
