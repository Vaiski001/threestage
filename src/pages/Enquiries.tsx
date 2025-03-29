
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Filter, Plus, Search, Bell } from "lucide-react";
import { KanbanBoard } from "@/components/kanban/KanbanBoard";

const Enquiries = () => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const userRole = profile?.role || "customer";
  const isDemo = window.location.pathname.includes("demo");

  return (
    <AppLayout>
      <header className="h-16 border-b border-border flex items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div className="relative hidden sm:block">
            <Search className="h-4 w-4 absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search..."
              className="w-64 pl-10 pr-4 py-2 text-sm rounded-md bg-secondary/50 focus:bg-secondary border-0 focus:ring-1 focus:ring-primary/30 focus:outline-none"
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-destructive"></span>
          </Button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">
        <div className="pt-8 pb-4 px-4 sm:px-6">
          <Container size="full">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="text-2xl font-semibold mb-1">
                  {userRole === "company" ? "Enquiries Management" : "My Enquiries"}
                </h1>
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
              />
            </div>
          </Container>
        </div>
      </main>
    </AppLayout>
  );
};

export default Enquiries;
