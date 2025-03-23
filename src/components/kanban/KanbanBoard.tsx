
import { useState } from "react";
import { KanbanColumn } from "./KanbanColumn";
import { Container } from "@/components/ui/Container";
import { Plus, Filter, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

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

export interface KanbanBoardProps {
  isDemo?: boolean;
  readOnly?: boolean;
  isCompanyView?: boolean;
}

export function KanbanBoard({ isDemo = false, readOnly = false, isCompanyView = false }: KanbanBoardProps) {
  // Use sample data for demo, empty for new users
  const [enquiries, setEnquiries] = useState(isDemo ? sampleEnquiries : emptyEnquiries);
  const { toast } = useToast();

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

    setEnquiries(prev => ({
      ...prev,
      [fromColumn]: prev[fromColumn].filter(item => item.id !== id),
      [toColumn]: [...prev[toColumn], enquiryCopy]
    }));
  };

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
