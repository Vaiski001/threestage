import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  Search, 
  Bell, 
  Users, 
  UserPlus, 
  Filter, 
  Download, 
  Mail, 
  Phone, 
  MoreHorizontal, 
  MessageSquare,
  Calendar,
  ArrowUpDown,
  ChevronDown,
  Heart,
  BarChart2,
  Plus
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { CustomerCard } from "@/components/company/CustomerCard";

// Static example content that can be rendered directly
const staticCustomers = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    status: "Active",
    phone: "+1 (555) 123-4567",
    company: "Acme Inc",
    lastContact: "2 days ago",
    lifetime: "$4,250.00",
    tags: ["Premium", "Enterprise"]
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    status: "Active",
    phone: "+1 (555) 987-6543",
    company: "Globex Co",
    lastContact: "Today",
    lifetime: "$2,100.00",
    tags: ["Premium"]
  },
  {
    id: 3,
    name: "Robert Johnson",
    email: "robert@example.com",
    status: "Inactive",
    phone: "+1 (555) 456-7890",
    company: "ABC Corp",
    lastContact: "1 month ago",
    lifetime: "$750.00",
    tags: ["Basic"]
  },
  {
    id: 4,
    name: "Emily Davis",
    email: "emily@example.com",
    status: "New",
    phone: "+1 (555) 234-5678",
    company: "XYZ Ltd",
    lastContact: "Just now",
    lifetime: "$0.00",
    tags: ["Trial"]
  }
];

export default function CompanyCustomers() {
  // Check if we should force the use of static content
  if (window.location.search.includes('static=true')) {
    return (
      <AppLayout>
        <header className="h-16 border-b border-border flex items-center px-4">
          <h1 className="ml-4 text-lg font-semibold">Customer Management</h1>
        </header>

        <main className="p-6">
          <Container>
            <div className="flex flex-col gap-8">
              <div>
                <h1 className="text-2xl font-semibold mb-1">Customers</h1>
                <p className="text-muted-foreground">Manage your customer relationships</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>57</CardTitle>
                    <CardDescription>Total Customers</CardDescription>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>42</CardTitle>
                    <CardDescription>Active Customers</CardDescription>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>$38.2K</CardTitle>
                    <CardDescription>Total Revenue</CardDescription>
                  </CardHeader>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Customer List</CardTitle>
                  <CardDescription>View and manage your customers</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Customer</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Last Contact</TableHead>
                        <TableHead>Lifetime Value</TableHead>
                        <TableHead>Tags</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {staticCustomers.map(customer => (
                        <TableRow key={customer.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarFallback>{customer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{customer.name}</div>
                                <div className="text-sm text-muted-foreground">{customer.company}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{customer.status}</TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              <div className="text-sm">{customer.email}</div>
                              <div className="text-sm text-muted-foreground">{customer.phone}</div>
                            </div>
                          </TableCell>
                          <TableCell>{customer.lastContact}</TableCell>
                          <TableCell>{customer.lifetime}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {customer.tags.map((tag, idx) => (
                                <Badge key={idx} variant="outline">{tag}</Badge>
                              ))}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </Container>
        </main>
      </AppLayout>
    );
  }
  
  // Original component continues here
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("all");
  const [newCustomerDialog, setNewCustomerDialog] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [customerData, setCustomerData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  
  // Sample customers data - in a real app, this would come from Supabase
  const sampleCustomers = [
    {
      id: "cust-001",
      name: "John Doe",
      email: "john@example.com",
      status: "active",
      phone: "+1 (555) 123-4567",
      avatar: "/avatars/john.jpg",
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
      avatar: "/avatars/jane.jpg",
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
      avatar: "/avatars/robert.jpg",
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
      avatar: "/avatars/emily.jpg", 
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
      avatar: "/avatars/michael.jpg",
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
      avatar: "/avatars/sarah.jpg",
      company: "Wilson Consulting",
      lastContact: "3 days ago",
      lifetime: "$5,800.00",
      tags: ["Enterprise"],
      enquiries: 12
    }
  ];
  
  // Load customer data or use sample data in development/preview mode
  useEffect(() => {
    // In development mode, immediately set the data
    if (import.meta.env.DEV) {
      setCustomerData({
        customers: sampleCustomers
      });
      setIsLoading(false);
      return;
    }
    
    // For production, simulate API call delay
    const timer = setTimeout(() => {
      // In production, we would fetch real data from Supabase here
      setCustomerData({
        customers: sampleCustomers
      });
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Use sample or loaded data
  const customers = customerData?.customers || [];

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
      icon: <BarChart2 className="h-5 w-5 text-emerald-500" />
    }
  ];
  
  const handleAddCustomer = () => {
    toast({
      title: "Feature coming soon",
      description: "Adding customers manually will be available soon."
    });
    setNewCustomerDialog(false);
  };

  const handleExportCustomers = () => {
    toast({
      title: "Exporting customers",
      description: "Customer data export started."
    });
  };

  const handleViewCustomer = (customer) => {
    setSelectedCustomer(customer);
    setDetailsOpen(true);
  };

  const handleViewProfile = (id: string) => {
    const customer = customers.find(c => c.id === id);
    if (customer) {
      handleViewCustomer(customer);
    } else {
      toast({
        title: "Customer not found",
        description: "Could not find customer details."
      });
    }
  };

  const handleContactCustomer = (id: string, method: string) => {
    toast({
      title: `Contacting via ${method}`,
      description: `Opening ${method} to contact customer.`
    });
  };

  const handleUpdateStatus = (id: string, status: string) => {
    toast({
      title: "Status updated",
      description: `Customer status updated to ${status}.`
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-950/30 dark:text-green-400">Active</Badge>;
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100 dark:bg-gray-800/30 dark:text-gray-400">Inactive</Badge>;
      case "new":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-950/30 dark:text-blue-400">New</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getAvatarFallback = (name: string) => {
    if (!name) return "?";
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  // Sample avatar images for development
  const devAvatars = {
    "John Doe": "https://randomuser.me/api/portraits/men/22.jpg",
    "Jane Smith": "https://randomuser.me/api/portraits/women/17.jpg",
    "Robert Johnson": "https://randomuser.me/api/portraits/men/83.jpg",
    "Emily Davis": "https://randomuser.me/api/portraits/women/28.jpg",
    "Michael Brown": "https://randomuser.me/api/portraits/men/54.jpg",
    "Sarah Wilson": "https://randomuser.me/api/portraits/women/67.jpg"
  };

  const getAvatarSrc = (customer) => {
    // In development, use randomuser.me images
    if (import.meta.env.DEV) {
      return devAvatars[customer.name] || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(customer.name)}`;
    }
    // In production, use the real avatar path
    return customer.avatar;
  };

  // Filter customers based on status and tabs
  const filteredCustomers = customers.filter(
    (customer) =>
      (filter === "all" || 
       (filter === "active" && (customer.lastActive.includes("hour") || customer.lastActive === "Just now")) ||
       (filter === "inactive" && (customer.lastActive.includes("day") || customer.lastActive.includes("week"))))
  );

  // In the render code, handle loading state
  if (isLoading) {
    return (
      <AppLayout>
        <header className="h-16 border-b border-border flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-4">
          </div>
        </header>
        <main className="flex-1 overflow-y-auto">
          <div className="pt-8 pb-4 px-4 sm:px-6">
            <Container>
              <div className="flex flex-col items-center justify-center h-[60vh]">
                <div className="animate-pulse flex flex-col items-center">
                  <div className="h-12 w-12 bg-primary/10 rounded-full mb-4"></div>
                  <div className="h-6 w-48 bg-primary/10 rounded mb-2"></div>
                  <div className="h-4 w-64 bg-primary/10 rounded"></div>
                </div>
              </div>
            </Container>
          </div>
        </main>
      </AppLayout>
    );
  }

  const handleSearch = (query: string) => {
    setSearchTerm(query);
  };

  const filteredCustomersBySearch = filteredCustomers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AppLayout 
      pageTitle="Customer Management" 
      searchPlaceholder="Search customers..." 
      onSearch={handleSearch}
    >
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Customer Management</h1>
          <p className="text-gray-500">Manage your customers and their enquiries</p>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Filter size={16} />
              Filter
            </Button>
            <select
              className="border border-gray-300 rounded-md p-1 text-sm"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Customers</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <Button className="flex items-center gap-1">
            <Plus size={16} />
            Add Customer
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCustomersBySearch.map((customer) => (
            <CustomerCard key={customer.id} customer={customer} />
          ))}
        </div>

        {filteredCustomersBySearch.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500">No customers found</p>
          </div>
        )}
      </div>

      {/* Customer Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        {selectedCustomer && (
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>Customer Details</DialogTitle>
              <DialogDescription>
                View and manage customer information
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="col-span-1">
                <div className="flex flex-col items-center space-y-3">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={getAvatarSrc(selectedCustomer)} alt={selectedCustomer.name} />
                    <AvatarFallback className="text-2xl">{getAvatarFallback(selectedCustomer.name)}</AvatarFallback>
                  </Avatar>
                  <div className="text-center">
                    <h3 className="font-medium text-lg">{selectedCustomer.name}</h3>
                    <p className="text-sm text-muted-foreground">{selectedCustomer.company}</p>
                    <div className="flex justify-center mt-2">
                      {getStatusBadge(selectedCustomer.status)}
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            size="icon" 
                            variant="outline"
                            onClick={() => handleContactCustomer(selectedCustomer.id, 'email')}
                          >
                            <Mail className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Email</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            size="icon" 
                            variant="outline"
                            onClick={() => handleContactCustomer(selectedCustomer.id, 'phone')}
                          >
                            <Phone className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Call</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            size="icon" 
                            variant="outline"
                            onClick={() => handleContactCustomer(selectedCustomer.id, 'message')}
                          >
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Message</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              </div>
              
              <div className="col-span-2">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Contact Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Email</p>
                        <p>{selectedCustomer.email}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Phone</p>
                        <p>{selectedCustomer.phone}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Business Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Company</p>
                        <p>{selectedCustomer.company}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Lifetime Value</p>
                        <p>{selectedCustomer.lifetime}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedCustomer.tags.map((tag, i) => (
                        <Badge key={i} variant="secondary">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Activity</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Last Contact</p>
                        <p>{selectedCustomer.lastContact}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Total Enquiries</p>
                        <p>{selectedCustomer.enquiries}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h3 className="text-sm font-medium mb-2">Recent Activity</h3>
              <div className="space-y-3">
                {[
                  { action: "Submitted enquiry", date: "2 days ago", type: "enquiry" },
                  { action: "Made payment", date: "1 week ago", type: "payment" },
                  { action: "Updated contact info", date: "2 weeks ago", type: "update" }
                ].map((activity, i) => (
                  <div key={i} className="flex justify-between items-center p-2 text-sm rounded-md bg-muted/50">
                    <span>{activity.action}</span>
                    <span className="text-xs text-muted-foreground">{activity.date}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setDetailsOpen(false)}>
                Close
              </Button>
              <Button>
                Edit Customer
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </AppLayout>
  );
} 