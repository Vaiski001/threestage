import { useState } from "react";
import { MessageCircle, Phone, Video, Paperclip, Smile, Send, Search, MoreHorizontal, User, Info, Image, File, Map, Calendar, Clock } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Mock data for chat conversations
const conversations = [
  {
    id: "1",
    customer: {
      name: "John Doe",
      avatar: "JD",
      isOnline: true,
      lastSeen: "Just now",
      email: "john.doe@example.com",
      phone: "+1 (555) 123-4567"
    },
    enquiryId: "ENQ-001",
    enquiryType: "Kitchen Renovation",
    lastMessage: {
      text: "Thanks for the quick response. I can schedule a consultation for Tuesday at 10:00 AM.",
      time: "10:42 AM",
      isRead: true,
      isFromCustomer: true
    },
    unreadCount: 0,
    status: "active"
  },
  {
    id: "2",
    customer: {
      name: "Sarah Smith",
      avatar: "SS",
      isOnline: false,
      lastSeen: "1 hour ago",
      email: "sarah.smith@example.com",
      phone: "+1 (555) 234-5678"
    },
    enquiryId: "ENQ-002",
    enquiryType: "Bathroom Remodel",
    lastMessage: {
      text: "Do you have any examples of similar bathroom remodels you've done recently?",
      time: "Yesterday",
      isRead: false,
      isFromCustomer: true
    },
    unreadCount: 2,
    status: "active"
  },
  {
    id: "3",
    customer: {
      name: "Michael Johnson",
      avatar: "MJ",
      isOnline: false,
      lastSeen: "3 hours ago",
      email: "michael.j@example.com",
      phone: "+1 (555) 345-6789"
    },
    enquiryId: "ENQ-003",
    enquiryType: "Deck Construction",
    lastMessage: {
      text: "We'll send over the updated estimate with the wood options we discussed.",
      time: "Wed",
      isRead: true,
      isFromCustomer: false
    },
    unreadCount: 0,
    status: "active"
  },
  {
    id: "4",
    customer: {
      name: "Emily Wilson",
      avatar: "EW",
      isOnline: true,
      lastSeen: "Just now",
      email: "emily.w@example.com",
      phone: "+1 (555) 456-7890"
    },
    enquiryId: "ENQ-004",
    enquiryType: "Fence Installation",
    lastMessage: {
      text: "That timeline works perfectly for me. Let's proceed with the plan.",
      time: "Mon",
      isRead: true,
      isFromCustomer: true
    },
    unreadCount: 0,
    status: "active"
  },
  {
    id: "5",
    customer: {
      name: "David Brown",
      avatar: "DB",
      isOnline: false,
      lastSeen: "2 days ago",
      email: "david.b@example.com",
      phone: "+1 (555) 567-8901"
    },
    enquiryId: "ENQ-005",
    enquiryType: "Flooring Installation",
    lastMessage: {
      text: "The installation is complete. Please let us know if you have any questions about maintenance.",
      time: "Jan 10",
      isRead: true,
      isFromCustomer: false
    },
    unreadCount: 0,
    status: "completed"
  }
];

// Mock data for a chat thread
const messages = [
  {
    id: "msg1",
    sender: "company",
    text: "Hello John! Thank you for your interest in our kitchen renovation services. How can we help you today?",
    time: "10:30 AM",
    date: "Today"
  },
  {
    id: "msg2",
    sender: "customer",
    text: "Hi, I'm looking to renovate my kitchen and would like to get an estimate. It's about 200 sq ft.",
    time: "10:32 AM",
    date: "Today"
  },
  {
    id: "msg3",
    sender: "company",
    text: "Great! We'd be happy to provide an estimate. Could you share some details about what you're looking for? Are you interested in new cabinets, countertops, appliances, or a complete remodel?",
    time: "10:35 AM",
    date: "Today"
  },
  {
    id: "msg4",
    sender: "customer",
    text: "I'm looking for a complete remodel - new cabinets, countertops, flooring, and relocating some appliances.",
    time: "10:38 AM",
    date: "Today"
  },
  {
    id: "msg5",
    sender: "company",
    text: "Thank you for the details. For a project of this scope, we'd recommend scheduling an in-home consultation so we can take measurements and discuss your vision in person. Would you be available for a consultation next week?",
    time: "10:40 AM",
    date: "Today"
  },
  {
    id: "msg6",
    sender: "customer",
    text: "Yes, that sounds good. What days are available?",
    time: "10:41 AM",
    date: "Today"
  },
  {
    id: "msg7",
    sender: "company",
    text: "We have availability on Tuesday at 10:00 AM, Wednesday at 2:00 PM, or Thursday at 11:30 AM. Would any of those times work for you?",
    time: "10:41 AM",
    date: "Today"
  },
  {
    id: "msg8",
    sender: "customer",
    text: "Thanks for the quick response. I can schedule a consultation for Tuesday at 10:00 AM.",
    time: "10:42 AM",
    date: "Today"
  }
];

// Quick reply templates
const quickReplies = [
  "Thanks for reaching out! How can I help you today?",
  "We have availability for consultations next week. Would you like to schedule one?",
  "I'll need to check with our team and get back to you shortly.",
  "Could you provide more details about your project?",
  "We've added this information to your enquiry. Is there anything else you need?"
];

export default function CompanyChatMessaging() {
  const [selectedChat, setSelectedChat] = useState<string | null>("1"); // Default to first chat
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  
  const filteredConversations = conversations.filter(conversation => {
    const matchesSearch = 
      conversation.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conversation.enquiryId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conversation.enquiryType.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "active") return conversation.status === "active" && matchesSearch;
    if (activeTab === "completed") return conversation.status === "completed" && matchesSearch;
    if (activeTab === "unread") return conversation.unreadCount > 0 && matchesSearch;
    
    return matchesSearch;
  });
  
  const sendMessage = () => {
    if (newMessage.trim() === "") return;
    // In a real app, you would send this message to your backend
    // For this mock-up, we're just clearing the input
    setNewMessage("");
  };

  return (
    <div className="flex h-full flex-col">
      <div className="border-b">
        <div className="flex items-center p-4">
          <h1 className="text-xl font-semibold">Customer Chat Communications</h1>
        </div>
      </div>
      <div className="grid h-full grid-cols-12 overflow-auto">
        {/* Chat list sidebar */}
        <div className="col-span-3 border-r h-full flex flex-col">
          <div className="p-3 border-b">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
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
                <TabsTrigger value="active" className="flex-1">Active</TabsTrigger>
                <TabsTrigger value="unread" className="flex-1">Unread</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="all" className="m-0">
              <ScrollArea className="h-[calc(100vh-14rem)]">
                <div className="divide-y">
                  {filteredConversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      className={`hover:bg-secondary/50 p-3 cursor-pointer ${
                        selectedChat === conversation.id ? "bg-secondary/50" : ""
                      }`}
                      onClick={() => setSelectedChat(conversation.id)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <Avatar className="h-10 w-10 text-white bg-primary flex items-center justify-center">
                            <span>{conversation.customer.avatar}</span>
                          </Avatar>
                          {conversation.customer.isOnline && (
                            <span className="absolute right-0 bottom-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full"></span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-medium truncate">{conversation.customer.name}</p>
                            <p className="text-xs text-muted-foreground">{conversation.lastMessage.time}</p>
                          </div>
                          <div className="flex items-center gap-1 mt-0.5">
                            <Badge variant="outline" className="text-xs">
                              {conversation.enquiryId}
                            </Badge>
                            <span className="text-xs text-muted-foreground truncate">
                              {conversation.enquiryType}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <p className="text-sm text-muted-foreground truncate mr-2">
                              {conversation.lastMessage.isFromCustomer ? "" : "You: "}
                              {conversation.lastMessage.text}
                            </p>
                            {conversation.unreadCount > 0 && (
                              <Badge variant="default" className="h-5 w-5 rounded-full p-0 flex items-center justify-center">
                                {conversation.unreadCount}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="active" className="m-0">
              <ScrollArea className="h-[calc(100vh-14rem)]">
                <div className="divide-y">
                  {filteredConversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      className={`hover:bg-secondary/50 p-3 cursor-pointer ${
                        selectedChat === conversation.id ? "bg-secondary/50" : ""
                      }`}
                      onClick={() => setSelectedChat(conversation.id)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <Avatar className="h-10 w-10 text-white bg-primary flex items-center justify-center">
                            <span>{conversation.customer.avatar}</span>
                          </Avatar>
                          {conversation.customer.isOnline && (
                            <span className="absolute right-0 bottom-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full"></span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-medium truncate">{conversation.customer.name}</p>
                            <p className="text-xs text-muted-foreground">{conversation.lastMessage.time}</p>
                          </div>
                          <div className="flex items-center gap-1 mt-0.5">
                            <Badge variant="outline" className="text-xs">
                              {conversation.enquiryId}
                            </Badge>
                            <span className="text-xs text-muted-foreground truncate">
                              {conversation.enquiryType}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <p className="text-sm text-muted-foreground truncate mr-2">
                              {conversation.lastMessage.isFromCustomer ? "" : "You: "}
                              {conversation.lastMessage.text}
                            </p>
                            {conversation.unreadCount > 0 && (
                              <Badge variant="default" className="h-5 w-5 rounded-full p-0 flex items-center justify-center">
                                {conversation.unreadCount}
                              </Badge>
                            )}
                          </div>
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
                  {filteredConversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      className={`hover:bg-secondary/50 p-3 cursor-pointer ${
                        selectedChat === conversation.id ? "bg-secondary/50" : ""
                      }`}
                      onClick={() => setSelectedChat(conversation.id)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <Avatar className="h-10 w-10 text-white bg-primary flex items-center justify-center">
                            <span>{conversation.customer.avatar}</span>
                          </Avatar>
                          {conversation.customer.isOnline && (
                            <span className="absolute right-0 bottom-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full"></span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-medium truncate">{conversation.customer.name}</p>
                            <p className="text-xs text-muted-foreground">{conversation.lastMessage.time}</p>
                          </div>
                          <div className="flex items-center gap-1 mt-0.5">
                            <Badge variant="outline" className="text-xs">
                              {conversation.enquiryId}
                            </Badge>
                            <span className="text-xs text-muted-foreground truncate">
                              {conversation.enquiryType}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <p className="text-sm text-muted-foreground truncate mr-2">
                              {conversation.lastMessage.isFromCustomer ? "" : "You: "}
                              {conversation.lastMessage.text}
                            </p>
                            <Badge variant="default" className="h-5 w-5 rounded-full p-0 flex items-center justify-center">
                              {conversation.unreadCount}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Chat content area */}
        <div className="col-span-9 h-full flex flex-col">
          {selectedChat ? (
            <>
              {/* Chat header */}
              <div className="border-b p-3 flex items-center">
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 text-white bg-primary flex items-center justify-center mr-3">
                    <span>{conversations.find(c => c.id === selectedChat)?.customer.avatar}</span>
                  </Avatar>
                  <div>
                    <p className="font-medium">
                      {conversations.find(c => c.id === selectedChat)?.customer.name}
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {conversations.find(c => c.id === selectedChat)?.enquiryId}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {conversations.find(c => c.id === selectedChat)?.enquiryType}
                      </span>
                      <p className="text-xs text-muted-foreground">
                        {conversations.find(c => c.id === selectedChat)?.customer.isOnline 
                          ? "Online" 
                          : `Last seen ${conversations.find(c => c.id === selectedChat)?.customer.lastSeen}`}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="ml-auto flex items-center gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Phone className="h-5 w-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Call Customer</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Calendar className="h-5 w-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Schedule Appointment</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <User className="h-5 w-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>View Customer Profile</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View enquiry details</DropdownMenuItem>
                      <DropdownMenuItem>Export conversation</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Mark as completed</DropdownMenuItem>
                      <DropdownMenuItem>Transfer to another agent</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              
              {/* Customer info panel */}
              <div className="p-2 bg-muted/30 border-b flex items-center justify-between text-sm">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{conversations.find(c => c.id === selectedChat)?.customer.email}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{conversations.find(c => c.id === selectedChat)?.customer.phone}</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="h-7">
                  View Full Enquiry
                </Button>
              </div>
              
              {/* Chat messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message, index) => {
                    // Check if we should show the date header
                    const showDateHeader = index === 0 || messages[index - 1].date !== message.date;
                    
                    return (
                      <div key={message.id}>
                        {showDateHeader && (
                          <div className="flex justify-center my-4">
                            <Badge variant="outline" className="bg-background">
                              {message.date}
                            </Badge>
                          </div>
                        )}
                        <div
                          className={`flex ${message.sender === "customer" ? "justify-start" : "justify-end"}`}
                        >
                          {message.sender === "customer" && (
                            <Avatar className="h-8 w-8 text-white bg-primary flex items-center justify-center mr-2 self-end">
                              <span>{conversations.find(c => c.id === selectedChat)?.customer.avatar}</span>
                            </Avatar>
                          )}
                          <div
                            className={`max-w-[70%] rounded-lg p-3 ${
                              message.sender === "customer"
                                ? "bg-secondary"
                                : "bg-primary text-primary-foreground"
                            }`}
                          >
                            <p className="text-sm">{message.text}</p>
                            <p className={`text-xs mt-1 ${
                              message.sender === "customer" ? "text-muted-foreground" : "text-primary-foreground/70"
                            }`}>
                              {message.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
              
              {/* Quick replies */}
              <div className="border-t p-1.5 flex items-center overflow-x-auto">
                {quickReplies.map((reply, index) => (
                  <Button 
                    key={index} 
                    variant="outline" 
                    size="sm" 
                    className="text-xs whitespace-nowrap mr-1.5"
                    onClick={() => setNewMessage(reply)}
                  >
                    {reply.length > 40 ? reply.substring(0, 37) + '...' : reply}
                  </Button>
                ))}
              </div>
              
              {/* Chat input */}
              <div className="border-t p-3">
                <div className="flex items-center space-x-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Paperclip className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuItem>
                        <Image className="h-4 w-4 mr-2" />
                        <span>Photo or Video</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <File className="h-4 w-4 mr-2" />
                        <span>Document</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Map className="h-4 w-4 mr-2" />
                        <span>Location</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>Appointment</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  
                  <Input
                    placeholder="Type a message..."
                    className="flex-1"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        sendMessage();
                      }
                    }}
                  />
                  
                  <Button variant="ghost" size="icon">
                    <Smile className="h-5 w-5" />
                  </Button>
                  
                  <Button onClick={sendMessage}>
                    <Send className="h-4 w-4 mr-2" />
                    Send
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center flex-col p-6 text-center">
              <MessageCircle className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">Select a conversation</h3>
              <p className="text-muted-foreground">
                Choose a conversation from the list to start chatting with a customer
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 