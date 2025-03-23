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
  Trash2, 
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Paperclip
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Container } from "@/components/ui/Container";

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
  createNewEnquiry: () => void;
}

export const EnquiriesSection = ({ customerEnquiries, createNewEnquiry }: EnquiriesSectionProps) => {
  const [activeStatus, setActiveStatus] = useState<string>("all");
  const [expandedInquiry, setExpandedInquiry] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [replyContent, setReplyContent] = useState("");
  const { toast } = useToast();
  
  const isEmpty = customerEnquiries.length === 0;

  const mockInquiries: CustomerEnquiry[] = [
    {
      id: "INQ-001",
      title: "Product Integration Question",
      company: "Acme Corporation",
      status: "pending",
      date: "2025-03-20T14:30:00",
      lastUpdate: "2025-03-20T14:30:00",
      content: "We're interested in integrating your API with our platform. Could you provide more details about the authentication process and rate limits?",
      subject: "Product Integration Question",
      attachments: 2,
      submitted: "2025-03-18T09:15:00"
    },
    {
      id: "INQ-002",
      title: "Service Outage Report",
      company: "TechSolutions Inc.",
      status: "in-progress",
      date: "2025-03-22T10:45:00",
      lastUpdate: "2025-03-22T10:45:00",
      content: "We're experiencing an outage with your service. Our monitoring system shows connectivity issues since 8:30 AM today.",
      subject: "Service Outage Report"
    },
    {
      id: "INQ-003",
      title: "Subscription Renewal",
      company: "Global Enterprises",
      status: "resolved",
      date: "2025-03-15T11:20:00",
      lastUpdate: "2025-03-17T16:45:00",
      content: "We'd like to renew our enterprise subscription for another year. Can you send us the updated pricing and contract?",
      subject: "Subscription Renewal"
    }
  ];

  const displayInquiries = isEmpty ? [] : mockInquiries;

  const handleStatusChange = (status: string) => {
    setActiveStatus(status);
  };

  const handleSelectStatusChange = (value: string) => {
    setStatusFilter(value);
  };

  const toggleInquiryExpand = (id: string) => {
    setExpandedInquiry(expandedInquiry === id ? null : id);
  };

  const handleSendReply = () => {
    if (!replyContent.trim()) {
      toast({
        title: "Reply cannot be empty",
        description: "Please enter a message before sending.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Reply sent",
      description: "Your reply has been sent successfully."
    });
    
    setReplyContent("");
  };

  const handleMarkAsResolved = () => {
    toast({
      title: "Marked as resolved",
      description: "The inquiry has been marked as resolved."
    });
  };

  const handleDeleteInquiry = () => {
    toast({
      title: "Inquiry deleted",
      description: "The inquiry has been deleted successfully."
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };

  const statusBadgeStyles = {
    "pending": "bg-amber-100 text-amber-800 hover:bg-amber-200",
    "in-progress": "bg-blue-100 text-blue-800 hover:bg-blue-200",
    "resolved": "bg-green-100 text-green-800 hover:bg-green-200"
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
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
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
                className={`rounded-full px-4 py-2 h-auto ${activeStatus === 'pending' ? 'bg-amber-100 text-amber-800 hover:bg-amber-200' : ''}`}
                onClick={() => handleStatusChange('pending')}
              >
                Pending
              </Button>
              <Button 
                variant="outline"
                className={`rounded-full px-4 py-2 h-auto ${activeStatus === 'in-progress' ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' : ''}`}
                onClick={() => handleStatusChange('in-progress')}
              >
                In Progress
              </Button>
              <Button 
                variant="outline"
                className={`rounded-full px-4 py-2 h-auto ${activeStatus === 'resolved' ? 'bg-green-100 text-green-800 hover:bg-green-200' : ''}`}
                onClick={() => handleStatusChange('resolved')}
              >
                Resolved
              </Button>
            </div>

            <div className="space-y-4">
              {displayInquiries.map((inquiry) => (
                <div key={inquiry.id} className="border rounded-lg overflow-hidden">
                  <div 
                    className="p-4 flex items-center justify-between cursor-pointer hover:bg-muted/50"
                    onClick={() => toggleInquiryExpand(inquiry.id)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        {inquiry.company.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-medium">{inquiry.company}</h3>
                        <p className="text-sm text-muted-foreground">{inquiry.title}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge className={statusBadgeStyles[inquiry.status as keyof typeof statusBadgeStyles]}>
                        {inquiry.status === "in-progress" ? "In Progress" : 
                          inquiry.status.charAt(0).toUpperCase() + inquiry.status.slice(1)}
                      </Badge>
                      <span className="text-sm text-muted-foreground whitespace-nowrap">
                        {formatDate(inquiry.date)}
                      </span>
                      {expandedInquiry === inquiry.id ? (
                        <ChevronUp className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                  </div>

                  {expandedInquiry === inquiry.id && (
                    <div className="border-t p-4">
                      <div className="mb-4">
                        <h4 className="text-sm font-medium mb-1">Inquiry Details</h4>
                        <div className="text-right text-sm text-muted-foreground">
                          Submitted: {inquiry.submitted ? formatDate(inquiry.submitted) : formatDate(inquiry.date)}
                        </div>
                        <p className="mt-2">
                          {inquiry.content}
                        </p>
                        {inquiry.attachments && (
                          <div className="mt-4">
                            <div className="flex items-center text-sm text-blue-600">
                              <Paperclip className="h-4 w-4 mr-2" />
                              Attachments ({inquiry.attachments})
                            </div>
                          </div>
                        )}
                      </div>

                      <Textarea 
                        placeholder="Write your reply here..." 
                        className="min-h-[100px] mb-4"
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                      />
                      
                      <div className="flex justify-between">
                        <Button 
                          onClick={handleSendReply}
                          className="flex items-center gap-2"
                        >
                          <MessageSquare className="h-4 w-4" />
                          Send Reply
                        </Button>
                        
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            className="flex items-center gap-2"
                            onClick={() => toast({
                              title: "View full conversation",
                              description: "This feature will be available soon."
                            })}
                          >
                            <MessageSquare className="h-4 w-4" />
                            View Full Conversation
                          </Button>
                          
                          <Button 
                            variant="outline" 
                            className="flex items-center gap-2 text-green-600"
                            onClick={handleMarkAsResolved}
                          >
                            <CheckCircle className="h-4 w-4" />
                            Mark as Resolved
                          </Button>
                          
                          <Button 
                            variant="outline" 
                            className="flex items-center gap-2 text-red-600"
                            onClick={handleDeleteInquiry}
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete Inquiry
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </DashboardSection>
    </Container>
  );
};
