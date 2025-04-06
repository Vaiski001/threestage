import { useState } from "react";
import { Search, Inbox, MessageCircle, Mail, Filter, Bell, MoreHorizontal, Check, Star, ChevronRight, File, Clock } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";

// Mock data for inbox messages
const messages = [
  {
    id: "1",
    type: "email",
    read: false,
    starred: false,
    from: {
      name: "Acme Construction",
      avatar: "A"
    },
    subject: "Your Enquiry #12345 - Quote Available",
    preview: "Thank you for your enquiry. We've prepared a detailed quote for your project...",
    date: "Today, 10:30 AM",
    hasAttachment: true
  },
  {
    id: "2",
    type: "chat",
    read: true,
    starred: true,
    from: {
      name: "BuildRight Solutions",
      avatar: "B"
    },
    subject: "New chat message",
    preview: "I've sent you the updated quote with the modifications you requested.",
    date: "Yesterday, 4:15 PM",
    hasAttachment: false
  },
  {
    id: "3",
    type: "notification",
    read: false,
    starred: false,
    from: {
      name: "Enquiry System",
      avatar: "E"
    },
    subject: "Enquiry Status Updated",
    preview: "Your enquiry #12345 with Acme Construction has been updated to 'In Progress'",
    date: "Yesterday, 2:30 PM",
    hasAttachment: false
  },
  {
    id: "4",
    type: "email",
    read: true,
    starred: false,
    from: {
      name: "Elite Renovations",
      avatar: "E"
    },
    subject: "Follow-up on Your Home Remodel",
    preview: "I wanted to follow up on our conversation about your kitchen remodel project...",
    date: "Jan 15, 2024",
    hasAttachment: true
  },
  {
    id: "5",
    type: "notification",
    read: true,
    starred: false,
    from: {
      name: "Horizon Landscaping",
      avatar: "H"
    },
    subject: "New Form Available",
    preview: "Horizon Landscaping has shared a new form with you: 'Garden Design Preferences'",
    date: "Jan 12, 2024",
    hasAttachment: false
  }
];

export default function CustomerInboxMessaging() {
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter messages based on active tab and search query
  const filteredMessages = messages.filter(message => {
    const matchesSearch = 
      message.subject.toLowerCase().includes(searchQuery.toLowerCase()) || 
      message.from.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.preview.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "unread") return !message.read && matchesSearch;
    if (activeTab === "starred") return message.starred && matchesSearch;
    return message.type === activeTab && matchesSearch;
  });
  
  const getMessageIcon = (type: string) => {
    switch (type) {
      case "email":
        return <Mail className="h-4 w-4" />;
      case "chat":
        return <MessageCircle className="h-4 w-4" />;
      case "notification":
        return <Bell className="h-4 w-4" />;
      default:
        return <Inbox className="h-4 w-4" />;
    }
  };
  
  const getMessageTypeLabel = (type: string) => {
    switch (type) {
      case "email":
        return "Email";
      case "chat":
        return "Chat";
      case "notification":
        return "Notification";
      default:
        return "Message";
    }
  };
  
  return (
    <div className="flex h-full flex-col">
      <div className="border-b">
        <div className="flex items-center p-4">
          <h1 className="text-xl font-semibold">Unified Inbox</h1>
          <div className="ml-auto flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Filter Messages</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem checked={true}>
                  Show Read
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked={true}>
                  Show Unread
                </DropdownMenuCheckboxItem>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem checked={true}>
                  Emails
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked={true}>
                  Chat Messages
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked={true}>
                  Notifications
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" size="sm">
              <Clock className="h-4 w-4 mr-2" />
              Latest
            </Button>
          </div>
        </div>
      </div>
      <div className="grid h-full grid-cols-12 overflow-auto">
        {/* Message list sidebar */}
        <div className="col-span-4 border-r h-full flex flex-col">
          <div className="p-3 border-b">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search messages..."
                className="pl-8 rounded-md"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <Tabs 
            defaultValue="all" 
            className="w-full"
            onValueChange={(value) => setActiveTab(value)}
          >
            <div className="px-4 pt-2">
              <TabsList className="w-full">
                <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
                <TabsTrigger value="unread" className="flex-1">Unread</TabsTrigger>
                <TabsTrigger value="starred" className="flex-1">Starred</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="all" className="m-0 p-0">
              <ScrollArea className="h-[calc(100vh-14rem)]">
                <div className="divide-y">
                  {filteredMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`hover:bg-secondary/50 p-3 cursor-pointer ${
                        selectedMessage === message.id ? "bg-secondary/50" : ""
                      } ${!message.read ? "bg-primary-foreground/40" : ""}`}
                      onClick={() => setSelectedMessage(message.id)}
                    >
                      <div className="flex items-center">
                        <div className="flex-shrink-0 mr-3">
                          <Avatar className="h-10 w-10 text-white bg-primary flex items-center justify-center">
                            <span>{message.from.avatar}</span>
                          </Avatar>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className={`truncate text-sm ${!message.read ? "font-semibold" : ""}`}>
                              {message.from.name}
                            </p>
                            <p className="text-xs text-muted-foreground whitespace-nowrap ml-2">{message.date}</p>
                          </div>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Badge variant="outline" className="mr-2 px-1.5 rounded-sm">
                              <div className="flex items-center">
                                {getMessageIcon(message.type)}
                                <span className="ml-1">{getMessageTypeLabel(message.type)}</span>
                              </div>
                            </Badge>
                            {message.starred && <Star className="h-3 w-3 text-amber-500 fill-amber-500 mr-1" />}
                          </div>
                          <p className="truncate text-sm font-medium">{message.subject}</p>
                          <p className="truncate text-xs text-muted-foreground">{message.preview}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="unread" className="m-0">
              <ScrollArea className="h-[calc(100vh-14rem)]">
                <div className="divide-y">
                  {filteredMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`hover:bg-secondary/50 p-3 cursor-pointer ${
                        selectedMessage === message.id ? "bg-secondary/50" : ""
                      } ${!message.read ? "bg-primary-foreground/40" : ""}`}
                      onClick={() => setSelectedMessage(message.id)}
                    >
                      <div className="flex items-center">
                        <div className="flex-shrink-0 mr-3">
                          <Avatar className="h-10 w-10 text-white bg-primary flex items-center justify-center">
                            <span>{message.from.avatar}</span>
                          </Avatar>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className={`truncate text-sm ${!message.read ? "font-semibold" : ""}`}>
                              {message.from.name}
                            </p>
                            <p className="text-xs text-muted-foreground whitespace-nowrap ml-2">{message.date}</p>
                          </div>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Badge variant="outline" className="mr-2 px-1.5 rounded-sm">
                              <div className="flex items-center">
                                {getMessageIcon(message.type)}
                                <span className="ml-1">{getMessageTypeLabel(message.type)}</span>
                              </div>
                            </Badge>
                            {message.starred && <Star className="h-3 w-3 text-amber-500 fill-amber-500 mr-1" />}
                          </div>
                          <p className="truncate text-sm font-medium">{message.subject}</p>
                          <p className="truncate text-xs text-muted-foreground">{message.preview}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="starred" className="m-0">
              <ScrollArea className="h-[calc(100vh-14rem)]">
                <div className="divide-y">
                  {filteredMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`hover:bg-secondary/50 p-3 cursor-pointer ${
                        selectedMessage === message.id ? "bg-secondary/50" : ""
                      } ${!message.read ? "bg-primary-foreground/40" : ""}`}
                      onClick={() => setSelectedMessage(message.id)}
                    >
                      <div className="flex items-center">
                        <div className="flex-shrink-0 mr-3">
                          <Avatar className="h-10 w-10 text-white bg-primary flex items-center justify-center">
                            <span>{message.from.avatar}</span>
                          </Avatar>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className={`truncate text-sm ${!message.read ? "font-semibold" : ""}`}>
                              {message.from.name}
                            </p>
                            <p className="text-xs text-muted-foreground whitespace-nowrap ml-2">{message.date}</p>
                          </div>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Badge variant="outline" className="mr-2 px-1.5 rounded-sm">
                              <div className="flex items-center">
                                {getMessageIcon(message.type)}
                                <span className="ml-1">{getMessageTypeLabel(message.type)}</span>
                              </div>
                            </Badge>
                            {message.starred && <Star className="h-3 w-3 text-amber-500 fill-amber-500 mr-1" />}
                          </div>
                          <p className="truncate text-sm font-medium">{message.subject}</p>
                          <p className="truncate text-xs text-muted-foreground">{message.preview}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Message content area */}
        <div className="col-span-8 h-full flex flex-col">
          {selectedMessage ? (
            <>
              {/* Message toolbar */}
              <div className="p-2 border-b flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Check className="h-4 w-4" />
                  <span className="sr-only">Mark as read</span>
                </Button>
                <Button variant="ghost" size="icon">
                  <Star className="h-4 w-4" />
                  <span className="sr-only">Star</span>
                </Button>
                <Separator orientation="vertical" className="h-6" />
                
                <div className="ml-auto flex items-center gap-2">
                  {/* Show different action buttons based on message type */}
                  {messages.find(m => m.id === selectedMessage)?.type === "email" && (
                    <Button variant="outline" size="sm">
                      Reply
                    </Button>
                  )}
                  {messages.find(m => m.id === selectedMessage)?.type === "chat" && (
                    <Button variant="outline" size="sm">
                      Open Chat
                    </Button>
                  )}
                  {messages.find(m => m.id === selectedMessage)?.type === "notification" && (
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  )}
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
                      <DropdownMenuItem>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              
              {/* Message content */}
              <ScrollArea className="flex-1">
                <div className="p-6">
                  {/* Message header */}
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">
                      {messages.find(m => m.id === selectedMessage)?.subject}
                    </h2>
                    <div className="flex items-start mt-4">
                      <Avatar className="h-10 w-10 text-white bg-primary flex items-center justify-center text-sm mr-4">
                        <span>{messages.find(m => m.id === selectedMessage)?.from.avatar}</span>
                      </Avatar>
                      <div>
                        <div className="flex items-center">
                          <p className="font-medium">
                            {messages.find(m => m.id === selectedMessage)?.from.name}
                          </p>
                          <Badge variant="outline" className="ml-2 px-2 py-0 text-xs">
                            <div className="flex items-center">
                              {getMessageIcon(messages.find(m => m.id === selectedMessage)?.type || '')}
                              <span className="ml-1">{getMessageTypeLabel(messages.find(m => m.id === selectedMessage)?.type || '')}</span>
                            </div>
                          </Badge>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <span>{messages.find(m => m.id === selectedMessage)?.date}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Message body */}
                  <div className="prose max-w-none">
                    <p>
                      {messages.find(m => m.id === selectedMessage)?.preview}
                    </p>
                    <p>
                      {messages.find(m => m.id === selectedMessage)?.type === "email" && (
                        <>
                          Thank you for reaching out to us. We appreciate your interest in our services.
                          We would be happy to provide more information or schedule a consultation to discuss your project in detail.
                        </>
                      )}
                      
                      {messages.find(m => m.id === selectedMessage)?.type === "notification" && (
                        <>
                          This is an automated notification from the Enquiry Management System.
                          You can view the full details by clicking the "View Details" button above.
                        </>
                      )}
                      
                      {messages.find(m => m.id === selectedMessage)?.type === "chat" && (
                        <>
                          This is a preview of your chat conversation. To continue the discussion,
                          please click the "Open Chat" button to view the complete chat history and respond.
                        </>
                      )}
                    </p>
                    
                    {messages.find(m => m.id === selectedMessage)?.hasAttachment && (
                      <div className="mt-6 border rounded-md p-4">
                        <h3 className="text-sm font-medium mb-2">Attachments</h3>
                        <div className="flex items-center p-2 hover:bg-secondary/50 rounded-md">
                          <div className="w-10 h-10 bg-secondary rounded flex items-center justify-center mr-3">
                            <File className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Document.pdf</p>
                            <p className="text-xs text-muted-foreground">1.2 MB</p>
                          </div>
                          <Button variant="ghost" size="sm" className="ml-auto">
                            Download
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Call to action based on message type */}
                  <div className="mt-6 pt-6 border-t">
                    {messages.find(m => m.id === selectedMessage)?.type === "email" && (
                      <Button>
                        Reply to Email
                      </Button>
                    )}
                    
                    {messages.find(m => m.id === selectedMessage)?.type === "chat" && (
                      <Button>
                        Continue in Chat
                      </Button>
                    )}
                    
                    {messages.find(m => m.id === selectedMessage)?.type === "notification" && (
                      <Button>
                        <ChevronRight className="h-4 w-4 mr-2" />
                        Go to Enquiry
                      </Button>
                    )}
                  </div>
                </div>
              </ScrollArea>
            </>
          ) : (
            <div className="h-full flex items-center justify-center flex-col p-6 text-center">
              <Inbox className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">Select a message to view</h3>
              <p className="text-muted-foreground">
                Choose a message from the inbox to see its contents
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 