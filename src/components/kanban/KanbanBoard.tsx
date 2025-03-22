
import { useState } from "react";
import { KanbanColumn } from "./KanbanColumn";
import { Container } from "@/components/ui/Container";
import { Plus, Filter, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

// Define the Enquiry type to match the type in KanbanColumn.tsx
interface Enquiry {
  id: string;
  title: string;
  customer: string;
  date: string;
  channel: string;
  content: string;
  priority: "high" | "medium" | "low";
}

// Empty initial state for new users
const emptyEnquiries: Record<string, Enquiry[]> = {
  new: [],
  pending: [],
  completed: []
};

// Sample data for demo purposes
const sampleEnquiries: Record<string, Enquiry[]> = {
  new: [
    {
      id: "1",
      title: "Product Enquiry",
      customer: "John Smith",
      date: "2023-05-15",
      channel: "Website",
      content: "I'm interested in your premium package. Could you provide more details?",
      priority: "high"
    },
    {
      id: "2",
      title: "Service Question",
      customer: "Emma Johnson",
      date: "2023-05-16",
      channel: "WhatsApp",
      content: "Do you offer same-day delivery for your services?",
      priority: "medium"
    },
    {
      id: "3",
      title: "Pricing Information",
      customer: "Michael Brown",
      date: "2023-05-17",
      channel: "Facebook",
      content: "What are your current rates for ongoing support?",
      priority: "low"
    }
  ],
  pending: [
    {
      id: "4",
      title: "Refund Request",
      customer: "Sarah Wilson",
      date: "2023-05-10",
      channel: "Instagram",
      content: "I'd like to request a refund for my recent purchase.",
      priority: "high"
    },
    {
      id: "5",
      title: "Technical Support",
      customer: "David Lee",
      date: "2023-05-12",
      channel: "Website",
      content: "I'm having trouble with the login functionality.",
      priority: "medium"
    }
  ],
  completed: [
    {
      id: "6",
      title: "Order Confirmation",
      customer: "Jennifer Taylor",
      date: "2023-05-05",
      channel: "Website",
      content: "Thank you for confirming my order details.",
      priority: "medium"
    },
    {
      id: "7",
      title: "Feature Request",
      customer: "Robert Martin",
      date: "2023-05-07",
      channel: "WhatsApp",
      content: "I suggested a new feature and appreciate your response.",
      priority: "low"
    },
    {
      id: "8",
      title: "Partnership Inquiry",
      customer: "Olivia Williams",
      date: "2023-05-08",
      channel: "Facebook",
      content: "Thank you for the information about your partnership program.",
      priority: "high"
    }
  ]
};

export function KanbanBoard({ isDemo = false }: { isDemo?: boolean }) {
  // Use sample data for demo, empty for new users
  const [enquiries, setEnquiries] = useState(isDemo ? sampleEnquiries : emptyEnquiries);
  const isEmpty = Object.values(enquiries).every(column => column.length === 0);

  const handleDragStart = (e: React.DragEvent, id: string, fromColumn: string) => {
    e.dataTransfer.setData("id", id);
    e.dataTransfer.setData("fromColumn", fromColumn);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, toColumn: string) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("id");
    const fromColumn = e.dataTransfer.getData("fromColumn") as keyof typeof enquiries;
    
    if (fromColumn === toColumn) return;

    const enquiryCopy = { ...enquiries[fromColumn].find(item => item.id === id) };
    if (!enquiryCopy) return;

    setEnquiries(prev => ({
      ...prev,
      [fromColumn]: prev[fromColumn].filter(item => item.id !== id),
      [toColumn]: [...prev[toColumn], enquiryCopy]
    }));
  };

  return (
    <div className="pt-6 pb-12">
      <Container size="full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-medium">Enquiry Board</h2>
          <div className="flex gap-3">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Enquiry
            </Button>
          </div>
        </div>

        {isEmpty && !isDemo ? (
          <div className="bg-card rounded-lg border shadow-sm p-8 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <PlusCircle className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-medium mb-2">Your Kanban board is empty</h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              Get started by adding your first enquiry. You can then drag and drop enquiries between different stages.
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Enquiry
            </Button>
          </div>
        ) : (
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
            />
          </div>
        )}
      </Container>
    </div>
  );
}
