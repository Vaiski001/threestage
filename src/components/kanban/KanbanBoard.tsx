
import { useState, useEffect } from "react";
import { KanbanColumn } from "./KanbanColumn";
import { Container } from "@/components/ui/Container";
import { Plus, Filter, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCompanyEnquiries, getCustomerEnquiries, updateEnquiryStatus } from "@/lib/supabase/submissions";
import { Enquiry } from "@/lib/supabase/types";

// Sample data for demo purposes
const sampleEnquiries: Record<string, Enquiry[]> = {
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
    }
  ],
  completed: [
    {
      id: "6",
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
      id: "7",
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
      id: "8",
      title: "Partnership Inquiry",
      customer_name: "Olivia Williams",
      customer_email: "olivia@example.com",
      company_id: "demo-company",
      created_at: "2023-05-08",
      form_name: "Facebook",
      content: "Thank you for the information about your partnership program.",
      status: "completed",
      priority: "high"
    }
  ]
};

export interface KanbanBoardProps {
  isDemo?: boolean;
  readOnly?: boolean;
  isCompanyView?: boolean;
}

export function KanbanBoard({ isDemo = false, readOnly = false, isCompanyView = false }: KanbanBoardProps) {
  const [enquiries, setEnquiries] = useState<Record<string, Enquiry[]>>({
    new: [],
    pending: [],
    completed: []
  });
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch enquiries based on user role
  const { data: fetchedEnquiries, isLoading } = useQuery({
    queryKey: ['enquiries', user?.id, profile?.role],
    queryFn: async () => {
      if (isDemo) return sampleEnquiries;
      
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
      setEnquiries(sampleEnquiries);
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
  }, [fetchedEnquiries, isDemo]);

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

  const handleDragStart = (e: React.DragEvent, id: string, fromColumn: string) => {
    if (readOnly) return;
    e.dataTransfer.setData("id", id);
    e.dataTransfer.setData("fromColumn", fromColumn);
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (readOnly) return;
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, toColumn: string) => {
    if (readOnly) return;
    e.preventDefault();
    const id = e.dataTransfer.getData("id");
    const fromColumn = e.dataTransfer.getData("fromColumn") as keyof typeof enquiries;
    
    if (fromColumn === toColumn) return;

    const enquiryCopy = { ...enquiries[fromColumn].find(item => item.id === id) };
    if (!enquiryCopy) return;

    // Update local state first for immediate feedback
    setEnquiries(prev => ({
      ...prev,
      [fromColumn]: prev[fromColumn].filter(item => item.id !== id),
      [toColumn]: [...prev[toColumn], {...enquiryCopy, status: toColumn as 'new' | 'pending' | 'completed'}]
    }));

    // Then update in the database
    if (!isDemo) {
      updateStatusMutation.mutate({
        enquiryId: id,
        newStatus: toColumn as 'new' | 'pending' | 'completed'
      });
    }
  };

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

  return (
    <div className="pt-6 pb-12">
      <Container size="full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 overflow-x-auto">
          <KanbanColumn
            title="New"
            count={enquiries.new.length}
            color="stage-new"
            enquiries={enquiries.new}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            columnId="new"
            readOnly={readOnly}
          />
          
          <KanbanColumn
            title="Pending"
            count={enquiries.pending.length}
            color="stage-pending"
            enquiries={enquiries.pending}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            columnId="pending"
            readOnly={readOnly}
          />
          
          <KanbanColumn
            title="Completed"
            count={enquiries.completed.length}
            color="stage-completed"
            enquiries={enquiries.completed}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            columnId="completed"
            readOnly={readOnly}
          />
        </div>
      </Container>
    </div>
  );
}
