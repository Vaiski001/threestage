import { useState } from "react";
import { Mail, Search, Star, Trash, Filter, MoveDown, Calendar, Paperclip, Clock, MoreHorizontal, ChevronRight, RefreshCw, Archive } from "lucide-react";

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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock data for email messages
const emails = [
  {
    id: "1",
    read: true,
    starred: true,
    from: {
      name: "Acme Construction",
      email: "support@acmeconstruction.com",
      avatar: "A"
    },
    subject: "Your Enquiry #12345 - Quote Available",
    preview: "Thank you for your enquiry. We've prepared a detailed quote for your project...",
    date: "Today, 10:30 AM",
    hasAttachment: true
  },
  {
    id: "2",
    read: false,
    starred: false,
    from: {
      name: "BuildRight Solutions",
      email: "info@buildright.com",
      avatar: "B"
    },
    subject: "Response to Your Project Inquiry",
    preview: "We've reviewed your project requirements and would like to discuss the details...",
    date: "Yesterday, 4:15 PM",
    hasAttachment: false
  },
  {
    id: "3",
    read: true,
    starred: false,
    from: {
      name: "Elite Renovations",
      email: "projects@eliterenovations.com",
      avatar: "E"
    },
    subject: "Follow-up on Your Home Remodel",
    preview: "I wanted to follow up on our conversation about your kitchen remodel project...",
    date: "Jan 15, 2024",
    hasAttachment: true
  },
  {
    id: "4",
    read: true,
    starred: false,
    from: {
      name: "Horizon Landscaping",
      email: "contact@horizonlandscaping.com",
      avatar: "H"
    },
    subject: "Garden Design Proposal",
    preview: "Based on our site visit, we've created a comprehensive design proposal for your garden...",
    date: "Jan 12, 2024",
    hasAttachment: true
  },
  {
    id: "5",
    read: false,
    starred: false,
    from: {
      name: "City Plumbing Services",
      email: "scheduling@cityplumbing.com",
      avatar: "C"
    },
    subject: "Appointment Confirmation",
    preview: "This email confirms your plumbing inspection scheduled for Monday, January 22...",
    date: "Jan 10, 2024",
    hasAttachment: false
  }
];

export default function CustomerEmailMessaging() {
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredEmails = emails.filter(email => 
    email.subject.toLowerCase().includes(searchQuery.toLowerCase()) || 
    email.from.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-full flex-col">
      <div className="border-b">
        <div className="flex items-center p-4">
          <h1 className="text-xl font-semibold">Email Messages</h1>
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
          
          <Tabs defaultValue="inbox" className="w-full">
            <div className="px-4 pt-2">
              <TabsList className="w-full">
                <TabsTrigger value="inbox" className="flex-1">Inbox</TabsTrigger>
                <TabsTrigger value="sent" className="flex-1">Sent</TabsTrigger>
                <TabsTrigger value="archived" className="flex-1">Archived</TabsTrigger>
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
                      onClick={() => setSelectedEmail(email.id)}
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
                          <p className="truncate text-sm font-medium">{email.subject}</p>
                          <p className="truncate text-xs text-muted-foreground">{email.preview}</p>
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
                <p>No sent emails to display</p>
              </div>
            </TabsContent>
            
            <TabsContent value="archived" className="h-full flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <Archive className="h-10 w-10 mx-auto mb-2" />
                <p>No archived emails to display</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Email Content Area */}
        <div className="col-span-9 h-full flex flex-col">
          {selectedEmail ? (
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
                  <Clock className="h-4 w-4" />
                  <span className="sr-only">Snooze</span>
                </Button>
                <Separator orientation="vertical" className="h-6" />
                <Button variant="ghost" size="icon">
                  <Star className="h-4 w-4" />
                  <span className="sr-only">Star</span>
                </Button>
                <Button variant="ghost" size="icon">
                  <MoveDown className="h-4 w-4" />
                  <span className="sr-only">Move</span>
                </Button>
                <div className="ml-auto">
                  <Button variant="ghost" size="sm">
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
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              
              {/* Email content */}
              <ScrollArea className="flex-1">
                <div className="p-6">
                  {/* Email header */}
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">
                      {emails.find(e => e.id === selectedEmail)?.subject}
                    </h2>
                    <div className="flex items-start mt-4">
                      <Avatar className="h-10 w-10 text-white bg-primary flex items-center justify-center text-sm mr-4">
                        <span>{emails.find(e => e.id === selectedEmail)?.from.avatar}</span>
                      </Avatar>
                      <div>
                        <div className="flex items-center">
                          <p className="font-medium">
                            {emails.find(e => e.id === selectedEmail)?.from.name}
                          </p>
                          <span className="mx-2 text-muted-foreground">
                            &lt;{emails.find(e => e.id === selectedEmail)?.from.email}&gt;
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <span>To: me</span>
                          <span className="mx-2">|</span>
                          <span>{emails.find(e => e.id === selectedEmail)?.date}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Email body */}
                  <div className="prose max-w-none">
                    <p>Hello,</p>
                    <p>
                      Thank you for reaching out to us. We appreciate your interest in our services.
                    </p>
                    <p>
                      {emails.find(e => e.id === selectedEmail)?.preview} We would be happy to provide more
                      information or schedule a consultation to discuss your project in detail.
                    </p>
                    <p>
                      In the meantime, please feel free to browse our portfolio on our website or check out
                      customer testimonials to learn more about our past projects.
                    </p>
                    <p>
                      If you have any questions or need further clarification, please don't hesitate to reply
                      to this email or contact us directly via phone.
                    </p>
                    <p>Best regards,</p>
                    <p>Customer Support Team</p>
                    <p>{emails.find(e => e.id === selectedEmail)?.from.name}</p>
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
                          <p className="text-sm font-medium">Project_Proposal.pdf</p>
                          <p className="text-xs text-muted-foreground">1.2 MB</p>
                        </div>
                        <Button variant="ghost" size="sm" className="ml-auto">
                          Download
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </>
          ) : (
            <div className="h-full flex items-center justify-center flex-col p-6 text-center">
              <Mail className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">Select an email to view</h3>
              <p className="text-muted-foreground">
                Choose an email from the list to view its contents
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 