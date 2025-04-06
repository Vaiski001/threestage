import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Search, Filter, Bell, Download, Plus, Mail, Phone, MapPin, Users, Building, MoreHorizontal, BarChart, Heart } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
import { Textarea } from "@/components/ui/textarea";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

// Demo data - this will always be available
const customers = [
  {
    id: "cust-001",
    name: "John Doe",
    email: "john@example.com",
    status: "active",
    phone: "+1 (555) 123-4567",
    avatar: "https://randomuser.me/api/portraits/men/22.jpg",
    company: "Acme Inc",
    lastContact: "2 days ago",
    lifetime: "$4,250.00",
    tags: ["Premium", "Enterprise"],
    enquiries: 8
  },
  {
    id: "cust-002",
    name: "Jane Smith",
    email: "jane@example.com",
    status: "active",
    phone: "+1 (555) 987-6543",
    avatar: "https://randomuser.me/api/portraits/women/17.jpg",
    company: "Globex Co",
    lastContact: "Today",
    lifetime: "$2,100.00",
    tags: ["Premium"],
    enquiries: 5
  },
  {
    id: "cust-003",
    name: "Robert Johnson",
    email: "robert@example.com",
    status: "inactive",
    phone: "+1 (555) 456-7890",
    avatar: "https://randomuser.me/api/portraits/men/83.jpg",
    company: "ABC Corp",
    lastContact: "1 month ago",
    lifetime: "$750.00",
    tags: ["Basic"],
    enquiries: 2
  },
  {
    id: "cust-004",
    name: "Emily Davis",
    email: "emily@example.com",
    status: "new",
    phone: "+1 (555) 234-5678",
    avatar: "https://randomuser.me/api/portraits/women/28.jpg", 
    company: "XYZ Ltd",
    lastContact: "Just now",
    lifetime: "$0.00",
    tags: ["Trial"],
    enquiries: 1
  },
  {
    id: "cust-005",
    name: "Michael Brown",
    email: "michael@example.com",
    status: "active",
    phone: "+1 (555) 777-8888",
    avatar: "https://randomuser.me/api/portraits/men/54.jpg",
    company: "Tech Solutions",
    lastContact: "Yesterday",
    lifetime: "$3,750.00",
    tags: ["Premium", "Enterprise"],
    enquiries: 7
  },
  {
    id: "cust-006",
    name: "Sarah Wilson",
    email: "sarah@example.com",
    status: "active",
    phone: "+1 (555) 222-3333",
    avatar: "https://randomuser.me/api/portraits/women/67.jpg",
    company: "Wilson Consulting",
    lastContact: "3 days ago",
    lifetime: "$5,800.00",
    tags: ["Enterprise"],
    enquiries: 12
  }
];

// Simple component that has no dependencies on React Router
export default function DemoCustomerManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterValue, setFilterValue] = useState("all");

  // Helper functions for display
  const getAvatarFallback = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>;
      case "inactive":
        return <Badge variant="outline">Inactive</Badge>;
      case "new":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">New</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const stats = [
    { 
      title: "Total Customers", 
      value: "57", 
      change: "+12%", 
      changeType: "positive",
      icon: <Users className="h-5 w-5 text-primary" />
    },
    { 
      title: "Active Subscriptions", 
      value: "42", 
      change: "+8%", 
      changeType: "positive",
      icon: <Heart className="h-5 w-5 text-rose-500" />
    },
    { 
      title: "Total Revenue", 
      value: "$38.2K", 
      change: "+16%", 
      changeType: "positive",
      icon: <BarChart className="h-5 w-5 text-emerald-500" />
    }
  ];

  return (
    <AppLayout>
      <div className="flex-1 overflow-y-auto">
        <main className="p-6">
          <Container>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="text-2xl font-semibold mb-1">Customer Management</h1>
                <p className="text-muted-foreground">View and manage your customer relationships</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search customers..."
                    className="pl-10 h-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={filterValue} onValueChange={setFilterValue}>
                  <SelectTrigger className="w-[180px] h-9">
                    <SelectValue placeholder="Filter customers" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Customers</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="new">New</SelectItem>
                  </SelectContent>
                </Select>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Customer
                </Button>
              </div>
            </div>

            {/* Stats display */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {stats.map((stat, index) => (
                <Card key={index}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div>
                      <CardTitle className="text-xl">{stat.value}</CardTitle>
                      <CardDescription>{stat.title}</CardDescription>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      {stat.icon}
                    </div>
                  </CardHeader>
                  <CardFooter>
                    <span className="text-xs px-2 py-1 rounded-full text-green-700 bg-green-100 dark:text-green-400 dark:bg-green-950/30">
                      {stat.change} from last month
                    </span>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {/* Customer list */}
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <CardTitle>Customer List</CardTitle>
                    <CardDescription>View and manage your customers</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[250px]">Customer</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Lifetime Value</TableHead>
                      <TableHead>Last Contact</TableHead>
                      <TableHead>Tags</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customers.map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={customer.avatar} alt={customer.name} />
                              <AvatarFallback>{getAvatarFallback(customer.name)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{customer.name}</div>
                              <div className="text-sm text-muted-foreground">{customer.company}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(customer.status)}</TableCell>
                        <TableCell>{customer.lifetime}</TableCell>
                        <TableCell>{customer.lastContact}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {customer.tags.map((tag, i) => (
                              <Badge key={i} variant="outline">{tag}</Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                            >
                              View
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 p-0"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </Container>
        </main>
      </div>
    </AppLayout>
  );
} 