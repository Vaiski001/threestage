import { useState } from "react";
import { Mail, Search, Star, Trash, Filter, MoveDown, Calendar, Paperclip, Clock, MoreHorizontal, ChevronRight, RefreshCw, Archive, Tag, User, Phone, FileText, Send } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
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

// Mock data for email messages
const emails = [
  {
    id: "1",
    read: true,
    starred: true,
    from: {
      name: "John Doe",
      email: "john.doe@example.com",
      avatar: "JD",
      enquiryId: "ENQ-001"
    },
    subject: "Question about quote for kitchen renovation",
    preview: "I received your quote for my kitchen renovation project, but I had a few questions about the timeline...",
    date: "Today, 10:30 AM",
    hasAttachment: true,
    labels: ["enquiry", "quote"]
  },
  {
    id: "2",
    read: false,
    starred: false,
    from: {
      name: "Sarah Smith",
      email: "sarah.smith@example.com",
      avatar: "SS",
      enquiryId: "ENQ-002"
    },
    subject: "Bathroom remodel consultation",
    preview: "I'm interested in getting a consultation for a bathroom remodel. When would your team be available?",
    date: "Yesterday, 4:15 PM",
    hasAttachment: false,
    labels: ["enquiry", "new"]
  },
  {
    id: "3",
    read: true,
    starred: false,
    from: {
      name: "Michael Johnson",
      email: "michael.j@example.com",
      avatar: "MJ",
      enquiryId: "ENQ-003"
    },
    subject: "Feedback on recent project",
    preview: "I wanted to send you some feedback on the recent work your team did on our deck. Everything looks fantastic...",
    date: "Jan 15, 2024",
    hasAttachment: true,
    labels: ["feedback", "completed"]
  },
  {
    id: "4",
    read: true,
    starred: false,
    from: {
      name: "Emily Wilson",
      email: "emily.w@example.com",
      avatar: "EW",
      enquiryId: "ENQ-004"
    },
    subject: "Question about payment schedule",
    preview: "Could you provide more details about the payment schedule for our fence installation project?",
    date: "Jan 12, 2024",
    hasAttachment: false,
    labels: ["payment", "active"]
  },
  {
    id: "5",
    read: false,
    starred: false,
    from: {
      name: "David Brown",
      email: "david.b@example.com",
      avatar: "DB",
      enquiryId: "ENQ-005"
    },
    subject: "Request for additional service",
    preview: "We recently had you install new flooring, and we're very happy with it. Now we're considering updating our kitchen...",
    date: "Jan 10, 2024",
    hasAttachment: false,
    labels: ["enquiry", "upsell"]
  }
];

// Email templates
const emailTemplates = [
  { id: "1", name: "Quote Follow-up" },
  { id: "2", name: "Project Update" },
  { id: "3", name: "Payment Reminder" },
  { id: "4", name: "Consultation Confirmation" },
  { id: "5", name: "Thank You" }
];

// Labels for emails
const emailLabels = [
  { id: "enquiry", name: "Enquiry", color: "bg-blue-500" },
  { id: "quote", name: "Quote", color: "bg-green-500" },
  { id: "payment", name: "Payment", color: "bg-amber-500" },
  { id: "feedback", name: "Feedback", color: "bg-purple-500" },
  { id: "completed", name: "Completed", color: "bg-green-700" },
  { id: "active", name: "Active", color: "bg-blue-700" },
  { id: "new", name: "New", color: "bg-pink-500" },
  { id: "upsell", name: "Upsell Opportunity", color: "bg-indigo-500" }
];

export default function CompanyEmailMessaging() {
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [composeMode, setComposeMode] = useState(false);
  const [replyMode, setReplyMode] = useState(false);
  const [activeTab, setActiveTab] = useState("inbox");
  
  const filteredEmails = emails.filter(email => 
    email.subject.toLowerCase().includes(searchQuery.toLowerCase()) || 
    email.from.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    email.preview.toLowerCase().includes(searchQuery.toLowerCase()) ||
    email.from.enquiryId.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const getLabelColor = (labelId: string) => {
    return emailLabels.find(label => label.id === labelId)?.color || "bg-gray-500";
  };
  
  const handleNewEmail = () => {
    setSelectedEmail(null);
    setComposeMode(true);
    setReplyMode(false);
  };
  
  const handleReplyEmail = () => {
    setComposeMode(false);
    setReplyMode(true);
  };
  
  const handleCloseCompose = () => {
    setComposeMode(false);
    setReplyMode(false);
  };
  
  return (
    <div className="flex h-full flex-col">
      <div className="border-b">
        <div className="flex items-center p-4">
          <h1 className="text-xl font-semibold">Customer Email Communications</h1>
          <Button variant="ghost" size="icon" className="ml-auto">
            <RefreshCw className="h-4 w-4" />
            <span className="sr-only">Refresh</span>
          </Button>
        </div>
      </div>
      <div className="grid h-full grid-cols-12 overflow-auto">
        {/* Email List Sidebar */}
        <div className="col-span-3 border-r h-full flex flex-col">
          <div className="p-3 border-b">
            <Button className="w-full mb-3" onClick={handleNewEmail}>
              <Mail className="h-4 w-4 mr-2" />
              Compose New Email
            </Button>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search emails..."
                className="pl-8 rounded-md"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <Tabs 
            defaultValue="inbox" 
            className="w-full" 
            onValueChange={(value) => setActiveTab(value)}
          >
            <div className="px-4 pt-2">
              <TabsList className="w-full">
                <TabsTrigger value="inbox" className="flex-1">Inbox</TabsTrigger>
                <TabsTrigger value="sent" className="flex-1">Sent</TabsTrigger>
                <TabsTrigger value="drafts" className="flex-1">Drafts</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="inbox" className="m-0">
              <ScrollArea className="h-[calc(100vh-14rem)]">
                <div className="divide-y">
                  {filteredEmails.map((email) => (
                    <div
                      key={email.id}
                      className={`hover:bg-secondary/50 p-3 cursor-pointer ${
                        selectedEmail === email.id ? "bg-secondary/50" : ""
                      } ${!email.read ? "bg-primary-foreground/40" : ""}`}
                      onClick={() => {
                        setSelectedEmail(email.id);
                        setComposeMode(false);
                        setReplyMode(false);
                      }}
                    >
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-8 w-8 text-white bg-primary flex items-center justify-center text-sm">
                          <span>{email.from.avatar}</span>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className={`truncate text-sm ${!email.read ? "font-semibold" : ""}`}>
                              {email.from.name}
                            </p>
                            <p className="text-xs text-muted-foreground">{email.date}</p>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {email.labels.map((label) => (
                              <div 
                                key={label} 
                                className={`${getLabelColor(label)} px-1.5 py-0.5 rounded-sm text-white text-xs`}
                              >
                                {emailLabels.find(l => l.id === label)?.name}
                              </div>
                            ))}
                          </div>
                          <p className="truncate text-sm font-medium mt-1">{email.subject}</p>
                          <div className="flex items-center text-xs text-muted-foreground mt-0.5">
                            <span className="font-medium">{email.from.enquiryId}</span>
                            <span className="mx-1">•</span>
                            <p className="truncate">{email.preview}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex mt-1 text-muted-foreground">
                        {email.hasAttachment && <Paperclip className="h-3.5 w-3.5 mr-1" />}
                        {email.starred && <Star className="h-3.5 w-3.5 ml-1 text-amber-500 fill-amber-500" />}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="sent" className="h-full flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <Mail className="h-10 w-10 mx-auto mb-2" />
                <p>Your sent emails will appear here</p>
              </div>
            </TabsContent>
            
            <TabsContent value="drafts" className="h-full flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <Mail className="h-10 w-10 mx-auto mb-2" />
                <p>Your draft emails will be saved here</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Email Content Area */}
        <div className="col-span-9 h-full flex flex-col">
          {composeMode ? (
            <div className="flex flex-col h-full p-4 space-y-4">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-medium">Compose New Email</h2>
                <Button variant="ghost" size="icon" onClick={handleCloseCompose}>
                  <Trash className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </Button>
              </div>
              
              <div className="space-y-4 flex-1">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium w-20">To:</span>
                  <Input placeholder="Enter recipient email" />
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium w-20">Subject:</span>
                  <Input placeholder="Email subject" />
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium w-20">Template:</span>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a template" />
                    </SelectTrigger>
                    <SelectContent>
                      {emailTemplates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex-1">
                  <textarea
                    className="w-full h-[calc(100%-2rem)] resize-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Compose your email here..."
                  />
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Paperclip className="h-4 w-4 mr-2" />
                      Attach
                    </Button>
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4 mr-2" />
                      Save as Template
                    </Button>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button variant="outline">Save as Draft</Button>
                    <Button>
                      <Send className="h-4 w-4 mr-2" />
                      Send Email
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : replyMode ? (
            <div className="flex flex-col h-full">
              <div className="p-2 border-b flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => setReplyMode(false)}>
                  <ChevronRight className="h-4 w-4 -rotate-180" />
                  <span className="sr-only">Back</span>
                </Button>
                <span className="font-medium">
                  Reply to: {emails.find(e => e.id === selectedEmail)?.subject}
                </span>
              </div>
              
              <div className="p-4 flex-1 flex flex-col space-y-4">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-sm font-medium w-20">To:</span>
                  <div className="flex-1 flex items-center space-x-2 border rounded-md px-3 py-1.5">
                    <Avatar className="h-6 w-6 text-white bg-primary flex items-center justify-center text-xs">
                      <span>{emails.find(e => e.id === selectedEmail)?.from.avatar}</span>
                    </Avatar>
                    <span className="text-sm">{emails.find(e => e.id === selectedEmail)?.from.name} &lt;{emails.find(e => e.id === selectedEmail)?.from.email}&gt;</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium w-20">Subject:</span>
                  <Input 
                    defaultValue={`Re: ${emails.find(e => e.id === selectedEmail)?.subject}`} 
                    className="flex-1"
                  />
                </div>
                
                <div className="flex-1">
                  <textarea
                    className="w-full h-[calc(100%-2rem)] resize-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Type your reply here..."
                    defaultValue={`\n\n\n-------- Original Message --------\nFrom: ${emails.find(e => e.id === selectedEmail)?.from.name}\nDate: ${emails.find(e => e.id === selectedEmail)?.date}\nSubject: ${emails.find(e => e.id === selectedEmail)?.subject}\n\n${emails.find(e => e.id === selectedEmail)?.preview}`}
                  />
                </div>
                
                <div className="flex justify-between items-center">
                  <Button variant="outline" size="sm">
                    <Paperclip className="h-4 w-4 mr-2" />
                    Attach
                  </Button>
                  
                  <div className="flex items-center space-x-2">
                    <Button variant="outline">Save as Draft</Button>
                    <Button>
                      <Send className="h-4 w-4 mr-2" />
                      Send Reply
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : selectedEmail ? (
            <>
              {/* Email toolbar */}
              <div className="p-2 border-b flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Archive className="h-4 w-4" />
                  <span className="sr-only">Archive</span>
                </Button>
                <Button variant="ghost" size="icon">
                  <Trash className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>
                <Button variant="ghost" size="icon">
                  <Tag className="h-4 w-4" />
                  <span className="sr-only">Tag</span>
                </Button>
                <Separator orientation="vertical" className="h-6" />
                <Button variant="ghost" size="icon">
                  <Star className="h-4 w-4" />
                  <span className="sr-only">Star</span>
                </Button>
                <div className="ml-auto">
                  <Button onClick={handleReplyEmail}>
                    Reply
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">More options</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Forward</DropdownMenuItem>
                      <DropdownMenuItem>Print</DropdownMenuItem>
                      <DropdownMenuItem>Mark as unread</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Add to enquiry</DropdownMenuItem>
                      <DropdownMenuItem>View customer profile</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              
              {/* Email content */}
              <ScrollArea className="flex-1">
                <div className="p-6">
                  {/* Email header */}
                  <div className="mb-6">
                    <div className="flex flex-wrap gap-2 mb-2">
                      {emails.find(e => e.id === selectedEmail)?.labels.map((label) => (
                        <div 
                          key={label} 
                          className={`${getLabelColor(label)} px-2 py-1 rounded text-white text-xs font-medium`}
                        >
                          {emailLabels.find(l => l.id === label)?.name}
                        </div>
                      ))}
                    </div>
                    
                    <h2 className="text-xl font-semibold mb-2">
                      {emails.find(e => e.id === selectedEmail)?.subject}
                    </h2>
                    
                    <div className="bg-muted/50 p-3 rounded-md mb-4">
                      <div className="flex items-center">
                        <Badge variant="outline" className="mr-2">
                          Enquiry ID: {emails.find(e => e.id === selectedEmail)?.from.enquiryId}
                        </Badge>
                        <Button variant="outline" size="sm" className="h-7">
                          <ChevronRight className="h-4 w-4 mr-1" />
                          View Enquiry
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-start mt-4">
                      <Avatar className="h-10 w-10 text-white bg-primary flex items-center justify-center text-sm mr-4">
                        <span>{emails.find(e => e.id === selectedEmail)?.from.avatar}</span>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">
                              {emails.find(e => e.id === selectedEmail)?.from.name}
                            </p>
                            <p className="text-muted-foreground text-sm">
                              &lt;{emails.find(e => e.id === selectedEmail)?.from.email}&gt;
                            </p>
                          </div>
                          <div className="flex items-center">
                            <span className="text-sm text-muted-foreground mr-2">{emails.find(e => e.id === selectedEmail)?.date}</span>
                            <Button variant="ghost" size="sm">
                              <User className="h-4 w-4 mr-1" />
                              Profile
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Email body */}
                  <div className="prose max-w-none">
                    <p>Hello,</p>
                    <p>
                      {emails.find(e => e.id === selectedEmail)?.preview}
                    </p>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl.
                    </p>
                    <p>Best regards,</p>
                    <p>{emails.find(e => e.id === selectedEmail)?.from.name}</p>
                    <p className="text-sm text-muted-foreground">{emails.find(e => e.id === selectedEmail)?.from.email}</p>
                    <p className="text-sm text-muted-foreground">Phone: (555) 123-4567</p>
                  </div>
                  
                  {/* Attachments */}
                  {emails.find(e => e.id === selectedEmail)?.hasAttachment && (
                    <div className="mt-6 border rounded-md p-4">
                      <h3 className="text-sm font-medium mb-2 flex items-center">
                        <Paperclip className="h-4 w-4 mr-2" />
                        Attachments (1)
                      </h3>
                      <div className="flex items-center p-2 hover:bg-secondary/50 rounded-md">
                        <div className="w-10 h-10 bg-secondary rounded flex items-center justify-center mr-3">
                          <Calendar className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Requirements.pdf</p>
                          <p className="text-xs text-muted-foreground">1.2 MB</p>
                        </div>
                        <Button variant="ghost" size="sm" className="ml-auto">
                          Download
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {/* Quick actions */}
                  <div className="mt-6 flex items-center justify-end space-x-2 pt-4 border-t">
                    <Button variant="outline" onClick={handleReplyEmail}>
                      Reply
                    </Button>
                    <Button>
                      Add to Enquiry
                    </Button>
                  </div>
                </div>
              </ScrollArea>
            </>
          ) : (
            <div className="h-full flex items-center justify-center flex-col p-6 text-center">
              <Mail className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">Select an email to view</h3>
              <p className="text-muted-foreground">
                Choose an email from the list or compose a new message
              </p>
              <Button className="mt-4" onClick={handleNewEmail}>
                <Mail className="h-4 w-4 mr-2" />
                Compose New Email
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 