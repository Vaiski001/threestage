import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Search,
  Filter,
  Check,
  X,
  Edit,
  Trash2,
  Eye,
  ArrowUpDown,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Company {
  id: string;
  name: string;
  industry: string;
  status: "active" | "pending" | "suspended";
  email: string;
  createdAt: string;
  contactPerson: string;
}

const CompanyManagement = () => {
  const { toast } = useToast();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data for companies
    const mockCompanies: Company[] = [
      {
        id: "1",
        name: "Tech Solutions Inc.",
        industry: "IT Services",
        status: "active",
        email: "contact@techsolutions.com",
        createdAt: "2023-01-15T10:30:00Z",
        contactPerson: "John Smith"
      },
      {
        id: "2",
        name: "DesignMasters Ltd.",
        industry: "Graphic Design",
        status: "active",
        email: "info@designmasters.com",
        createdAt: "2023-02-22T14:45:00Z",
        contactPerson: "Emma Johnson"
      },
      {
        id: "3",
        name: "Creative Hub Agency",
        industry: "Marketing",
        status: "pending",
        email: "hello@creativehub.com",
        createdAt: "2023-03-10T09:15:00Z",
        contactPerson: "Michael Brown"
      },
      {
        id: "4",
        name: "Global Consulting Group",
        industry: "Business Consulting",
        status: "active",
        email: "info@globalconsulting.com",
        createdAt: "2023-04-05T11:20:00Z",
        contactPerson: "Sarah Williams"
      },
      {
        id: "5",
        name: "Digital Innovators Co.",
        industry: "Software Development",
        status: "suspended",
        email: "support@digitalinnovators.com",
        createdAt: "2023-05-18T16:30:00Z",
        contactPerson: "David Chen"
      }
    ];

    setCompanies(mockCompanies);
    setLoading(false);
  }, []);

  const filteredCompanies = companies.filter(company => 
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const approveCompany = (id: string) => {
    setCompanies(companies.map(company => 
      company.id === id ? { ...company, status: "active" as const } : company
    ));
    
    toast({
      title: "Company approved",
      description: "The company has been approved successfully"
    });
  };

  const suspendCompany = (id: string) => {
    setCompanies(companies.map(company => 
      company.id === id ? { ...company, status: "suspended" as const } : company
    ));
    
    toast({
      title: "Company suspended",
      description: "The company has been suspended"
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
          <h1 className="text-3xl font-bold">Company Management</h1>
          <p className="text-muted-foreground">
            Manage company profiles, approvals, and account status
          </p>
        </div>
        <Button>
          Add Company
        </Button>
      </div>

      <div className="bg-background rounded-lg border p-4 mb-6">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search companies..."
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
              <TableHead className="w-[250px]">
                <div className="flex items-center gap-1">
                  Company Name
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
              <TableHead>Industry</TableHead>
              <TableHead>Contact Person</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCompanies.map((company) => (
              <TableRow key={company.id}>
                <TableCell className="font-medium">{company.name}</TableCell>
                <TableCell>{company.industry}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span>{company.contactPerson}</span>
                    <span className="text-xs text-muted-foreground">{company.email}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {company.status === "active" && (
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
                  )}
                  {company.status === "pending" && (
                    <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>
                  )}
                  {company.status === "suspended" && (
                    <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Suspended</Badge>
                  )}
                </TableCell>
                <TableCell>{formatDate(company.createdAt)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button size="icon" variant="ghost">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost">
                      <Edit className="h-4 w-4" />
                    </Button>
                    {company.status === "pending" && (
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={() => approveCompany(company.id)}
                      >
                        <Check className="h-4 w-4 text-green-600" />
                      </Button>
                    )}
                    {company.status === "active" && (
                      <Button 
                        size="icon" 
                        variant="ghost"
                        onClick={() => suspendCompany(company.id)}
                      >
                        <X className="h-4 w-4 text-red-600" />
                      </Button>
                    )}
                    {company.status === "suspended" && (
                      <Button 
                        size="icon" 
                        variant="ghost"
                        onClick={() => approveCompany(company.id)}
                      >
                        <Check className="h-4 w-4 text-green-600" />
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

export default CompanyManagement; 