import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { 
  Search, 
  Bell, 
  Building,
  Mail,
  Phone,
  Globe,
  MapPin,
  Calendar,
  CreditCard,
  Download,
  ArrowUpRight,
  ExternalLink,
  Filter,
  Receipt,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Edit,
  FileText
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock data for the company
const companyData = {
  id: "comp-123",
  name: "Acme Corporation",
  email: "contact@acmecorp.com",
  phone: "+1 (123) 456-7890",
  website: "www.acmecorp.com",
  address: "123 Business Avenue, Tech City, TC 12345",
  registeredDate: "2023-01-15",
  industry: "Technology",
  plan: "Professional",
  billingCycle: "Monthly",
  nextBillingDate: "2023-08-15",
  logo: "/company-logo.png"
};

// Mock data for invoices received
const receivedInvoices = [
  {
    id: "INV-001",
    from: "TechSupplies Inc.",
    date: "2023-07-25",
    dueDate: "2023-08-24",
    amount: "$2,500.00",
    status: "paid"
  },
  {
    id: "INV-002",
    from: "Marketing Partners",
    date: "2023-07-15",
    dueDate: "2023-08-14",
    amount: "$1,800.00",
    status: "pending"
  },
  {
    id: "INV-003",
    from: "Cloud Services LLC",
    date: "2023-07-10",
    dueDate: "2023-08-09",
    amount: "$950.00",
    status: "paid"
  },
  {
    id: "INV-004",
    from: "Office Supplies Co.",
    date: "2023-07-05",
    dueDate: "2023-08-04",
    amount: "$340.00",
    status: "pending"
  }
];

// Mock data for invoices sent
const sentInvoices = [
  {
    id: "INV-101",
    to: "Global Solutions Ltd.",
    date: "2023-07-20",
    dueDate: "2023-08-19",
    amount: "$5,200.00",
    status: "paid"
  },
  {
    id: "INV-102",
    to: "Retail Innovations Inc.",
    date: "2023-07-18",
    dueDate: "2023-08-17",
    amount: "$3,750.00",
    status: "pending"
  },
  {
    id: "INV-103",
    to: "Finance Partners LLC",
    date: "2023-07-12",
    dueDate: "2023-08-11",
    amount: "$1,250.00",
    status: "paid"
  },
  {
    id: "INV-104",
    to: "Healthcare Solutions",
    date: "2023-07-01",
    dueDate: "2023-07-31",
    amount: "$4,800.00",
    status: "pending"
  }
];

// Mock data for enquiries sent
const sentEnquiries = [
  {
    id: "ENQ-001",
    to: "Building Construction Inc.",
    title: "Office Space Renovation",
    date: "2023-07-22",
    status: "replied"
  },
  {
    id: "ENQ-002",
    to: "IT Solutions Corp",
    title: "Network Infrastructure Upgrade",
    date: "2023-07-15",
    status: "pending"
  },
  {
    id: "ENQ-003",
    to: "Marketing Experts",
    title: "Digital Marketing Campaign",
    date: "2023-07-10",
    status: "replied"
  }
];

// Mock data for payment methods
const paymentMethods = [
  {
    id: "pm-1",
    type: "Visa",
    last4: "4242",
    expMonth: "09",
    expYear: "2025",
    primary: true
  },
  {
    id: "pm-2",
    type: "Mastercard",
    last4: "8888",
    expMonth: "12",
    expYear: "2024",
    primary: false
  }
];

// Mock subscription plans
const subscriptionPlans = [
  {
    id: "basic",
    name: "Basic Plan",
    price: "$49/month",
    features: [
      "Limited to 50 enquiries per month",
      "Email support",
      "Basic customer management",
      "Standard reporting"
    ],
    current: false
  },
  {
    id: "professional",
    name: "Professional Plan",
    price: "$99/month",
    features: [
      "Up to 200 enquiries per month",
      "Priority email & phone support",
      "Advanced customer management",
      "Enhanced reporting & analytics",
      "Customer portal customization"
    ],
    current: true
  },
  {
    id: "enterprise",
    name: "Enterprise Plan",
    price: "$249/month",
    features: [
      "Unlimited enquiries",
      "24/7 dedicated support",
      "Full customer relationship management",
      "Advanced analytics & reporting",
      "Custom integration options",
      "Multi-user accounts",
      "White-label customer portal"
    ],
    current: false
  }
];

export default function CompanyDetails() {
  const { toast } = useToast();
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState("company-info");
  const [searchReceivedInvoices, setSearchReceivedInvoices] = useState("");
  const [searchSentInvoices, setSearchSentInvoices] = useState("");
  const [invoicesTab, setInvoicesTab] = useState("received");
  
  // Filter invoices based on search query
  const filteredReceivedInvoices = receivedInvoices.filter(invoice => 
    invoice.from.toLowerCase().includes(searchReceivedInvoices.toLowerCase()) ||
    invoice.id.toLowerCase().includes(searchReceivedInvoices.toLowerCase())
  );
  
  const filteredSentInvoices = sentInvoices.filter(invoice => 
    invoice.to.toLowerCase().includes(searchSentInvoices.toLowerCase()) ||
    invoice.id.toLowerCase().includes(searchSentInvoices.toLowerCase())
  );
  
  const handleAction = (action: string) => {
    toast({
      title: "Action triggered",
      description: `${action} action will be implemented soon`,
    });
  };
  
  return (
    <AppLayout>
      <div className="flex-1 overflow-y-auto">
        <header className="h-16 border-b border-border flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-4">
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

        <main className="p-6">
          <Container>
            {/* Company Info header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-14 w-14">
                  {companyData.logo ? (
                    <AvatarImage src={companyData.logo} alt={companyData.name} />
                  ) : (
                    <AvatarFallback className="bg-primary/10 text-primary text-lg">
                      {companyData.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <h1 className="text-2xl font-semibold">{companyData.name}</h1>
                  <p className="text-muted-foreground">
                    Member since {new Date(companyData.registeredDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </p>
                </div>
              </div>
              <Badge variant="outline" className="px-3 py-1 bg-primary/5">
                {companyData.industry}
              </Badge>
            </div>

            {/* Main tabs */}
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList className="grid grid-cols-3 w-full max-w-lg">
                <TabsTrigger value="company-info">Company Info</TabsTrigger>
                <TabsTrigger value="invoices">Invoices</TabsTrigger>
                <TabsTrigger value="subscription">App Subscription</TabsTrigger>
              </TabsList>

              {/* Company Info Tab */}
              <TabsContent value="company-info" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Company Information</CardTitle>
                    <CardDescription>
                      View and manage your company details
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground mb-1">Company Name</h3>
                          <p className="font-medium">{companyData.name}</p>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground mb-1">Email</h3>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <p>{companyData.email}</p>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground mb-1">Phone</h3>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <p>{companyData.phone}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground mb-1">Website</h3>
                          <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4 text-muted-foreground" />
                            <a href={`https://${companyData.website}`} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                              {companyData.website}
                            </a>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground mb-1">Address</h3>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <p>{companyData.address}</p>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground mb-1">Registered Date</h3>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <p>{new Date(companyData.registeredDate).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" onClick={() => handleAction("Edit Company Information")}>
                      Edit Information
                    </Button>
                  </CardFooter>
                </Card>
                
                {/* Enquiries section */}
                <Card>
                  <CardHeader>
                    <CardTitle>Enquiries Sent to Other Companies</CardTitle>
                    <CardDescription>
                      Track enquiries your company has sent to other businesses
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Recipient</TableHead>
                          <TableHead>Title</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sentEnquiries.length > 0 ? (
                          sentEnquiries.map((enquiry) => (
                            <TableRow key={enquiry.id}>
                              <TableCell className="font-medium">{enquiry.id}</TableCell>
                              <TableCell>{enquiry.to}</TableCell>
                              <TableCell>{enquiry.title}</TableCell>
                              <TableCell>{new Date(enquiry.date).toLocaleDateString()}</TableCell>
                              <TableCell>
                                <Badge variant={enquiry.status === "replied" ? "outline" : "secondary"}>
                                  {enquiry.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleAction(`View enquiry ${enquiry.id}`)}
                                >
                                  <ExternalLink className="h-4 w-4 mr-2" />
                                  View
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                              No enquiries have been sent yet
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      onClick={() => handleAction("Create New Enquiry")}
                      size="sm"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create New Enquiry
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              {/* Invoices Tab */}
              <TabsContent value="invoices" className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                      <div>
                        <CardTitle>Invoices</CardTitle>
                        <CardDescription>
                          Manage invoices received from vendors and sent to customers
                        </CardDescription>
                      </div>
                      <Tabs value={invoicesTab} onValueChange={setInvoicesTab} className="mt-4 sm:mt-0">
                        <TabsList>
                          <TabsTrigger value="received">Received</TabsTrigger>
                          <TabsTrigger value="sent">Sent</TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {invoicesTab === "received" ? (
                      <>
                        <div className="flex items-center justify-between mb-4">
                          <div className="relative w-full max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="Search invoices..."
                              className="pl-10"
                              value={searchReceivedInvoices}
                              onChange={(e) => setSearchReceivedInvoices(e.target.value)}
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Filter className="h-4 w-4 mr-2" />
                              Filter
                            </Button>
                            <Button variant="outline" size="sm">
                              <Calendar className="h-4 w-4 mr-2" />
                              Date Range
                            </Button>
                          </div>
                        </div>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Invoice ID</TableHead>
                              <TableHead>From</TableHead>
                              <TableHead>Issue Date</TableHead>
                              <TableHead>Due Date</TableHead>
                              <TableHead>Amount</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredReceivedInvoices.map((invoice) => (
                              <TableRow key={invoice.id}>
                                <TableCell className="font-medium">{invoice.id}</TableCell>
                                <TableCell>{invoice.from}</TableCell>
                                <TableCell>{new Date(invoice.date).toLocaleDateString()}</TableCell>
                                <TableCell>{new Date(invoice.dueDate).toLocaleDateString()}</TableCell>
                                <TableCell>{invoice.amount}</TableCell>
                                <TableCell>
                                  <Badge variant={invoice.status === "paid" ? "outline" : "secondary"}>
                                    {invoice.status}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => handleAction(`Download invoice ${invoice.id}`)}
                                  >
                                    <Download className="h-4 w-4 mr-2" />
                                    Download
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center justify-between mb-4">
                          <div className="relative w-full max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="Search invoices..."
                              className="pl-10"
                              value={searchSentInvoices}
                              onChange={(e) => setSearchSentInvoices(e.target.value)}
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Filter className="h-4 w-4 mr-2" />
                              Filter
                            </Button>
                            <Button variant="outline" size="sm">
                              <Calendar className="h-4 w-4 mr-2" />
                              Date Range
                            </Button>
                          </div>
                        </div>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Invoice ID</TableHead>
                              <TableHead>To</TableHead>
                              <TableHead>Issue Date</TableHead>
                              <TableHead>Due Date</TableHead>
                              <TableHead>Amount</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredSentInvoices.map((invoice) => (
                              <TableRow key={invoice.id}>
                                <TableCell className="font-medium">{invoice.id}</TableCell>
                                <TableCell>{invoice.to}</TableCell>
                                <TableCell>{new Date(invoice.date).toLocaleDateString()}</TableCell>
                                <TableCell>{new Date(invoice.dueDate).toLocaleDateString()}</TableCell>
                                <TableCell>{invoice.amount}</TableCell>
                                <TableCell>
                                  <Badge variant={invoice.status === "paid" ? "outline" : "secondary"}>
                                    {invoice.status}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => handleAction(`Download invoice ${invoice.id}`)}
                                  >
                                    <Download className="h-4 w-4 mr-2" />
                                    Download
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </>
                    )}
                  </CardContent>
                  <CardFooter className="justify-between">
                    <Button 
                      onClick={() => handleAction("Create New Invoice")}
                      size="sm"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create New Invoice
                    </Button>
                    
                    <Button variant="outline" size="sm" onClick={() => handleAction("View All Invoices")}>
                      <ArrowUpRight className="h-4 w-4 mr-2" />
                      View All Invoices
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              {/* App Subscription Tab */}
              <TabsContent value="subscription" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Current Subscription</CardTitle>
                    <CardDescription>
                      Your current app subscription and billing information
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="p-4 border rounded-md bg-primary/5">
                      <div className="flex flex-col md:flex-row justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">{companyData.plan} Plan</h3>
                          <p className="text-muted-foreground">
                            {companyData.billingCycle} billing cycle
                          </p>
                        </div>
                        <div className="mt-4 md:mt-0">
                          <p className="text-sm text-muted-foreground">Next billing date</p>
                          <p className="font-medium">{new Date(companyData.nextBillingDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <p className="text-sm">Your subscription is active</p>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="font-medium mb-4">Payment Methods</h3>
                      <div className="space-y-4">
                        {paymentMethods.map((method) => (
                          <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <CreditCard className="h-8 w-8" />
                              <div>
                                <p className="font-medium capitalize">{method.type} •••• {method.last4}</p>
                                <p className="text-sm text-muted-foreground">Expires {method.expMonth}/{method.expYear}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {method.primary && <Badge variant="outline">Default</Badge>}
                              <Button variant="ghost" size="sm" onClick={() => handleAction("Edit payment method")}>Edit</Button>
                              {!method.primary && <Button variant="ghost" size="sm" onClick={() => handleAction("Remove payment method")}>Remove</Button>}
                              {!method.primary && <Button variant="outline" size="sm" onClick={() => handleAction("Make default payment method")}>Make Default</Button>}
                            </div>
                          </div>
                        ))}
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-4"
                        onClick={() => handleAction("Add new payment method")}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Payment Method
                      </Button>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="font-medium mb-4">Available Plans</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {subscriptionPlans.map((plan) => (
                          <div 
                            key={plan.id} 
                            className={`p-4 border rounded-lg ${plan.current ? 'border-primary bg-primary/5' : ''}`}
                          >
                            <h4 className="font-semibold text-lg">{plan.name}</h4>
                            <p className="text-lg font-bold my-2">{plan.price}</p>
                            <ul className="space-y-2 mt-4">
                              {plan.features.map((feature, index) => (
                                <li key={index} className="flex items-start gap-2 text-sm">
                                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                                  <span>{feature}</span>
                                </li>
                              ))}
                            </ul>
                            {plan.current ? (
                              <Badge className="mt-4">Current Plan</Badge>
                            ) : (
                              <Button 
                                variant="outline" 
                                className="w-full mt-4"
                                onClick={() => handleAction(`Switch to ${plan.name}`)}
                              >
                                Switch to this plan
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="justify-between">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleAction("View billing history")}
                    >
                      <Receipt className="h-4 w-4 mr-2" />
                      Billing History
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleAction("Download invoice")}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Download Invoice
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </Container>
        </main>
      </div>
    </AppLayout>
  );
} 