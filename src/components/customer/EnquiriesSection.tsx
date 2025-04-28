import { useState } from "react";
import { EmptyState } from "./EmptyState";
import { DashboardSection } from "./DashboardSection";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  CalendarRange, 
  MessageSquare, 
  Plus,
  Filter
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Container } from "@/components/ui/Container";
import { KanbanBoard } from "@/components/kanban/KanbanBoard";
import { useNavigate } from "react-router-dom";

interface CustomerEnquiry {
  id: string;
  title: string;
  company: string;
  status: string;
  date: string;
  lastUpdate: string;
  hasNewResponse?: boolean;
  subject?: string;
  content?: string;
  attachments?: number;
  submitted?: string;
  expanded?: boolean;
}

interface EnquiriesSectionProps {
  customerEnquiries: CustomerEnquiry[];
}

export const EnquiriesSection = ({ customerEnquiries }: EnquiriesSectionProps) => {
  const [activeStatus, setActiveStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const isEmpty = customerEnquiries.length === 0;

  const handleStatusChange = (status: string) => {
    setActiveStatus(status);
  };

  const handleSelectStatusChange = (value: string) => {
    setStatusFilter(value);
  };

  const createNewEnquiry = () => {
    navigate("/customer/inquiry/new");
  };

  return (
    <Container size="full">
      <DashboardSection
        title="My Inquiries"
        subtitle="Track and manage your conversations with companies"
        actionButtonText="New Inquiry"
        onActionClick={createNewEnquiry}
      >
        {isEmpty ? (
          <EmptyState
            title="No inquiries yet"
            description="Get started by creating your first inquiry to connect with a company."
            buttonText="Create Your First Inquiry"
            onButtonClick={createNewEnquiry}
          />
        ) : (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search by keyword or company name" 
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-4">
                <Select value={statusFilter} onValueChange={handleSelectStatusChange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" className="flex gap-2 w-[180px]">
                  <CalendarRange className="h-4 w-4" />
                  <span>Select date range</span>
                </Button>
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                variant="outline"
                className={`rounded-full px-4 py-2 h-auto ${activeStatus === 'all' ? 'bg-primary text-primary-foreground hover:bg-primary/90' : ''}`}
                onClick={() => handleStatusChange('all')}
              >
                All
              </Button>
              <Button 
                variant="outline"
                className={`rounded-full px-4 py-2 h-auto ${activeStatus === 'new' ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' : ''}`}
                onClick={() => handleStatusChange('new')}
              >
                New
              </Button>
              <Button 
                variant="outline"
                className={`rounded-full px-4 py-2 h-auto ${activeStatus === 'pending' ? 'bg-amber-100 text-amber-800 hover:bg-amber-200' : ''}`}
                onClick={() => handleStatusChange('pending')}
              >
                Pending
              </Button>
              <Button 
                variant="outline"
                className={`rounded-full px-4 py-2 h-auto ${activeStatus === 'completed' ? 'bg-green-100 text-green-800 hover:bg-green-200' : ''}`}
                onClick={() => handleStatusChange('completed')}
              >
                Completed
              </Button>
            </div>

            {/* Use the KanbanBoard component instead of custom implementation for consistency */}
            <div className="mt-8">
              <KanbanBoard isDemo={true} readOnly={false} isCompanyView={false} height="h-[600px]" />
            </div>
          </div>
        )}
      </DashboardSection>
    </Container>
  );
};
