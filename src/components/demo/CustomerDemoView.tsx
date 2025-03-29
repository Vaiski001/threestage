
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/button";
import { KanbanBoard } from "@/components/kanban/KanbanBoard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatisticsCards } from "@/components/customer/dashboard/StatisticsCards";
import { WelcomeBanner } from "@/components/customer/dashboard/WelcomeBanner";
import { Filter, Plus, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { CustomerWorkPartnersSidebar } from "@/components/customer/CustomerWorkPartnersSidebar";

interface CustomerStatProps {
  label: string;
  value: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
}

interface CustomerDemoViewProps {
  stats: CustomerStatProps[];
}

export const CustomerDemoView = ({ stats }: CustomerDemoViewProps) => {
  // Sample statistics for the customer demo dashboard
  const demoStats = {
    total: 5,
    pending: 2,
    completed: 3
  };

  return (
    <>
      <div className="pt-8 pb-4 px-4 sm:px-6">
        <Container size="full">
          {/* Welcome Banner */}
          <WelcomeBanner userName="Demo Customer" />
          
          {/* Statistics Cards */}
          <div className="mt-6">
            <StatisticsCards stats={demoStats} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            {/* Left column (2/3 width) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Enquiry Board */}
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
                <CardContent className="h-[500px] overflow-hidden border-t border-border">
                  <div className="h-full">
                    <KanbanBoard isDemo={true} readOnly={true} height="h-[460px]" />
                  </div>
                </CardContent>
              </Card>

              {/* Activity & Notifications */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-xl font-bold">Recent Activity</CardTitle>
                  <Button variant="ghost" size="sm" className="flex items-center">
                    View All <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { id: 1, title: "Your enquiry status changed", description: "Website Redesign enquiry is now In Progress", time: "2 hours ago", type: "status" },
                      { id: 2, title: "New message received", description: "You have a new message from Acme Design Studio", time: "yesterday", type: "message" },
                      { id: 3, title: "Invoice received", description: "Invoice #INV-2023-005 has been issued", time: "2 days ago", type: "invoice" }
                    ].map((activity) => (
                      <div key={activity.id} className="p-4 rounded-md border bg-card/60 hover:bg-card/80 transition-colors">
                        <div className="flex justify-between">
                          <h3 className="font-medium">{activity.title}</h3>
                          <span className="text-xs text-muted-foreground">{activity.time}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                        <div className="mt-3 flex gap-2">
                          <Button variant="outline" size="sm">View Details</Button>
                          {activity.type === "message" && <Button size="sm">Reply</Button>}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right column (1/3 width) */}
            <div className="space-y-6">
              {/* Company Directory */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-xl font-bold">Company Directory</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" className="justify-start">Featured</Button>
                      <Button variant="outline" className="justify-start">Newest</Button>
                    </div>
                    
                    <div className="space-y-3 mt-2">
                      {[
                        { id: 1, name: "Acme Design Studio", industry: "Design & Creative" },
                        { id: 2, name: "TechSolutions Inc", industry: "IT Services" },
                        { id: 3, name: "Global Marketing", industry: "Marketing & PR" }
                      ].map((company) => (
                        <div key={company.id} className="p-3 border rounded-md hover:bg-accent/20 transition-colors cursor-pointer">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                              {company.name.charAt(0)}
                            </div>
                            <div>
                              <h4 className="font-medium">{company.name}</h4>
                              <p className="text-xs text-muted-foreground">{company.industry}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <Button variant="outline" className="w-full mt-2">View All Companies</Button>
                  </div>
                </CardContent>
              </Card>
              
              {/* Payments Section */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-xl font-bold">Payments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 border rounded-md bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
                      <h4 className="font-medium text-amber-800 dark:text-amber-300">Upcoming Payment</h4>
                      <p className="text-amber-700 dark:text-amber-400 text-sm mt-1">Website Redesign Service - Due in 5 days</p>
                      <div className="mt-3">
                        <Button size="sm" className="w-full">Make Payment</Button>
                      </div>
                    </div>
                    
                    <div className="p-3 border rounded-md">
                      <h4 className="font-medium">Payment Methods</h4>
                      <div className="mt-2 flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded flex items-center justify-center text-blue-600 dark:text-blue-300">
                          CC
                        </div>
                        <div>
                          <p className="text-sm">Visa ending in 4242</p>
                          <p className="text-xs text-muted-foreground">Expires 12/2025</p>
                        </div>
                      </div>
                      <Button variant="link" className="p-0 h-auto mt-2 text-sm">Manage Payment Methods</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Support Quick Access */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-xl font-bold">Support</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button className="w-full justify-start">Create Support Ticket</Button>
                    <Button variant="outline" className="w-full justify-start">Knowledge Base</Button>
                    <Button variant="outline" className="w-full justify-start">Check System Status</Button>
                    
                    <div className="p-3 border rounded-md mt-4">
                      <h4 className="font-medium text-sm">Last Reply</h4>
                      <p className="text-xs text-muted-foreground mt-1">Your ticket #45678 was updated 3 days ago</p>
                      <Button variant="link" className="p-0 h-auto mt-2 text-xs">View Conversation</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </Container>
      </div>
      
      {/* Right side navigation menu */}
      <CustomerWorkPartnersSidebar />
    </>
  );
};
