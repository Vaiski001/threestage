import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  Search, 
  Bell, 
  CreditCard, 
  Building, 
  Plus, 
  ExternalLink, 
  ArrowDownUp, 
  ArrowUpDown,
  Info
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CompanyPayments() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("transactions");
  const [newPaymentOpen, setNewPaymentOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Sample data - in a real app, this would come from Supabase
  const paymentMethods = [
    {
      id: "pm-001",
      type: "card",
      name: "Company Visa",
      last4: "4242",
      expiry: "05/25",
      isDefault: true
    },
    {
      id: "pm-002",
      type: "bank",
      name: "Business Checking",
      last4: "6789",
      bank: "Chase",
      isDefault: false
    }
  ];
  
  const transactions = [
    {
      id: "tx-001",
      date: "2023-11-15",
      description: "Customer payment - Acme Corp",
      amount: "$2,500.00",
      type: "credit",
      status: "completed"
    },
    {
      id: "tx-002",
      date: "2023-11-12",
      description: "Subscription - Pro Plan",
      amount: "$99.00",
      type: "debit",
      status: "completed"
    },
    {
      id: "tx-003",
      date: "2023-11-08",
      description: "Customer payment - Globex Inc",
      amount: "$1,800.00",
      type: "credit",
      status: "completed"
    },
    {
      id: "tx-004",
      date: "2023-11-05",
      description: "Customer payment - Wayne Enterprises",
      amount: "$3,200.00",
      type: "credit",
      status: "pending"
    }
  ];

  const stats = [
    { 
      title: "Available Balance", 
      value: "$7,401.00", 
      description: "Current available funds"
    },
    { 
      title: "Pending", 
      value: "$3,200.00", 
      description: "Pending transactions"
    },
    { 
      title: "Monthly Revenue", 
      value: "$7,500.00", 
      description: "Last 30 days",
      change: "+12.5%",
      changeType: "positive"
    }
  ];

  const handleAddPaymentMethod = () => {
    toast({
      title: "Feature coming soon",
      description: "Adding payment methods is coming soon."
    });
    setNewPaymentOpen(false);
  };

  const handleMakeDefault = (id: string) => {
    toast({
      title: "Payment method updated",
      description: `Payment method set as default.`
    });
  };

  const handleDeletePaymentMethod = (id: string) => {
    toast({
      title: "Payment method removed",
      description: `Payment method has been removed.`
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-950/30 dark:text-green-400">Completed</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-950/30 dark:text-yellow-400">Pending</Badge>;
      case "failed":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-950/30 dark:text-red-400">Failed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getPaymentMethodIcon = (type: string) => {
    switch (type) {
      case "card":
        return <CreditCard className="h-10 w-10 text-primary" />;
      case "bank":
        return <Building className="h-10 w-10 text-primary" />;
      default:
        return <CreditCard className="h-10 w-10 text-primary" />;
    }
  };

  return (
    <AppLayout>
      <div className="flex-1 overflow-y-auto">
        <header className="h-16 border-b border-border flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold">Payments</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search payments..."
                className="pl-10 h-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Payment
            </Button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="pt-8 pb-4 px-4 sm:px-6">
            <Container>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <div>
                  <h1 className="text-2xl font-semibold mb-1">Payments</h1>
                  <p className="text-muted-foreground">Manage payment methods and transaction history</p>
                </div>
                <div className="flex gap-3">
                  <Dialog open={newPaymentOpen} onOpenChange={setNewPaymentOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Payment Method
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Payment Method</DialogTitle>
                        <DialogDescription>
                          Add a new payment method to your account.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="paymentType">Payment Type</Label>
                          <Select defaultValue="card">
                            <SelectTrigger>
                              <SelectValue placeholder="Select payment type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="card">Credit/Debit Card</SelectItem>
                              <SelectItem value="bank">Bank Account</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="name">Name</Label>
                          <Input id="name" placeholder="Card/Account Name" />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="number">Card Number</Label>
                          <Input id="number" placeholder="•••• •••• •••• ••••" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="expiry">Expiration Date</Label>
                            <Input id="expiry" placeholder="MM/YY" />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="cvc">CVC</Label>
                            <Input id="cvc" placeholder="•••" />
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setNewPaymentOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="button" onClick={handleAddPaymentMethod}>
                          Add Payment Method
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {stats.map((stat, index) => (
                  <Card key={index}>
                    <CardHeader className="pb-2">
                      <CardDescription>{stat.description}</CardDescription>
                      <CardTitle className="text-2xl">{stat.value}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {stat.change && (
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          stat.changeType === "positive" 
                            ? "text-green-700 bg-green-100 dark:text-green-400 dark:bg-green-950/30" 
                            : "text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-950/30"
                        }`}>
                          {stat.change}
                        </span>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full max-w-md grid-cols-2">
                  <TabsTrigger value="transactions">
                    <ArrowDownUp className="h-4 w-4 mr-2" />
                    Transactions
                  </TabsTrigger>
                  <TabsTrigger value="methods">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Payment Methods
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="transactions" className="mt-6">
                  <div className="bg-card rounded-lg border shadow-sm">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[120px]">
                              <Button variant="ghost" size="sm" className="font-medium -ml-4 flex items-center">
                                Date
                                <ArrowUpDown className="h-4 w-4 ml-1" />
                              </Button>
                            </TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>
                              <Button variant="ghost" size="sm" className="font-medium -ml-4 flex items-center">
                                Amount
                                <ArrowUpDown className="h-4 w-4 ml-1" />
                              </Button>
                            </TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Details</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {transactions.map((transaction) => (
                            <TableRow key={transaction.id}>
                              <TableCell>{transaction.date}</TableCell>
                              <TableCell className="font-medium">{transaction.description}</TableCell>
                              <TableCell className={transaction.type === 'credit' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                                {transaction.type === 'credit' ? '+' : '-'}{transaction.amount}
                              </TableCell>
                              <TableCell className="capitalize">{transaction.type}</TableCell>
                              <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                              <TableCell className="text-right">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => toast({
                                    title: "Feature coming soon",
                                    description: "Transaction details view is coming soon."
                                  })}
                                >
                                  <ExternalLink className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    <div className="p-4 border-t border-border">
                      <Pagination>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious href="#" />
                          </PaginationItem>
                          <PaginationItem>
                            <PaginationLink href="#" isActive>1</PaginationLink>
                          </PaginationItem>
                          <PaginationItem>
                            <PaginationNext href="#" />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="methods" className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {paymentMethods.map((method) => (
                      <Card key={method.id} className="relative">
                        {method.isDefault && (
                          <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                            Default
                          </span>
                        )}
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            {getPaymentMethodIcon(method.type)}
                            <div className="flex gap-1">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleMakeDefault(method.id)}
                                disabled={method.isDefault}
                              >
                                Make Default
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-destructive hover:text-destructive"
                                onClick={() => handleDeletePaymentMethod(method.id)}
                                disabled={method.isDefault}
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                          <CardTitle>{method.name}</CardTitle>
                          <CardDescription>
                            {method.type === 'card' 
                              ? `•••• ${method.last4} - Expires ${method.expiry}` 
                              : `${method.bank} - •••• ${method.last4}`}
                          </CardDescription>
                        </CardHeader>
                        <CardFooter>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Info className="h-4 w-4 mr-1" />
                            {method.type === 'card' 
                              ? 'Card information is securely stored' 
                              : 'Bank account is securely stored'}
                          </div>
                        </CardFooter>
                      </Card>
                    ))}
                    <Card className="flex items-center justify-center p-6 border-dashed cursor-pointer hover:bg-muted/50 transition-colors">
                      <Dialog open={newPaymentOpen} onOpenChange={setNewPaymentOpen}>
                        <DialogTrigger asChild>
                          <div className="text-center">
                            <Plus className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
                            <p className="font-medium">Add New Payment Method</p>
                            <p className="text-muted-foreground text-sm">Credit card, bank account, etc.</p>
                          </div>
                        </DialogTrigger>
                      </Dialog>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </Container>
          </div>
        </main>
      </div>
    </AppLayout>
  );
} 