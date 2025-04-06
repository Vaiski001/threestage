import { useState } from "react";
import { CreditCard, Download, MoreHorizontal, Plus, Search, Shield, ArrowUpRight, Filter, Calendar } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Container } from "@/components/ui/Container";

// Mock invoice data
const invoices = [
  {
    id: "INV-001",
    company: "Acme Construction",
    date: "Jan 15, 2024",
    amount: 2500.00,
    status: "paid",
    paymentMethod: "Credit Card"
  },
  {
    id: "INV-002",
    company: "BuildRight Solutions",
    date: "Dec 18, 2023",
    amount: 1875.50,
    status: "paid",
    paymentMethod: "Credit Card"
  },
  {
    id: "INV-003",
    company: "Elite Renovations",
    date: "Nov 30, 2023",
    amount: 3200.00,
    status: "paid",
    paymentMethod: "Bank Transfer"
  },
  {
    id: "INV-004",
    company: "Horizon Landscaping",
    date: "Oct 22, 2023",
    amount: 950.00,
    status: "paid",
    paymentMethod: "Credit Card"
  },
  {
    id: "INV-005",
    company: "City Plumbing Services",
    date: "Sep 15, 2023",
    amount: 420.75,
    status: "paid",
    paymentMethod: "Credit Card"
  }
];

// Mock payment methods
const paymentMethods = [
  {
    id: "pm-1",
    type: "card",
    name: "Visa ending in 4242",
    expiryDate: "09/2025",
    isDefault: true
  },
  {
    id: "pm-2",
    type: "card",
    name: "Mastercard ending in 8888",
    expiryDate: "12/2024",
    isDefault: false
  }
];

const CustomerBilling = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredInvoices = invoices.filter(invoice => 
    invoice.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    invoice.id.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <AppLayout pageTitle="Billing & Payments" showSearchBar={false}>
      <div className="flex-1 overflow-y-auto">
        <Container size="full" className="py-6">
          <div className="border-b">
            <div className="flex items-center p-4">
              <h1 className="text-xl font-semibold">Billing & Payments</h1>
            </div>
          </div>
          
          <div className="space-y-6 p-6">
            {/* Billing Summary Cards */}
            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$8,946.25</div>
                  <p className="text-xs text-muted-foreground">
                    Lifetime payments
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Payment Methods</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{paymentMethods.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Active payment methods
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" size="sm" className="gap-1 text-xs">
                    <Plus className="h-3.5 w-3.5" />
                    Add New
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Latest Invoice</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${invoices[0].amount.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">
                    {invoices[0].date} - {invoices[0].company}
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" size="sm" className="gap-1 text-xs">
                    <Download className="h-3.5 w-3.5" />
                    Download
                  </Button>
                </CardFooter>
              </Card>
            </div>
            
            <Tabs defaultValue="invoices">
              <TabsList>
                <TabsTrigger value="invoices">Invoices</TabsTrigger>
                <TabsTrigger value="payment-methods">Payment Methods</TabsTrigger>
                <TabsTrigger value="billing-address">Billing Address</TabsTrigger>
              </TabsList>
              
              <TabsContent value="invoices" className="mt-6">
                <div className="rounded-md border">
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search invoices..."
                          className="pl-8 w-[300px]"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                      <Button variant="outline" size="sm">
                        <Filter className="h-4 w-4 mr-2" />
                        Filter
                      </Button>
                    </div>
                    <div>
                      <Button variant="outline" size="sm">
                        <Calendar className="h-4 w-4 mr-2" />
                        Date Range
                      </Button>
                    </div>
                  </div>
                  
                  <ScrollArea className="max-h-[400px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Invoice</TableHead>
                          <TableHead>Company</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Payment Method</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredInvoices.map((invoice) => (
                          <TableRow key={invoice.id}>
                            <TableCell className="font-medium">{invoice.id}</TableCell>
                            <TableCell>{invoice.company}</TableCell>
                            <TableCell>{invoice.date}</TableCell>
                            <TableCell>${invoice.amount.toFixed(2)}</TableCell>
                            <TableCell>
                              <Badge variant={invoice.status === "paid" ? "outline" : "destructive"} className={invoice.status === "paid" ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}>
                                {invoice.status === "paid" ? "Paid" : "Unpaid"}
                              </Badge>
                            </TableCell>
                            <TableCell>{invoice.paymentMethod}</TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Actions</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>
                                    <Download className="h-4 w-4 mr-2" />
                                    Download PDF
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <ArrowUpRight className="h-4 w-4 mr-2" />
                                    View Details
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </div>
              </TabsContent>
              
              <TabsContent value="payment-methods" className="mt-6">
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Your Payment Methods</h3>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Payment Method
                    </Button>
                  </div>
                  
                  <div className="grid gap-4">
                    {paymentMethods.map((method) => (
                      <div key={method.id} className="flex items-center justify-between p-4 border rounded-md">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
                            <CreditCard className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{method.name}</p>
                            <p className="text-sm text-muted-foreground">Expires {method.expiryDate}</p>
                          </div>
                          {method.isDefault && (
                            <Badge variant="outline" className="ml-2">Default</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">Edit</Button>
                          {!method.isDefault && (
                            <Button variant="outline" size="sm">Set as Default</Button>
                          )}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">More options</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>Remove</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md flex gap-3">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                      <Shield className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Secure Payment Processing</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Your payment information is encrypted and securely stored. We never store your full 
                        card details on our servers.
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="billing-address" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Billing Address</CardTitle>
                    <CardDescription>
                      This address will be used on your invoices and receipts.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1">
                      <p className="font-medium">John Doe</p>
                      <p className="text-muted-foreground">123 Main Street</p>
                      <p className="text-muted-foreground">Apt 4B</p>
                      <p className="text-muted-foreground">New York, NY 10001</p>
                      <p className="text-muted-foreground">United States</p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline">Edit Address</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
            
            <Separator />
            
            <div>
              <h3 className="text-lg font-medium mb-2">Need Help?</h3>
              <p className="text-muted-foreground mb-4">
                If you have any questions about your billing or payments, our support team is here to help.
              </p>
              <Button variant="outline">Contact Support</Button>
            </div>
          </div>
        </Container>
      </div>
    </AppLayout>
  );
};

export default CustomerBilling; 