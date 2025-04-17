import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Search,
  Filter,
  Check,
  X,
  Edit,
  Eye,
  ArrowUpDown,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Customer {
  id: string;
  name: string;
  email: string;
  status: "active" | "pending" | "inactive";
  createdAt: string;
  totalInquiries: number;
  lastActive: string;
}

const CustomerManagement = () => {
  const { toast } = useToast();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data for customers
    const mockCustomers: Customer[] = [
      {
        id: "1",
        name: "John Smith",
        email: "john.smith@example.com",
        status: "active",
        createdAt: "2023-01-10T09:30:00Z",
        totalInquiries: 12,
        lastActive: "2023-05-15T14:20:00Z"
      },
      {
        id: "2",
        name: "Emma Johnson",
        email: "emma.johnson@example.com",
        status: "active",
        createdAt: "2023-02-18T11:45:00Z",
        totalInquiries: 8,
        lastActive: "2023-05-18T10:15:00Z"
      },
      {
        id: "3",
        name: "Michael Brown",
        email: "michael.brown@example.com",
        status: "pending",
        createdAt: "2023-03-05T15:20:00Z",
        totalInquiries: 3,
        lastActive: "2023-04-20T16:30:00Z"
      },
      {
        id: "4",
        name: "Sarah Williams",
        email: "sarah.williams@example.com",
        status: "active",
        createdAt: "2023-03-22T08:10:00Z",
        totalInquiries: 15,
        lastActive: "2023-05-19T09:45:00Z"
      },
      {
        id: "5",
        name: "David Chen",
        email: "david.chen@example.com",
        status: "inactive",
        createdAt: "2023-04-12T13:40:00Z",
        totalInquiries: 6,
        lastActive: "2023-05-01T11:20:00Z"
      }
    ];

    setCustomers(mockCustomers);
    setLoading(false);
  }, []);

  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activateCustomer = (id: string) => {
    setCustomers(customers.map(customer => 
      customer.id === id ? { ...customer, status: "active" as const } : customer
    ));
    
    toast({
      title: "Customer activated",
      description: "The customer account has been activated successfully"
    });
  };

  const deactivateCustomer = (id: string) => {
    setCustomers(customers.map(customer => 
      customer.id === id ? { ...customer, status: "inactive" as const } : customer
    ));
    
    toast({
      title: "Customer deactivated",
      description: "The customer account has been deactivated"
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Customer Management</h1>
          <p className="text-muted-foreground">
            Manage customer accounts, activities, and status
          </p>
        </div>
        <Button>
          Add Customer
        </Button>
      </div>

      <div className="bg-background rounded-lg border p-4 mb-6">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search customers..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="flex gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>
      </div>

      <div className="rounded-md border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">
                <div className="flex items-center gap-1">
                  Customer Name
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Total Inquiries</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Active</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell className="font-medium">{customer.name}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.totalInquiries}</TableCell>
                <TableCell>
                  {customer.status === "active" && (
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
                  )}
                  {customer.status === "pending" && (
                    <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>
                  )}
                  {customer.status === "inactive" && (
                    <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Inactive</Badge>
                  )}
                </TableCell>
                <TableCell>{formatDate(customer.lastActive)}</TableCell>
                <TableCell>{formatDate(customer.createdAt)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button size="icon" variant="ghost">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost">
                      <Edit className="h-4 w-4" />
                    </Button>
                    {customer.status !== "active" && (
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={() => activateCustomer(customer.id)}
                      >
                        <Check className="h-4 w-4 text-green-600" />
                      </Button>
                    )}
                    {customer.status === "active" && (
                      <Button 
                        size="icon" 
                        variant="ghost"
                        onClick={() => deactivateCustomer(customer.id)}
                      >
                        <X className="h-4 w-4 text-red-600" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </AdminLayout>
  );
};

export default CustomerManagement; 