import { useState } from "react";
import { CreditCard, Download, Clock, Filter, Search, ChevronDown, ChevronRight, Plus, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Mock subscription data
const subscriptionPlans = [
  {
    id: "basic",
    name: "Basic Plan",
    price: "$49",
    billingCycle: "monthly",
    maxEnquiries: 50,
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
    price: "$99",
    billingCycle: "monthly",
    maxEnquiries: 200,
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
    price: "$249",
    billingCycle: "monthly",
    maxEnquiries: "Unlimited",
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

// Mock invoice data
const invoices = [
  {
    id: "INV-001",
    date: "2023-07-01",
    amount: "$99.00",
    status: "paid",
    description: "Professional Plan - July 2023"
  },
  {
    id: "INV-002",
    date: "2023-06-01",
    amount: "$99.00",
    status: "paid",
    description: "Professional Plan - June 2023"
  },
  {
    id: "INV-003",
    date: "2023-05-01",
    amount: "$99.00",
    status: "paid",
    description: "Professional Plan - May 2023"
  },
  {
    id: "INV-004",
    date: "2023-04-01",
    amount: "$49.00",
    status: "paid",
    description: "Basic Plan - April 2023"
  },
  {
    id: "INV-005",
    date: "2023-03-01",
    amount: "$49.00",
    status: "paid",
    description: "Basic Plan - March 2023"
  }
];

// Mock payment methods
const paymentMethods = [
  {
    id: "pm1",
    type: "credit_card",
    brand: "visa",
    last4: "4242",
    expMonth: 12,
    expYear: 2024,
    primary: true
  },
  {
    id: "pm2",
    type: "credit_card",
    brand: "mastercard",
    last4: "5555",
    expMonth: 4,
    expYear: 2025,
    primary: false
  }
];

// Mock usage data
const currentUsage = {
  enquiriesUsed: 78,
  enquiriesTotal: 200,
  storageUsed: "1.2",
  storageTotal: "5",
  activeCustomers: 45,
  totalCustomers: 150
};

export default function CompanyBilling() {
  const [activeTab, setActiveTab] = useState("subscription");
  const [showAddPayment, setShowAddPayment] = useState(false);
  
  return (
    <div className="flex flex-col h-full">
      <div className="border-b">
        <div className="flex items-center p-4">
          <h1 className="text-xl font-semibold">Company Billing & Subscription</h1>
        </div>
      </div>
      
      <div className="p-6 flex-1 overflow-auto">
        <Tabs defaultValue="subscription" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="subscription">Subscription</TabsTrigger>
            <TabsTrigger value="payment-methods">Payment Methods</TabsTrigger>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
            <TabsTrigger value="usage">Usage</TabsTrigger>
          </TabsList>
          
          {/* Subscription Tab */}
          <TabsContent value="subscription" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Current Subscription</CardTitle>
                <CardDescription>
                  Manage your subscription plan and billing cycle
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {subscriptionPlans.map((plan) => (
                      <Card 
                        key={plan.id} 
                        className={`${plan.current ? 'border-primary' : ''}`}
                      >
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle>{plan.name}</CardTitle>
                              <CardDescription>
                                {typeof plan.maxEnquiries === 'string' 
                                  ? plan.maxEnquiries 
                                  : `${plan.maxEnquiries}`} enquiries per month
                              </CardDescription>
                            </div>
                            {plan.current && (
                              <Badge variant="outline" className="bg-primary/10 text-primary border-primary">
                                Current Plan
                              </Badge>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="mb-4">
                            <span className="text-3xl font-bold">{plan.price}</span>
                            <span className="text-muted-foreground">/{plan.billingCycle}</span>
                          </div>
                          
                          <ul className="space-y-2 mb-6">
                            {plan.features.map((feature, index) => (
                              <li key={index} className="flex items-start">
                                <Check className="h-5 w-5 text-primary mr-2 shrink-0" />
                                <span className="text-sm">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                        <CardFooter>
                          {plan.current ? (
                            <Button variant="outline" className="w-full">
                              Current Plan
                            </Button>
                          ) : (
                            <Button className="w-full">
                              {subscriptionPlans.find(p => p.current)?.price.replace('$', '') < plan.price.replace('$', '') ? 'Upgrade' : 'Downgrade'}
                            </Button>
                          )}
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                  
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">Billing Information</h3>
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Billing Contact</p>
                        <p className="text-sm">John Smith</p>
                        <p className="text-sm">financial@yourcompany.com</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Billing Address</p>
                        <p className="text-sm">Your Company Ltd.</p>
                        <p className="text-sm">123 Business Street</p>
                        <p className="text-sm">London, UK, EC1A 1AA</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Billing & Renewal</CardTitle>
                <CardDescription>
                  Your next billing date and payment information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Next Payment</p>
                      <p className="text-muted-foreground">Aug 1, 2023</p>
                    </div>
                    <div>
                      <p className="font-medium text-right">Amount</p>
                      <p className="text-muted-foreground text-right">$99.00</p>
                    </div>
                    <div>
                      <p className="font-medium text-right">Payment Method</p>
                      <p className="text-muted-foreground text-right">Visa ending in 4242</p>
                    </div>
                    <Button variant="outline" size="sm">Change Plan</Button>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline">Cancel Subscription</Button>
                    <Button variant="outline">Update Payment Method</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Payment Methods Tab */}
          <TabsContent value="payment-methods" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                  <CardTitle>Payment Methods</CardTitle>
                  <CardDescription>
                    Manage your saved payment methods
                  </CardDescription>
                </div>
                <Dialog open={showAddPayment} onOpenChange={setShowAddPayment}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Payment Method
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Add Payment Method</DialogTitle>
                      <DialogDescription>
                        Enter your payment details to add a new payment method
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <label htmlFor="name" className="text-sm font-medium">Name on Card</label>
                        <Input id="name" placeholder="John Smith" />
                      </div>
                      <div className="grid gap-2">
                        <label htmlFor="card" className="text-sm font-medium">Card Number</label>
                        <Input id="card" placeholder="4242 4242 4242 4242" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <label htmlFor="expiry" className="text-sm font-medium">Expiry Date</label>
                          <Input id="expiry" placeholder="MM/YY" />
                        </div>
                        <div className="grid gap-2">
                          <label htmlFor="cvc" className="text-sm font-medium">CVC</label>
                          <Input id="cvc" placeholder="123" />
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowAddPayment(false)}>Cancel</Button>
                      <Button onClick={() => setShowAddPayment(false)}>Save Payment Method</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {paymentMethods.map((method) => (
                    <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <CreditCard className="h-8 w-8" />
                        <div>
                          <p className="font-medium capitalize">{method.brand} •••• {method.last4}</p>
                          <p className="text-sm text-muted-foreground">Expires {method.expMonth}/{method.expYear}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {method.primary && <Badge variant="outline">Default</Badge>}
                        <Button variant="ghost" size="sm">Edit</Button>
                        {!method.primary && <Button variant="ghost" size="sm">Remove</Button>}
                        {!method.primary && <Button variant="outline" size="sm">Make Default</Button>}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Invoices Tab */}
          <TabsContent value="invoices" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                  <CardTitle>Billing History</CardTitle>
                  <CardDescription>
                    View and download your past invoices
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Invoices</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-medium">{invoice.id}</TableCell>
                        <TableCell>{invoice.date}</TableCell>
                        <TableCell>{invoice.description}</TableCell>
                        <TableCell>{invoice.amount}</TableCell>
                        <TableCell>
                          <Badge variant={invoice.status === "paid" ? "outline" : "secondary"}>
                            {invoice.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            PDF
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Usage Tab */}
          <TabsContent value="usage" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Subscription Usage</CardTitle>
                <CardDescription>
                  Monitor your current plan usage
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="font-medium">Enquiries</h3>
                        <p className="text-sm text-muted-foreground">
                          {currentUsage.enquiriesUsed} of {currentUsage.enquiriesTotal} used this month
                        </p>
                      </div>
                      <span className="text-sm font-medium">
                        {Math.round((currentUsage.enquiriesUsed / currentUsage.enquiriesTotal) * 100)}%
                      </span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary" 
                        style={{ width: `${(currentUsage.enquiriesUsed / currentUsage.enquiriesTotal) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="font-medium">Storage</h3>
                        <p className="text-sm text-muted-foreground">
                          {currentUsage.storageUsed} GB of {currentUsage.storageTotal} GB used
                        </p>
                      </div>
                      <span className="text-sm font-medium">
                        {Math.round((parseFloat(currentUsage.storageUsed) / parseFloat(currentUsage.storageTotal)) * 100)}%
                      </span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary" 
                        style={{ width: `${(parseFloat(currentUsage.storageUsed) / parseFloat(currentUsage.storageTotal)) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="font-medium">Customer Profiles</h3>
                        <p className="text-sm text-muted-foreground">
                          {currentUsage.activeCustomers} of {currentUsage.totalCustomers} active customers
                        </p>
                      </div>
                      <span className="text-sm font-medium">
                        {Math.round((currentUsage.activeCustomers / currentUsage.totalCustomers) * 100)}%
                      </span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary" 
                        style={{ width: `${(currentUsage.activeCustomers / currentUsage.totalCustomers) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 border-t pt-6">
                  <h3 className="font-medium mb-4">Usage Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Current Billing Period</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">Jul 1 - Jul 31, 2023</div>
                        <p className="text-xs text-muted-foreground mt-1">
                          <Clock className="h-3 w-3 inline mr-1" />
                          21 days remaining
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Additional Charges</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">$0.00</div>
                        <p className="text-xs text-muted-foreground mt-1">
                          No overage charges this month
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Projected Total</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">$99.00</div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Based on current usage
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">Download Usage Report</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 