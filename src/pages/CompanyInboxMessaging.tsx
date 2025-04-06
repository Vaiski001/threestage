import { useState } from "react";
import { Inbox, Mail, MessageCircle, Search, Filter, MoreVertical, Phone, Clock, AlertCircle, Star, StarOff, Flag, Trash2, Archive, MessageSquare, CheckCircle, FolderOpen } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Mock unified inbox messages
const messages = [
  {
    id: "msg1",
    type: "email",
    from: {
      name: "John Doe",
      avatar: "JD",
      email: "john.doe@example.com"
    },
    subject: "Kitchen renovation estimates",
    preview: "I'm interested in getting an estimate for a complete kitchen renovation. Our kitchen is approximately 200 square feet and we're looking to...",
    date: new Date(2023, 6, 10, 9, 30),
    read: false,
    flagged: true,
    priority: "high",
    labels: ["enquiry", "kitchen"],
    enquiryId: "ENQ-001"
  },
  {
    id: "msg2",
    type: "chat",
    from: {
      name: "Sarah Smith",
      avatar: "SS",
      email: "sarah.s@example.com"
    },
    subject: "Chat: Bathroom remodel questions",
    preview: "Do you have any examples of similar bathroom remodels you've done recently? I'm particularly interested in modern designs with...",
    date: new Date(2023, 6, 9, 14, 15),
    read: true,
    flagged: false,
    priority: "medium",
    labels: ["enquiry", "bathroom"],
    enquiryId: "ENQ-002"
  },
  {
    id: "msg3",
    type: "email",
    from: {
      name: "Michael Johnson",
      avatar: "MJ",
      email: "mjohnson@example.com"
    },
    subject: "Follow-up regarding deck construction",
    preview: "Thank you for sending the initial plans for our deck project. I have a few questions about the materials you've suggested. Will the composite...",
    date: new Date(2023, 6, 8, 11, 45),
    read: true,
    flagged: false,
    priority: "medium",
    labels: ["enquiry", "deck"],
    enquiryId: "ENQ-003"
  },
  {
    id: "msg4",
    type: "voicemail",
    from: {
      name: "Emily Wilson",
      avatar: "EW",
      email: "emily.w@example.com"
    },
    subject: "Voicemail: Installation scheduling",
    preview: "Hello, I'm calling about scheduling the fence installation we discussed last week. I'm available Monday or Tuesday next week if that works for your team...",
    date: new Date(2023, 6, 7, 16, 20),
    read: false,
    flagged: false,
    priority: "high",
    labels: ["enquiry", "installation"],
    enquiryId: "ENQ-004"
  },
  {
    id: "msg5",
    type: "email",
    from: {
      name: "David Brown",
      avatar: "DB",
      email: "david.b@example.com"
    },
    subject: "Re: Flooring installation complete",
    preview: "The flooring looks fantastic! Thank you for the maintenance tips. I do have one question about cleaning the new hardwood floors. Is it safe to use...",
    date: new Date(2023, 6, 6, 10, 10),
    read: true,
    flagged: true,
    priority: "low",
    labels: ["completed", "flooring"],
    enquiryId: "ENQ-005"
  },
  {
    id: "msg6",
    type: "chat",
    from: {
      name: "Amanda Garcia",
      avatar: "AG",
      email: "amanda.g@example.com"
    },
    subject: "Chat: Requesting consultation",
    preview: "I'm planning a major home renovation project including the kitchen, living room, and master bathroom. When would be a good time to schedule an initial consultation?",
    date: new Date(2023, 6, 5, 15, 30),
    read: true,
    flagged: false,
    priority: "medium",
    labels: ["enquiry", "renovation"],
    enquiryId: "ENQ-006"
  },
  {
    id: "msg7",
    type: "email",
    from: {
      name: "Robert Taylor",
      avatar: "RT",
      email: "robert.t@example.com"
    },
    subject: "Quotation for basement finishing",
    preview: "I've reviewed your quotation for the basement finishing project and everything looks good. I'd like to proceed with the work as discussed. How soon could your team start?",
    date: new Date(2023, 6, 4, 9, 45),
    read: true,
    flagged: false,
    priority: "high",
    labels: ["enquiry", "basement"],
    enquiryId: "ENQ-007"
  },
  {
    id: "msg8",
    type: "voicemail",
    from: {
      name: "Jennifer Adams",
      avatar: "JA",
      email: "jennifer.a@example.com"
    },
    subject: "Voicemail: Cancellation request",
    preview: "Hello, I need to reschedule our appointment for next Wednesday. Something unexpected came up and I won't be able to meet with your team that day. Please call me back to...",
    date: new Date(2023, 6, 3, 13, 15),
    read: false,
    flagged: true,
    priority: "high",
    labels: ["enquiry", "scheduling"],
    enquiryId: "ENQ-008"
  }
];

// Sample response templates
const responseTemplates = [
  { id: "t1", name: "Initial Enquiry Response", subject: "Thank you for your enquiry" },
  { id: "t2", name: "Consultation Scheduling", subject: "Schedule your consultation" },
  { id: "t3", name: "Quote Follow-up", subject: "Your project quotation" },
  { id: "t4", name: "Project Completion", subject: "Project completion and next steps" },
  { id: "t5", name: "Payment Reminder", subject: "Payment reminder" }
];

// Format date helper function
const formatMessageDate = (date: Date) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (date >= today) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else if (date >= yesterday) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  }
};

// Icon mapper function
const getMessageTypeIcon = (type: string) => {
  switch (type) {
    case 'email':
      return <Mail className="h-4 w-4" />;
    case 'chat':
      return <MessageCircle className="h-4 w-4" />;
    case 'voicemail':
      return <Phone className="h-4 w-4" />;
    default:
      return <Mail className="h-4 w-4" />;
  }
};

export default function CompanyInboxMessaging() {
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeView, setActiveView] = useState("all");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  
  // Filter messages based on current view and search query
  const filteredMessages = messages.filter(message => {
    // Search filtering
    const matchesSearch = 
      message.from.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.preview.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.enquiryId.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Tab filtering
    if (activeView === "all") return matchesSearch;
    if (activeView === "unread") return !message.read && matchesSearch;
    if (activeView === "flagged") return message.flagged && matchesSearch;
    if (activeView === "email") return message.type === "email" && matchesSearch;
    if (activeView === "chat") return message.type === "chat" && matchesSearch;
    if (activeView === "voicemail") return message.type === "voicemail" && matchesSearch;
    
    return matchesSearch;
  });
  
  // Get the selected message details
  const selectedMessageDetails = messages.find(msg => msg.id === selectedMessage);

  return (
    <div className="flex h-full flex-col">
      <div className="border-b">
        <div className="flex items-center p-4">
          <h1 className="text-xl font-semibold">Unified Inbox</h1>
        </div>
      </div>
      
      <div className="grid h-full grid-cols-12 overflow-auto">
        {/* Message list sidebar */}
        <div className="col-span-4 border-r h-full flex flex-col">
          <div className="p-3 border-b">
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search messages..."
                  className="pl-8 rounded-md"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setActiveFilter("priority")}>
                    Priority
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setActiveFilter("date")}>
                    Date (Newest)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setActiveFilter("type")}>
                    Message Type
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setActiveFilter(null)}>
                    Clear Filters
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          <Tabs 
            defaultValue="all" 
            className="w-full" 
            onValueChange={(value) => setActiveView(value)}
          >
            <div className="px-4 pt-2">
              <TabsList className="w-full">
                <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
                <TabsTrigger value="unread" className="flex-1">Unread</TabsTrigger>
                <TabsTrigger value="flagged" className="flex-1">Flagged</TabsTrigger>
              </TabsList>
            </div>
            
            <div className="px-4 pt-2">
              <TabsList className="w-full">
                <TabsTrigger value="email" className="flex-1">Email</TabsTrigger>
                <TabsTrigger value="chat" className="flex-1">Chat</TabsTrigger>
                <TabsTrigger value="voicemail" className="flex-1">Voicemail</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="all" className="m-0 p-0">
              <ScrollArea className="h-[calc(100vh-16rem)]">
                <div className="divide-y">
                  {filteredMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`hover:bg-secondary/50 p-3 cursor-pointer ${
                        selectedMessage === message.id ? "bg-secondary/50" : ""
                      } ${!message.read ? "bg-secondary/20" : ""}`}
                      onClick={() => setSelectedMessage(message.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <Avatar className="h-10 w-10 text-white bg-primary flex items-center justify-center">
                          <span>{message.from.avatar}</span>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <span className="font-medium truncate">{message.from.name}</span>
                              {message.priority === "high" && (
                                <AlertCircle className="h-4 w-4 text-destructive" />
                              )}
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-xs text-muted-foreground">{formatMessageDate(message.date)}</span>
                              {getMessageTypeIcon(message.type)}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {message.enquiryId}
                            </Badge>
                            {message.flagged && (
                              <Flag className="h-3 w-3 text-amber-500" />
                            )}
                          </div>
                          <p className="text-sm font-medium mt-1">{message.subject}</p>
                          <p className="text-xs text-muted-foreground truncate mt-1">
                            {message.preview}
                          </p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {message.labels.map((label, index) => (
                              <Badge key={index} variant="secondary" className="text-xs px-1.5 py-0">
                                {label}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
            
            {/* Other tab contents would follow the same pattern */}
            <TabsContent value="unread" className="m-0 p-0">
              <ScrollArea className="h-[calc(100vh-16rem)]">
                <div className="divide-y">
                  {filteredMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`hover:bg-secondary/50 p-3 cursor-pointer ${
                        selectedMessage === message.id ? "bg-secondary/50" : ""
                      } bg-secondary/20`}
                      onClick={() => setSelectedMessage(message.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <Avatar className="h-10 w-10 text-white bg-primary flex items-center justify-center">
                          <span>{message.from.avatar}</span>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <span className="font-medium truncate">{message.from.name}</span>
                              {message.priority === "high" && (
                                <AlertCircle className="h-4 w-4 text-destructive" />
                              )}
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-xs text-muted-foreground">{formatMessageDate(message.date)}</span>
                              {getMessageTypeIcon(message.type)}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {message.enquiryId}
                            </Badge>
                            {message.flagged && (
                              <Flag className="h-3 w-3 text-amber-500" />
                            )}
                          </div>
                          <p className="text-sm font-medium mt-1">{message.subject}</p>
                          <p className="text-xs text-muted-foreground truncate mt-1">
                            {message.preview}
                          </p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {message.labels.map((label, index) => (
                              <Badge key={index} variant="secondary" className="text-xs px-1.5 py-0">
                                {label}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
            
            {/* Other tab contents would be similar */}
          </Tabs>
        </div>
        
        {/* Message content area */}
        <div className="col-span-8 h-full flex flex-col">
          {selectedMessageDetails ? (
            <>
              {/* Message header */}
              <div className="border-b p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 text-white bg-primary flex items-center justify-center">
                      <span>{selectedMessageDetails.from.avatar}</span>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg font-medium">{selectedMessageDetails.from.name}</h2>
                        <Badge variant="outline">
                          {selectedMessageDetails.enquiryId}
                        </Badge>
                        <Badge variant="secondary">
                          {selectedMessageDetails.type}
                        </Badge>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground gap-2">
                        <span>{selectedMessageDetails.from.email}</span>
                        <span>•</span>
                        <span>{selectedMessageDetails.date.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon">
                            {selectedMessageDetails.flagged ? (
                              <StarOff className="h-5 w-5" />
                            ) : (
                              <Star className="h-5 w-5" />
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{selectedMessageDetails.flagged ? "Unflag" : "Flag"}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Archive className="h-5 w-5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Archive</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-5 w-5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Delete</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Mark as unread</DropdownMenuItem>
                        <DropdownMenuItem>Print message</DropdownMenuItem>
                        <DropdownMenuItem>Forward to team member</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>View enquiry details</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                
                <div className="mt-3">
                  <h3 className="text-xl font-medium">{selectedMessageDetails.subject}</h3>
                </div>
              </div>
              
              {/* Message content */}
              <ScrollArea className="flex-1 p-4">
                <div className="prose max-w-none">
                  {selectedMessageDetails.type === "voicemail" ? (
                    <div className="bg-muted rounded-lg p-4 mt-4">
                      <div className="flex items-center gap-3 mb-4">
                        <Phone className="h-6 w-6 text-primary" />
                        <div>
                          <p className="font-medium">Voicemail from {selectedMessageDetails.from.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {selectedMessageDetails.date.toLocaleString()} • 1:24
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Clock className="h-4 w-4 mr-2" />
                          0.8x
                        </Button>
                        <Button variant="outline" size="sm">
                          Play
                        </Button>
                        <Button variant="outline" size="sm">
                          Pause
                        </Button>
                      </div>
                      
                      <Separator className="my-4" />
                      
                      <div>
                        <p className="font-medium">Transcript:</p>
                        <p className="mt-2">{selectedMessageDetails.preview}</p>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="whitespace-pre-line">{selectedMessageDetails.preview}</p>
                      <p className="whitespace-pre-line mt-4">
                        {selectedMessageDetails.type === "chat" 
                          ? "This is the beginning of your chat conversation with this customer. You can view the full chat history and respond directly." 
                          : "This is the content of the email message. In a real application, the full message text would be displayed here."}
                      </p>
                    </div>
                  )}
                </div>
              </ScrollArea>
              
              {/* Action buttons */}
              <div className="border-t p-3 bg-muted/20">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Button variant="default">
                      <Mail className="h-4 w-4 mr-2" />
                      Reply
                    </Button>
                    
                    {selectedMessageDetails.type === "chat" && (
                      <Button variant="outline">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Open Chat
                      </Button>
                    )}
                    
                    {selectedMessageDetails.type === "email" && (
                      <Button variant="outline">
                        <FolderOpen className="h-4 w-4 mr-2" />
                        View Thread
                      </Button>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Select>
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Response template" />
                      </SelectTrigger>
                      <SelectContent>
                        {responseTemplates.map(template => (
                          <SelectItem key={template.id} value={template.id}>
                            {template.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Button variant="outline">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark as Resolved
                    </Button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center flex-col p-6 text-center">
              <Inbox className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">Select a message</h3>
              <p className="text-muted-foreground">
                Choose a message from the list to view its contents
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 