
import { Container } from "@/components/ui/Container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatisticsCards } from "@/components/customer/dashboard/StatisticsCards";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { 
  ChevronRight, 
  Building, 
  FileText, 
  Heart, 
  Search, 
  Filter, 
  Plus,
  Bell,
  Clock,
  Calendar,
  CheckCircle
} from "lucide-react";
import { EnquiryBoard } from "@/components/customer/dashboard/EnquiryBoard";

interface CustomerStatProps {
  label: string;
  value: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
}

interface CustomerDemoViewProps {
  stats: CustomerStatProps[];
  activeNavItem: string;
  customerNavItems: Array<{
    id: string;
    label: string;
    icon: React.ReactNode;
    description: string;
  }>;
}

export const CustomerDemoView = ({ 
  stats, 
  activeNavItem,
  customerNavItems 
}: CustomerDemoViewProps) => {
  const { toast } = useToast();
  // Sample statistics for the customer demo dashboard
  const demoStats = {
    total: 5,
    pending: 2,
    completed: 3
  };

  // Render different content based on active navigation item
  const renderContent = () => {
    switch (activeNavItem) {
      case "dashboard":
        return (
          <>
            <div className="mb-8">
              <Card className="bg-slate-50 dark:bg-slate-900 border-none mb-8">
                <CardContent className="p-6">
                  <h1 className="text-2xl font-bold mb-1">Welcome back, Demo Customer!</h1>
                  <p className="text-muted-foreground">Manage your enquiries, payments, and support easily.</p>
                </CardContent>
              </Card>
              
              <StatisticsCards stats={demoStats} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left column (2/3 width) - Recent Enquiries */}
              <div className="md:col-span-2 space-y-6">
                <EnquiryBoard />
                
                <Card className="border shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-xl font-bold">Recent Activity</CardTitle>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to="#" className="flex items-center">
                        View All
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { id: 1, title: "Your enquiry status updated", description: "Website Redesign enquiry status changed to 'In Progress'", icon: <CheckCircle className="h-4 w-4 text-blue-500" />, time: "2 hours ago" },
                        { id: 2, title: "New message received", description: "TechSolutions Inc replied to your enquiry", icon: <Bell className="h-4 w-4 text-indigo-500" />, time: "Yesterday" },
                        { id: 3, title: "Invoice received", description: "You received an invoice of $500 from Acme Design", icon: <FileText className="h-4 w-4 text-green-500" />, time: "2 days ago" }
                      ].map(item => (
                        <div key={item.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/10 transition-colors">
                          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                            {item.icon}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-sm">{item.title}</p>
                            <p className="text-xs text-muted-foreground">{item.description}</p>
                          </div>
                          <div className="text-xs text-muted-foreground whitespace-nowrap">
                            {item.time}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Right column (1/3 width) */}
              <div className="space-y-6">
                {/* Companies Directory */}
                <Card className="border shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-xl font-bold">Companies Directory</CardTitle>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to="#" className="flex items-center">
                        Browse All
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="relative mb-4">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Search companies..."
                        className="w-full pl-10 pr-4 py-2 text-sm rounded-md bg-secondary/50 border-0 focus:ring-1 focus:ring-primary/30 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-3">
                      {[
                        { id: 1, name: "TechSolutions Inc", category: "Web Development", saved: true },
                        { id: 2, name: "Acme Design Studio", category: "Graphic Design", saved: false },
                        { id: 3, name: "Global Marketing", category: "Marketing", saved: false }
                      ].map(company => (
                        <div key={company.id} className="p-3 border rounded-md hover:border-primary/50 cursor-pointer transition-colors flex justify-between items-center">
                          <div>
                            <h3 className="font-medium">{company.name}</h3>
                            <p className="text-xs text-muted-foreground">{company.category}</p>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className={company.saved ? "text-red-500" : "text-muted-foreground"}
                            onClick={() => toast({
                              title: "Company saved",
                              description: company.saved ? `${company.name} removed from saved` : `${company.name} added to saved companies`
                            })}
                          >
                            <Heart className="h-4 w-4" fill={company.saved ? "currentColor" : "none"} />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                {/* Payment Overview */}
                <Card className="border shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-xl font-bold">Payment Overview</CardTitle>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to="#" className="flex items-center">
                        View All
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 border rounded-md">
                        <div>
                          <h3 className="font-medium">Next Payment</h3>
                          <p className="text-sm text-muted-foreground">Invoice #INV-2023-003</p>
                          <p className="text-xs text-muted-foreground">Due in 3 days</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">$750.00</p>
                          <Button size="sm" variant="outline" className="mt-2">Pay Now</Button>
                        </div>
                      </div>
                      <div className="p-3 border rounded-md">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-medium">Payment Summary</h3>
                          <span className="text-xs text-muted-foreground">Last 30 days</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="bg-muted p-2 rounded-md">
                            <p className="text-xs text-muted-foreground">Paid</p>
                            <p className="font-bold">$2,000</p>
                          </div>
                          <div className="bg-muted p-2 rounded-md">
                            <p className="text-xs text-muted-foreground">Pending</p>
                            <p className="font-bold">$750</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Support Quick Access */}
                <Card className="border shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-xl font-bold">Quick Support</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start text-left">
                        <FileText className="h-4 w-4 mr-2" />
                        Knowledge Base
                      </Button>
                      <Button variant="outline" className="w-full justify-start text-left">
                        <Bell className="h-4 w-4 mr-2" />
                        Contact Support
                      </Button>
                      <Button variant="outline" className="w-full justify-start text-left">
                        <Calendar className="h-4 w-4 mr-2" />
                        Schedule a Call
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        );
      
      case "my-enquiries":
        return (
          <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-4 shadow-sm">
            <div className="h-[600px]">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
                <div className="bg-background rounded-lg border p-4">
                  <h3 className="font-medium mb-4 flex justify-between items-center">
                    <span>New <span className="text-xs ml-1 text-muted-foreground">(2)</span></span>
                    <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 text-xs px-2 py-1 rounded-full">Active</span>
                  </h3>
                  <div className="space-y-3">
                    {[
                      { id: 1, title: "Website Redesign Inquiry", company: "TechSolutions Inc", date: "2 days ago" },
                      { id: 2, title: "Logo Design Project", company: "Acme Design Studio", date: "5 days ago" }
                    ].map(item => (
                      <Card key={item.id} className="p-3 cursor-pointer hover:bg-accent/10">
                        <h4 className="font-medium text-sm">{item.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1">{item.company}</p>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-xs text-muted-foreground">{item.date}</span>
                          <Button variant="ghost" size="sm" className="h-6 text-xs">View</Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
                <div className="bg-background rounded-lg border p-4">
                  <h3 className="font-medium mb-4 flex justify-between items-center">
                    <span>Pending <span className="text-xs ml-1 text-muted-foreground">(2)</span></span>
                    <span className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300 text-xs px-2 py-1 rounded-full">In Progress</span>
                  </h3>
                  <div className="space-y-3">
                    {[
                      { id: 3, title: "Marketing Campaign", company: "Global Marketing", date: "1 week ago" },
                      { id: 4, title: "Mobile App Development", company: "TechSolutions Inc", date: "2 weeks ago" }
                    ].map(item => (
                      <Card key={item.id} className="p-3 cursor-pointer hover:bg-accent/10">
                        <h4 className="font-medium text-sm">{item.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1">{item.company}</p>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-xs text-muted-foreground">{item.date}</span>
                          <Button variant="ghost" size="sm" className="h-6 text-xs">View</Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
                <div className="bg-background rounded-lg border p-4">
                  <h3 className="font-medium mb-4 flex justify-between items-center">
                    <span>Completed <span className="text-xs ml-1 text-muted-foreground">(1)</span></span>
                    <span className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 text-xs px-2 py-1 rounded-full">Done</span>
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
                          <Button variant="ghost" size="sm" className="h-6 text-xs">View</Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case "billing":
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <Card className="border shadow-sm">
                <div className="p-6">
                  <h2 className="text-xl font-medium mb-4">Recent Invoices</h2>
                  <div className="space-y-4">
                    {[
                      { id: "INV-2023-001", service: "Website Redesign", company: "TechSolutions Inc", amount: "$1,500.00", status: "Paid", date: "Mar 15, 2023" },
                      { id: "INV-2023-002", service: "Logo Design", company: "Acme Design Studio", amount: "$500.00", status: "Paid", date: "Apr 02, 2023" },
                      { id: "INV-2023-003", service: "SEO Optimization", company: "Global Marketing", amount: "$750.00", status: "Pending", date: "May 10, 2023" }
                    ].map(invoice => (
                      <div key={invoice.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border rounded-lg">
                        <div>
                          <h3 className="font-medium">{invoice.service}</h3>
                          <p className="text-sm text-muted-foreground">{invoice.company}</p>
                          <p className="text-xs text-muted-foreground">Invoice: {invoice.id}</p>
                        </div>
                        <div className="mt-2 sm:mt-0 sm:text-right">
                          <p className="font-medium">{invoice.amount}</p>
                          <p className="text-xs text-muted-foreground">{invoice.date}</p>
                          <span className={`inline-block mt-1 text-xs px-2 py-1 rounded-full ${
                            invoice.status === "Paid" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" : 
                            "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
                          }`}>
                            {invoice.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
            <div className="space-y-6">
              <Card className="border shadow-sm">
                <div className="p-6">
                  <h2 className="text-xl font-medium mb-4">Payment Methods</h2>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 border rounded-md">
                      <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900 rounded-md flex items-center justify-center text-blue-600 dark:text-blue-300">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium">Visa ending in 4242</p>
                        <p className="text-xs text-muted-foreground">Expires 12/2025</p>
                      </div>
                      <Button variant="ghost" size="sm" className="ml-auto">Edit</Button>
                    </div>
                  </div>
                  <Button className="w-full mt-4">Add Payment Method</Button>
                </div>
              </Card>
            </div>
          </div>
        );
      
      case "profile":
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card className="border shadow-sm">
                <div className="p-6">
                  <h2 className="text-xl font-medium mb-4">Personal Information</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium block mb-1">Full Name</label>
                      <input type="text" value="Demo Customer" className="w-full p-2 border rounded-md" readOnly />
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-1">Email Address</label>
                      <input type="email" value="demo.customer@example.com" className="w-full p-2 border rounded-md" readOnly />
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-1">Phone Number</label>
                      <input type="tel" value="+1 (555) 123-4567" className="w-full p-2 border rounded-md" readOnly />
                    </div>
                    <Button className="w-full sm:w-auto">Update Information</Button>
                  </div>
                </div>
              </Card>
            </div>
            <div>
              <Card className="border shadow-sm">
                <div className="p-6">
                  <h2 className="text-xl font-medium mb-4">Account Settings</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-xs text-muted-foreground">Receive email updates</p>
                      </div>
                      <div className="h-6 w-10 bg-primary rounded-full relative cursor-pointer">
                        <div className="absolute right-1 top-1 h-4 w-4 bg-white rounded-full"></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">SMS Notifications</p>
                        <p className="text-xs text-muted-foreground">Receive text messages</p>
                      </div>
                      <div className="h-6 w-10 bg-muted rounded-full relative cursor-pointer">
                        <div className="absolute left-1 top-1 h-4 w-4 bg-muted-foreground rounded-full"></div>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full mt-4">Change Password</Button>
                </div>
              </Card>
            </div>
          </div>
        );
      
      case "notifications":
        return (
          <Card className="border shadow-sm">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-medium">Recent Notifications</h2>
                <Button variant="ghost" size="sm">Mark All as Read</Button>
              </div>
              <div className="space-y-4">
                {[
                  { id: 1, title: "Enquiry Status Updated", message: "Your 'Website Redesign' enquiry has been updated to 'In Progress'", time: "2 hours ago", isRead: false },
                  { id: 2, title: "New Message Received", message: "You have a new message from TechSolutions Inc regarding your enquiry", time: "Yesterday", isRead: false },
                  { id: 3, title: "Payment Confirmation", message: "Your payment of $500.00 to Acme Design Studio has been processed", time: "2 days ago", isRead: true }
                ].map(notification => (
                  <div 
                    key={notification.id} 
                    className={`p-4 border rounded-lg ${notification.isRead ? 'bg-background' : 'bg-primary/5 border-primary/20'}`}
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium">{notification.title}</h3>
                      <span className="text-xs text-muted-foreground">{notification.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                    <div className="mt-3 flex gap-2">
                      <Button variant="outline" size="sm">View Details</Button>
                      {!notification.isRead && <Button variant="ghost" size="sm">Mark as Read</Button>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        );
      
      case "support":
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card className="border shadow-sm">
                <div className="p-6">
                  <h2 className="text-xl font-medium mb-4">Contact Support</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium block mb-1">Subject</label>
                      <select className="w-full p-2 border rounded-md">
                        <option>Select a topic</option>
                        <option>Account Issues</option>
                        <option>Payment Problems</option>
                        <option>Enquiry Questions</option>
                        <option>Technical Support</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-1">Description</label>
                      <textarea className="w-full p-2 border rounded-md" rows={5} placeholder="Describe your issue in detail..."></textarea>
                    </div>
                    <Button>Submit Support Ticket</Button>
                  </div>
                </div>
              </Card>
            </div>
            <div>
              <Card className="border shadow-sm">
                <div className="p-6">
                  <h2 className="text-xl font-medium mb-4">Help Center</h2>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                      </svg>
                      FAQs
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                      </svg>
                      Contact Us
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="bg-card rounded-lg border shadow-sm p-8 text-center">
            <h2 className="text-2xl font-semibold mb-4">{customerNavItems.find(item => item.id === activeNavItem)?.label}</h2>
            <p className="text-muted-foreground mb-6">{customerNavItems.find(item => item.id === activeNavItem)?.description}</p>
            <Button>
              Go to Dashboard
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
                Customer Dashboard
              </h1>
              <p className="text-muted-foreground">
                Welcome to your customer dashboard. View your enquiries, invoices, and settings.
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline">View Profile</Button>
              <Button>New Enquiry</Button>
            </div>
          </div>

          {renderContent()}
        </Container>
      </div>
    </>
  );
};
