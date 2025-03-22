
import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/button";
import { SidebarProvider, Sidebar, SidebarContent, SidebarTrigger } from "@/components/ui/sidebar";
import { MessageSquare, User, Settings, Bell, Search, Sun, Plus, Filter, Clock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

// Sample data for customer enquiries
const customerEnquiries = [
  {
    id: "e1",
    title: "Product Information Request",
    company: "TechCorp Inc.",
    status: "Answered",
    date: "2023-06-15",
    lastUpdate: "2023-06-16"
  },
  {
    id: "e2",
    title: "Service Availability Question",
    company: "Global Services Ltd.",
    status: "Pending",
    date: "2023-06-18",
    lastUpdate: "2023-06-18"
  },
  {
    id: "e3",
    title: "Pricing Inquiry",
    company: "ValueMart",
    status: "Answered",
    date: "2023-06-10",
    lastUpdate: "2023-06-12"
  },
  {
    id: "e4",
    title: "Technical Support Request",
    company: "TechCorp Inc.",
    status: "Closed",
    date: "2023-05-25",
    lastUpdate: "2023-06-02"
  }
];

const CustomerDashboard = () => {
  const [activeNavItem, setActiveNavItem] = useState("enquiries");
  const { profile } = useAuth();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar>
          <div className="h-16 flex items-center px-4 border-b border-sidebar-border">
            <h1 className="font-semibold">Customer Portal</h1>
          </div>
          <SidebarContent>
            <div className="space-y-1 py-4">
              {[
                { id: "enquiries", label: "My Enquiries", icon: <MessageSquare className="h-5 w-5" /> },
                { id: "settings", label: "Account Settings", icon: <Settings className="h-5 w-5" /> }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveNavItem(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-all-200 ${
                    activeNavItem === item.id
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </div>
          </SidebarContent>
          <div className="border-t border-sidebar-border px-3 py-4 mt-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium">{profile?.name || 'Customer'}</p>
                  <p className="text-xs text-sidebar-foreground/70">Customer</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="text-sidebar-foreground">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Sidebar>

        <div className="flex-1 flex flex-col">
          <header className="h-16 border-b border-border flex items-center justify-between px-4 sm:px-6">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <div className="relative hidden sm:block">
                <Search className="h-4 w-4 absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="search"
                  placeholder="Search enquiries..."
                  className="w-64 pl-10 pr-4 py-2 text-sm rounded-md bg-secondary/50 focus:bg-secondary border-0 focus:ring-1 focus:ring-primary/30 focus:outline-none"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon">
                <Sun className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-destructive"></span>
              </Button>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto">
            <div className="p-6">
              <Container size="full">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                  <div>
                    <h1 className="text-2xl font-semibold mb-1">My Enquiries</h1>
                    <p className="text-muted-foreground">Track and manage your conversations with companies</p>
                  </div>
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

                <div className="bg-card rounded-lg border shadow-sm mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
                    <div className="bg-primary/10 rounded-lg p-4 flex items-center gap-4">
                      <div className="bg-primary/20 p-3 rounded-lg">
                        <MessageSquare className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total Enquiries</p>
                        <p className="text-2xl font-semibold">{customerEnquiries.length}</p>
                      </div>
                    </div>
                    
                    <div className="bg-yellow-500/10 rounded-lg p-4 flex items-center gap-4">
                      <div className="bg-yellow-500/20 p-3 rounded-lg">
                        <Clock className="h-6 w-6 text-yellow-500" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Pending</p>
                        <p className="text-2xl font-semibold">
                          {customerEnquiries.filter(e => e.status === "Pending").length}
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-green-500/10 rounded-lg p-4 flex items-center gap-4">
                      <div className="bg-green-500/20 p-3 rounded-lg">
                        <MessageSquare className="h-6 w-6 text-green-500" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Answered</p>
                        <p className="text-2xl font-semibold">
                          {customerEnquiries.filter(e => e.status === "Answered").length}
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-blue-500/10 rounded-lg p-4 flex items-center gap-4">
                      <div className="bg-blue-500/20 p-3 rounded-lg">
                        <MessageSquare className="h-6 w-6 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Closed</p>
                        <p className="text-2xl font-semibold">
                          {customerEnquiries.filter(e => e.status === "Closed").length}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
                  <div className="grid divide-y">
                    <div className="px-6 py-4 bg-muted/50 grid grid-cols-12 gap-4 text-sm font-medium">
                      <div className="col-span-6 lg:col-span-5">Enquiry</div>
                      <div className="col-span-3 lg:col-span-3 hidden md:block">Company</div>
                      <div className="col-span-2 lg:col-span-2 text-center">Status</div>
                      <div className="col-span-4 lg:col-span-2 text-right">Last Update</div>
                    </div>
                    
                    {customerEnquiries.map((enquiry) => (
                      <div key={enquiry.id} className="px-6 py-4 grid grid-cols-12 gap-4 items-center hover:bg-muted/30 transition-colors">
                        <div className="col-span-6 lg:col-span-5">
                          <p className="font-medium">{enquiry.title}</p>
                          <p className="text-xs text-muted-foreground md:hidden">
                            {enquiry.company}
                          </p>
                        </div>
                        <div className="col-span-3 lg:col-span-3 hidden md:block text-sm">
                          {enquiry.company}
                        </div>
                        <div className="col-span-2 lg:col-span-2 text-center">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            enquiry.status === "Pending" 
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500"
                              : enquiry.status === "Answered"
                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500"
                                : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500"
                          }`}>
                            {enquiry.status}
                          </span>
                        </div>
                        <div className="col-span-4 lg:col-span-2 text-right text-sm text-muted-foreground">
                          {enquiry.lastUpdate}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Container>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default CustomerDashboard;
