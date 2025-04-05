import { useState, useEffect } from "react";
import { KanbanColumn } from "./KanbanColumn";
import { Container } from "@/components/ui/Container";
import { Plus, Filter, PlusCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCompanyEnquiries, getCustomerEnquiries, updateEnquiryStatus } from "@/lib/supabase/submissions";
import { Enquiry } from "@/lib/supabase/types";
import { EnquiryStats } from "./EnquiryStats";
import { Input } from "@/components/ui/input";

// Sample data for demo purposes
const sampleCompanyEnquiries: Record<string, Enquiry[]> = {
  new: [
    {
      id: "1",
      title: "Product Enquiry",
      customer_name: "John Smith",
      customer_email: "john@example.com",
      company_id: "demo-company",
      created_at: "2023-05-15",
      form_name: "Website",
      content: "I'm interested in your premium package. Could you provide more details?",
      status: "new",
      priority: "high"
    },
    {
      id: "2",
      title: "Service Question",
      customer_name: "Emma Johnson",
      customer_email: "emma@example.com",
      company_id: "demo-company",
      created_at: "2023-05-16",
      form_name: "WhatsApp",
      content: "Do you offer same-day delivery for your services?",
      status: "new",
      priority: "medium"
    },
    {
      id: "3",
      title: "Pricing Information",
      customer_name: "Michael Brown",
      customer_email: "michael@example.com",
      company_id: "demo-company",
      created_at: "2023-05-17",
      form_name: "Facebook",
      content: "What are your current rates for ongoing support?",
      status: "new",
      priority: "low"
    }
  ],
  pending: [
    {
      id: "4",
      title: "Refund Request",
      customer_name: "Sarah Wilson",
      customer_email: "sarah@example.com",
      company_id: "demo-company",
      created_at: "2023-05-10",
      form_name: "Instagram",
      content: "I'd like to request a refund for my recent purchase.",
      status: "pending",
      priority: "high"
    },
    {
      id: "5",
      title: "Technical Support",
      customer_name: "David Lee",
      customer_email: "david@example.com",
      company_id: "demo-company",
      created_at: "2023-05-12",
      form_name: "Website",
      content: "I'm having trouble with the login functionality.",
      status: "pending",
      priority: "medium"
    },
    {
      id: "6",
      title: "Account Upgrade",
      customer_name: "Jennifer Taylor",
      customer_email: "jennifer@example.com",
      company_id: "demo-company",
      created_at: "2023-05-13",
      form_name: "Website",
      content: "I would like to upgrade my account to the premium plan.",
      status: "pending",
      priority: "low"
    },
    {
      id: "7",
      title: "Shipping Inquiry",
      customer_name: "Robert Clark",
      customer_email: "robert@example.com",
      company_id: "demo-company",
      created_at: "2023-05-14",
      form_name: "Facebook",
      content: "When can I expect my order to be shipped?",
      status: "pending",
      priority: "medium"
    }
  ],
  completed: [
    {
      id: "8",
      title: "Order Confirmation",
      customer_name: "Jennifer Taylor",
      customer_email: "jennifer@example.com",
      company_id: "demo-company",
      created_at: "2023-05-05",
      form_name: "Website",
      content: "Thank you for confirming my order details.",
      status: "completed",
      priority: "medium"
    },
    {
      id: "9",
      title: "Feature Request",
      customer_name: "Robert Martin",
      customer_email: "robert@example.com",
      company_id: "demo-company",
      created_at: "2023-05-07",
      form_name: "WhatsApp",
      content: "I suggested a new feature and appreciate your response.",
      status: "completed",
      priority: "low"
    },
    {
      id: "10",
      title: "Partnership Inquiry",
      customer_name: "Olivia Williams",
      customer_email: "olivia@example.com",
      company_id: "demo-company",
      created_at: "2023-05-08",
      form_name: "Facebook",
      content: "Thank you for the information about your partnership program.",
      status: "completed",
      priority: "high"
    },
    {
      id: "11",
      title: "Consultation Booking",
      customer_name: "Daniel Johnson",
      customer_email: "daniel@example.com",
      company_id: "demo-company",
      created_at: "2023-05-09",
      form_name: "Website",
      content: "I've booked a consultation for next Tuesday. Thank you.",
      status: "completed",
      priority: "medium"
    }
  ]
};

// Sample customer enquiries for demo
const sampleCustomerEnquiries: Record<string, Enquiry[]> = {
  new: [
    {
      id: "1",
      title: "Website Redesign",
      customer_name: "Demo Customer",
      customer_email: "demo@example.com",
      company_id: "acme-design",
      created_at: "2023-06-15",
      form_name: "Website",
      content: "I need a complete redesign of my company website with modern design principles.",
      status: "new",
      priority: "high"
    },
    {
      id: "2",
      title: "Social Media Management",
      customer_name: "Demo Customer",
      customer_email: "demo@example.com",
      company_id: "global-marketing",
      created_at: "2023-06-18",
      form_name: "Instagram",
      content: "Looking for a social media management package for my small business.",
      status: "new",
      priority: "medium"
    }
  ],
  pending: [
    {
      id: "3",
      title: "IT Support Package",
      customer_name: "Demo Customer",
      customer_email: "demo@example.com",
      company_id: "techsolutions-inc",
      created_at: "2023-06-10",
      form_name: "Website",
      content: "I'm exploring your IT support packages for a team of 15 people.",
      status: "pending",
      priority: "medium"
    },
    {
      id: "4",
      title: "Logo Design",
      customer_name: "Demo Customer",
      customer_email: "demo@example.com",
      company_id: "acme-design",
      created_at: "2023-06-12",
      form_name: "WhatsApp",
      content: "Need a new logo designed for my startup.",
      status: "pending",
      priority: "high"
    }
  ],
  completed: [
    {
      id: "5",
      title: "Email Marketing Setup",
      customer_name: "Demo Customer",
      customer_email: "demo@example.com",
      company_id: "global-marketing",
      created_at: "2023-05-25",
      form_name: "Website",
      content: "Thanks for setting up my email marketing campaign.",
      status: "completed",
      priority: "medium"
    },
    {
      id: "6",
      title: "Server Maintenance",
      customer_name: "Demo Customer",
      customer_email: "demo@example.com",
      company_id: "techsolutions-inc",
      created_at: "2023-05-28",
      form_name: "Facebook",
      content: "Thank you for the server maintenance and optimization.",
      status: "completed",
      priority: "low"
    },
    {
      id: "7",
      title: "Business Card Design",
      customer_name: "Demo Customer",
      customer_email: "demo@example.com",
      company_id: "acme-design",
      created_at: "2023-06-02",
      form_name: "Website",
      content: "I love the business cards you designed. Thank you!",
      status: "completed",
      priority: "low"
    }
  ]
};

export interface KanbanBoardProps {
  isDemo?: boolean;
  readOnly?: boolean;
  isCompanyView?: boolean;
  height?: string;
  searchQuery?: string;
}

export function KanbanBoard({ 
  isDemo = false, 
  readOnly = false, 
  isCompanyView = false,
  height,
  searchQuery = ""
}: KanbanBoardProps) {
  const [enquiries, setEnquiries] = useState<Record<string, Enquiry[]>>({
    new: [],
    pending: [],
    completed: []
  });
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Track the item being dragged
  const [draggedItemData, setDraggedItemData] = useState<{id: string, fromColumn: string} | null>(null);

  // Fetch enquiries based on user role
  const { data: fetchedEnquiries, isLoading } = useQuery({
    queryKey: ['enquiries', user?.id, profile?.role],
    queryFn: async () => {
      if (isDemo) {
        // For demo, return different data based on the view
        return isCompanyView ? sampleCompanyEnquiries : sampleCustomerEnquiries;
      }
      
      if (!user) return null;
      
      try {
        let result: Enquiry[] = [];
        
        if (profile?.role === 'company') {
          result = await getCompanyEnquiries(user.id) as Enquiry[];
        } else {
          // Assuming customer email is stored in profile or user object
          const email = profile?.email || user.email;
          if (email) {
            result = await getCustomerEnquiries(email) as Enquiry[];
          }
        }
        
        return result;
      } catch (error) {
        console.error("Error fetching enquiries:", error);
        toast({
          title: "Error",
          description: "Failed to load enquiries. Please try again.",
          variant: "destructive"
        });
        return null;
      }
    },
    enabled: !isDemo && !!user?.id
  });

  // Group enquiries by status
  useEffect(() => {
    if (isDemo) {
      // For demo, use the predefined sample data
      setEnquiries(isCompanyView ? sampleCompanyEnquiries : sampleCustomerEnquiries);
      return;
    }
    
    if (fetchedEnquiries) {
      // Check if fetchedEnquiries is the grouped object or an array
      if (Array.isArray(fetchedEnquiries)) {
        const grouped: Record<string, Enquiry[]> = {
          new: fetchedEnquiries.filter(e => e.status === 'new'),
          pending: fetchedEnquiries.filter(e => e.status === 'pending'),
          completed: fetchedEnquiries.filter(e => e.status === 'completed')
        };
        setEnquiries(grouped);
      } else {
        // It's already grouped
        setEnquiries(fetchedEnquiries as Record<string, Enquiry[]>);
      }
    }
  }, [fetchedEnquiries, isDemo, isCompanyView]);

  // Update enquiry status mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ enquiryId, newStatus }: { enquiryId: string, newStatus: 'new' | 'pending' | 'completed' }) => 
      updateEnquiryStatus(enquiryId, newStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enquiries'] });
      toast({
        title: "Status Updated",
        description: "Enquiry status has been updated successfully."
      });
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update status. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Handle drag start
  const handleDragStart = (e: React.DragEvent, id: string, fromColumn: string) => {
    if (readOnly) return;
    
    e.dataTransfer.setData("id", id);
    e.dataTransfer.setData("fromColumn", fromColumn);
    setDraggedItemData({ id, fromColumn });
  };

  // Handle drag over
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Handle drop in a column
  const handleDrop = (e: React.DragEvent, toColumn: "new" | "pending" | "completed") => {
    e.preventDefault();
    if (readOnly) return;
    
    if (draggedItemData) {
      const { id, fromColumn } = draggedItemData;
      
      if (fromColumn === toColumn) return;
      
      // Move the enquiry from the source column to the target column
      const updatedEnquiries = { ...enquiries };
      const enquiryIndex = updatedEnquiries[fromColumn as keyof typeof updatedEnquiries]
        .findIndex(item => item.id === id);
      
      if (enquiryIndex === -1) return;
      
      const [movedEnquiry] = updatedEnquiries[fromColumn as keyof typeof updatedEnquiries].splice(enquiryIndex, 1);
      movedEnquiry.status = toColumn;  // Update the status
      updatedEnquiries[toColumn].push(movedEnquiry);
      
      setEnquiries(updatedEnquiries);
      
      if (!isDemo) {
        // Update the enquiry status in the database
        updateStatusMutation.mutate({ 
          enquiryId: id, 
          newStatus: toColumn
        });
      }
      
      setDraggedItemData(null);
    }
  };

  // Filter enquiries based on search query
  const filterEnquiriesBySearch = (enquiries: Record<string, Enquiry[]>) => {
    if (!searchQuery) return enquiries;
    
    const result: Record<string, Enquiry[]> = {
      new: [],
      pending: [],
      completed: []
    };
    
    Object.keys(enquiries).forEach(status => {
      result[status] = enquiries[status].filter(
        enquiry => 
          enquiry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          enquiry.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          enquiry.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          enquiry.form_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
    
    return result;
  };
  
  // Apply search filter to enquiries
  const filteredEnquiries = filterEnquiriesBySearch(enquiries);

  if (isLoading && !isDemo) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading enquiries...</p>
        </div>
      </div>
    );
  }

  // Calculate the maximum number of items to determine dynamic height
  const maxItemCount = Math.max(
    filteredEnquiries.new.length,
    filteredEnquiries.pending.length,
    filteredEnquiries.completed.length
  );
  
  // Set a dynamic height based on the number of items
  // but use the provided height prop if available
  const boardHeight = height || (maxItemCount <= 3 
    ? "h-[500px]" // Increased from 400px to 500px
    : maxItemCount <= 5 
      ? "h-[650px]" // Increased from 600px to 650px
      : "h-[750px]"); // Increased from 700px to 750px

  return (
    <Container>
      {/* Add EnquiryStats Component */}
      {isCompanyView && (
        <EnquiryStats
          totalEnquiries={filteredEnquiries.new.length + filteredEnquiries.pending.length + filteredEnquiries.completed.length}
          pendingEnquiries={filteredEnquiries.pending.length}
          newEnquiries={filteredEnquiries.new.length}
          resolvedEnquiries={filteredEnquiries.completed.length}
          totalTrend={8}
          pendingTrend={12}
          newTrend={5}
          resolvedTrend={15}
        />
      )}

      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Enquiry Board</h2>
          <div className="flex items-center space-x-2">
            {!readOnly && (
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search enquiries..."
                  className="pl-9 h-9"
                />
              </div>
            )}
            {!readOnly && (
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-1" /> Filter
              </Button>
            )}
            {!readOnly && isCompanyView && (
              <Button size="sm">
                <PlusCircle className="h-4 w-4 mr-1" /> New Enquiry
              </Button>
            )}
          </div>
        </div>

        <div 
          className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${height ? '' : 'min-h-[calc(100vh-250px)]'}`}
          style={height ? { height } : {}}
        >
          <div
            className="bg-blue-50 rounded-lg p-4 border border-blue-100 shadow-sm"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, "new")}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-blue-700 flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                New
                <span className="ml-2 bg-blue-100 text-blue-700 px-2 py-0.5 text-xs rounded-full">
                  {filteredEnquiries.new.length}
                </span>
              </h3>
            </div>
            <div className="space-y-3 overflow-y-auto" style={{ maxHeight: height ? 'calc(100% - 2rem)' : '500px' }}>
              <KanbanColumn enquiries={filteredEnquiries.new} onDragStart={handleDragStart} readOnly={readOnly} columnId="new" />
            </div>
          </div>

          <div
            className="bg-yellow-50 rounded-lg p-4 border border-yellow-100 shadow-sm"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, "pending")}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-yellow-700 flex items-center">
                <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                Pending
                <span className="ml-2 bg-yellow-100 text-yellow-700 px-2 py-0.5 text-xs rounded-full">
                  {filteredEnquiries.pending.length}
                </span>
              </h3>
            </div>
            <div className="space-y-3 overflow-y-auto" style={{ maxHeight: height ? 'calc(100% - 2rem)' : '500px' }}>
              <KanbanColumn enquiries={filteredEnquiries.pending} onDragStart={handleDragStart} readOnly={readOnly} columnId="pending" />
            </div>
          </div>

          <div
            className="bg-green-50 rounded-lg p-4 border border-green-100 shadow-sm"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, "completed")}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-green-700 flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Resolved
                <span className="ml-2 bg-green-100 text-green-700 px-2 py-0.5 text-xs rounded-full">
                  {filteredEnquiries.completed.length}
                </span>
              </h3>
            </div>
            <div className="space-y-3 overflow-y-auto" style={{ maxHeight: height ? 'calc(100% - 2rem)' : '500px' }}>
              <KanbanColumn enquiries={filteredEnquiries.completed} onDragStart={handleDragStart} readOnly={readOnly} columnId="completed" />
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
