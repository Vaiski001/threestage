import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Flag,
  AlertTriangle,
  MessageSquare,
  FileText,
  Image,
  Paperclip
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

interface ContentItem {
  id: string;
  type: "message" | "inquiry" | "document" | "image";
  content: string;
  author: string;
  status: "pending" | "approved" | "rejected" | "flagged";
  reportReason?: string;
  createdAt: string;
  context: string;
}

const ContentModeration = () => {
  const { toast } = useToast();
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data for content moderation
    const mockContentItems: ContentItem[] = [
      {
        id: "1",
        type: "message",
        content: "Hello, I'd like to discuss your pricing. Please contact me at h4ck3r@example.com or call 555-123-4567.",
        author: "John Smith",
        status: "flagged",
        reportReason: "Contains contact information",
        createdAt: "2023-05-15T14:30:00Z",
        context: "Inquiry #12432 - Message thread"
      },
      {
        id: "2",
        type: "inquiry",
        content: "I need assistance with building a website for my business.",
        author: "Emma Johnson",
        status: "pending",
        createdAt: "2023-05-18T09:20:00Z",
        context: "New inquiry submission"
      },
      {
        id: "3",
        type: "document",
        content: "business_proposal.pdf",
        author: "Michael Brown",
        status: "pending",
        createdAt: "2023-05-17T16:45:00Z",
        context: "Attachment to Inquiry #12458"
      },
      {
        id: "4",
        type: "image",
        content: "project_mockup.jpg",
        author: "Sarah Williams",
        status: "pending",
        createdAt: "2023-05-18T11:10:00Z",
        context: "Attachment to Message in Inquiry #12445"
      },
      {
        id: "5",
        type: "message",
        content: "This is inappropriate content that violates community guidelines...",
        author: "David Chen",
        status: "flagged",
        reportReason: "Inappropriate content",
        createdAt: "2023-05-14T10:30:00Z",
        context: "Message in Inquiry #12389"
      }
    ];

    setContentItems(mockContentItems);
    setLoading(false);
  }, []);

  const filteredContent = contentItems.filter(item => 
    item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.context.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const approveContent = (id: string) => {
    setContentItems(contentItems.map(item => 
      item.id === id ? { ...item, status: "approved" as const } : item
    ));
    
    toast({
      title: "Content approved",
      description: "The content has been approved and is now visible"
    });

    if (selectedItem?.id === id) {
      setSelectedItem({...selectedItem, status: "approved" as const});
    }
  };

  const rejectContent = (id: string) => {
    if (!rejectReason) {
      toast({
        title: "Rejection reason required",
        description: "Please provide a reason for rejecting this content",
        variant: "destructive"
      });
      return;
    }
    
    setContentItems(contentItems.map(item => 
      item.id === id ? { ...item, status: "rejected" as const } : item
    ));
    
    toast({
      title: "Content rejected",
      description: "The content has been rejected and is hidden from users"
    });

    if (selectedItem?.id === id) {
      setSelectedItem(null);
    }
    
    setRejectReason("");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case "message":
        return <MessageSquare className="h-4 w-4" />;
      case "inquiry":
        return <FileText className="h-4 w-4" />;
      case "document":
        return <Paperclip className="h-4 w-4" />;
      case "image":
        return <Image className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Content Moderation</h1>
          <p className="text-muted-foreground">
            Review and moderate user-generated content
          </p>
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="bg-background rounded-lg border p-4 mb-6">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search content..."
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

          <Tabs defaultValue="flagged" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="flagged" className="flex gap-1 items-center">
                <Flag className="h-4 w-4" />
                Flagged
              </TabsTrigger>
              <TabsTrigger value="pending" className="flex gap-1 items-center">
                <AlertTriangle className="h-4 w-4" />
                Pending Review
              </TabsTrigger>
              <TabsTrigger value="all" className="flex gap-1 items-center">
                All Content
              </TabsTrigger>
            </TabsList>

            <TabsContent value="flagged">
              <ContentTable 
                items={filteredContent.filter(item => item.status === "flagged")} 
                onSelect={setSelectedItem}
                formatDate={formatDate}
                getContentTypeIcon={getContentTypeIcon}
                selectedItemId={selectedItem?.id || ""}
              />
            </TabsContent>

            <TabsContent value="pending">
              <ContentTable 
                items={filteredContent.filter(item => item.status === "pending")} 
                onSelect={setSelectedItem}
                formatDate={formatDate}
                getContentTypeIcon={getContentTypeIcon}
                selectedItemId={selectedItem?.id || ""}
              />
            </TabsContent>

            <TabsContent value="all">
              <ContentTable 
                items={filteredContent} 
                onSelect={setSelectedItem}
                formatDate={formatDate}
                getContentTypeIcon={getContentTypeIcon}
                selectedItemId={selectedItem?.id || ""}
              />
            </TabsContent>
          </Tabs>
        </div>

        <div className="rounded-lg border bg-background p-6">
          {selectedItem ? (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold">Content Review</h2>
                <p className="text-sm text-muted-foreground">
                  Review details and take appropriate action
                </p>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Type</Label>
                <div className="flex items-center gap-2">
                  {getContentTypeIcon(selectedItem.type)}
                  <span className="capitalize">{selectedItem.type}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <div>
                  {selectedItem.status === "approved" && (
                    <Badge className="bg-green-100 text-green-800">Approved</Badge>
                  )}
                  {selectedItem.status === "pending" && (
                    <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                  )}
                  {selectedItem.status === "rejected" && (
                    <Badge className="bg-red-100 text-red-800">Rejected</Badge>
                  )}
                  {selectedItem.status === "flagged" && (
                    <Badge className="bg-orange-100 text-orange-800">Flagged</Badge>
                  )}
                </div>
              </div>

              {selectedItem.reportReason && (
                <div className="space-y-2">
                  <Label>Report Reason</Label>
                  <p className="text-sm p-2 bg-red-50 text-red-800 rounded-md">
                    {selectedItem.reportReason}
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Label>Author</Label>
                <p>{selectedItem.author}</p>
              </div>

              <div className="space-y-2">
                <Label>Content</Label>
                <div className="p-3 border rounded-md bg-slate-50 whitespace-pre-wrap max-h-40 overflow-y-auto">
                  {selectedItem.content}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Context</Label>
                <p className="text-sm">{selectedItem.context}</p>
              </div>

              <div className="space-y-2">
                <Label>Submitted</Label>
                <p className="text-sm">{formatDate(selectedItem.createdAt)}</p>
              </div>

              {selectedItem.status !== "approved" && selectedItem.status !== "rejected" && (
                <>
                  <Separator />

                  <div className="space-y-2">
                    <Label htmlFor="reject-reason">Rejection Reason</Label>
                    <Textarea 
                      id="reject-reason" 
                      placeholder="Provide reason for rejection..."
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      variant="default" 
                      className="flex-1 gap-1"
                      onClick={() => approveContent(selectedItem.id)}
                    >
                      <CheckCircle className="h-4 w-4" />
                      Approve
                    </Button>
                    <Button 
                      variant="destructive" 
                      className="flex-1 gap-1"
                      onClick={() => rejectContent(selectedItem.id)}
                    >
                      <XCircle className="h-4 w-4" />
                      Reject
                    </Button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-4">
              <AlertTriangle className="h-8 w-8 text-muted-foreground mb-2" />
              <h3 className="text-lg font-medium">No content selected</h3>
              <p className="text-sm text-muted-foreground">
                Select an item from the list to review
              </p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

// Extracted component for content table
interface ContentTableProps {
  items: ContentItem[];
  onSelect: (item: ContentItem) => void;
  formatDate: (date: string) => string;
  getContentTypeIcon: (type: string) => JSX.Element | null;
  selectedItemId: string;
}

const ContentTable = ({ items, onSelect, formatDate, getContentTypeIcon, selectedItemId }: ContentTableProps) => {
  return (
    <div className="rounded-md border bg-background overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Type</TableHead>
            <TableHead className="min-w-[250px]">Content</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Submitted</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                No content items to display
              </TableCell>
            </TableRow>
          ) : (
            items.map((item) => (
              <TableRow 
                key={item.id} 
                className={`cursor-pointer hover:bg-slate-50 ${selectedItemId === item.id ? 'bg-slate-100' : ''}`}
                onClick={() => onSelect(item)}
              >
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    {getContentTypeIcon(item.type)}
                    <span className="capitalize text-xs">{item.type}</span>
                  </div>
                </TableCell>
                <TableCell className="font-medium">
                  <div className="truncate max-w-[250px]">
                    {item.content}
                  </div>
                </TableCell>
                <TableCell>{item.author}</TableCell>
                <TableCell>
                  {item.status === "approved" && (
                    <Badge className="bg-green-100 text-green-800">Approved</Badge>
                  )}
                  {item.status === "pending" && (
                    <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                  )}
                  {item.status === "rejected" && (
                    <Badge className="bg-red-100 text-red-800">Rejected</Badge>
                  )}
                  {item.status === "flagged" && (
                    <Badge className="bg-orange-100 text-orange-800">Flagged</Badge>
                  )}
                </TableCell>
                <TableCell>{formatDate(item.createdAt)}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ContentModeration; 