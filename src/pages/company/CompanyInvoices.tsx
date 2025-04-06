import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Search, Bell, Download, Filter, Plus, ArrowUpDown } from "lucide-react";
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
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CompanyInvoices() {
  const { toast } = useToast();
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Sample invoices data - in a real app, this would come from Supabase
  const invoices = [
    {
      id: "INV-001",
      customer: "Acme Corp",
      date: "2023-11-15",
      amount: "$2,500.00",
      status: "paid"
    },
    {
      id: "INV-002",
      customer: "Globex Inc",
      date: "2023-11-20",
      amount: "$1,800.00",
      status: "pending"
    },
    {
      id: "INV-003",
      customer: "Wayne Enterprises",
      date: "2023-11-25",
      amount: "$3,200.00",
      status: "overdue"
    },
  ];

  const stats = [
    { 
      title: "Total Revenue", 
      value: "$7,500.00", 
      description: "All time revenue",
      change: "+5.2%",
      changeType: "positive"
    },
    { 
      title: "Outstanding", 
      value: "$3,200.00", 
      description: "Awaiting payment",
      change: "-2.1%",
      changeType: "negative"
    },
    { 
      title: "Paid This Month", 
      value: "$4,300.00", 
      description: "Current month",
      change: "+12.5%",
      changeType: "positive"
    },
  ];

  const handleCreateInvoice = () => {
    toast({
      title: "Feature coming soon",
      description: "Invoice creation is coming soon."
    });
  };

  const handleDownloadInvoice = (id: string) => {
    toast({
      title: "Downloading invoice",
      description: `Invoice ${id} download initiated.`
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-950/30 dark:text-green-400">Paid</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-950/30 dark:text-yellow-400">Pending</Badge>;
      case "overdue":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-950/30 dark:text-red-400">Overdue</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const filteredInvoices = statusFilter === "all" 
    ? invoices 
    : invoices.filter(invoice => invoice.status === statusFilter);

  return (
    <AppLayout>
      <div className="flex-1 overflow-y-auto">
        <header className="h-16 border-b border-border flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold">Invoices</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search invoices..."
                className="pl-10 h-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Create Invoice
            </Button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="pt-8 pb-4 px-4 sm:px-6">
            <Container>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <div>
                  <h1 className="text-2xl font-semibold mb-1">Invoices</h1>
                  <p className="text-muted-foreground">Manage and track your company invoices</p>
                </div>
                <div className="flex gap-3">
                  <Button onClick={handleCreateInvoice}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Invoice
                  </Button>
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
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        stat.changeType === "positive" 
                          ? "text-green-700 bg-green-100 dark:text-green-400 dark:bg-green-950/30" 
                          : "text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-950/30"
                      }`}>
                        {stat.change}
                      </span>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="bg-card rounded-lg border shadow-sm mb-8">
                <div className="p-4 border-b border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <h2 className="text-lg font-medium">Invoice List</h2>
                  <div className="flex flex-wrap gap-3">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="overdue">Overdue</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      More Filters
                    </Button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">
                          <Button variant="ghost" size="sm" className="font-medium -ml-4 flex items-center">
                            Invoice ID
                            <ArrowUpDown className="h-4 w-4 ml-1" />
                          </Button>
                        </TableHead>
                        <TableHead>
                          <Button variant="ghost" size="sm" className="font-medium -ml-4 flex items-center">
                            Customer
                            <ArrowUpDown className="h-4 w-4 ml-1" />
                          </Button>
                        </TableHead>
                        <TableHead>
                          <Button variant="ghost" size="sm" className="font-medium -ml-4 flex items-center">
                            Date
                            <ArrowUpDown className="h-4 w-4 ml-1" />
                          </Button>
                        </TableHead>
                        <TableHead>
                          <Button variant="ghost" size="sm" className="font-medium -ml-4 flex items-center">
                            Amount
                            <ArrowUpDown className="h-4 w-4 ml-1" />
                          </Button>
                        </TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredInvoices.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8">
                            <p className="text-muted-foreground">No invoices found</p>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredInvoices.map((invoice) => (
                          <TableRow key={invoice.id}>
                            <TableCell className="font-medium">{invoice.id}</TableCell>
                            <TableCell>{invoice.customer}</TableCell>
                            <TableCell>{invoice.date}</TableCell>
                            <TableCell>{invoice.amount}</TableCell>
                            <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                            <TableCell className="text-right">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleDownloadInvoice(invoice.id)}
                              >
                                <Download className="h-4 w-4 mr-2" />
                                Download
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
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
            </Container>
          </div>
        </main>
      </div>
    </AppLayout>
  );
} 