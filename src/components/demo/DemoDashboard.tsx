
import { useState } from "react";
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarContent, 
  SidebarNavItem
} from "@/components/ui/sidebar";
import { 
  MessageSquare, 
  Users, 
  Settings, 
  Bell, 
  Sun, 
  User,
  CreditCard,
  FileText,
  HelpCircle,
  Building,
  LayoutDashboard,
  Receipt,
  DollarSign,
  PieChart,
  UserPlus
} from "lucide-react";
import { 
  Tabs, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { CompanyDemoView } from "@/components/demo/CompanyDemoView";
import { CustomerDemoView } from "@/components/demo/CustomerDemoView";
import { DemoHeader } from "@/components/demo/DemoHeader";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/Container";

const DemoDashboard = () => {
  const [activeNavItem, setActiveNavItem] = useState("dashboard");
  const [activePortal, setActivePortal] = useState("company");

  // Company portal navigation items
  const companyNavItems = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" />, description: "Overview of key stats and activities" },
    { id: "enquiries", label: "Enquiries", icon: <MessageSquare className="h-5 w-5" />, description: "View and manage customer enquiries" },
    { id: "customers", label: "Customers", icon: <Users className="h-5 w-5" />, description: "List of customers with their details" },
    { id: "invoices", label: "Invoices", icon: <Receipt className="h-5 w-5" />, description: "Manage invoices and billing" },
    { id: "payments", label: "Payments", icon: <DollarSign className="h-5 w-5" />, description: "Track payments and transactions" },
    { id: "reports", label: "Reports & Analytics", icon: <PieChart className="h-5 w-5" />, description: "Insights and trends" },
    { id: "team", label: "Team Management", icon: <UserPlus className="h-5 w-5" />, description: "Manage company users and roles" },
    { id: "settings", label: "Settings", icon: <Settings className="h-5 w-5" />, description: "Configure company details and preferences" }
  ];

  // Customer portal navigation items
  const customerNavItems = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" />, description: "Overview of past enquiries and responses" },
    { id: "my-enquiries", label: "My Enquiries", icon: <FileText className="h-5 w-5" />, description: "List of submitted enquiries and status updates" },
    { id: "billing", label: "Billing & Payments", icon: <CreditCard className="h-5 w-5" />, description: "View invoices and make payments" },
    { id: "profile", label: "Profile Settings", icon: <User className="h-5 w-5" />, description: "Update account details" },
    { id: "notifications", label: "Notifications", icon: <Bell className="h-5 w-5" />, description: "View alerts and messages" },
    { id: "support", label: "Support", icon: <HelpCircle className="h-5 w-5" />, description: "Contact customer service or FAQs" }
  ];

  // Get the current active navigation items based on portal selection
  const activeNavItems = activePortal === "company" ? companyNavItems : customerNavItems;

  // Stats for demo company dashboard - explicitly type the changeType property
  const companyStats = [
    { label: "Total Enquiries", value: "164", change: "+12%", changeType: "positive" as const },
    { label: "Pending", value: "21", change: "-5%", changeType: "positive" as const },
    { label: "Response Time", value: "1.8h", change: "+0.3h", changeType: "negative" as const },
    { label: "Conversion Rate", value: "26%", change: "+2%", changeType: "positive" as const }
  ];

  // Stats for demo customer dashboard with proper zero values - explicitly type the changeType property
  const customerStats = [
    { label: "Total Inquiries", value: "5", change: "+2", changeType: "positive" as const },
    { label: "Active Inquiries", value: "2", change: "+1", changeType: "positive" as const },
    { label: "Pending Inquiries", value: "2", change: "+0", changeType: "neutral" as const },
    { label: "Resolved Inquiries", value: "3", change: "+2", changeType: "positive" as const }
  ];

  // Helper function to render content for customer navigation items
  const renderCustomerContent = () => {
    switch(activeNavItem) {
      case "dashboard":
        return <CustomerDemoView stats={customerStats} />;
      case "my-enquiries":
        return (
          <div className="pt-8 pb-4 px-4 sm:px-6">
            <Container size="full">
              <div className="mb-6">
                <h1 className="text-2xl font-semibold mb-1">My Enquiries</h1>
                <p className="text-muted-foreground">Track and manage your conversations with companies</p>
              </div>
              <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-4 shadow-sm">
                <div className="h-[600px]">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
                    {/* Showing the same kanban board for simplicity in demo */}
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
            </Container>
          </div>
        );
      case "billing":
        return (
          <div className="pt-8 pb-4 px-4 sm:px-6">
            <Container size="full">
              <div className="mb-6">
                <h1 className="text-2xl font-semibold mb-1">Billing & Payments</h1>
                <p className="text-muted-foreground">Manage your invoices and payment methods</p>
              </div>
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
                  <Card className="border shadow-sm">
                    <div className="p-6">
                      <h2 className="text-xl font-medium mb-4">Payment History</h2>
                      <div className="space-y-4">
                        {[
                          { id: "PMT-2023-001", method: "Credit Card", last4: "4242", amount: "$1,500.00", date: "Mar 15, 2023" },
                          { id: "PMT-2023-002", method: "Credit Card", last4: "4242", amount: "$500.00", date: "Apr 02, 2023" }
                        ].map(payment => (
                          <div key={payment.id} className="flex justify-between items-center p-4 border rounded-lg">
                            <div>
                              <h3 className="font-medium">{payment.method} ending in {payment.last4}</h3>
                              <p className="text-xs text-muted-foreground">Transaction ID: {payment.id}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">{payment.amount}</p>
                              <p className="text-xs text-muted-foreground">{payment.date}</p>
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
                            <CreditCard className="h-5 w-5" />
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
                  <Card className="border shadow-sm">
                    <div className="p-6">
                      <h2 className="text-xl font-medium mb-4">Upcoming Payments</h2>
                      <div className="p-4 border rounded-lg bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
                        <h3 className="font-medium text-amber-800 dark:text-amber-300">Due in 5 days</h3>
                        <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">Invoice #INV-2023-003</p>
                        <p className="text-sm font-medium mt-1">$750.00</p>
                        <Button size="sm" className="w-full mt-3">Make Payment</Button>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </Container>
          </div>
        );
      case "profile":
        return (
          <div className="pt-8 pb-4 px-4 sm:px-6">
            <Container size="full">
              <div className="mb-6">
                <h1 className="text-2xl font-semibold mb-1">Profile Settings</h1>
                <p className="text-muted-foreground">Manage your account information and preferences</p>
              </div>
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
                        <div>
                          <label className="text-sm font-medium block mb-1">Address</label>
                          <textarea className="w-full p-2 border rounded-md" rows={3} readOnly>123 Demo Street, Example City, ST 12345</textarea>
                        </div>
                        <Button className="w-full sm:w-auto">Update Information</Button>
                      </div>
                    </div>
                  </Card>
                </div>
                <div className="space-y-6">
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
                          <div className="h-6 w-10 bg-primary rounded-full relative cursor-pointer">
                            <div className="absolute right-1 top-1 h-4 w-4 bg-white rounded-full"></div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Two-Factor Authentication</p>
                            <p className="text-xs text-muted-foreground">Secure your account</p>
                          </div>
                          <div className="h-6 w-10 bg-muted rounded-full relative cursor-pointer">
                            <div className="absolute left-1 top-1 h-4 w-4 bg-muted-foreground rounded-full"></div>
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" className="w-full mt-4">Change Password</Button>
                    </div>
                  </Card>
                  <Card className="border shadow-sm">
                    <div className="p-6">
                      <h2 className="text-xl font-medium mb-4">Account Status</h2>
                      <div className="p-3 border rounded-md bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
                        <div className="flex items-center">
                          <div className="h-8 w-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center text-green-600 dark:text-green-300 mr-3">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-medium text-green-800 dark:text-green-300">Active</p>
                            <p className="text-xs text-green-700 dark:text-green-400">Your account is in good standing</p>
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-3">Member since March 12, 2023</p>
                    </div>
                  </Card>
                </div>
              </div>
            </Container>
          </div>
        );
      case "notifications":
        return (
          <div className="pt-8 pb-4 px-4 sm:px-6">
            <Container size="full">
              <div className="mb-6">
                <h1 className="text-2xl font-semibold mb-1">Notifications</h1>
                <p className="text-muted-foreground">View and manage all your notifications</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <Card className="border shadow-sm">
                    <div className="p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-medium">Recent Notifications</h2>
                        <Button variant="ghost" size="sm">Mark All as Read</Button>
                      </div>
                      <div className="space-y-4">
                        {[
                          { id: 1, title: "Enquiry Status Updated", message: "Your 'Website Redesign' enquiry has been updated to 'In Progress'", time: "2 hours ago", isRead: false, type: "status" },
                          { id: 2, title: "New Message Received", message: "You have a new message from TechSolutions Inc regarding your enquiry", time: "Yesterday", isRead: false, type: "message" },
                          { id: 3, title: "Payment Confirmation", message: "Your payment of $500.00 to Acme Design Studio has been processed", time: "2 days ago", isRead: true, type: "payment" },
                          { id: 4, title: "Enquiry Completed", message: "Your 'SEO Optimization' enquiry has been marked as completed", time: "1 week ago", isRead: true, type: "status" },
                          { id: 5, title: "Invoice Received", message: "You have received an invoice from Global Marketing for $750.00", time: "1 week ago", isRead: true, type: "invoice" }
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
                              {notification.type === "message" && <Button size="sm">Reply</Button>}
                              {!notification.isRead && <Button variant="ghost" size="sm">Mark as Read</Button>}
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
                      <h2 className="text-xl font-medium mb-4">Notification Settings</h2>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Enquiry Updates</p>
                            <p className="text-xs text-muted-foreground">Status changes and progress</p>
                          </div>
                          <div className="h-6 w-10 bg-primary rounded-full relative cursor-pointer">
                            <div className="absolute right-1 top-1 h-4 w-4 bg-white rounded-full"></div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Messages</p>
                            <p className="text-xs text-muted-foreground">New messages from companies</p>
                          </div>
                          <div className="h-6 w-10 bg-primary rounded-full relative cursor-pointer">
                            <div className="absolute right-1 top-1 h-4 w-4 bg-white rounded-full"></div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Payments & Invoices</p>
                            <p className="text-xs text-muted-foreground">Billing and payment updates</p>
                          </div>
                          <div className="h-6 w-10 bg-primary rounded-full relative cursor-pointer">
                            <div className="absolute right-1 top-1 h-4 w-4 bg-white rounded-full"></div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Marketing Updates</p>
                            <p className="text-xs text-muted-foreground">Promotional offers and news</p>
                          </div>
                          <div className="h-6 w-10 bg-muted rounded-full relative cursor-pointer">
                            <div className="absolute left-1 top-1 h-4 w-4 bg-muted-foreground rounded-full"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                  <Card className="border shadow-sm">
                    <div className="p-6">
                      <h2 className="text-xl font-medium mb-4">Notification Delivery</h2>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900 rounded-md flex items-center justify-center text-blue-600 dark:text-blue-300">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">Email</p>
                            <p className="text-xs text-muted-foreground">demo.customer@example.com</p>
                          </div>
                          <Button variant="outline" size="sm">Edit</Button>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900 rounded-md flex items-center justify-center text-blue-600 dark:text-blue-300">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">Mobile</p>
                            <p className="text-xs text-muted-foreground">+1 (555) 123-4567</p>
                          </div>
                          <Button variant="outline" size="sm">Edit</Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </Container>
          </div>
        );
      case "support":
        return (
          <div className="pt-8 pb-4 px-4 sm:px-6">
            <Container size="full">
              <div className="mb-6">
                <h1 className="text-2xl font-semibold mb-1">Support</h1>
                <p className="text-muted-foreground">Get help with your account or enquiries</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
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
                        <div>
                          <label className="text-sm font-medium block mb-1">Attachments (Optional)</label>
                          <div className="border-dashed border-2 rounded-md p-6 text-center">
                            <p className="text-sm text-muted-foreground">Drag and drop files here, or click to select files</p>
                            <Button variant="outline" className="mt-2">Select Files</Button>
                          </div>
                        </div>
                        <Button>Submit Support Ticket</Button>
                      </div>
                    </div>
                  </Card>
                  <Card className="border shadow-sm">
                    <div className="p-6">
                      <h2 className="text-xl font-medium mb-4">Recent Support Tickets</h2>
                      <div className="space-y-4">
                        {[
                          { id: "TICKET-001", subject: "Payment Issue", status: "Open", date: "2 days ago", lastUpdate: "Yesterday" },
                          { id: "TICKET-002", subject: "Account Access Problems", status: "Closed", date: "1 week ago", lastUpdate: "5 days ago" }
                        ].map(ticket => (
                          <div key={ticket.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border rounded-lg">
                            <div>
                              <h3 className="font-medium">{ticket.subject}</h3>
                              <p className="text-xs text-muted-foreground">Ticket ID: {ticket.id}</p>
                              <p className="text-xs text-muted-foreground">Submitted: {ticket.date}</p>
                            </div>
                            <div className="mt-2 sm:mt-0 sm:text-right">
                              <span className={`inline-block text-xs px-2 py-1 rounded-full ${
                                ticket.status === "Open" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" : 
                                "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                              }`}>
                                {ticket.status}
                              </span>
                              <p className="text-xs text-muted-foreground mt-1">Last updated: {ticket.lastUpdate}</p>
                              <Button variant="outline" size="sm" className="mt-1">View Details</Button>
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
                      <h2 className="text-xl font-medium mb-4">Help Center</h2>
                      <div className="space-y-3">
                        <Button variant="outline" className="w-full justify-start">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                          </svg>
                          Knowledge Base
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                          </svg>
                          FAQs
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" />
                          </svg>
                          Video Tutorials
                        </Button>
                      </div>
                      <div className="mt-4 p-4 border rounded-md bg-primary/5">
                        <h3 className="font-medium mb-2">Popular Articles</h3>
                        <ul className="space-y-2 text-sm">
                          <li className="hover:text-primary cursor-pointer">How to submit an enquiry</li>
                          <li className="hover:text-primary cursor-pointer">Understanding payment options</li>
                          <li className="hover:text-primary cursor-pointer">Communicating with companies</li>
                          <li className="hover:text-primary cursor-pointer">Managing your profile</li>
                        </ul>
                      </div>
                    </div>
                  </Card>
                  <Card className="border shadow-sm">
                    <div className="p-6">
                      <h2 className="text-xl font-medium mb-4">Contact Information</h2>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900 rounded-md flex items-center justify-center text-blue-600 dark:text-blue-300">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Email Support</p>
                            <p className="text-xs text-muted-foreground">support@example.com</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900 rounded-md flex items-center justify-center text-blue-600 dark:text-blue-300">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Phone Support</p>
                            <p className="text-xs text-muted-foreground">+1 (555) 987-6543</p>
                            <p className="text-xs text-muted-foreground">Mon-Fri, 9am-5pm</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900 rounded-md flex items-center justify-center text-blue-600 dark:text-blue-300">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Live Chat</p>
                            <p className="text-xs text-muted-foreground">Available 24/7</p>
                          </div>
                          <Button size="sm" className="ml-auto">Start Chat</Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </Container>
          </div>
        );
      default:
        return (
          <div className="pt-8 pb-4 px-4 sm:px-6">
            <Container size="full">
              <div className="bg-card rounded-lg border shadow-sm p-8 text-center">
                <h2 className="text-2xl font-semibold mb-4">{customerNavItems.find(item => item.id === activeNavItem)?.label}</h2>
                <p className="text-muted-foreground mb-6">{customerNavItems.find(item => item.id === activeNavItem)?.description}</p>
                <Button>
                  Go to Dashboard
                </Button>
              </div>
            </Container>
          </div>
        );
    }
  };

  // Helper function to render content for company navigation items
  const renderCompanyContent = () => {
    if (activeNavItem === "dashboard") {
      return <CompanyDemoView 
        stats={companyStats} 
        activeNavItem={activeNavItem}
        companyNavItems={companyNavItems}
      />;
    }

    return (
      <div className="pt-8 pb-4 px-4 sm:px-6">
        <Container size="full">
          {activeNavItem === "enquiries" ? (
            <div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <div>
                  <h1 className="text-2xl font-semibold mb-1">
                    Enquiries Management
                  </h1>
                  <p className="text-muted-foreground">
                    View and manage customer enquiries
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    New Enquiry
                  </Button>
                </div>
              </div>
              
              <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-4 shadow-sm">
                <div className="h-[600px]">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
                    <div className="bg-background rounded-lg border p-4">
                      <h3 className="font-medium mb-4 flex justify-between items-center">
                        <span>New <span className="text-xs ml-1 text-muted-foreground">(3)</span></span>
                        <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 text-xs px-2 py-1 rounded-full">Needs Review</span>
                      </h3>
                      <div className="space-y-3">
                        {[
                          { id: 1, title: "Website Redesign", customer: "John Smith", date: "Today" },
                          { id: 2, title: "Logo Design", customer: "Sarah Johnson", date: "Yesterday" },
                          { id: 3, title: "SEO Consultation", customer: "Michael Brown", date: "2 days ago" }
                        ].map(item => (
                          <Card key={item.id} className="p-3 cursor-pointer hover:bg-accent/10">
                            <h4 className="font-medium text-sm">{item.title}</h4>
                            <p className="text-xs text-muted-foreground mt-1">{item.customer}</p>
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
                        <span>Pending <span className="text-xs ml-1 text-muted-foreground">(4)</span></span>
                        <span className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300 text-xs px-2 py-1 rounded-full">In Progress</span>
                      </h3>
                      <div className="space-y-3">
                        {[
                          { id: 4, title: "E-commerce Store", customer: "Emily Wilson", date: "3 days ago" },
                          { id: 5, title: "Mobile App Development", customer: "David Miller", date: "4 days ago" },
                          { id: 6, title: "Social Media Campaign", customer: "Jennifer Lee", date: "1 week ago" },
                          { id: 7, title: "Content Writing", customer: "Robert Taylor", date: "1 week ago" }
                        ].map(item => (
                          <Card key={item.id} className="p-3 cursor-pointer hover:bg-accent/10">
                            <h4 className="font-medium text-sm">{item.title}</h4>
                            <p className="text-xs text-muted-foreground mt-1">{item.customer}</p>
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
                        <span>Completed <span className="text-xs ml-1 text-muted-foreground">(3)</span></span>
                        <span className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 text-xs px-2 py-1 rounded-full">Done</span>
                      </h3>
                      <div className="space-y-3">
                        {[
                          { id: 8, title: "Brand Identity", customer: "Jessica Adams", date: "2 weeks ago" },
                          { id: 9, title: "UI/UX Design", customer: "Thomas Garcia", date: "3 weeks ago" },
                          { id: 10, title: "Print Marketing Materials", customer: "Amanda White", date: "1 month ago" }
                        ].map(item => (
                          <Card key={item.id} className="p-3 cursor-pointer hover:bg-accent/10">
                            <h4 className="font-medium text-sm">{item.title}</h4>
                            <p className="text-xs text-muted-foreground mt-1">{item.customer}</p>
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
            </div>
          ) : activeNavItem === "customers" ? (
            <div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <div>
                  <h1 className="text-2xl font-semibold mb-1">
                    Customers
                  </h1>
                  <p className="text-muted-foreground">
                    Manage your customer database
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Customer
                  </Button>
                </div>
              </div>
              
              <Card className="border shadow-sm">
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      { id: 1, name: "John Smith", email: "john.smith@example.com", phone: "+1 (555) 123-4567", enquiries: 3, totalValue: "$2,500" },
                      { id: 2, name: "Sarah Johnson", email: "sarah.j@example.com", phone: "+1 (555) 234-5678", enquiries: 1, totalValue: "$1,200" },
                      { id: 3, name: "Michael Brown", email: "m.brown@example.com", phone: "+1 (555) 345-6789", enquiries: 2, totalValue: "$3,700" },
                      { id: 4, name: "Emily Wilson", email: "e.wilson@example.com", phone: "+1 (555) 456-7890", enquiries: 1, totalValue: "$800" },
                      { id: 5, name: "David Miller", email: "david.m@example.com", phone: "+1 (555) 567-8901", enquiries: 1, totalValue: "$2,100" },
                      { id: 6, name: "Jennifer Lee", email: "jennifer.l@example.com", phone: "+1 (555) 678-9012", enquiries: 2, totalValue: "$4,300" }
                    ].map(customer => (
                      <div key={customer.id} className="bg-background rounded-lg border p-4 hover:border-primary/50 cursor-pointer transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                            {customer.name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-medium">{customer.name}</h3>
                            <p className="text-xs text-muted-foreground">{customer.email}</p>
                          </div>
                        </div>
                        <div className="mt-3 text-sm">
                          <div className="flex justify-between py-1 border-b">
                            <span className="text-muted-foreground">Phone:</span>
                            <span>{customer.phone}</span>
                          </div>
                          <div className="flex justify-between py-1 border-b">
                            <span className="text-muted-foreground">Enquiries:</span>
                            <span>{customer.enquiries}</span>
                          </div>
                          <div className="flex justify-between py-1">
                            <span className="text-muted-foreground">Total Value:</span>
                            <span className="font-medium">{customer.totalValue}</span>
                          </div>
                        </div>
                        <div className="mt-3 flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1">View</Button>
                          <Button size="sm" className="flex-1">Contact</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          ) : (
            <div className="bg-card rounded-lg border shadow-sm p-8 text-center">
              <h2 className="text-2xl font-semibold mb-4">{companyNavItems.find(item => item.id === activeNavItem)?.label}</h2>
              <p className="text-muted-foreground mb-6">{companyNavItems.find(item => item.id === activeNavItem)?.description}</p>
              <Button>
                {activeNavItem === 'invoices' ? 'Create Invoice' : 
                activeNavItem === 'payments' ? 'Record Payment' :
                activeNavItem === 'reports' ? 'Generate Report' :
                activeNavItem === 'team' ? 'Add Team Member' :
                activeNavItem === 'settings' ? 'Save Settings' :
                'Go to Dashboard'}
              </Button>
            </div>
          )}
        </Container>
      </div>
    );
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar>
          <div className="h-16 flex items-center px-4 border-b border-sidebar-border">
            <h1 className="font-semibold">Enquiry Demo</h1>
          </div>
          <div className="p-4 border-b border-sidebar-border">
            <div className="space-y-2">
              <label className="text-xs text-sidebar-foreground/70">Demo Portal View</label>
              <Tabs 
                value={activePortal} 
                onValueChange={setActivePortal}
                className="w-full"
              >
                <TabsList className="w-full">
                  <TabsTrigger value="company" className="flex-1">
                    <Building className="mr-1 h-4 w-4" />
                    Company
                  </TabsTrigger>
                  <TabsTrigger value="customer" className="flex-1">
                    <User className="mr-1 h-4 w-4" />
                    Customer
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              <p className="text-xs text-sidebar-foreground/70 mt-2">
                Switch between portal views to preview both interfaces.
              </p>
            </div>
          </div>
          <SidebarContent>
            <div className="space-y-1 py-4">
              {activeNavItems.map((item) => (
                <SidebarNavItem
                  key={item.id}
                  id={item.id}
                  label={item.label}
                  icon={item.icon}
                  description={item.description}
                  isActive={activeNavItem === item.id}
                  onClick={setActiveNavItem}
                />
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
                  <p className="text-sm font-medium">Demo User</p>
                  <p className="text-xs text-sidebar-foreground/70">
                    {activePortal === "company" ? "Company" : "Customer"}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="text-sidebar-foreground">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Sidebar>

        <div className="flex-1 flex flex-col overflow-hidden">
          <DemoHeader />

          <main className="flex-1 overflow-y-auto overflow-x-hidden">
            {activePortal === "company" ? renderCompanyContent() : renderCustomerContent()}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DemoDashboard;
