import { KanbanBoard } from "@/components/kanban/KanbanBoard";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Filter, Plus, ArrowUpRight, Users, Inbox, Calendar, Clock, CheckCircle, CheckCheck, BarChart3, Phone, Mail, MessageSquare } from "lucide-react";
import { StatisticsCards } from "@/components/customer/dashboard/StatisticsCards";
import { WorkPartnersSidebar } from "@/components/common/WorkPartnersSidebar";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface CompanyStatProps {
  label: string;
  value: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
}

interface CompanyDemoViewProps {
  stats: CompanyStatProps[];
  activeNavItem: string;
  companyNavItems: Array<{
    id: string;
    label: string;
    icon: React.ReactNode;
    description: string;
  }>;
}

export const CompanyDemoView = ({ 
  stats, 
  activeNavItem,
  companyNavItems 
}: CompanyDemoViewProps) => {
  const { toast } = useToast();
  
  // Sample statistics for the company demo dashboard
  const demoStats = {
    total: 15,
    pending: 7,
    completed: 8
  };
  
  // Render different content based on active navigation item
  const renderContent = () => {
    switch (activeNavItem) {
      case "dashboard":
        return (
          <>
            {/* Statistics Cards */}
            <div className="mb-8">
              <StatisticsCards stats={demoStats} />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              {/* Recently Active Customers */}
              <Card className="border shadow-sm lg:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <div>
                    <CardTitle className="text-xl font-bold">Recently Active Customers</CardTitle>
                    <CardDescription>Recent customer enquiries and activities</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" className="flex items-center gap-1">
                    View All
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { id: 1, name: "John Smith", email: "john.smith@example.com", action: "Submitted new enquiry", company: "Personal", time: "2 hours ago" },
                      { id: 2, name: "Sarah Johnson", email: "sarah@acmeinc.com", action: "Responded to message", company: "Acme Inc", time: "Yesterday" },
                      { id: 3, name: "Robert Chen", email: "robert@techfirm.com", action: "Viewed proposal", company: "Tech Firm", time: "2 days ago" },
                      { id: 4, name: "Emily Davis", email: "emily@globalco.com", action: "Paid invoice #INV-2023-42", company: "Global Co", time: "3 days ago" },
                    ].map((customer) => (
                      <div key={customer.id} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-accent/10 transition-colors">
                        <div className="rounded-full h-10 w-10 bg-primary/10 flex items-center justify-center">
                          <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium">{customer.name}</p>
                            <span className="text-xs text-muted-foreground">{customer.time}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{customer.action}</p>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <span>{customer.company}</span>
                            <span className="mx-2">•</span>
                            <span>{customer.email}</span>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="ml-2">
                          View
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Today's Schedule */}
              <Card className="border shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-xl font-bold">Today's Schedule</CardTitle>
                  <Button variant="ghost" size="icon">
                    <Calendar className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { id: 1, title: "Team Meeting", time: "10:00 AM", duration: "1 hour", type: "meeting" },
                      { id: 2, title: "Client Call: TechSolutions", time: "1:30 PM", duration: "30 min", type: "call" },
                      { id: 3, title: "Review Website Proposal", time: "3:00 PM", duration: "1 hour", type: "task" },
                      { id: 4, title: "Submit Monthly Report", time: "5:00 PM", duration: "Deadline", type: "deadline" },
                    ].map((event) => (
                      <div key={event.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-accent/10 transition-colors">
                        <div className="rounded-full h-8 w-8 bg-primary/10 flex items-center justify-center">
                          {event.type === 'meeting' && <Users className="h-4 w-4 text-primary" />}
                          {event.type === 'call' && <Phone className="h-4 w-4 text-green-500" />}
                          {event.type === 'task' && <CheckCircle className="h-4 w-4 text-blue-500" />}
                          {event.type === 'deadline' && <Clock className="h-4 w-4 text-amber-500" />}
                        </div>
                        <div className="space-y-1 flex-1">
                          <p className="font-medium text-sm">{event.title}</p>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>{event.time}</span>
                            <span className="mx-2">•</span>
                            <span>{event.duration}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Event
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Enquiry Board */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-medium">Enquiry Board</h2>
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
            <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-4 shadow-sm">
              <KanbanBoard isDemo={true} readOnly={false} isCompanyView={true} height="h-[600px]" />
            </div>

            {/* Analytics Preview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <Card className="border shadow-sm md:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <div>
                    <CardTitle className="text-xl font-bold">Conversion Analytics</CardTitle>
                    <CardDescription>Enquiry to conversion ratio over time</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">Last 30 Days</Button>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="h-[200px] flex items-center justify-center bg-muted/40 rounded-md">
                    <div className="text-center">
                      <BarChart3 className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">Analytics chart preview</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div className="bg-muted/30 p-3 rounded-md">
                      <p className="text-xs text-muted-foreground">Conversion Rate</p>
                      <p className="text-xl font-bold">26%</p>
                      <p className="text-xs text-green-500">+2% from last period</p>
                    </div>
                    <div className="bg-muted/30 p-3 rounded-md">
                      <p className="text-xs text-muted-foreground">Avg Response Time</p>
                      <p className="text-xl font-bold">1.8h</p>
                      <p className="text-xs text-red-500">+0.3h from last period</p>
                    </div>
                    <div className="bg-muted/30 p-3 rounded-md">
                      <p className="text-xs text-muted-foreground">Revenue</p>
                      <p className="text-xl font-bold">$12,450</p>
                      <p className="text-xs text-green-500">+8% from last period</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-xl font-bold">Recent Messages</CardTitle>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="#" className="flex items-center gap-1">
                      View All
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { id: 1, sender: "John Smith", message: "Thanks for the update on my website redesign project.", time: "2 hours ago", read: false },
                      { id: 2, sender: "Sarah Johnson", message: "I'd like to discuss the logo options you sent yesterday.", time: "Yesterday", read: true },
                      { id: 3, sender: "Robert Chen", message: "When can we schedule a call to review the progress?", time: "2 days ago", read: true },
                    ].map((message) => (
                      <div 
                        key={message.id} 
                        className={`p-3 rounded-md border ${message.read ? 'bg-background' : 'bg-primary/5 border-primary/20'}`}
                      >
                        <div className="flex justify-between items-start">
                          <p className="font-medium text-sm">{message.sender}</p>
                          <span className="text-xs text-muted-foreground">{message.time}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{message.message}</p>
                        <div className="mt-2 flex gap-2">
                          <Button size="sm" variant="outline" className="h-7 text-xs px-2">
                            <MessageSquare className="h-3 w-3 mr-1" />
                            Reply
                          </Button>
                          {!message.read && (
                            <Button size="sm" variant="ghost" className="h-7 text-xs px-2">
                              <CheckCheck className="h-3 w-3 mr-1" />
                              Mark Read
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    <Inbox className="h-4 w-4 mr-2" />
                    Inbox
                  </Button>
                </CardContent>
              </Card>
            </div>
          </>
        );
      
      default:
        return (
          <div className="bg-card rounded-lg border shadow-sm p-8 text-center">
            <h2 className="text-2xl font-semibold mb-4">{companyNavItems.find(item => item.id === activeNavItem)?.label}</h2>
            <p className="text-muted-foreground mb-6">{companyNavItems.find(item => item.id === activeNavItem)?.description}</p>
            <Button>
              {activeNavItem === 'enquiries' ? 'Add Enquiry' : 
              activeNavItem === 'customers' ? 'Add Customer' :
              activeNavItem === 'invoices' ? 'New Invoice' :
              activeNavItem === 'payments' ? 'Record Payment' :
              activeNavItem === 'reports' ? 'Generate Report' :
              activeNavItem === 'team' ? 'Add Team Member' :
              'Save Changes'}
            </Button>
          </div>
        );
    }
  };
  
  return (
    <>
      <div className="pt-8 pb-4 px-4 sm:px-6">
        <Container size="full">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-semibold mb-1">
                Company Dashboard
              </h1>
              <p className="text-muted-foreground">
                Manage your enquiries, customers, and company settings.
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline">
                <Mail className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add New
              </Button>
            </div>
          </div>

          {renderContent()}
        </Container>
      </div>

      {/* Right side navigation menu */}
      <WorkPartnersSidebar isCompanyView={true} />
    </>
  );
};
